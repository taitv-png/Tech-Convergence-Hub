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
            <h1 className="page-title">Phòng thí nghiệm</h1>
            <p className="lead news-lead">
              Danh mục được tổ chức theo cụm công nghệ hội tụ, bám theo kế hoạch
              phát triển Tech-Convergence Hub giai đoạn 2026-2030.
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