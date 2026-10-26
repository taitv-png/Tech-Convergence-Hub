import Image from "next/image";
import Link from "next/link";
import { Arrow } from "./Arrow";
import { floorCount } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { localePath, type Locale } from "@/lib/i18n";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function CampusPortal({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <Link className="campus-portal" href={localePath(locale, "/explore")} aria-label={t.campus.portalLabel}>
      <Image
        src={`${base}/intro/campus-e.jpg`}
        alt={t.campus.portalAlt}
        fill
        sizes="(max-width: 980px) 100vw, 50vw"
      />
      <span className="campus-portal-top" aria-hidden="true">
        <span>UEH · CAMPUS E</span>
        <span>{t.campus.floors(floorCount)}</span>
      </span>
      <span className="campus-portal-caption">
        <span>
          <strong>{t.campus.meet}</strong>
          <span>{t.nav.visit}</span>
        </span>
        <span className="campus-portal-arrow"><Arrow diagonal /></span>
      </span>
    </Link>
  );
}
