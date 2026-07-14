import { useState, useEffect } from "react";
import { Form, Modal } from "antd";
import { couponApi, type Coupon } from "../../api/couponApi";
import { notification } from "../../utils/notification";
import type { Dayjs } from "dayjs";
import { VOUCHER_STRINGS } from "../../constants/Admin/voucher-management";

export interface VoucherFormValues extends Omit<Partial<Coupon>, "expiresAt"> {
  expiresAt?: Dayjs | null;
}

export const useVoucherManagementState = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm<VoucherFormValues>();

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await couponApi.getAll();
      setCoupons(data);
    } catch {
      notification.error(VOUCHER_STRINGS.messages.loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleStatusChange = async (id: number, active: boolean) => {
    try {
      await couponApi.updateStatus(id, active);
      notification.success(VOUCHER_STRINGS.messages.statusSuccess);
      fetchCoupons();
    } catch {
      notification.error(VOUCHER_STRINGS.messages.statusError);
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: VOUCHER_STRINGS.messages.deleteTitle,
      content: VOUCHER_STRINGS.messages.deleteContent,
      okType: "danger",
      onOk: async () => {
        try {
          await couponApi.delete(id);
          notification.success(VOUCHER_STRINGS.messages.deleteSuccess);
          fetchCoupons();
        } catch {
          notification.error(VOUCHER_STRINGS.messages.deleteError);
        }
      },
    });
  };

  const handleCreate = async (values: VoucherFormValues) => {
    try {
      setLoading(true);
      const payload: Partial<Coupon> = {
        ...values,
        isActive: true,
        expiresAt: values.expiresAt
          ? values.expiresAt.toISOString()
          : undefined,
      };
      await couponApi.create(payload);
      notification.success(VOUCHER_STRINGS.messages.createSuccess);
      setIsModalVisible(false);
      form.resetFields();
      fetchCoupons();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : VOUCHER_STRINGS.messages.createError;
      notification.error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    coupons,
    loading,
    isModalVisible,
    setIsModalVisible,
    form,
    handleStatusChange,
    handleDelete,
    handleCreate,
  };
};
