import { Link } from 'react-router-dom';
import { Phone, CalendarClock } from 'lucide-react';
import { BUSINESS_INFO } from '../data/business';
import { useWebsiteContent } from '../context/ContentContext';

export default function MobileBottomCTA() {
  const { content } = useWebsiteContent();
  const business = content?.business || BUSINESS_INFO;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2 shadow-2xl">
      <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
        <a
          href={`tel:${business.phoneRaw}`}
          className="flex items-center justify-center gap-1.5 py-3 px-2 rounded-lg bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wide shadow-sm"
          aria-label="Call All Service Plumbing Now"
        >
          <Phone className="w-4 h-4 fill-white" />
          <span>Call Now</span>
        </a>

        <Link
          to="/request-service"
          className="flex items-center justify-center gap-1.5 py-3 px-2 rounded-lg bg-sky-600 active:bg-sky-700 text-white font-bold text-xs uppercase tracking-wide shadow-sm"
          aria-label="Request Plumbing Service"
        >
          <CalendarClock className="w-4 h-4" />
          <span>Request Service</span>
        </Link>
      </div>
    </div>
  );
}
