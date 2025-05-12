import Tool from "@/shared/asset/svg/Tool";
import { colors } from "@/shared/utils/color";

export default function ComingSoon() {
  return (
    <div
      className="flex flex-col items-center justify-center w-full"
      style={{ height: "calc(100vh - 81px)" }}
    >
      <Tool color={colors.main[600]} />
      <h1 className="text-title4b mt-[44px] mb-24 text-main-600">현재 신청기간 전입니다.</h1>
      <p className="text-body2b mobile:text-body3b">
        문의사항은 우측 하단 문의하기를 이용해 주세요.
      </p>
      <p className="text-body3r mobile:text-caption1r mb-[100px]">
        5월 19일 소개 페이지 오픈, 5월 26일 슬로건 공모 오픈
      </p>
    </div>
  );
}
