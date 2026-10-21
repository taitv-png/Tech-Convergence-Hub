import Link from "next/link";
import { Header } from "@/components/Header";
import { Arrow } from "@/components/Arrow";
import { Explorer } from "@/components/wayfinding/Explorer";
import "./wayfinding.css";
export const metadata = {
  title: "Khám phá Campus E | Tech-Convergence Hub",
  description:
    "Tìm phòng, chỉ đường giữa các tầng và tham quan không gian Campus E bằng mô hình 3D.",
};
export default function ExplorePage() {
  return (
    <>
      <Header />
      <main id="main-content" className="explore-app">
        <div className="explorer-heading site-container">
          <div>
            <p className="eyebrow">CAMPUS EXPLORER</p>
            <h1>Bản đồ & Tham quan 3D</h1>
          </div>
          <Link className="text-link" href="/labs">
            Xem danh mục labs <Arrow />
          </Link>
        </div>
        <Explorer />
      </main>
    </>
  );
}
