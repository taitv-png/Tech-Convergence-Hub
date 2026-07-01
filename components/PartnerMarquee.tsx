import Image from "next/image";

const partners = [
  { name: "UEH", src: "/logos/ueh.png", width: 240, height: 90 },
  { name: "ISCM", src: "/logos/iscm.png", width: 240, height: 90 },
  { name: "CTD", src: "/logos/ctd.png", width: 240, height: 90 },
  { name: "UII", src: "/logos/uii.png", width: 240, height: 90 },
  { name: "SMD", src: "/logos/smd.png", width: 240, height: 90 },
  { name: "ICDC", src: "/logos/icdc.png", width: 240, height: 90 },
  { name: "3I", src: "/logos/3i.png", width: 240, height: 90 },
  { name: "Kamisoft", src: "/logos/kamisoft.png", width: 240, height: 90 },
  { name: "ISC", src: "/logos/isc.png", width: 240, height: 90 },
];

export function PartnerMarquee() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const firstRow = partners.slice(0, 5);
  const secondRow = partners.slice(5);

  const repeatedFirstRow = [...firstRow, ...firstRow, ...firstRow];
  const repeatedSecondRow = [...secondRow, ...secondRow, ...secondRow];

  return (
    <section className="container section partner-section" aria-label="Mạng lưới đối tác quốc tế">
      <div className="section-head partner-head">
        <h2>Mạng lưới đối tác quốc tế</h2>
      </div>

      <div className="partner-stack">
        <div className="partner-marquee" role="region" aria-label="Logo đối tác đang chạy ngang dòng 1">
          <div className="partner-track">
            {repeatedFirstRow.map((partner, index) => (
              <div className="partner-logo" key={`${partner.name}-row1-${index}`}>
                <Image
                  src={`${basePath}${partner.src}`}
                  alt={`Logo ${partner.name}`}
                  width={partner.width}
                  height={partner.height}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="partner-marquee partner-marquee-reverse" role="region" aria-label="Logo đối tác đang chạy ngang dòng 2">
          <div className="partner-track partner-track-reverse">
            {repeatedSecondRow.map((partner, index) => (
              <div className="partner-logo" key={`${partner.name}-row2-${index}`}>
                <Image
                  src={`${basePath}${partner.src}`}
                  alt={`Logo ${partner.name}`}
                  width={partner.width}
                  height={partner.height}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
