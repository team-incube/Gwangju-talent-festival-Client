import Tool from "@/shared/asset/svg/Tool";
import { colors } from "@/shared/utils/color";

export default function ComingSoon() {
  return (
    <div
      className="flex flex-col items-center justify-center w-full"
      style={{ height: "calc(100vh - 81px)" }}
    >
      <Tool color={colors.main[600]} />
      <h1 className="text-title4b mt-[44px] mb-24 text-main-600">현재 개발 중입니다</h1>
      <p className="text-body3r">5월 19일 소개 페이지 오픈, 5월 26일 슬로건 공모 오픈</p>
    </div>
  );
}
