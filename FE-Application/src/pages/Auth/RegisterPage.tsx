import React, { useState } from "react";
import { Form, Typography } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import BaseButton from "../../components/common/BaseButton";
import BaseInput from "../../components/common/BaseInput";
import { authApi } from "../../api/authApi";
import { notification } from "../../utils/notification";
import type { RegisterRequest } from "../../types/auth";
import { styles } from "./styles/register.styles";
import { REGISTER_STRINGS } from "../../constants/Auth/auth";

const { Title, Text } = Typography;

/**
 * Trang Đăng ký sử dụng thông báo tùy chỉnh trên Frontend.
 */
const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const onFinish = async (values: RegisterRequest) => {
    setLoading(true);
    try {
      await authApi.register(values);

      // Sử dụng thông báo nghiệp vụ đăng ký thành công (DRY)
      notification.auth.registerSuccess();

      navigate("/login");
    } catch {
      // Loại bỏ biến error không sử dụng để tránh lỗi lints
      notification.auth.registerError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.registerCard}>
      <div style={styles.headerContainer}>
        <Title level={2} style={styles.title}>
          {REGISTER_STRINGS.title}
        </Title>
        <Text style={styles.subText}>
          {REGISTER_STRINGS.subTitle}
        </Text>
      </div>

      <Form<RegisterRequest>
        name="register"
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: REGISTER_STRINGS.usernameRequired }]}
        >
          <BaseInput
            prefix={<UserOutlined style={styles.inputPrefix} />}
            placeholder={REGISTER_STRINGS.usernamePlaceholder}
          />
        </Form.Item>

        <Form.Item name="fullName">
          <BaseInput
            prefix={
              <IdcardOutlined style={styles.inputPrefix} />
            }
            placeholder={REGISTER_STRINGS.fullNamePlaceholder}
          />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: REGISTER_STRINGS.emailRequired },
            { type: "email", message: REGISTER_STRINGS.emailInvalid },
          ]}
        >
          <BaseInput
            prefix={<MailOutlined style={styles.inputPrefix} />}
            placeholder={REGISTER_STRINGS.emailPlaceholder}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: REGISTER_STRINGS.passwordRequired },
            { min: 6, message: REGISTER_STRINGS.passwordMin },
          ]}
        >
          <BaseInput.Password
            prefix={<LockOutlined style={styles.inputPrefix} />}
            placeholder={REGISTER_STRINGS.passwordPlaceholder}
          />
        </Form.Item>

        <Form.Item>
          <BaseButton
            type="primary"
            htmlType="submit"
            loading={loading}
            style={styles.registerButton}
          >
            {REGISTER_STRINGS.registerBtn}
          </BaseButton>
        </Form.Item>

        <div style={styles.footerContainer}>
          <Text style={styles.footerText}>{REGISTER_STRINGS.hasAccount}</Text>
          <span
            onClick={() => navigate("/login")}
            style={styles.loginLink}
          >
            {REGISTER_STRINGS.loginLink}
          </span>
        </div>
      </Form>
    </div>
  );
};

export default RegisterPage;
