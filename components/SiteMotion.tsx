"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export function SiteMotion() {
  const pathname = usePathname();
  const router = useRouter();
  const [transitioning, setTransitioning] = useState(false);
  const navigateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const releaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!document.querySelector(".scene-frame")) return;
    const screen = window.matchMedia("(min-width: 1100px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)");
    const apply = () => document.documentElement.classList.toggle("home-frames", screen.matches);
    apply();
    screen.addEventListener("change", apply);
    // The pinned intro changes height after hydration. Resolve a direct chapter link
    // once those child effects have settled, so #about lands on the frame itself.
    let anchorFrame = requestAnimationFrame(() => {
      anchorFrame = requestAnimationFrame(() => {
        let id = "";
        try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
        const target = id ? document.getElementById(id) : null;
        if (target?.classList.contains("scene-frame")) target.scrollIntoView({ block: "start", behavior: "instant" });
      });
    });
    return () => {
      cancelAnimationFrame(anchorFrame);
      screen.removeEventListener("change", apply);
      document.documentElement.classList.remove("home-frames");
    };
  }, [pathname]);

  useEffect(() => {
    const section = document.querySelector<HTMLElement>(".explore-band");
    if (!section) return;
    const body = document.body;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    body.dataset.scrollTheme = "campus";
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const height = window.innerHeight;
      // Darken only once the previous section (Không gian & Labs) has mostly left the frame.
      const ramp = height * 0.45;
      let darkness = Math.max(0, Math.min(1, (height * 0.45 - rect.top) / ramp, rect.bottom / (height * 0.65)));
      if (reducedMotion.matches)
        darkness = rect.top < height * 0.5 && rect.bottom > height * 0.5 ? 1 : 0;
      else darkness = darkness * darkness * (3 - 2 * darkness);
      // The opening (lasers, Campus E film, logo door) stays charcoal until the door has opened.
      const introEnd = document.querySelector<HTMLElement>(".cv-dark-end");
      if (introEnd) {
        const top = introEnd.getBoundingClientRect().top;
        const intro = reducedMotion.matches
          ? top > 0 ? 1 : 0
          : Math.max(0, Math.min(1, top / (height * 0.12)));
        darkness = Math.max(darkness, intro);
      }
      body.style.setProperty("--journey-darkness", darkness.toFixed(4));
      body.style.setProperty("--journey-light-share", `${((1 - darkness) * 100).toFixed(2)}%`);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(section);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reducedMotion.addEventListener("change", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reducedMotion.removeEventListener("change", schedule);
      delete body.dataset.scrollTheme;
      body.style.removeProperty("--journey-darkness");
      body.style.removeProperty("--journey-light-share");
    };
  }, [pathname]);

  useEffect(() => {
    setTransitioning(false);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = document.querySelectorAll<HTMLElement>(
      ".section-heading, .cv-figures, .cluster-item, .featured-grid > a, .cv-models-list > li, .home-news-grid > a, .explore-grid > *, .contact-band",
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    elements.forEach((element, index) => {
      if (reducedMotion.matches) return;
      element.classList.add("scroll-reveal");
      element.style.setProperty("--reveal-delay", `${(index % 3) * 70}ms`);
      if (element.getBoundingClientRect().top < window.innerHeight)
        element.classList.add("is-revealed");
      else observer.observe(element);
    });
    const restore = () => elements.forEach((element) => element.classList.add("is-revealed"));
    reducedMotion.addEventListener("change", restore);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", restore);
      restore();
    };
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link = (event.target as Element).closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      // The language switch reloads into the other root layout and carries the query string.
      if (link.hasAttribute("hreflang")) return;
      // SVG room links expose href as SVGAnimatedString rather than a string.
      const url = new URL(link.getAttribute("href") ?? "", window.location.href);
      if (url.origin !== window.location.origin || !/^https?:$/.test(url.protocol)) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search)
        return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      event.preventDefault();
      event.stopPropagation();
      if (navigateTimer.current) clearTimeout(navigateTimer.current);
      if (releaseTimer.current) clearTimeout(releaseTimer.current);
      setTransitioning(true);
      const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
      const target =
        (base && url.pathname === base
          ? "/"
          : base && url.pathname.startsWith(base + "/")
            ? url.pathname.slice(base.length)
            : url.pathname) +
        url.search +
        url.hash;
      navigateTimer.current = setTimeout(() => {
        router.push(target);
        // Query-only navigation and a failed navigation must never leave a curtain up.
        releaseTimer.current = setTimeout(() => setTransitioning(false), 1400);
      }, 230);
    };
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      if (navigateTimer.current) clearTimeout(navigateTimer.current);
      if (releaseTimer.current) clearTimeout(releaseTimer.current);
    };
  }, [router]);

  return (
    <div className={`route-curtain${transitioning ? " is-transitioning" : ""}`} aria-hidden="true">
      <span className="route-curtain-mark">
        TCH
        <span />
      </span>
    </div>
  );
}
