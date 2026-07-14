import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ImagePlus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadImage } from '@/api/upload';
import { getErrorMessage } from '@/lib/axios';
import { Spinner } from '@/components/ui/Spinner';
import { PERK_OPTIONS, TRANSPORT_TYPES } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import type { CreateTicketInput } from '@/api/tickets';

const schema = z.object({
  title: z.string().min(3, 'Title is too short'),
  from: z.string().min(1, 'Required'),
  to: z.string().min(1, 'Required'),
  transportType: z.enum(TRANSPORT_TYPES),
  price: z.coerce.number().min(0, 'Must be 0 or more'),
  quantity: z.coerce.number().int().min(0, 'Must be 0 or more'),
  departureAt: z.string().min(1, 'Required'),
  perks: z.array(z.string()).default([]),
  image: z.string().url('Please upload an image'),
});
export type TicketFormValues = z.infer<typeof schema>;
function toLocalInput(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
}

export function TicketForm({
  defaultValues,
  onSubmit,
  submitting,
  submitLabel = 'Add Ticket',
}: {
  defaultValues?: Partial<CreateTicketInput>;
  onSubmit: (values: CreateTicketInput) => void;
  submitting: boolean;
  submitLabel?: string;
}) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(defaultValues?.image ?? '');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TicketFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      from: defaultValues?.from ?? '',
      to: defaultValues?.to ?? '',
      transportType: (defaultValues?.transportType as TicketFormValues['transportType']) ?? 'Bus',
      price: defaultValues?.price ?? 0,
      quantity: defaultValues?.quantity ?? 0,
      departureAt: toLocalInput(defaultValues?.departureAt),
      perks: defaultValues?.perks ?? [],
      image: defaultValues?.image ?? '',
    },
  });

  const selectedPerks = watch('perks');

  const handleImage = async (file?: File) => {
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadImage(file);
      setValue('image', url, { shouldValidate: true });
      setPreview(url);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Image upload failed'));
    } finally {
      setUploading(false);
    }
  };

  const togglePerk = (perk: string) => {
    const next = selectedPerks.includes(perk)
      ? selectedPerks.filter((p) => p !== perk)
      : [...selectedPerks, perk];
    setValue('perks', next);
  };

  const submit = (values: TicketFormValues) => {
    onSubmit({ ...values, departureAt: new Date(values.departureAt).toISOString() });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="grid gap-5 lg:grid-cols-2">
      <div className="lg:col-span-2">
        <label className="label" htmlFor="title">Ticket Title</label>
        <input id="title" className="input" placeholder="Dhaka → Cox's Bazar Deluxe Coach" {...register('title')} />
        {errors.title && <p className="mt-1 text-sm text-rose-600">{errors.title.message}</p>}
      </div>

      <div>
        <label className="label" htmlFor="from">From (Location)</label>
        <input id="from" className="input" placeholder="Dhaka" {...register('from')} />
        {errors.from && <p className="mt-1 text-sm text-rose-600">{errors.from.message}</p>}
      </div>
      <div>
        <label className="label" htmlFor="to">To (Location)</label>
        <input id="to" className="input" placeholder="Chittagong" {...register('to')} />
        {errors.to && <p className="mt-1 text-sm text-rose-600">{errors.to.message}</p>}
      </div>

      <div>
        <label className="label" htmlFor="transportType">Transport Type</label>
        <select id="transportType" className="input" {...register('transportType')}>
          {TRANSPORT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="departureAt">Departure Date & Time</label>
        <input id="departureAt" type="datetime-local" className="input" {...register('departureAt')} />
        {errors.departureAt && <p className="mt-1 text-sm text-rose-600">{errors.departureAt.message}</p>}
      </div>

      <div>
        <label className="label" htmlFor="price">Price (per unit)</label>
        <input id="price" type="number" min={0} step="1" className="input" {...register('price')} />
        {errors.price && <p className="mt-1 text-sm text-rose-600">{errors.price.message}</p>}
      </div>
      <div>
        <label className="label" htmlFor="quantity">Ticket Quantity</label>
        <input id="quantity" type="number" min={0} step="1" className="input" {...register('quantity')} />
        {errors.quantity && <p className="mt-1 text-sm text-rose-600">{errors.quantity.message}</p>}
      </div>

      {/* Perks */}
      <div className="lg:col-span-2">
        <label className="label">Perks</label>
        <div className="flex flex-wrap gap-2">
          {PERK_OPTIONS.map((perk) => {
            const active = selectedPerks.includes(perk);
            return (
              <button
                type="button"
                key={perk}
                onClick={() => togglePerk(perk)}
                className={
                  active
                    ? 'rounded-lg border border-brand-500 bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-200'
                    : 'rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:border-brand-400 dark:border-slate-700 dark:text-slate-300'
                }
              >
                {perk}
              </button>
            );
          })}
        </div>
      </div>

      {/* Image */}
      <div className="lg:col-span-2">
        <label className="label">Ticket Image</label>
        <div className="flex items-center gap-4">
          <label className="flex h-28 w-40 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 hover:border-brand-400 dark:border-slate-700">
            {preview ? (
              <img src={preview} alt="preview" className="h-full w-full object-cover" />
            ) : uploading ? (
              <Loader2 className="animate-spin text-slate-400" />
            ) : (
              <span className="flex flex-col items-center gap-1 text-slate-400">
                <ImagePlus size={22} />
                <span className="text-xs">Upload</span>
              </span>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImage(e.target.files?.[0])} />
          </label>
          <p className="text-xs text-slate-400">Uploaded to imgbb. JPG/PNG recommended.</p>
        </div>
        {errors.image && <p className="mt-1 text-sm text-rose-600">{errors.image.message}</p>}
      </div>

      {/* Vendor readonly */}
      <div>
        <label className="label">Vendor Name</label>
        <input className="input cursor-not-allowed opacity-60" value={user?.name ?? ''} readOnly />
      </div>
      <div>
        <label className="label">Vendor Email</label>
        <input className="input cursor-not-allowed opacity-60" value={user?.email ?? ''} readOnly />
      </div>

      <div className="lg:col-span-2">
        <button type="submit" className="btn-primary" disabled={submitting || uploading}>
          {submitting && <Spinner size={16} className="text-white" />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
