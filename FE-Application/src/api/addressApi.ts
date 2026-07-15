import { apiClient } from "./apiClient";
import type {
  UserAddress,
  CreateAddressPayload,
  UpdateAddressPayload,
} from "../types/address";

export type {
  UserAddress,
  CreateAddressPayload,
  UpdateAddressPayload,
} from "../types/address";

const BASE_PATH = "/addresses";

const withJsonBody = <T>(data: T): RequestInit => ({
  body: JSON.stringify(data),
});

export const addressApi = {
  getAddresses: (): Promise<UserAddress[]> =>
    apiClient.fetch<UserAddress[]>(BASE_PATH),

  addAddress: (address: CreateAddressPayload): Promise<UserAddress> =>
    apiClient.fetch<UserAddress>(BASE_PATH, {
      method: "POST",
      ...withJsonBody(address),
    }),

  updateAddress: (
    id: number,
    address: UpdateAddressPayload,
  ): Promise<UserAddress> =>
    apiClient.fetch<UserAddress>(`${BASE_PATH}/${id}`, {
      method: "PUT",
      ...withJsonBody(address),
    }),

  deleteAddress: (id: number): Promise<void> =>
    apiClient.fetch<void>(`${BASE_PATH}/${id}`, { method: "DELETE" }),

  setDefault: (id: number): Promise<void> =>
    apiClient.fetch<void>(`${BASE_PATH}/${id}/default`, { method: "PATCH" }),
};
