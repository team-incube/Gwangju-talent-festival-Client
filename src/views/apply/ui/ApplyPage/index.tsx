"use client";

import { DescriptionCard } from "@/entities/apply/ui/DescriptionCard";
import { DownloadButton } from "@/entities/apply/ui/DownloadButton";
import { GoogleLogo } from "@/shared/asset/svg/GoogleLogo";
import { NaverLogo } from "@/shared/asset/svg/NaverLogo";
import Inform from "@/shared/asset/svg/Inform";
import Button from "@/shared/ui/Button";
import Arrow from "@/shared/asset/svg/Arrow";

export const ApplyPage = () => {
  const documentItems = [
    "신청 서류: 참가 신청서, 개인정보수집이용활용동의서, 공연 영상[3분 내외, MP4 파일]",
    "참가 신청서 작성 내용이 부정확하거나 누락 시 신청 대상에서 제외",
    "영상 재생 오류 및 링크 형태(유튜브, 드라이브 등)의 영상 제출 시 신청 대상에서 제외",
    "전체 영상이 3분 초과일 경우 3분 내외의 심사용 영상에 적합한 구간으로 편집하여 제출",
    "참가인(팀 전원)의 공연 모습(영상, 음향)이 정확하게 파악될 수 있는 영상",
    "참가신청서는 대표자 작성, 개인정보동의서는 팀원 전체 개별 작성 후 대표자가 통합 제출"
  ];

  const methodItems = [
    "참가 신청서, 개인정보수집이용활용동의서,공연 영상 제출: 광주고등학생의회 (hcgwangju@gmail.com 이메일) 제출",
    "제출파일명: 분야 대표자_ 대표자학교 팀_연락처(예: 댄스 홍길동 한국중 빛나라 01012345678)"
  ];

  const renderMethodItem = (item: string, index: number) => {
    if (index === 0) {
      const [mainText, emailText] = item.split("(");
      return (
        <>
          {mainText}
          <span className="block ml-5">({emailText}</span>
        </>
      );
    }
    return item;
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center py-12 px-4">
      <div className="max-w-3xl w-full flex flex-col gap-10">
        <DescriptionCard 
          title="신청 서류: 참가 신청서, 개인정보수집이용활용동의서, 공연 영상[3분 내외, MP4 파일]" 
          items={documentItems} 
        />
        <DescriptionCard 
          title="신청 방법" 
          items={methodItems}
          renderCustomItem={renderMethodItem}
        />

        <div className="flex items-center gap-2 ml-2 py-10">
          <Inform color="#909090" />
          <p className="text-gray-500">제출 기간: 2025. 6. 16.(월) ~ 6. 20.(금) 18:00까지 접수분에 한함</p>
        </div>

        <div className="flex gap-20 mt-4 justify-start pb-28 mobile:flex-col">
          <DownloadButton filePath="/files/2025 광탈페 참가 신청서(서식)_v1.hwp" label="참가 신청서" />
          <DownloadButton filePath="/files/2025 광탈페 참가신청 개인정보제공활용 동의서_v1.pdf" label="개인정보 제공, 활용 동의서" />
        </div>

        <div className="hidden md:flex flex-row py-28 justify-center gap-4">
          <Arrow 
            color="#F1E0F7" 
            text="참가 신청서 n작성" 
          />
          <Arrow 
            color="#E3C0EE" 
            text="개인정보수집이용 n활용동의서 작성" 
          />
          <Arrow 
            color="#D6A1E6" 
            text="공연영상제작 n3분 내외, MP4 파일" 
          />
          <Arrow 
            color="#C881DE" 
            text="이메일 제출"
          />
        </div>
        
        <div className="flex md:hidden flex-col py-28 items-center gap-8">
          <div className="flex flex-row gap-4">
            <Arrow 
              color="#F1E0F7" 
              text="참가 신청서 n작성" 
            />
            <Arrow 
              color="#E3C0EE" 
              text="개인정보수집이용 n활용동의서 작성" 
            />
          </div>
          <div className="flex flex-row gap-4">
            <Arrow 
              color="#D6A1E6" 
              text="공연영상제작 n3분 내외, MP4 파일" 
            />
            <Arrow 
              color="#C881DE" 
              text="이메일 제출"
            />
          </div>
        </div>

        <div className="flex flex-row gap-4 pt-28 mobile:flex-col">
          <Button className="w-full bg-[#01C13A] flex flex-row gap-18 items-center justify-center ">
            <NaverLogo color="#FFF" />
            네이버메일 전송 바로가기
          </Button>
          <Button className="w-full bg-[#FFF] border border-gray-100 text-[#000] flex flex-row gap-18 items-center justify-center">
            <GoogleLogo />
            구글메일 전송 바로가기
          </Button>
        </div>
      </div>
    </div>
  );
};