import { signinSchema, SignInFormValues } from "@/entities/user/model/schema";
import { AuthFormState } from "@/entities/user/lib/AuthFormState";
import { signin } from "@/entities/user/api/signin";
import { setTokens, setRole } from "@/shared/utils/auth";

export const handleSigninFormSubmit = async (
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> => {
  const values: SignInFormValues = {
    phoneNumber: formData.get("phoneNumber")?.toString() || "",
    password: formData.get("password")?.toString() || "",
  };

  const result = signinSchema.safeParse(values);
  if (!result.success) {
    return {
      values,
      isValid: false,
      submitted: true,
      error: result.error.errors.map(e => e.message),
    };
  }

  try {
    const response = await signin(values);

    setTokens(
      response.accessToken,
      response.accessTokenExpiresAt,
      response.refreshToken,
      response.refreshTokenExpiresAt,
    );

    setRole(response.role, response.refreshTokenExpiresAt);

    const urlParams = new URLSearchParams(window.location.search);
    const nextParam = urlParams.get("next");

    const redirectTo =
      nextParam && nextParam.startsWith("/") && nextParam !== "/signin" ? nextParam : "/home";

    return {
      values,
      isValid: true,
      submitted: true,
      shouldRedirect: true,
      redirectTo,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "로그인에 실패했습니다.";
    return {
      values,
      isValid: false,
      submitted: true,
      error: [message],
    };
  }
};
