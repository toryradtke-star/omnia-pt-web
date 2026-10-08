import {SITE_URL} from "@/lib/site";
import type {SiteSettings} from "@/sanity/lib/types";

export const CLINIC_ID = `${SITE_URL}/#clinic`;

// Tells search engines this is a physical therapy clinic, with the address and phone
// from Site Settings. `addressLines` reads like ["1308 Tower Ave", "Superior, WI 54880"].
export function ClinicJsonLd({settings}: {settings: SiteSettings}) {
  const [street, cityLine = ""] = settings.addressLines ?? [];
  const [, city, region, postalCode] = cityLine.match(/^(.+?),\s*([A-Z]{2})\s+(\d{5})/) ?? [];

  const data = {
    "@context": "https://schema.org",
    "@type": "PhysicalTherapy",
    "@id": CLINIC_ID,
    name: "Omnia Wellness & Recovery",
    url: SITE_URL,
    telephone: settings.phoneHref,
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: street,
      addressLocality: city,
      addressRegion: region,
      postalCode,
      addressCountry: "US",
    },
    areaServed: ["Superior, WI", "Duluth, MN"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{__html: JSON.stringify(data).replace(/</g, "\\u003c")}}
    />
  );
}
