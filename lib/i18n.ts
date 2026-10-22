// Locales: English is the default and lives at the site root; Vietnamese lives under /vi.
// Each locale has its own root layout (app/(en) and app/(vi)), so html lang, metadata and
// all copy are in the static HTML. Data keys (lab.id, room codes, theme ids, cluster keys)
// never change between locales.
export type Locale = "en" | "vi";

export const defaultLocale: Locale = "en";

// Internal path (always written in English form, e.g. "/labs?theme=ai#lab-directory")
// to the path for a locale.
export function localePath(locale: Locale, path: string): string {
  if (locale === "en") return path;
  if (path === "/" || path === "") return "/vi";
  if (path.startsWith("/#") || path.startsWith("/?")) return "/vi" + path.slice(1);
  return "/vi" + path;
}

// Path without base path, as usePathname returns it, to the same page in the other locale.
export function switchLocalePath(pathname: string, to: Locale): string {
  const bare = pathname === "/vi" ? "/" : pathname.startsWith("/vi/") ? pathname.slice(3) : pathname;
  return localePath(to, bare);
}

export function localeFromPathname(pathname: string): Locale {
  return pathname === "/vi" || pathname.startsWith("/vi/") ? "vi" : "en";
}

export const htmlLang: Record<Locale, string> = { en: "en", vi: "vi" };
export const ogLocale: Record<Locale, string> = { en: "en_US", vi: "vi_VN" };

// Floor names used in cards and filters.
export function floorName(locale: Locale, floor: string): string {
  if (locale === "vi") return floor === "0" ? "Tầng trệt" : "Tầng " + floor;
  return floor === "0" ? "Ground floor" : "Floor " + floor;
}

// Accent- and case-insensitive text for search across both languages.
export function normalizeSearch(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}
