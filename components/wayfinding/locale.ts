// Map copy follows the page language. The map runs only in the browser, and each locale has
// its own root layout with <html lang>, so the language is read from the document.
export const mapIsEnglish = () =>
  typeof document === "undefined" || document.documentElement.lang !== "vi";

// Pick the copy for the current page: tr("Vietnamese", "English").
export const tr = (vi: string, en: string) => (mapIsEnglish() ? en : vi);
