import api from '@/lib/axios';
import { BackendResponse } from '@/types/components/common';
import { UserInfo } from '@/types/user';

export const userService = {
  getUserInfo: async (id: string): Promise<UserInfo> => {
    const { data } = await api.get<BackendResponse<UserInfo>>(`/api/v1/users/${id}`);
    return data.data;
  },

  updateUser: async (id: string, userData: Partial<UserInfo>): Promise<UserInfo> => {
    const { data } = await api.post<BackendResponse<UserInfo>>(`/api/v1/users/${id}`, userData);
    return data.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/users/${id}`);
  }
};