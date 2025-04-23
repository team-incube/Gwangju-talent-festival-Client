import { Logo } from "@/shared/asset/svg/Logo";
import { colors } from "@/shared/utils/color";
import SignupFormContainer from "@/widgets/signup/ui/SignupFormContainer";


const SignupPage = () => {
  return (
    <div
      className="flex flex-col items-center mt-52
     h-screen w-full px-4"
    >
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="mb-20">
          <Logo color={colors.main[600]} size={200} />
        </div>
        <SignupFormContainer />
      </div>
    </div>
  );
};

export default SignupPage;
