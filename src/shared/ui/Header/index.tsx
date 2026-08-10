"use client";

import { Logo } from "@/shared/asset/svg/Logo";
import { MobileMenuIcon } from "@/shared/asset/svg/MobileMenuIcon";
import { CloseIcon } from "@/shared/asset/svg/CloseIcon";
import { bookingLink, isHiddenPath, links } from "@/shared/const/headerValues";
import { isTicketOpen } from "@/shared/config/dateConfig";
import { cn } from "@/shared/utils/cn";
import { getTokenFromCookie } from "@/shared/utils/auth";
import { scrollToElement } from "@/shared/utils/scroll";
import { handleLogout } from "@/widgets/signin/lib/handleLogout";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuthSync } from "@/shared/hooks/useAuthSync";
import { useMobileMenu } from "@/shared/hooks/useMobileMenu";
import { MobileSidebar } from "./ui/MobileSidebar";
import { ProfileIcon } from "@/shared/asset/svg/ProfileIcon";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const { isUserLoggedIn } = useAuthSync();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useMobileMenu();

  useEffect(() => {
    setMounted(true);
    setUserRole(getTokenFromCookie("role"));
  }, []);

  const isJudge = userRole === "JUDGE";
  // 스크롤 대상인 홈 CTA가 PERFORMER에게만 예매 버튼을 띄우므로 헤더도 동일 조건으로 맞춘다
  const showBooking = mounted && userRole === "PERFORMER" && isTicketOpen(userRole);
  const navLinks = showBooking ? [...links, bookingLink] : links;

  const handleClick = useCallback(() => {
    if (isUserLoggedIn) {
      handleLogout();
    } else {
      router.push("/signin");
    }
  }, [router, isUserLoggedIn]);

  const handleScrollToSection = (section: string) => {
    scrollToElement(section);
    closeMobileMenu();
  };

  if (isHiddenPath(pathname)) return null;

  return (
    <>
      <header
        className={cn(
          "font-sans flex items-center justify-around mobile:justify-between mobile:px-16",
        )}
        style={{ height: "var(--header-height, 4.625rem)" }}
      >
        <Link href="/">
          <Logo className="h-[42px] w-[67px] mobile:h-[32px] mobile:w-[52px]" color="#FF9644" />
        </Link>
        {!isJudge && pathname.startsWith("/home") && (
          <div className={cn("flex gap-[2.5rem] text-body3b mobile:hidden")}>
            {navLinks.map((link, index) => (
              <button key={index} onClick={() => handleScrollToSection(link.section)}>
                {link.label}
              </button>
            ))}
          </div>
        )}

        <div
          className={cn(
            "border-orange-500 cursor-pointer text-center hidden sm:block border border-solid rounded-lg px-16 py-12",
          )}
          onClick={handleClick}
        >
          <div className="flex items-center text-orange-500 gap-12 justify-center">
            <ProfileIcon width={18} height={18} color="#FF9644" />
            <span className="text-body3b">{mounted && isUserLoggedIn ? "로그아웃" : "로그인"}</span>
          </div>
        </div>

        <div className={cn("hidden mobile:block ")}>
          <div className={cn("flex text-caption2r gap-16")}>
            <div
              className={cn(
                "cursor-pointer border border-solid border-orange-500 rounded-lg px-12 py-8 text-center text-orange-500",
              )}
              onClick={handleClick}
            >
              <div className="flex items-center gap-2 justify-center">
                <span>{mounted && isUserLoggedIn ? "로그아웃" : "로그인"}</span>
              </div>
            </div>

            {!isJudge && pathname.startsWith("/home") && (
              <button
                type="button"
                onClick={toggleMobileMenu}
                aria-label={isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-nav-panel"
                className={cn("place-self-center cursor-pointer")}
              >
                {isMobileMenuOpen ? <CloseIcon /> : <MobileMenuIcon />}
              </button>
            )}
          </div>
        </div>
      </header>
      {!isJudge && pathname.startsWith("/home") && (
        <MobileSidebar
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
          onLinkClick={handleScrollToSection}
          links={navLinks}
        />
      )}
    </>
  );
}
