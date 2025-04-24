import { toast } from "sonner";
import { authFormState } from "@/entities/user/lib/authFormState";
import { SignUpFormValues, signUpSchema } from "@/entities/user/model/schema";

export const handleSignupFormSubmit = async (
  _previousState: authFormState,
  formData: FormData
): Promise<authFormState> => {
  const values: SignUpFormValues = {
    phoneNumber: formData.get("phoneNumber")?.toString() || "",
    verificationCode: formData.get("verificationCode")?.toString() || "",
    password: formData.get("password")?.toString() || "",
  };

  const result = signUpSchema.safeParse(values);
  const isValid = result.success;

  if (!isValid) {
    result.error.errors.forEach((err) => toast.error(err.message));
    return {
      values,
      isValid: false,
      submitted: true,
    };
  }

  toast.success("회원가입 성공");

  return {
    values,
    isValid: true,
    submitted: true,
  };
};
