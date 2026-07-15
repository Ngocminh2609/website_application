import { apiClient } from "./apiClient";
import type { User } from "../types/auth";
import type {
  UpdateProfilePayload,
  ChangePasswordPayload,
} from "../types/user";

export type { UpdateProfilePayload, ChangePasswordPayload } from "../types/user";

const BASE_PATH = "/users/me";

export const userApi = {
  getProfile: (): Promise<User> => apiClient.fetch<User>(BASE_PATH),

  updateProfile: (data: UpdateProfilePayload): Promise<User> =>
    apiClient.fetch<User>(BASE_PATH, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  changePassword: (data: ChangePasswordPayload): Promise<{ message: string }> =>
    apiClient.fetch<{ message: string }>(`${BASE_PATH}/password`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  updateTheme: (theme: "light" | "dark"): Promise<{ message: string }> =>
    apiClient.fetch<{ message: string }>(`${BASE_PATH}/theme`, {
      method: "PUT",
      body: JSON.stringify({ theme }),
    }),
};
