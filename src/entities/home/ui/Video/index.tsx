"use client";

import { cn } from "@/shared/utils/cn";
import { useEffect, useRef, useState } from "react";

const sources = [
  { webm: "/video/video1.webm", mp4: "/video/video1.mp4" },
  { webm: "/video/video2.webm", mp4: "/video/video2.mp4" },
];

const Video = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [durations, setDurations] = useState<number[]>([]);
  const [index, setIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const loadDurations = async () => {
      const tempDurations: number[] = [];

      for (const src of sources) {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.src = src.mp4;

        await new Promise<void>(resolve => {
          video.addEventListener("loadedmetadata", () => {
            const duration = isNaN(video.duration) ? 0 : video.duration;
            tempDurations.push(duration);
            resolve();
          });
        });
      }

      setDurations(tempDurations);
    };

    loadDurations();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || durations.length === 0) return;

    const handleTimeUpdate = () => {
      const past = durations.slice(0, index).reduce((a, b) => a + b, 0);
      setCurrentTime(past + video.currentTime);
    };

    const handleEnded = () => {
      const next = index + 1;
      if (next < sources.length) {
        setIndex(next);
      } else {
        setIndex(0);
        setCurrentTime(0);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [index, durations]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.load();
    video.play().catch(err => {
      console.warn("Autoplay blocked:", err);
    });
  }, [index]);

  const totalDuration = durations.reduce((a, b) => a + b, 0);
  const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div className={cn("relative", "w-full", "h-full", "select-none")}>
      <video
        ref={videoRef}
        className={cn("w-full", "h-full", "object-cover")}
        autoPlay
        muted
        playsInline
        preload="auto"
      >
        <source src={sources[index].webm} type="video/webm" />
        <source src={sources[index].mp4} type="video/mp4" />
      </video>

      <div
        className={cn(
          "absolute",
          "inset-0",
          "select-none",
          "bg-gradient-to-t",
          "from-black/100",
          "via-transparent",
          "to-transparent",
          "[background-position:0_30%]",
        )}
      />

      <div
        className={cn(
          "absolute",
          "bottom-[12%]",
          "left-0",
          "w-full",
          "px-4",
          "mobile:bottom-[6%]",
          "select-none",
        )}
      >
        <div
          className={cn(
            "max-w-[1060px]",
            "mx-auto",
            "text-white",
            "text-sm",
            "rounded",
            "flex",
            "flex-col",
            "gap-14",
            "tablet:pl-20",
            "mobile:pl-10",
            "mobile:gap-0",
            "select-none",
          )}
        >
          <p
            className={cn(
              "font-bold",
              "text-title1b",
              "tablet:text-body1b",
              "mobile:text-caption1b",
              "select-none",
            )}
          >
            光탈페 (광주학생탈렌트페스티벌)
          </p>
          <p
            className={cn(
              "text-title4r",
              "tablet:text-body3r",
              "mobile:text-caption3r",
              "!leading-[130%]",
            )}
          >
            <span className={cn("inline-block")}>
              光탈페는 광주학생의회가 중심이 되어{"\u00A0"}
            </span>
            <span className={cn("inline-block")}>학생들이 재능을 펼치고 즐길 수 있도록 기획된</span>
            <span className={cn("block")}>학생주도형 오디션 프로그램입니다</span>
          </p>
        </div>
      </div>

      <div
        className={cn("absolute", "bottom-0", "left-0", "h-4", "bg-main-600")}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default Video;
