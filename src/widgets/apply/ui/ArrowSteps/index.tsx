import { FC } from "react";
import Arrow from "@/shared/asset/svg/Arrow";
import { colors } from "@/shared/utils/color";

type ArrowColor = typeof colors.main[keyof typeof colors.main];

interface ArrowData {
  color: ArrowColor;
  text: string;
}

interface ArrowStepsProps {
  className?: string;
}

const ARROWS_DATA: readonly ArrowData[] = [
  { color: colors.main[100], text: "참가 신청서 n작성" },
  { color: colors.main[200], text: "개인정보수집이용 n활용동의서 작성" },
  { color: colors.main[300], text: "공연영상제작 n3분 내외, MP4 파일" },
  { color: colors.main[400], text: "이메일 제출" }
] as const;

export const ArrowSteps: FC<ArrowStepsProps> = ({ className = "" }) => {
  return (
    <div className={`${className}`}>
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
    </div>
  );
};

export default ArrowSteps; 