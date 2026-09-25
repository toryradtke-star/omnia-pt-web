"use client";

import {usePathname} from "next/navigation";
import {useState, useSyncExternalStore} from "react";

import {Modal} from "./Modal";
import {PrivacyPolicyBody} from "./LegalContent";
import {PRIVACY_EFFECTIVE_DATE} from "@/lib/legal";

/**
 * Entry notice: the privacy policy is shown once per browser and stays gone
 * after it is accepted.
 *
 * The key carries the effective date. Change the policy, change the date, and
 * every visitor is shown the new one once — without that, a returning visitor
 * would only ever see the version they happened to accept first.
 */
const STORAGE_KEY = "omnia-privacy-accepted-2026-09-25";

/**
 * The paid-traffic landing page is left alone. A dialog between the ad click
 * and the form costs conversions, and the page carries the same privacy and
 * SMS links in its footer and beside its consent checkbox. Someone who arrives
 * there first still sees the notice the moment they move onto the site proper.
 */
const EXEMPT_PATHS = ["/free-session"];

function subscribe(onChange: () => void) {
  // Another tab accepting counts here too.
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function readAccepted() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    // Storage blocked (private windows, some embedded browsers). Showing the
    // notice again is the harmless direction to fail in.
    return false;
  }
}

/**
 * On the server there is no storage to read, so the notice is treated as
 * already accepted: the dialog is absent from the HTML and appears once the
 * browser has said it has not seen it. Guessing the other way would flash the
 * notice at everyone who already accepted it.
 */
function readAcceptedOnServer() {
  return true;
}

export function PrivacyGate() {
  const pathname = usePathname();
  const storedAccepted = useSyncExternalStore(subscribe, readAccepted, readAcceptedOnServer);
  // `storage` events don't fire in the tab that wrote them, so this tab's own
  // acceptance is held in state.
  const [acceptedHere, setAcceptedHere] = useState(false);

  function accept() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Can't remember it — the notice reappears next visit, which is fine.
    }
    setAcceptedHere(true);
  }

  return (
    <Modal
      open={!storedAccepted && !acceptedHere && !EXEMPT_PATHS.includes(pathname)}
      labelledBy="privacy-gate-title"
    >
      <div className="modal__head">
        <span className="modal__eyebrow">{PRIVACY_EFFECTIVE_DATE}</span>
        <h2 className="modal__title" id="privacy-gate-title">
          Privacy Policy
        </h2>
      </div>
      <div className="modal__body legal legal--compact">
        <PrivacyPolicyBody newTab />
      </div>
      <div className="modal__foot">
        <a
          className="modal__link"
          href="/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open the full page ↗
        </a>
        <button className="btn btn--accent" type="button" onClick={accept}>
          I understand
        </button>
      </div>
    </Modal>
  );
}
