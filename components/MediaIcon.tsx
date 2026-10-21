// Small line icons for compact media controls.
const paths = {
  play: "M8 5.5v13l10-6.5z",
  pause: "M8 5h3v14H8zM13 5h3v14h-3z",
  retry: "M18.5 9A7 7 0 1 0 19 13M18.5 4v5h-5",
  muted: "M4 9h4l5-4v14l-5-4H4zM16 9l5 6M21 9l-5 6",
  sound: "M4 9h4l5-4v14l-5-4H4zM16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12",
} as const;

export function MediaIcon({ name }: { name: keyof typeof paths }) {
  const filled = name === "play" || name === "pause";
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={paths[name]}
        fill={filled ? "currentColor" : "none"}
        stroke={filled ? "none" : "currentColor"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
