import type {Metadata} from "next";
import Link from "next/link";

import {LandingForm} from "@/components/LandingForm";
import {Reveal} from "@/components/Reveal";
import styles from "./free-session.module.css";

export const metadata: Metadata = {
  title: "Claim Your Free Session — Omnia Wellness & Recovery",
  description:
    "Limited to 10 people: a free physical therapy session with a Doctor of Physical Therapy in Superior, WI and Duluth, MN — or virtual across MN & WI.",
};

export default function FreeSessionPage() {
  return (
    <div className={styles.page}>
      {/* Landing-only icon sprite (the global IconSprite covers i-leaf and i-mark). */}
      <svg width="0" height="0" style={{position: "absolute"}} aria-hidden="true">
        <symbol id="lp-one" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="7.5" r="3.4" />
          <path d="M5.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
        </symbol>
        <symbol id="lp-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.4V12l3.4 2" />
        </symbol>
        <symbol id="lp-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21c4.2-4.3 6.4-7.8 6.4-10.8A6.4 6.4 0 0 0 5.6 10.2C5.6 13.2 7.8 16.7 12 21Z" />
          <circle cx="12" cy="10.2" r="2.4" />
        </symbol>
        <symbol id="lp-heart" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20S4 14.8 4 9.4A4.2 4.2 0 0 1 12 7.6 4.2 4.2 0 0 1 20 9.4C20 14.8 12 20 12 20Z" />
          <path d="M8 11.3h2l1-2 1.4 3.2 1-1.2H16" />
        </symbol>
        <symbol id="lp-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 12.5l5 5 10-11" />
        </symbol>
        <symbol id="lp-phone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 4h3.5l1.5 4-2 1.4a11 11 0 0 0 5.1 5.1l1.4-2 4 1.5V19a1.5 1.5 0 0 1-1.6 1.5C11.6 20.2 3.8 12.4 3.5 5.6A1.5 1.5 0 0 1 5 4Z" />
        </symbol>
      </svg>

      {/* ===== HEADER ===== */}
      <header className={styles.head}>
        <a className={styles.brand} href="#top" aria-label="Omnia Wellness & Recovery — home">
          <svg className={styles.mark}><use href="#i-mark" /></svg>
          <span className={styles.brandWord}>OMNIA</span>
        </a>
        <a className={styles.headPhone} href="tel:+12184990806">
          <svg className={styles.leaf}><use href="#lp-phone" /></svg>
          <span className={styles.full}>(218)&nbsp;</span>499-0806
        </a>
      </header>

      {/* ===== HERO ===== */}
      <section className={styles.hero} id="top">
        <div className={styles.heroMedia}>
          {/* TODO: replace Unsplash placeholder with owned photography. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.heroImg}
            src="https://images.unsplash.com/photo-1509111884843-33c32e087103?fm=jpg&q=72&w=1920&auto=format&fit=crop"
            alt="Calm North Shore landscape near Lake Superior"
          />
          <div className={styles.heroTint} aria-hidden="true" />
        </div>
        <div className={`${styles.heroInner} wrap`}>
          <span className={`${styles.eyebrow} ${styles.heroEyebrow}`}>
            <svg className={styles.leaf}><use href="#i-leaf" /></svg>
            Superior, WI &amp; Duluth, MN
          </span>
          <p className={styles.heroHook}>
            Dealing with stubborn pain, tight muscles, or an old injury that just won&apos;t let go?
          </p>
          <h1>
            Claim your <span className={styles.em}>free</span> session
          </h1>
          <p className={styles.heroSub}>Limited to 10 people — on us.</p>
          <div className={styles.heroActions}>
            <a className={`${styles.btn} ${styles.btnLg}`} href="#consult">
              Claim my free session <span className={styles.arr}>→</span>
            </a>
            <Link className={styles.heroAlt} href="/appointment">
              Or schedule an appointment <span className={styles.arr}>→</span>
            </Link>
          </div>
          <span className={styles.heroScarcity}>
            <span className={styles.dot} aria-hidden="true" />
            Only 10 spots — first come, first served.
          </span>
        </div>
        <div className={styles.heroCurve} aria-hidden="true">
          <svg viewBox="0 0 1440 150" preserveAspectRatio="none">
            <path d="M0,150 L0,60 C280,150 1160,150 1440,40 L1440,150 Z" />
          </svg>
        </div>
      </section>

      {/* ===== OFFER EXPLAINER ===== */}
      <section className={styles.offer}>
        <div className="wrap">
          <Reveal className={styles.offerCard}>
            <span className={styles.eyebrow}>
              <svg className={styles.leaf}><use href="#i-leaf" /></svg>
              The offer
            </span>
            <h2>
              We&apos;re inviting <span className={styles.hl}>10 people</span> to experience expert physical therapy — on us.
            </h2>
            <p>
              It&apos;s a natural path to pain relief and better movement, without pills or procedures.
              Our hands-on treatments target the root of your pain to release tension, restore movement,
              and get you back to feeling like yourself.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===== WHY OMNIA ===== */}
      <section className={styles.why}>
        <div className="wrap">
          <Reveal className={styles.whyHead}>
            <span className={styles.eyebrow}>
              <svg className={styles.leaf}><use href="#i-leaf" /></svg>
              Why Omnia
            </span>
            <h2>Care that&apos;s actually about you.</h2>
          </Reveal>
          <div className={styles.propGrid}>
            <Reveal className={styles.prop} delayIndex={0}>
              <div className={styles.propIc}>
                <svg><use href="#lp-one" /></svg>
              </div>
              <h3>One-on-one, every time</h3>
              <p>No double-booking and no hand-offs — just focused care with your therapist, start to finish.</p>
            </Reveal>
            <Reveal className={styles.prop} delayIndex={1}>
              <div className={styles.propIc}>
                <svg><use href="#lp-heart" /></svg>
              </div>
              <h3>Led by Blake Radtke, DPT</h3>
              <p>Your care is guided by a local Doctor of Physical Therapy who knows the Twin Ports.</p>
            </Reveal>
            <Reveal className={styles.prop} delayIndex={2}>
              <div className={styles.propIc}>
                <svg><use href="#lp-pin" /></svg>
              </div>
              <h3>In-person or virtual</h3>
              <p>Expert care in Superior and Duluth — or online, across Minnesota and Wisconsin.</p>
            </Reveal>
            <Reveal className={styles.prop} delayIndex={3}>
              <div className={styles.propIc}>
                <svg><use href="#lp-clock" /></svg>
              </div>
              <h3>A real clinic, whole-health</h3>
              <p>A dedicated space where movement, strength, and recovery come together — so results last.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== SERVICES STRIP ===== */}
      <section className={styles.svcStrip}>
        <div className="wrap">
          <Reveal className={styles.svcCard}>
            <div className={styles.svcCardIntro}>
              <span className={styles.eyebrow}>
                <svg className={styles.leaf}><use href="#i-leaf" /></svg>
                What we treat
              </span>
              <h2>Hands-on care for every part of you.</h2>
              <p>From chronic pain to sports performance — we build the plan around your goals.</p>
            </div>
            <div className={styles.svcTags}>
              {[
                "Dry Needling",
                "Manual Therapy",
                "Strength Training",
                "Cupping",
                "Mobility",
                "Injury Recovery",
                "PT for Athletes",
              ].map((tag) => (
                <span className={styles.svcTag} key={tag}>
                  <svg><use href="#i-leaf" /></svg>
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== CONTACT FORM ===== */}
      <section className={styles.formSec} id="consult">
        <div className="wrap">
          <div className={styles.formSecGrid}>
            <Reveal className={styles.formSecCopy}>
              <span className={styles.eyebrow}>
                <svg className={styles.leaf}><use href="#i-leaf" /></svg>
                Claim your free session
              </span>
              <h2>Let&apos;s get you moving again.</h2>
              <p>
                Tell us a little about what&apos;s going on. We&apos;ll follow up to find a time that works — in-person or virtual.
              </p>
              <ul className={styles.formSecTrust}>
                <li>
                  <svg className={styles.leaf}><use href="#lp-check" /></svg>
                  <span>A free session — no pressure, no obligation</span>
                </li>
                <li>
                  <svg className={styles.leaf}><use href="#lp-check" /></svg>
                  <span>One-on-one with a Doctor of Physical Therapy</span>
                </li>
                <li>
                  <svg className={styles.leaf}><use href="#lp-check" /></svg>
                  <span>Only 10 spots — we reply within one business day</span>
                </li>
              </ul>
            </Reveal>

            <Reveal className={styles.card}>
              <LandingForm />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className={styles.footer}>
        <div className="wrap">
          <div className={styles.footerTop}>
            <div>
              <a className={styles.brand} href="#top">
                <svg className={styles.mark}><use href="#i-mark" /></svg>
                <span className={styles.brandWord}>OMNIA</span>
              </a>
              <p className={styles.footerTag}>
                Whole-health physical therapy and performance care for the Twin Ports — and beyond, virtually.
              </p>
            </div>
            <div className={styles.footerCol}>
              <h4>Contact</h4>
              <a href="tel:+12184990806">(218) 499-0806</a>
              <a href="mailto:omniatherapies@gmail.com">omniatherapies@gmail.com</a>
            </div>
            <div className={styles.footerCol}>
              <h4>Visit</h4>
              <p>
                2121 E 5th St<br />
                Superior, WI 54880
              </p>
              <p>Superior · Duluth · Virtual</p>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <span>© 2026 Omnia Wellness &amp; Recovery</span>
            <span>Superior · Duluth · Virtual — MN &amp; WI</span>
          </div>
        </div>
      </footer>

      {/* ===== STICKY MOBILE CTA ===== */}
      <div className={styles.mobileCta}>
        <a className={styles.btn} href="#consult">
          Claim my free session <span className={styles.arr}>→</span>
        </a>
      </div>
    </div>
  );
}
