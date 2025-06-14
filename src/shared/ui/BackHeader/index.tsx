"use client";

import { LeftArrow } from "@/shared/asset/svg/LeftArrow";
import { cn } from "@/shared/utils/cn";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import React from "react";

const BackHeader = ({ text }: { text: string }) => {
  const router = useRouter();
  
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);
  
  return (
    <div className={cn("flex gap-24 items-center my-28 mobile:my-12")}>
      <div className={cn("cursor-pointer")} onClick={handleBack}>
        <LeftArrow />
      </div>
      <h2 className={cn("text-body1b")}>{text}</h2>
    </div>
  );
};

export default React.memo(BackHeader);
