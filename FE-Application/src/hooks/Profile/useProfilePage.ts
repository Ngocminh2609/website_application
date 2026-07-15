import { useState, useEffect } from "react";
import { Form } from "antd";
import type { UploadProps } from "antd";
import { useLocation } from "react-router-dom";
import type { User } from "../../types/auth";
import { userApi } from "../../api/userApi";
import { fileApi } from "../../api/fileApi";
import { notification } from "../../utils/notification";
import { PROFILE_STRINGS } from "../../constants/Profile/profile";
import { updateStoredUser } from "../../utils/auth";
import { getErrorMessage } from "../../utils/error";

export const useProfilePage = (onUserUpdate: (updated: Partial<User>) => void) => {
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userApi.getProfile();
        setUser(data);
        setAvatarUrl(data.avatarUrl);
        profileForm.setFieldsValue({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          username: data.username,
        });
      } catch {
        notification.error(PROFILE_STRINGS.errLoadProfile);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [profileForm, location.key]);

  const handleSaveProfile = async (values: {
    fullName: string;
    email: string;
    phone: string;
  }) => {
    setSavingProfile(true);
    try {
      const updated = await userApi.updateProfile({ ...values, avatarUrl });
      updateStoredUser(updated);
      setUser(updated);
      onUserUpdate(updated);
      notification.success(PROFILE_STRINGS.successUpdateProfile);
    } catch (err: unknown) {
      notification.error(getErrorMessage(err, "Cập nhật thất bại"));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (values.newPassword !== values.confirmPassword) {
      notification.error(PROFILE_STRINGS.errPasswordMismatch);
      return;
    }
    setSavingPassword(true);
    try {
      await userApi.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      notification.success(PROFILE_STRINGS.successChangePassword);
      passwordForm.resetFields();
    } catch (err: unknown) {
      notification.error(getErrorMessage(err, "Đổi mật khẩu thất bại"));
    } finally {
      setSavingPassword(false);
    }
  };

  const uploadProps: UploadProps = {
    showUploadList: false,
    accept: "image/*",
    beforeUpload: async (file) => {
      setUploadingAvatar(true);
      try {
        const res = await fileApi.uploadImage(file, "user");
        await userApi.updateProfile({ avatarUrl: res.url });
        setAvatarUrl(res.url);
        onUserUpdate({ avatarUrl: res.url });
        updateStoredUser({ avatarUrl: res.url });
        notification.success(PROFILE_STRINGS.successAvatar);
      } catch {
        notification.error(PROFILE_STRINGS.errAvatar);
      } finally {
        setUploadingAvatar(false);
      }
      return false;
    },
  };

  return {
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
  };
};
