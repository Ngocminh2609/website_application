import React, { useState } from "react";
import { Form, Typography, Divider } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import BaseButton from "../../components/common/BaseButton";
import BaseInput from "../../components/common/BaseInput";
import { authApi } from "../../api/authApi";
import { notification } from "../../utils/notification";
import type { LoginRequest, AuthResponse } from "../../types/auth";
import { styles } from "./styles/login.styles";
import { LOGIN_STRINGS } from "../../constants/Auth/auth";

const { Title, Text } = Typography;

interface LoginPageProps {
  onLoginSuccess: () => void;
}

/**
 * Trang Đăng nhập tích hợp xác thực truyền thống và Google OAuth 2.0.
 * Đã xử lý các lỗi TypeScript 'any' để đảm bảo Type-safety.
 */
const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Xử lý đăng nhập truyền thống
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

  // Xử lý sau khi Google cấp Token
  const handleGoogleSuccess = async () => {
    setLoading(true);
    try {
      await authApi.googleLogin();
    } catch {
      notification.error(LOGIN_STRINGS.messages.googleLoginFailed);
      setLoading(false);
    }
  };

  // Hàm dùng chung để lưu Session với Type định nghĩa rõ ràng
  const handleAuthResponse = (response: AuthResponse) => {
    if (response.token) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      notification.auth.loginSuccess();
      onLoginSuccess();
      navigate("/");
    }
  };

  return (
    <div style={styles.loginCard} className="animate-fade-up">
      <div style={styles.headerContainer}>
        <Title
          level={2}
          style={styles.title}
        >
          {LOGIN_STRINGS.title}
        </Title>
        <Text style={styles.subText}>
          {LOGIN_STRINGS.subTitle}
        </Text>
      </div>

      <Form<LoginRequest>
        name="login"
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: LOGIN_STRINGS.usernameRequired }]}
        >
          <BaseInput
            prefix={<UserOutlined style={styles.inputPrefix} />}
            placeholder={LOGIN_STRINGS.usernamePlaceholder}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: LOGIN_STRINGS.passwordRequired }]}
        >
          <BaseInput.Password
            prefix={<LockOutlined style={styles.inputPrefix} />}
            placeholder={LOGIN_STRINGS.passwordPlaceholder}
          />
        </Form.Item>

        <Form.Item>
          <BaseButton
            type="primary"
            htmlType="submit"
            loading={loading}
            style={styles.loginButton}
          >
            {LOGIN_STRINGS.loginBtn}
          </BaseButton>
        </Form.Item>

        <Divider style={styles.divider}>
          <Text style={styles.dividerText}>
            {LOGIN_STRINGS.dividerText}
          </Text>
        </Divider>

        <div style={styles.googleLoginContainer}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => notification.error(LOGIN_STRINGS.messages.googleConnectionError)}
            theme="filled_blue"
            shape="pill"
            text="signin_with"
            width="320"
          />
        </div>

        <div style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {LOGIN_STRINGS.noAccount}
          </Text>
          <span
            onClick={() => navigate("/register")}
            style={styles.registerLink}
          >
            {LOGIN_STRINGS.registerLink}
          </span>
        </div>
      </Form>
    </div>
  );
};

export default LoginPage;
