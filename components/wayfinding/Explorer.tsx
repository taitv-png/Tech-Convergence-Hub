"use client";
import dynamic from "next/dynamic";
import { getDictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";

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
  return (
    <div className="wayfinding-scope" lang={locale}>
      <Campus />
    </div>
  );
}
