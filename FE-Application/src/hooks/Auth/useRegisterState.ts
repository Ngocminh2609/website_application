import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import { notification } from "../../utils/notification";
import type { RegisterRequest } from "../../types/auth";

export const useRegisterState = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const onFinish = async (values: RegisterRequest) => {
    setLoading(true);
    try {
      await authApi.register(values);
      notification.auth.registerSuccess();
      navigate("/login");
    } catch {
      notification.auth.registerError();
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    onFinish,
  };
};
