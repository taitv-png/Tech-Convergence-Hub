import { Header } from "../Header";
import { Footer } from "../Footer";
import { LabDirectory } from "../LabDirectory";
import { floorCount, getLabs } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { pageMetadata } from "./metadata";

export function labsMetadata(locale: Locale) {
  const t = getDictionary(locale).meta;
  return pageMetadata(locale, "/labs", t.labsTitle, t.labsDescription(getLabs(locale).length));
}

export function LabsView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).labsPage;
  const count = getLabs(locale).length;
  return (
    <>
      <Header locale={locale} />
      <main id="main-content" className="page-dark">
        <section className="site-container page-intro">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>
            {t.titleA} <br />
            {t.titleB} <em>{t.titleAccent}</em>
          </h1>
          <p>{t.intro(count, floorCount)}</p>
        </section>
        <LabDirectory locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
