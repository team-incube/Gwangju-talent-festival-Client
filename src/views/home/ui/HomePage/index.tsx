"use client";
import { useEffect, useState } from "react";
import SloganSecondSection from "@/widgets/main/SloganSecondSection";
import IntroFirstSection from "@/widgets/main/IntroFirstSection";
import ParticipationThirdSection from "@/widgets/main/ParticipationThirdSection";
import PreliminaryFourthSection from "@/widgets/main/PreliminaryFourthSection";
import ReservationFifthSection from "@/widgets/main/ReservationFifthSection";
import FinalsSixthSection from "@/widgets/main/FinalsSixthSection";
import { Footer } from "@/widgets/main/Footer";
import { isShow } from "@/shared/lib/show";
import ComingSoon from "@/shared/ui/ComingSoon";

const HomePage = () => {
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isShow("introduce") && !window.location.pathname.startsWith("/test")) {
      setShowComingSoon(true);
    }
  }, []);

  if (!mounted) return null;

  if (showComingSoon) return <ComingSoon />;

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
