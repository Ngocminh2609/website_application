import React from "react";
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
import type { RegisterRequest } from "../../types/auth";
import { styles } from "./styles/register.styles";
import { REGISTER_STRINGS } from "../../constants/Auth/auth";
import { useRegisterState } from "../../hooks/Auth/useRegisterState";
import { emailRules, passwordMinRules } from "../../utils/validationRules";

const { Title, Text } = Typography;

/**
 * Trang Đăng ký sử dụng thông báo tùy chỉnh trên Frontend.
 */
const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { loading, onFinish } = useRegisterState();

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
          rules={emailRules(
            REGISTER_STRINGS.emailRequired,
            REGISTER_STRINGS.emailInvalid,
          )}
        >
          <BaseInput
            prefix={<MailOutlined style={styles.inputPrefix} />}
            placeholder={REGISTER_STRINGS.emailPlaceholder}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={passwordMinRules(
            REGISTER_STRINGS.passwordRequired,
            REGISTER_STRINGS.passwordMin,
          )}
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
