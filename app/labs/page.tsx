import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LabDirectory } from "@/components/LabDirectory";
import { labs } from "@/data/labs";
export const metadata = { title: "Không gian & Labs | Tech-Convergence Hub" };
export default function LabsPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <section className="site-container directory-hero">
          <p className="eyebrow">KHÔNG GIAN & LABS / CAMPUS E</p>
          <h1>
            Tìm không gian.
            <br />
            Kết nối khả năng.
          </h1>
          <p>
            Khám phá {labs.length} không gian công nghệ theo tầng, lĩnh vực và cụm năng lực. Từ một
            ý tưởng đến nơi bạn có thể bắt đầu.
          </p>
        </section>
        <LabDirectory showHeader={false} />
      </main>
      <Footer />
    </>
  );
}
