import Link from "next/link";
import "@/app/wayfinding.css";
import { Header } from "../Header";
import { Arrow } from "../Arrow";
import { Explorer } from "../wayfinding/Explorer";
import { getDictionary } from "@/lib/dictionary";
import { localePath, type Locale } from "@/lib/i18n";
import { pageMetadata } from "./metadata";

export function exploreMetadata(locale: Locale) {
  const t = getDictionary(locale).meta;
  return pageMetadata(locale, "/explore", t.exploreTitle, t.exploreDescription);
}

export function ExploreView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).explore;
  return (
    <>
      <Header locale={locale} />
      <main id="main-content" className="explore-app">
        <div className="explorer-heading site-container">
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <h1>{t.title}</h1>
          </div>
          <Link className="text-link" href={localePath(locale, "/labs")}>
            {t.toLabs} <Arrow />
          </Link>
        </div>
        <Explorer locale={locale} />
      </main>
    </>
  );
}
