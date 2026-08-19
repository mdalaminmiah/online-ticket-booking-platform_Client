import { Suspense, lazy, type ComponentType, type ReactElement } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { RoleRoute } from '@/routes/RoleRoute';
import { PageLoader } from '@/components/ui/Spinner';
import { ROLES } from '@/constants';

import Home from '@/pages/Home';
import AllTickets from '@/pages/AllTickets';
import RouteError from '@/pages/RouteError';

function lazyRoute(loader: () => Promise<{ default: ComponentType }>): ReactElement {
  const Loaded = lazy(loader);
  return (
    <Suspense fallback={<PageLoader />}>
      <Loaded />
    </Suspense>
  );
}

const ticketDetails = () => lazyRoute(() => import('@/pages/TicketDetails'));
const about = () => lazyRoute(() => import('@/pages/About'));
const contact = () => lazyRoute(() => import('@/pages/Contact'));
const login = () => lazyRoute(() => import('@/pages/Login'));
const register = () => lazyRoute(() => import('@/pages/Register'));
const authCallback = () => lazyRoute(() => import('@/pages/AuthCallback'));
const notFound = () => lazyRoute(() => import('@/pages/NotFound'));

const overview = () => lazyRoute(() => import('@/pages/dashboard/Overview'));
const profile = () => lazyRoute(() => import('@/pages/dashboard/Profile'));
const myBookedTickets = () => lazyRoute(() => import('@/pages/dashboard/user/MyBookedTickets'));
const transactionHistory = () => lazyRoute(() => import('@/pages/dashboard/user/TransactionHistory'));
const addTicket = () => lazyRoute(() => import('@/pages/dashboard/vendor/AddTicket'));
const myAddedTickets = () => lazyRoute(() => import('@/pages/dashboard/vendor/MyAddedTickets'));
const requestedBookings = () => lazyRoute(() => import('@/pages/dashboard/vendor/RequestedBookings'));
const revenue = () => lazyRoute(() => import('@/pages/dashboard/vendor/Revenue'));
const manageTickets = () => lazyRoute(() => import('@/pages/dashboard/admin/ManageTickets'));
const manageUsers = () => lazyRoute(() => import('@/pages/dashboard/admin/ManageUsers'));
const advertise = () => lazyRoute(() => import('@/pages/dashboard/admin/Advertise'));

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Home /> },
      { path: 'tickets', element: <AllTickets /> },
      { path: 'about', element: about() },
      { path: 'contact', element: contact() },
      {
        element: <ProtectedRoute />,
        children: [{ path: 'tickets/:id', element: ticketDetails() }],
      },
    ],
  },

  {
    element: <AuthLayout />,
    errorElement: <RouteError />,
    children: [
      { path: 'login', element: login() },
      { path: 'register', element: register() },
    ],
  },
  { path: 'auth/callback', element: authCallback(), errorElement: <RouteError /> },

  {
    element: <ProtectedRoute />,
    errorElement: <RouteError />,
    children: [
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
          { index: true, element: overview() },
          { path: 'profile', element: profile() },

          {
            element: <RoleRoute allow={[ROLES.USER]} />,
            children: [
              { path: 'bookings', element: myBookedTickets() },
              { path: 'transactions', element: transactionHistory() },
            ],
          },

          {
            element: <RoleRoute allow={[ROLES.VENDOR]} />,
            children: [
              { path: 'add-ticket', element: addTicket() },
              { path: 'my-tickets', element: myAddedTickets() },
              { path: 'requested-bookings', element: requestedBookings() },
              { path: 'revenue', element: revenue() },
            ],
          },

          {
            element: <RoleRoute allow={[ROLES.ADMIN]} />,
            children: [
              { path: 'manage-tickets', element: manageTickets() },
              { path: 'manage-users', element: manageUsers() },
              { path: 'advertise', element: advertise() },
            ],
          },
        ],
      },
    ],
  },

  { path: '*', element: notFound() },
]);
