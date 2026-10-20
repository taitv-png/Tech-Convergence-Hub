import Image from "next/image";
import Link from "next/link";
import { Arrow } from "./Arrow";
import { floorLabels } from "@/data/labs";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function CampusPortal() {
  return (
    <Link
      className="campus-portal"
      href="/explore"
      aria-label="Bước vào bản đồ và tham quan Campus E"
    >
      <Image
        src={base + "/images/campus-e.jpg"}
        width={800}
        height={1199}
        alt="Mặt tiền Campus E, UEH, tại 54 Nguyễn Văn Thủ"
        loading="lazy"
      />
      <span className="campus-portal-top">
        <span>UEH · CAMPUS E</span>
        <span>{String(Object.keys(floorLabels).length).padStart(2, "0")} TẦNG</span>
      </span>
      <span className="campus-portal-caption">
        <span>
          <strong>Hẹn gặp tại E.</strong>
          <span>54 Nguyễn Văn Thủ, TP. Hồ Chí Minh</span>
        </span>
        <span className="campus-portal-arrow">
          <Arrow diagonal />
        </span>
      </span>
    </Link>
  );
}
