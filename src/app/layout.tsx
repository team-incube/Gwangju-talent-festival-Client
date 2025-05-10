import type { Metadata } from "next";
import { ToastProvider } from "@/shared/lib/ToastProvider";
import "../shared/style/globals.css";
import Header from "@/shared/ui/Header";
import TanstackProviders from "@/shared/lib/TanstackProvider";

export const metadata: Metadata = {
  title: "광주학생탈렌트페스티벌",
  description:
    "光탈페(광주학생탈렌트페스티벌)은 광주학생의회가 중심이 되어 학생들이 재능을 펼치고 즐길 수 있도록 프로그램을 기획하고 진행하는 학생주도형 오디션 프로그램입니다.",
  openGraph: {
    title: "광주학생탈렌트페스티벌",
    description:
      "光탈페(광주학생탈렌트페스티벌)은 광주학생의회가 중심이 되어 학생들이 재능을 펼치고 즐길 수 있도록 프로그램을 기획하고 진행하는 학생주도형 오디션 프로그램입니다.",
    url: "https://www.광탈페.kr",
    siteName: "광주학생탈렌트페스티벌",
    images: ["https://www.광탈페.kr/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-['Pretendard-Regular'] antialiased">
        <Header />
        <TanstackProviders>
          <ToastProvider>{children}</ToastProvider>
        </TanstackProviders>
      </body>
    </html>
  );
}
