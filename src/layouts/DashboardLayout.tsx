import { useMemo, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Ticket,
  PlusCircle,
  ClipboardList,
  BarChart3,
  ShieldCheck,
  Users,
  Megaphone,
  Receipt,
  Home,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/layout/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Avatar } from '@/components/ui/Avatar';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { ROLES } from '@/constants';
import { cn } from '@/utils/cn';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const items = useMemo<NavItem[]>(() => {
    const common: NavItem[] = [
      { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
      { to: '/dashboard/profile', label: 'My Profile', icon: User },
    ];
    if (user?.role === ROLES.USER) {
      return [
        ...common,
        { to: '/dashboard/bookings', label: 'My Booked Tickets', icon: Ticket },
        { to: '/dashboard/transactions', label: 'Transaction History', icon: Receipt },
      ];
    }
    if (user?.role === ROLES.VENDOR) {
      return [
        ...common,
        { to: '/dashboard/add-ticket', label: 'Add Ticket', icon: PlusCircle },
        { to: '/dashboard/my-tickets', label: 'My Added Tickets', icon: Ticket },
        { to: '/dashboard/requested-bookings', label: 'Requested Bookings', icon: ClipboardList },
        { to: '/dashboard/revenue', label: 'Revenue Overview', icon: BarChart3 },
      ];
    }
    if (user?.role === ROLES.ADMIN) {
      return [
        ...common,
        { to: '/dashboard/manage-tickets', label: 'Manage Tickets', icon: ShieldCheck },
        { to: '/dashboard/manage-users', label: 'Manage Users', icon: Users },
        { to: '/dashboard/advertise', label: 'Advertise Tickets', icon: Megaphone },
      ];
    }
    return common;
  }, [user?.role]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
      isActive
        ? 'bg-brand-600 text-white shadow-sm'
        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
    );

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between px-5">
        <Logo onClick={() => setOpen(false)} />
        <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
          <X size={20} />
        </button>
      </div>

      <div className="mx-4 mb-4 flex items-center gap-3 rounded-xl bg-slate-100 p-3 dark:bg-slate-800/60">
        <Avatar name={user?.name ?? ''} src={user?.photoURL} size={40} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{user?.name}</p>
          <p className="truncate text-xs capitalize text-brand-600 dark:text-brand-300">{user?.role}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4">
        {items.map((it) => (
          <NavLink key={it.to} to={it.to} end={it.end} onClick={() => setOpen(false)} className={linkClass}>
            <it.icon size={18} /> {it.label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t border-slate-200 p-4 dark:border-slate-800">
        <NavLink to="/" className={linkClass}>
          <Home size={18} /> Back to Site
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:hover:bg-rose-900/30"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <ScrollToTop />

      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white lg:block dark:border-slate-800 dark:bg-slate-900">
        {sidebar}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-lg sm:px-6 dark:border-slate-800 dark:bg-slate-950/80">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 lg:hidden dark:border-slate-700"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <h1 className="hidden text-lg font-semibold sm:block">Dashboard</h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden items-center gap-2 sm:flex">
              <Avatar name={user?.name ?? ''} src={user?.photoURL} size={34} />
              <span className="text-sm font-semibold">{user?.name}</span>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
