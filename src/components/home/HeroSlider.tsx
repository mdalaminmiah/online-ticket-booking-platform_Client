import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600&q=80',
    eyebrow: 'Bus • Train • Launch • Flight',
    title: 'Every journey begins with a ticket',
    subtitle: 'Book bus, train, launch and flight tickets across Bangladesh in seconds.',
  },
  {
    image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1600&q=80',
    eyebrow: 'Fast & Secure',
    title: 'Travel smarter, pay securely',
    subtitle: 'Instant confirmations and Stripe-secured payments on every booking.',
  },
  {
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80',
    eyebrow: 'Nationwide Coverage',
    title: 'Thousands of routes, one platform',
    subtitle: 'From Dhaka to Cox’s Bazar and beyond — find the perfect ride.',
  },
];

export function HeroSlider() {
  return (
    <section className="relative">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="h-[600px] w-full"
      >
        {SLIDES.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="relative h-full w-full">
              <img src={slide.image} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/60 to-slate-950/20" />
              <div className="container-page absolute inset-0 flex flex-col justify-center">
                <div className="max-w-2xl animate-fade-up">
                  <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-brand-200 backdrop-blur">
                    {slide.eyebrow}
                  </span>
                  <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
                    {slide.title}
                  </h1>
                  <p className="mt-5 max-w-xl text-lg text-slate-200">{slide.subtitle}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link to="/tickets" className="btn-primary text-base">
                      <Search size={18} /> Browse Tickets
                    </Link>
                    <Link to="/register" className="btn bg-white/10 text-white backdrop-blur hover:bg-white/20">
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
