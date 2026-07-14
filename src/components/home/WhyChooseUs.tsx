import { ShieldCheck, Zap, Wallet, Headphones } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';

const FEATURES = [
  { icon: Zap, title: 'Instant Booking', desc: 'Reserve your seat in seconds with a real-time availability check.' },
  { icon: ShieldCheck, title: 'Secure Payments', desc: 'Every transaction is protected by Stripe and industry-grade encryption.' },
  { icon: Wallet, title: 'Best Prices', desc: 'Transparent, per-unit pricing with no hidden charges — ever.' },
  { icon: Headphones, title: '24/7 Support', desc: 'Our team is here around the clock to help with any booking.' },
];

export function WhyChooseUs() {
  return (
    <section className="bg-white py-16 dark:bg-slate-900/40">
      <div className="container-page">
        <SectionHeading center eyebrow="Why TicketBari" title="Booking made effortless" description="Everything you need for a smooth journey, in one place." />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-6 text-center transition-transform hover:-translate-y-1">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
                <f.icon size={26} />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
