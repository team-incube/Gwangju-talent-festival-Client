"use client";

import { cn } from "@/shared/utils/cn";
import { useEffect, useRef, useState } from "react";

const Video = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [remaining, setRemaining] = useState({ left: 0, total: 0 });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const update = () => {
      setRemaining({
        left: video.duration - video.currentTime,
        total: video.duration,
      });
    };

    video.addEventListener("loadedmetadata", update);
    video.addEventListener("timeupdate", update);

    return () => {
      video.removeEventListener("loadedmetadata", update);
      video.removeEventListener("timeupdate", update);
    };
  }, []);

  return (
    <div className="relative w-full h-full ">
      <video
        ref={videoRef}
        className={cn("w-full", "h-full", "object-cover")}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/video/promotion.webm" type="video/webm" />
        <source src="/video/promotion.mp4" type="video/mp4" />
      </video>
      <div className="absolute bottom-[12%] left-0 w-full px-4 mobile:bottom-[6%]">
        <div className="max-w-[1060px] mx-auto text-white text-sm  rounded flex flex-col gap-14 tablet:pl-20 mobile:pl-10 mobile:gap-0">
          <p className="font-bold text-title1b tablet:text-body1b mobile:text-caption1b">
            光탈페 (광주학생탈렌트페스티벌)
          </p>
          <p className="text-title4r tablet:text-body3r mobile:text-caption3r !leading-[130%]">
            <span className="inline-block">光탈페는 광주학생의회가 중심이 되어{"\u00A0"}</span>
            <span className="inline-block">학생들이 재능을 펼치고 즐길 수 있도록 기획된</span>
            <span className="block">학생주도형 오디션 프로그램입니다</span>
          </p>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 h-4 bg-main-600"
        style={{ width: `${((remaining.total - remaining.left) / remaining.total) * 100}%` }}
      ></div>
    </div>
  );
};

export default Video;
