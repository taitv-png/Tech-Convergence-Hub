import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { OrbitMap } from "@/components/OrbitMap";
import { PartnerMarquee } from "@/components/PartnerMarquee";
import { VisionSection } from "@/components/VisionSection";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="home-main">
        <Hero />
        <VisionSection />
        <OrbitMap />
        <PartnerMarquee />
      </main>
      <Footer />
    </>
  );
}
