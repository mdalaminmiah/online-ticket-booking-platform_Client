import { useState } from 'react';
import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { Search, ShieldPlus, Store, Ban, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi } from '@/api/admin';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Pagination } from '@/components/ui/Pagination';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/lib/axios';
import { ROLES } from '@/constants';
import type { AppUser } from '@/types';
import { usePageTitle } from '@/hooks/usePageTitle';

const ROLE_TONE: Record<string, 'brand' | 'accent' | 'neutral'> = {
  admin: 'brand',
  vendor: 'accent',
  user: 'neutral',
};

export default function ManageUsers() {
  usePageTitle('Manage Users');
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [fraudTarget, setFraudTarget] = useState<AppUser | null>(null);
  const debounced = useDebounce(search, 400);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', 'users', { debounced, page }],
    queryFn: () => adminApi.listUsers({ search: debounced || undefined, page, limit: 10 }),
    placeholderData: keepPreviousData,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: 'admin' | 'vendor' | 'user' }) => adminApi.updateRole(id, role),
    onSuccess: () => {
      invalidate();
      toast.success('Role updated');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const fraudMutation = useMutation({
    mutationFn: ({ id, isFraud }: { id: string; isFraud: boolean }) => adminApi.setFraud(id, isFraud),
    onSuccess: () => {
      invalidate();
      toast.success('Vendor fraud status updated');
      setFraudTarget(null);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const columns: Column<AppUser>[] = [
    {
      key: 'name',
      header: 'User',
      render: (u) => (
        <div className="flex items-center gap-3">
          <Avatar name={u.name} src={u.photoURL} size={36} />
          <div>
            <p className="font-medium">{u.name}</p>
            <p className="text-xs text-slate-400">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      align: 'center',
      render: (u) => (
        <div className="flex items-center justify-center gap-1.5">
          <Badge tone={ROLE_TONE[u.role]} className="capitalize">{u.role}</Badge>
          {u.isFraud && <Badge tone="rose">Fraud</Badge>}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (u) => {
        const isSelf = u.id === currentUser?.id;
        return (
          <div className="flex flex-wrap justify-end gap-2">
            {u.role !== ROLES.ADMIN && (
              <button
                className="btn-outline btn-sm"
                disabled={roleMutation.isPending && roleMutation.variables?.id === u.id}
                onClick={() => roleMutation.mutate({ id: u.id, role: 'admin' })}
              >
                <ShieldPlus size={14} /> Make Admin
              </button>
            )}
            {u.role !== ROLES.VENDOR && (
              <button
                className="btn-outline btn-sm"
                disabled={(roleMutation.isPending && roleMutation.variables?.id === u.id) || isSelf}
                onClick={() => roleMutation.mutate({ id: u.id, role: 'vendor' })}
              >
                <Store size={14} /> Make Vendor
              </button>
            )}
            {u.role === ROLES.VENDOR && (
              <button
                className={u.isFraud ? 'btn-outline btn-sm' : 'btn-danger btn-sm'}
                disabled={fraudMutation.isPending}
                onClick={() => setFraudTarget(u)}
              >
                <Ban size={14} /> {u.isFraud ? 'Unmark Fraud' : 'Mark Fraud'}
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Manage Users"
        subtitle="Assign roles and control fraudulent vendors."
        action={
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search users…"
              className="input w-56 pl-9"
            />
          </div>
        }
      />

      {isLoading ? (
        <div className="card p-6">
          <TableSkeleton rows={6} cols={3} />
        </div>
      ) : isError ? (
        <ErrorState
          title="Couldn't load users"
          description="There was a problem fetching users. Please try again."
          onRetry={() => refetch()}
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={data?.items ?? []}
            keyField={(u) => u.id}
            empty={<EmptyState icon={<Users size={26} />} title="No users found" description="Try a different search." />}
          />
          <div className="mt-6">
            <Pagination page={page} totalPages={data?.meta.totalPages ?? 1} onChange={setPage} />
          </div>
        </>
      )}

      <ConfirmDialog
        open={Boolean(fraudTarget)}
        title={fraudTarget?.isFraud ? 'Clear fraud flag?' : 'Mark vendor as fraud?'}
        message={
          fraudTarget?.isFraud
            ? `Restore "${fraudTarget?.name}"? Their tickets will become visible again.`
            : `Marking "${fraudTarget?.name}" as fraud hides all their tickets and blocks them from adding new ones.`
        }
        confirmLabel={fraudTarget?.isFraud ? 'Restore Vendor' : 'Mark as Fraud'}
        tone={fraudTarget?.isFraud ? 'primary' : 'danger'}
        loading={fraudMutation.isPending}
        onConfirm={() => fraudTarget && fraudMutation.mutate({ id: fraudTarget.id, isFraud: !fraudTarget.isFraud })}
        onCancel={() => setFraudTarget(null)}
      />
    </div>
  );
}
