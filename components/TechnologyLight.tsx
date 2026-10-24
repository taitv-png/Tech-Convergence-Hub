import type { CSSProperties } from "react";

const tracks = [
  { color: "#ff934f", d: "M-80 820H140L340 620V260L470 130V-80" },
  { color: "#72dba9", d: "M-80 720H90L270 540V210L400 80V-80" },
  { color: "#73d7f0", d: "M-80 605H50L195 460V160L310 45V-80" },
  { color: "#bb8aef", d: "M1680 110H1460L1270 300V640L1130 780V980" },
  { color: "#ff934f", d: "M1680 225H1510L1340 395V710L1210 840V980" },
  { color: "#73d7f0", d: "M1680 340H1560L1410 490V770L1310 870V980" },
];

// Light travels around the content, never through the logo or reading area.
export function TechnologyLight({ className = "" }: { className?: string }) {
  return (
    <div className={`technology-light ${className}`} aria-hidden="true">
      <div className="technology-light-haze" />
      <svg viewBox="0 0 1600 900" preserveAspectRatio="none" fill="none">
        {tracks.map((track, index) => (
          <g key={track.d} style={{ color: track.color, "--light-delay": `${-index * 1.7}s` } as CSSProperties}>
            <path className="technology-light-glow" d={track.d} />
            <path className="technology-light-rail" d={track.d} />
            <path className="technology-light-packet" pathLength="100" d={track.d} />
          </g>
        ))}
        <ellipse className="technology-light-orbit" cx="800" cy="820" rx="620" ry="105" />
        <ellipse className="technology-light-orbit" cx="800" cy="820" rx="500" ry="76" />
      </svg>
    </div>
  );
}
