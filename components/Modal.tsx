"use client";

import {useEffect, useRef} from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

type Props = {
  open: boolean;
  /**
   * Omit to make the dialog undismissable by Escape or a backdrop click — the
   * privacy notice has exactly one way out, and that is the accept button.
   */
  onClose?: () => void;
  /** Id of the element holding the dialog's heading. */
  labelledBy: string;
  className?: string;
  children: React.ReactNode;
};

export function Modal({open, onClose, labelledBy, className, children}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Focus the panel itself so the dialog is announced from its heading down.
    panel?.focus();

    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && onClose) {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel) return;

      // Keep Tab inside the dialog; without this the focus ring walks off into
      // the page behind it, which is unreachable by mouse.
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = bodyOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal"
      onMouseDown={(event) => {
        if (onClose && event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className={`modal__panel${className ? ` ${className}` : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  );
}
