"use client";

import { useEffect, useRef, useState } from "react";

// transform scale는 레이아웃 크기를 안 바꿔서 확대해도 스크롤이 안 생긴다. 셀 크기 자체를 키운다.
// 프로젝트 spacing 스케일이 px와 rem이 섞여 있어(w-6=6px, w-5=20px) 임의값으로 못 박는다
export const ZOOM_LEVELS = [
  "w-[10px] h-[10px] text-[6px]",
  "w-[12px] h-[12px] text-[7px]",
  "w-[14px] h-[14px] text-[8px]",
  "w-[16px] h-[16px] text-[9px]",
  "w-[20px] h-[20px] text-[11px]",
  "w-[24px] h-[24px] text-[13px]",
  "w-[28px] h-[28px] text-[15px]",
  "w-[32px] h-[32px] text-[17px]",
] as const;

const PINCH_IN_RATIO = 1.2;
const PINCH_OUT_RATIO = 0.8;

export const nextZoomIndex = (current: number, delta: number): number =>
  Math.min(ZOOM_LEVELS.length - 1, Math.max(0, current + delta));

const touchDistance = (touches: TouchList): number =>
  Math.hypot(
    touches[0].clientX - touches[1].clientX,
    touches[0].clientY - touches[1].clientY,
  );

export const useSeatMapZoom = (defaultIndex: number) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomIndex, setZoomIndex] = useState(defaultIndex);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const step = (delta: number) => setZoomIndex(current => nextZoomIndex(current, delta));

    // passive 리스너면 preventDefault가 무시돼 브라우저 페이지 줌이 같이 걸린다
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      step(event.deltaY < 0 ? 1 : -1);
    };

    let pinchBaseline = 0;

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 2) pinchBaseline = touchDistance(event.touches);
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length !== 2 || !pinchBaseline) return;
      event.preventDefault();

      const ratio = touchDistance(event.touches) / pinchBaseline;
      if (ratio > PINCH_IN_RATIO) {
        step(1);
        pinchBaseline = touchDistance(event.touches);
      } else if (ratio < PINCH_OUT_RATIO) {
        step(-1);
        pinchBaseline = touchDistance(event.touches);
      }
    };

    const handleTouchEnd = () => {
      pinchBaseline = 0;
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return { containerRef, cellSize: ZOOM_LEVELS[zoomIndex] };
};
