import { api } from '@/lib/axios';
import type { ApiResponse, Booking } from '@/types';

export const bookingsApi = {
  async create(input: { ticketId: string; quantity: number }): Promise<Booking> {
    const { data } = await api.post<ApiResponse<Booking>>('/bookings', input);
    return data.data;
  },
  async mine(): Promise<Booking[]> {
    const { data } = await api.get<ApiResponse<Booking[]>>('/bookings/mine');
    return data.data;
  },
  async requested(): Promise<Booking[]> {
    const { data } = await api.get<ApiResponse<Booking[]>>('/bookings/requested');
    return data.data;
  },
  async accept(id: string): Promise<Booking> {
    const { data } = await api.patch<ApiResponse<Booking>>(`/bookings/${id}/accept`);
    return data.data;
  },
  async reject(id: string): Promise<Booking> {
    const { data } = await api.patch<ApiResponse<Booking>>(`/bookings/${id}/reject`);
    return data.data;
  },
};
