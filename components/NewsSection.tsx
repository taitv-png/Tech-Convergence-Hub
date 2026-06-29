import Link from "next/link";
import { news } from "../data/labs";

type NewsSectionProps = {
  showHeader?: boolean;
};

export function NewsSection({ showHeader = true }: NewsSectionProps) {
  return (
    <section className="container section" id="news">
      {showHeader ? (
        <div className="section-head">
          <h2>Bài viết mới</h2>
        </div>
      ) : null}
      <div className="news-grid">
        {news.map((n, i) => {
          return (
            <Link className="news-card" key={n.title} href={`/news/${i + 1}`}>
              <div className={`news-media news-media-${(i % 3) + 1}`} aria-hidden="true" />
              <div className="news-overlay">
                <div className="news-meta">
                  <span>{n.category}</span>
                  <span>{n.date}</span>
                </div>
                <h3>{n.title}</h3>
                <p>{n.excerpt}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
