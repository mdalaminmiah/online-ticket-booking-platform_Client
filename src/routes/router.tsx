import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { RoleRoute } from '@/routes/RoleRoute';
import { ROLES } from '@/constants';

import Home from '@/pages/Home';
import AllTickets from '@/pages/AllTickets';
import TicketDetails from '@/pages/TicketDetails';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import AuthCallback from '@/pages/AuthCallback';
import NotFound from '@/pages/NotFound';
import RouteError from '@/pages/RouteError';

import Overview from '@/pages/dashboard/Overview';
import Profile from '@/pages/dashboard/Profile';
import MyBookedTickets from '@/pages/dashboard/user/MyBookedTickets';
import TransactionHistory from '@/pages/dashboard/user/TransactionHistory';
import AddTicket from '@/pages/dashboard/vendor/AddTicket';
import MyAddedTickets from '@/pages/dashboard/vendor/MyAddedTickets';
import RequestedBookings from '@/pages/dashboard/vendor/RequestedBookings';
import Revenue from '@/pages/dashboard/vendor/Revenue';
import ManageTickets from '@/pages/dashboard/admin/ManageTickets';
import ManageUsers from '@/pages/dashboard/admin/ManageUsers';
import Advertise from '@/pages/dashboard/admin/Advertise';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Home /> },
      { path: 'tickets', element: <AllTickets /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      {
        element: <ProtectedRoute />,
        children: [{ path: 'tickets/:id', element: <TicketDetails /> }],
      },
    ],
  },

  {
    element: <AuthLayout />,
    errorElement: <RouteError />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
  { path: 'auth/callback', element: <AuthCallback />, errorElement: <RouteError /> },

  {
    element: <ProtectedRoute />,
    errorElement: <RouteError />,
    children: [
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Overview /> },
          { path: 'profile', element: <Profile /> },

          {
            element: <RoleRoute allow={[ROLES.USER]} />,
            children: [
              { path: 'bookings', element: <MyBookedTickets /> },
              { path: 'transactions', element: <TransactionHistory /> },
            ],
          },

          {
            element: <RoleRoute allow={[ROLES.VENDOR]} />,
            children: [
              { path: 'add-ticket', element: <AddTicket /> },
              { path: 'my-tickets', element: <MyAddedTickets /> },
              { path: 'requested-bookings', element: <RequestedBookings /> },
              { path: 'revenue', element: <Revenue /> },
            ],
          },

          {
            element: <RoleRoute allow={[ROLES.ADMIN]} />,
            children: [
              { path: 'manage-tickets', element: <ManageTickets /> },
              { path: 'manage-users', element: <ManageUsers /> },
              { path: 'advertise', element: <Advertise /> },
            ],
          },
        ],
      },
    ],
  },

  { path: '*', element: <NotFound /> },
]);
