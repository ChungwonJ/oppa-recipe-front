import api from '@/lib/api';
import { BackendResponse } from '@/types/components/common';
import { UserInfo } from '@/types/user';

export const userService = {
  getMyInfo: async (): Promise<UserInfo> => {
    const { data } = await api.get<BackendResponse<UserInfo>>('/api/v1/users/my');
    return data.data;
  },

  updateMyInfo: async (userData: Partial<UserInfo>): Promise<UserInfo> => {
    const { data } = await api.post<BackendResponse<UserInfo>>('/api/v1/users/my', userData);
    return data.data;
  },

  deleteMe: async (): Promise<void> => {
    await api.delete('/api/v1/users/my');
  }
};