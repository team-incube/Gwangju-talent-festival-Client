import { Logo } from "@/shared/asset/svg/Logo";
import { colors } from "@/shared/utils/color";
import { share } from "../../lib/share";
import Share from "@/shared/asset/svg/Share";

export default function SloganFormSuccess() {
  return (
    <div
      className="flex flex-col items-center justify-center w-full"
      style={{ height: "calc(100vh - 81px)" }}
    >
      <Logo height={131} color={colors.main[600]} width={211} />
      <div className="mt-[52px]">
        <h1 className="sm:text-title2b text-title4b">응모가 완료되었습니다!</h1>
        {typeof navigator.share !== "undefined" && (
          <div
            onClick={share}
            className="flex gap-24 cursor-pointer items-center justify-center mt-12 sm:mt-24"
          >
            <Share color={colors.main[600]} height={24} width={24} />
            <span className="text-body2r text- underline text-main-600">
              친구들에게도 공유해주세요
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
