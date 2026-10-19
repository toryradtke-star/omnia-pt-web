"use client";

import {useEffect} from "react";

import {captureAttribution} from "@/lib/attribution";

/** Records the ad click / campaign tags of the page a visit starts on. Renders nothing. */
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
