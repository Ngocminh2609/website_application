import { useState, useEffect } from "react";
import { Form, Modal } from "antd";
import type { UploadFile } from "antd";
import { useLocation } from "react-router-dom";
import { useAdminChat } from "../../context/useAdminChat";
import { productApi } from "../../api/productApi";
import { categoryApi } from "../../api/categoryApi";
import { fileApi } from "../../api/fileApi";
import { orderApi, type Order } from "../../api/orderApi";
import type { Product, ProductRequest } from "../../types/product";
import type { Category } from "../../types/category";
import { notification } from "../../utils/notification";
import { ADMIN_STRINGS } from "../../constants/Admin/admin-dashboard";

export const useAdminDashboardState = () => {
  const { totalUnread } = useAdminChat();
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm<ProductRequest>();
  const [activeTab, setActiveTab] = useState<string>("products");

  const watchOriginalPrice = Form.useWatch("originalPrice", form);
  const watchDiscountPercent = Form.useWatch("discountPercent", form);
  const [livePrice, setLivePrice] = useState<number>(0);

  useEffect(() => {
    const price = watchOriginalPrice || 0;
    const percent = watchDiscountPercent || 0;
    setLivePrice(Math.round((price * (100 - percent)) / 100));
  }, [watchOriginalPrice, watchDiscountPercent]);

  const loadCoreData = async () => {
    setLoading(true);
    try {
      const [productData, categoryData, orderData] = await Promise.all([
        productApi.getAllAdmin(),
        categoryApi.getAllCategories(),
        orderApi.getAllOrders(),
      ]);
      setProducts(productData);
      setCategories(categoryData);
      setOrders(orderData);
    } catch (error) {
      console.error("Lỗi tải dữ liệu quản trị:", error);
      notification.error(ADMIN_STRINGS.error.loadDataError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoreData();
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setActiveTab(hash);
    }
  }, [location.pathname, location.search, activeTab]);

  const handleAddProduct = () => {
    setEditingId(null);
    form.resetFields();
    setFileList([]);
    setIsModalVisible(true);
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    form.setFieldsValue({
      name: product.name,
      originalPrice: product.originalPrice || product.price,
      discountPercent: product.discountPercent || 0,
      stockQuantity: product.stockQuantity,
      categoryId: product.category?.id || 0,
      imageUrl: product.imageUrl,
      description: product.description,
      brand: product.brand,
      isBestSeller: product.isBestSeller,
      specifications: product.specifications,
      moreImages: product.moreImages,
      isActive: product.isActive !== false,
    });
    setFileList([]);
    setIsModalVisible(true);
  };

  const onFinish = async (values: ProductRequest) => {
    try {
      setLoading(true);
      let imageUrl = values.imageUrl;

      if (fileList.length > 0 && fileList[0].originFileObj) {
        const uploadRes = await fileApi.uploadImage(
          fileList[0].originFileObj as File,
          "product",
        );
        imageUrl = uploadRes.url;
      }

      if (editingId) {
        await productApi.updateProduct(editingId, { ...values, imageUrl });
        notification.success(ADMIN_STRINGS.messages.updateProductSuccess);
      } else {
        await productApi.createProduct({ ...values, imageUrl });
        notification.success(ADMIN_STRINGS.messages.createProductSuccess);
      }

      setIsModalVisible(false);
      const productData = await productApi.getAllAdmin();
      setProducts(productData);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : ADMIN_STRINGS.error.genericError;
      notification.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: ADMIN_STRINGS.messages.confirmDeleteProductTitle,
      content: ADMIN_STRINGS.messages.confirmDeleteProductContent,
      onOk: async () => {
        try {
          await productApi.deleteProduct(id);
          notification.success(ADMIN_STRINGS.messages.deleteProductSuccess);
          const productData = await productApi.getAllAdmin();
          setProducts(productData);
        } catch {
          notification.error(ADMIN_STRINGS.error.deleteProductError);
        }
      },
    });
  };

  const handleStatusUpdate = async (
    orderId: number,
    status: string,
    message: string,
  ) => {
    try {
      setLoading(true);
      await orderApi.updateOrderStatus(orderId, status);
      notification.success(message);
      const orderData = await orderApi.getAllOrders();
      setOrders(orderData);
    } catch (error: unknown) {
      notification.error(
        error instanceof Error ? error.message : ADMIN_STRINGS.error.updateOrderError,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    Modal.confirm({
      title: ADMIN_STRINGS.messages.confirmDeleteOrderTitle,
      content: ADMIN_STRINGS.messages.confirmDeleteOrderContent,
      okType: "danger",
      onOk: async () => {
        try {
          setLoading(true);
          await orderApi.deleteOrder(orderId);
          notification.success(ADMIN_STRINGS.messages.deleteOrderSuccess);
          const orderData = await orderApi.getAllOrders();
          setOrders(orderData);
        } catch (error: unknown) {
          notification.error(
            error instanceof Error ? error.message : ADMIN_STRINGS.error.deleteOrderError,
          );
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return {
    totalUnread,
    products,
    categories,
    orders,
    loading,
    isModalVisible,
    setIsModalVisible,
    editingId,
    fileList,
    setFileList,
    form,
    activeTab,
    setActiveTab,
    livePrice,
    handleAddProduct,
    handleEdit,
    onFinish,
    handleDelete,
    handleStatusUpdate,
    handleDeleteOrder,
  };
};
