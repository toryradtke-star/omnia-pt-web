import Link from "next/link";
import {resolveHref} from "@/lib/href";
import {Icon} from "./Icon";
import type {SiteSettings} from "@/sanity/lib/types";

type Props = {
  settings: SiteSettings;
  /** When true, show address (used on Contact); otherwise show fax (used on Home/Services). */
  showAddress?: boolean;
};

export function Footer({settings, showAddress = false}: Props) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <div>
            <Icon name="mark" className="mark" />
            <div className="footer__brand">
              {settings.footerBrandLines?.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < settings.footerBrandLines.length - 1 && <br />}
                </span>
              ))}
            </div>
            <p className="footer__tag">{settings.footerTagline}</p>
          </div>
          <div className="footer__col">
            <h4>Explore</h4>
            {settings.footerExploreLinks?.map((link) => (
              <Link key={link.href} href={resolveHref(link.href)}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="footer__col">
            <h4>Contact</h4>
            <a href={`mailto:${settings.email}`}>{settings.email}</a>
            <a href={`tel:${settings.phoneHref}`}>Call: {settings.phone}</a>
            {showAddress
              ? settings.addressLines && (
                  <p>{settings.addressLines.join(", ")}</p>
                )
              : settings.fax && <p>Fax: {settings.fax}</p>}
            <Link
              href="/appointment"
              style={{color: "var(--moss-soft)", marginTop: 14}}
            >
              Schedule an appointment →
            </Link>
          </div>
        </div>
        <div className="footer__bottom">
          <span>{settings.copyrightLine}</span>
          {/* Legal links live in code, not in Sanity: they must never be
              editable away, and the SMS pages are referenced by the carrier
              registration. */}
          <nav className="footer__legal" aria-label="Legal">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/sms-terms">SMS Terms &amp; Conditions</Link>
          </nav>
          <span>{settings.serviceArea}</span>
        </div>
      </div>
    </footer>
  );
}
