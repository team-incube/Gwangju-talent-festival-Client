import { FC } from "react";
import Button from "@/shared/ui/Button";
import { NaverLogo } from "@/shared/asset/svg/NaverLogo";
import { GoogleLogo } from "@/shared/asset/svg/GoogleLogo";
import { colors } from "@/shared/utils/color";

interface EmailLink {
  url: string;
  provider: "naver" | "google";
  label: string;
  bgColor: string;
  textColor: string;
}

interface EmailButtonsProps {
  className?: string;
}

const emailSubject = encodeURIComponent("분야_대표자이름_대표자학교_팀이름_연락처");
const emailBody = encodeURIComponent(
  "참가 신청서, 개인정보수집이용활용동의서, 공연 영상[3분 내외, MP4 파일]을 첨부하여 주세요.",
);

const EMAIL_LINKS: readonly EmailLink[] = [
  {
    provider: "naver",
    url: `https://mail.naver.com/write/popup?to=hcgwangju@gmail.com&subject=${emailSubject}&body=${emailBody}`,
    label: "네이버메일 전송 바로가기",
    bgColor: "#01C13A",
    textColor: colors.white,
  },
  {
    provider: "google",
    url: `https://mail.google.com/mail/?view=cm&fs=1&to=hcgwangju@gmail.com&su=${emailSubject}&body=${emailBody}`,
    label: "구글메일 전송 바로가기",
    bgColor: colors.white,
    textColor: colors.black,
  },
] as const;

export const EmailButtons: FC<EmailButtonsProps> = ({ className = "" }) => {
  const openEmailLink = (url: string): void => {
    window.open(url, "_blank");
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="text-sm text-gray-500 mb-2">
        참가 신청 시 아래 정보를 메일에 첨부해 주세요:
        <br />
        <strong>메일 제목:</strong> 분야_대표자이름_대표자학교_팀이름_연락처
        <br />
        <strong>메일 본문:</strong>
        <span className="text-gray-400">
          참가 신청서, 개인정보수집이용활용동의서, 공연 영상[3분 내외, MP4 파일]을 첨부하여 주세요.
        </span>
      </div>

      {EMAIL_LINKS.map(link => (
        <Button
          key={`email-link-${link.provider}`}
          className={`w-full flex flex-row gap-4 items-center justify-center ${
            link.provider === "google" ? "border border-gray-100" : ""
          }`}
          style={{
            backgroundColor: link.bgColor,
            color: link.textColor,
          }}
          onClick={() => openEmailLink(link.url)}
        >
          {link.provider === "naver" ? <NaverLogo color={colors.white} /> : <GoogleLogo />}
          {link.label}
        </Button>
      ))}
    </div>
  );
};

export default EmailButtons;
