import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
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
      <main>
        <section className="container page-hero">
          <Link className="back-link" href="/news">
            ← Quay lại
          </Link>
          <div className="page-box news-detail-hero">
            <article className="news-detail-media">
              <div className="news-detail-overlay">
                <div className="news-meta">
                  <span>{item.category}</span>
                  <span>{item.date}</span>
                </div>
                <h1>{item.title}</h1>
                <p className="lead">{item.excerpt}</p>
              </div>
            </article>
          </div>
          <div className="news-detail-gallery" aria-hidden="true">
            <div className="news-slot news-slot-wide" />
            <div className="news-slot" />
            <div className="news-slot" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
