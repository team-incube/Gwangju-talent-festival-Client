import Image from "next/image";
import ImageCarousel from "../ImageCarousel";

const ParticipationThirdSection = () => {
  return (
    <section
      id="ParticipationThirdSection"
      className="relative min-h-screen bg-purple-100 overflow-hidden tablet:h-[800px] justify-items-center mobile:min-h-0"
    >
      <div className="mobile:hidden z-0">
        <div className="absolute left-[1%] top-0 h-full w-[24%]  ">
          <Image src="/images/starline.png" alt="Star Line" fill />
        </div>
        <div className="absolute right-[4%] top-0 h-full w-[24%]  ">
          <Image src="/images/trophyline.png" alt="Trophy Line" fill />
        </div>
        <div className="absolute left-[-10%] top-[55%] translate-y-[-50%] w-[40%] aspect-square tablet:left-0">
          <Image src="/images/star.png" alt="Star" fill />
        </div>
        <div className="absolute right-[-7%] top-[30%] translate-y-[-50%] w-[40%] aspect-square z-0">
          <Image src="/images/trophy.png" alt="Trophy" fill />
        </div>
      </div>

      <div className="w-[70%] min-h-screen flex flex-col justify-center mobile:w-full gap-[60px] mobile:min-h-0 mobile:gap-[24px]">
        <div id="apply" className="relative w-full text-center  mt-[66px] mobile:mt-[1.7rem]">
          <p className="text-title1b mobile:text-body1b">참여 신청</p>
          <p className="text-body2r text-gray-500 pt-[1.5rem] mobile:text-body3r mobile:pt-[1rem] mb-[24px] ">
            온·오프라인 참여 홍보 및 신청 접수 →
            <span className="inline-block"> 1차 영상 심사 및 光트로(예선) 참가팀 선정 → </span>
            <span className="inline-block">光트로 참가팀 사전 협의 및 안내</span>
          </p>

          <button className="inline-flex items-center text-purple-600 font-bold text-base mobile:text-sm hover:underline group">
            신청하러가기
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2 w-5 h-5 text-purple-600 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <ImageCarousel />
      </div>
    </section>
  );
};

export default ParticipationThirdSection;
