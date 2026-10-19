/**
 * Where a website lead came from: the ad click ids and campaign tags on the
 * URL the visitor arrived on, and the site that sent them.
 *
 * Captured once per visit on the browser (first page wins, so clicking around
 * the site doesn't overwrite an ad click with "direct"), sent with the form,
 * and turned into a channel on the server. The channel becomes a contact tag
 * ("from-google-ads") and a line in the notes; lead reporting reads the tag
 * when an opportunity has no source. Until this existed every website lead
 * arrived with no source at all, so Google Ads leads were indistinguishable
 * from someone typing the URL.
 *
 * Labels deliberately avoid platform names unless the visit was paid: a
 * report that matches "google" or "facebook" in a source must not count an
 * organic search or a shared Facebook post as an ad lead.
 */

export const ATTRIBUTION_KEYS = [
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export type Attribution = Partial<Record<(typeof ATTRIBUTION_KEYS)[number] | "referrer" | "landing", string>>;

const STORAGE_KEY = "omnia-attribution";
const MAX = 200;

/** Keeps only known keys with short string values: this arrives from the browser and is not trusted. */
export function cleanAttribution(raw: unknown): Attribution {
  if (!raw || typeof raw !== "object") return {};
  const out: Attribution = {};
  for (const key of [...ATTRIBUTION_KEYS, "referrer", "landing"] as const) {
    const v = (raw as Record<string, unknown>)[key];
    if (typeof v === "string" && v.trim()) out[key] = v.trim().slice(0, MAX);
  }
  return out;
}

const PAID_MEDIUM = /^(cpc|ppc|paid|paidsearch|paid_search|paid_social|paidsocial|ads?|display)$/i;
const META_SOURCE = /^(facebook|fb|instagram|ig|meta)$/i;
const SEARCH_HOSTS = /(^|\.)(google|bing|duckduckgo|yahoo|ecosia)\./i;
const SOCIAL_HOSTS = /(^|\.)(facebook|instagram|fb|t|x|twitter|linkedin|tiktok|pinterest|youtube)\.(com|co|me)$/i;

export type Channel = {label: string; paid: boolean};

/**
 * - a Google click id, or Google tagged as paid → Google Ads
 * - Facebook/Instagram tagged as paid → Meta ads (a bare fbclid is added to
 *   every outbound Facebook link, ads or not, so on its own it's "social")
 * - otherwise organic search, social, referral or direct
 */
export function channelOf(a: Attribution, siteHost = "omniatherapies.com"): Channel {
  const source = (a.utm_source ?? "").toLowerCase();
  const medium = a.utm_medium ?? "";
  if (a.gclid || a.gbraid || a.wbraid || (source === "google" && PAID_MEDIUM.test(medium))) return {label: "Google Ads", paid: true};
  if (META_SOURCE.test(source) && PAID_MEDIUM.test(medium)) return {label: "Meta ads", paid: true};
  if (source && PAID_MEDIUM.test(medium)) return {label: "other paid ads", paid: true};
  let host = "";
  try {
    host = a.referrer ? new URL(a.referrer).hostname.replace(/^www\./, "") : "";
  } catch {
    host = "";
  }
  if (host && (host === siteHost || host.endsWith(`.${siteHost}`))) host = "";
  if (a.fbclid || META_SOURCE.test(source) || (host && SOCIAL_HOSTS.test(host))) return {label: "social", paid: false};
  if (host && SEARCH_HOSTS.test(host)) return {label: "organic search", paid: false};
  if (source === "google" || source === "bing") return {label: "organic search", paid: false};
  if (host || source) return {label: "referral", paid: false};
  return {label: "direct", paid: false};
}

/** The HighLevel tag for a channel: "from-google-ads", "from-organic-search", "from-direct". */
export function channelTag(c: Channel): string {
  return `from-${c.label.toLowerCase().replace(/\s+/g, "-")}`;
}

/** One line for the lead's notes in HighLevel, so whoever opens it can see the campaign. */
export function describe(a: Attribution): string {
  const parts = [
    a.utm_source && `source ${a.utm_source}`,
    a.utm_medium && `medium ${a.utm_medium}`,
    a.utm_campaign && `campaign ${a.utm_campaign}`,
    a.utm_term && `term ${a.utm_term}`,
    (a.gclid || a.gbraid || a.wbraid) && "Google click id present",
    a.referrer && `referred by ${a.referrer}`,
    a.landing && `landed on ${a.landing}`,
  ].filter(Boolean);
  return parts.join(" · ");
}

/** Browser: remember the first page of this visit's tags. Safe to call on every page. */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    if (window.sessionStorage.getItem(STORAGE_KEY)) return;
    const params = new URLSearchParams(window.location.search);
    const a: Attribution = {};
    for (const key of ATTRIBUTION_KEYS) {
      const v = params.get(key);
      if (v) a[key] = v.slice(0, MAX);
    }
    if (document.referrer) a.referrer = document.referrer.slice(0, MAX);
    a.landing = window.location.pathname.slice(0, MAX);
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(a));
  } catch {
    // Storage blocked: the lead still goes through, just without a channel.
  }
}

/** Browser: what captureAttribution saved, for the form to send. */
export function readAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    return cleanAttribution(JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? "{}"));
  } catch {
    return {};
  }
}
