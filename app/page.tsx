import Link from "next/link";
import {PortableText} from "@portabletext/react";

import {client} from "@/sanity/lib/client";
import {urlFor} from "@/sanity/lib/image";
import {homePageQuery, servicesPageQuery} from "@/sanity/lib/queries";
import type {HomePage, ServicesPage} from "@/sanity/lib/types";

import {Icon} from "@/components/Icon";
import {Reveal} from "@/components/Reveal";
import {Faq} from "@/components/Faq";

function MissionHeading({text}: {text: string}) {
  // Wrap the words "healthier" and "recover" in <em> to match the design.
  const parts = text.split(/(healthier|recover)/);
  return (
    <h2 style={{marginTop: 18}}>
      {parts.map((p, i) =>
        p === "healthier" || p === "recover" ? <em key={i}>{p}</em> : <span key={i}>{p}</span>,
      )}
    </h2>
  );
}

export default async function HomePageRoute() {
  const [home, services] = await Promise.all([
    client.fetch<HomePage>(homePageQuery),
    client.fetch<ServicesPage>(servicesPageQuery),
  ]);

  const previewServices = services?.services?.slice(0, 9) ?? [];

  return (
    <>
      {/* ===== HERO ===== */}
      <header className="hero" id="top">
        <div className="hero__media">
          {home.heroImage?.asset && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="hero__img"
              src={urlFor(home.heroImage).width(2400).quality(72).auto("format").url()}
              alt={home.heroImage.alt || ""}
            />
          )}
          <div className="hero__tint" aria-hidden="true" />
        </div>
        <div className="hero__inner wrap">
          <span className="eyebrow hero__eyebrow">
            <Icon name="leaf" className="leaf" />
            {home.heroEyebrow}
          </span>
          <h1 className="display" style={{color: "rgb(174, 192, 154)"}}>
            {home.heroHeadingLines?.map((line, i) => (
              <span key={i} style={{display: "block", whiteSpace: "nowrap"}}>
                {line.highlight} <span style={{color: "#ffffff"}}>{line.rest}</span>
              </span>
            ))}
          </h1>
          <p className="hero__sub">{home.heroSubheading}</p>
          <div className="hero__actions">
            <Link className="btn btn--lg" href={home.heroPrimaryCtaHref}>
              {home.heroPrimaryCtaLabel} <span className="arr">→</span>
            </Link>
            <Link className="btn btn--ghost btn--lg" href={home.heroSecondaryCtaHref}>
              {home.heroSecondaryCtaLabel}
            </Link>
          </div>
        </div>
        <div className="hero__curve" aria-hidden="true">
          <svg viewBox="0 0 1440 150" preserveAspectRatio="none">
            <path d="M0,150 L0,60 C280,150 1160,150 1440,40 L1440,150 Z" />
          </svg>
        </div>
      </header>

      <main>
        {/* ===== MISSION ===== */}
        <section className="section" id="mission">
          <div className="wrap mission">
            <div className="mission__grid">
              <Reveal>
                <span className="eyebrow">
                  <Icon name="leaf" className="leaf" />
                  {home.missionEyebrow}
                </span>
                <MissionHeading text={home.missionHeading} />
                <div className="mission__stats">
                  {home.missionStats?.map((s, i) => (
                    <div className="stat" key={i}>
                      <div className="stat__num">{s.number}</div>
                      <div className="stat__label">{s.label}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal className="mission__body">
                <PortableText value={home.missionBody} />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ===== TEAM ===== */}
        <section className="section section--cream2" id="team">
          <div className="wrap team">
            <Reveal as="span" className="eyebrow">
              <Icon name="leaf" className="leaf" />
              {home.teamEyebrow}
            </Reveal>
            <div className="team__grid" style={{marginTop: 30}}>
              <Reveal className="team__photo">
                {home.teamPhoto?.asset && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="team__img"
                    src={urlFor(home.teamPhoto).width(1100).auto("format").url()}
                    alt={home.teamPhoto.alt || ""}
                  />
                )}
                <div className="team__badge">
                  <b>{home.teamBadgeName}</b>
                  <span>{home.teamBadgeTitle}</span>
                </div>
              </Reveal>
              <Reveal>
                <h2 className="section-title" style={{fontSize: "clamp(1.9rem,4vw,3.2rem)"}}>
                  {home.teamHeading}
                </h2>
                <div className="team__name">{home.teamName}</div>
                <div className="team__body">
                  <PortableText value={home.teamBio} />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ===== SERVICES PREVIEW ===== */}
        <section className="section section--forest" id="services">
          <div className="wrap">
            <div className="services__head">
              <Reveal>
                <span className="eyebrow" style={{color: "var(--moss-soft)"}}>
                  <Icon name="leaf" className="leaf" />
                  {home.servicesEyebrow}
                </span>
                <h2 className="section-title" style={{marginTop: 16}}>
                  {home.servicesHeading}
                </h2>
              </Reveal>
              <Reveal>
                <p className="services__intro">{home.servicesIntro}</p>
                <Link className="svc__more" href={home.servicesViewAllHref} style={{marginTop: 18}}>
                  {home.servicesViewAllLabel} <span className="arr">→</span>
                </Link>
              </Reveal>
            </div>

            <div className="svc-grid">
              {previewServices.map((svc, i) => (
                <Reveal as="article" className="svc" delayIndex={i} key={i}>
                  <div className="svc__media">
                    <Icon name={svc.icon} className="svc-icon" />
                  </div>
                  <span className="svc__num">{svc.displayNumber}</span>
                  <h3 className="svc__title">{svc.name}</h3>
                  <p className="svc__desc">{svc.summary}</p>
                  <Link className="svc__more" href="/appointment">
                    Book this <span className="arr">→</span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ===== WHY US ===== */}
        <section className="section" id="why">
          <div className="wrap why">
            <div className="why__grid">
              <Reveal className="why__media">
                {home.whyImage?.asset && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="why__img"
                    src={urlFor(home.whyImage).width(1200).auto("format").url()}
                    alt={home.whyImage.alt || ""}
                    style={{objectPosition: "48% 22%"}}
                  />
                )}
              </Reveal>
              <Reveal>
                <span className="eyebrow">
                  <Icon name="leaf" className="leaf" />
                  {home.whyEyebrow}
                </span>
                <h2 style={{margin: "16px 0 22px"}}>{home.whyHeading}</h2>
                <div className="why__body">
                  <PortableText value={home.whyBody} />
                </div>
                <ul className="why__list">
                  {home.whyList?.map((item, i) => (
                    <li key={i}>
                      <Icon name="leaf" className="leaf" width={20} height={20} />
                      <span>
                        <b>{item.lead}</b> {item.rest}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <div style={{marginTop: "clamp(60px,9vw,120px)"}}>
              <Reveal as="span" className="eyebrow">
                <Icon name="leaf" className="leaf" />
                {home.howCanWeHelpEyebrow}
              </Reveal>
              <div className="help-grid">
                {home.howCanWeHelpCards?.map((card, i) => (
                  <Reveal className="help" delayIndex={i} key={i}>
                    <PortableText value={[card]} />
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== CTA BAND ===== */}
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

        {/* ===== FAQ ===== */}
        <section className="section section--cream2" id="faq">
          <div className="wrap">
            <Reveal as="h2" className="section-title" style={{textAlign: "center", marginBottom: 50}}>
              {home.faqHeading}
            </Reveal>
            <Reveal>
              <Faq faqs={home.faqs ?? []} />
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}
