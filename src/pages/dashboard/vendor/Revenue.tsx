import { useQuery } from '@tanstack/react-query';
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { Ticket, TrendingUp, DollarSign, ShoppingBag } from 'lucide-react';
import { vendorApi } from '@/api/vendor';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { PageLoader } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { formatCurrency } from '@/utils/format';
import { usePageTitle } from '@/hooks/usePageTitle';

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  accepted: '#3b82f6',
  paid: '#10b981',
  rejected: '#f43f5e',
};

export default function Revenue() {
  usePageTitle('Revenue Overview');
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['vendor', 'revenue'],
    queryFn: vendorApi.revenue,
  });

  if (isLoading) return <PageLoader label="Crunching numbers…" />;
  if (isError)
    return (
      <ErrorState
        title="Couldn't load revenue data"
        description="There was a problem fetching your revenue overview. Please try again."
        onRetry={() => refetch()}
      />
    );
  if (!data) return <EmptyState title="No data available" />;

  const hasSales = data.perTicket.length > 0 || data.statusBreakdown.length > 0;

  return (
    <div>
      <PageHeader title="Revenue Overview" subtitle="Track your listings, sales and earnings at a glance." />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Tickets Added" value={data.totalTicketsAdded} icon={Ticket} tone="brand" />
        <StatCard label="Tickets Sold" value={data.totalTicketsSold} icon={ShoppingBag} tone="blue" />
        <StatCard label="Total Orders" value={data.totalOrders} icon={TrendingUp} tone="amber" />
        <StatCard label="Total Revenue" value={formatCurrency(data.totalRevenue)} icon={DollarSign} tone="emerald" />
      </div>

      {hasSales ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-5">
          <div className="card p-6 lg:col-span-3">
            <h3 className="mb-4 font-semibold">Revenue by Ticket</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.perTicket} margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                <XAxis dataKey="title" tick={{ fontSize: 11 }} tickFormatter={(v: string) => (v.length > 10 ? `${v.slice(0, 10)}…` : v)} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="revenue" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-6 lg:col-span-2">
            <h3 className="mb-4 font-semibold">Bookings by Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.statusBreakdown}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {data.statusBreakdown.map((entry) => (
                    <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState
            icon={<TrendingUp size={26} />}
            title="No sales data yet"
            description="Once travellers start booking and paying, your charts will appear here."
          />
        </div>
      )}
    </div>
  );
}
