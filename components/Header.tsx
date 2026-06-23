"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="header">
      <div className="container nav">
        <Link className="logo" href="/">
          <span className="logo-mark">
            <Image src={`${basePath}/tch_logo.ico`} width={32} height={32} alt="tch" />
          </span>
          <span>
            Tech-Convergence Hub<small>UEH Technology Platform</small>
          </span>
        </Link>
        <nav className="nav-links">
          <Link
            href="/"
            className={isActive("/") ? "active" : undefined}
            aria-current={isActive("/") ? "page" : undefined}
          >
            Tổng quan
          </Link>
          <Link
            href="/labs"
            className={isActive("/labs") ? "active" : undefined}
            aria-current={isActive("/labs") ? "page" : undefined}
          >
            Lab
          </Link>
          <Link
            href="/news"
            className={isActive("/news") ? "active" : undefined}
            aria-current={isActive("/news") ? "page" : undefined}
          >
            Tin tức
          </Link>
        </nav>
      </div>
    </header>
  );
}
