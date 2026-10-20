import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { news } from "@/data/labs";
import Link from "next/link";
import { Arrow } from "@/components/Arrow";
export const metadata = { title: "Tin & Hoạt động | Tech-Convergence Hub" };
export default function NewsPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <section className="site-container directory-hero">
          <p className="eyebrow">TIN & HOẠT ĐỘNG</p>
          <h1>
            Những kết nối mới.
            <br />
            Những chuyển động mới.
          </h1>
          <p>
            Định hướng phát triển, hoạt động nghiên cứu và câu chuyện vận hành của hệ sinh thái TCH.
          </p>
        </section>
        <section className="site-container home-news-grid news-directory">
          {news.map((item, index) => (
            <Link className="editorial-card" href={"/news/" + (index + 1)} key={item.title}>
              <span className="space-meta">
                <span>{item.category}</span>
                <span>{item.date}</span>
              </span>
              <h3>{item.title}</h3>
              <p>{item.excerpt}</p>
              <span className="text-link">
                Đọc bài viết <Arrow diagonal />
              </span>
            </Link>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
