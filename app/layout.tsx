import type {Metadata} from "next";
import {Bricolage_Grotesque, Hanken_Grotesk, Space_Mono} from "next/font/google";
import {GoogleAnalytics} from "@next/third-parties/google";
import Script from "next/script";
import "./globals.css";

import {sanityFetch} from "@/sanity/lib/fetch";
import {siteSettingsQuery} from "@/sanity/lib/queries";
import type {SiteSettings} from "@/sanity/lib/types";
import {IconSprite} from "@/components/IconSprite";
import {Chrome} from "@/components/Chrome";
import {PrivacyGate} from "@/components/PrivacyGate";
import {ClinicJsonLd} from "@/components/ClinicJsonLd";
import {SITE_URL} from "@/lib/site";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Omnia Wellness & Recovery — Physical Therapy in Superior & Duluth",
  description:
    "Expert orthopedic physical therapy and performance care — personalized, one-on-one, and built entirely around your goals.",
};

export default async function RootLayout({
  children,
}: Readonly<{children: React.ReactNode}>) {
  const settings = await sanityFetch<SiteSettings>({query: siteSettingsQuery, tags: ["siteSettings"]});

  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${hanken.variable} ${spaceMono.variable}`}
    >
      <body>
        <ClinicJsonLd settings={settings} />
        <IconSprite />
        <Chrome settings={settings}>{children}</Chrome>
        {/* Entry privacy notice — shown once per browser, on every route. */}
        <PrivacyGate />
      </body>
      {/* Only the live site reports to GA4 and Google Ads: a local `next start` or a
          Vercel preview is a production build too, and was showing up in GA4 as
          localhost referrals. */}
      {process.env.VERCEL_ENV === "production" && (
        <>
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
          <Script id="gads-config" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('config', 'AW-18242550859');
            `}
          </Script>
        </>
      )}
    </html>
  );
}
