"use client";

import Input from "@/shared/ui/Input";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SubmitButton from "@/entities/user/ui/SubmitButton";
import { AuthFormState } from "@/entities/user/lib/AuthFormState";
import { handlePerformerVerifySubmit } from "@/widgets/performer/lib/handlePerformerVerifySubmit";
import { toast } from "sonner";

const INITIAL_STATE: AuthFormState = {
  values: { name: "", code: "" },
  isValid: false,
  submitted: false,
};

const PerformerVerifyFormContainer = () => {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(handlePerformerVerifySubmit, INITIAL_STATE);

  useEffect(() => {
    if (state.error) {
      const firstError = Array.isArray(state.error) ? state.error[0] : state.error;
      if (firstError) toast.error(firstError);
    } else if (state.isValid) {
      toast.success("참가자 인증이 완료되었습니다.");
    }
  }, [state.submitted, state.error, state.isValid]);

  useEffect(() => {
    if (state.shouldRedirect && state.redirectTo) {
      router.replace(state.redirectTo);
    }
  }, [state.shouldRedirect, state.redirectTo, router]);

  return (
    <form action={formAction} className="w-full flex flex-col gap-40 mobile:gap-20">
      <div className="space-y-16 mobile:space-y-12">
        <Input
          type="text"
          placeholder="참가자 이름을 입력해주세요."
          label="이름"
          name="name"
          disabled={isPending}
          defaultValue={state.values.name}
          hideErrorSpace
        />

        <Input
          type="text"
          placeholder="발급받은 인증코드를 입력해주세요."
          label="인증코드"
          name="code"
          disabled={isPending}
          defaultValue={state.values.code}
          className="uppercase placeholder:normal-case"
          autoCapitalize="characters"
          autoComplete="off"
          hideErrorSpace
        />
      </div>

      <SubmitButton buttonText={isPending ? "인증 중..." : "인증하기"} disabled={isPending} />
    </form>
  );
};

export default PerformerVerifyFormContainer;
