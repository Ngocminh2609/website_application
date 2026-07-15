import React from "react";
import {
  Typography,
  Form,
  Input,
  Avatar,
  Upload,
  Tabs,
  Spin,
  Divider,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  LockOutlined,
  UploadOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import type { User } from "../../types/auth";
import { ROLES } from "../../components/common/Commons";
import BaseButton from "../../components/common/BaseButton";
import { PageLoading } from "../../components/common/PageLoading";
import { PROFILE_INPUT_STYLE } from "../../styles/commonStyles";
import { useProfilePage } from "../../hooks/Profile/useProfilePage";
import { styles } from "./styles/profile-page.styles";
import { PROFILE_STRINGS } from "../../constants/Profile/profile";
import {
  emailRules,
  passwordMinRules,
  phoneRules,
} from "../../utils/validationRules";

const { Title, Text } = Typography;

interface ProfilePageProps {
  onUserUpdate: (updated: Partial<User>) => void;
}

/**
 * Trang hồ sơ cá nhân - Cho phép người dùng cập nhật thông tin và đổi mật khẩu.
 * Tách form thành 2 tab để tránh submit chung gây nhầm lẫn giữa đổi info và đổi password.
 */
const ProfilePage: React.FC<ProfilePageProps> = ({ onUserUpdate }) => {
  const {
    profileForm,
    passwordForm,
    user,
    loading,
    savingProfile,
    savingPassword,
    avatarUrl,
    setAvatarUrl,
    uploadingAvatar,
    handleSaveProfile,
    handleChangePassword,
    uploadProps,
  } = useProfilePage(onUserUpdate);

  if (loading) {
    return <PageLoading style={styles.loadingContainer} />;
  }

  return (
    <div className="main-content animate-fade-in" style={styles.pageContainer}>
      {/* Header */}
      <div style={styles.headerWrapper}>
        <Text style={styles.headerSub}>
          {PROFILE_STRINGS.accountMy}
        </Text>
        <Title level={2} style={styles.headerTitle}>
          {PROFILE_STRINGS.profileTitle}
        </Title>
      </div>

      <Row gutter={[48, 48]}>
        {/* Cột trái: Avatar + thông tin nhanh */}
        <Col xs={24} lg={7}>
          <div style={styles.leftCard}>
            <div style={styles.avatarWrapper}>
              <Avatar
                size={120}
                src={avatarUrl}
                icon={!avatarUrl && <UserOutlined />}
                style={styles.avatar}
                onError={() => {
                  setAvatarUrl(undefined);
                  return false;
                }}
              />
              <Upload {...uploadProps}>
                <div style={styles.cameraBtn}>
                  {uploadingAvatar ? (
                    <Spin size="small" />
                  ) : (
                    <CameraOutlined style={styles.cameraIcon} />
                  )}
                </div>
              </Upload>
            </div>

            <Title level={4} style={styles.userNameText}>
              {user?.fullName || user?.username}
            </Title>
            <Text style={styles.userEmailText}>{user?.email}</Text>

            <Divider style={styles.divider} />

            <div style={styles.infoContainer}>
              {[
                { label: PROFILE_STRINGS.labelUsername, value: user?.username },
                {
                  label: PROFILE_STRINGS.labelRole,
                  value:
                    user?.role === ROLES.ADMIN
                      ? PROFILE_STRINGS.roleAdmin
                      : PROFILE_STRINGS.roleUser,
                },
                {
                  label: PROFILE_STRINGS.labelJoinedDate,
                  value: user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                    : "-",
                },
              ].map((item) => (
                <div key={item.label} style={styles.infoItem}>
                  <Text style={styles.infoItemLabel}>
                    {item.label}
                  </Text>
                  <Text style={styles.infoItemValue}>
                    {item.value}
                  </Text>
                </div>
              ))}
            </div>

            <Upload {...uploadProps}>
              <BaseButton
                icon={<UploadOutlined />}
                style={styles.uploadBtn}
                loading={uploadingAvatar}
              >
                {PROFILE_STRINGS.changeAvatarBtn}
              </BaseButton>
            </Upload>
          </div>
        </Col>

        {/* Cột phải: Tabs form */}
        <Col xs={24} lg={17}>
          <div style={styles.leftCard}>
            <Tabs
              defaultActiveKey="profile"
              items={[
                {
                  key: "profile",
                  label: (
                    <span style={styles.tabLabelText}>
                      <EditOutlined style={styles.tabLabelIcon} />
                      {PROFILE_STRINGS.tabProfile}
                    </span>
                  ),
                  children: (
                    <Form
                      form={profileForm}
                      layout="vertical"
                      onFinish={handleSaveProfile}
                      style={styles.profileForm}
                    >
                      <Row gutter={[24, 0]}>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label={
                              <Text style={styles.formItemLabel}>
                                {PROFILE_STRINGS.inputFullName}
                              </Text>
                            }
                            name="fullName"
                            rules={[
                              {
                                required: true,
                                message: PROFILE_STRINGS.validation.fullNameRequired,
                              },
                            ]}
                          >
                            <Input
                              style={PROFILE_INPUT_STYLE}
                              placeholder={PROFILE_STRINGS.placeholders.fullName}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label={
                              <Text style={styles.formItemLabel}>
                                {PROFILE_STRINGS.labelUsername}
                              </Text>
                            }
                            name="username"
                          >
                            <Input
                              style={{
                                ...PROFILE_INPUT_STYLE,
                                ...styles.disabledInput,
                              }}
                              disabled
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label={
                              <Text style={styles.formItemLabel}>
                                {PROFILE_STRINGS.inputEmail}
                              </Text>
                            }
                            name="email"
                            rules={emailRules(
                              PROFILE_STRINGS.validation.emailRequired,
                              PROFILE_STRINGS.validation.emailInvalid,
                            )}
                          >
                            <Input
                              style={PROFILE_INPUT_STYLE}
                              placeholder={PROFILE_STRINGS.placeholders.email}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label={
                              <Text style={styles.formItemLabel}>
                                {PROFILE_STRINGS.inputPhone}
                              </Text>
                            }
                            name="phone"
                            rules={phoneRules(
                              PROFILE_STRINGS.validation.phoneInvalid,
                            )}
                          >
                            <Input
                              style={PROFILE_INPUT_STYLE}
                              placeholder={PROFILE_STRINGS.placeholders.phone}
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      <div style={styles.submitBtnWrapper}>
                        <BaseButton
                          type="primary"
                          htmlType="submit"
                          loading={savingProfile}
                          style={styles.profileSubmitBtn}
                        >
                          {PROFILE_STRINGS.submitSaveProfile}
                        </BaseButton>
                      </div>
                    </Form>
                  ),
                },
                {
                  key: "password",
                  label: (
                    <span style={styles.tabLabelText}>
                      <LockOutlined style={styles.tabLabelIcon} />
                      {PROFILE_STRINGS.tabPassword}
                    </span>
                  ),
                  children: (
                    <Form
                      form={passwordForm}
                      layout="vertical"
                      onFinish={handleChangePassword}
                      style={styles.passwordForm}
                    >
                      <Form.Item
                        label={
                          <Text style={styles.formItemLabel}>
                            {PROFILE_STRINGS.inputCurrentPassword}
                          </Text>
                        }
                        name="currentPassword"
                        rules={[
                          {
                            required: true,
                            message: PROFILE_STRINGS.validation.currentPasswordRequired,
                          },
                        ]}
                      >
                        <Input.Password
                          style={PROFILE_INPUT_STYLE}
                          placeholder={PROFILE_STRINGS.placeholders.currentPassword}
                        />
                      </Form.Item>

                      <Form.Item
                        label={
                          <Text style={styles.formItemLabel}>
                            {PROFILE_STRINGS.inputNewPassword}
                          </Text>
                        }
                        name="newPassword"
                        rules={passwordMinRules(
                          PROFILE_STRINGS.validation.newPasswordRequired,
                          PROFILE_STRINGS.validation.newPasswordMinLen,
                        )}
                      >
                        <Input.Password
                          style={PROFILE_INPUT_STYLE}
                          placeholder={PROFILE_STRINGS.placeholders.newPassword}
                        />
                      </Form.Item>

                      <Form.Item
                        label={
                          <Text style={styles.formItemLabel}>
                            {PROFILE_STRINGS.inputConfirmPassword}
                          </Text>
                        }
                        name="confirmPassword"
                        rules={[
                          {
                            required: true,
                            message: PROFILE_STRINGS.validation.confirmPasswordRequired,
                          },
                        ]}
                      >
                        <Input.Password
                          style={PROFILE_INPUT_STYLE}
                          placeholder={PROFILE_STRINGS.placeholders.confirmPassword}
                        />
                      </Form.Item>

                      <BaseButton
                        type="primary"
                        htmlType="submit"
                        loading={savingPassword}
                        style={styles.passwordSubmitBtn}
                      >
                        {PROFILE_STRINGS.submitChangePassword}
                      </BaseButton>
                    </Form>
                  ),
                },
              ]}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;
