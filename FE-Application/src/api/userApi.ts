import { apiClient } from './apiClient';
import type { User } from '../types/auth';

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

export const userApi = {
    getProfile: () =>
        apiClient.fetch<User>('/users/me'),

    updateProfile: (data: UpdateProfilePayload) =>
        apiClient.fetch<User>('/users/me', {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    changePassword: (data: ChangePasswordPayload) =>
        apiClient.fetch<{ message: string }>('/users/me/password', {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    updateTheme: (theme: 'light' | 'dark') =>
        apiClient.fetch<{ message: string }>('/users/me/theme', {
            method: 'PUT',
            body: JSON.stringify({ theme }),
        }),
};
