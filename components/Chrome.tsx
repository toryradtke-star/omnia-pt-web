"use client";

import {usePathname} from "next/navigation";
import {Nav} from "./Nav";
import {Footer} from "./Footer";
import type {SiteSettings} from "@/sanity/lib/types";

type Props = {
  settings: SiteSettings;
  children: React.ReactNode;
};

export function Chrome({settings, children}: Props) {
  const pathname = usePathname();

  // Appointment and free-session pages render without global nav/footer
  // (focused booking and ad-conversion flows with their own minimal chrome).
  if (pathname === "/appointment" || pathname === "/free-session") {
    return <>{children}</>;
  }

  const variant = pathname === "/" ? "transparent" : "solid";
  const showAddress = pathname === "/contact";

  return (
    <>
      <Nav settings={settings} variant={variant} />
      {children}
      <Footer settings={settings} showAddress={showAddress} />
    </>
  );
}
