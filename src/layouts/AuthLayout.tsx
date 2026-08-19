import { Outlet, Link, Navigate } from 'react-router-dom';
import { Logo } from '@/components/layout/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { FullScreenLoader } from '@/components/ui/Spinner';
import { PHOTOS, unsplashUrl, unsplashSrcSet, IMAGE_SIZES } from '@/constants/images';

export default function AuthLayout() {
  const { status } = useAuth();
  if (status === 'loading') return <FullScreenLoader />;
  if (status === 'authenticated') return <Navigate to="/dashboard" replace />;

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-brand-700 lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
        <img
          src={unsplashUrl(PHOTOS.planeWing, 1200)}
          srcSet={unsplashSrcSet(PHOTOS.planeWing)}
          sizes={IMAGE_SIZES.half}
          alt=""
          className="h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
          <Logo className="[&_span]:text-white" />
          <div>
            <h2 className="max-w-md text-4xl font-bold leading-tight text-white">
              Travel Bangladesh, one ticket at a time.
            </h2>
            <p className="mt-4 max-w-md text-brand-100">
              Book bus, train, launch and flight tickets in seconds — secure payments, instant
              confirmations, zero hassle.
            </p>
          </div>
          <p className="text-sm text-brand-200">© {new Date().getFullYear()} TicketBari</p>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center justify-between p-6">
          <Link to="/" className="lg:invisible">
            <Logo />
          </Link>
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
