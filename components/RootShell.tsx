import type { ReactNode } from "react";
import "@/app/fonts.css";
import "@/app/globals.css";
import "@/app/redesign.css";
import "@/app/motion.css";
import "@/app/graphic.css";
import "@/app/intro.css";
import "@/app/theme-dark.css";
import { SiteMotion } from "./SiteMotion";
import { ScrollToTop } from "./ScrollToTop";
import { ReadingPosition } from "./ReadingPosition";
import { htmlLang, type Locale } from "@/lib/i18n";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const cssVars = {
  ["--img-labs-title" as string]: `url("${basePath}/lab-images/5.jpg")`,
  ["--img-news-title" as string]: `url("${basePath}/logos/vien-doi-moi-sang-tao-ueh-uii.jpg")`,
} as React.CSSProperties;

// Shared document for both root layouts. The charcoal theme comes from CSS on <html>, so a
// page opened directly never flashes white before scripts run.
export function RootShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={htmlLang[locale]} data-theme="dark" style={{ backgroundColor: "#121110", colorScheme: "dark" }}>
      <body style={cssVars}>
        {children}
        <SiteMotion />
        <ScrollToTop locale={locale} />
        <ReadingPosition />
      </body>
    </html>
  );
}
