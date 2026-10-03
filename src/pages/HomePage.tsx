import { Link } from 'react-router-dom';
import { 
  Phone, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Wrench, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  Home as HomeIcon,
  Headphones,
  Sparkles
} from 'lucide-react';
import { BUSINESS_INFO, SERVICES as DEFAULT_SERVICES } from '../data/business';
import { useWebsiteContent } from '../context/ContentContext';
import ServiceCard from '../components/ServiceCard';
import EmergencyBanner from '../components/EmergencyBanner';
import ServiceAreaSection from '../components/ServiceAreaSection';
import FAQSection from '../components/FAQSection';
import GoogleReviewsSection from '../components/GoogleReviewsSection';

export default function HomePage() {
  const { content, services: liveServices } = useWebsiteContent();
  const business = content?.business || BUSINESS_INFO;
  const home = content?.home;
  const activeServices = liveServices && liveServices.length > 0 
    ? liveServices.filter(s => s.enabled) 
    : DEFAULT_SERVICES;

  const heroHeadline = home?.heroHeadline || "Reliable Plumbing Services in Central Florida";
  const heroSupportingText = home?.heroSupportingText || "Professional plumbing service for homes and businesses throughout Sebring and Central Florida.";
  const heroPrimaryCta = home?.heroPrimaryCtaText || `Call ${business.phoneFormatted}`;
  const heroSecondaryCta = home?.heroSecondaryCtaText || "Request Service";
  const heroImageUrl = home?.heroImageUrl || "/src/assets/images/hero_plumbing_service_1791015140754.jpg";
  const whyChooseUsHeadline = home?.whyChooseUsHeadline || "Why Customers Choose All Service Plumbing";
  const whyChooseUsSubtext = home?.whyChooseUsSubtext || "When plumbing troubles occur in Sebring or Central Florida, you need a local team that is accessible, responsive, and equipped for residential and commercial systems.";

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative bg-slate-900 text-white overflow-hidden py-16 sm:py-24 lg:py-28">
        {/* Background Subtle Gradient & Light accents */}
        <div className="absolute inset-0 bg-radial-[at_top_right] from-sky-900/30 via-slate-900 to-slate-950 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Trust Indicators / Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  {business.hours || '24/7 Availability'}
                </span>
                <span className="text-slate-600" aria-hidden="true">·</span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                  Residential & Commercial Plumbing
                </span>
                <span className="text-slate-600" aria-hidden="true">·</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  {business.city} & Central Florida
                </span>
                <span className="text-slate-600" aria-hidden="true">·</span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  Fast Response
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white text-balance leading-tight sm:leading-none">
                {heroHeadline}
              </h1>

              {/* Supporting Text */}
              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {heroSupportingText}
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a
                  href={`tel:${business.phoneRaw}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all shadow-xl shadow-emerald-950/40 group"
                >
                  <Phone className="w-5 h-5 fill-white group-hover:rotate-12 transition-transform" />
                  <span>{heroPrimaryCta}</span>
                </a>

                <Link
                  to="/request-service"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white bg-sky-600 hover:bg-sky-500 active:scale-95 transition-all shadow-lg shadow-sky-950/30"
                >
                  <span>{heroSecondaryCta}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Verified Facts Bar */}
              <div className="pt-6 border-t border-slate-800 text-xs text-slate-400 flex flex-wrap items-center justify-center lg:justify-start gap-6">
                <div>
                  <span className="text-white font-bold block">{business.hours}</span>
                  <span>Emergency & Scheduled Service</span>
                </div>
                <div className="h-6 w-px bg-slate-800 hidden sm:block" />
                <div>
                  <span className="text-white font-bold block">{business.address}</span>
                  <span>{business.city}, {business.state} {business.zip}</span>
                </div>
              </div>

            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80 bg-slate-800 aspect-4/3 group">
                <img
                  src={heroImageUrl}
                  alt="Professional plumber working on residential plumbing pipe system in Central Florida"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* Floating On-Image Trust Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/70 text-xs text-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-white block">{business.hours}</span>
                      <span className="text-[11px] text-slate-300">Highlands County Dispatch</span>
                    </div>
                  </div>

                  <a
                    href={`tel:${business.phoneRaw}`}
                    className="font-bold text-sky-400 hover:text-sky-300 underline"
                  >
                    Call Now &rarr;
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* COMPLETE PLUMBING SERVICES GRID */}
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="max-w-2xl">
              <span className="text-sky-700 font-bold text-xs uppercase tracking-wider">
                Full-Service Solutions
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
                Complete Plumbing Services
              </h2>
              <p className="mt-3 text-base text-slate-600 leading-relaxed">
                From urgent water line repairs to routine fixture installations, our plumbers handle residential and commercial projects across Central Florida.
              </p>
            </div>

            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-700 hover:text-sky-800 group"
            >
              <span>Explore all services</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {activeServices.slice(0, 9).map((service) => (
              <ServiceCard key={service.id} service={service as any} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/request-service"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 transition-colors shadow-sm"
            >
              <span>Need a custom plumbing solution? Request Service</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* PROMINENT EMERGENCY CTA */}
      <EmergencyBanner />

      {/* WHY CHOOSE US */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-sky-600 font-bold text-xs uppercase tracking-wider">
              Customer Dedication
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              {whyChooseUsHeadline}
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed text-balance">
              {whyChooseUsSubtext}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* 1. Local Central Florida Service */}
            <div className="p-7 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-sky-300 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center mb-5">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Local Central Florida Service
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Centrally located at {business.address} in {business.city}, {business.state}. We know the local water infrastructure and provide timely support to local neighbors and businesses.
              </p>
            </div>

            {/* 2. Professional Plumbing Solutions */}
            <div className="p-7 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-sky-300 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center mb-5">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Professional Plumbing Solutions
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Equipped with motorized drain snakes, pressure testing diagnostics, and repair tools for water heaters, piping, and fixtures.
              </p>
            </div>

            {/* 3. Residential & Commercial Service */}
            <div className="p-7 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-sky-300 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center mb-5">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Residential & Commercial Service
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Whether you have a kitchen leak in a single-family home or an urgent restroom clog at a commercial facility, we service both property types.
              </p>
            </div>

            {/* 4. 24-Hour Availability */}
            <div className="p-7 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-sky-300 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                24-Hour Availability
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Plumbing malfunctions don't observe 9-to-5 schedules. Our phone lines and emergency service are {business.hours || 'open 24 hours a day'}.
              </p>
            </div>

            {/* 5. Convenient Phone Support */}
            <div className="p-7 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-sky-300 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center mb-5">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Immediate Phone Dispatch
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Reach our team directly by phone at {business.phone} for immediate assistance, questions, or scheduling a visit.
              </p>
            </div>

            {/* 6. Honest & Dependable Service */}
            <div className="p-7 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-sky-300 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Dependable Workmanship
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Clear diagnoses, respectful technicians, and plumbing repairs built to last against Central Florida's water demands.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SERVICE AREAS OVERVIEW SECTION */}
      <ServiceAreaSection />

      {/* GOOGLE REVIEWS SECTION */}
      <GoogleReviewsSection />

      {/* FREQUENTLY ASKED QUESTIONS */}
      <FAQSection />

      {/* FINAL PRE-FOOTER CTA */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">
            Ready to schedule?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Professional Plumbing Service Throughout Central Florida
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
            Call our team 24/7 or submit your service request online for fast, dependable residential and commercial plumbing support.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`tel:${business.phoneRaw}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 shadow-xl transition-all"
            >
              <Phone className="w-5 h-5 fill-white" />
              <span>Call {business.phoneFormatted}</span>
            </a>
            <Link
              to="/request-service"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-lg transition-all"
            >
              <span>Book Online</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
