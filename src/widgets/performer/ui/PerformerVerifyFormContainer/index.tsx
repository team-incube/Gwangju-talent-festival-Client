"use client";

import Input from "@/shared/ui/Input";
import { cn } from "@/shared/utils/cn";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SubmitButton from "@/entities/user/ui/SubmitButton";
import { AuthFormState } from "@/entities/user/lib/AuthFormState";
import { handlePerformerVerifySubmit } from "@/widgets/performer/lib/handlePerformerVerifySubmit";
import { toast } from "sonner";

const PerformerVerifyFormContainer = () => {
  const router = useRouter();
  const initialState: AuthFormState = {
    values: { name: "", code: "" },
    isValid: false,
    submitted: false,
  };

  const [state, formAction, isPending] = useActionState(
    handlePerformerVerifySubmit,
    initialState,
  );

  useEffect(() => {
    if (state.error) {
      const firstError = Array.isArray(state.error) ? state.error[0] : state.error;
      if (firstError) toast.error(firstError);
    } else if (state.isValid) {
      toast.success("출연진 인증이 완료되었습니다.");
    }
  }, [state.submitted, state.error, state.isValid]);

  useEffect(() => {
    if (state.shouldRedirect && state.redirectTo) {
      router.replace(state.redirectTo);
    }
  }, [state.shouldRedirect, state.redirectTo, router]);

  return (
    <div className={cn("w-full mb-4")}>
      <form action={formAction} className="flex flex-col gap-40">
        <div className={cn("space-y-16")}>
          <Input
            type="text"
            placeholder="출연진 이름을 입력해주세요."
            label="이름"
            name="name"
            className={cn("mt-2")}
            disabled={isPending}
            defaultValue={state.values.name}
          />

          <Input
            type="text"
            placeholder="발급받은 인증코드를 입력해주세요."
            label="인증코드"
            name="code"
            className={cn("mt-2")}
            disabled={isPending}
            defaultValue={state.values.code}
          />
        </div>

        <SubmitButton buttonText={isPending ? "인증 중..." : "인증하기"} disabled={isPending} />
      </form>
    </div>
  );
};

export default PerformerVerifyFormContainer;
