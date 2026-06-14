import Link from "next/link";

import {client} from "@/sanity/lib/client";
import {appointmentPageQuery, siteSettingsQuery} from "@/sanity/lib/queries";
import type {AppointmentPage, SiteSettings} from "@/sanity/lib/types";

import {Icon} from "@/components/Icon";

export default async function AppointmentPageRoute() {
  const [page, settings] = await Promise.all([
    client.fetch<AppointmentPage>(appointmentPageQuery),
    client.fetch<SiteSettings>(siteSettingsQuery),
  ]);

  return (
    <div className="book">
      <aside className="book__aside">
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <Link className="book__brand" href="/">
            <Icon name="mark" className="mark" />
            {settings.brandName}
          </Link>
          <Link className="book__back" href={page.backLinkHref}>
            {page.backLinkLabel}
          </Link>
        </div>

        <div className="book__lead">
          <h1>{page.leadHeading}</h1>
          <p>{page.leadBody}</p>
        </div>

        <ul className="reassure">
          {page.reassurances?.map((item, i) => (
            <li key={i}>
              <Icon name="leaf" className="leaf" width={20} height={20} />
              <span>
                <b>{item.lead}</b> {item.rest}
              </span>
            </li>
          ))}
        </ul>

        <div className="book__help">
          <span>Prefer to talk?</span>
          <a href={`tel:${settings.phoneHref}`}>Call {settings.phone}</a>
          <a href={`mailto:${settings.email}`}>{settings.email}</a>
        </div>
      </aside>

      <div className="book__main">
        <div className="launch">
          <div className="launch__card">
            <Icon name="mark" className="mark" />
          </div>
          <span className="eyebrow" style={{justifyContent: "center", display: "flex"}}>
            <Icon name="leaf" className="leaf" />
            {page.launchEyebrow}
          </span>
          <h2 style={{marginTop: 14}}>{page.launchHeading}</h2>
          <p>{page.launchBody}</p>
          <a
            className="btn btn--lg"
            href={page.onlineBookingUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {page.launchButtonLabel} <span className="arr">↗</span>
          </a>
          <p className="launch__note">{page.launchNote}</p>
        </div>
      </div>
    </div>
  );
}
