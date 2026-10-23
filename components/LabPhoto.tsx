import { labPhotos } from "@/data/lab-photos";
import { photoAltEn } from "@/data/content-en";
import { getDictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// One illustrative photograph per lab, mapped by lab.id. Responsive sizes, natural colour,
// crop centred on the subject through objectPosition from the manifest.
export function LabPhoto({
  id,
  locale,
  sizes = "(min-width: 1100px) 400px, (min-width: 700px) 50vw, 100vw",
  priority = false,
  className = "cv-photo",
}: {
  id: string;
  locale: Locale;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const photo = labPhotos[id];
  if (!photo) return null;
  const path = (width: number) => `${base}/images/labs/${id}-${width}.jpg`;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src={path(1280)}
      srcSet={`${path(640)} 640w, ${path(1280)} 1280w`}
      sizes={sizes}
      width={photo.width}
      height={photo.height}
      alt={locale === "en" ? photoAltEn[id] ?? photo.alt : photo.alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      style={{ objectPosition: photo.objectPosition }}
    />
  );
}

// Short credit line for detail pages; the full list lives on /credits.
export function LabPhotoCredit({ id, locale }: { id: string; locale: Locale }) {
  const photo = labPhotos[id];
  if (!photo) return null;
  return (
    <span className="cv-photo-credit">
      {getDictionary(locale).credits.photoNote} ·{" "}
      <a href={photo.sourceURL} target="_blank" rel="noreferrer">
        {photo.author}
      </a>{" "}
      ·{" "}
      <a href={photo.licenseURL} target="_blank" rel="noreferrer">
        {photo.license}
      </a>
    </span>
  );
}
