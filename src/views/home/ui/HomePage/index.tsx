"use client";

import SloganSecondSection from "@/widgets/main/SloganSecondSection";
import IntroFirstSection from "@/widgets/main/IntroFirstSection";
import ParticipationThirdSection from "@/widgets/main/ParticipationThirdSection";
import PreliminaryFourthSection from "@/widgets/main/PreliminaryFourthSection";
import ReservationFifthSection from "@/widgets/main/ReservationFifthSection";
import FinalsSixthSection from "@/widgets/main/FinalsSixthSection";

const SECTIONS = [
  { id: "intro", Component: IntroFirstSection },
  { id: "slogan", Component: SloganSecondSection },
  { id: "participation", Component: ParticipationThirdSection },
  { id: "preliminary", Component: PreliminaryFourthSection },
  { id: "reservation", Component: ReservationFifthSection },
  { id: "finals", Component: FinalsSixthSection },
];

const HomePage = () => {
  return (
    <>
      {SECTIONS.map(({ id, Component }) => (
        <Component key={id} />
      ))}
    </>
  );
};

export default HomePage;
