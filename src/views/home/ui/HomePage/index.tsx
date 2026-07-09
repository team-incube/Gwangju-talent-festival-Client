"use client";

import dynamic from "next/dynamic";
import IntroFirstSection from "@/widgets/main/IntroFirstSection";
import SloganSecondSection from "@/widgets/main/SloganSecondSection";
import JudgingCtaSection from "@/widgets/main/JudgingCtaSection";

import LazySection from "@/shared/ui/LazySection";
import SloganPosterPopup from "@/widgets/main/SloganPosterPopup";

const PreliminaryResultSection = dynamic(
  () => import("@/widgets/main/PreliminaryResultSection"),
  { loading: () => <SectionPlaceholder height="400px" />, ssr: false },
);

const PreliminaryFourthSection = dynamic(() => import("@/widgets/main/PreliminaryFourthSection"), {
  loading: () => <SectionPlaceholder />,
  ssr: false,
});

// const ReservationFifthSection = dynamic(() => import("@/widgets/main/ReservationFifthSection"), {
//   loading: () => <SectionPlaceholder />,
//   ssr: false,
// });

const FinalsSixthSection = dynamic(() => import("@/widgets/main/FinalsSixthSection"), {
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
  return (
    <>
      <SloganPosterPopup />
      <IntroFirstSection />
      <SloganSecondSection />

      <LazySection
        id="PreliminaryResultSection"
        fallback={<SectionPlaceholder height="400px" />}
        rootMargin="200px"
      >
        <PreliminaryResultSection />
      </LazySection>

      <LazySection
        id="PreliminaryFourthSection"
        fallback={<SectionPlaceholder height="600px" />}
        rootMargin="200px"
      >
        <PreliminaryFourthSection />
      </LazySection>

      <LazySection fallback={<SectionPlaceholder height="500px" />} rootMargin="300px">
        <FinalsSixthSection />
      </LazySection>

      {/* <LazySection fallback={<SectionPlaceholder height="500px" />} rootMargin="300px">
        <ReservationFifthSection />
      </LazySection> */}

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
