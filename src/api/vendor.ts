import { api } from '@/lib/axios';
import type { ApiResponse, RevenueOverview } from '@/types';

export const vendorApi = {
  async revenue(): Promise<RevenueOverview> {
    const { data } = await api.get<ApiResponse<RevenueOverview>>('/vendor/revenue');
    return data.data;
  },
};
