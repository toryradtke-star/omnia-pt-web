import type {Metadata} from "next";
import Link from "next/link";

import {SmsTermsBody, SmsConsentQuote} from "@/components/LegalContent";

export const metadata: Metadata = {
  alternates: {canonical: "/sms-terms"},
  title: "SMS Terms & Conditions — Omnia Wellness & Recovery",
  description:
    "What you agree to when you opt in to text messages from Omnia Wellness & Recovery, and how to opt back out.",
};

export default function SmsTermsPage() {
  return (
    <>
      <header className="page-head">
        <div className="wrap">
          <div className="crumbs">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>SMS Terms &amp; Conditions</span>
          </div>
          <h1 className="page-head__title">SMS Terms</h1>
          <p className="page-head__intro">
            Text messages from Omnia Wellness &amp; Recovery are opt-in. Here is exactly what you
            are agreeing to, and how to stop them.
          </p>
        </div>
      </header>

      <main>
        <section className="section" style={{paddingTop: "clamp(20px,3vw,40px)"}}>
          <div className="wrap">
            <div className="legal">
              <SmsTermsBody />
              <p className="legal__meta">The consent checkbox on our forms reads:</p>
              <SmsConsentQuote />
              <p className="legal__foot">
                <Link href="/privacy-policy">Privacy Policy</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
