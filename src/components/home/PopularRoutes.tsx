import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';

const ROUTES = [
  { from: 'Dhaka', to: "Cox's Bazar", image: 'https://images.unsplash.com/photo-1590059390047-f5a48c6f4d97?w=600&q=80', price: 1200 },
  { from: 'Dhaka', to: 'Chittagong', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80', price: 850 },
  { from: 'Dhaka', to: 'Sylhet', image: 'https://images.unsplash.com/photo-1585484173186-6bcb37d20b7e?w=600&q=80', price: 4500 },
  { from: 'Dhaka', to: 'Barishal', image: 'https://images.unsplash.com/photo-1528150177508-7cc0c36cc890?w=600&q=80', price: 1500 },
];

export function PopularRoutes() {
  return (
    <section className="container-page py-16">
      <SectionHeading eyebrow="Trending" title="Popular Routes" description="The routes travellers love the most." />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ROUTES.map((r) => (
          <Link
            key={`${r.from}-${r.to}`}
            to={`/tickets?search=${encodeURIComponent(r.to)}`}
            className="group relative h-56 overflow-hidden rounded-2xl"
          >
            <img src={r.image} alt={`${r.from} to ${r.to}`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <p className="text-xs text-slate-300">From ৳{r.price}</p>
              <p className="mt-1 flex items-center gap-1.5 text-lg font-bold">
                {r.from} <ArrowRight size={16} /> {r.to}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
