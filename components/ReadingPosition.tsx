"use client";

import { useEffect } from "react";

// Keeps the reader's place when switching language. Both locales render the same sections
// in the same order, so the place is stored as "section n, fraction f of its height" rather
// than a pixel offset (text lengths differ between English and Vietnamese).
const KEY = "tch-reading-position";
type SavedPosition = {
  path: string; index: number; fraction: number; y: number; at: number;
  chapter?: { id: string; fraction: number };
  hash?: string;
};
const pathKey = (path: string) => path.replace(/\/+$/, "") || "/";

const anchors = () =>
  Array.from(document.querySelectorAll<HTMLElement>("main section, main article, main .lab-card"));

export function rememberReadingPosition(targetPath: string) {
  try {
    const line = window.innerHeight * 0.3;
    const list = anchors();
    let index = -1;
    list.forEach((element, i) => {
      if (element.getBoundingClientRect().top <= line) index = i;
    });
    let fraction = 0;
    if (index >= 0) {
      const rect = list[index].getBoundingClientRect();
      fraction = rect.height ? (line - rect.top) / rect.height : 0;
    }
    const rail = [...document.querySelectorAll<HTMLElement>(".chapter-rail.is-horizontal")].find((element) => {
      const rect = element.getBoundingClientRect();
      const header = Number.parseFloat(getComputedStyle(element).getPropertyValue("--header-height")) || 0;
      return rect.top <= header + 1 && rect.bottom >= window.innerHeight - 1;
    });
    let chapter: SavedPosition["chapter"];
    if (rail?.dataset.firstChapter) {
      const header = Number.parseFloat(getComputedStyle(rail).getPropertyValue("--header-height")) || 0;
      const stage = rail.querySelector<HTMLElement>(".chapter-stage");
      const distance = rail.offsetHeight - (stage?.offsetHeight ?? 0);
      chapter = { id: rail.dataset.firstChapter, fraction: Math.min(1, Math.max(0, (header - rail.getBoundingClientRect().top) / Math.max(1, distance))) };
    }
    sessionStorage.setItem(
      KEY,
      JSON.stringify({ path: targetPath, index, fraction, y: window.scrollY, at: Date.now(), chapter, hash: window.location.hash }),
    );
    return Boolean(chapter);
  } catch {
    // Storage blocked: the switch still works, it just starts at the top.
  }
  return false;
}

export function ReadingPosition() {
  useEffect(() => {
    let saved: SavedPosition | null = null;
    try {
      saved = JSON.parse(sessionStorage.getItem(KEY) ?? "null");
      sessionStorage.removeItem(KEY);
    } catch {
      return;
    }
    if (!saved || Date.now() - saved.at > 15000 || pathKey(saved.path) !== pathKey(window.location.pathname)) return;
    const position = saved;
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const restore = () => {
      // Both horizontal panels have the same vertical position. Retain the scroll phase
      // rather than selecting the later, potentially hidden section when changing language.
      const rail = position.chapter ? document.getElementById(position.chapter.id)?.closest<HTMLElement>(".chapter-rail.is-horizontal") : null;
      if (rail && position.chapter) {
        const header = Number.parseFloat(getComputedStyle(rail).getPropertyValue("--header-height")) || 0;
        const stage = rail.querySelector<HTMLElement>(".chapter-stage");
        const distance = rail.offsetHeight - (stage?.offsetHeight ?? 0);
        window.scrollTo({ top: Math.max(0, window.scrollY + rail.getBoundingClientRect().top - header + position.chapter.fraction * distance), behavior: "instant" });
        if (position.hash && window.location.hash !== position.hash) {
          history.replaceState(history.state, "", window.location.pathname + window.location.search + position.hash);
        }
        return;
      }
      const list = anchors();
      const element = list[position.index];
      let y = position.y;
      if (element) {
        const rect = element.getBoundingClientRect();
        y = window.scrollY + rect.top + position.fraction * rect.height - window.innerHeight * 0.3;
      }
      window.scrollTo({ top: Math.max(0, y), behavior: "auto" });
    };
    // Once now, and again after images and fonts settle the layout.
    restore();
    const timers = [150, 600].map((delay) => window.setTimeout(restore, delay));
    window.addEventListener("load", restore, { once: true });
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("load", restore);
    };
  }, []);
  return null;
}
