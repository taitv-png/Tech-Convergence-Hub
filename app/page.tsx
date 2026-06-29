import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { OrbitMap } from "@/components/OrbitMap";
import { PartnerMarquee } from "@/components/PartnerMarquee";
import { SystemPathway } from "@/components/SystemPathway";
import { VisionSection } from "@/components/VisionSection";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="home-main">
        <Hero />
        <VisionSection />
        <OrbitMap />
        <SystemPathway />
        <PartnerMarquee />
      </main>
      <Footer />
    </>
  );
}
