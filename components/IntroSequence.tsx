"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import { slideModels } from "@/data/operating-models";
import { Arrow } from "./Arrow";
import { getDictionary } from "@/lib/dictionary";
import { localePath, type Locale } from "@/lib/i18n";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// The scene band covers slide heights 0.24 to 0.86 (labels, buildings, reflections).
const BAND_TOP = 0.24;
const BAND_HEIGHT = 0.62;
const LABEL_CENTER = 0.2845;
const BUILDING_TOP: Record<string, number> = {
  sandbox: 0.4069,
  "living-lab": 0.3954,
  laboratory: 0.3157,
  makerspace: 0.4557,
  "field-lab": 0.3245,
};
const bandY = (slideY: number) => `${(((slideY - BAND_TOP) / BAND_HEIGHT) * 100).toFixed(2)}%`;

const filmSource = () =>
  `${base}/media/${window.innerWidth >= 900 ? "campus-e-1080" : "campus-e-720"}.mp4`;

function LaserStrips({ model }: { model: (typeof slideModels)[number] }) {
  return (
    <>
      {model.beam.layers.map((layer, index) => (
        <span
          key={index}
          className={`cv-laser-strip${layer.rotate ? " is-turned" : ""}`}
          style={{ left: `${layer.left * 100}%`, width: `${layer.width * 100}%`, opacity: layer.alpha }}
        >
          <picture>
            <source srcSet={`${base}/intro/${model.laser}-still.png`} media="(prefers-reduced-motion: reduce)" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${base}/intro/${model.laser}.gif`} alt="" decoding="async" />
          </picture>
        </span>
      ))}
    </>
  );
}

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const ease = (value: number) => value * value * (3 - 2 * value);

// The Campus E film opens the journey. On desktop it fades away over the complete
// five-model scene in one shared stage. Smaller screens keep both scenes in normal flow.
export function IntroSequence({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const journey = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);
  const film = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const root = journey.current;
    const viewport = stage.current;
    const heroBox = hero.current;
    const filmBox = film.current;
    const player = video.current;
    if (!root || !viewport || !heroBox || !filmBox || !player) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 901px) and (min-height: 640px)");
    let frame = 0;
    let visible = false;
    let filmOpacity = 1;
    let playbackVisible = false;
    let soundAllowed = false;

    const load = () => {
      if (player.getAttribute("src")) return;
      player.src = filmSource();
      player.load();
    };
    // Autoplay policy: try with the film's own sound first; if the browser refuses, play
    // muted. Sound is restored after the visitor's first click, tap or key press.
    let soundRefused = false;
    const play = () => {
      load();
      player.muted = soundRefused && !soundAllowed;
      player.play().catch(() => {
        if (!playbackVisible) return;
        soundRefused = true;
        player.muted = true;
        player.play().catch(() => undefined);
      });
    };
    const unlockSound = () => {
      soundAllowed = true;
      if (playbackVisible && !player.paused) player.muted = false;
    };
    const syncPlayback = () => {
      const next = visible && filmOpacity > 0.02 && !document.hidden;
      if (next === playbackVisible) return;
      playbackVisible = next;
      if (next && !reducedMotion.matches) play();
      else {
        player.pause();
        player.muted = true;
      }
    };

    const render = () => {
      frame = 0;
      const height = window.innerHeight;
      const still = reducedMotion.matches;
      const pinned = root.classList.contains("is-live");
      let heroVis = 1;
      if (pinned) {
        const distance = Math.max(1, root.offsetHeight - viewport.offsetHeight);
        const progress = clamp(
          (viewport.getBoundingClientRect().top - root.getBoundingClientRect().top) / distance,
        );
        const reveal = ease(clamp((progress - 0.08) / 0.7));
        filmOpacity = 1 - reveal;
        // The film covers the fully rendered scene, so its fade reveals all five models
        // together without a blank frame or staggered layout changes.
        heroBox.inert = reveal < 0.5;
        filmBox.inert = reveal >= 0.5;
      } else {
        const heroRect = heroBox.getBoundingClientRect();
        const filmRect = filmBox.getBoundingClientRect();
        const header = Number.parseFloat(getComputedStyle(root).getPropertyValue("--header-height")) || 0;
        filmOpacity = still ? 1 : 1 - ease(clamp((header - filmRect.top) / (filmRect.height * 0.85)));
        const enter = clamp((height - heroRect.top) / (height * 0.65));
        const leave = clamp(heroRect.bottom / (height * 0.65));
        heroVis = still ? 1 : ease(Math.min(enter, leave));
        heroBox.inert = false;
        filmBox.inert = false;
      }
      heroBox.style.setProperty("--hero-vis", heroVis.toFixed(3));
      filmBox.style.setProperty("--film-vis", filmOpacity.toFixed(3));
      syncPlayback();
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const applyMode = () => {
      root.classList.toggle("is-live", desktop.matches && !reducedMotion.matches);
      playbackVisible = false;
      render();
    };
    const near = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) load();
      },
      { rootMargin: "100% 0px" },
    );
    const inView = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        syncPlayback();
      },
      { threshold: 0.25 },
    );
    // Reduced motion: no autoplay; a click or tap on the film starts it (no visible controls).
    const startOnRequest = () => {
      if (reducedMotion.matches && player.paused) {
        soundAllowed = true;
        play();
      }
    };

    near.observe(filmBox);
    inView.observe(filmBox);
    filmBox.addEventListener("click", startOnRequest);
    document.addEventListener("pointerdown", unlockSound, { once: true });
    document.addEventListener("keydown", unlockSound, { once: true });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", syncPlayback);
    reducedMotion.addEventListener("change", applyMode);
    desktop.addEventListener("change", applyMode);
    const resize = new ResizeObserver(schedule);
    resize.observe(heroBox);
    applyMode();
    return () => {
      cancelAnimationFrame(frame);
      near.disconnect();
      inView.disconnect();
      filmBox.removeEventListener("click", startOnRequest);
      document.removeEventListener("pointerdown", unlockSound);
      document.removeEventListener("keydown", unlockSound);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", syncPlayback);
      reducedMotion.removeEventListener("change", applyMode);
      desktop.removeEventListener("change", applyMode);
      resize.disconnect();
      root.classList.remove("is-live");
      heroBox.inert = false;
      filmBox.inert = false;
    };
  }, []);

  return (
    <div ref={journey} className="cv-intro-flow">
      <div ref={stage} className="cv-intro-stage">
        <section
          ref={film}
          className="cv-film2"
          aria-label={t.intro.filmLabel}
        >
          <video
            ref={video}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            disablePictureInPicture
            disableRemotePlayback
            poster={`${base}/media/campus-e-poster.webp`}
            aria-label={t.intro.filmLabel}
          />
          <div className="cv-film2-caption site-container">
            <span className="cv-film2-scroll">
              {t.intro.scroll} <Arrow />
            </span>
          </div>
        </section>

        <section
          ref={hero}
          className="cv-hero2"
          aria-labelledby="intro-title"
          style={{ backgroundImage: `url("${base}/intro/blue-flow-poster.jpg")` }}
        >
          <video
            className="cv-blue"
            src={`${base}/intro/blue-flow.mp4`}
            poster={`${base}/intro/blue-flow-poster.jpg`}
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            disableRemotePlayback
            aria-hidden="true"
            tabIndex={-1}
          />
          <div className="cv-hero2-beams" aria-hidden="true">
            {slideModels.map((model) => (
              <div
                key={model.id}
                className="cv-laser-column"
                style={{ left: `${model.beam.left * 100}%`, width: `${model.beam.width * 100}%` }}
              >
                <LaserStrips model={model} />
              </div>
            ))}
          </div>
          <div className="cv-hero2-inner">
            <div className="cv-hero2-copy">
              <p className="cv-hero2-eyebrow">
                <Image src={base + "/brand/ueh-white.png"} width={480} height={281} alt="UEH" priority />
                <span>Tech-Convergence Hub · Campus E</span>
              </p>
              <h1 id="intro-title">
                <span>
                  {t.intro.headlineA} <em>{t.intro.headlineAccent}</em>
                </span>{" "}
                <span>{t.intro.headlineB}</span>
              </h1>
              <div className="cv-actions">
                <Link className="button button-orange" href={localePath(locale, "/labs")}>
                  {t.common.exploreLabs} <Arrow />
                </Link>
                <Link className="text-link cv-on-dark" href={localePath(locale, "/explore")}>
                  {t.nav.visit} <Arrow diagonal />
                </Link>
              </div>
            </div>
            <figure className="cv-hero2-scene" aria-label={t.intro.scene}>
              {slideModels.map((model) => (
                <div
                  key={model.id}
                  className={`cv-model-cell is-${model.id}`}
                  style={
                    {
                      "--building-left": `${model.building.left * 100}%`,
                      "--building-top": bandY(BUILDING_TOP[model.id]),
                      "--building-width": `${model.building.width * 100}%`,
                      "--label-left": `${(model.label.left + model.label.width / 2) * 100}%`,
                      "--label-top": bandY(LABEL_CENTER),
                    } as CSSProperties
                  }
                >
                  <div className="cv-cell-beam" aria-hidden="true">
                    <LaserStrips model={model} />
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="cv-building" src={`${base}/intro/building-${model.id}.png`} alt="" />
                  <span className="cv-model-name">{model.name}</span>
                </div>
              ))}
            </figure>
          </div>
        </section>

      </div>
    </div>
  );
}
