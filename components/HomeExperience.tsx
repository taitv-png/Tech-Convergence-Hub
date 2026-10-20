import Image from "next/image";
import Link from "next/link";
import { labs, clusters, news, floorLabels } from "@/data/labs";
import { technologyThemes } from "@/data/technology-themes";
import { Arrow } from "./Arrow";
import { ConvergenceField } from "./ConvergenceField";
import { TechnologyExplorer } from "./TechnologyExplorer";
import { CampusPortal } from "./CampusPortal";
import { SectionHeading } from "./SectionHeading";
import { PartnerRibbon } from "./PartnerRibbon";
import { referenceImages } from "@/data/site-images";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const featured = [
  { id: "immersive-technology-center", photo: "/rooms/e104/134.jpg" },
  { id: "hologram-exhibition-room", photo: "/rooms/e102/102.jpg" },
  { id: "smart-port-mobility-rail-lab", photo: "/rooms/e401/144.jpg" },
];
const newsImages = [
  { src: referenceImages.urban.src, alt: "Góc nhìn đô thị và hạ tầng kết nối" },
  { src: referenceImages.robotics.src, alt: "Công nghệ robotics và con người" },
  { src: "/images/references/architecture.webp", alt: "Kiến trúc và thiết kế đô thị" },
];
const floorCount = Object.keys(floorLabels).length;
const pad = (value: number) => value.toString().padStart(2, "0");
const floorName = (floor: string) => (floor === "0" ? "Tầng trệt" : "Tầng " + floor);

