import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { labs } from "@/data/labs";
import { labPhotos } from "@/data/lab-photos";

export const metadata = { title: "Nguồn ảnh | Tech-Convergence Hub" };

// Attribution for the illustrative lab photographs (author, source, licence).
export default function CreditsPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <section className="site-container directory-hero">
          <p className="eyebrow">NGUỒN ẢNH</p>
          <h1>Ảnh minh họa và giấy phép</h1>
          <p>
            Ảnh trên các trang lab là ảnh minh họa theo chủ đề từ nguồn bên ngoài, không phải ảnh chụp
            cơ sở TCH. Ảnh được thu nhỏ và có thể được cắt khung khi hiển thị; màu và nội dung giữ nguyên.
          </p>
        </section>
        <section className="site-container cv-credits">
          <ul>
            {labs.map((lab) => {
              const photo = labPhotos[lab.id];
              if (!photo) return null;
              return (
                <li key={lab.id}>
                  <Link href={`/labs/${lab.id}`}>
                    {lab.name} <span>{lab.room}</span>
                  </Link>
                  <p>
                    {photo.attribution}.{" "}
                    <a href={photo.sourceURL} target="_blank" rel="noreferrer">
                      Nguồn
                    </a>{" "}
                    ·{" "}
                    <a href={photo.licenseURL} target="_blank" rel="noreferrer">
                      {photo.license}
                    </a>
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
