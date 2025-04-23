import { Logo } from "@/shared/asset/svg/Logo";
import { colors } from "@/shared/utils/color";
import SignupFormContainer from "@/widgets/signup/ui/SignupFormContainer";
import { cn } from "@/shared/utils/cn";

const SignupPage = () => {
  return (
    <div className={cn("flex flex-col items-center mt-52 h-screen w-full px-4")}>
      <div className={cn("w-full max-w-md flex flex-col items-center")}>
        <div className={cn("mb-20")}>
          <Logo color={colors.main[600]} size={200} />
        </div>
        <SignupFormContainer />
      </div>
    </div>
  );
};

export default SignupPage;
