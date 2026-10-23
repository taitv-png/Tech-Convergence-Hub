import Link from "next/link";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { labPhotos } from "@/data/lab-photos";
import { getLabs } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { localePath, type Locale } from "@/lib/i18n";
import { pageMetadata } from "./metadata";

export function creditsMetadata(locale: Locale) {
  return pageMetadata(locale, "/credits", getDictionary(locale).meta.creditsTitle);
}

// Attribution for the illustrative lab photographs (author, source, licence).
export function CreditsView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).credits;
  return (
    <>
      <Header locale={locale} />
      <main id="main-content" className="page-dark">
        <section className="site-container page-intro">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p>{t.intro}</p>
        </section>
        <section className="site-container cv-credits">
          <ul>
            {getLabs(locale).map((lab) => {
              const photo = labPhotos[lab.id];
              if (!photo) return null;
              return (
                <li key={lab.id}>
                  <Link href={localePath(locale, `/labs/${lab.id}`)}>
                    {lab.name} <span>{lab.room}</span>
                  </Link>
                  <p>
                    {photo.attribution}.{" "}
                    <a href={photo.sourceURL} target="_blank" rel="noreferrer">
                      {t.source}
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
      <Footer locale={locale} />
    </>
  );
}
