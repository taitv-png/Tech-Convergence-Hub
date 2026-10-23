import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow } from "../Arrow";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { news } from "@/data/labs";
import { getNews } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { localePath, type Locale } from "@/lib/i18n";
import { pageMetadata } from "./metadata";

export function newsMetadata(locale: Locale) {
  const t = getDictionary(locale).meta;
  return pageMetadata(locale, "/news", t.newsTitle, t.newsDescription);
}

export const newsDetailParams = () => news.map((_, index) => ({ id: String(index + 1) }));

export function newsDetailMetadata(locale: Locale, id: string) {
  const item = getNews(locale)[Number(id) - 1];
  return item ? pageMetadata(locale, "/news/" + id, `${item.title} · Tech-Convergence Hub`, item.excerpt) : {};
}

export function NewsView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <>
      <Header locale={locale} />
      <main id="main-content" className="page-dark">
        <section className="site-container page-intro">
          <p className="eyebrow">{t.newsPage.eyebrow}</p>
          <h1>
            {t.newsPage.titleA} <br />
            {t.newsPage.titleB} <em>{t.newsPage.titleAccent}</em>
          </h1>
          <p>{t.newsPage.intro}</p>
        </section>
        <section className="site-container home-news-grid news-directory">
          {getNews(locale).map((item, index) => (
            <Link className="editorial-card" href={localePath(locale, "/news/" + (index + 1))} key={item.title}>
              <span className="space-meta">
                <span>{item.category}</span>
                <span>{item.date}</span>
              </span>
              <h3>{item.title}</h3>
              <p>{item.excerpt}</p>
              <span className="text-link">
                {t.common.readArticle} <Arrow diagonal />
              </span>
            </Link>
          ))}
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}

export function NewsDetailView({ locale, id }: { locale: Locale; id: string }) {
  const item = getNews(locale)[Number(id) - 1];
  if (!item) notFound();
  const t = getDictionary(locale);
  return (
    <>
      <Header locale={locale} />
      <main id="main-content" className="cv-detail page-dark">
        <article className="site-container cv-article">
          <nav className="cv-breadcrumb" aria-label={t.common.breadcrumb}>
            <Link href={localePath(locale, "/news")}>{t.nav.news}</Link>
            <span aria-hidden="true">/</span>
            <span>{item.category}</span>
          </nav>
          <p className="eyebrow">
            <span className="orange-dot" /> {item.category.toUpperCase()} · {item.date}
          </p>
          <h1>{item.title}</h1>
          <p className="cv-detail-lede">{item.excerpt}</p>
          <div className="cv-actions">
            <Link className="button button-orange" href={localePath(locale, "/labs")}>
              {t.common.exploreLabs} <Arrow />
            </Link>
            <Link className="text-link" href={localePath(locale, "/news")}>
              {t.common.allArticles} <Arrow />
            </Link>
          </div>
        </article>
      </main>
      <Footer locale={locale} />
    </>
  );
}
