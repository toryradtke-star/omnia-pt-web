"use client";

import {useState} from "react";

type Errors = Partial<Record<"name" | "email" | "phone" | "message", string>>;

const checks: Record<"name" | "email" | "phone" | "message", (v: string) => string> = {
  name: (v) => (v.trim() ? "" : "Please enter your name."),
  email: (v) =>
    /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim()) ? "" : "Enter a valid email.",
  phone: (v) => (v.replace(/\D/g, "").length >= 10 ? "" : "Enter a valid phone."),
  message: (v) => (v.trim().length >= 5 ? "" : "Tell us a little more."),
};

type Props = {formNote: string};

export function ContactForm({formNote}: Props) {
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  function clearError(name: keyof Errors) {
    if (errors[name]) setErrors((e) => ({...e, [name]: undefined}));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const next: Errors = {};
    (Object.keys(checks) as Array<keyof Errors>).forEach((id) => {
      const msg = checks[id](String(data.get(id) ?? ""));
      if (msg) next[id] = msg;
    });
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // TODO: wire to an actual form endpoint
    setSubmitted(true);
    form.reset();
    requestAnimationFrame(() => {
      const banner = document.getElementById("success");
      if (banner) {
        const top = banner.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({top, behavior: "smooth"});
      }
    });
  }

  return (
    <>
      <div
        className={`success-banner${submitted ? " show" : ""}`}
        id="success"
      >
        ✓ Thanks — your message is on its way. We&apos;ll get back to you shortly.
      </div>

      <form id="contactForm" noValidate onSubmit={onSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              className={errors.name ? "err" : ""}
              onInput={() => clearError("name")}
            />
            <div className="msg">{errors.name ?? ""}</div>
          </div>
          <div className="form-field">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              className={errors.phone ? "err" : ""}
              onInput={() => clearError("phone")}
            />
            <div className="msg">{errors.phone ?? ""}</div>
          </div>
          <div className="form-field full">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className={errors.email ? "err" : ""}
              onInput={() => clearError("email")}
            />
            <div className="msg">{errors.email ?? ""}</div>
          </div>
          <div className="form-field full">
            <label htmlFor="topic">I&apos;m interested in</label>
            <select id="topic" name="topic">
              <option>Booking an appointment</option>
              <option>Dry needling</option>
              <option>Manual therapy</option>
              <option>Strength training</option>
              <option>Virtual sessions</option>
              <option>Insurance &amp; pricing</option>
              <option>Something else</option>
            </select>
          </div>
          <div className="form-field full">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder="Tell us a little about what's going on and your goals…"
              className={errors.message ? "err" : ""}
              onInput={() => clearError("message")}
            />
            <div className="msg">{errors.message ?? ""}</div>
          </div>
        </div>
        <button className="btn btn--accent btn--lg" type="submit">
          Send message <span className="arr">→</span>
        </button>
        <p className="form-note">{formNote}</p>
      </form>
    </>
  );
}
