import Image from "next/image";
import Link from "next/link";
import { labs, clusters, news, floorLabels } from "@/data/labs";
import { technologyThemes } from "@/data/technology-themes";
import { operatingModels } from "@/data/operating-models";
import { Arrow } from "./Arrow";
import { IntroSequence } from "./IntroSequence";
import { LogoDoor } from "./LogoDoor";
import { AboutConvergence } from "./AboutConvergence";
import { TechnologyExplorer } from "./TechnologyExplorer";
import { CampusPortal } from "./CampusPortal";
import { SectionHeading } from "./SectionHeading";
import { PartnerRibbon } from "./PartnerRibbon";
import { LabPhoto } from "./LabPhoto";
import { OperatingModels } from "./OperatingModels";
import { referenceImages } from "@/data/site-images";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
// Eight representative labs in two rows of four fit one desktop screen; the rest is on /labs.
const featuredIds = [
  "immersive-technology-center",
  "ai-big-data-lab",
  "smart-port-mobility-rail-lab",
  "ocean-robotics-lab",
  "precision-mechanics-lab",
  "smart-city-lab",
  "embedded-iot-process-lab",
  "security-lab",
];
const newsImages = [
  { src: referenceImages.urban.src, alt: "Góc nhìn đô thị và hạ tầng kết nối" },
  { src: referenceImages.robotics.src, alt: "Công nghệ robotics và con người" },
  { src: "/images/references/architecture.webp", alt: "Kiến trúc và thiết kế đô thị" },
];
const floorCount = Object.keys(floorLabels).length;
const floorName = (floor: string) => (floor === "0" ? "Tầng trệt" : "Tầng " + floor);

export function HomeExperience() {
  const featured = featuredIds
    .map((id) => labs.find((lab) => lab.id === id))
    .filter((lab) => lab !== undefined);
  return (
    <main id="main-content" className="redesign-home">
      <IntroSequence />
      <LogoDoor />

      <AboutConvergence>
        <SectionHeading title="Về TCH">
          Gặp nhau ở giao điểm. <span>Tạo nên điều mới.</span>
        </SectionHeading>
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
            <dt>Không gian trong danh mục</dt>
            <dd>{labs.length}</dd>
          </div>
          <div>
            <dt>Hướng công nghệ</dt>
            <dd>{technologyThemes.length}</dd>
          </div>
          <div>
            <dt>Mô hình không gian</dt>
            <dd>{operatingModels.length}</dd>
          </div>
          <div>
            <dt>Tầng tại Campus E</dt>
            <dd>{floorCount}</dd>
          </div>
        </dl>
      </AboutConvergence>

      <TechnologyExplorer />

      <OperatingModels />

      <section className="home-section ecosystem-section" id="ecosystem">
        <div className="site-container">
          <div className="section-heading">
            <SectionHeading title="Cụm năng lực">
              Khác chuyên môn. <span>Chung một tầm nhìn.</span>
            </SectionHeading>
            <p>{clusters.length} cụm chính thức kết nối các lab với những thách thức của thế giới thực.</p>
          </div>
          <div className="cluster-list">
            {clusters.map((cluster) => (
              <Link
                href={"/labs?cluster=" + encodeURIComponent(cluster.name) + "#lab-directory"}
                className="cluster-item"
                key={cluster.name}
              >
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

      <section className="site-container home-section cv-spaces" id="spaces">
        <div className="section-heading">
          <SectionHeading title="Không gian & Labs">
            Không gian cho <span>những ý tưởng lớn.</span>
          </SectionHeading>
          <Link className="text-link" href="/labs">
            Xem tất cả {labs.length} không gian <Arrow />
          </Link>
        </div>
        <div className="featured-grid cv-spaces-grid">
          {featured.map((lab) => (
            <Link className="space-card" key={lab.id} href={"/labs/" + lab.id}>
              <div className="space-image">
                <LabPhoto id={lab.id} sizes="(min-width: 900px) 25vw, 50vw" />
              </div>
              <span className="space-meta">
                <span>
                  {lab.room} · {floorName(lab.floor)}
                </span>
              </span>
              <h3>{lab.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="explore-band" id="campus">
        <div className="site-container explore-grid">
          <div>
            <SectionHeading title="Campus Explorer">
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
                Tìm phòng & chỉ đường <Arrow diagonal />
              </Link>
              <Link href="/explore">
                Khám phá mô hình 3D <Arrow diagonal />
              </Link>
              <Link href="/explore?room=E104">
                Tham quan phòng E104 <Arrow diagonal />
              </Link>
            </div>
          </div>
          <CampusPortal />
        </div>
      </section>

      <section className="site-container home-section" id="news">
        <div className="section-heading">
          <SectionHeading title="Tin & hoạt động">
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
