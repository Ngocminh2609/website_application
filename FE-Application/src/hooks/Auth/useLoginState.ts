import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import { notification } from "../../utils/notification";
import type { LoginRequest, AuthResponse } from "../../types/auth";
import { storeAuthSession } from "../../pages/Auth/helper";
import { LOGIN_STRINGS } from "../../constants/Auth/auth";

export const useLoginState = (onLoginSuccess: () => void) => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleAuthResponse = (response: AuthResponse) => {
    if (response.token) {
      storeAuthSession(response);
      notification.auth.loginSuccess();
      onLoginSuccess();
      navigate("/");
    }
  };

  const onFinish = async (values: LoginRequest) => {
    setLoading(true);
    try {
      const response = await authApi.login(values);
      handleAuthResponse(response);
    } catch {
      notification.auth.loginError();
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async () => {
    setLoading(true);
    try {
      await authApi.googleLogin();
    } catch {
      notification.error(LOGIN_STRINGS.messages.googleLoginFailed);
      setLoading(false);
    }
  };

  return {
    loading,
    onFinish,
    handleGoogleSuccess,
  };
};
