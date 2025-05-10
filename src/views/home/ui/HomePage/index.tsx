"use client";
import { cn } from "@/shared/utils/cn";
import SloganSecondSection from "@/widgets/main/\bSloganSecondSection";
import IntroFirstSection from "@/widgets/main/IntroFirstSection";

const HomePage = () => {
  return (
    <>
      <IntroFirstSection />
      <SloganSecondSection />
      <div id="section2" className="w-full h-[1080px] bg-pink-200">
        침여 신청
      </div>
      <div id="section3" className="w-full h-[1080px] bg-pink-300">
        예선
      </div>
      <div id="section4" className="w-full h-[1080px] bg-pink-400">
        예매
      </div>
      <div id="section5" className="w-full h-[1080px] bg-pink-500">
        본선
      </div>
    </>
  );
};

export default HomePage;
