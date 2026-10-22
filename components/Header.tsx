"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import { Arrow } from "./Arrow";
import { getDictionary } from "@/lib/dictionary";
import { localePath, switchLocalePath, type Locale } from "@/lib/i18n";
import { rememberReadingPosition } from "./ReadingPosition";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function Header({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).nav;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [aboutInView, setAboutInView] = useState(false);
  const home = localePath(locale, "/");
  const items = [
    { href: home, label: t.home, key: "home" },
    { href: localePath(locale, "/#about"), label: t.about, key: "about" },
    { href: localePath(locale, "/labs"), label: t.labs, key: "labs" },
    { href: localePath(locale, "/news"), label: t.news, key: "news" },
  ];
  const other: Locale = locale === "en" ? "vi" : "en";
  const otherHref = switchLocalePath(pathname, other);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  // On the home page, "About" is current while the About section crosses the middle band.
  useEffect(() => {
    setAboutInView(false);
    const about = document.getElementById("about");
    if (pathname !== home || !about) return;
    const observer = new IntersectionObserver(([entry]) => setAboutInView(entry.isIntersecting), {
      rootMargin: "-45% 0px -45% 0px",
    });
    observer.observe(about);
    return () => observer.disconnect();
  }, [pathname, home]);
  const isCurrent = (key: string, href: string) => {
    if (key === "about") return pathname === home && aboutInView;
    if (key === "home") return pathname === home && !aboutInView;
    return pathname === href || pathname.startsWith(href + "/");
  };
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  // Switching language keeps the page, its filters (query string) and its anchor. The other
  // locale has its own root layout, so this is a full page load.
  const switchLanguage = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    rememberReadingPosition(base + otherHref);
    window.location.assign(base + otherHref + window.location.search + window.location.hash);
  };

  return (
    <>
      <a className="skip-link" href="#main-content">
        {t.skip}
      </a>
      <header className="site-header">
        <div className="site-container header-row">
          <Link href={home} aria-label={t.homeLabel}>
            <Image
              src={base + "/tch-logo-lockup.png"}
              alt="Tech-Convergence Hub"
              width={172}
              height={60}
              priority
              className="brand-image"
            />
          </Link>
          <div className="header-tools">
            <nav className="lang-switch" aria-label={t.language}>
              <span aria-current="true" lang={locale}>
                {locale.toUpperCase()}
              </span>
              <a
                href={base + otherHref}
                hrefLang={other}
                lang={other}
                onClick={switchLanguage}
                aria-label={t.switchTo}
                title={t.switchTo}
              >
                {other.toUpperCase()}
              </a>
            </nav>
            <button
              type="button"
              className="menu-toggle"
              aria-label={open ? t.menuClose : t.menuOpen}
              aria-expanded={open}
              aria-controls="site-navigation"
              onClick={() => setOpen(!open)}
            >
              {open ? t.close : t.menu}
            </button>
          </div>
          <nav
            id="site-navigation"
            className={"site-navigation " + (open ? "is-open" : "")}
            aria-label={t.main}
          >
            {items.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                aria-current={
                  isCurrent(item.key, item.href) ? (item.key === "about" ? "location" : "page") : undefined
                }
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              className="button button-dark nav-explore"
              href={localePath(locale, "/explore")}
              onClick={() => setOpen(false)}
            >
              {t.visit} <Arrow diagonal />
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
