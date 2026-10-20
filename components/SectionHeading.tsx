import type { ReactNode } from "react";

export function SectionHeading({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-masthead">
      <div className="section-masthead-title">
        <span className="section-serial" aria-hidden="true">
          {number}
        </span>
        <h2>{title}</h2>
      </div>
      {children && <p className="section-deck">{children}</p>}
    </div>
  );
}
