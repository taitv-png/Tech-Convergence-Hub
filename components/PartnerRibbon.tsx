"use client";

import Image from "next/image";
import { useState } from "react";
import { SectionHeading } from "./SectionHeading";

const partners = ["ueh", "iscm", "ctd", "uii", "smd", "icdc", "3i", "kamisoft", "isc"];
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export function PartnerRibbon() {
  const [paused, setPaused] = useState(false);
  return (
    <section
      className={`collaboration-section${paused ? " is-paused" : ""}`}
      aria-label="Mạng lưới hợp tác TCH"
    >
      <div className="site-container collaboration-heading">
        <SectionHeading number="07" title="Mạng lưới hợp tác">
          Hội tụ năng lực. <span>Mở rộng kết nối.</span>
        </SectionHeading>
        <button onClick={() => setPaused(!paused)} aria-pressed={paused} className="marquee-toggle">
          {paused ? "Tiếp tục chuyển động" : "Dừng chuyển động"}
          <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>
        </button>
      </div>
      {[partners.slice(0, 5), partners.slice(5)].map((row, index) => (
        <div className="collaboration-marquee" key={index}>
          <div className={`collaboration-track${index ? " is-reversed" : ""}`}>
            {[0, 1].map((copy) => (
              <div
                className="collaboration-group"
                key={copy}
                aria-hidden={copy === 1 ? true : undefined}
              >
                {row.map((name) => (
                  <div className={`collaboration-logo logo-${name}`} key={name}>
                    <Image
                      src={base + "/logos/" + name + ".png"}
                      width={240}
                      height={90}
                      alt={name.toUpperCase()}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
