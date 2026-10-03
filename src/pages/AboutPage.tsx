import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Clock, 
  Phone, 
  ShieldCheck, 
  CheckCircle, 
  Wrench, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/business';
import { useWebsiteContent } from '../context/ContentContext';
import EmergencyBanner from '../components/EmergencyBanner';

export default function AboutPage() {
  const { content } = useWebsiteContent();
  const business = content?.business || BUSINESS_INFO;
  const about = content?.about;

  const headline = about?.aboutHeroHeadline || "About All Service Plumbing of Central Florida, Inc.";
  const subtext = about?.aboutHeroSubtext || "Dedicated to delivering dependable, 24-hour residential and commercial plumbing services to homes and businesses in Sebring and Central Florida.";
  const localTitle = about?.localServiceTitle || "Local Plumbing Service for Sebring & Central Florida";
  const localText = about?.localServiceText || `All Service Plumbing of Central Florida, Inc. is located at ${business.address}, ${business.city}, ${business.state} ${business.zip}. Being centrally situated in Highlands County allows our technicians to promptly reach residential neighborhoods, municipal areas, and commercial hubs across Central Florida.`;

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Header */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-sky-400 font-bold text-xs uppercase tracking-wider">
              About Our Company
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-2 tracking-tight">
              {headline}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed text-balance">
              {subtext}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          
          {/* Section 1 & 2: About & Local Plumbing Service */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>{business.city}, Florida</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {localTitle}
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                {localText}
              </p>
              <p className="text-slate-600 text-base leading-relaxed">
                Plumbing systems in Florida face specific environmental factors, including regional water mineral content, seasonal humidity, and outdoor fixture exposure. Our local presence ensures knowledgeable solutions suited for local home configurations and commercial facilities.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Physical Location</span>
                  <span className="font-bold text-slate-900 text-sm mt-1 block">{business.address}</span>
                  <span className="text-xs text-slate-600">{business.city}, {business.state} {business.zip}</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Business Hours</span>
                  <span className="font-bold text-emerald-700 text-sm mt-1 block">{business.hours}</span>
                  <span className="text-xs text-slate-600">Emergency & Scheduled</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 aspect-4/3 bg-slate-100">
                <img
                  src="/src/assets/images/sebring_florida_area_1791015185518.jpg"
                  alt="Sebring Florida local service area and residential community"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Residential & Commercial Solutions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 aspect-4/3 bg-slate-100">
                <img
                  src="/src/assets/images/plumber_work_tools_1791015154794.jpg"
                  alt="Professional plumbing equipment and pipe fittings"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                <span>Scope of Practice</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Residential & Commercial Plumbing Solutions
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                {about?.residentialCommercialText || "All Service Plumbing handles both residential and commercial projects. For homeowners, this includes kitchen sinks, bathroom lines, hot water heaters, and whole-house leak detection. For commercial businesses, retail plazas, and facilities, we address high-use restroom systems, grease lines, and main sewer pipes."}
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">Residential Homes & Condos</span>
                    <span className="text-xs text-slate-600">Faucets, supply lines, water heaters, toilet replacements, and pipe repairs.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">Commercial Businesses & Retail</span>
                    <span className="text-xs text-slate-600">Restroom maintenance, commercial drains, and facility water pressure management.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: 24-Hour Availability */}
          <div className="p-8 sm:p-12 rounded-2xl bg-slate-900 text-white border border-slate-800">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                <span>Always Open</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                24-Hour Availability
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                {about?.serviceApproachText || "Because plumbing failures happen without warning, our business hours are Open 24 hours. When you call +1 863-991-5702, your call is answered so you can get immediate assistance or schedule priority service."}
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                <a
                  href={`tel:${business.phoneRaw}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-lg"
                >
                  <Phone className="w-4 h-4 fill-white" />
                  <span>Call {business.phoneFormatted}</span>
                </a>
                <Link
                  to="/request-service"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-white bg-sky-600 hover:bg-sky-500 transition-colors"
                >
                  Request Service Online
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Emergency Banner */}
      <EmergencyBanner />

    </div>
  );
}
