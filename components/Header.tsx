"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Tổng quan" },
  { href: "/labs", label: "Phòng thí nghiệm" },
  { href: "/news", label: "Tin tức" },
];

export function Header() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const pathname = usePathname();
  const [isOverlay, setIsOverlay] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const isHeroRoute =
      pathname === "/" || /^\/labs\/[^/]+$/.test(pathname) || /^\/news\/[^/]+$/.test(pathname);

    const updateHeaderMode = () => {
      if (!isHeroRoute) {
        setIsOverlay(false);
        return;
      }

      setIsOverlay(window.scrollY <= 56);
    };

    updateHeaderMode();
    window.addEventListener("scroll", updateHeaderMode, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateHeaderMode);
    };
  }, [pathname]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
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

        <button
          className="mobile-toggle"
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="primary-nav"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? "Đóng" : "Menu"}
        </button>

        <nav id="primary-nav" className={`nav-links ${isMenuOpen ? "is-open" : ""}`}>
          <button className="nav-close" type="button" onClick={() => setIsMenuOpen(false)}>
            Đóng
          </button>

          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
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
