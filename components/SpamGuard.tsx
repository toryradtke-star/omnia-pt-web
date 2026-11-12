"use client";

import {useCallback, useEffect, useRef} from "react";

import {HONEYPOT_FIELD} from "@/lib/spam";

/**
 * A text input no person sees. Form-filling bots fill every input they find,
 * so a value here marks the submission as a bot (see lib/spam.ts).
 *
 * Hidden by moving it off-screen rather than display:none, which some bots
 * skip. It's out of the tab order and hidden from screen readers so no
 * visitor can land in it by accident.
 */
export function HoneypotField() {
  return (
    <div
      aria-hidden="true"
      style={{position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden"}}
    >
      <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
      <input
        id={HONEYPOT_FIELD}
        name={HONEYPOT_FIELD}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}

/** Returns a function giving ms since the form mounted, for the bot check. */
export function useFillTimer(): () => number | null {
  const startedAt = useRef<number | null>(null);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  return useCallback(
    () => (startedAt.current === null ? null : Date.now() - startedAt.current),
    [],
  );
}

/** Reads the honeypot from the submitted form. */
export function honeypotValue(form: HTMLFormElement): string {
  return String(new FormData(form).get(HONEYPOT_FIELD) ?? "");
}
