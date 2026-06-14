"use client";

import {useEffect, useRef} from "react";

type Props = {
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  style?: React.CSSProperties;
  delayIndex?: number;
  children: React.ReactNode;
};

export function Reveal({
  as = "div",
  className,
  style,
  delayIndex = 0,
  children,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      {threshold: 0.12, rootMargin: "0px 0px -8% 0px"},
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as React.ElementType;
  const combinedStyle: React.CSSProperties = {
    transitionDelay: `${Math.min(delayIndex % 6, 4) * 60}ms`,
    ...style,
  };
  const combinedClass = ["reveal", className].filter(Boolean).join(" ");

  return (
    <Tag ref={ref} className={combinedClass} style={combinedStyle}>
      {children}
    </Tag>
  );
}
