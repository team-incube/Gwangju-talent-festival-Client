"use client";

interface RefreshResponse {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

export const refresh = async (refreshToken: string): Promise<RefreshResponse> => {
  const response = await fetch("/api/refresh", {
    method: "PATCH",
    headers: {
      "Refresh-Token": refreshToken,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "토큰 갱신에 실패했습니다.");
  }

  return result;
};
