"use client";

import {useRef, useState} from "react";
import {PortableText} from "@portabletext/react";
import type {PortableTextBlock} from "@portabletext/react";

type FaqEntry = {question: string; answer: PortableTextBlock[]};

type Props = {faqs: FaqEntry[]};

export function Faq({faqs}: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const answerRefs = useRef<Array<HTMLDivElement | null>>([]);

  const toggle = (i: number) => {
    setOpenIndex((current) => (current === i ? null : i));
  };

  return (
    <div className="faq">
      {faqs.map((item, i) => {
        const isOpen = openIndex === i;
        const innerHeight =
          answerRefs.current[i]?.firstElementChild?.scrollHeight ?? 0;
        return (
          <div key={i} className={`faq__item${isOpen ? " is-open" : ""}`}>
            <button
              className="faq__q"
              type="button"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
            >
              {item.question}
              <span className="icon" />
            </button>
            <div
              className="faq__a"
              ref={(el) => {
                answerRefs.current[i] = el;
              }}
              style={{height: isOpen ? innerHeight : 0}}
            >
              <div className="faq__a-inner">
                <PortableText value={item.answer} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
