/**
 * Legal constants shared by the pages, the dialogs, and the lead route.
 *
 * Plain values in their own module so the API route can store the consent
 * wording it was given without importing React components to get at it.
 */

export const PRIVACY_EFFECTIVE_DATE = "Effective September 25, 2026";

export const PRACTICE_NAME = "Omnia Wellness & Recovery";
export const PRACTICE_PHONE = "(218) 499-0806";
export const PRACTICE_PHONE_HREF = "tel:+12184990806";
export const PRACTICE_EMAIL = "omniatherapies@gmail.com";

/**
 * The exact consent language shown beside the checkbox. Stored with the lead,
 * so what the person agreed to is recoverable months later.
 */
export const SMS_CONSENT_LABEL =
  "I agree to receive text messages from Omnia Wellness & Recovery about my inquiry, " +
  "scheduling, appointments, follow-up communications, and billing questions. " +
  "Message frequency varies. Message and data rates may apply. " +
  "Reply STOP to opt out or HELP for assistance.";
