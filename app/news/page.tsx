import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { NewsSection } from "@/components/NewsSection";

export default function NewsPage() {
  return (
    <>
      <Header />
      <main>
        <section className="container page-title-wrap news-title-grid news-title-wrap">
          <div>
            <h1 className="page-title">Tin tức</h1>
            <p className="lead news-lead">
              Cập nhật định hướng, cơ chế vận hành và danh mục đầu tư của
              Tech-Convergence Hub theo hồ sơ đề xuất mới nhất.
            </p>
          </div>
          <div className="news-title-media" aria-hidden="true" />
        </section>
        <NewsSection showHeader={false} />
      </main>
      <Footer />
    </>
  );
}