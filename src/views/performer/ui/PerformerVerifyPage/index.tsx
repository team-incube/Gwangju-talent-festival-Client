import { Logo } from "@/shared/asset/svg/Logo";
import { colors } from "@/shared/utils/color";
import Link from "next/link";
import PerformerVerifyFormContainer from "@/widgets/performer/ui/PerformerVerifyFormContainer";

const PerformerVerifyPage = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-orange-100 px-16 py-40">
      <div className="w-full max-w-[460px] flex flex-col items-center">
        <Link href="/home">
          <Logo
            color={colors.orange[500]}
            width={140}
            height={70}
            className="mobile:w-[110px] mobile:h-[56px]"
          />
        </Link>

        <div className="mt-28 w-full flex flex-col items-center gap-12 rounded-[20px] border border-orange-300 bg-white px-32 py-36 mobile:mt-20 mobile:px-20 mobile:py-28">
          <span className="inline-flex items-center rounded-full bg-orange-500 px-14 py-4 text-caption1b text-white">
            출연진 전용
          </span>
          <h1 className="text-body1b mobile:text-body2b">출연진 인증</h1>
          <p className="text-body3r text-gray-500 text-center break-keep mobile:text-caption1r">
            전달받은 일회성 인증코드를 입력하면 현재 계정에 출연진 권한이 부여됩니다.
          </p>

          <div className="mt-16 w-full mobile:mt-8">
            <PerformerVerifyFormContainer />
          </div>
        </div>

        <p className="mt-20 text-caption1r text-gray-500 text-center break-keep">
          인증코드를 받지 못했다면 담당 학생회에 문의해주세요.
        </p>
      </div>
    </div>
  );
};

export default PerformerVerifyPage;
