"use client";

import {useEffect} from "react";

/**
 * Reports every tap on a phone number (any `tel:` link, anywhere on the site)
 * to GA4 as `click_to_call`. Calls placed from the site were invisible before
 * this: Google Ads only sees calls from its own ad call button, and a call
 * never creates a HighLevel contact.
 *
 * GA4 attaches the visit's source to the event, so calls can be split by
 * Google Ads, organic search, Facebook and so on. A tap is intent, not a
 * finished call: someone can tap and hang up.
 *
 * One document-level listener rather than an onClick on each link, so a phone
 * link added later (or coming from Sanity content) is counted without anyone
 * remembering to wire it. gtag only exists on the live site, so previews and
 * local builds send nothing. Renders nothing.
 */
export function CallTracking() {
  useEffect(() => {
    let lastSent = 0;

    function onClick(event: MouseEvent) {
      const target = event.target as Element | null;
      const link = target?.closest?.('a[href^="tel:"]');
      if (!link || typeof window.gtag !== "function") return;

      // A double tap is one call, not two.
      const now = Date.now();
      if (now - lastSent < 2000) return;
      lastSent = now;

      window.gtag("event", "click_to_call", {
        link_location: where(link),
        page_path: window.location.pathname,
      });
    }

    document.addEventListener("click", onClick, {capture: true});
    return () => document.removeEventListener("click", onClick, {capture: true});
  }, []);

  return null;
}

/** Which part of the page the number was tapped in, for the GA4 report. */
function where(link: Element): string {
  if (link.closest("header")) return "header";
  if (link.closest("footer")) return "footer";
  if (link.closest("form")) return "form";
  return "page";
}
