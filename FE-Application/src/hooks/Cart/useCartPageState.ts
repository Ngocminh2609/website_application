import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "./useCart";
import { Form } from "antd";
import { cartApi } from "../../api/cartApi";
import { paymentApi } from "../../api/paymentApi";
import { couponApi } from "../../api/couponApi";
import { addressApi } from "../../api/addressApi";
import type { UserAddress } from "../../api/addressApi";
import type { User } from "../../types/auth";
import type { CouponValidateResponse } from "../../types/coupon-review";
import { CART_STRINGS } from "../../constants/Cart/cart-page";
import { notification } from "../../utils/notification";
import { calculateCartSubtotal, getFullAddressString } from "../../pages/Cart/helper";

interface ApiProvince {
  code: number;
  name: string;
}

interface ApiWard {
  code: number;
  name: string;
}

export const useCartPageState = () => {
  const { cart, loading, refreshCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [addressForm] = Form.useForm();

  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [provinces, setProvinces] = useState<ApiProvince[]>([]);
  const [wards, setWards] = useState<ApiWard[]>([]);
  const [wardsLoading, setWardsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"VNPAY" | "COD">("VNPAY");

  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] =
    useState<CouponValidateResponse | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    // Fetch danh sách tỉnh thành khi trang web load
    const fetchProvinces = async () => {
      try {
        const response = await fetch("https://provinces.open-api.vn/api/v2/p/");
        const data = await response.json();
        setProvinces(data);
      } catch (error: unknown) {
        console.error("Lỗi khi tải danh sách tỉnh thành:", error);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    refreshCart(true);
  }, [refreshCart, location.key]);

  const handleUpdateQuantity = async (itemId: number, quantity: number) => {
    try {
      await cartApi.updateQuantity(itemId, quantity);
      await refreshCart(true);
    } catch {
      notification.error(CART_STRINGS.messages.updateQtyError);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await cartApi.removeItem(itemId);
      await refreshCart(true);
      notification.success(CART_STRINGS.messages.removeSuccess);
    } catch {
      notification.error(CART_STRINGS.messages.removeError);
    }
  };

  const calculateTotal = () => {
    if (!cart) return 0;
    return calculateCartSubtotal(cart.items);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    const total = calculateTotal();
    if (total <= 0) return;
    try {
      setCouponLoading(true);
      setCouponError(null);
      const result = await couponApi.validate(couponCode.trim(), total);
      setCouponResult(result);
    } catch (err: unknown) {
      setCouponResult(null);
      setCouponError(
        err instanceof Error ? err.message : CART_STRINGS.messages.invalidCoupon,
      );
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponResult(null);
    setCouponCode("");
    setCouponError(null);
  };

  const fetchAddresses = async () => {
    try {
      setAddressLoading(true);
      const data = await addressApi.getAddresses();
      setAddresses(data);
      const defaultAddr = data.find((a) => a.isDefault);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      } else if (data.length > 0) {
        setSelectedAddressId(data[0].id);
      }
    } catch {
      notification.error(CART_STRINGS.messages.loadAddressError);
    } finally {
      setAddressLoading(false);
    }
  };

  const handlePaymentClick = () => {
    const amount = calculateTotal();
    if (amount <= 0) {
      notification.error(CART_STRINGS.messages.emptyCartError);
      return;
    }
    setIsModalVisible(true);
    fetchAddresses();
  };

  const handleAddAddress = async (
    values: Omit<UserAddress, "id" | "isDefault">,
  ) => {
    try {
      setCheckoutLoading(true);
      const newAddress = await addressApi.addAddress({
        ...values,
        isDefault: addresses.length === 0,
      });
      setAddresses([newAddress, ...addresses]);
      setSelectedAddressId(newAddress.id);
      setIsAddingAddress(false);
      addressForm.resetFields();
      setWards([]);
      notification.success(CART_STRINGS.messages.addAddressSuccess);
    } catch {
      notification.error(CART_STRINGS.messages.addAddressError);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleProvinceChange = async (
    provinceCode: number,
    option:
      | { label: string; value: string | number }
      | { label: string; value: string | number }[]
      | undefined,
  ) => {
    if (!option || Array.isArray(option)) return;
    try {
      setWardsLoading(true);
      const provinceName = (option as { label: string }).label;

      addressForm.setFieldsValue({
        province: provinceName,
        ward: undefined,
      });

      const response = await fetch(
        `https://provinces.open-api.vn/api/v2/p/${provinceCode}?depth=2`,
      );
      const data = await response.json();
      setWards(data.wards || []);
    } catch {
      notification.error(CART_STRINGS.messages.loadWardsError);
    } finally {
      setWardsLoading(false);
    }
  };

  const handleProvinceSearch = (val: string) => {
    if (!val) return;
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      if (addressForm.getFieldValue("province_code")) {
        addressForm.setFieldsValue({
          province: undefined,
          province_code: undefined,
          ward: undefined,
        });
        setWards([]);
      }
    }, 150);
  };

  const handleWardSearch = (val: string) => {
    if (!val) return;
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      if (addressForm.getFieldValue("ward")) {
        addressForm.setFieldsValue({ ward: undefined });
      }
    }, 150);
  };

  const handleConfirmPayment = async () => {
    if (!selectedAddressId) {
      notification.error(CART_STRINGS.messages.selectAddressError);
      return;
    }

    const selectedAddr = addresses.find((a) => a.id === selectedAddressId);
    if (!selectedAddr) return;

    const userStr = localStorage.getItem("user");
    if (!userStr) {
      notification.error(CART_STRINGS.messages.loginRequired);
      return;
    }
    const user = JSON.parse(userStr) as User;

    const fullAddressString = getFullAddressString(
      selectedAddr.detailAddress,
      selectedAddr.ward,
      selectedAddr.province,
    );

    try {
      setCheckoutLoading(true);
      const response = await paymentApi.createOrderPayment({
        username: user.username,
        address: fullAddressString,
        phone: selectedAddr.phoneNumber,
        couponCode: couponResult?.code,
        paymentMethod,
      });

      if (paymentMethod === "VNPAY" && response.url) {
        window.location.href = response.url;
      } else if (paymentMethod === "COD") {
        notification.success(CART_STRINGS.messages.codSuccess);
        navigate(`/payment-success?status=OK&method=COD&${response.url}`);
      }
    } catch (error: unknown) {
      notification.error(
        error instanceof Error ? error.message : CART_STRINGS.messages.initPaymentError,
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  return {
    cart,
    loading,
    isModalVisible,
    setIsModalVisible,
    checkoutLoading,
    addressForm,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    isAddingAddress,
    setIsAddingAddress,
    addressLoading,
    provinces,
    wards,
    wardsLoading,
    paymentMethod,
    setPaymentMethod,
    couponCode,
    setCouponCode,
    couponResult,
    couponLoading,
    couponError,
    setCouponError,
    handleUpdateQuantity,
    handleRemoveItem,
    calculateTotal,
    handleApplyCoupon,
    handleRemoveCoupon,
    handlePaymentClick,
    handleAddAddress,
    handleProvinceChange,
    handleProvinceSearch,
    handleWardSearch,
    handleConfirmPayment,
  };
};
