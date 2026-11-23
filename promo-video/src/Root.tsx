import { Composition } from "remotion";
import { Promo, PROMO_FRAMES, Thumbnail } from "./Promo";

export const Root = () => (
  <>
    {/* Instagram Reels + YouTube Shorts */}
    <Composition id="Reel" component={Promo} durationInFrames={PROMO_FRAMES} fps={30} width={1080} height={1920} />
    {/* YouTube (landscape) */}
    <Composition id="YouTube" component={Promo} durationInFrames={PROMO_FRAMES} fps={30} width={1920} height={1080} />
    {/* YouTube thumbnail */}
    <Composition id="Thumbnail" component={Thumbnail} durationInFrames={1} fps={30} width={1280} height={720} />
  </>
);
