"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import IntroFirstSection from "@/widgets/main/IntroFirstSection";
import SloganSecondSection from "@/widgets/main/SloganSecondSection";
import JudgingCtaSection from "@/widgets/main/JudgingCtaSection";
import JudgeInfoSection from "@/widgets/main/JudgeInfoSection";

import LazySection from "@/shared/ui/LazySection";
import { getTokenFromCookie } from "@/shared/utils/auth";

const PreliminaryLiveSection = dynamic(() => import("@/widgets/main/PreliminaryLiveSection"), {
  loading: () => <SectionPlaceholder />,
  ssr: false,
});

const FinalsVenueSection = dynamic(() => import("@/widgets/main/FinalsVenueSection"), {
  loading: () => <SectionPlaceholder />,
  ssr: false,
});

const SeventhSection = dynamic(() => import("@/widgets/main/SevenSection"), {
  loading: () => <SectionPlaceholder />,
  ssr: false,
});

const Footer = dynamic(() => import("@/entities/home/ui/Footer"), {
  loading: () => <SectionPlaceholder />,
  ssr: false,
});

const SectionPlaceholder = ({ height = "400px" }: { height?: string }) => (
  <div
    className="w-full bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center"
    style={{ height }}
  >
    <div className="text-center text-gray-400">
      <div className="w-16 h-16 border-2 border-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
        <div className="w-8 h-8 border-t-2 border-gray-400 rounded-full animate-pulse" />
      </div>
    </div>
  </div>
);

const HomePage = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setUserRole(getTokenFromCookie("role"));
  }, []);

  if (userRole === "JUDGE") {
    return <JudgeInfoSection />;
  }

  return (
    <>
      {/* <SloganPosterPopup /> */}
      <IntroFirstSection />
      <JudgeInfoSection />
      <SloganSecondSection />

      <LazySection
        id="PreliminaryLiveSection"
        fallback={<SectionPlaceholder height="600px" />}
        rootMargin="200px"
      >
        <PreliminaryLiveSection />
      </LazySection>

      <LazySection
        id="FinalsVenueSection"
        fallback={<SectionPlaceholder height="600px" />}
        rootMargin="200px"
      >
        <FinalsVenueSection />
      </LazySection>

      <LazySection fallback={<SectionPlaceholder height="500px" />} rootMargin="300px">
        <SeventhSection />
      </LazySection>

      <JudgingCtaSection />

      <LazySection fallback={<SectionPlaceholder height="500px" />} rootMargin="500px">
        <Footer />
      </LazySection>
    </>
  );
};

export default HomePage;
