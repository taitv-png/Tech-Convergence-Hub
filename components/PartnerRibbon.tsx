import Image from "next/image";
import { SectionHeading } from "./SectionHeading";

const partners = ["ueh", "iscm", "ctd", "uii", "smd", "icdc", "3i", "kamisoft", "isc"];
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// One slow, continuous ribbon. Three identical groups make the loop seamless on wide
// screens; reduced motion turns it into a static, scrollable row (app/motion.css).
export function PartnerRibbon() {
  return (
    <section className="collaboration-section" aria-label="Mạng lưới hợp tác TCH">
      <div className="site-container collaboration-heading">
        <SectionHeading title="Mạng lưới hợp tác">
          Hội tụ năng lực. <span>Mở rộng kết nối.</span>
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
