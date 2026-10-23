import Image from "next/image";
import Link from "next/link";
import { Arrow } from "./Arrow";
import { getDictionary } from "@/lib/dictionary";
import { localePath, type Locale } from "@/lib/i18n";

export function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).footer;
  const to = (path: string) => localePath(locale, path);
  return (
    <footer className="site-footer" id="contact">
      <div className="site-container">
        <div className="footer-top">
          <div>
            <Image
              src={(process.env.NEXT_PUBLIC_BASE_PATH ?? "") + "/tch-logo-lockup.png"}
              width={200}
              height={70}
              alt="Tech-Convergence Hub"
            />
            <p>
              {t.tagline[0]}
              <br />
              {t.tagline[1]}
            </p>
          </div>
          <div>
            <span className="eyebrow">{t.explore}</span>
            <Link href={to("/labs")}>{t.labs}</Link>
            <Link href={to("/explore")}>{t.map}</Link>
            <Link href={to("/news")}>{t.news}</Link>
          </div>
          <div>
            <span className="eyebrow">{t.connect}</span>
            <a href="mailto:tch@ueh.edu.vn">
              tch@ueh.edu.vn <Arrow diagonal />
            </a>
            <p>
              {t.address[0]}
              <br />
              {t.address[1]}
            </p>
            <a href="https://iscm.ueh.edu.vn/" target="_blank" rel="noreferrer">
              ISCM, UEH <Arrow diagonal />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Tech-Convergence Hub</span>
          <span>{t.platform}</span>
          <Link href={to("/credits")}>{t.credits}</Link>
          <a href="#main-content">{t.top} ↑</a>
        </div>
      </div>
    </footer>
  );
}
