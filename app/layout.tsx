import type { Metadata } from "next";
import { labs } from "@/data/labs";
import "./fonts.css";
import "./globals.css";
import "./redesign.css";
import "./motion.css";
import "./intro.css";
import "./graphic.css";
import { SiteMotion } from "@/components/SiteMotion";
import { ScrollToTop } from "@/components/ScrollToTop";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const cssVars = {
  ["--img-labs-title" as string]: `url("${basePath}/lab-images/5.jpg")`,
  ["--img-news-title" as string]: `url("${basePath}/logos/vien-doi-moi-sang-tao-ueh-uii.jpg")`,
} as React.CSSProperties;

export const metadata: Metadata = {
  metadataBase: new URL("https://taitv-png.github.io"),
  icons: {
    icon: `${basePath}/tch-logo-lockup.png`,
  },
  title: "Tech-Convergence Hub",
  description: "Nơi công nghệ hội tụ tại Campus E, Đại học Kinh tế Thành phố Hồ Chí Minh.",
  openGraph: {
    title: "Tech-Convergence Hub | Nơi công nghệ hội tụ",
    description: `Khám phá hệ sinh thái ${labs.length} không gian công nghệ tại Campus E, UEH.`,
    images: ["/Tech-Convergence-Hub/og-preview.png"],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech-Convergence Hub | Nơi công nghệ hội tụ",
    description: `Khám phá hệ sinh thái ${labs.length} không gian công nghệ tại Campus E, UEH.`,
    images: ["/Tech-Convergence-Hub/og-preview.png"],
  },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body style={cssVars}>
        {children}
        <SiteMotion />
        <ScrollToTop />
      </body>
    </html>
  );
}
