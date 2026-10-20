"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Arrow } from "./Arrow";
const items = [
  { href: "/", label: "Trang chủ" },
  { href: "/#about", label: "Về TCH" },
  { href: "/labs", label: "Không gian & Labs" },
  { href: "/news", label: "Tin & hoạt động" },
];
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Đi đến nội dung
      </a>
      <header className="site-header">
        <div className="site-container header-row">
          <Link href="/" aria-label="TCH, trang chủ">
            <Image
              src={(process.env.NEXT_PUBLIC_BASE_PATH ?? "") + "/tch-logo-lockup.png"}
              alt="Tech-Convergence Hub"
              width={172}
              height={60}
              priority
              className="brand-image"
            />
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            aria-expanded={open}
            aria-controls="site-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? "Đóng ×" : "Menu ☰"}
          </button>
          <nav
            id="site-navigation"
            className={"site-navigation " + (open ? "is-open" : "")}
            aria-label="Điều hướng chính"
          >
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              className="button button-dark nav-explore"
              href="/explore"
              onClick={() => setOpen(false)}
            >
              Tham quan Campus E <Arrow diagonal />
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
