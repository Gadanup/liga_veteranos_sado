import localFont from "next/font/local";
import { Barlow_Condensed, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import AppProviders from "./AppProviders";
import AppShell from "./AppShell";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "../constants/site";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Display face for headings, scoreboards and the crest wordmark: condensed,
// so long club names fit on a phone. Body face for everything else.
const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap",
});
const body = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

/**
 * This layout is a server component, which is the whole point: a client
 * component cannot export metadata, so until now the served HTML had no
 * title, no description and no Open Graph tags at all — the title was set by
 * `document.title` in an effect, which no crawler and no link unfurler runs.
 * Links pasted into WhatsApp showed the bare URL.
 */
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/logo/og.jpg",
        width: 1200,
        height: 630,
        alt: "Emblema da Liga de Futebol Veteranos do Sado",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/logo/og.jpg"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  // The crest's deep navy, so the phone's browser chrome matches the app bar.
  themeColor: "#0C1F33",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body
        className={`${display.variable} ${body.variable} ${geistSans.variable} ${geistMono.variable} antialiased bg-background`}
      >
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
