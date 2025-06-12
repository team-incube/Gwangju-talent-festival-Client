"use client";

import CheckBox from "@/shared/asset/svg/CheckBox";
import Checked from "@/shared/asset/svg/Checked";
import { RightArrow } from "@/shared/asset/svg/RightArrow";
import X from "@/shared/asset/svg/X";
import { Button } from "@/shared/ui";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PosterModal() {
  const [show, setShow] = useState<boolean | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("show")) {
      setShow(false);
    } else {
      setShow(true);
    }
  }, []);

  const handleClose = () => {
    if (isChecked) {
      localStorage.setItem("show", "false");
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-white p-24 rounded-[12px] flex flex-col gap-24 max-w-[500px] w-full shadow-xl relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-body2b">포스터</h3>
          <button onClick={handleClose}>
            <X />
          </button>
        </div>
        <Image width={485} height={708} src="/images/poster.png" alt="poster" />
        <div>
          <Button
            className="text-body3b gap-12 w-full flex items-center justify-center"
            onClick={() => router.push("/apply")}
          >
            참가신청하러가기
            <RightArrow width={16} height={16} color="white" />
          </Button>
          <div
            onClick={() => setIsChecked(!isChecked)}
            className="flex mt-8 items-center gap-2 cursor-pointer"
          >
            {isChecked ? <Checked /> : <CheckBox />}
            <span className="text-caption1r text-gray-500">다시 보지 않기</span>
          </div>
        </div>
      </div>
    </div>
  );
}
