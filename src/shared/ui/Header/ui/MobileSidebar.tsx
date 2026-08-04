"use client";

import { useEffect } from "react";
import { links } from "@/shared/const/headerValues";
import { cn } from "@/shared/utils/cn";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLinkClick: (section: string) => void;
}

export const MobileSidebar = ({ isOpen, onClose, onLinkClick }: MobileSidebarProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-20 hidden mobile:block",
        "top-[var(--header-height,4.625rem)]",
      )}
      aria-hidden={!isOpen}
    >
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-black/40 transition-opacity duration-200",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <div
        id="mobile-nav-panel"
        role="dialog"
        aria-modal="true"
        aria-label="모바일 메뉴"
        className={cn(
          "absolute right-0 top-0 h-full w-[129px] bg-white",
          "transition-transform duration-200 ease-out",
          isOpen ? "translate-x-0" : "pointer-events-none translate-x-full",
        )}
      >
        <nav className={cn("flex flex-col gap-[2.5rem] text-body3b m-26")}>
          {links.map(link => (
            <button key={link.section} type="button" onClick={() => onLinkClick(link.section)}>
              {link.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};
