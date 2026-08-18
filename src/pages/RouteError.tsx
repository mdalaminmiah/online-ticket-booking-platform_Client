import { Link, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { Home, RotateCw } from 'lucide-react';

export default function RouteError() {
  const error = useRouteError();
  const title = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : 'Something went wrong';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center dark:bg-slate-950">
      <p className="font-display text-[6rem] font-extrabold leading-none text-brand-600">Oops</p>
      <h1 className="mt-2 text-3xl font-bold">{title}</h1>
      <p className="mt-3 max-w-md text-slate-500 dark:text-slate-400">
        An unexpected error interrupted your journey. Try reloading the page or head back home.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button onClick={() => window.location.reload()} className="btn-primary">
          <RotateCw size={18} /> Reload
        </button>
        <Link to="/" className="btn-outline">
          <Home size={18} /> Back Home
        </Link>
      </div>
    </div>
  );
}
