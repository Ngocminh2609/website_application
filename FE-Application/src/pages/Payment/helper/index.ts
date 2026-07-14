export const formatCurrency = (value: string | null) => {
  if (!value) return "0đ";
  const num = parseInt(value) / 100;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);
};
