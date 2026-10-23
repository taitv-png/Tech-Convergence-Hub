import Image from "next/image";
import { SectionHeading } from "./SectionHeading";
import { getDictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";

// Partners shown in the ribbon (Kamisoft removed at the user's request, 2026-10-22).
const partners = ["ueh", "iscm", "ctd", "uii", "smd", "icdc", "3i", "isc"];
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// One slow, continuous ribbon. Three identical groups make the loop seamless on wide
// screens; reduced motion turns it into a static, scrollable row (app/motion.css).
export function PartnerRibbon({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).partners;
  return (
    <section className="collaboration-section" aria-label={t.label}>
      <div className="site-container collaboration-heading">
        <SectionHeading title={t.title}>
          {t.deckA} <span>{t.deckB}</span>
        </SectionHeading>
      </div>
      <div className="collaboration-marquee">
        <div className="collaboration-track">
          {[0, 1, 2].map((copy) => (
            <div className="collaboration-group" key={copy} aria-hidden={copy > 0 ? true : undefined}>
              {partners.map((name) => (
                <div className={`collaboration-logo logo-${name}`} key={name}>
                  <Image
                    src={base + "/logos/" + name + ".png"}
                    width={240}
                    height={90}
                    alt={copy > 0 ? "" : name.toUpperCase()}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
