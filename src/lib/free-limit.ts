import "server-only";
import crypto from "node:crypto";
import { driveConfigured, findBackupsSince } from "./drive";

/**
 * Free launch offer: 1 download per calendar day (IST) per email AND per device.
 * Re-downloading the same document again that day is allowed.
 *
 * Records are the Google Drive backups themselves (tagged with hashed email, device id and
 * document hash), so the limit holds across all server instances without a database.
 * Without Drive configured it falls back to per-instance memory (best effort only).
 */

const IST_MS = 5.5 * 3600 * 1000;

/** Start of today in India (midnight IST) as a UTC Date. */
export function startOfTodayIST(now = new Date()): Date {
  const ist = new Date(now.getTime() + IST_MS);
  ist.setUTCHours(0, 0, 0, 0);
  return new Date(ist.getTime() - IST_MS);
}

/** Same inbox = same key: lowercase; for Gmail drop dots and "+tag". */
export function normalizeEmail(email: string): string {
  const [local = "", domain = ""] = email.trim().toLowerCase().split("@");
  if (domain === "gmail.com" || domain === "googlemail.com") {
    return `${local.split("+")[0]!.replace(/\./g, "")}@gmail.com`;
  }
  return `${local.split("+")[0]}@${domain}`;
}

const hash = (s: string) => crypto.createHash("sha256").update(s).digest("hex").slice(0, 40);

export interface FreeKeys {
  emailHash: string;
  deviceId: string;
  docHash: string;
}

export function freeKeys(email: string, deviceId: string, docJson: string): FreeKeys {
  return { emailHash: hash(normalizeEmail(email)), deviceId, docHash: hash(docJson) };
}

export type FreeDecision = { ok: true; repeat: boolean } | { ok: false; reason: "email" | "device" };

/* ---------- Memory fallback (only when Drive is not configured) ---------- */
const memory: { at: number; keys: FreeKeys }[] = [];

function decide(records: Partial<FreeKeys>[], k: FreeKeys): FreeDecision {
  const mine = records.filter((r) => r.emailHash === k.emailHash || r.deviceId === k.deviceId);
  if (!mine.length) return { ok: true, repeat: false };
  // Same document again today (same email or device) -> allowed as a re-download.
  if (mine.every((r) => r.docHash === k.docHash)) return { ok: true, repeat: true };
  return { ok: false, reason: mine.some((r) => r.emailHash === k.emailHash) ? "email" : "device" };
}

export async function checkFreeQuota(k: FreeKeys): Promise<FreeDecision> {
  const since = startOfTodayIST();
  if (driveConfigured()) {
    try {
      const records = await findBackupsSince(since, { emailHash: k.emailHash, deviceId: k.deviceId });
      return decide(records, k);
    } catch (e) {
      // Fail open: a Drive outage must not block launch users.
      console.error("[free-limit] Drive lookup failed, allowing download", e);
      return { ok: true, repeat: false };
    }
  }
  while (memory.length && memory[0]!.at < since.getTime()) memory.shift();
  return decide(
    memory.map((m) => m.keys),
    k,
  );
}

/** Memory fallback only; with Drive, the backup upload itself is the record. */
export function rememberFreeDownload(k: FreeKeys) {
  if (driveConfigured()) return;
  memory.push({ at: Date.now(), keys: k });
  if (memory.length > 20_000) memory.splice(0, memory.length - 20_000);
}
