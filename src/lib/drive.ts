import "server-only";

/**
 * Backs up sold PDFs to the business Google Drive (free: uses your account's storage).
 *
 * Auth: OAuth refresh token of your own Google account, scope `drive.file`, so this
 * app can only see the files and folders it created itself, nothing else in your Drive.
 * Get the token once with `node scripts/google-drive-auth.mjs`.
 *
 * Files go to:  <GOOGLE_DRIVE_ROOT_FOLDER or "Patra Orders">/<YYYY-MM>/<date> <order id> <file>.pdf
 * Uploading is idempotent per payment (the payment id is stored on the file).
 */

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const API = "https://www.googleapis.com/drive/v3/files";
const UPLOAD = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id";
const FOLDER_MIME = "application/vnd.google-apps.folder";

export function driveConfigured() {
  return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN);
}

let token: { value: string; expires: number } | null = null;

async function accessToken(): Promise<string> {
  if (token && Date.now() < token.expires - 60_000) return token.value;
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN!,
      grant_type: "refresh_token",
    }),
  });
  const j = (await res.json().catch(() => ({}))) as { access_token?: string; expires_in?: number; error?: string };
  if (!res.ok || !j.access_token) throw new Error(`Google token refresh failed: ${j.error ?? res.status}`);
  token = { value: j.access_token, expires: Date.now() + (j.expires_in ?? 3600) * 1000 };
  return token.value;
}

async function api<T>(url: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { Authorization: `Bearer ${await accessToken()}`, ...(init.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`Google Drive ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return (await res.json()) as T;
}

const q = (s: string) => s.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

async function findOne(query: string): Promise<string | null> {
  const url = `${API}?${new URLSearchParams({ q: `${query} and trashed = false`, fields: "files(id)", pageSize: "1" })}`;
  const j = await api<{ files: { id: string }[] }>(url);
  return j.files[0]?.id ?? null;
}

const folderCache = new Map<string, string>();

async function folder(name: string, parent: string | null): Promise<string> {
  const key = `${parent ?? "root"}/${name}`;
  const cached = folderCache.get(key);
  if (cached) return cached;
  const where = `name = '${q(name)}' and mimeType = '${FOLDER_MIME}'` + (parent ? ` and '${parent}' in parents` : "");
  let id = await findOne(where);
  if (!id) {
    const created = await api<{ id: string }>(`${API}?fields=id`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, mimeType: FOLDER_MIME, ...(parent ? { parents: [parent] } : {}) }),
    });
    id = created.id;
  }
  folderCache.set(key, id);
  return id;
}

export interface BackupInfo {
  orderId: string;
  paymentId: string;
  paidAt: Date;
  filename: string;
  customerEmail?: string;
  templateName?: string;
  /** Extra searchable tags stored on the file (short values, e.g. hashes). */
  tags?: Record<string, string>;
}

/** Uploads one sold PDF. Skips if this payment was already backed up. Returns the file id. */
export async function backupPdfToDrive(pdf: Buffer, info: BackupInfo): Promise<string> {
  const existing = await findOne(`appProperties has { key='paymentId' and value='${q(info.paymentId)}' }`);
  if (existing) return existing;

  // Month folder in Indian time, e.g. 2026-11
  const ist = new Date(info.paidAt.getTime() + 5.5 * 3600 * 1000);
  const day = ist.toISOString().slice(0, 10);
  const root = await folder(process.env.GOOGLE_DRIVE_ROOT_FOLDER || "Patra Orders", null);
  const month = await folder(day.slice(0, 7), root);

  const metadata = {
    name: `${day} ${info.orderId} ${info.filename}`,
    parents: [month],
    mimeType: "application/pdf",
    description: [info.templateName, info.customerEmail, `Payment ${info.paymentId}`].filter(Boolean).join(" · "),
    appProperties: { ...info.tags, paymentId: info.paymentId, orderId: info.orderId },
  };
  const boundary = `patra-${crypto.randomUUID()}`;
  const body = Buffer.concat([
    Buffer.from(
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n` +
        `--${boundary}\r\nContent-Type: application/pdf\r\n\r\n`,
    ),
    pdf,
    Buffer.from(`\r\n--${boundary}--`),
  ]);
  const j = await api<{ id: string }>(UPLOAD, {
    method: "POST",
    headers: { "Content-Type": `multipart/related; boundary=${boundary}` },
    body: new Uint8Array(body),
  });
  return j.id;
}

/**
 * Lists backed-up files created after `since` whose tags match ANY of `anyOf`.
 * Returns each file's tags. Used for the free-download daily limit.
 */
export async function findBackupsSince(since: Date, anyOf: Record<string, string>): Promise<Record<string, string>[]> {
  const ors = Object.entries(anyOf)
    .filter(([, v]) => v)
    .map(([k, v]) => `appProperties has { key='${q(k)}' and value='${q(v)}' }`);
  if (!ors.length) return [];
  const query = `(${ors.join(" or ")}) and createdTime > '${since.toISOString().replace(/\.\d+Z$/, "Z")}' and trashed = false`;
  const url = `${API}?${new URLSearchParams({ q: query, fields: "files(appProperties)", pageSize: "20" })}`;
  const j = await api<{ files: { appProperties?: Record<string, string> }[] }>(url);
  return j.files.map((f) => f.appProperties ?? {});
}
