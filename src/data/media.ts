const IMG = "https://res.cloudinary.com/ttjf9cmg/image/upload/";
const VID = "https://res.cloudinary.com/ttjf9cmg/video/upload/";

/** Cloudinary delivery: automatic format (WebP/AVIF) + automatic quality + max width. */
const img = (path: string, width: number): string => `${IMG}f_auto,q_auto,w_${width}/${path}`;

/** Hero video, compressed and capped at 1600 px wide. */
export const HERO_VIDEO = `${VID}q_auto,w_1600/v1795460159/Video_Project_1_1.mp4`;
/** First frame of the video, used as a poster while the video loads. */
export const HERO_POSTER = `${VID}so_0,q_auto,w_1280/v1795460159/Video_Project_1_1.jpg`;

export const photo = {
  about1: img("v1795437951/about-1_e03b4d6e.jpg", 1600),
  about2: img("v1795437951/about-2_7fccb54f.jpg", 1000),
  why: img("v1795437952/why_8dcc23c7.jpg", 1800),
  aurel: img("v1795437952/prop-aurel_7e98f275.jpg", 1000),
  skyline: img("v1795437952/prop-skyline_3fd044b7.jpg", 1000),
  forest: img("v1795437952/prop-forest_dad96130.jpg", 1000),
  linea: img("v1795437952/prop-linea_25f7ee08.jpg", 1000),
  quiet: img("v1795437952/prop-quiet_a0a973c6.jpg", 1000),
  casa: img("v1795437952/prop-casa_451f52b9.jpg", 1000),
  pecherskL: img("v1795437952/loc-pechersk_9c620895.jpg", 1000),
  lypkyL: img("v1795437951/loc-lypk_e9e7a485.jpg", 1000),
  podilL: img("v1795437952/loc-podil_254a1279.jpg", 1000),
  konchaL: img("v1795437951/loc-koncha_74b88ef3.jpg", 1000),
  kozynL: img("v1795437951/loc-kozyn_78c91f1d.jpg", 1000),
  odesaL: img("v1795437951/loc-odesa_31f164a9.jpg", 1000),
  about1M: img("v1795437951/about-1_e03b4d6e.jpg", 1000),
  whyM: img("v1795437952/why_8dcc23c7.jpg", 1000),
  pechersk: img("v1795437952/loc-pechersk_9c620895.jpg", 700),
  lypky: img("v1795437951/loc-lypk_e9e7a485.jpg", 700),
  podil: img("v1795437952/loc-podil_254a1279.jpg", 700),
  koncha: img("v1795437951/loc-koncha_74b88ef3.jpg", 700),
  kozyn: img("v1795437951/loc-kozyn_78c91f1d.jpg", 700),
  odesa: img("v1795437951/loc-odesa_31f164a9.jpg", 700),
} as const;
