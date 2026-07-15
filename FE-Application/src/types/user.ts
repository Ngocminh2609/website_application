export interface UpdateProfilePayload {
  fullName?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
