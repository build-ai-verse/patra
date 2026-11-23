import { cacheLife } from "next/cache";

/** Current year, cached so the static shell can be prerendered (refreshes daily). */
export async function Year() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
