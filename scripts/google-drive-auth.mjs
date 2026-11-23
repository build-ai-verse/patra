#!/usr/bin/env node
/**
 * One-time helper: get a Google Drive refresh token for backing up sold PDFs.
 *
 * 1. Put GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (OAuth client of type "Desktop app")
 *    in .env.local (or export them).
 * 2. Run:  node scripts/google-drive-auth.mjs
 * 3. Sign in with the Google account whose Drive should hold the backups and allow access.
 * 4. Copy the printed GOOGLE_REFRESH_TOKEN into .env.local / your host's env settings.
 *
 * Only talks to Google. Scope is drive.file: the app can only see files it creates.
 */
import http from "node:http";
import crypto from "node:crypto";
import fs from "node:fs";
import { exec } from "node:child_process";

// Minimal .env.local reader (no dependency).
try {
  for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"]*)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {
  /* no .env.local */
}

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
if (!clientId || !clientSecret) {
  console.error("Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local first.");
  process.exit(1);
}

const state = crypto.randomBytes(16).toString("hex");
const verifier = crypto.randomBytes(32).toString("base64url");
const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://127.0.0.1");
  if (url.pathname !== "/") return res.writeHead(404).end();
  const code = url.searchParams.get("code");
  if (url.searchParams.get("state") !== state || !code) {
    res.writeHead(400, { "Content-Type": "text/plain" }).end("Sign-in failed or was cancelled. You can close this tab.");
    console.error("Sign-in failed:", url.searchParams.get("error") ?? "state mismatch");
    return shutdown(1);
  }
  try {
    const r = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
        code_verifier: verifier,
      }),
    });
    const j = await r.json();
    if (!j.refresh_token) throw new Error(JSON.stringify(j));
    res.writeHead(200, { "Content-Type": "text/plain" }).end("Done! Go back to the terminal. You can close this tab.");
    console.log("\nSuccess. Add this to .env.local and to your hosting env settings:\n");
    console.log(`GOOGLE_REFRESH_TOKEN=${j.refresh_token}\n`);
    shutdown(0);
  } catch (e) {
    res.writeHead(500, { "Content-Type": "text/plain" }).end("Token exchange failed. See terminal.");
    console.error("Token exchange failed:", e.message ?? e);
    shutdown(1);
  }
});

let redirectUri = "";
function shutdown(code) {
  server.close();
  setTimeout(() => process.exit(code), 100);
}

server.listen(0, "127.0.0.1", () => {
  redirectUri = `http://127.0.0.1:${server.address().port}`;
  const auth = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/drive.file",
    access_type: "offline",
    prompt: "consent",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  })}`;
  console.log("Open this URL and sign in with the Google account for backups:\n\n" + auth + "\n");
  const opener = process.platform === "win32" ? `start "" "${auth}"` : process.platform === "darwin" ? `open "${auth}"` : `xdg-open "${auth}"`;
  exec(opener, () => {});
});
