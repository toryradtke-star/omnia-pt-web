"use client";

import {useState} from "react";
import styles from "@/app/free-session/free-session.module.css";

type FieldId = "name" | "phone" | "email" | "topic";

const TOPICS = [
  "Booking an appointment",
  "Dry needling",
  "Manual therapy",
  "Strength training",
  "Virtual sessions",
  "Insurance & pricing",
  "Something else",
];

const MESSAGES: Record<FieldId, string> = {
  name: "Please enter your name.",
  phone: "Please enter a valid phone number.",
  email: "Please enter a valid email address.",
  topic: "Please choose an option.",
};

function isValid(id: FieldId, value: string): boolean {
  const v = value.trim();
  if (id === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  if (id === "phone") return v.replace(/[^0-9]/g, "").length >= 10;
  return v.length > 0;
}

type Values = {name: string; phone: string; email: string; topic: string; message: string};

const EMPTY: Values = {name: "", phone: "", email: "", topic: "", message: ""};

let leadConversionFired = false;

function fireLeadConversion() {
  if (leadConversionFired) return;
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  leadConversionFired = true;

  window.gtag("event", "conversion", {
    send_to: "AW-18242550859/hg8QCLqihMUcEMv43PpD",
    value: 49.0,
    currency: "USD",
  });

  window.gtag("event", "generate_lead", {
    send_to: "G-YZRX1S1WNQ",
    value: 49.0,
    currency: "USD",
  });
}

export function LandingForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Record<FieldId, boolean>>({
    name: false, phone: false, email: false, topic: false,
  });
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function update(id: keyof Values, value: string) {
    setValues((prev) => ({...prev, [id]: value}));
    // Revalidate this field only if it currently shows an error.
    if (id in errors && errors[id as FieldId]) {
      setErrors((prev) => ({...prev, [id]: !isValid(id as FieldId, value)}));
    }
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(false);

    const next: Record<FieldId, boolean> = {
      name: !isValid("name", values.name),
      phone: !isValid("phone", values.phone),
      email: !isValid("email", values.email),
      topic: !isValid("topic", values.topic),
    };
    setErrors(next);
    const firstErr = (Object.keys(next) as FieldId[]).find((k) => next[k]);
    if (firstErr) {
      const el = document.getElementById(`f-${firstErr}`);
      el?.focus();
      return;
    }

    const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

    // No key configured → validate-only, show success so the page still works.
    if (!ACCESS_KEY || ACCESS_KEY.startsWith("YOUR-WEB3FORMS")) {
      setSubmitted(true);
      return;
    }

    const payload = {
      access_key: ACCESS_KEY,
      subject: `New free-session request — ${values.name.trim()}`,
      from_name: "Omnia Landing Page",
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      topic: values.topic,
      message: values.message.trim() || "(no message)",
    };

    setSending(true);
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {"Content-Type": "application/json", Accept: "application/json"},
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((data) => {
        setSending(false);
        if (data && data.success) {
          fireLeadConversion();
          setSubmitted(true);
        } else setSubmitError(true);
      })
      .catch(() => {
        setSending(false);
        setSubmitError(true);
      });
  }

  const fieldClass = (id: FieldId) =>
    `${styles.field}${id === "email" || id === "topic" ? " " + styles.full : ""}`;
  const inputClass = (id: FieldId) => (errors[id] ? styles.err : "");
  const msgClass = (id: FieldId) => `${styles.msg}${errors[id] ? " " + styles.show : ""}`;

  if (submitted) {
    return (
      <div className={`${styles.success} ${styles.show}`} role="status" aria-live="polite">
        <div className={styles.successIc}>
          <svg><use href="#lp-check" /></svg>

        </div>
        <h3>Your spot is reserved.</h3>
        <p>Thanks — we&apos;ve got your details and we&apos;ll reach out within one business day to schedule your free session.</p>
        <div className={styles.monoLine}>Need us sooner? Call (218) 499-0806</div>
      </div>
    );
  }

  return (
    <form id="consultForm" noValidate onSubmit={onSubmit}>
      <div className={styles.cardTitle}>Claim your free session</div>
      <div className={styles.cardSub}>It takes about 60 seconds</div>
      <div className={styles.formGrid}>
        <div className={fieldClass("name")}>
          <label htmlFor="f-name">
            Name <span className={styles.req}>*</span>
          </label>
          <input
            id="f-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputClass("name")}
          />
          <div className={msgClass("name")}>{MESSAGES.name}</div>
        </div>
        <div className={fieldClass("phone")}>
          <label htmlFor="f-phone">
            Phone <span className={styles.req}>*</span>
          </label>
          <input
            id="f-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="(218) 000-0000"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={inputClass("phone")}
          />
          <div className={msgClass("phone")}>{MESSAGES.phone}</div>
        </div>
        <div className={fieldClass("email")}>
          <label htmlFor="f-email">
            Email <span className={styles.req}>*</span>
          </label>
          <input
            id="f-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputClass("email")}
          />
          <div className={msgClass("email")}>{MESSAGES.email}</div>
        </div>
        <div className={fieldClass("topic")}>
          <label htmlFor="f-topic">
            What can we help with? <span className={styles.req}>*</span>
          </label>
          <select
            id="f-topic"
            name="topic"
            value={values.topic}
            onChange={(e) => update("topic", e.target.value)}
            className={inputClass("topic")}
          >
            <option value="" disabled>
              Choose one…
            </option>
            {TOPICS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <div className={msgClass("topic")}>{MESSAGES.topic}</div>
        </div>
        <div className={`${styles.field} ${styles.full}`}>
          <label htmlFor="f-message">Message</label>
          <textarea
            id="f-message"
            name="message"
            placeholder="What's going on, and what are your goals? (optional)"
            value={values.message}
            onChange={(e) => update("message", e.target.value)}
          />
        </div>
      </div>
      <div className={styles.formFoot}>
        <button
          className={`${styles.btn} ${styles.btnLg} ${styles.btnBlock}`}
          type="submit"
          disabled={sending}
        >
          {sending ? "Sending…" : (
            <>
              Claim my free session <span className={styles.arr}>→</span>
            </>
          )}
        </button>
        <p className={styles.formNote}>
          <svg className={styles.leaf}><use href="#i-leaf" /></svg>
          We&apos;ll reach out within one business day to schedule.
        </p>
        <p
          className={`${styles.formError}${submitError ? " " + styles.show : ""}`}
          role="alert"
        >
          Something went wrong. Please call{" "}
          <a href="tel:+12184990806">(218)&nbsp;499-0806</a> or email us directly.
        </p>
      </div>
    </form>
  );
}
