import { AUTH_CHANGE_EVENT, isLoggedIn } from "@/shared/utils/auth";
import { useEffect, useState } from "react";

export function useAuthSync() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const updateLoginState = () => {
      setIsUserLoggedIn(isLoggedIn());
    };

    updateLoginState();

    const handleVisibilityChange = () => {
      if (!document.hidden) updateLoginState();
    };

    window.addEventListener("focus", updateLoginState);
    window.addEventListener(AUTH_CHANGE_EVENT, updateLoginState);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", updateLoginState);
      window.removeEventListener(AUTH_CHANGE_EVENT, updateLoginState);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return { isUserLoggedIn };
}
