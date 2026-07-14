import { useState, useEffect } from "react";
import { Form, Modal } from "antd";
import type { UploadFile } from "antd";
import { bannerApi } from "../../api/bannerApi";
import { fileApi } from "../../api/fileApi";
import type { Banner } from "../../types/banner";
import { notification } from "../../utils/notification";
import { BANNER_STRINGS } from "../../constants/Admin/banner-management";

export const useBannerManagementState = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm<Partial<Banner>>();

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const data = await bannerApi.getAll();
      setBanners(data);
    } catch {
      notification.error(BANNER_STRINGS.messages.loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleCreateOrUpdate = async (values: Partial<Banner>) => {
    try {
      setLoading(true);
      let imageUrl = values.imageUrl || "";

      if (fileList.length > 0 && fileList[0].originFileObj) {
        const uploadRes = await fileApi.uploadImage(
          fileList[0].originFileObj as File,
          "banner",
        );
        imageUrl = uploadRes.url;
      }

      if (!imageUrl) {
        notification.error(BANNER_STRINGS.messages.imageRequired);
        setLoading(false);
        return;
      }

      const payload = {
        ...values,
        imageUrl,
      };

      if (editingId) {
        await bannerApi.update(editingId, payload);
        notification.success(BANNER_STRINGS.messages.updateSuccess);
      } else {
        await bannerApi.create(payload);
        notification.success(BANNER_STRINGS.messages.createSuccess);
      }

      setIsModalVisible(false);
      setEditingId(null);
      form.resetFields();
      setFileList([]);
      fetchBanners();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : BANNER_STRINGS.messages.opError;
      notification.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingId(banner.id);
    form.setFieldsValue({
      title: banner.title,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl,
      sortOrder: banner.sortOrder,
      isActive: banner.isActive,
    });
    setFileList([]);
    setIsModalVisible(true);
  };

  const handleStatusChange = async (
    id: number,
    banner: Banner,
    active: boolean,
  ) => {
    try {
      await bannerApi.update(id, { ...banner, isActive: active });
      notification.success(BANNER_STRINGS.messages.statusSuccess);
      fetchBanners();
    } catch {
      notification.error(BANNER_STRINGS.messages.statusError);
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: BANNER_STRINGS.messages.deleteTitle,
      content: BANNER_STRINGS.messages.deleteContent,
      okType: "danger",
      onOk: async () => {
        try {
          await bannerApi.delete(id);
          notification.success(BANNER_STRINGS.messages.deleteSuccess);
          fetchBanners();
        } catch {
          notification.error(BANNER_STRINGS.messages.deleteError);
        }
      },
    });
  };

  const handleAddNew = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({ sortOrder: 0, isActive: true });
    setFileList([]);
    setIsModalVisible(true);
  };

  return {
    banners,
    loading,
    isModalVisible,
    setIsModalVisible,
    editingId,
    fileList,
    setFileList,
    form,
    handleCreateOrUpdate,
    handleEdit,
    handleStatusChange,
    handleDelete,
    handleAddNew,
  };
};
