import { Link } from 'react-router-dom';
import { MapPin, Phone, CheckCircle, Navigation, Clock, Compass, ArrowRight } from 'lucide-react';
import { BUSINESS_INFO } from '../data/business';
import { useWebsiteContent } from '../context/ContentContext';
import EmergencyBanner from '../components/EmergencyBanner';

export default function ServiceAreasPage() {
  const { content } = useWebsiteContent();
  const business = content?.business || BUSINESS_INFO;

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Service Areas Hero */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-sky-400 font-bold text-xs uppercase tracking-wider">
              Local Service Coverage
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-2 tracking-tight">
              Plumbing Services in {business.city} & Central Florida
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed text-balance">
              Centrally based at {business.address} in {business.city}, Florida. We provide 24-hour residential and commercial plumbing services across the {business.city} area and surrounding Central Florida communities.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a
                href={`tel:${business.phoneRaw}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Call to Confirm Service Area</span>
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

      {/* Main Content Area */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Sebring Headquarters & Regional Coverage */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider">
                <Navigation className="w-3.5 h-3.5" />
                <span>Primary Operational Base</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Centered in {business.city}, Florida
              </h2>

              <p className="text-slate-600 text-base leading-relaxed">
                {business.name} operates from <strong>{business.address}, {business.city}, {business.state} {business.zip}</strong>. From this established Highlands County location, our technicians provide prompt response times throughout the area.
              </p>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Service Commitment
                </span>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>24/7 Telephone Response across Central Florida</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Residential, Commercial & Emergency Service Calls</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Equipped with diagnostic equipment and replacement parts</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <a
                  href={`tel:${business.phoneRaw}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Speak with our local team: {business.phoneFormatted}</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 aspect-4/3 bg-slate-100">
                <img
                  src="/src/assets/images/sebring_florida_area_1791015185518.jpg"
                  alt="Sebring Florida local community service area"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>

          {/* Regional Information & Highlands County Scope */}
          <div className="p-8 sm:p-10 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-4">
            <h3 className="text-2xl font-bold text-white">
              Highlands County & Central Florida Service Radius
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
              We proudly provide plumbing service to single-family homes, multi-family communities, retail spaces, medical facilities, and commercial buildings throughout Sebring and surrounding Central Florida communities. Whether you need urgent assistance with a burst pipe or scheduled water heater maintenance, our local team is ready 24 hours a day.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href={business.googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-sky-400 hover:text-sky-300 underline"
              >
                <Compass className="w-4 h-4" />
                <span>View Google Maps Location & Directions &rarr;</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Emergency Callout */}
      <EmergencyBanner />

    </div>
  );
}
