"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import { slideModels } from "@/data/operating-models";
import { Arrow } from "./Arrow";

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

// Hero: one screen with the slide's blue flow, all five laser groups and the headline.
// Everything is present on load and arrives with one gentle fade. Then the Campus E film
// cross-fades in on scroll; no pinning, no click-to-reveal.
export function IntroSequence() {
  const hero = useRef<HTMLElement>(null);
  const film = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const heroBox = hero.current;
    const filmBox = film.current;
    const player = video.current;
    if (!heroBox || !filmBox || !player) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = false;
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
        soundRefused = true;
        player.muted = true;
        player.play().catch(() => undefined);
      });
    };
    const unlockSound = () => {
      soundAllowed = true;
      if (visible && !player.paused) player.muted = false;
    };

    const render = () => {
      frame = 0;
      const height = window.innerHeight;
      const heroRect = heroBox.getBoundingClientRect();
      const filmRect = filmBox.getBoundingClientRect();
      const still = reducedMotion.matches;
      // Cross-fade: the hero dims as it leaves, the film rises as it arrives and dims again
      // into the charcoal of the logo scene that follows.
      const heroVis = still ? 1 : Math.min(1, Math.max(0, heroRect.bottom / (height * 0.75)));
      const enter = Math.min(1, Math.max(0, (height - filmRect.top) / (height * 0.7)));
      const leave = Math.min(1, Math.max(0, filmRect.bottom / (height * 0.7)));
      const filmVis = still ? 1 : Math.min(enter, leave);
      heroBox.style.setProperty("--hero-vis", heroVis.toFixed(3));
      filmBox.style.setProperty("--film-vis", filmVis.toFixed(3));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
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
        if (visible && !reducedMotion.matches) play();
        else if (!visible) player.pause();
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
    render();
    return () => {
      cancelAnimationFrame(frame);
      near.disconnect();
      inView.disconnect();
      filmBox.removeEventListener("click", startOnRequest);
      document.removeEventListener("pointerdown", unlockSound);
      document.removeEventListener("keydown", unlockSound);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <>
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
                Nơi công nghệ <em>hội tụ.</em>
              </span>{" "}
              <span>Ý tưởng vươn xa.</span>
            </h1>
            <div className="cv-actions">
              <Link className="button button-orange" href="/labs">
                Khám phá labs <Arrow />
              </Link>
              <Link className="text-link cv-on-dark" href="/explore">
                Tham quan Campus E <Arrow diagonal />
              </Link>
            </div>
          </div>
          <figure className="cv-hero2-scene" aria-label="Năm mô hình không gian hội tụ tại TCH">
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

      <section
        ref={film}
        className="cv-film2"
        aria-label="Video giới thiệu Campus E"
      >
        <video
          ref={video}
          loop
          muted
          playsInline
          preload="none"
          disablePictureInPicture
          disableRemotePlayback
          poster={`${base}/media/campus-e-poster.webp`}
          aria-label="Video giới thiệu Campus E"
        />
        <p className="cv-film2-caption site-container">
          <strong>Campus E</strong>
          <span>54 Nguyễn Văn Thủ, TP. Hồ Chí Minh</span>
        </p>
      </section>
    </>
  );
}
