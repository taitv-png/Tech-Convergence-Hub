"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getDictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { ROOM_CATALOGUE } from "./room-catalogue";
import { Map, Rotate3D, Route } from "./icons";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function CampusIntro({ locale, onDone }: { locale: Locale; onDone: () => void }) {
  const t = getDictionary(locale).explore.welcome;
  const modal = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const start = useRef<HTMLButtonElement>(null);
  const closing = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [leaving, setLeaving] = useState(false);
  const finish = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    setLeaving(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = setTimeout(onDone, reduced ? 0 : 650);
  }, [onDone]);

  useEffect(() => {
    const dialog = modal.current;
    if (!dialog) return;
    dialog.showModal();
    start.current?.focus({ preventScroll: true });
    return () => {
      if (timer.current) clearTimeout(timer.current);
      dialog.close();
    };
  }, []);

  useEffect(() => {
    const element = stage.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0, tx = 0, ty = 0, cx = 0, cy = 0;
    const move = (event: PointerEvent) => {
      tx = (event.clientX / window.innerWidth - .5) * 2;
      ty = (event.clientY / window.innerHeight - .5) * 2;
    };
    const tick = () => {
      cx += (tx - cx) * .06; cy += (ty - cy) * .06;
      element.style.setProperty("--mx", cx.toFixed(3));
      element.style.setProperty("--my", cy.toFixed(3));
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move);
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("pointermove", move); };
  }, []);

  const features = [
    { Icon: Route, title: t.directionsTitle, text: t.directions },
    { Icon: Rotate3D, title: t.buildingTitle, text: t.building },
    { Icon: Map, title: t.tourTitle, text: t.tour },
  ];
  const cards = [
    { file: "e102/102", code: "E102", label: t.card102, style: "a" },
    { file: "e401/144", code: "E401", label: t.card401, style: "b" },
    { file: "e104/134", code: "E104", label: t.card104, style: "c" },
  ];

  return <dialog ref={modal} className={"campus-intro-screen" + (leaving ? " leaving" : "")} aria-labelledby="campus-intro-title"
    onCancel={event => { event.preventDefault(); finish(); }}
    onKeyDown={event => { if (event.key === "Enter") { event.preventDefault(); finish(); } }}>
    <div className="campus-intro-bg" style={{ backgroundImage: `url(${base}/intro/campus-e.jpg)` }} aria-hidden="true" />
    <div className="campus-intro-grid" aria-hidden="true" />
    <header className="campus-intro-top">
      <img src={`${base}/tch-logo-lockup.png`} alt="Tech-Convergence Hub" width={190} height={52} />
      <button className="campus-intro-skip" onClick={finish}>{t.skip}</button>
    </header>
    <div className="campus-intro-copy">
      <p className="campus-intro-eyebrow"><i />{t.eyebrow}</p>
      <h1 id="campus-intro-title"><span>{t.title}</span><strong>{t.campus}</strong></h1>
      <p className="campus-intro-lead">{t.lead}</p>
      <dl className="campus-intro-stats">
        <div><dt>8</dt><dd>{t.floors}</dd></div>
        <div><dt>{Object.keys(ROOM_CATALOGUE).length}</dt><dd>{t.rooms}</dd></div>
        <div><dt>3</dt><dd>{t.connections}</dd></div>
      </dl>
      <ul className="campus-intro-features">{features.map(({ Icon, title, text }) => <li key={title}><Icon /><div><b>{title}</b><span>{text}</span></div></li>)}</ul>
      <div className="campus-intro-actions">
        <button ref={start} className="campus-intro-cta" onClick={finish}>{t.start}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6" /></svg></button>
        <span>{t.keyboard} <kbd>Enter</kbd></span>
      </div>
    </div>
    <div className="campus-intro-stage" ref={stage} aria-hidden="true">
      <div className="campus-intro-rig">
        <figure className="campus-intro-building">
          <img src={`${base}/intro/campus-e.jpg`} alt="" width={800} height={1199} />
          <div className="campus-intro-scan" />
          <svg className="campus-intro-route" viewBox="0 0 800 1199" preserveAspectRatio="none"><path d="M372 1010 L372 905 L560 905 L560 255" pathLength={1} /></svg>
          <span className="campus-intro-pin campus-intro-pin-start"><i />{t.entrance}</span>
          <span className="campus-intro-pin campus-intro-pin-end"><i />{t.floorSeven}</span>
        </figure>
        <ol className="campus-intro-floors">{["F7", "F6", "F5", "F4", "F3", "F2", "F1", "GF"].map((floor, index) => <li key={floor} style={{ animationDelay: `${1.1 + index * .07}s` }}>{floor}</li>)}</ol>
        {cards.map(card => <figure key={card.code} className={`campus-intro-card campus-intro-card-${card.style}`}><img src={`${base}/rooms/${card.file}.jpg`} alt="" width={960} height={540} /><figcaption><b>{card.code}</b>{card.label}</figcaption></figure>)}
      </div>
    </div>
  </dialog>;
}
