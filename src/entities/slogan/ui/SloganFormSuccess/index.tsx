import Share from "@/shared/asset/Share";
import { Logo } from "@/shared/asset/svg/Logo";
import { colors } from "@/shared/utils/color";

export default function SloganFormSuccess() {
  return (
    <div
      className="flex flex-col items-center justify-center w-full"
      style={{ height: "calc(100vh - 81px)" }}
    >
      <Logo height={131} color={colors.main[600]} width={211} />
      <div className="mt-[52px]">
        <h1 className="sm:text-title1b text-title4b  text-main-600">응모가 완료되었습니다!</h1>
        <div className="flex gap-24 items-center justify-center mt-12 sm:mt-24">
          <Share className="w-25 h-24 sm:w-[37px] sm:h-[36px]" />
          <span className="sm:text-body1r text-body3r underline">친구들에게도 공유해주세요</span>
        </div>
      </div>
    </div>
  );
}
