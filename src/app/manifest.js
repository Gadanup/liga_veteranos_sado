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
    background_color: "#F3F2F5",
    theme_color: "#4C3780",
    icons: [
      {
        src: "/logo/logo_new.png",
        sizes: "373x283",
        type: "image/png",
      },
    ],
  };
}
