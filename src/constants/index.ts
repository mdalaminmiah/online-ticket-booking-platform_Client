export const APP_NAME = 'TicketBari';
export const APP_TAGLINE = 'Book bus, train, launch & flight tickets easily';

export const ROLES = {
  USER: 'user',
  VENDOR: 'vendor',
  ADMIN: 'admin',
} as const;
export type Role = (typeof ROLES)[keyof typeof ROLES];

export const TRANSPORT_TYPES = ['Bus', 'Train', 'Launch', 'Plane'] as const;
export type TransportType = (typeof TRANSPORT_TYPES)[number];

export const PERK_OPTIONS = [
  'AC',
  'WiFi',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snacks',
  'Water',
  'Blanket',
  'Cabin',
  'Priority Boarding',
  'Charging Port',
  'Entertainment',
] as const;

export const BOOKING_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  PAID: 'paid',
} as const;
export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

export const TICKET_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;
export type TicketStatus = (typeof TICKET_STATUS)[keyof typeof TICKET_STATUS];

export const PAGE_SIZE = 9;
export const MAX_ADVERTISED = 6;

export const CONTACT = {
  email: 'support@ticketbari.com',
  phone: '+880 1700-000000',
  facebook: 'https://facebook.com/ticketbari',
  x: 'https://x.com/ticketbari',
};
