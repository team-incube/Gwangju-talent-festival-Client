"use client";
import { useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import { PrevNextButton } from "@/shared/asset/svg/PrevNextButton";

const ImageCarousel = () => {
  const [current, setCurrent] = useState(0);

  const slides = [
    "/images/ParticipationThirdSection/slide1.png",
    "/images/slide2.jpg",
    "/images/slide3.jpg",
    "/images/slide4.jpg",
  ];

  const prev = () => setCurrent(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  const next = () => setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1));

  return (
    <div className="flex flex-col items-center justify-center bg-purple-100 px-16">
      <div className="relative w-full aspect-[2/1] bg-black rounded-lg overflow-hidden">
        {current !== 0 && (
          <button className="absolute left-[4%] top-1/2 -translate-y-1/2 z-10" onClick={prev}>
            <PrevNextButton className="mobile:w-[32px] " />
          </button>
        )}

        <Image
          src={slides[current]}
          alt={`Slide ${current + 1}`}
          fill
          className="object-cover transition-all duration-500 rounded-lg"
        />

        {current !== slides.length - 1 && (
          <button className="absolute right-[4%] top-1/2 -translate-y-1/2 z-10" onClick={next}>
            <PrevNextButton className="mobile:w-[32px] rotate-180" />
          </button>
        )}
      </div>

      <div className="flex mt-[24px] mb-[44px]  gap-[40px] mobile:gap-[24px]">
        {slides.map((_, idx) => (
          <div
            key={idx}
            className={clsx(
              "w-16 h-16 rounded-full transition-colors mobile:w-8 mobile:h-8",
              current === idx ? "bg-purple-600" : "bg-gray-400",
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
