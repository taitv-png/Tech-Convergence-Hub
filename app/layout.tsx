import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  icons: "/tch_logo.ico",
  title: "Tech-Convergence Hub",
  description: "Trang giới thiệu mô hình Tech-Convergence Hub của UEH",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body className={icielGotham.variable}>{children}</body>
    </html>
  );
}
