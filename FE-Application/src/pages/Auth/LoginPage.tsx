import React from "react";
import { Form, Typography, Divider, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import BaseButton from "../../components/common/BaseButton";
import BaseInput from "../../components/common/BaseInput";
import { notification } from "../../utils/notification";
import type { LoginRequest } from "../../types/auth";
import { styles } from "./styles/login.styles";
import { LOGIN_STRINGS } from "../../constants/Auth/auth";
import { useLoginState } from "../../hooks/Auth/useLoginState";

const { Title, Text } = Typography;

interface LoginPageProps {
  onLoginSuccess: () => void;
}

/**
 * Trang Đăng nhập tích hợp xác thực truyền thống và Google OAuth 2.0.
 * Đã xử lý các lỗi TypeScript 'any' để đảm bảo Type-safety.
 */
const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { loading, onFinish, handleGoogleSuccess } = useLoginState(onLoginSuccess, form);

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

      <Form<LoginRequest & { remember?: boolean }>
        form={form}
        name="login"
        onFinish={onFinish}
        layout="vertical"
        size="large"
        initialValues={{ remember: false }}
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

        <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: 16 }}>
          <Checkbox>{LOGIN_STRINGS.rememberMe}</Checkbox>
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
