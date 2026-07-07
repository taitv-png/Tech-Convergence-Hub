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
  icons: {
    icon: `${basePath}/tch_logo.ico`,
  },
  title: "Tech-Convergence Hub",
  description: "Trang giới thiệu mô hình Tech-Convergence Hub của UEH",
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
