import type {Metadata} from "next";
import {Bricolage_Grotesque, Hanken_Grotesk, Space_Mono} from "next/font/google";
import "./globals.css";

import {client} from "@/sanity/lib/client";
import {siteSettingsQuery} from "@/sanity/lib/queries";
import type {SiteSettings} from "@/sanity/lib/types";
import {IconSprite} from "@/components/IconSprite";
import {Chrome} from "@/components/Chrome";

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
  title: "Omnia Wellness & Recovery — Physical Therapy in Superior & Duluth",
  description:
    "Expert orthopedic physical therapy and performance care — personalized, one-on-one, and built entirely around your goals.",
};

export default async function RootLayout({
  children,
}: Readonly<{children: React.ReactNode}>) {
  const settings = await client.fetch<SiteSettings>(siteSettingsQuery);

  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${hanken.variable} ${spaceMono.variable}`}
    >
      <body>
        <IconSprite />
        <Chrome settings={settings}>{children}</Chrome>
      </body>
    </html>
  );
}
