"use client";

import { LeftArrow } from "@/shared/asset/svg/LeftArrow";
import { cn } from "@/shared/utils/cn";
import { useRouter } from "next/navigation";

export default function SloganHeader() {
  const R = useRouter();
  return (
    <div className={cn("flex gap-24 items-center")}>
      <div className={cn("cursor-pointer")} onClick={() => R.back()}>
        <LeftArrow />
      </div>
      <h2 className={cn("text-body1b")}>슬로건 응모</h2>
    </div>
  );
}
