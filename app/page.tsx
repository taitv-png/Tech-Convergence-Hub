import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { OrbitMap } from "@/components/OrbitMap";
import { SystemPathway } from "@/components/SystemPathway";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="home-main">
        <Hero />
        <OrbitMap />
        <SystemPathway />
      </main>
      <Footer />
    </>
  );
}
