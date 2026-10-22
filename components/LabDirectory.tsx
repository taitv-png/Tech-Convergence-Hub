"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getClusters, getLabs, getThemes, resolveClusterKey } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { floorName, localePath, normalizeSearch, type Locale } from "@/lib/i18n";
import { getExplorerHref } from "@/lib/explorer-link";
import { Arrow } from "./Arrow";
import { LabPhoto } from "./LabPhoto";

type Filters = { q: string; floor: string; theme: string; cluster: string };
const empty: Filters = { q: "", floor: "", theme: "", cluster: "" };

// Search and filters are real state, mirrored in the query string (?q, floor, theme, cluster)
// so a filtered view can be shared and survives switching language. Search matches English
// and Vietnamese text, without accents.
export function LabDirectory({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).directory;
  const common = getDictionary(locale).common;
  const labs = useMemo(() => getLabs(locale), [locale]);
  const themes = useMemo(() => getThemes(locale), [locale]);
  const clusters = useMemo(() => getClusters(locale), [locale]);
  const floors = useMemo(
    () => Array.from(new Set(labs.map((lab) => lab.floor))).sort((a, b) => Number(a) - Number(b)),
    [labs],
  );
  const [filters, setFilters] = useState<Filters>(empty);
  const [ready, setReady] = useState(false);

  // Read the query string once (old Vietnamese ?cluster= names still work).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const theme = params.get("theme") ?? "";
    const floor = params.get("floor") ?? "";
    setFilters({
      q: params.get("q") ?? "",
      floor: floors.includes(floor) ? floor : "",
      theme: themes.some((item) => item.id === theme) ? theme : "",
      cluster: resolveClusterKey(params.get("cluster")),
    });
    setReady(true);
  }, [floors, themes]);

  // Write the state back without adding history entries.
  useEffect(() => {
    if (!ready) return;
    const params = new URLSearchParams();
    if (filters.q.trim()) params.set("q", filters.q.trim());
    if (filters.floor) params.set("floor", filters.floor);
    if (filters.theme) params.set("theme", filters.theme);
    if (filters.cluster) params.set("cluster", filters.cluster);
    const search = params.toString();
    const next = window.location.pathname + (search ? "?" + search : "") + window.location.hash;
    if (next !== window.location.pathname + window.location.search + window.location.hash)
      window.history.replaceState(window.history.state, "", next);
  }, [filters, ready]);

  const selectedTheme = themes.find((item) => item.id === filters.theme);
  const query = normalizeSearch(filters.q.trim());
  const filtered = labs.filter(
    (lab) =>
      (!filters.floor || lab.floor === filters.floor) &&
      (!filters.cluster || lab.clusterKey === filters.cluster) &&
      (!selectedTheme || selectedTheme.labs.includes(lab.id)) &&
      (!query || normalizeSearch(lab.searchText).includes(query)),
  );

  const set = (key: keyof Filters, value: string) => setFilters((current) => ({ ...current, [key]: value }));
  const chips = [
    filters.q.trim() && { key: "q" as const, label: t.query(filters.q.trim()) },
    filters.floor && { key: "floor" as const, label: floorName(locale, filters.floor) },
    selectedTheme && { key: "theme" as const, label: selectedTheme.name },
    filters.cluster && {
      key: "cluster" as const,
      label: clusters.find((item) => item.key === filters.cluster)?.name ?? filters.cluster,
    },
  ].filter((chip): chip is { key: keyof Filters; label: string } => Boolean(chip));
  const reset = () => setFilters(empty);

  return (
    <section className="site-container lab-directory" id="lab-directory">
      <form className="lab-filters" role="search" aria-label={t.filters} onSubmit={(event) => event.preventDefault()}>
        <label className="lab-field is-search">
          <span>{t.search}</span>
          <span className="lab-input">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>
            <input
              type="search"
              value={filters.q}
              onChange={(event) => set("q", event.target.value)}
              placeholder={t.searchPlaceholder}
              autoComplete="off"
            />
          </span>
        </label>
        <label className="lab-field">
          <span>{t.floor}</span>
          <select value={filters.floor} onChange={(event) => set("floor", event.target.value)}>
            <option value="">{t.allFloors}</option>
            {floors.map((floor) => (
              <option key={floor} value={floor}>
                {floorName(locale, floor)}
              </option>
            ))}
          </select>
        </label>
        <label className="lab-field">
          <span>{t.theme}</span>
          <select value={filters.theme} onChange={(event) => set("theme", event.target.value)}>
            <option value="">{t.allThemes}</option>
            {themes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="lab-field">
          <span>{t.cluster}</span>
          <select value={filters.cluster} onChange={(event) => set("cluster", event.target.value)}>
            <option value="">{t.allClusters}</option>
            {clusters.map((item) => (
              <option key={item.key} value={item.key}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </form>

      <div className="lab-results-bar">
        <p className="lab-count" role="status" aria-label={t.resultLabel(filtered.length)}>
          <strong>{filtered.length}</strong> <span>{t.results(filtered.length, labs.length)}</span>
        </p>
        {chips.length > 0 && (
          <ul className="lab-chips" aria-label={t.active}>
            {chips.map((chip) => (
              <li key={chip.key}>
                <button type="button" onClick={() => set(chip.key, "")} aria-label={t.remove(chip.label)}>
                  {chip.label}
                  <span aria-hidden="true">×</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {chips.length > 0 && (
          <button type="button" className="lab-clear" onClick={reset}>
            {t.clear}
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="directory-empty">
          <h3>{t.emptyTitle}</h3>
          <p>{t.emptyText}</p>
          <button type="button" className="button button-orange" onClick={reset}>
            {t.emptyCta}
          </button>
        </div>
      ) : (
        <div className="lab-grid">
          {filtered.map((lab) => (
            <article className="lab-card" key={lab.id}>
              <Link className="lab-card-main" href={localePath(locale, "/labs/" + lab.id)}>
                <div className="lab-card-image">
                  <LabPhoto
                    id={lab.id}
                    locale={locale}
                    sizes="(min-width: 1100px) 400px, (min-width: 700px) 50vw, 100vw"
                  />
                </div>
                <p className="lab-card-meta">
                  <span>{lab.room}</span>
                  <span>{floorName(locale, lab.floor)}</span>
                </p>
                <h3>{lab.name}</h3>
                <p className="lab-card-desc">{lab.desc}</p>
              </Link>
              <div className="lab-card-actions">
                <Link href={localePath(locale, "/labs/" + lab.id)} tabIndex={-1} aria-hidden="true">
                  {common.viewDetails} <Arrow />
                </Link>
                <Link href={localePath(locale, getExplorerHref(lab.room, lab.floor))}>
                  {common.findOnMap} <Arrow diagonal />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
