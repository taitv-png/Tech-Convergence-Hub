import { TCH_MARK, TCH_WORDMARK } from "./tch-logo";

// Vector lockup traced from the original logo file; colour follows currentColor.
export function TchLockup({ className, title = "Tech-Convergence Hub" }: { className?: string; title?: string }) {
  return (
    <svg
      className={className}
      viewBox={`0 0 ${TCH_WORDMARK.offsetX + TCH_WORDMARK.width} ${TCH_MARK.height}`}
      role="img"
      aria-label={title}
    >
      <path fill="currentColor" fillRule="evenodd" d={TCH_MARK.d} />
      <path
        fill="currentColor"
        fillRule="evenodd"
        transform={`translate(${TCH_WORDMARK.offsetX} 0)`}
        d={TCH_WORDMARK.d}
      />
    </svg>
  );
}
