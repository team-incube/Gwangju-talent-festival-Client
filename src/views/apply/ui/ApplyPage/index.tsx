"use client";

import { DescriptionCard } from "@/entities/apply/ui/DescriptionCard";
import { DownloadButton } from "@/entities/apply/ui/DownloadButton";
import { GoogleLogo } from "@/shared/asset/svg/GoogleLogo";
import { NaverLogo } from "@/shared/asset/svg/NaverLogo";
import Inform from "@/shared/asset/svg/Inform";
import Button from "@/shared/ui/Button";
import Arrow from "@/shared/asset/svg/Arrow";
import BackHeader from "@/shared/ui/BackHeader";
import { colors } from "@/shared/utils/color";
import { FC, ReactNode } from "react";

type DocumentItem = string;
type MethodItem = string;

type ArrowColor = typeof colors.main[keyof typeof colors.main];

interface ArrowData {
  color: ArrowColor;
  text: string;
}

interface EmailLink {
  url: string;
  provider: "naver" | "google";
  label: string;
  bgColor: string;
  textColor: string;
}

const DOCUMENT_ITEMS: DocumentItem[] = [
  "신청 서류: 참가 신청서, 개인정보수집이용활용동의서, 공연 영상[3분 내외, MP4 파일]",
  "참가 신청서 작성 내용이 부정확하거나 누락 시 신청 대상에서 제외",
  "영상 재생 오류 및 링크 형태(유튜브, 드라이브 등)의 영상 제출 시 신청 대상에서 제외",
  "전체 영상이 3분 초과일 경우 3분 내외의 심사용 영상에 적합한 구간으로 편집하여 제출",
  "참가인(팀 전원)의 공연 모습(영상, 음향)이 정확하게 파악될 수 있는 영상",
  "참가신청서는 대표자 작성, 개인정보동의서는 팀원 전체 개별 작성 후 대표자가 통합 제출"
] as const;

const METHOD_ITEMS:  MethodItem[] = [
  "참가 신청서, 개인정보수집이용활용동의서,공연 영상 제출: 광주고등학생의회 (hcgwangju@gmail.com 이메일) 제출",
  "제출파일명: 분야 대표자_ 대표자학교 팀_연락처(예: 댄스 홍길동 한국중 빛나라 01012345678)"
] as const;

const ARROWS_DATA: readonly ArrowData[] = [
  { color: colors.main[100], text: "참가 신청서 n작성" },
  { color: colors.main[200], text: "개인정보수집이용 n활용동의서 작성" },
  { color: colors.main[300], text: "공연영상제작 n3분 내외, MP4 파일" },
  { color: colors.main[400], text: "이메일 제출" }
] as const;

const EMAIL_LINKS: readonly EmailLink[] = [
  {
    provider: "naver",
    url: "https://mail.naver.com/write/popup?to=hcgwangju@gmail.com&subject=2025 광주학생탈렌트페스티벌 참가 신청",
    label: "네이버메일 전송 바로가기",
    bgColor: "#01C13A",
    textColor: colors.white
  },
  {
    provider: "google",
    url: "https://mail.google.com/mail/?view=cm&fs=1&to=hcgwangju@gmail.com&su=2025 광주학생탈렌트페스티벌 참가 신청",
    label: "구글메일 전송 바로가기",
    bgColor: colors.white,
    textColor: colors.black
  }
] as const;

export const ApplyPage: FC = () => {
  const renderMethodItem = (item: MethodItem, index: number): ReactNode => {
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

  const openEmailLink = (url: string): void => {
    window.open(url, "_blank");
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center py-12 px-4">
      <div className="max-w-3xl w-full flex flex-col gap-10">
        <BackHeader text="참가 신청" />
        <DescriptionCard 
          title="신청 서류: 참가 신청서, 개인정보수집이용활용동의서, 공연 영상[3분 내외, MP4 파일]" 
          items={DOCUMENT_ITEMS} 
        />
        <DescriptionCard 
          title="신청 방법" 
          items={METHOD_ITEMS}
          renderCustomItem={renderMethodItem}
        />

        <div className="flex items-center gap-2 ml-2 py-10">
          <Inform color={colors.gray[500]} />
          <p className="text-gray-500">제출 기간: 2025. 6. 16.(월) ~ 6. 20.(금) 18:00까지 접수분에 한함</p>
        </div>

        <div className="flex gap-20 mt-4 justify-start pb-28 mobile:flex-col">
          <DownloadButton filePath="/files/2025 광탈페 참가 신청서(서식)_v1.hwp" label="참가 신청서" />
          <DownloadButton filePath="/files/2025 광탈페 참가신청 개인정보제공활용 동의서_v1.pdf" label="개인정보 제공, 활용 동의서" />
        </div>

        <div className="hidden md:flex flex-row py-28 justify-center gap-4">
          {ARROWS_DATA.map((arrow, index) => (
            <Arrow 
              key={`desktop-arrow-${index}`}
              color={arrow.color} 
              text={arrow.text} 
            />
          ))}
        </div>
        
        <div className="flex md:hidden flex-col py-28 items-center gap-8">
          <div className="flex flex-row gap-4">
            <Arrow 
              color={ARROWS_DATA[0].color} 
              text={ARROWS_DATA[0].text} 
            />
            <Arrow 
              color={ARROWS_DATA[1].color} 
              text={ARROWS_DATA[1].text} 
            />
          </div>
          <div className="flex flex-row gap-4">
            <Arrow 
              color={ARROWS_DATA[2].color} 
              text={ARROWS_DATA[2].text} 
            />
            <Arrow 
              color={ARROWS_DATA[3].color} 
              text={ARROWS_DATA[3].text} 
            />
          </div>
        </div>

        <div className="flex flex-row gap-4 pt-28 mobile:flex-col">
          {EMAIL_LINKS.map((link) => (
            <Button 
              key={`email-link-${link.provider}`}
              className={`w-full bg-[${link.bgColor}] ${link.provider === 'google' ? 'border border-gray-100' : ''} text-[${link.textColor}] flex flex-row gap-18 items-center justify-center`}
              onClick={() => openEmailLink(link.url)}
            >
              {link.provider === 'naver' ? <NaverLogo color={colors.white} /> : <GoogleLogo />}
              {link.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};