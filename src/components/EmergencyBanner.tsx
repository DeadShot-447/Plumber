import { Phone, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BUSINESS_INFO } from '../data/business';
import { useWebsiteContent } from '../context/ContentContext';

interface EmergencyBannerProps {
  compact?: boolean;
}

export default function EmergencyBanner({ compact = false }: EmergencyBannerProps) {
  const { content } = useWebsiteContent();
  const business = content?.business || BUSINESS_INFO;
  const home = content?.home;

  const headline = home?.emergencyHeadline || 'Plumbing Emergency?';
  const text = home?.emergencyText || "Don't wait for a small plumbing problem to become a major issue. Contact All Service Plumbing for professional service.";

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white border-y border-slate-800">
      {/* Subtle warm accent radial background for urgency */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-orange-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-sky-600/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="space-y-3 max-w-3xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold tracking-wide uppercase">
              <AlertCircle className="w-3.5 h-3.5 text-orange-400" />
              <span>24/7 Rapid Response</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              {headline}
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              {text}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                Available {business.hours || '24 Hours / 7 Days'}
              </span>
              <span className="text-slate-600">·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
                Burst Pipes & Active Leaks
              </span>
              <span className="text-slate-600">·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
                Drain & Sewer Backups
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
            <a
              href={`tel:${business.phoneRaw}`}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-7 py-4 rounded-xl text-base font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-950/40 active:scale-95 group"
            >
              <Phone className="w-5 h-5 fill-white group-hover:rotate-12 transition-transform" />
              <div className="text-left">
                <span className="block text-xs uppercase tracking-wider text-emerald-100 font-semibold">Call Now 24/7</span>
                <span className="text-lg leading-tight font-black">{business.phone}</span>
              </div>
            </a>

            {!compact && (
              <Link
                to="/request-service"
                className="w-full sm:w-auto flex items-center justify-center px-6 py-4 rounded-xl text-sm font-bold text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-all hover:text-white"
              >
                Request Service
              </Link>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
