"use client";

import Input from "@/shared/ui/Input";
import { cn } from "@/shared/utils/cn";
import { useFormState } from "react-dom";
import SubmitButton from "@/entities/user/ui/SubmitButton";
import { authFormState } from "@/entities/user/lib/authFormState";
import { handleSigninFormSubmit } from "@/widgets/signin/lib/handleSigninFormSubmit";

const SigninFormContainer = () => {
  const initialState: authFormState = {
    values: { phoneNumber: "", password: "" },
    isValid: false,
    submitted: false,
  };

  const formAction = useFormState(handleSigninFormSubmit, initialState)[1];

  return (
    <div className={cn("w-full mb-4")}>
      <form action={formAction}>
        <input type="hidden" name="formType" value="signin" />
        <div className={cn("space-y-16")}>
          <div>
            <Input
              type="text"
              placeholder="전화번호를 입력해주세요."
              label="전화번호"
              name="phoneNumber"
              className={cn("mt-2")}
            />
          </div>

          <div>
            <Input
              type="password"
              placeholder="비밀번호를 입력해주세요."
              label="비밀번호"
              name="password"
              className={cn("mt-2")}
            />
          </div>
        </div>

        <div className={cn("flex flex-col gap-2 mt-16")}>
          <SubmitButton buttonText="로그인" />
        </div>
      </form>
    </div>
  );
};

export default SigninFormContainer;
