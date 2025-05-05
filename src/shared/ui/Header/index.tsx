"use client";

import { CloseIcon } from "@/shared/asset/svg/CloseIcon";
import { Logo } from "@/shared/asset/svg/Logo";
import { MobileMenuIcon } from "@/shared/asset/svg/MobileMenuIcon";
import { cn } from "@/shared/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/signin") || pathname.startsWith("/signup");
  if (isAuthPage) return null;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prevState => !prevState);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const links = [
    { href: "/slogan", label: "슬로건 공모" },
    { href: "", label: "참여신청" },
    { href: "", label: "FaQ" },
    { href: "", label: "예선" },
    { href: "", label: "예매" },
    { href: "", label: "본선" },
  ];

  return (
    <>
      <header
        className={cn(
          "flex items-center py-[1rem] justify-around mobile:justify-between  mobile:px-16",
        )}
      >
        <Link href="/">
          <Logo className="h-[42px] w-[67px] mobile:h-[32px] mobile:w-[52px]" />
        </Link>
        <div className={cn("flex gap-[2.5rem] text-body3b mobile:hidden")}>
          {links.map((link, index) => (
            <Link key={index} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
        <div className={cn("hidden mobile:block")}>
          <div className={cn("flex text-body3b ")}>
            <Link
              className={cn("border-gray-100 border border-solid rounded-lg p-2")}
              href="/signin"
            >
              로그인
            </Link>
            <Link className={cn("border-gray-100 border border-solid rounded-lg")} href="/signup">
              회원가입
            </Link>
            <div onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <CloseIcon /> : <MobileMenuIcon />}
            </div>
          </div>
        </div>
      </header>
      {/* 모바일 헤더 사이드바 */}
      {isMobileMenuOpen && (
        <div
          className={cn(
            "absolute top-74px right-0 w-full h-[calc(100vh-74px)]  mobile:block hidden z-10",
          )}
        >
          <div className={cn("flex h-full")}>
            <div className="w-[calc(100vw-129px)] bg-black bg-opacity-40"></div>
            <div className={cn("w-[129px] bg-white")}>
              <div className={cn("flex flex-col gap-[2.5rem] text-body3b m-26")}>
                {links.map((link, index) => (
                  <Link key={index} href={link.href} onClick={closeMobileMenu}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
