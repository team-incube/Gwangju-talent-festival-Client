import { Logo } from "@/shared/asset/svg/Logo";
import { colors } from "@/shared/utils/color";
import SigninFormContainer from "@/widgets/signin/ui/SigninFormContainer";
import { cn } from "@/shared/utils/cn";

const SigninPage = () => {
  return (
    <div className={cn("flex flex-col items-center mt-52 h-screen w-full px-4")}>
      <div className={cn("w-full max-w-md flex flex-col items-center")}>
        <div className={cn("mb-20")}>
          <Logo color={colors.main[600]} size={200} />
        </div>
        <SigninFormContainer />
      </div>
    </div>
  );
};

export default SigninPage;
