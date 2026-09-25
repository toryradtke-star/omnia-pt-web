import type {Metadata} from "next";
import Link from "next/link";

import {PrivacyPolicyBody} from "@/components/LegalContent";
import {PRIVACY_EFFECTIVE_DATE} from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy — Omnia Wellness & Recovery",
  description:
    "How Omnia Wellness & Recovery collects, uses, and shares information submitted through our website or when you contact the practice.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <header className="page-head">
        <div className="wrap">
          <div className="crumbs">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Privacy Policy</span>
          </div>
          <h1 className="page-head__title">Privacy Policy</h1>
          <p className="page-head__intro legal__meta">{PRIVACY_EFFECTIVE_DATE}</p>
        </div>
      </header>

      <main>
        <section className="section" style={{paddingTop: "clamp(20px,3vw,40px)"}}>
          <div className="wrap">
            <div className="legal">
              <PrivacyPolicyBody />
              <p className="legal__foot">
                Looking for the texting rules?{" "}
                <Link href="/sms-terms">SMS Terms &amp; Conditions</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
