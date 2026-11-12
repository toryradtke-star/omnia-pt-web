/**
 * Bot screening for the lead forms.
 *
 * Bots fill the forms almost daily. Most tick the SMS box, so before this
 * existed every one of them got tagged `website-lead` and the follow-up
 * workflow emailed and texted whatever number they typed: SMS cost, and a
 * TCPA problem when that number belongs to a real person.
 *
 * Two outcomes, on purpose:
 * - "bot": the hidden honeypot field was filled. No person can see that
 *   field, so nothing is saved. The bot still gets a normal success response,
 *   so it has no reason to try anything else.
 * - "suspect": the submission looks like the bots seen so far (keyboard-mash
 *   names, Gmail addresses with dots sprinkled through them, phone numbers
 *   that can't exist, or a form finished faster than a person can type). These
 *   can be wrong about a real person, so the contact is still saved, but only
 *   with a `suspected-spam` tag. No `website-lead` tag means no alert and no
 *   automated email or texts. Blake can still find the contact and reply by hand.
 */

export type LeadVerdict =
  | {kind: "ok"}
  | {kind: "bot"; reasons: string[]}
  | {kind: "suspect"; reasons: string[]};

export type LeadSignals = {
  name: string;
  email: string;
  phone: string;
  /** Value of the hidden honeypot input. Anything non-empty is a bot. */
  honeypot: string;
  /** Milliseconds from the form appearing to the submit click, when sent. */
  elapsedMs: number | null;
};

/** Name of the hidden input. Not a word browsers autofill (company, url, …). */
export const HONEYPOT_FIELD = "omnia_hp";

/** Faster than anyone types name + phone + email, even with autofill. */
export const MIN_FILL_MS = 2500;

/**
 * "ZknuvTRIdKFMxDLhFYOZZ": one long token with capitals scattered through it.
 * Real names have spaces, or at most a couple of inner capitals (McDonald,
 * DeAngelo), so three or more inner capitals in a 12+ letter single word is
 * the bot pattern.
 */
export function isKeyboardMashName(name: string): boolean {
  const trimmed = name.trim();
  if (/\s/.test(trimmed) || trimmed.length < 12) return false;
  const innerCaps = (trimmed.slice(1).match(/[A-Z]/g) ?? []).length;
  return innerCaps >= 3;
}

/**
 * "m.at.t.h.ew.c.qk.qzw.a.rd@gmail.com": Gmail ignores dots, so bots spray
 * them in to make one inbox look like many addresses. People use one or two
 * (first.last, first.m.last); four or more is the bot pattern.
 */
export function isDotSprayedGmail(email: string): boolean {
  const [local, domain] = email.trim().toLowerCase().split("@");
  if (!local || !domain) return false;
  if (domain !== "gmail.com" && domain !== "googlemail.com") return false;
  return (local.match(/\./g) ?? []).length >= 4;
}

/**
 * A US/Canada number that can't be dialled. Area codes and exchanges never
 * start with 0 or 1 ("+10000000000"). Bot-typed numbers outside North
 * America don't fit the 10-digit shape at all.
 */
export function isImpossiblePhone(phone: string): boolean {
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  if (digits.length !== 10) return true;
  return /^[01]/.test(digits) || /^[01]/.test(digits.slice(3));
}

export function assessLead(s: LeadSignals): LeadVerdict {
  if (s.honeypot.trim()) return {kind: "bot", reasons: ["honeypot filled"]};

  const reasons: string[] = [];
  if (isKeyboardMashName(s.name)) reasons.push("keyboard-mash name");
  if (isDotSprayedGmail(s.email)) reasons.push("dot-sprayed gmail");
  if (isImpossiblePhone(s.phone)) reasons.push("impossible phone");
  if (s.elapsedMs !== null && s.elapsedMs < MIN_FILL_MS) {
    reasons.push(`form filled in ${s.elapsedMs}ms`);
  }

  return reasons.length > 0 ? {kind: "suspect", reasons} : {kind: "ok"};
}
