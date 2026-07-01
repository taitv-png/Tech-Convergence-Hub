"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavItem = {
  href: string;
  label: string;
};

function MenuIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-4.2-4.2" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.8-3.5 5-5 8-5s6.2 1.5 8 5" />
    </svg>
  );
}

const navItems = [
  { href: "/", label: "Về TCH" },
  { href: "/news", label: "Tin & sự kiện" },
  { href: "/", label: "Giáo dục" },
  { href: "/labs", label: "Danh mục labs" },
  { href: "/", label: "Nhân sự" },
  { href: "/news", label: "Video" },
  { href: "/news", label: "Ấn phẩm" },
  { href: "/", label: "Liên hệ" },
] satisfies NavItem[];

export function Header() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const pathname = usePathname();
  const [isOverlay, setIsOverlay] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const isHeroRoute =
      pathname === "/" ||
      pathname === "/labs" ||
      pathname === "/news" ||
      /^\/labs\/[^/]+$/.test(pathname) ||
      /^\/news\/[^/]+$/.test(pathname);

    const getHeroTransitionPoint = () => {
      const heroMedia = document.querySelector<HTMLElement>(
        ".hero-media-main, .page-title-media, .news-title-media, .lab-detail-media, .news-detail-media"
      );

      if (!heroMedia) {
        return 56;
      }

      const heroBottom = heroMedia.getBoundingClientRect().bottom + window.scrollY;
      const headerHeight = 76;
      const earlyOffset = 32;

      return Math.max(56, heroBottom - headerHeight - earlyOffset);
    };

    const updateHeaderMode = () => {
      if (!isHeroRoute) {
        setIsOverlay(false);
        return;
      }

      const transitionPoint = getHeroTransitionPoint();
      setIsOverlay(window.scrollY <= transitionPoint);
    };

    updateHeaderMode();
    window.addEventListener("scroll", updateHeaderMode, { passive: true });
    window.addEventListener("resize", updateHeaderMode);

    return () => {
      window.removeEventListener("scroll", updateHeaderMode);
      window.removeEventListener("resize", updateHeaderMode);
    };
  }, [pathname]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isActive = (item: NavItem) => {
    const href = item.href;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className={`header ${isOverlay ? "header-overlay" : "header-solid"}`}>
      <div className="container nav">
        <Link className="logo" href="/">
          <span className="logo-mark">
            <Image src={`${basePath}/tch_logo.ico`} width={32} height={32} alt="tch" />
          </span>
          <span>
            Tech-Convergence Hub
          </span>
        </Link>

        <div className="nav-tools" aria-label="Công cụ điều hướng">
          <button className="nav-icon-btn" type="button" aria-label="Tìm kiếm" title="Tìm kiếm">
            <SearchIcon />
          </button>

          <button className="nav-icon-btn" type="button" aria-label="Đăng nhập" title="Đăng nhập">
            <UserIcon />
          </button>

          <button
            className="mobile-toggle nav-icon-btn"
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="primary-nav"
            aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
            title={isMenuOpen ? "Đóng menu" : "Mở menu"}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            <span className="sr-only">{isMenuOpen ? "Đóng" : "Menu"}</span>
          </button>
        </div>

        <nav id="primary-nav" className={`nav-links ${isMenuOpen ? "is-open" : ""}`}>
          <button
            className="nav-close nav-icon-btn"
            type="button"
            aria-label="Đóng menu"
            title="Đóng menu"
            onClick={() => setIsMenuOpen(false)}
          >
            <CloseIcon />
            <span className="sr-only">Đóng</span>
          </button>

          {navItems.map((item) => {
            const active = isActive(item);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={active ? "active" : undefined}
                aria-current={active ? "page" : undefined}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
