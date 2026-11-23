# Patra™ launch promo video

A 22.5-second launch promo built with [Remotion](https://remotion.dev). It renders the **real document templates** from the web app (`../src`), so what people see in the ad is exactly what they get. One source file, two formats:

| File | Size | Use it for |
|---|---|---|
| `out/patra-reel.mp4` | 1080×1920 (9:16) | Instagram Reels, YouTube Shorts, WhatsApp Status, Facebook Reels |
| `out/patra-youtube.mp4` | 1920×1080 (16:9) | Regular YouTube video, website, Facebook feed |
| `out/cover.png` | 1080×1920 | Reel cover image |
| `out/youtube-thumbnail.jpg` | 1280×720 | YouTube thumbnail |

All videos: H.264, 30 fps, no audio (see posting tips).

## Storyboard (Hinglish, for an Indian audience)

| Time | Scene |
|------|-------|
| 0-3 s | Hook: "Shaadi ka biodata abhi bhi Word mein? 😅", a plain Word doc gets a red **BORING** stamp |
| 3-7 s | "Beautiful Biodata sirf 5 minute mein ✨", name types in live and fields fill the Royal Heritage biodata |
| 7-10 s | "Hindi mein bhi! हिन्दी में भी", the English/हिन्दी toggle flips and the biodata turns Hindi |
| 10-13.3 s | "Apna style chuniye", colours cycle and the design flips to Lotus Modern |
| 13.3-16.5 s | "Job-winning Resume", both resume templates fly in, "ATS-friendly" + "FREE ATS score checker" |
| 16.5-19.5 s | 🎉 **LAUNCH OFFER**: ~~₹10~~ **FREE**, "Limited time only", Instant PDF / Email pe copy / No signup |
| 19.5-22.5 s | Logo, **Patra™**, URL pill, "Link in bio" (vertical) / "Link in description" (YouTube) |

In the vertical version, all key text stays above the bottom ~20% of the frame, where Instagram shows the caption and buttons.

## Edit & re-render

```bash
cd promo-video
npm install
npm run studio          # live editor in the browser (http://localhost:3410)
npm run render          # renders all 4 files into out/
npm run render:reel     # or just one of them
npm run render:youtube
```

- Text, timing and layout live in `src/Promo.tsx` (the `SCENES` array at the bottom controls timing). Each scene has a vertical and a landscape layout (`useLandscape()`).
- **When the launch offer ends:** set `LAUNCH_OFFER = false` at the top of `src/Promo.tsx` and re-render. The offer scene switches back to "Download sirf ₹10 se shuru".
- Brand name, price and URL come from `../src/config/site.ts`.
- Renders use port 3420, so they work while the Next.js dev server is running on 3000.

## Posting tips

**Audio:** the videos are silent on purpose. Add a trending song from Instagram's audio library (better reach than embedded music). On YouTube, use a track from the free YouTube Audio Library in YouTube Studio's editor.

### Instagram Reel (`patra-reel.mp4` + `cover.png`)

> Shaadi ka biodata ho ya naukri ka resume, ab banaiye **5 minute mein** ✨
> 💍 Beautiful marriage biodata designs, English + हिन्दी
> 💼 ATS-friendly resumes + FREE ATS score checker
> 🎨 5 colours · photo upload · live preview
> 🎉 **Launch offer: PDF download FREE** (limited time)
>
> 👉 patra.build-ai-verse.com (link in bio)
>
> #biodata #marriagebiodata #hindibiodata #shaadi #rishta #indianwedding #resume #resumetips #jobsearch #naukri #freshers #cv #madeinindia #ThakurVentures

### YouTube Shorts (`patra-reel.mp4`)

- **Title:** Shaadi Biodata 5 minute mein, FREE (English + Hindi) #shorts
- **Description:** use the Instagram caption above; replace "link in bio" with the full link `https://patra.build-ai-verse.com`.

### YouTube (`patra-youtube.mp4` + `youtube-thumbnail.jpg`)

- **Title:** Marriage Biodata Maker Online FREE | Hindi & English Biodata + ATS Resume in 5 Minutes | Patra
- **Description:**

> Create a beautiful marriage biodata or a job-winning, ATS-friendly resume in 5 minutes, free during our launch offer.
>
> 👉 Start now: https://patra.build-ai-verse.com
>
> ✅ Royal Heritage & Lotus Modern biodata designs, 5 colours each
> ✅ English + हिन्दी biodata, switch in one click
> ✅ Divine symbols: Shree Ganesh, Radha Krishna, Shiv Parvati and more
> ✅ Photo upload and live preview
> ✅ ATS-friendly resume templates + free ATS score checker
> ✅ Print-ready PDF, instantly and on email
>
> 🎉 Launch offer: PDF downloads are FREE for a limited time.
>
> #marriagebiodata #biodata #hindibiodata #resume #atsresume

- **Tags:** marriage biodata, biodata format, biodata for marriage, hindi biodata, shaadi biodata, biodata maker, resume maker, ats resume, free resume builder, cv maker india

> Licensing note: Remotion is free for individuals and companies with up to 3 employees; larger companies need a Remotion company license.
