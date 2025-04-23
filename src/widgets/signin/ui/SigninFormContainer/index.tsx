import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";
import { cn } from "@/shared/utils/cn";

const SigninFormContainer = () => {
  return (
    <div className={cn("w-full space-y-16 mb-4")}>
      <Input type="text" placeholder="전화번호를 입력해주세요." label="전화번호" className={cn("mt-2")} />
      <Input type="password" placeholder="비밀번호를 입력해주세요." label="비밀번호" className={cn("mt-2")} />

      <div className={cn("flex flex-col gap-2")}>
        <Button className={cn("w-full mt-32")}>로그인</Button>
      </div>
    </div>
  );
};

export default SigninFormContainer;
