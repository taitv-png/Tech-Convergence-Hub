import Image from "next/image";
import Link from "next/link";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { Arrow } from "../Arrow";
import { IntroSequence } from "../IntroSequence";
import { LogoDoor } from "../LogoDoor";
import { AboutConvergence } from "../AboutConvergence";
import { TechnologyExplorer } from "../TechnologyExplorer";
import { CampusPortal } from "../CampusPortal";
import { SectionHeading } from "../SectionHeading";
import { PartnerRibbon } from "../PartnerRibbon";
import { LabPhoto } from "../LabPhoto";
import { RoomName } from "../RoomName";
import { OperatingModels } from "../OperatingModels";
import { HomeFrame } from "../HomeFrame";
import { HorizontalChapters } from "../HorizontalChapters";
import { referenceImages } from "@/data/site-images";
import { getDictionary } from "@/lib/dictionary";
import { floorName, localePath, type Locale } from "@/lib/i18n";
import {
  floorCount,
  getClusters,
  getLabs,
  getModels,
  getNews,
  getThemes,
} from "@/lib/content";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
// Eight representative labs in two rows of four fit one desktop screen; the rest is on /labs.
const featuredIds = [
  "immersive-technology-center",
  "ai-big-data-lab",
  "smart-port-mobility-rail-lab",
  "ocean-robotics-lab",
  "precision-mechanics-lab",
  "smart-city-lab",
  "embedded-iot-process-lab",
  "security-lab",
];
const newsImages = [
  referenceImages.urban.src,
  referenceImages.robotics.src,
  "/images/references/architecture.webp",
];

