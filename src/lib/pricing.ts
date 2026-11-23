import { features } from "@/config/site";
import { minPrice, type TemplateKind } from "./templates";

/** True during the free launch offer (NEXT_PUBLIC_FREE_LAUNCH=true). */
export const FREE = features.freeLaunch;

/** "₹10" normally, "Free" during the launch offer. */
export const price = (inr: number) => (FREE ? "Free" : `₹${inr}`);

/** "from ₹10" normally, "free" during the launch offer. Use mid-sentence. */
export const fromPrice = (kind?: TemplateKind) => (FREE ? "free" : `from ₹${minPrice(kind)}`);
