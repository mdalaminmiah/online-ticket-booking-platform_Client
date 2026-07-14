import { api } from '@/lib/axios';
import type { ApiResponse, AppUser, Meta, Ticket } from '@/types';
import type { Role } from '@/constants';

export const adminApi = {
  async listUsers(params: {
    search?: string;
    role?: Role;
    page?: number;
    limit?: number;
  }): Promise<{ items: AppUser[]; meta: Meta }> {
    const { data } = await api.get<ApiResponse<AppUser[]>>('/admin/users', { params });
    return { items: data.data, meta: data.meta! };
  },
  async updateRole(id: string, role: Role): Promise<AppUser> {
    const { data } = await api.patch<ApiResponse<AppUser>>(`/admin/users/${id}/role`, { role });
    return data.data;
  },
  async setFraud(id: string, isFraud: boolean): Promise<AppUser> {
    const { data } = await api.patch<ApiResponse<AppUser>>(`/admin/users/${id}/fraud`, { isFraud });
    return data.data;
  },
  async listTickets(params: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: Ticket[]; meta: Meta }> {
    const { data } = await api.get<ApiResponse<Ticket[]>>('/admin/tickets', { params });
    return { items: data.data, meta: data.meta! };
  },
  async approveTicket(id: string): Promise<Ticket> {
    const { data } = await api.patch<ApiResponse<Ticket>>(`/admin/tickets/${id}/approve`);
    return data.data;
  },
  async rejectTicket(id: string): Promise<Ticket> {
    const { data } = await api.patch<ApiResponse<Ticket>>(`/admin/tickets/${id}/reject`);
    return data.data;
  },
  async advertiseList(): Promise<Ticket[]> {
    const { data } = await api.get<ApiResponse<Ticket[]>>('/admin/tickets/advertise/list');
    return data.data;
  },
  async toggleAdvertise(id: string, isAdvertised: boolean): Promise<Ticket> {
    const { data } = await api.patch<ApiResponse<Ticket>>(`/admin/tickets/${id}/advertise`, {
      isAdvertised,
    });
    return data.data;
  },
};
