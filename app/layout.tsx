import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ScrollToTop } from "@/components/ScrollToTop";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const cssVars = {
  ["--img-labs-title" as string]: `url("${basePath}/lab-images/5.jpg")`,
  ["--img-news-title" as string]: `url("${basePath}/logos/vien-doi-moi-sang-tao-ueh-uii.jpg")`,
} as React.CSSProperties;

const icielGotham = localFont({
  variable: "--font-body",
  display: "swap",
  src: [
    {
      path: "../public/fonts/Gotham-Thin.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/icielgothammediumregular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/icielgothamultraregular.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/iCielGothamBold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://taitv-png.github.io"),
  icons: {
    icon: `${basePath}/tch-logo-lockup.png`,
  },
  title: "Tech-Convergence Hub",
  description: "Nơi công nghệ hội tụ tại Campus E, Đại học Kinh tế Thành phố Hồ Chí Minh.",
  openGraph: {
    title: "Tech-Convergence Hub | Nơi công nghệ hội tụ",
    description: "Khám phá hệ sinh thái 36 không gian công nghệ tại Campus E, UEH.",
    images: ["/Tech-Convergence-Hub/og-preview.png"],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech-Convergence Hub | Nơi công nghệ hội tụ",
    description: "Khám phá hệ sinh thái 36 không gian công nghệ tại Campus E, UEH.",
    images: ["/Tech-Convergence-Hub/og-preview.png"],
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body className={icielGotham.variable} style={cssVars}>
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
