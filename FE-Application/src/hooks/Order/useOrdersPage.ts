import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { orderApi } from "../../api/orderApi";
import type { Order } from "../../api/orderApi";
import { notification } from "../../utils/notification";
import { ORDER_STRINGS } from "../../constants/Order/orders";

export const useOrdersPage = () => {
  const location = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        setLoading(false);
        return;
      }

      try {
        const data = await orderApi.getUserOrders();
        setOrders(data);
      } catch (error: unknown) {
        notification.error(
          error instanceof Error
            ? error.message
            : ORDER_STRINGS.errorFetch,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [location.key]);

  return {
    orders,
    loading,
  };
};
