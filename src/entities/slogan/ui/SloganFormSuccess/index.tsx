import { useRouter } from "next/navigation";
import { Logo } from "@/shared/asset/svg/Logo";
import { colors } from "@/shared/utils/color";
import { share } from "../../lib/share";
import Share from "@/shared/asset/svg/Share";
import Button from "@/shared/ui/Button";

export default function SloganFormSuccess() {
  const R = useRouter();

  return (
    <div
      className="flex flex-col items-center justify-center w-full text-center"
      style={{ height: "calc(100vh - 81px)" }}
    >
      <Logo height={131} color={colors.main[600]} width={211} />
      <div className="mt-[52px]">
        <h1 className="sm:text-title2b text-title4b text-center">응모가 완료되었습니다!</h1>{" "}
        <div className="text-caption1r mobile:text-caption2r text-gray-400 mt-10">
          결과 발표: 2025. 6. 13.(금) 예정, <br />
          광주학생예술누리터 홈페이지 공지 및 개별 통지
        </div>
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
        <div className="mx-auto">
          <Button onClick={() => R.push("/home")} className="my-[24px] mobile:mb-[12px] px-28 ">
            <span className="text-body2b mobile:text-body3b flex items-center gap-10">
              홈으로 가기 <span>➔</span>
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
