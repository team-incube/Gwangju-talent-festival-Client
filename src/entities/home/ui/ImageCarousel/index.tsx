"use client";

import { useState, useCallback, useMemo, memo, useEffect, useRef } from "react";
import { PrevNextButton } from "@/shared/asset/svg/PrevNextButton";
import { SlideCounter } from "./ui/SlideCounter";
import { SlideDots } from "./ui/SlideDots";
import { cn } from "@/shared/utils/cn";
import { CarouselImage } from "./ui/CarouselImage";

type ImageCarouselProps = Readonly<{
  wide?: boolean;
  slides: ReadonlyArray<string>;
  className?: string;
}>;

const ASPECT_RATIO = {
  wide: "aspect-[16/9]",
  normal: "aspect-[2/1]",
};

const ImageCarousel = ({ wide = false, slides, className }: ImageCarouselProps) => {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const aspectRatio = useMemo(() => (wide ? ASPECT_RATIO.wide : ASPECT_RATIO.normal), [wide]);

  const transformStyle = useMemo(
    () => ({ transform: `translateX(-${current * 100}%)` }),
    [current],
  );

  const carouselImages = useMemo(
    () =>
      slides.map((src, idx) => (
        <CarouselImage key={`slide-${idx}`} src={src} idx={idx} aspectRatio={aspectRatio} />
      )),
    [slides, aspectRatio],
  );

  const goToSlide = useCallback((index: number) => {
    setCurrent(index);
    resetInterval();
  }, []);

  const prev = useCallback(() => {
    setCurrent(prev => {
      const newIndex = prev === 0 ? slides.length - 1 : prev - 1;
      resetInterval();
      return newIndex;
    });
  }, [slides.length]);

  const next = useCallback(() => {
    setCurrent(prev => {
      const newIndex = prev === slides.length - 1 ? 0 : prev + 1;
      resetInterval();
      return newIndex;
    });
  }, [slides.length]);

  const resetInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 2000);
  }, [slides.length]);

  useEffect(() => {
    resetInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [resetInterval]);

  return (
    <div className={cn("flex flex-col items-center justify-center mobile:px-16", className)}>
      <div className={cn("relative w-full bg-black rounded-lg overflow-hidden", aspectRatio)}>
        {current !== 0 && (
          <button className={cn("absolute left-[4%] top-1/2 -translate-y-1/2 z-10")} onClick={prev}>
            <PrevNextButton className={cn("mobile:w-[32px]")} />
          </button>
        )}

        <div
          className={cn("absolute inset-0 flex transition-transform duration-500", aspectRatio)}
          style={transformStyle}
        >
          {carouselImages}
        </div>

        {current !== slides.length - 1 && (
          <button
            className={cn("absolute right-[4%] top-1/2 -translate-y-1/2 z-10")}
            onClick={next}
          >
            <PrevNextButton className={cn("mobile:w-[32px] rotate-180")} />
          </button>
        )}
      </div>
      {wide ? (
        <SlideCounter current={current} total={slides.length} />
      ) : (
        <SlideDots current={current} total={slides.length} />
      )}
    </div>
  );
};

export default memo(ImageCarousel);
