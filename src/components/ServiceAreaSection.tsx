import { Link } from 'react-router-dom';
import { MapPin, Phone, CheckCircle, Navigation, Compass } from 'lucide-react';
import { BUSINESS_INFO } from '../data/business';

interface ServiceAreaSectionProps {
  showFullDetails?: boolean;
}

export default function ServiceAreaSection({ showFullDetails = false }: ServiceAreaSectionProps) {
  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-sky-600 font-bold text-xs uppercase tracking-wider">
            Local Coverage
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Serving Sebring & Central Florida
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed text-balance">
            Centrally based at 4305 Grand Concourse in Sebring, Florida. We provide 24-hour residential and commercial plumbing services across the Sebring area and surrounding Central Florida communities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Visual Column: Community & Map Card */}
          <div className="lg:col-span-7 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 aspect-16/10 bg-slate-900 group">
              <img
                src="/src/assets/images/sebring_florida_area_1791015185518.jpg"
                alt="Sebring and Central Florida residential service community"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent" />
              
              {/* Overlay Location Badge */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 border border-sky-400/30">
                    <MapPin className="w-5 h-5 text-sky-300" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-sky-300 uppercase tracking-wider block">Central Base</span>
                    <span className="font-bold text-sm text-white">{BUSINESS_INFO.fullAddress}</span>
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-slate-700 sm:pl-4">
                  <span className="text-xs text-slate-400 block">Dispatch Status</span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 justify-end">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
                    Available 24/7
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details & CTA Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-sky-600" />
                Prompt Local Service in Sebring
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Whether you own a home near Lake Jackson, operate a commercial facility on US-27, or manage property in Central Florida, our plumbers are on call 24 hours to handle your plumbing needs.
              </p>

              <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-sm">
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">Headquartered locally in Sebring, FL 33875</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">24-hour service availability for urgent leaks and clogs</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">Residential & commercial plumbing coverage</span>
                </div>
              </div>

              <div className="mt-7 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                <a
                  href={`tel:${BUSINESS_INFO.phoneRaw}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Call {BUSINESS_INFO.phoneFormatted}</span>
                </a>

                <Link
                  to="/service-areas"
                  className="inline-flex items-center justify-center px-4 py-3 rounded-lg text-sm font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors"
                >
                  <Compass className="w-4 h-4 mr-1.5" />
                  Check Availability
                </Link>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-sky-50 border border-sky-100 text-xs text-sky-950 flex items-start gap-3">
              <MapPin className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <p>
                Not sure if your address is within our primary service boundary? Call us at <a href={`tel:${BUSINESS_INFO.phoneRaw}`} className="font-bold underline text-sky-800">{BUSINESS_INFO.phoneFormatted}</a> to confirm immediate dispatch availability.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