export function HomeExperience() {
  return (
    <main id="main-content" className="redesign-home">
      <section className="cv-hero" data-convergence-hero aria-labelledby="hero-title">
        <ConvergenceField />
        <div className="cv-hero-inner site-container">
          <div className="cv-hero-copy">
            <p className="eyebrow">
              <span className="orange-dot" /> TECH-CONVERGENCE HUB · UEH
            </p>
            <h1 id="hero-title">
              <span>Nơi công nghệ</span> <span className="cv-accent">hội tụ.</span>{" "}
              <span>Ý tưởng vươn xa.</span>
            </h1>
            <p className="cv-hero-lede">
              Kết nối tri thức, con người và công nghệ để cùng kiến tạo những giải pháp cho đô thị
              và xã hội.
            </p>
            <div className="cv-actions">
              <Link className="button button-orange" href="/labs">
                Khám phá labs <Arrow />
              </Link>
              <Link className="text-link" href="/explore">
                Tham quan Campus E <Arrow diagonal />
              </Link>
            </div>
          </div>
          <div className="cv-hero-meta">
            <span>Campus E · 54 Nguyễn Văn Thủ, TP. Hồ Chí Minh</span>
            <span>
              {technologyThemes.length} hướng công nghệ · {labs.length} không gian
            </span>
            <a href="#technology">
              Cuộn để khám phá <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </section>

      <TechnologyExplorer />

      <section className="site-container home-section about-section" id="about">
        <div className="section-heading">
          <SectionHeading number="02" title="Về TCH">
            Gặp nhau ở giao điểm. <span>Tạo nên điều mới.</span>
          </SectionHeading>
        </div>
        <div className="about-copy">
          <p>
            TCH là nền tảng nghiên cứu và đổi mới mở tại Campus E, UEH. Nơi trí tuệ nhân tạo,
            robotics, dữ liệu và công nghệ nhập vai gặp gỡ tri thức liên ngành và những bài toán
            thực tiễn.
          </p>
          <p>
            Thông qua phòng thí nghiệm, Living Labs và không gian thử nghiệm, hoạt động nghiên cứu,
            đào tạo và chuyển giao được kết nối trong cùng một hệ sinh thái.
          </p>
        </div>
        <dl className="cv-figures">
          <div>
            <dt>Không gian công nghệ</dt>
            <dd>{labs.length}</dd>
          </div>
          <div>
            <dt>Cụm năng lực liên ngành</dt>
            <dd>{pad(clusters.length)}</dd>
          </div>
          <div>
            <dt>Hướng công nghệ</dt>
            <dd>{pad(technologyThemes.length)}</dd>
          </div>
          <div>
            <dt>Tầng tại Campus E</dt>
            <dd>{pad(floorCount)}</dd>
          </div>
        </dl>
      </section>

      <section className="home-section ecosystem-section" id="ecosystem">
        <div className="site-container">
          <div className="section-heading">
            <SectionHeading number="03" title="Cụm năng lực">
              Khác chuyên môn. <span>Chung một tầm nhìn.</span>
            </SectionHeading>
            <p>{clusters.length} cụm chính thức kết nối các lab với những thách thức của thế giới thực.</p>
          </div>
          <div className="cluster-list">
            {clusters.map((cluster, index) => (
              <Link
                href={"/labs?cluster=" + encodeURIComponent(cluster.name) + "#lab-directory"}
                className="cluster-item"
                key={cluster.name}
              >
                <span className="cluster-number">{pad(index + 1)}</span>
                <h3>{cluster.name}</h3>
                <span className="cluster-tags">
                  {labs.filter((lab) => lab.cluster === cluster.name).length} không gian ·{" "}
                  {cluster.tags.slice(0, 2).join(", ")}
                </span>
                <Arrow diagonal />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="site-container home-section" id="spaces">
        <div className="section-heading">
          <SectionHeading number="04" title="Không gian & Labs">
            Không gian cho <span>những ý tưởng lớn.</span>
          </SectionHeading>
          <Link className="text-link" href="/labs">
            Xem tất cả {labs.length} không gian <Arrow />
          </Link>
        </div>
        <div className="featured-grid">
          {featured.map((item) => {
            const lab = labs.find((l) => l.id === item.id) ?? labs.find((l) => l.room === "E401")!;
            return (
              <Link className="space-card" key={lab.id} href={"/labs/" + lab.id}>
                <div className="space-image">
                  <Image
                    src={base + item.photo}
                    width={960}
                    height={540}
                    alt={"Phối cảnh thiết kế phòng " + lab.room}
                    loading="lazy"
                  />
                </div>
                <div className="space-meta">
                  <span>
                    {lab.room} · {floorName(lab.floor)}
                  </span>
                  <span>Phối cảnh thiết kế</span>
                </div>
                <h3>{lab.name}</h3>
                <p>{lab.desc}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="explore-band" id="campus">
        <div className="site-container explore-grid">
          <div>
            <SectionHeading number="05" title="Campus Explorer">
              Dẫn đúng nơi. <span>Mở thêm góc nhìn.</span>
            </SectionHeading>
            <p className="campus-introduction">
              Tìm phòng, xem tuyến đường giữa các tầng và bước vào không gian công nghệ qua trải
              nghiệm tham quan 3D.
            </p>
            <Link className="button button-orange" href="/explore">
              Tham quan Campus E <Arrow diagonal />
            </Link>
            <div className="explore-features">
              <Link href="/explore">
                <span>01</span> Tìm phòng & chỉ đường <Arrow diagonal />
              </Link>
              <Link href="/explore">
                <span>02</span> Khám phá mô hình 3D <Arrow diagonal />
              </Link>
              <Link href="/explore?room=E104">
                <span>03</span> Tham quan phòng E104 <Arrow diagonal />
              </Link>
            </div>
          </div>
          <CampusPortal />
        </div>
      </section>

      <section className="site-container home-section" id="news">
        <div className="section-heading">
          <SectionHeading number="06" title="Tin & hoạt động">
            Những chuyển động mới <span>từ TCH.</span>
          </SectionHeading>
          <Link className="text-link" href="/news">
            Tất cả bài viết <Arrow />
          </Link>
        </div>
        <div className="home-news-grid">
          {news.slice(0, 3).map((item, index) => (
            <Link className="editorial-card" href={"/news/" + (index + 1)} key={item.title}>
              <div className="editorial-image">
                <Image
                  src={base + newsImages[index % newsImages.length].src}
                  width={800}
                  height={500}
                  alt={newsImages[index % newsImages.length].alt}
                  loading="lazy"
                />
              </div>
              <span className="space-meta">
                <span>{item.category}</span>
                <span>{item.date}</span>
              </span>
              <h3>{item.title}</h3>
              <p>{item.excerpt}</p>
              <span className="text-link">
                Đọc bài viết <Arrow diagonal />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <PartnerRibbon />

      <section className="contact-band site-container">
        <h2>
          Một ý tưởng mới?
          <br />
          <span>Bắt đầu từ kết nối.</span>
        </h2>
        <a className="button button-dark" href="mailto:tch@ueh.edu.vn">
          Trao đổi với TCH <Arrow diagonal />
        </a>
      </section>
    </main>
  );
}
