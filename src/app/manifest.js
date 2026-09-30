import { SITE_DESCRIPTION, SITE_NAME } from "../constants/site";

export default function manifest() {
  return {
    name: SITE_NAME,
    short_name: "Liga Sado",
    description: SITE_DESCRIPTION,
    lang: "pt-PT",
    start_url: "/",
    display: "standalone",
    // Same tokens as tailwind.config.js (nav / background).
    background_color: "#EEF1F5",
    theme_color: "#0C1F33",
    icons: [
      { src: "/logo/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/logo/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
