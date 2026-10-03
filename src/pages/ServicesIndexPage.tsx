import { Link } from 'react-router-dom';
import { Phone, ArrowRight, Clock } from 'lucide-react';
import { BUSINESS_INFO, SERVICES as DEFAULT_SERVICES } from '../data/business';
import { useWebsiteContent } from '../context/ContentContext';
import ServiceCard from '../components/ServiceCard';
import EmergencyBanner from '../components/EmergencyBanner';

export default function ServicesIndexPage() {
  const { content, services: liveServices } = useWebsiteContent();
  const business = content?.business || BUSINESS_INFO;
  const activeServices = liveServices && liveServices.length > 0 
    ? liveServices.filter(s => s.enabled) 
    : DEFAULT_SERVICES;

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Services Directory Hero */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-sky-400 font-bold text-xs uppercase tracking-wider">
              Plumbing Solutions
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-2 tracking-tight">
              Complete Plumbing Services Directory
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed text-balance">
              Professional residential and commercial plumbing services throughout {business.city}, Florida and Central Florida. Available 24 hours a day for emergency calls and scheduled work.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a
                href={`tel:${business.phoneRaw}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Call 24/7: {business.phoneFormatted}</span>
              </a>

              <Link
                to="/request-service"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 transition-colors"
              >
                <span>Request Service</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Our Professional Services
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Select any service below to view detailed coverage, diagnostic approaches, and common plumbing issues we resolve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {activeServices.map((service) => (
              <ServiceCard key={service.id} service={service as any} />
            ))}
          </div>

          {/* Quick Info Box */}
          <div className="mt-16 bg-white border border-slate-200 rounded-2xl p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <Clock className="w-4 h-4" />
                <span>{business.hours || 'Open 24 Hours A Day'}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Not sure which plumbing service matches your situation?
              </h3>
              <p className="text-sm text-slate-600 max-w-xl">
                Describe the symptoms to our staff. We will identify whether your issue requires leak detection, drain cabling, fixture replacement, or emergency shutoff.
              </p>
            </div>

            <a
              href={`tel:${business.phoneRaw}`}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shrink-0"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Call Us: {business.phoneFormatted}</span>
            </a>
          </div>

        </div>
      </section>

      {/* Emergency Callout */}
      <EmergencyBanner />

    </div>
  );
}
