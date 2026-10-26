"use client";
import dynamic from "next/dynamic";
import { getDictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { useCallback, useEffect, useRef, useState } from "react";
import { CampusIntro } from "./intro-screen";
import "@/app/wayfinding-intro.css";

const Campus = dynamic(() => import("./CampusEMap"), {
  ssr: false,
  loading: () => (
    <div className="explorer-loading" role="status">
      {getDictionary(
        typeof document !== "undefined" && document.documentElement.lang === "vi" ? "vi" : "en",
      ).intro.mapLoading}
    </div>
  ),
});

// The map reads the page language from <html lang> (see ./locale.ts).
export function Explorer({ locale }: { locale: Locale }) {
  const [welcome, setWelcome] = useState(true);
  const host = useRef<HTMLDivElement>(null);
  const start = useCallback(() => setWelcome(false), []);
  useEffect(() => { if (!welcome) host.current?.focus({ preventScroll: true }); }, [welcome]);
  return (
    <div ref={host} className="wayfinding-scope" lang={locale} tabIndex={-1}>
      {welcome ? <CampusIntro locale={locale} onDone={start} /> : <Campus />}
    </div>
  );
}
