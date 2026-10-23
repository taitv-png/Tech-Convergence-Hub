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
        src={base + "/images/campus-e.jpg"}
        width={800}
        height={1199}
        alt={t.campus.portalAlt}
        loading="lazy"
      />
      <span className="campus-portal-top">
        <span>UEH · CAMPUS E</span>
        <span>{t.campus.floors(floorCount)}</span>
      </span>
      <span className="campus-portal-caption">
        <span>
          <strong>{t.campus.meet}</strong>
          <span>{t.footer.address[1]}</span>
        </span>
        <span className="campus-portal-arrow">
          <Arrow diagonal />
        </span>
      </span>
    </Link>
  );
}
