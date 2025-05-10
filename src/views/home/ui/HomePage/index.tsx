"use client";
import { cn } from "@/shared/utils/cn";
import SloganSecondSection from "@/widgets/main/SloganSecondSection";
import IntroFirstSection from "@/widgets/main/IntroFirstSection";
import ParticipationThirdSection from "@/widgets/main/ParticipationThirdSection";
import PreliminaryFourthSection from "@/widgets/main/PreliminaryFourthSection";
import ReservationFifthSection from "@/widgets/main/ReservationFifthSection";
import FinalsSixthSection from "@/widgets/main/FinalsSixthSection";
import { Footer } from "@/widgets/main/Footer";

const HomePage = () => {
  return (
    <>
      <IntroFirstSection />
      <SloganSecondSection />
      <ParticipationThirdSection />
      <PreliminaryFourthSection />
      <ReservationFifthSection />
      <FinalsSixthSection />
      <Footer />
    </>
  );
};

export default HomePage;
