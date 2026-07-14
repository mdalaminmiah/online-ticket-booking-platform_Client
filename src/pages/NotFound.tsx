import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center dark:bg-slate-950">
      <p className="font-display text-[8rem] font-extrabold leading-none text-brand-600">404</p>
      <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
      <p className="mt-3 max-w-md text-slate-500 dark:text-slate-400">
        The page you're looking for took a different route. Let's get you back on track.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-primary">
          <Home size={18} /> Back Home
        </Link>
        <Link to="/tickets" className="btn-outline">
          <Compass size={18} /> Browse Tickets
        </Link>
      </div>
    </div>
  );
}
