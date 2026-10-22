"use client";

import { useEffect } from "react";

// Keeps the reader's place when switching language. Both locales render the same sections
// in the same order, so the place is stored as "section n, fraction f of its height" rather
// than a pixel offset (text lengths differ between English and Vietnamese).
const KEY = "tch-reading-position";

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
    sessionStorage.setItem(
      KEY,
      JSON.stringify({ path: targetPath, index, fraction, y: window.scrollY, at: Date.now() }),
    );
  } catch {
    // Storage blocked: the switch still works, it just starts at the top.
  }
}

export function ReadingPosition() {
  useEffect(() => {
    let saved: { path: string; index: number; fraction: number; y: number; at: number } | null = null;
    try {
      saved = JSON.parse(sessionStorage.getItem(KEY) ?? "null");
      sessionStorage.removeItem(KEY);
    } catch {
      return;
    }
    if (!saved || Date.now() - saved.at > 15000 || saved.path !== window.location.pathname) return;
    const position = saved;
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const restore = () => {
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
