import type { Metadata } from "next";
import { ToastProvider } from "@/shared/lib/ToastProvider";
import "../shared/style/globals.css";

export const metadata: Metadata = {
  title: "광주탈렌트페스티벌",
  description: "광주탈렌트페스티벌",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-['Pretendard-Regular'] antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
