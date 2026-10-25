"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Arrow } from "./Arrow";
import { getDictionary } from "@/lib/dictionary";
import { localePath, switchLocalePath, type Locale } from "@/lib/i18n";
import { rememberReadingPosition } from "./ReadingPosition";
import { TechnologyLight } from "./TechnologyLight";
import { TchLockup } from "./TchLockup";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function Header({ locale }: { locale: Locale }) {
  const copy = getDictionary(locale);
  const t = copy.nav;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
    setClosing(false);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, [pathname]);
  // On the home page, "About" is current while the About section crosses the middle band.
  useEffect(() => {
    setAboutInView(false);
    const anchor = document.getElementById("about");
    const about = anchor?.closest(".chapter-rail")?.querySelector(".scene-frame") ?? anchor;
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
    const modal = dialog.current;
    if (!open || !modal) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    modal.showModal();
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      modal.close();
      root.style.overflow = previousOverflow;
      toggle.current?.focus({ preventScroll: true });
    };
  }, [open]);

  const closeMenu = () => {
    if (closing) return;
    setClosing(true);
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 380;
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, delay);
  };

  // Switching language keeps the page, its filters (query string) and its anchor. The other
  // locale has its own root layout, so this is a full page load.
  const switchLanguage = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const chapterSaved = rememberReadingPosition(base + otherHref);
    // A native hash jump would reset a sideways chapter to its start. Restore that hash
    // with the reading position once the other locale has mounted instead.
    window.location.assign(base + otherHref + window.location.search + (chapterSaved ? "" : window.location.hash));
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
            <Link className="header-visit" href={localePath(locale, "/explore")}>
              {t.visit} <Arrow diagonal />
            </Link>
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
              ref={toggle}
              className="header-menu-toggle"
              aria-label={open ? t.menuClose : t.menuOpen}
              aria-expanded={open}
              aria-controls="tch-menu"
              aria-haspopup="dialog"
              onClick={() => { setClosing(false); setOpen(true); }}
            >
              <span className="header-menu-label">{t.menu}</span>
              <span className="header-menu-lines" aria-hidden="true"><i /><i /><i /></span>
            </button>
          </div>
        </div>
      </header>
      <dialog
        ref={dialog}
        id="tch-menu"
        className={`tch-menu${closing ? " is-closing" : ""}`}
        aria-label={t.main}
        onCancel={(event) => { event.preventDefault(); closeMenu(); }}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const controls = [...event.currentTarget.querySelectorAll<HTMLElement>("a[href], button")]
            .filter((node) => node.getClientRects().length > 0);
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
      >
        <div className="tch-menu-art">
          <TechnologyLight />
          <TchLockup className="tch-menu-lockup" />
          <div className="tch-menu-statement">
            <span className="tch-menu-kicker">TECH-CONVERGENCE HUB / CAMPUS E</span>
            <p>{copy.intro.headlineA} <span>{copy.intro.headlineAccent}</span><br />{copy.intro.headlineB}</p>
            <span className="tch-menu-scene">{copy.intro.scene}</span>
          </div>
        </div>
        <div className="tch-menu-content">
          <div className="tch-menu-top">
            <span>{copy.footer.explore}</span>
            <button type="button" className="tch-menu-close" onClick={closeMenu} autoFocus aria-label={t.menuClose}>
              <span>{t.close}</span><span className="tch-menu-x" aria-hidden="true" />
            </button>
          </div>
          <nav className="tch-menu-navigation" aria-label={t.main}>
            {items.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                aria-current={
                  isCurrent(item.key, item.href) ? (item.key === "about" ? "location" : "page") : undefined
                }
                onClick={closeMenu}
              >
                <span>{item.label}</span><Arrow diagonal />
              </Link>
            ))}
            <Link
              className="tch-menu-campus"
              href={localePath(locale, "/explore")}
              onClick={closeMenu}
            >
              {t.visit} <Arrow diagonal />
            </Link>
          </nav>
          <div className="tch-menu-bottom">
            <p>{copy.footer.address[0]}<br />{copy.footer.address[1]}</p>
            <a href={base + otherHref} hrefLang={other} lang={other} onClick={switchLanguage}>{t.switchTo} <Arrow diagonal /></a>
          </div>
        </div>
      </dialog>
    </>
  );
}
