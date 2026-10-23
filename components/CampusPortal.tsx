"use client";

import { useState } from "react";
import Link from "next/link";
import { Arrow } from "./Arrow";
import { floorRooms } from "./wayfinding/floor-rooms";
import { floorCount, getAllSpaces } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { floorName, localePath, type Locale } from "@/lib/i18n";

export function CampusPortal({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const [floor, setFloor] = useState(1);
  const spaces = getAllSpaces(locale).filter((space) => space.floor === String(floor));
  const rooms = floorRooms(floor);
  const to = (path: string) => localePath(locale, path);
  return (
    <div className="campus-console">
      <div className="campus-console-top">
        <span>UEH · CAMPUS E</span>
        <span>{t.campus.floors(floorCount)}</span>
      </div>
      <div className="campus-console-view">
        <div className="campus-levels" role="group" aria-label={t.campus.chooseFloor}>
          {Array.from({ length: floorCount }, (_, index) => floorCount - 1 - index).map((level) => (
            <button key={level} type="button" aria-pressed={floor === level}
              aria-label={floorName(locale, String(level))} onClick={() => setFloor(level)}>
              {level === 0 ? "GF" : `F${level}`}<span aria-hidden="true" />
            </button>
          ))}
        </div>
        <div className="campus-plan">
          <div className="campus-plan-heading" aria-live="polite">
            <strong>{floorName(locale, String(floor))}</strong>
            <span>{t.campus.chooseRoom}</span>
          </div>
          <svg key={floor} viewBox="0 0 1080 790" role="group" aria-label={t.campus.planLabel(floorName(locale, String(floor)))}>
            <defs>
              <pattern id="campus-preview-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeOpacity=".08" /></pattern>
            </defs>
            <rect width="1080" height="790" fill="url(#campus-preview-grid)" />
            <path className="campus-plan-outline" d="M25 20H1010V745H25Z" />
            {rooms.map((room) => {
              const [x1,y1,x2,y2] = room.box;
              const label = spaces.filter((space) => room.id.split("+").some((id) => space.room.includes(id))).map((space) => space.name).join(", ") || room.id;
              const d = room.outline?.map(([x,y], index) => `${index ? "L" : "M"}${x * 100} ${y * 100}`).join(" ") + "Z";
              return (
                <Link key={room.id} href={to(`/explore?room=${encodeURIComponent(room.id)}`)} aria-label={`${t.campus.openRoom}: ${room.id}, ${label}`}>
                  <g className="campus-plan-room">
                    {room.outline ? <path d={d} /> : <rect x={x1*100} y={y1*100} width={(x2-x1)*100} height={(y2-y1)*100} rx="8" />}
                    <text x={(x1+x2)*50} y={(y1+y2)*50} textAnchor="middle" dominantBaseline="middle">{room.id.replace("+", " / ")}</text>
                    <circle cx={room.door[0]*100} cy={room.door[1]*100} r="6" />
                  </g>
                </Link>
              );
            })}
          </svg>
        </div>
      </div>
      <div className="campus-console-bottom">
        <p>{t.campus.previewHint}</p>
        <Link className="text-link" href={to(`/explore?floor=${floor}`)}>{t.campus.enterFloor} <Arrow diagonal /></Link>
      </div>
    </div>
  );
}
