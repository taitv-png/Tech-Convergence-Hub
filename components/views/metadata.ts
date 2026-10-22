import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionary";
import { localePath, ogLocale, type Locale } from "@/lib/i18n";
import { labs } from "@/data/labs";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Site-wide metadata for a locale, with alternate links between the two versions.
export function siteMetadata(locale: Locale, path = "/"): Metadata {
  const t = getDictionary(locale).meta;
  return {
    metadataBase: new URL("https://taitv-png.github.io"),
    icons: { icon: `${basePath}/tch-logo-lockup.png` },
    title: t.siteTitle,
    description: t.siteDescription,
    alternates: {
      languages: {
        en: `${basePath}${localePath("en", path)}`,
        vi: `${basePath}${localePath("vi", path)}`,
        "x-default": `${basePath}${localePath("en", path)}`,
      },
    },
    openGraph: {
      title: t.ogTitle,
      description: t.ogDescription(labs.length),
      images: ["/Tech-Convergence-Hub/og-preview.png"],
      locale: ogLocale[locale],
      alternateLocale: [ogLocale[locale === "en" ? "vi" : "en"]],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t.ogTitle,
      description: t.ogDescription(labs.length),
      images: ["/Tech-Convergence-Hub/og-preview.png"],
    },
  };
}

// Page metadata: title and description, plus alternates for this page.
export function pageMetadata(locale: Locale, path: string, title: string, description?: string): Metadata {
  return {
    title,
    description,
    alternates: {
      languages: {
        en: `${basePath}${localePath("en", path)}`,
        vi: `${basePath}${localePath("vi", path)}`,
        "x-default": `${basePath}${localePath("en", path)}`,
      },
    },
    openGraph: { title, description, locale: ogLocale[locale] },
  };
}
