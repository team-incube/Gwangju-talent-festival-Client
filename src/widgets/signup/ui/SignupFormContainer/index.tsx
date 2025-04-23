import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";
import { cn } from "@/shared/utils/cn";

const SignupFormContainer = () => {
  return (
    <div className={cn("w-full space-y-16 mb-4")}>
      <div className={cn("flex flex-col gap-2")}>
        <label className={cn("text-sm font-medium")}>전화번호</label>
        <div className={cn("flex items-end gap-8")}>
          <div className={cn("w-full")}>
            <Input type="text" placeholder="전화번호를 입력해주세요." />
          </div>
          <Button className={cn("w-32 shrink-0 h-[50px]")}>인증번호</Button>
        </div>
      </div>

      <Input type="text" placeholder="인증번호를 입력해주세요." label="인증번호 입력" className={cn("mt-2")} />
      <Input type="password" placeholder="비밀번호를 입력해주세요." label="비밀번호 입력" className={cn("mt-2")} />

      <div className={cn("flex flex-col gap-2")}>
        <Button className={cn("w-full mt-32")}>회원가입</Button>
      </div>
    </div>
  );
};

export default SignupFormContainer;
