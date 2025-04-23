import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";

const SignupFormContainer = () => {
  return (
    <div className="w-full space-y-16 mb-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">전화번호</label>
        <div className="flex items-end gap-8">
          <div className="w-full">
            <Input type="text" placeholder="전화번호를 입력해주세요." />
          </div>
          <Button className="w-32 shrink-0 h-[50px]">인증번호</Button>
        </div>
      </div>

      <Input type="text" placeholder="인증번호를 입력해주세요." label="인증번호 입력" className="mt-2" />
      <Input type="password" placeholder="비밀번호를 입력해주세요." label="비밀번호 입력" className="mt-2" />
    </div>
  );
};

export default SignupFormContainer;
