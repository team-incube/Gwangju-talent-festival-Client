import type { Metadata } from "next";
import { ToastProvider } from "@/shared/lib/ToastProvider";
import "../shared/style/globals.css";
import Header from "@/shared/ui/Header";
import TanstackProviders from "@/shared/lib/TanstackProvider";

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
        <Header />
        <TanstackProviders>
          <ToastProvider>{children}</ToastProvider>
        </TanstackProviders>
      </body>
    </html>
  );
}
