"use client";
import { useEffect, useState } from "react";
import SloganSecondSection from "@/widgets/main/SloganSecondSection";
import IntroFirstSection from "@/widgets/main/IntroFirstSection";
import ParticipationThirdSection from "@/widgets/main/ParticipationThirdSection";
import PreliminaryFourthSection from "@/widgets/main/PreliminaryFourthSection";
import ReservationFifthSection from "@/widgets/main/ReservationFifthSection";
import FinalsSixthSection from "@/widgets/main/FinalsSixthSection";
import { isShow } from "@/shared/lib/show";
import ComingSoon from "@/shared/ui/ComingSoon";

const SECTIONS = [
  { id: "intro", Component: IntroFirstSection },
  { id: "slogan", Component: SloganSecondSection },
  { id: "participation", Component: ParticipationThirdSection },
  { id: "preliminary", Component: PreliminaryFourthSection },
  { id: "reservation", Component: ReservationFifthSection },
  { id: "finals", Component: FinalsSixthSection },
];

interface ShowStatus {
  isComingSoon: boolean;
  isMounted: boolean;
}

const HomePage = () => {
  const [showStatus, setShowStatus] = useState<ShowStatus>({
    isComingSoon: false,
    isMounted: false,
  });

  useEffect(() => {
    const shouldShowComingSoon =
      isShow("introduce") && !window.location.pathname.startsWith("/test");

    setShowStatus({
      isComingSoon: shouldShowComingSoon,
      isMounted: true,
    });
  }, []);

  if (!showStatus.isMounted) return null;

  if (showStatus.isComingSoon) return <ComingSoon />;

  return (
    <>
      {SECTIONS.map(({ id, Component }) => (
        <Component key={id} />
      ))}
    </>
  );
};

export default HomePage;
