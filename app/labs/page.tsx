import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LabDirectory } from "@/components/LabDirectory";

export default function LabsPage() {
  return (
    <>
      <Header />
      <main>
        <section className="container page-title-wrap page-title-grid">
          <h1 className="page-title">Lab</h1>
          <div className="page-title-media" aria-hidden="true" />
        </section>

        <LabDirectory showHeader={false} />
      </main>
      <Footer />
    </>
  );
}