export function HomeView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const to = (path: string) => localePath(locale, path);
  const labs = getLabs(locale);
  const clusters = getClusters(locale);
  const news = getNews(locale);
  const featured = featuredIds
    .map((id) => labs.find((lab) => lab.id === id))
    .filter((lab) => lab !== undefined);
  return (
    <>
      <Header locale={locale} />
      <main id="main-content" className="redesign-home">
        <IntroSequence locale={locale} />
        <LogoDoor locale={locale} />

        <HorizontalChapters next={
          <HomeFrame tone="light" color="orange">
            <TechnologyExplorer locale={locale} />
          </HomeFrame>
        }>
        <HomeFrame color="cyan">
        <AboutConvergence locale={locale}>
          <SectionHeading title={t.about.title}>
            {t.about.deckA} <span>{t.about.deckB}</span>
          </SectionHeading>
          <div className="about-copy">
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
          </div>
          <dl className="cv-figures">
            <div>
              <dt>{t.about.figLabs}</dt>
              <dd>{labs.length}</dd>
            </div>
            <div>
              <dt>{t.about.figThemes}</dt>
              <dd>{getThemes(locale).length}</dd>
            </div>
            <div>
              <dt>{t.about.figModels}</dt>
              <dd>{getModels(locale).length}</dd>
            </div>
            <div>
              <dt>{t.about.figFloors}</dt>
              <dd>{floorCount}</dd>
            </div>
          </dl>
        </AboutConvergence>
        </HomeFrame>

        </HorizontalChapters>
        <HorizontalChapters firstId="models" nextId="ecosystem" direction="right" next={
        <HomeFrame color="violet">
          <section className="home-section ecosystem-section">
            <div className="site-container">
              <div className="section-heading">
                <SectionHeading title={t.clusters.title}>
                  {t.clusters.deckA} <span>{t.clusters.deckB}</span>
                </SectionHeading>
                <p>{t.clusters.intro(clusters.length)}</p>
              </div>
              <div className="cluster-list">
                {clusters.map((cluster) => (
                  <Link
                    href={to("/labs?cluster=" + cluster.key + "#lab-directory")}
                    className="cluster-item"
                    key={cluster.key}
                  >
                    <h3>{cluster.name}</h3>
                    <span className="cluster-tags">
                      {t.clusters.labs(
                        labs.filter((lab) => lab.clusterKey === cluster.key)
                          .length,
                      )}{" "}
                      · {cluster.tags.slice(0, 2).join(", ")}
                    </span>
                    <Arrow diagonal />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </HomeFrame>
        }>
          <HomeFrame tone="light" color="violet">
            <OperatingModels locale={locale} />
          </HomeFrame>
        </HorizontalChapters>

        <HomeFrame id="spaces" color="green" motion="focus">
          <section
            className="site-container home-section cv-spaces"
          >
            <div className="section-heading">
              <SectionHeading title={t.spaces.title}>
                {t.spaces.deckA} <span>{t.spaces.deckB}</span>
              </SectionHeading>
              <Link className="text-link" href={to("/labs")}>
                {t.spaces.all(labs.length)} <Arrow />
              </Link>
            </div>
            <div className="featured-grid cv-spaces-grid">
              {featured.map((lab) => (
                <Link
                  className="space-card"
                  key={lab.id}
                  href={to("/labs/" + lab.id)}
                >
                  <div className="space-image">
                    <LabPhoto
                      id={lab.id}
                      locale={locale}
                      sizes="(min-width: 900px) 25vw, 50vw"
                    />
                  </div>
                  <span className="space-meta">
                    <span>
                      {lab.room} · {floorName(locale, lab.floor)}
                    </span>
                  </span>
                  <h3><RoomName name={lab.name} /></h3>
                </Link>
              ))}
            </div>
          </section>
        </HomeFrame>

        <HomeFrame id="campus" color="cyan" motion="split">
          <section className="explore-band">
            <div className="site-container explore-grid">
              <div>
                <SectionHeading title={t.campus.title}>
                  {t.campus.deckA} <span>{t.campus.deckB}</span>
                </SectionHeading>
                <p className="campus-introduction">{t.campus.intro}</p>
                <Link className="button button-orange" href={to("/explore")}>
                  {t.nav.visit} <Arrow diagonal />
                </Link>
                <div className="explore-features">
                  <Link href={to("/explore")}>
                    {t.campus.findRoute} <Arrow diagonal />
                  </Link>
                  <Link href={to("/explore")}>
                    {t.campus.model} <Arrow diagonal />
                  </Link>
                  <Link href={to("/explore?room=E104")}>
                    {t.campus.tour} <Arrow diagonal />
                  </Link>
                </div>
              </div>
              <CampusPortal locale={locale} />
            </div>
          </section>
        </HomeFrame>

        <HomeFrame id="news" tone="light" color="orange">
          <section className="site-container home-section">
            <div className="section-heading">
              <SectionHeading title={t.newsSection.title}>
                {t.newsSection.deckA} <span>{t.newsSection.deckB}</span>
              </SectionHeading>
              <Link className="text-link" href={to("/news")}>
                {t.common.allArticles} <Arrow />
              </Link>
            </div>
            <div className="home-news-grid">
              {news.slice(0, 3).map((item, index) => (
                <Link
                  className="editorial-card"
                  href={to("/news/" + (index + 1))}
                  key={item.title}
                >
                  <div className="editorial-image">
                    <Image
                      src={base + newsImages[index % newsImages.length]}
                      width={800}
                      height={500}
                      alt={t.newsSection.images[index % newsImages.length]}
                      loading="lazy"
                    />
                  </div>
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
            </div>
          </section>
        </HomeFrame>

        <HomeFrame id="partners" tone="light" color="violet">
          <PartnerRibbon locale={locale} />

          <section className="contact-band site-container">
            <h2>
              {t.contact.lineA}
              {t.contact.lineB && <><br /><span>{t.contact.lineB}</span></>}
            </h2>
            <a className="button button-orange" href="mailto:tch@ueh.edu.vn">
              {t.contact.cta} <Arrow diagonal />
            </a>
          </section>
        </HomeFrame>
      </main>
      <Footer locale={locale} />
    </>
  );
}
