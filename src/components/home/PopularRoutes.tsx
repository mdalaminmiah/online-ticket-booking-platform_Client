import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SmartImage } from '@/components/ui/SmartImage';
import { PHOTOS, unsplashUrl, unsplashSrcSet, IMAGE_SIZES } from '@/constants/images';

const ROUTES = [
  { from: 'Dhaka', to: "Cox's Bazar", photo: PHOTOS.beachSunset, alt: 'Waves washing a wide sandy beach at sunset', price: 1200 },
  { from: 'Dhaka', to: 'Chittagong', photo: PHOTOS.hillsRiver, alt: 'River winding through forested hill country', price: 850 },
  { from: 'Dhaka', to: 'Sylhet', photo: PHOTOS.greenHills, alt: 'Road curving across green rolling hills at sunrise', price: 4500 },
  { from: 'Dhaka', to: 'Barishal', photo: PHOTOS.boatRiver, alt: 'Wooden boat crossing calm river water', price: 1500 },
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
            className="group relative overflow-hidden rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
          >
            <SmartImage
              src={unsplashUrl(r.photo, 800, 3 / 2)}
              srcSet={unsplashSrcSet(r.photo, 3 / 2)}
              sizes={IMAGE_SIZES.routeTile}
              alt={r.alt}
              ratio="3/2"
              imgClassName="transition-transform duration-700 group-hover:scale-110"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 text-white">
              <p className="text-xs text-slate-300">From ৳{r.price}</p>
              <p className="mt-1 flex items-center gap-1.5 text-lg font-bold">
                {r.from} <ArrowRight size={16} className="shrink-0" /> {r.to}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
