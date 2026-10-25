import type { ReactNode } from "react";

// Each chapter owns a complete viewport. Coloured light ties it to the opening scene.
export function HomeFrame({ id, tone = "dark", color, motion = "rise", children }: {
  id?: string;
  tone?: "dark" | "light";
  color: "cyan" | "orange" | "violet" | "green";
  motion?: "rise" | "focus" | "split";
  children: ReactNode;
}) {
  return (
    <div id={id} className={`scene-frame tone-${tone} scene-${color} scene-motion-${motion}`}>
      <div className="scene-light" aria-hidden="true"><i /><i /><i /><i /><i /></div>
      <div className="scene-content">{children}</div>
    </div>
  );
}
