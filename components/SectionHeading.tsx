import type { ReactNode } from "react";

// Section title with an optional supporting line. No decorative numbering.
export function SectionHeading({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="section-masthead">
      <h2>{title}</h2>
      {children && <p className="section-deck">{children}</p>}
    </div>
  );
}
