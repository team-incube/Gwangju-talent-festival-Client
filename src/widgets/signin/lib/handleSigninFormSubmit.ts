import { signInSchema } from "@/entities/user/model/schema";
import { authFormState } from "@/entities/user/lib/authFormState";
import { SignInFormValues } from "@/entities/user/model/schema";
import { toast } from "sonner";

export const handleSigninFormSubmit = async (
  _previousState: authFormState,
  formData: FormData
): Promise<authFormState> => {
  const values: SignInFormValues = {
    phoneNumber: formData.get("phoneNumber")?.toString() || "",
    password: formData.get("password")?.toString() || "",
  };

  const result = signInSchema.safeParse(values);
  const isValid = result.success;

  if (!isValid) {
    result.error.errors.forEach((err) => toast.error(err.message));
    return {
      values,
      isValid: false,
      submitted: true,
    };
  }

  toast.success("로그인 성공");

  return {
    values,
    isValid: true,
    submitted: true,
  };
};
