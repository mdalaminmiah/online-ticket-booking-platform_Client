import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CONTACT } from '@/constants';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function Contact() {
  usePageTitle('Contact');
  return (
    <div className="container-page py-12">
      <SectionHeading center eyebrow="Get in Touch" title="Contact Us" description="Have a question or need help with a booking? We'd love to hear from you." />

      <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-2">
        <div className="space-y-5">
          {[
            { icon: Mail, label: 'Email', value: CONTACT.email },
            { icon: Phone, label: 'Phone', value: CONTACT.phone },
            { icon: MapPin, label: 'Office', value: 'Gulshan, Dhaka, Bangladesh' },
          ].map((c) => (
            <div key={c.label} className="card flex items-center gap-4 p-5">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
                <c.icon size={22} />
              </span>
              <div>
                <p className="text-xs text-slate-400">{c.label}</p>
                <p className="font-semibold">{c.value}</p>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success('Thanks! We will get back to you shortly.');
            (e.target as HTMLFormElement).reset();
          }}
          className="card space-y-4 p-6"
        >
          <div>
            <label className="label" htmlFor="c-name">Name</label>
            <input id="c-name" required className="input" placeholder="Your name" />
          </div>
          <div>
            <label className="label" htmlFor="c-email">Email</label>
            <input id="c-email" type="email" required className="input" placeholder="you@example.com" />
          </div>
          <div>
            <label className="label" htmlFor="c-msg">Message</label>
            <textarea id="c-msg" required rows={4} className="input resize-none" placeholder="How can we help?" />
          </div>
          <button type="submit" className="btn-primary w-full">
            <Send size={16} /> Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
