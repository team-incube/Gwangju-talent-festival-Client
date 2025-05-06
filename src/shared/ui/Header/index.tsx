"use client";

import { CloseIcon } from "@/shared/asset/svg/CloseIcon";
import { Logo } from "@/shared/asset/svg/Logo";
import { MobileMenuIcon } from "@/shared/asset/svg/MobileMenuIcon";
import { cn } from "@/shared/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuthPage = pathname.startsWith("/signin") || pathname.startsWith("/signup");
  if (isAuthPage) return null;

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

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

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
          <div className={cn("flex text-caption2r gap-16")}>
            <Link
              className={cn("border-gray-100 border border-solid rounded-lg px-12 py-8")}
              href="/signin"
            >
              로그인
            </Link>
            <Link
              className={cn("border-gray-100 border border-solid rounded-lg px-12 py-8")}
              href="/signup"
            >
              회원가입
            </Link>
            <div onClick={toggleMobileMenu} className={cn("place-self-center")}>
              {isMobileMenuOpen ? <CloseIcon /> : <MobileMenuIcon />}
            </div>
          </div>
        </div>
      </header>
      {/* 모바일 헤더 사이드바 */}
      {isMobileMenuOpen && (
        <div
          className={cn(
            "absolute top-74px right-0 w-full h-[calc(100vh-68px)]  mobile:block hidden z-10",
          )}
        >
          <div className={cn("flex h-full")}>
            <div
              className={cn("w-[calc(100vw-129px)] bg-black bg-opacity-40")}
              onClick={closeMobileMenu}
            ></div>
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
