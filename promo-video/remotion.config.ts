import path from "node:path";
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setConcurrency(4);
Config.setStudioPort(3410);
// Renders use their own port so they never collide with the Next.js dev server on :3000.
Config.setRendererPort(3420);
// Reuse the real document templates from the Next.js app (../src) via the "@" alias.
Config.overrideWebpackConfig((config) => ({
  ...config,
  resolve: {
    ...config.resolve,
    alias: { ...(config.resolve?.alias ?? {}), "@": path.resolve(process.cwd(), "..", "src") },
  },
}));
