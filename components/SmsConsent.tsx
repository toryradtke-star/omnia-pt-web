"use client";

import {useState} from "react";

import {Modal} from "./Modal";
import {SmsTermsBody} from "./LegalContent";
import {SMS_CONSENT_LABEL} from "@/lib/legal";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Distinct id per form, in case two ever share a page. */
  id?: string;
};

/**
 * Optional SMS opt-in, shown only on forms that ask for a phone number.
 *
 * The terms open in a dialog rather than a link away: this sits mid-form, and
 * navigating off would throw away everything typed so far. The full text also
 * lives at /sms-terms, which is the URL carriers and GHL's A2P review want.
 *
 * Unticked is a valid submission. The number is still used to reply to the
 * enquiry — consent here is about texting, and the form says so.
 */
export function SmsConsent({checked, onChange, id = "smsConsent"}: Props) {
  const [termsOpen, setTermsOpen] = useState(false);

  return (
    <div className="sms-consent">
      <label className="sms-consent__row" htmlFor={id}>
        <input
          id={id}
          name="smsConsent"
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span>
          {SMS_CONSENT_LABEL} View our{" "}
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>{" "}
          and{" "}
          <button
            className="sms-consent__link"
            type="button"
            onClick={() => setTermsOpen(true)}
          >
            SMS Terms &amp; Conditions
          </button>
          .
        </span>
      </label>
      <p className="sms-consent__note">Optional — you can send this form without it.</p>

      <Modal
        open={termsOpen}
        onClose={() => setTermsOpen(false)}
        labelledBy="sms-terms-title"
      >
        <div className="modal__head">
          <span className="modal__eyebrow">Text messages</span>
          <h2 className="modal__title" id="sms-terms-title">
            SMS Terms &amp; Conditions
          </h2>
        </div>
        <div className="modal__body legal legal--compact">
          <SmsTermsBody newTab />
        </div>
        <div className="modal__foot">
          <a
            className="modal__link"
            href="/sms-terms"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open the full page ↗
          </a>
          <button
            className="btn btn--accent"
            type="button"
            onClick={() => setTermsOpen(false)}
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}
