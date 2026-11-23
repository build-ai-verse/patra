# Patra™ Instagram Reel

A 20-second, 1080×1920 (9:16) promo Reel built with [Remotion](https://remotion.dev). It reuses the **real document templates** from the web app (`../src`), so what people see in the ad is exactly what they get.

**Output:** `out/patra-reel.mp4` (H.264, 30 fps, 20 s) · `out/cover.png` (Reel cover)

## Storyboard (Hinglish, for an Indian audience)

| Time | Scene |
|------|-------|
| 0-3 s | Hook: "Shaadi ka biodata abhi bhi Word mein? 😅", a plain Word doc gets a red **BORING** stamp |
| 3-7.5 s | "Beautiful Biodata sirf 5 minute mein ✨", name types in live and fields fill the Royal Heritage biodata |
| 7.5-11 s | "Apna style chuniye", colours cycle and the design flips to Lotus Modern |
| 11-14.5 s | "Job-winning Resume", both resume templates fly in, "ATS-friendly" badge |
| 14.5-17 s | "Download sirf ₹10 se shuru", "Chai se bhi sasta ☕", UPI / Instant PDF / Email chips |
| 17-20 s | Logo, **Patra™**, URL pill, "Link in bio", *Powered by Thakur Ventures* |

## Edit & re-render

```bash
cd promo-video
npm install
npm run studio    # live editor in the browser
npm run render    # -> out/patra-reel.mp4
```

Text, timing and colours live in `src/Promo.tsx` (`SCENES` array at the bottom controls timing). Brand name/price/URL come from `../src/config/site.ts`.

## Posting tips

- The video is **silent on purpose**: add a trending song from Instagram's audio library when posting (better reach than embedded music).
- Suggested caption:

> Shaadi ka biodata ho ya naukri ka resume, ab banaiye **5 minute mein** ✨
> 💍 Beautiful marriage biodata designs
> 💼 ATS-friendly resumes
> 🎨 5 colours · photo upload · live preview FREE
> 📥 Print-ready PDF sirf **₹10 se shuru**, seedha aapke email pe!
>
> 👉 patra.build-ai-version.com (link in bio)
>
> #biodata #marriagebiodata #shaadi #rishta #indianwedding #resume #resumetips #jobsearch #naukri #freshers #cv #madeinindia #ThakurVentures

> Licensing note: Remotion is free for individuals and companies with up to 3 employees; larger companies need a Remotion company license.
