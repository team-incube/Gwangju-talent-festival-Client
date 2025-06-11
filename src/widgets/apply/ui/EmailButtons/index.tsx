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

export const EmailButtons: FC<EmailButtonsProps> = ({ className = "" }) => {
  const openEmailLink = (url: string): void => {
    window.open(url, "_blank");
  };

  return (
    <div className={`flex flex-row gap-4 mobile:flex-col ${className}`}>
      {EMAIL_LINKS.map((link) => (
        <Button
          key={`email-link-${link.provider}`}
          className={`w-full flex flex-row gap-18 items-center justify-center ${link.provider === 'google' ? 'border border-gray-100' : ''}`}
          style={{
            backgroundColor: link.bgColor,
            color: link.provider === 'naver' ? '#fff' : link.textColor
          }}
          onClick={() => openEmailLink(link.url)}
        >
          {link.provider === 'naver' ? <NaverLogo color={colors.white} /> : <GoogleLogo />}
          {link.label}
        </Button>
      ))}
    </div>
  );
};

export default EmailButtons; 