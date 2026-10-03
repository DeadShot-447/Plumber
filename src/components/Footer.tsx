import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { BUSINESS_INFO, SERVICES as DEFAULT_SERVICES } from '../data/business';
import { useWebsiteContent } from '../context/ContentContext';

export default function Footer() {
  const { content, services } = useWebsiteContent();
  const business = content?.business || BUSINESS_INFO;
  const activeServices = services && services.length > 0 ? services.filter(s => s.enabled) : DEFAULT_SERVICES;

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Upper Pre-Footer Callout */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-emerald-400 font-semibold text-xs tracking-wider uppercase">
                24/7 Central Florida Plumbing
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Facing a plumbing issue in Sebring or Central Florida?
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                Our technicians are ready 24 hours a day for emergency service and scheduled plumbing repairs.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={`tel:${business.phoneRaw}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/20"
              >
                <Phone className="w-4 h-4" />
                Call {business.phoneFormatted}
              </a>
              <Link
                to="/request-service"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 transition-colors"
              >
                Request Service
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Col 1: Business Identity & Verified Contact */}
          <div className="space-y-4">
            <div>
              <span className="text-lg font-extrabold text-white block tracking-tight">
                {business.shortName || 'All Service Plumbing'}
              </span>
              <span className="text-xs font-semibold text-sky-400 tracking-wide block">
                {business.subtitle || 'of Central Florida, Inc.'}
              </span>
            </div>
            
            <p className="text-sm text-slate-400 leading-relaxed">
              Professional plumbing service for homes and businesses throughout Sebring and Central Florida.
            </p>

            <div className="space-y-2.5 pt-2 text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-1" />
                <div>
                  <span className="block font-medium text-white">{business.address}</span>
                  <span className="text-slate-400">{business.city}, {business.state} {business.zip}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`tel:${business.phoneRaw}`}
                  className="font-bold text-white hover:text-sky-300 transition-colors"
                >
                  {business.phone}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="font-semibold text-emerald-400">{business.hours}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Plumbing Services Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Plumbing Services
            </h4>
            <ul className="space-y-2 text-sm">
              {activeServices.slice(0, 7).map((srv) => (
                <li key={srv.id}>
                  <Link
                    to={`/services/${srv.slug}`}
                    className="text-slate-400 hover:text-sky-300 transition-colors inline-block"
                  >
                    {srv.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/services"
                  className="text-sky-400 hover:text-sky-300 font-medium inline-flex items-center gap-1 mt-1 text-xs"
                >
                  View All Services &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-400 hover:text-white transition-colors">Services Directory</Link>
              </li>
              <li>
                <Link to="/service-areas" className="text-slate-400 hover:text-white transition-colors">Service Areas</Link>
              </li>
              <li>
                <Link to="/reviews" className="text-slate-400 hover:text-white transition-colors">Customer Reviews</Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link to="/request-service" className="text-slate-400 hover:text-white transition-colors">Request Service Form</Link>
              </li>
              <li>
                <Link to="/admin" className="text-slate-500 hover:text-slate-300 transition-colors text-xs flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                  Dispatcher Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Verified Operating Hours & Service Commitments */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Availability & Area
            </h4>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-bold text-white">{business.hours}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Emergency dispatch and scheduled plumbing visits available 24 hours a day, 7 days a week.
              </p>
              <div className="pt-2 border-t border-slate-800 text-xs text-slate-300">
                <span className="font-semibold text-white block">Primary Dispatch Hub:</span>
                <span>{business.fullAddress}</span>
              </div>
            </div>

            <div className="text-xs text-slate-500">
              <p>Residential & Commercial Plumbing Service in Highlands County and Central Florida.</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} {business.name}. All rights reserved.
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link to="/admin/login" className="hover:text-slate-300 transition-colors font-medium text-slate-400">Admin Login</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
