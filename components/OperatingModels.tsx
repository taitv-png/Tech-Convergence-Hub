import { getModels, getThemes } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";

// How spaces are run, as opposed to what they research (the technology themes).
export function OperatingModels({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).models;
  const models = getModels(locale);
  return (
    <section className="site-container home-section">
      <div className="section-heading">
        <SectionHeading title={t.title}>
          {t.deckA} <span>{t.deckB}</span>
        </SectionHeading>
        <p>{t.intro(getThemes(locale).length)}</p>
      </div>
      <ul className="cv-models-list">
        {models.map((model) => (
          <li key={model.id}>
            <h3>{model.name}</h3>
            <p>{model.summary}</p>
            <dl>
              <div>
                <dt>{t.youCan}</dt>
                <dd>{model.activities}</dd>
              </div>
              <div>
                <dt>{t.outcomes}</dt>
                <dd>{model.outcomes}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
      <p className="cv-models-note">{t.note}</p>
    </section>
  );
}
