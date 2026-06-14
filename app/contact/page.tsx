import Link from "next/link";
import {PortableText} from "@portabletext/react";
import type {PortableTextComponents} from "@portabletext/react";

import {client} from "@/sanity/lib/client";
import {contactPageQuery} from "@/sanity/lib/queries";
import type {ContactPage} from "@/sanity/lib/types";

import {Icon} from "@/components/Icon";
import {Reveal} from "@/components/Reveal";
import {ContactForm} from "@/components/ContactForm";

const introComponents: PortableTextComponents = {
  marks: {
    link: ({value, children}) => {
      const href = value?.href ?? "#";
      if (href.startsWith("/")) {
        return (
          <Link href={href} style={{color: "var(--accent-deep)", textDecoration: "underline"}}>
            {children}
          </Link>
        );
      }
      return (
        <a
          href={href}
          style={{color: "var(--accent-deep)", textDecoration: "underline"}}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    },
  },
};

export default async function ContactPageRoute() {
  const page = await client.fetch<ContactPage>(contactPageQuery);

  const mapsQuery = encodeURIComponent(page.addressLines?.join(", ") ?? "");
  const directionsUrl = `https://maps.google.com/?q=${mapsQuery}`;

  return (
    <>
      <header className="page-head">
        <div className="wrap">
          <div className="crumbs">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Contact</span>
          </div>
          <h1 className="page-head__title">{page.pageHeading}</h1>
          <div className="page-head__intro">
            <PortableText value={page.intro} components={introComponents} />
          </div>
        </div>
      </header>

      <main>
        <section className="section" style={{paddingTop: "clamp(20px,3vw,40px)"}}>
          <div className="wrap contact-grid">
            <Reveal>
              <span className="eyebrow">
                <Icon name="leaf" className="leaf" />
                Visit us
              </span>
              <dl className="info-list" style={{marginTop: 22}}>
                <div className="info-row">
                  <dt>Location</dt>
                  <dd>
                    {page.addressLines?.map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < (page.addressLines?.length ?? 0) - 1 && <br />}
                      </span>
                    ))}
                  </dd>
                </div>
                <div className="info-row">
                  <dt>Call</dt>
                  <dd>
                    <a href={`tel:${page.phone.replace(/\D/g, "")}`}>{page.phone}</a>
                  </dd>
                </div>
                <div className="info-row">
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${page.email}`}>{page.email}</a>
                  </dd>
                </div>
                {page.fax && (
                  <div className="info-row">
                    <dt>Fax</dt>
                    <dd>{page.fax}</dd>
                  </div>
                )}
                {page.hours?.map((row, i) => (
                  <div className="info-row" key={i}>
                    <dt>{row.label}</dt>
                    <dd>
                      {row.hours.split(",").map((part, j) => (
                        <span key={j}>
                          {part.trim()}
                          {j < row.hours.split(",").length - 1 && <br />}
                        </span>
                      ))}
                    </dd>
                  </div>
                ))}
                {page.servingArea && (
                  <div className="info-row">
                    <dt>Serving</dt>
                    <dd>{page.servingArea}</dd>
                  </div>
                )}
              </dl>
              <div className="map-slot" style={{marginTop: 26}}>
                <iframe
                  src={page.mapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map to ${page.clinicName}`}
                />
              </div>
              <a
                className="btn btn--ghost"
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{marginTop: 18}}
              >
                Get directions <span className="arr">→</span>
              </a>
            </Reveal>

            <Reveal>
              <span className="eyebrow">
                <Icon name="leaf" className="leaf" />
                Send a message
              </span>
              <h2 className="svc-row__title" style={{margin: "14px 0 24px"}}>
                How can we help?
              </h2>
              <ContactForm formNote={page.formNote} />
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}
