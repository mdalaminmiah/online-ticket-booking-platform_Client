import { Link } from 'react-router-dom';
import { ArrowRight, Ticket, PlusCircle, Users, BarChart3, Receipt, ShieldCheck, Megaphone, ClipboardList } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ROLES } from '@/constants';
import { usePageTitle } from '@/hooks/usePageTitle';

const LINKS = {
  user: [
    { to: '/dashboard/bookings', label: 'My Booked Tickets', icon: Ticket, desc: 'Track and pay for your bookings' },
    { to: '/dashboard/transactions', label: 'Transaction History', icon: Receipt, desc: 'Review your past payments' },
    { to: '/tickets', label: 'Browse Tickets', icon: ArrowRight, desc: 'Find your next journey' },
  ],
  vendor: [
    { to: '/dashboard/add-ticket', label: 'Add Ticket', icon: PlusCircle, desc: 'List a new route for sale' },
    { to: '/dashboard/my-tickets', label: 'My Added Tickets', icon: Ticket, desc: 'Manage your listings' },
    { to: '/dashboard/requested-bookings', label: 'Requested Bookings', icon: ClipboardList, desc: 'Accept or reject requests' },
    { to: '/dashboard/revenue', label: 'Revenue Overview', icon: BarChart3, desc: 'Track sales and earnings' },
  ],
  admin: [
    { to: '/dashboard/manage-tickets', label: 'Manage Tickets', icon: ShieldCheck, desc: 'Approve or reject listings' },
    { to: '/dashboard/manage-users', label: 'Manage Users', icon: Users, desc: 'Roles and fraud control' },
    { to: '/dashboard/advertise', label: 'Advertise Tickets', icon: Megaphone, desc: 'Feature up to 6 tickets' },
  ],
};

export default function Overview() {
  usePageTitle('Dashboard');
  const { user } = useAuth();
  const role = (user?.role ?? ROLES.USER) as keyof typeof LINKS;
  const links = LINKS[role] ?? LINKS.user;

  return (
    <div>
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.15),transparent_40%)]" />
        <div className="relative">
          <p className="text-brand-200">Welcome back,</p>
          <h1 className="mt-1 text-3xl font-bold">{user?.name} 👋</h1>
          <p className="mt-2 max-w-lg text-brand-100 capitalize">
            You're signed in as {user?.role}. Here's a quick overview of what you can do.
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="card group flex items-start gap-4 p-5 hover:shadow-md">
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-900/40 dark:text-brand-300">
              <l.icon size={22} />
            </span>
            <div>
              <p className="font-semibold">{l.label}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{l.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
