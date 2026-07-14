import { api } from '@/lib/axios';
import type { ApiResponse, AppUser } from '@/types';

export const meApi = {
  async get(): Promise<AppUser> {
    const { data } = await api.get<ApiResponse<AppUser>>('/me');
    return data.data;
  },
  async update(input: { name?: string; phone?: string; photoURL?: string }): Promise<AppUser> {
    const { data } = await api.patch<ApiResponse<AppUser>>('/me', input);
    return data.data;
  },
};
