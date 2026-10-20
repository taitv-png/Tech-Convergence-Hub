import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Arrow } from "@/components/Arrow";
import { news } from "../../../data/labs";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return news.map((_, index) => ({ id: String(index + 1) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const newsIndex = Number(id) - 1;
  const item = news[newsIndex];

  if (!item) {
    return {};
  }

  return {
    title: `${item.title} · Tech-Convergence Hub`,
    description: item.excerpt,
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { id } = await params;
  const newsIndex = Number(id) - 1;
  const item = news[newsIndex];

  if (!item) {
    notFound();
  }

  return (
    <>
      <Header />
      <main id="main-content" className="cv-detail">
        <article className="site-container cv-article">
          <nav className="cv-breadcrumb" aria-label="Vị trí trang">
            <Link href="/news">Tin & hoạt động</Link>
            <span aria-hidden="true">/</span>
            <span>{item.category}</span>
          </nav>
          <p className="eyebrow">
            <span className="orange-dot" /> {item.category.toUpperCase()} · {item.date}
          </p>
          <h1>{item.title}</h1>
          <p className="cv-detail-lede">{item.excerpt}</p>
          <div className="cv-actions">
            <Link className="button button-orange" href="/labs">
              Khám phá labs <Arrow />
            </Link>
            <Link className="text-link" href="/news">
              Tất cả bài viết <Arrow />
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
