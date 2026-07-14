import { Link } from 'react-router-dom';
import { Facebook, Mail, Phone, CreditCard } from 'lucide-react';
import { Logo } from './Logo';
import { APP_NAME, APP_TAGLINE, CONTACT } from '@/constants';

function XLogo({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
      <path d="M18.9 2H22l-7.5 8.6L23 22h-6.8l-5.3-6.9L4.8 22H1.7l8-9.2L1 2h6.9l4.8 6.3L18.9 2Zm-2.4 18h1.9L7.6 4H5.6l10.9 16Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-slate-500 dark:text-slate-400">{APP_TAGLINE}.</p>
          <div className="mt-4 flex gap-3">
            <a href={CONTACT.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-brand-600 hover:text-white dark:bg-slate-800 dark:text-slate-300">
              <Facebook size={16} />
            </a>
            <a href={CONTACT.x} target="_blank" rel="noreferrer" aria-label="X" className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-brand-600 hover:text-white dark:bg-slate-800 dark:text-slate-300">
              <XLogo />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">Quick Links</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
            <li><Link to="/" className="hover:text-brand-600">Home</Link></li>
            <li><Link to="/tickets" className="hover:text-brand-600">All Tickets</Link></li>
            <li><Link to="/contact" className="hover:text-brand-600">Contact Us</Link></li>
            <li><Link to="/about" className="hover:text-brand-600">About</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">Contact Info</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
            <li className="flex items-center gap-2"><Mail size={15} className="text-brand-500" /> {CONTACT.email}</li>
            <li className="flex items-center gap-2"><Phone size={15} className="text-brand-500" /> {CONTACT.phone}</li>
            <li className="flex items-center gap-2"><Facebook size={15} className="text-brand-500" /> facebook.com/ticketbari</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">Payment Methods</h4>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Secure payments powered by Stripe.</p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
            <CreditCard size={18} className="text-brand-600" />
            <span className="font-display text-sm font-bold">stripe</span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 py-5 dark:border-slate-800">
        <p className="container-page text-center text-sm text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
