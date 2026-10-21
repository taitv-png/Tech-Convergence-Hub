import { labPhotos } from "@/data/lab-photos";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// One illustrative photograph per lab, mapped by lab.id. Responsive sizes, natural colour,
// crop centred on the subject through objectPosition from the manifest.
export function LabPhoto({
  id,
  sizes = "(min-width: 1100px) 400px, (min-width: 700px) 50vw, 100vw",
  priority = false,
  className = "cv-photo",
}: {
  id: string;
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
      alt={photo.alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      style={{ objectPosition: photo.objectPosition }}
    />
  );
}

// Short credit line for detail pages; the full list lives on /credits.
export function LabPhotoCredit({ id }: { id: string }) {
  const photo = labPhotos[id];
  if (!photo) return null;
  return (
    <span className="cv-photo-credit">
      Ảnh minh họa, không phải ảnh chụp TCH ·{" "}
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
