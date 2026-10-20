"use client";

import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { technologyThemes } from "@/data/technology-themes";
import { labs } from "@/data/labs";
import { getExplorerHref } from "@/lib/explorer-link";
import { Arrow } from "./Arrow";
import { SectionHeading } from "./SectionHeading";

const floorName = (floor: string) => (floor === "0" ? "Tầng trệt" : "Tầng " + floor);
const themeNumber = (code: string) => code.slice(0, 2);

// The heading sits in its own row above the picker, so selecting a direction never moves it.
// The result area reserves the height of the largest theme to keep the page below steady.
export function TechnologyExplorer() {
  const [selected, setSelected] = useState(technologyThemes[0].id);
  const panelId = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const theme = technologyThemes.find((item) => item.id === selected) ?? technologyThemes[0];
  const matchingLabs = theme.labs
    .map((id) => labs.find((lab) => lab.id === id))
    .filter((lab) => lab !== undefined);

  const moveFocus = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
    const edge = { Home: 0, End: technologyThemes.length - 1 }[event.key];
    if (step === undefined && edge === undefined) return;
    event.preventDefault();
    const next =
      edge ?? (index + (step ?? 0) + technologyThemes.length) % technologyThemes.length;
    buttons.current[next]?.focus();
  };

  return (
    <section className="cv-tech home-section site-container" id="technology">
      <div className="section-heading">
        <SectionHeading number="01" title="Hướng công nghệ">
          {technologyThemes.length} hướng nghiên cứu. <span>Một điểm hội tụ.</span>
        </SectionHeading>
        <p>Chọn một hướng để thấy lab, phòng và tầng tương ứng tại Campus E.</p>
      </div>
      <div className="cv-tech-body">
        <div className="cv-tech-picker" role="group" aria-label="Chọn hướng công nghệ">
          {technologyThemes.map((item, index) => (
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
              <span className="cv-tech-number">{themeNumber(item.code)}</span>
              <span className="cv-tech-signal" aria-hidden="true" />
              <span className="cv-tech-name">{item.name}</span>
            </button>
          ))}
        </div>
        <div className="cv-tech-result" id={panelId} aria-live="polite">
          <p className="cv-tech-meta">
            <span>{theme.code}</span>
            <span>
              {matchingLabs.length} lab tại Campus E
            </span>
          </p>
          <h3>{theme.name}</h3>
          <p className="cv-tech-description">{theme.description}</p>
          <ul className="cv-lab-rows" key={theme.id}>
            {matchingLabs.map((lab) => (
              <li key={lab.id}>
                <Link href={"/labs/" + lab.id}>
                  <strong>{lab.name}</strong>
                  <span>
                    {lab.room} · {floorName(lab.floor)}
                  </span>
                </Link>
                <Link
                  className="cv-map-link"
                  href={getExplorerHref(lab.room, lab.floor)}
                  aria-label={`Tìm ${lab.room} trên bản đồ Campus E`}
                >
                  Bản đồ <Arrow diagonal />
                </Link>
              </li>
            ))}
          </ul>
          <Link className="text-link" href={"/labs?theme=" + theme.id + "#lab-directory"}>
            Xem trong danh mục labs <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
