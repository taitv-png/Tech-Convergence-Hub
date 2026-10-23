import type { ReactNode } from "react";
import { RootShell } from "@/components/RootShell";
import { siteMetadata } from "@/components/views/metadata";

export const metadata = siteMetadata("vi");

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return <RootShell locale="vi">{children}</RootShell>;
}
