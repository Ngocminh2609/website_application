import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { orderApi } from "../../api/orderApi";
import type { Order } from "../../types/order";
import { notification } from "../../utils/notification";
import { ORDER_STRINGS } from "../../constants/Order/orders";
import { getAuthUser } from "../../utils/auth";
import { getErrorMessage } from "../../utils/error";

export const useOrdersPage = () => {
  const location = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!getAuthUser()) {
        setLoading(false);
        return;
      }

      try {
        const data = await orderApi.getUserOrders();
        setOrders(data);
      } catch (error: unknown) {
        notification.error(getErrorMessage(error, ORDER_STRINGS.errorFetch));
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
