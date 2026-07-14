import { api } from '@/lib/axios';
import type { ApiResponse, Meta, Ticket } from '@/types';

export interface TicketQuery {
  search?: string;
  transportType?: string;
  sort?: 'newest' | 'price_asc' | 'price_desc';
  page?: number;
  limit?: number;
}

export interface CreateTicketInput {
  title: string;
  from: string;
  to: string;
  transportType: string;
  price: number;
  quantity: number;
  departureAt: string;
  perks: string[];
  image: string;
}

export const ticketsApi = {
  async list(query: TicketQuery): Promise<{ items: Ticket[]; meta: Meta }> {
    const { data } = await api.get<ApiResponse<Ticket[]>>('/tickets', { params: query });
    return { items: data.data, meta: data.meta! };
  },
  async latest(): Promise<Ticket[]> {
    const { data } = await api.get<ApiResponse<Ticket[]>>('/tickets/latest');
    return data.data;
  },
  async advertised(): Promise<Ticket[]> {
    const { data } = await api.get<ApiResponse<Ticket[]>>('/tickets/advertised');
    return data.data;
  },
  async detail(id: string): Promise<Ticket> {
    const { data } = await api.get<ApiResponse<Ticket>>(`/tickets/${id}`);
    return data.data;
  },
  async mine(): Promise<Ticket[]> {
    const { data } = await api.get<ApiResponse<Ticket[]>>('/tickets/mine');
    return data.data;
  },
  async create(input: CreateTicketInput): Promise<Ticket> {
    const { data } = await api.post<ApiResponse<Ticket>>('/tickets', input);
    return data.data;
  },
  async update(id: string, input: Partial<CreateTicketInput>): Promise<Ticket> {
    const { data } = await api.patch<ApiResponse<Ticket>>(`/tickets/${id}`, input);
    return data.data;
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/tickets/${id}`);
  },
};
