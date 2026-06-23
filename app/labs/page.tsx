import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LabDirectory } from "@/components/LabDirectory";

export default function LabsPage() {
  return (
    <>
      <Header />
      <main>
        <section className="container page-title-wrap page-title-grid labs-title-wrap">
          <div>
            <h1 className="page-title">Lab</h1>
            <p className="lead news-lead">
              Danh mục lab được tổ chức theo cụm năng lực để bạn định hướng nhanh
              hơn.
            </p>
          </div>

          <div className="page-title-media" aria-hidden="true" />
        </section>

        <LabDirectory showHeader={false} />
      </main>
      <Footer />
    </>
  );
}