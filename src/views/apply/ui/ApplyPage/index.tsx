"use client";

import { DescriptionCard } from "@/entities/apply/ui/DescriptionCard";
import { DownloadButton } from "@/entities/apply/ui/DownloadButton";
import Inform from "@/shared/asset/svg/Inform";
import BackHeader from "@/shared/ui/BackHeader";
import { colors } from "@/shared/utils/color";
import { FC, ReactNode } from "react";
import ArrowSteps from "@/widgets/apply/ui/ArrowSteps";
import EmailButtons from "@/widgets/apply/ui/EmailButtons";

type DocumentItem = string;
type MethodItem = string;
type InformItem = string;

const DOCUMENT_ITEMS: DocumentItem[] = [
  "신청 서류: 참가 신청서, 개인정보수집이용활용동의서, 공연 영상[3분 내외, MP4 파일]",
  "참가 신청서 작성 내용이 부정확하거나 누락 시 신청 대상에서 제외",
  "영상 재생 오류 및 링크 형태(유튜브, 드라이브 등)의 영상 제출 시 신청 대상에서 제외",
  "전체 영상이 3분 초과일 경우 3분 내외의 심사용 영상에 적합한 구간으로 편집하여 제출",
  "참가인(팀 전원)의 공연 모습(영상, 음향)이 정확하게 파악될 수 있는 영상",
  "참가신청서는 대표자 작성, 개인정보동의서는 팀원 전체 개별 작성 후 대표자가 통합 제출",
] as const;

const INFORM_ITEMS: InformItem[] = [
  "참가팀원(전원)은 1인 1팀으로만 신청 가능하며, 중복 참여는 불가",
  "참가팀원(전원)은 광주 관내 거주자(주민등록)이거나 광주소재 교육기관 소속인자만 신청 가능",
  "영상 심사 곡, 예선, 본선 경연곡은 동일할 필요는 없으며, 단, 영상 심사 곡과 예선 곡은 동일한 곡을 사용하는 것을 권장합니다.",
  "'光트로' 예선 진출 팀은 7월 2일(수) 광탈페.kr 홈페이지에 공지됩니다.",
];

const METHOD_ITEMS: MethodItem[] = [
  "참가 신청서, 개인정보수집이용활용동의서,공연 영상 제출: 광주고등학생의회 (hcgwangju@gmail.com 이메일) 제출",
  "메일제목: 분야_대표자이름_대표자학교_팀이름_연락처(예: 댄스_홍길동_한국중_빛나라_01012345678)",
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
        <DescriptionCard title="안내사항" items={INFORM_ITEMS} />

        <div className="flex items-center gap-2 ml-2 py-10">
          <Inform color={colors.gray[500]} />
          <p className="text-gray-500">
            제출 기간: 2025. 6. 16.(월) ~ 6. 20.(금) 18:00까지 접수분에 한함
          </p>
        </div>

        <div className="flex gap-20 mt-4 justify-start pb-28 mobile:flex-col">
          <DownloadButton
            filePath="/files/2025 광탈페 참가 신청서(팀이름).hwp"
            label="참가 신청서"
          />
          <DownloadButton
            filePath="/files/2025 광탈페 참가신청 개인정보제공활용 동의서(팀이름).pdf"
            label="개인정보 제공, 활용 동의서"
          />
        </div>

        <ArrowSteps />

        <EmailButtons className="pt-28" />
      </div>
    </div>
  );
};
