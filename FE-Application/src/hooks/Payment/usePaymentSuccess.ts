import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { paymentApi } from "../../api/paymentApi";
import { useCart } from "../Cart/useCart";

export const usePaymentSuccess = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading",
  );
  const { refreshCart } = useCart();

  // Lấy thông tin đơn hàng (hỗ trợ cả VNPay và COD)
  const txnRef = searchParams.get("vnp_TxnRef") || searchParams.get("ORDER_ID");
  const amount = searchParams.get("vnp_Amount") || searchParams.get("AMOUNT");

  useEffect(() => {
    const verify = async () => {
      // Nếu là COD hoặc đã có tham số báo thành công trực tiếp
      if (searchParams.get("status") === "OK") {
        setStatus("success");
        await refreshCart(true);
        return;
      }

      try {
        // Backend sẽ xác thực chữ ký VNPay
        const response = await paymentApi.verifyPayment(location.search);
        if (response.status === "OK") {
          setStatus("success");
          await refreshCart(true);
        } else {
          setStatus("failed");
        }
      } catch {
        setStatus("failed");
      }
    };

    verify();
  }, [location.search, refreshCart, searchParams]);

  return {
    status,
    txnRef,
    amount,
  };
};
