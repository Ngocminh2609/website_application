export interface UserAddress {
  id: number;
  fullName: string;
  phoneNumber: string;
  province: string;
  ward: string;
  detailAddress: string;
  isDefault: boolean;
}

export type CreateAddressPayload = Omit<UserAddress, "id">;
export type UpdateAddressPayload = Partial<UserAddress>;
