/**
 * The legal copy, written once and rendered in every place it has to appear:
 * the standalone pages, the entry pop-up, and the SMS terms dialog next to the
 * consent checkbox. Carriers and GHL's A2P review compare the wording in the
 * form against the wording on the public page, so there is exactly one source
 * for each of these texts.
 *
 * Plain markup, no client hooks, so it renders inside server pages and inside
 * the client dialogs alike.
 */

import {
  PRACTICE_EMAIL,
  PRACTICE_NAME,
  PRACTICE_PHONE,
  PRACTICE_PHONE_HREF,
  SMS_CONSENT_LABEL,
} from "@/lib/legal";

type BodyProps = {
  /**
   * True when the copy is rendered inside a dialog: cross-links then open in a
   * new tab so the reader keeps the page (and any half-filled form) behind it.
   */
  newTab?: boolean;
};

function linkProps(newTab?: boolean) {
  return newTab ? {target: "_blank", rel: "noopener noreferrer"} : {};
}

export function PrivacyPolicyBody({newTab}: BodyProps) {
  return (
    <>
      <p>
        {PRACTICE_NAME} respects your privacy. This policy explains how we collect, use, and
        share information submitted through our website or when you contact our practice.
      </p>
      <p>
        <strong>Information we collect.</strong> You may provide your name, phone number, email
        address, appointment request, and any information you include in a contact form or
        message. Our website may also collect basic technical information, such as browser and
        device information, through cookies or similar tools.
      </p>
      <p>
        <strong>How we use information.</strong> We use this information to respond to inquiries,
        schedule and manage appointments, communicate about services you request, address billing
        questions, operate our website, and meet applicable legal obligations.
      </p>
      <p>
        <strong>How we share information.</strong> We may share information with service providers
        that help us operate the practice, such as our scheduling, communications, and website
        providers, as needed to provide their services. We may also disclose information when
        required by law. Mobile opt-in information, SMS consent, and phone numbers will not be
        shared with third parties or affiliates for marketing purposes.
      </p>
      <p>
        <strong>
          We do not sell or rent your personal information, and we do not share it with third
          parties for their own marketing purposes.
        </strong>
      </p>
      <p>
        <strong>Text messages.</strong> If you consent to receive SMS messages from{" "}
        {PRACTICE_NAME}, we may text you about your inquiry, scheduling, appointment reminders,
        follow-up communications, or billing questions. See our{" "}
        <a href="/sms-terms" {...linkProps(newTab)}>
          SMS Terms &amp; Conditions
        </a>{" "}
        for details. You can withdraw SMS consent at any time by replying STOP.
      </p>
      <p>
        <strong>Your choices and rights.</strong> You may contact us to request access to,
        correction of, or deletion of personal information you have provided, subject to
        applicable recordkeeping and legal requirements. You may also ask us to stop sending you
        text messages. For questions or requests, call{" "}
        <a href={PRACTICE_PHONE_HREF}>{PRACTICE_PHONE}</a> or email{" "}
        <a href={`mailto:${PRACTICE_EMAIL}`}>{PRACTICE_EMAIL}</a>.
      </p>
      <p>
        Information maintained as part of your patient care may also be covered by our separate
        Notice of Privacy Practices.
      </p>
    </>
  );
}

export function SmsTermsBody({newTab}: BodyProps) {
  return (
    <>
      <p>
        By opting in to text messages from {PRACTICE_NAME}, you agree to receive messages related
        to your inquiry or care, such as responses to your questions, scheduling and appointment
        reminders, follow-up communications, and billing inquiries.
      </p>
      <p>
        You may opt in by selecting the optional SMS consent checkbox on our website form or by
        expressly agreeing to receive texts when speaking with our staff. Providing a phone number
        alone does not sign you up for text messages.
      </p>
      <p>
        Message frequency varies based on your inquiries and appointments. Message and data rates
        may apply according to your wireless carrier&apos;s plan.
      </p>
      <p>
        Reply STOP to any message to opt out at any time. Reply HELP for assistance, or contact us
        at <a href={PRACTICE_PHONE_HREF}>{PRACTICE_PHONE}</a> or{" "}
        <a href={`mailto:${PRACTICE_EMAIL}`}>{PRACTICE_EMAIL}</a>. You can submit our website form
        without selecting the SMS consent checkbox.
      </p>
      <p>
        Mobile opt-in information, SMS consent, and phone numbers will not be shared with third
        parties or affiliates for marketing purposes. See our{" "}
        <a href="/privacy-policy" {...linkProps(newTab)}>
          Privacy Policy
        </a>{" "}
        for more information.
      </p>
    </>
  );
}

/** The checkbox as it appears on the forms, quoted for the public SMS page. */
export function SmsConsentQuote() {
  return (
    <div className="legal__consent">
      <span className="legal__consent-box" aria-hidden="true">
        ☐
      </span>
      <p>
        {SMS_CONSENT_LABEL} View our <a href="/privacy-policy">Privacy Policy</a> and{" "}
        <a href="/sms-terms">SMS Terms &amp; Conditions</a>.
      </p>
    </div>
  );
}
