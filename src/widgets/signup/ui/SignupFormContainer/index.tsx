"use client";

import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";
import { cn } from "@/shared/utils/cn";
import { useFormState } from "react-dom";
import { authFormState } from "@/entities/user/lib/authFormState";
import SubmitButton from "@/entities/user/ui/SubmitButton";
import { handleSignupFormSubmit } from "@/widgets/signup/lib/handleSignupFormSubmit";
import { useState } from "react";

const SignupFormContainer = () => {
  const [codeSent, setCodeSent] = useState(false);

  const initialState: authFormState = {
    values: { phoneNumber: "", verificationCode: "", password: "" },
    isValid: false,
    submitted: false,
  };

  const formAction = useFormState(handleSignupFormSubmit, initialState)[1];

  const handleSendVerificationCode = () => {
    setCodeSent(true);
  };

  return (
    <div className={cn("w-full mb-4")}>
      <form action={formAction}>
        <input type="hidden" name="formType" value="signup" />
        <div className={cn("space-y-16")}>
          <div className={cn("flex flex-col gap-2")}>
            <label className={cn("text-sm font-medium")}>전화번호</label>
            <div className={cn("flex items-end gap-8")}>
              <div className={cn("w-full")}>
                <Input type="text" placeholder="전화번호를 입력해주세요." name="phoneNumber" />
              </div>
              <Button
                className={cn("w-32 shrink-0 h-[50px]")}
                type="button"
                onClick={handleSendVerificationCode}
                disabled={codeSent}
              >
                {codeSent ? "재전송" : "인증번호"}
              </Button>
            </div>
          </div>

          {codeSent && (
            <div>
              <Input
                type="text"
                placeholder="인증번호를 입력해주세요."
                label="인증번호 입력"
                className={cn("mt-2")}
                name="verificationCode"
              />
            </div>
          )}

          <div>
            <Input
              type="password"
              placeholder="비밀번호를 입력해주세요."
              label="비밀번호 입력"
              className={cn("mt-2")}
              name="password"
            />
          </div>
        </div>

        <div className={cn("flex flex-col gap-2 mt-16")}>
          <SubmitButton buttonText="회원가입" />
        </div>
      </form>
    </div>
  );
};

export default SignupFormContainer;
