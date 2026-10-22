import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow } from "../Arrow";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { LabPhoto, LabPhotoCredit } from "../LabPhoto";
import { labs } from "@/data/labs";
import { floorRole, getLab, getLabs } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { floorName, localePath, type Locale } from "@/lib/i18n";
import { getExplorerHref } from "@/lib/explorer-link";
import { pageMetadata } from "./metadata";

export const labDetailParams = () => labs.map((lab) => ({ slug: lab.id }));

export function labDetailMetadata(locale: Locale, slug: string) {
  const lab = getLab(locale, slug);
  return lab ? pageMetadata(locale, "/labs/" + slug, `${lab.name} · Tech-Convergence Hub`, lab.desc) : {};
}

export function LabDetailView({ locale, slug }: { locale: Locale; slug: string }) {
  const lab = getLab(locale, slug);
  if (!lab) notFound();
  const t = getDictionary(locale);
  const to = (path: string) => localePath(locale, path);
  const related = getLabs(locale).filter((x) => x.clusterKey === lab.clusterKey && x.id !== lab.id);
  const role = floorRole(locale, lab.floor);
  const rows: { title: string; items: string[]; kind: "tags" | "list" }[] = [
    { title: t.detail.tech, items: lab.tech, kind: "tags" },
    { title: t.detail.apps, items: lab.apps, kind: "tags" },
    { title: t.detail.capabilities, items: lab.capabilities ?? [], kind: "list" },
    { title: t.detail.outcomes, items: lab.outcomes ?? [], kind: "list" },
    { title: t.detail.audiences, items: lab.audiences ?? [], kind: "tags" },
  ];

  return (
    <>
      <Header locale={locale} />
      <main id="main-content" className="cv-detail page-dark">
        <section className="site-container cv-detail-hero">
          <nav className="cv-breadcrumb" aria-label={t.common.breadcrumb}>
            <Link href={to("/labs#lab-directory")}>{t.nav.labs}</Link>
            <span aria-hidden="true">/</span>
            <Link href={to("/labs?cluster=" + lab.clusterKey + "#lab-directory")}>{lab.clusterName}</Link>
          </nav>
          <div className="cv-detail-grid">
            <div className="cv-detail-copy">
              <p className="eyebrow">
                <span className="orange-dot" /> {lab.room} · {floorName(locale, lab.floor).toUpperCase()}
              </p>
              <h1>{lab.name}</h1>
              <p className="cv-detail-lede">{lab.desc}</p>
              <dl className="cv-facts">
                <div>
                  <dt>{t.detail.room}</dt>
                  <dd>{lab.room}</dd>
                </div>
                <div>
                  <dt>{t.detail.floor}</dt>
                  <dd>{floorName(locale, lab.floor)}</dd>
                </div>
                <div>
                  <dt>{t.detail.cluster}</dt>
                  <dd>{lab.clusterName}</dd>
                </div>
              </dl>
              <div className="cv-actions">
                <Link className="button button-orange" href={to(getExplorerHref(lab.room, lab.floor))}>
                  {t.common.findOnMap} <Arrow diagonal />
                </Link>
                <Link className="text-link" href={to("/labs#lab-directory")}>
                  {t.common.allLabs} <Arrow />
                </Link>
              </div>
            </div>
            <figure className="cv-detail-figure">
              <div className="cv-detail-photo">
                <LabPhoto id={lab.id} locale={locale} sizes="(min-width: 900px) 45vw, 100vw" priority />
              </div>
              <figcaption>
                {role ? <span>{role}</span> : null}
                <LabPhotoCredit id={lab.id} locale={locale} />
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="site-container cv-detail-body">
          {rows.map((row) => (
            <div className="cv-detail-row" key={row.title}>
              <h2>{row.title}</h2>
              <ul className={row.kind === "tags" ? "cv-tags" : "cv-list"}>
                {row.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {related.length > 0 && (
          <section className="site-container home-section cv-related">
            <div className="section-heading">
              <div className="section-masthead">
                <h2>{t.detail.related}</h2>
                <p className="section-deck">{lab.clusterName}</p>
              </div>
            </div>
            <div className="lab-grid">
              {related.map((x) => (
                <article className="lab-card" key={x.id}>
                  <Link className="lab-card-main" href={to("/labs/" + x.id)}>
                    <div className="lab-card-image">
                      <LabPhoto id={x.id} locale={locale} />
                    </div>
                    <p className="lab-card-meta">
                      <span>{x.room}</span>
                      <span>{floorName(locale, x.floor)}</span>
                    </p>
                    <h3>{x.name}</h3>
                  </Link>
                  <div className="lab-card-actions">
                    <Link href={to("/labs/" + x.id)} tabIndex={-1} aria-hidden="true">
                      {t.common.viewDetails} <Arrow />
                    </Link>
                    <Link href={to(getExplorerHref(x.room, x.floor))}>
                      {t.common.findOnMap} <Arrow diagonal />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer locale={locale} />
    </>
  );
}
