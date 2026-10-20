import type { SVGProps } from "react";
const icon = (path: string) =>
  function Icon(props: SVGProps<SVGSVGElement>) {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        <path d={path} />
      </svg>
    );
  };
export const ArrowLeft = icon("M20 12H4m6-6-6 6 6 6");
export const Building2 = icon("M4 21V3h12v18H4Zm12-12h4v12h-4M8 7h4M8 11h4M8 15h4M9 21v-3h2v3");
export const ChevronRight = icon("m9 5 7 7-7 7");
export const Footprints = icon(
  "M7 3c-3 0-4 7-2 9 2 2 5-1 5-4 0-3-1-5-3-5ZM16 12c-3 0-4 6-2 8 2 2 5-1 5-4 0-3-1-4-3-4M5 16h3m7-9h3",
);
export const LocateFixed = icon(
  "M12 2v4m0 12v4M2 12h4m12 0h4M18 12a6 6 0 1 1-12 0 6 6 0 0 1 12 0ZM14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z",
);
export const Map = icon("m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Zm6-3v15m6-12v15");
export const Navigation = icon("m3 10 18-7-7 18-3-10-8-1Z");
export const RotateCcw = icon("M3 10a9 9 0 1 1 3 9M3 4v6h6");
export const Route = icon(
  "M8 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM22 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM5 15V8a3 3 0 0 1 3-3h5m6 4v7a3 3 0 0 1-3 3h-5",
);
export const Rotate3D = icon("m12 3 8 5v8l-8 5-8-5V8l8-5Zm-8 5 8 5 8-5m-8 5v8");
