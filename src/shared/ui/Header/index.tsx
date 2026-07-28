"use client";

import { Logo } from "@/shared/asset/svg/Logo";
import { MobileMenuIcon } from "@/shared/asset/svg/MobileMenuIcon";
import { CloseIcon } from "@/shared/asset/svg/CloseIcon";
import { isHiddenPath, links } from "@/shared/const/headerValues";
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
        {!isJudge && (
          <div className={cn("flex gap-[2.5rem] text-body3b mobile:hidden")}>
            {links.map((link, index) => (
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
              <div onClick={toggleMobileMenu} className={cn("place-self-center")}>
                {isMobileMenuOpen ? <CloseIcon /> : <MobileMenuIcon />}
              </div>
            )}
          </div>
        </div>
      </header>
      {!isJudge && isMobileMenuOpen && pathname.startsWith("/home") && (
        <MobileSidebar onClose={closeMobileMenu} onLinkClick={handleScrollToSection} />
      )}
    </>
  );
}
