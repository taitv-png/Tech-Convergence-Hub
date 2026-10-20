import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow } from "@/components/Arrow";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { floorLabels, labs } from "../../../data/labs";
import { roomRenders } from "@/data/site-images";
import { getExplorerHref } from "@/lib/explorer-link";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return labs.map((l) => ({ slug: l.id }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const lab = labs.find((l) => l.id === slug);

  return lab ? { title: `${lab.name} · Tech-Convergence Hub`, description: lab.desc } : {};
}

export default async function LabDetailPage({ params }: Props) {
  const { slug } = await params;
  const lab = labs.find((l) => l.id === slug);

  if (!lab) notFound();

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const related = labs.filter((x) => x.cluster === lab.cluster && x.id !== lab.id);
  const floorName = (floor: string) => (floor === "0" ? "Tầng trệt" : `Tầng ${floor}`);
  const floorRole = floorLabels[lab.floor]?.split(/\s[–-]\s/).slice(1).join(" - ");
  const render = roomRenders[lab.room];
  const image = render ?? lab.visual.realImage;
  const mapHref = getExplorerHref(lab.room, lab.floor);
  const capabilities = lab.capabilities ?? [
    `Phát triển và kiểm thử giải pháp trong cụm ${lab.cluster}`,
    "Hỗ trợ đào tạo thực hành và nghiên cứu theo dự án",
    "Kết nối dữ liệu, thiết bị và nền tảng mô phỏng dùng chung",
    "Tạo điều kiện tạo nguyên mẫu, thử nghiệm hiện trường và chuyển giao công nghệ",
  ];
  const outcomes = lab.outcomes ?? [
    "Dự án nghiên cứu ứng dụng",
    "Nguyên mẫu công nghệ",
    "Chương trình đào tạo ngắn hạn",
    "Mô hình trình diễn",
  ];
  const audiences = lab.audiences ?? [
    "Sinh viên",
    "Nhà nghiên cứu",
    "Doanh nghiệp",
    "Đối tác địa phương",
  ];

  return (
    <>
      <Header />
      <main id="main-content" className="cv-detail">
        <section className="site-container cv-detail-hero">
          <nav className="cv-breadcrumb" aria-label="Vị trí trang">
            <Link href="/labs#lab-directory">Không gian & Labs</Link>
            <span aria-hidden="true">/</span>
            <Link href={"/labs?cluster=" + encodeURIComponent(lab.cluster) + "#lab-directory"}>
              {lab.cluster}
            </Link>
          </nav>
          <div className="cv-detail-grid">
            <div className="cv-detail-copy">
              <p className="eyebrow">
                <span className="orange-dot" /> {lab.room} · {floorName(lab.floor).toUpperCase()}
              </p>
              <h1>{lab.name}</h1>
              <p className="cv-detail-lede">{lab.desc}</p>
              <dl className="cv-facts">
                <div>
                  <dt>Phòng</dt>
                  <dd>{lab.room}</dd>
                </div>
                <div>
                  <dt>Tầng</dt>
                  <dd>{floorName(lab.floor)}</dd>
                </div>
                <div>
                  <dt>Cụm năng lực</dt>
                  <dd>{lab.cluster}</dd>
                </div>
              </dl>
              <div className="cv-actions">
                <Link className="button button-orange" href={mapHref}>
                  Tìm trên bản đồ <Arrow diagonal />
                </Link>
                <Link className="text-link" href="/labs#lab-directory">
                  Tất cả labs <Arrow />
                </Link>
              </div>
            </div>
            {image && (
              <figure className="cv-detail-figure">
                <Image
                  src={basePath + image}
                  width={960}
                  height={600}
                  alt={render ? `Phối cảnh thiết kế phòng ${lab.room}` : ""}
                  priority
                />
                <figcaption>
                  {render ? "Phối cảnh thiết kế" : "Hình minh họa lĩnh vực"}
                  {floorRole ? ` · ${floorRole}` : ""}
                </figcaption>
              </figure>
            )}
          </div>
        </section>

        <section className="site-container cv-detail-body">
          {lab.sourceQuote && lab.sourceQuote !== lab.desc && (
            <div className="cv-detail-row">
              <h2>Giới thiệu</h2>
              <p>{lab.sourceQuote}</p>
            </div>
          )}
          <div className="cv-detail-row">
            <h2>Công nghệ cốt lõi</h2>
            <ul className="cv-tags">
              {lab.tech.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div className="cv-detail-row">
            <h2>Lĩnh vực ứng dụng</h2>
            <ul className="cv-tags">
              {lab.apps.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div className="cv-detail-row">
            <h2>Năng lực chính</h2>
            <ul className="cv-list">
              {capabilities.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div className="cv-detail-row">
            <h2>Đầu ra có thể triển khai</h2>
            <ul className="cv-list">
              {outcomes.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div className="cv-detail-row">
            <h2>Đối tượng phù hợp</h2>
            <ul className="cv-tags">
              {audiences.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </section>

        {related.length > 0 && (
          <section className="site-container home-section cv-related">
            <div className="section-heading">
              <div className="section-masthead">
                <div className="section-masthead-title">
                  <h2>Lab cùng cụm</h2>
                </div>
                <p className="section-deck">{lab.cluster}</p>
              </div>
            </div>
            <ul className="cv-lab-rows">
              {related.map((x) => (
                <li key={x.id}>
                  <Link href={`/labs/${x.id}`}>
                    <strong>{x.name}</strong>
                    <span>
                      {x.room} · {floorName(x.floor)}
                    </span>
                  </Link>
                  <Link
                    className="cv-map-link"
                    href={getExplorerHref(x.room, x.floor)}
                    aria-label={`Tìm ${x.room} trên bản đồ Campus E`}
                  >
                    Bản đồ <Arrow diagonal />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
