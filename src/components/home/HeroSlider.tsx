import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { SmartImage } from '@/components/ui/SmartImage';
import { PHOTOS, unsplashUrl, unsplashSrcSet } from '@/constants/images';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const SLIDES = [
  {
    photo: PHOTOS.busNight,
    alt: 'Long-distance coach parked at dusk below a mountain range',
    eyebrow: 'Bus • Train • Launch • Flight',
    title: 'Every journey begins with a ticket',
    subtitle: 'Book bus, train, launch and flight tickets across Bangladesh in seconds.',
  },
  {
    photo: PHOTOS.planeGate,
    alt: 'Airliner parked at the terminal gate at sunset',
    eyebrow: 'Fast & Secure',
    title: 'Travel smarter, pay securely',
    subtitle: 'Instant confirmations and Stripe-secured payments on every booking.',
  },
  {
    photo: PHOTOS.trainScenic,
    alt: 'Passenger train curving through a forested mountain valley',
    eyebrow: 'Nationwide Coverage',
    title: 'Thousands of routes, one platform',
    subtitle: 'From Dhaka to Cox’s Bazar and beyond — find the perfect ride.',
  },
];

export function HeroSlider() {
  return (
    <section className="relative" aria-label="Featured destinations">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={900}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        a11y={{ enabled: true }}
        className="hero-slider h-[540px] w-full sm:h-[600px] lg:h-[660px]"
      >
        {SLIDES.map((slide, i) => (
          <SwiperSlide key={slide.photo}>
            <div className="relative h-full w-full">
              <SmartImage
                src={unsplashUrl(slide.photo, 1600, 16 / 9)}
                srcSet={unsplashSrcSet(slide.photo, 16 / 9)}
                sizes="100vw"
                alt={slide.alt}
                className="absolute inset-0 h-full w-full"
                imgClassName="hero-media"
                priority={i === 0}
              />

              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-950/25" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/30" />

              <div className="container-page absolute inset-0 flex flex-col justify-center">
                <div className="hero-reveal max-w-2xl">
                  <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-brand-200 ring-1 ring-white/20 backdrop-blur">
                    {slide.eyebrow}
                  </span>
                  <h1 className="mt-5 text-3xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
                    {slide.title}
                  </h1>
                  <p className="mt-5 max-w-xl text-base text-slate-200 sm:text-lg">{slide.subtitle}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link to="/tickets" className="btn-primary text-base">
                      <Search size={18} /> Browse Tickets
                    </Link>
                    <Link
                      to="/register"
                      className="btn bg-white/10 text-white ring-1 ring-white/25 backdrop-blur hover:bg-white/20"
                    >
                      Get Started <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
