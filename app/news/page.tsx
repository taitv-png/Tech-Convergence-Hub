import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { NewsSection } from "@/components/NewsSection";

export default function NewsPage() {
  return (
    <>
      <Header />
      <main>
        <section className="container page-title-wrap news-title-grid">
          <div>
            <h1 className="page-title">Tin tức</h1>
            <p className="lead news-lead">
              Bố cục ưu tiên hình ảnh để tận dụng khoảng trống và giữ nhịp đọc
              gọn.
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