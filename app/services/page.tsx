import Link from "next/link";
import {PortableText} from "@portabletext/react";

import {client} from "@/sanity/lib/client";
import {homePageQuery, servicesPageQuery} from "@/sanity/lib/queries";
import type {HomePage, ServicesPage} from "@/sanity/lib/types";

import {Icon} from "@/components/Icon";
import {Reveal} from "@/components/Reveal";

export default async function ServicesPageRoute() {
  const [page, home] = await Promise.all([
    client.fetch<ServicesPage>(servicesPageQuery),
    client.fetch<HomePage>(homePageQuery),
  ]);

  return (
    <>
      <header className="page-head">
        <div className="wrap">
          <div className="crumbs">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Services</span>
          </div>
          <h1 className="page-head__title">{page.pageHeading}</h1>
          <div className="page-head__intro">
            <PortableText value={page.intro} />
          </div>
        </div>
      </header>

      <main>
        <section className="section" style={{paddingTop: "clamp(20px,3vw,40px)"}}>
          <div className="wrap">
            {page.services?.map((svc, i) => (
              <Reveal
                as="article"
                className={`svc-row${i % 2 === 1 ? " rev" : ""}`}
                key={svc.slug?.current ?? i}
                delayIndex={i}
              >
                <div className="svc-row__media svc-row__icon">
                  <Icon name={svc.icon} className="svc-row__svg" />
                </div>
                <div>
                  <span className="svc-row__num">{svc.displayNumber}</span>
                  <h2 className="svc-row__title">{svc.name}</h2>
                  <div className="svc-row__desc">
                    {svc.description && svc.description.length > 0 ? (
                      <PortableText value={svc.description} />
                    ) : (
                      <p>{svc.summary}</p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CTA band — reuse the homePage CTA fields */}
        <section className="section section--forest cta-band">
          <Reveal className="wrap">
            <span
              className="eyebrow"
              style={{color: "var(--moss-soft)", justifyContent: "center", display: "flex"}}
            >
              <Icon name="leaf" className="leaf" />
              {home.ctaEyebrow}
            </span>
            <h2 style={{marginTop: 16}}>{home.ctaHeading}</h2>
            <p>{home.ctaBody}</p>
            <Link className="btn btn--lg" href={home.ctaButtonHref}>
              {home.ctaButtonLabel} <span className="arr">→</span>
            </Link>
          </Reveal>
        </section>
      </main>
    </>
  );
}
