import type { Role, TransportType, BookingStatus, TicketStatus } from '@/constants';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  isFraud: boolean;
  photoURL?: string;
  image?: string;
  phone?: string;
  createdAt?: string;
}

export interface Ticket {
  _id: string;
  title: string;
  from: string;
  to: string;
  transportType: TransportType;
  price: number;
  quantity: number;
  departureAt: string;
  perks: string[];
  image: string;
  vendorId: string;
  vendorName: string;
  vendorEmail: string;
  verificationStatus: TicketStatus;
  isAdvertised: boolean;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  ticketId: string;
  ticketTitle: string;
  ticketImage: string;
  from: string;
  to: string;
  transportType: string;
  unitPrice: number;
  departureAt: string;
  userId: string;
  userName: string;
  userEmail: string;
  vendorId: string;
  quantity: number;
  totalPrice: number;
  status: BookingStatus;
  paidAt?: string;
  createdAt: string;
}

export interface Transaction {
  _id: string;
  bookingId: string;
  ticketId: string;
  ticketTitle: string;
  userId: string;
  userEmail: string;
  amount: number;
  currency: string;
  quantity: number;
  stripePaymentIntentId: string;
  status: string;
  paidAt: string;
}

export interface RevenueOverview {
  totalTicketsAdded: number;
  totalTicketsSold: number;
  totalRevenue: number;
  totalOrders: number;
  statusBreakdown: { status: string; count: number }[];
  perTicket: { title: string; sold: number; revenue: number }[];
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: Meta;
}

export interface Paginated<T> {
  items: T[];
  meta: Meta;
}
