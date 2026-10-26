"use client";

import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { getExplorerHref } from "@/lib/explorer-link";
import { getLabs, getThemes } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { floorName, localePath, type Locale } from "@/lib/i18n";
import { Arrow } from "./Arrow";
import { SectionHeading } from "./SectionHeading";
import { RoomName } from "./RoomName";

// The heading sits in its own row above the picker, so selecting a direction never moves it.
// The result area reserves the height of the largest theme to keep the page below steady.
export function TechnologyExplorer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).tech;
  const themes = getThemes(locale);
  const labs = getLabs(locale);
  const [selected, setSelected] = useState(themes[0].id);
  const panelId = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const theme = themes.find((item) => item.id === selected) ?? themes[0];
  const matchingLabs = theme.labs
    .map((id) => labs.find((lab) => lab.id === id))
    .filter((lab) => lab !== undefined);

  const moveFocus = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
    const edge = { Home: 0, End: themes.length - 1 }[event.key];
    if (step === undefined && edge === undefined) return;
    event.preventDefault();
    const next = edge ?? (index + (step ?? 0) + themes.length) % themes.length;
    buttons.current[next]?.focus();
  };

  return (
    <section className="cv-tech home-section site-container">
      <div className="section-heading">
        <SectionHeading title={t.title}>
          {t.deckA(themes.length)} <span>{t.deckB}</span>
        </SectionHeading>
        <p>{t.intro}</p>
      </div>
      <div className="cv-tech-body">
        <div className="cv-tech-picker" role="group" aria-label={t.pick}>
          {themes.map((item, index) => (
            <button
              key={item.id}
              ref={(node) => {
                buttons.current[index] = node;
              }}
              type="button"
              className={selected === item.id ? "is-selected" : undefined}
              aria-pressed={selected === item.id}
              aria-controls={panelId}
              onClick={() => setSelected(item.id)}
              onKeyDown={(event) => moveFocus(event, index)}
            >
              <span className="cv-tech-signal" aria-hidden="true" />
              <span className="cv-tech-name">{item.name}</span>
            </button>
          ))}
        </div>
        <div className="cv-tech-result" id={panelId} aria-live="polite">
          <p className="cv-tech-meta">
            <span>{t.meta}</span>
            <span>{t.count(matchingLabs.length)}</span>
          </p>
          <h3>{theme.name}</h3>
          <p className="cv-tech-description">{theme.description}</p>
          <ul className="cv-lab-rows" key={theme.id}>
            {matchingLabs.map((lab) => (
              <li key={lab.id}>
                <Link href={localePath(locale, "/labs/" + lab.id)}>
                  <strong><RoomName name={lab.name} /></strong>
                  <span>
                    {lab.room} · {floorName(locale, lab.floor)}
                  </span>
                </Link>
                <Link
                  className="cv-map-link"
                  href={localePath(locale, getExplorerHref(lab.room, lab.floor))}
                  aria-label={t.mapLabel(lab.room)}
                >
                  {t.map} <Arrow diagonal />
                </Link>
              </li>
            ))}
          </ul>
          <Link className="text-link" href={localePath(locale, "/labs?theme=" + theme.id + "#lab-directory")}>
            {t.inDirectory} <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
