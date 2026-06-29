import Image from "next/image";

const partners = [
  { name: "UEH", src: "/logos/ueh.png", width: 220, height: 84 },
  { name: "ISCM", src: "/logos/iscm.png", width: 240, height: 84 },
  { name: "CTD", src: "/logos/ctd.png", width: 220, height: 84 },
];

export function PartnerMarquee() {
  const repeatedPartners = [
    ...partners,
    ...partners,
    ...partners,
  ];

  return (
    <section className="container section partner-section" aria-label="Mạng lưới đối tác quốc tế">
      <div className="section-head partner-head">
        <h2>Mạng lưới đối tác quốc tế</h2>
      </div>

      <div className="partner-marquee" role="region" aria-label="Logo đối tác đang chạy ngang">
        <div className="partner-track">
          {repeatedPartners.map((partner, index) => (
            <div className="partner-logo" key={`${partner.name}-${index}`}>
              <Image
                src={partner.src}
                alt={`Logo ${partner.name}`}
                width={partner.width}
                height={partner.height}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
