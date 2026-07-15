export interface OrderItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
  };
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  shippingAddress: string;
  phoneNumber: string;
  orderDate: string;
  items: OrderItem[];
}
