"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect, useState} from "react";
import {Icon} from "./Icon";
import type {SiteSettings} from "@/sanity/lib/types";

type Props = {
  settings: SiteSettings;
  variant?: "transparent" | "solid";
};

// Anchor-only hrefs (e.g. "#why") in Sanity should always resolve against the homepage,
// not against the current route.
function resolveHref(href: string) {
  return href.startsWith("#") ? `/${href}` : href;
}

function isActive(href: string, pathname: string) {
  if (href.startsWith("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Nav({settings, variant = "transparent"}: Props) {
  const pathname = usePathname();
  const [stuck, setStuck] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, {passive: true});
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navClass = [
    "nav",
    variant === "solid" ? "nav--solid" : "",
    stuck ? "is-stuck" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <nav className={navClass} id="nav">
        <Link className="nav__brand" href="/">
          <Icon name="mark" className="mark" />
          {settings.brandName}
        </Link>
        <div className="nav__links">
          {settings.navLinks?.map((link) => (
            <Link
              key={link.href}
              className={`nav__link${isActive(link.href, pathname) ? " is-active" : ""}`}
              href={resolveHref(link.href)}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <Link className="nav__cta" href={settings.navCtaHref}>
          {settings.navCtaLabel}
        </Link>
        <button
          className="nav__toggle btn btn--ghost"
          id="navToggle"
          aria-label="Open menu"
          style={{padding: ".6em .9em"}}
          onClick={() => setMenuOpen(true)}
        >
          Menu
        </button>
      </nav>

      <div className={`mobile-menu${menuOpen ? " is-open" : ""}`} id="mobileMenu">
        <button
          className="close"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        >
          ×
        </button>
        {settings.navLinks?.map((link) => (
          <Link
            key={link.href}
            href={resolveHref(link.href)}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href={settings.navCtaHref}
          style={{color: "var(--moss-soft)"}}
          onClick={() => setMenuOpen(false)}
        >
          Schedule →
        </Link>
      </div>
    </>
  );
}
