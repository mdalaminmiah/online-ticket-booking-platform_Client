import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Mail, Phone, ShieldCheck, Calendar, Upload } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { meApi } from '@/api/me';
import { uploadImage } from '@/api/upload';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Avatar } from '@/components/ui/Avatar';
import { Spinner } from '@/components/ui/Spinner';
import { getErrorMessage } from '@/lib/axios';
import { formatDate } from '@/utils/format';
import { usePageTitle } from '@/hooks/usePageTitle';

const schema = z.object({
  name: z.string().min(2, 'Name is too short'),
  phone: z.string().max(30).optional(),
});
type FormValues = z.infer<typeof schema>;

export default function Profile() {
  usePageTitle('My Profile');
  const { user, refreshUser } = useAuth();
  const [photoURL, setPhotoURL] = useState(user?.photoURL ?? '');
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name ?? '', phone: user?.phone ?? '' },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => meApi.update({ ...values, photoURL: photoURL || undefined }),
    onSuccess: async () => {
      await refreshUser();
      toast.success('Profile updated');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const handlePhoto = async (file?: File) => {
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadImage(file);
      setPhotoURL(url);
      toast.success('Photo uploaded — save to apply');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Image upload failed'));
    } finally {
      setUploading(false);
    }
  };

  if (!user) return null;

  return (
    <div>
      <PageHeader title="My Profile" subtitle="View and manage your account information." />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 text-center lg:col-span-1">
          <div className="relative mx-auto w-fit">
            <Avatar name={user.name} src={photoURL || user.photoURL} size={96} className="text-3xl" />
            <label className="absolute -bottom-1 -right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-brand-600 text-white shadow-md hover:bg-brand-700">
              {uploading ? <Spinner size={16} className="text-white" /> : <Upload size={16} />}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhoto(e.target.files?.[0])} />
            </label>
          </div>
          <h2 className="mt-4 text-xl font-bold">{user.name}</h2>
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold capitalize text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
            <ShieldCheck size={14} /> {user.role}
          </span>

          <dl className="mt-6 space-y-3 text-left text-sm">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Mail size={15} /> <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Phone size={15} /> {user.phone || 'Not provided'}
            </div>
            {user.createdAt && (
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Calendar size={15} /> Joined {formatDate(user.createdAt)}
              </div>
            )}
          </dl>
        </div>

        <div className="card p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold">Edit Information</h3>
          <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="mt-5 space-y-4">
            <div>
              <label className="label" htmlFor="name">Full Name</label>
              <input id="name" className="input" {...register('name')} />
              {errors.name && <p className="mt-1 text-sm text-rose-600">{errors.name.message}</p>}
            </div>
            <div>
              <label className="label" htmlFor="phone">Phone</label>
              <input id="phone" className="input" placeholder="+880 1XXX-XXXXXX" {...register('phone')} />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input cursor-not-allowed opacity-60" value={user.email} readOnly />
              <p className="mt-1 text-xs text-slate-400">Email cannot be changed.</p>
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={mutation.isPending || (!isDirty && photoURL === (user.photoURL ?? ''))}
            >
              {mutation.isPending && <Spinner size={16} className="text-white" />}
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
