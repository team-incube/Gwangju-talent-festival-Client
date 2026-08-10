import { AuthFormState } from "@/entities/user/lib/AuthFormState";
import { performerVerifySchema } from "@/entities/user/model/schema";
import { verifyPerformer } from "@/entities/user/api/verifyPerformer";
import { setTokens, setRole } from "@/shared/utils/auth";

export const handlePerformerVerifySubmit = async (
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> => {
  const values = {
    name: formData.get("name")?.toString() || "",
    code: formData.get("code")?.toString() || "",
  };

  const result = performerVerifySchema.safeParse(values);
  if (!result.success) {
    return {
      values,
      isValid: false,
      submitted: true,
      error: result.error.errors.map(e => e.message),
    };
  }

  try {
    const response = await verifyPerformer(result.data);

    setTokens(
      response.accessToken,
      response.accessTokenExpiresAt,
      response.refreshToken,
      response.refreshTokenExpiresAt,
    );

    setRole(response.role);

    return {
      values,
      isValid: true,
      submitted: true,
      shouldRedirect: true,
      redirectTo: "/booking",
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "출연진 인증에 실패했습니다.";
    return {
      values,
      isValid: false,
      submitted: true,
      error: errorMessage,
    };
  }
};
