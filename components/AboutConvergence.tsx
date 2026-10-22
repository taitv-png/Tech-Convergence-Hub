"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { getDictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const source = () =>
  `${base}/media/${window.innerWidth >= 700 ? "tch-convergence-v9-1280" : "tch-convergence-v9-854"}.mp4`;

// "Về TCH": the text stands on its own; the V9 film (right-hand information panel only,
// cropped x=2370 w=1470 h=2160 and rotated 90° clockwise to 2160 × 1470) illustrates it.
// It plays muted and looping while visible, with no controls; clicks never pause it.
// Under reduced motion it waits on its poster until the visitor clicks or taps it.
export function AboutConvergence({ children, locale }: { children: ReactNode; locale: Locale }) {
  const t = getDictionary(locale).about;
  const figure = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const box = figure.current;
    const player = video.current;
    if (!box || !player) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let requested = false;
    const load = () => {
      if (player.getAttribute("src")) return;
      player.src = source();
      player.load();
    };
    const play = () => {
      load();
      player.muted = true;
      player.play().catch(() => undefined);
    };
    const near = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          load();
          near.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    const inView = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && (!reducedMotion.matches || requested)) play();
        else if (!visible) player.pause();
      },
      { threshold: 0.35 },
    );
    const startOnRequest = () => {
      requested = true;
      if (visible && player.paused) play();
    };
    // Ambient light: sample the playing frame at low resolution about 8 times a second and
    // take the colour of its saturated, bright pixels (blue while the rays converge, orange
    // when they burst). That colour and its strength light the page around the frame.
    const stage = box.querySelector<HTMLElement>(".cv-about-stage");
    const canvas = document.createElement("canvas");
    canvas.width = 48;
    canvas.height = 33;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    let glowFrame = 0;
    let lastDraw = 0;
    const paint = (time: number) => {
      glowFrame = requestAnimationFrame(paint);
      if (
        !stage ||
        !context ||
        player.paused ||
        player.readyState < 2 ||
        time - lastDraw < 120
      )
        return;
      lastDraw = time;
      context.drawImage(player, 0, 0, canvas.width, canvas.height);
      const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let weight = 0;
      let red = 0;
      let green = 0;
      let blue = 0;
      for (let index = 0; index < data.length; index += 4) {
        const peak = Math.max(data[index], data[index + 1], data[index + 2]);
        const low = Math.min(data[index], data[index + 1], data[index + 2]);
        const saturation = peak === 0 ? 0 : (peak - low) / peak;
        // Only vivid, bright pixels (the rays and nodes) count; grey map and text do not.
        const value =
          saturation > 0.35 && peak > 110 ? saturation * (peak / 255) : 0;
        weight += value;
        red += data[index] * value;
        green += data[index + 1] * value;
        blue += data[index + 2] * value;
      }
      const pixels = data.length / 4;
      const strength = Math.min(1, Math.sqrt((weight / pixels) * 30) * 1.4);
      if (weight > 0.05) {
        // Full-brightness version of the average vivid colour.
        const scale =
          255 / Math.max(1, red / weight, green / weight, blue / weight);
        const channel = (sum: number) => Math.round((sum / weight) * scale);
        stage.style.setProperty(
          "--glow-rgb",
          `${channel(red)} ${channel(green)} ${channel(blue)}`,
        );
      }
      stage.style.setProperty("--glow-a", strength.toFixed(3));
    };
    const startGlow = () => {
      if (!glowFrame && !reducedMotion.matches)
        glowFrame = requestAnimationFrame(paint);
    };
    const stopGlow = () => {
      cancelAnimationFrame(glowFrame);
      glowFrame = 0;
      stage?.style.setProperty("--glow-a", "0");
    };
    player.addEventListener("play", startGlow);
    player.addEventListener("pause", stopGlow);

    near.observe(box);
    inView.observe(box);
    box.addEventListener("click", startOnRequest);
    return () => {
      stopGlow();
      player.removeEventListener("play", startGlow);
      player.removeEventListener("pause", stopGlow);
      near.disconnect();
      inView.disconnect();
      box.removeEventListener("click", startOnRequest);
    };
  }, []);

  return (
    <section className="cv-about site-container home-section" id="about">
      <div className="cv-about-copy">{children}</div>
      <figure className="cv-about-film" ref={figure}>
        <div className="cv-about-stage">
          <div className="cv-about-frame">
            <video
              ref={video}
              muted
              loop
              playsInline
              preload="none"
              disablePictureInPicture
              disableRemotePlayback
              poster={base + "/media/tch-convergence-v9-poster.webp"}
              aria-label={t.videoLabel}
            />
          </div>
        </div>
        <figcaption>{t.videoCaption}</figcaption>
      </figure>
    </section>
  );
}
