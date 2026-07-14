import { api } from '@/lib/axios';
import type { ApiResponse, Transaction } from '@/types';

export interface PaymentIntentResult {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

export const paymentsApi = {
  async createIntent(bookingId: string): Promise<PaymentIntentResult> {
    const { data } = await api.post<ApiResponse<PaymentIntentResult>>('/payments/create-intent', {
      bookingId,
    });
    return data.data;
  },
  async confirm(input: { bookingId: string; paymentIntentId: string }): Promise<Transaction> {
    const { data } = await api.post<ApiResponse<Transaction>>('/payments/confirm', input);
    return data.data;
  },
  async mine(): Promise<Transaction[]> {
    const { data } = await api.get<ApiResponse<Transaction[]>>('/payments/mine');
    return data.data;
  },
};
