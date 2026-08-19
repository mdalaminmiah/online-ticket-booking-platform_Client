import { SectionHeading } from '@/components/ui/SectionHeading';
import { Target, Users, Globe2 } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function About() {
  usePageTitle('About');
  return (
    <div className="container-page py-12">
      <SectionHeading center eyebrow="About Us" title="Connecting Bangladesh, one ticket at a time" description="TicketBari is a modern travel-ticketing marketplace bringing bus, train, launch and flight bookings together in one seamless platform." />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {[
          { icon: Target, title: 'Our Mission', desc: 'Make travel booking effortless, transparent and secure for everyone.' },
          { icon: Users, title: 'For Everyone', desc: 'Travellers, vendors and administrators — all served by one platform.' },
          { icon: Globe2, title: 'Nationwide', desc: 'Thousands of routes connecting every corner of the country.' },
        ].map((c) => (
          <div key={c.title} className="card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
              <c.icon size={24} />
            </div>
            <h3 className="text-lg font-semibold">{c.title}</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
