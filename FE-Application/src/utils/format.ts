/**
 * Định dạng số tiền VND.
 * @param hasSpace true → "1.000 đ", false → "1.000đ"
 */
export const formatVnd = (
  amount: number,
  hasSpace: boolean = true,
): string => {
  const formatted = amount.toLocaleString("vi-VN");
  return hasSpace ? `${formatted} đ` : `${formatted}đ`;
};

/**
 * Định dạng số tiền từ VNPay (đơn vị ×100) sang VND hiển thị.
 */
export const formatVnpayAmount = (value: string | null): string => {
  if (!value) return formatVnd(0, false);
  const num = parseInt(value, 10) / 100;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);
};

/**
 * Định dạng ngày giờ theo locale vi-VN.
 */
export const formatDateTimeVi = (date: string | Date | number): string => {
  return new Date(date).toLocaleString("vi-VN");
};
