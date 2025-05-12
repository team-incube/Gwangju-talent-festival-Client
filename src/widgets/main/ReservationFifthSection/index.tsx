import Image from "next/image";
import { useEffect, useState } from "react";

const TICKET_OPEN_DATE = new Date("2025-10-29T20:00:00");

const formatDateLeft = (timeLeft: number) => {
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));

  return `D-${days}`;
};

const ReservationFifthSection = () => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = TICKET_OPEN_DATE.getTime() - now.getTime();
      setTimeLeft(difference > 0 ? difference : 0);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="ReservationFifthSection"
      className="relative h-full max-h-[600px] bg-purple-100 overflow-hidden tablet:h-[800px] justify-items-center mobile:min-h-0"
    >
      <div className=" z-0">
        <div className="absolute left-[1%] top-0 h-full w-[26%]  mobile:w-[30%]">
          <Image src="/images/starline.png" alt="Star Line" fill />
        </div>
        <div className="absolute right-[4%] top-0 h-full w-[26%]  mobile:w-[30%]">
          <Image src="/images/trophyline.png" alt="Trophy Line" fill />
        </div>
        <div className="absolute left-0 top-[40%] translate-y-[-50%] w-[30%] aspect-square tablet:left-0 mobile:w-[40%] mobile:top-[60%] mobile:left-[-4%]">
          <Image src="/images/star.png" alt="Star" fill />
        </div>
        <div className="absolute right-[4%] top-[40%] translate-y-[-50%] w-[30%] aspect-square z-0 mobile:w-[40%] mobile:right-[-10%]">
          <Image src="/images/trophy.png" alt="Trophy" fill />
        </div>
      </div>
      <div className="relative w-full text-center  mt-[66px] mobile:mt-[1.7rem]">
        <p className="text-title1b mobile:text-body1b">예매</p>
        <p className="text-body2r text-gray-500 pt-[1.5rem] mobile:text-body3r mobile:pt-[1rem] mb-[24px] ">
          온∙오프라인 참여 홍보 및 신청 접수
        </p>

        <div className="flex flex-col gap-[40px] mb-[60px] bg-white rounded-[12px] py-[72px] px-[60px] text-center w-[376px] mobile:p-[24px] mobile:w-fit justify-self-center mobile:mb-[15px] mobile:gap-[24px]">
          <p className="text-body1b mobile:text-caption1b">티켓오픈안내</p>
          <p className="text-title1b text-main-600 mobile:text-body1b">
            {timeLeft > 0 ? formatDateLeft(timeLeft) : "D-Day"}
          </p>
          <div className="flex justify-center gap-4 text-[16px]">
            <span className="text-body2r mobile:text-caption2r">티켓오픈</span>
            <span className="text-body2r text-gray-500 mobile:text-caption2r">
              {TICKET_OPEN_DATE.toLocaleString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReservationFifthSection;
