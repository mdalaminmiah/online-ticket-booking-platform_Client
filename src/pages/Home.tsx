import { Link } from 'react-router-dom';
import { ArrowRight, Bus, TrainFront, Ship, Plane } from 'lucide-react';
import { HeroSlider } from '@/components/home/HeroSlider';
import { AdvertisementSection } from '@/components/home/AdvertisementSection';
import { LatestTickets } from '@/components/home/LatestTickets';
import { PopularRoutes } from '@/components/home/PopularRoutes';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';

const STATS = [
  { value: '50K+', label: 'Happy Travellers' },
  { value: '1,200+', label: 'Routes Covered' },
  { value: '300+', label: 'Trusted Vendors' },
  { value: '99.9%', label: 'On-time Booking' },
];

const TRANSPORTS = [
  { icon: Bus, label: 'Bus' },
  { icon: TrainFront, label: 'Train' },
  { icon: Ship, label: 'Launch' },
  { icon: Plane, label: 'Plane' },
];

export default function Home() {
  return (
    <>
      <HeroSlider />

      {/* Transport modes strip */}
      <section className="container-page -mt-10 relative z-10">
        <div className="card grid grid-cols-2 gap-4 p-6 sm:grid-cols-4">
          {TRANSPORTS.map((t) => (
            <div key={t.label} className="flex items-center justify-center gap-3 rounded-xl py-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
                <t.icon size={22} />
              </span>
              <span className="font-semibold">{t.label}</span>
            </div>
          ))}
        </div>
      </section>

      <AdvertisementSection />
      <PopularRoutes />
      <LatestTickets />
      <WhyChooseUs />

      {/* Stats band */}
      <section className="bg-brand-700 py-14">
        <div className="container-page grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold text-white sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm text-brand-200">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-8 py-14 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.15),transparent_40%)]" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready for your next trip?</h2>
            <p className="mx-auto mt-3 max-w-lg text-brand-100">
              Join thousands of travellers who book smarter with TicketBari.
            </p>
            <Link to="/tickets" className="btn-accent mt-8 text-base">
              Explore All Tickets <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
