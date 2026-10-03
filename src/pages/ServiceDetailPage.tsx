import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ShieldCheck, 
  Clock, 
  MapPin,
  Wrench,
  ChevronRight
} from 'lucide-react';
import { BUSINESS_INFO, SERVICES as DEFAULT_SERVICES, PlumbingService } from '../data/business';
import { useWebsiteContent } from '../context/ContentContext';
import FAQSection from '../components/FAQSection';
import EmergencyBanner from '../components/EmergencyBanner';

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { services: liveServices, content } = useWebsiteContent();
  const business = content?.business || BUSINESS_INFO;

  const allServices = liveServices && liveServices.length > 0 ? liveServices : DEFAULT_SERVICES;
  const service = allServices.find((s) => s.slug === slug || s.id === slug);

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Breadcrumb Header */}
      <div className="bg-slate-950 text-slate-400 py-3 border-b border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/services" className="hover:text-white transition-colors">Services</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white font-medium">{service.title}</span>
        </div>
      </div>

      {/* Service Hero */}
      <section className="bg-slate-900 text-white py-14 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider">
                <Wrench className="w-3.5 h-3.5" />
                <span>Professional Plumbing Service</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                {service.title} in {business.city}, FL
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                {service.fullDescription || service.shortDescription}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href={`tel:${business.phoneRaw}`}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-950/30"
                >
                  <Phone className="w-4 h-4 fill-white" />
                  <span>Call {business.phoneFormatted}</span>
                </a>

                <Link
                  to="/request-service"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-sky-600 hover:bg-sky-500 transition-colors"
                >
                  <span>Request This Service</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  {business.hours || 'Open 24 Hours'}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-sky-400" />
                  {business.city} & Central Florida
                </span>
              </div>
            </div>

            {service.imageUrl && (
              <div className="lg:col-span-4">
                <div className="rounded-2xl overflow-hidden border border-slate-700 aspect-4/3 bg-slate-800 shadow-xl">
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Service Core Sections */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Common Problems Resolved */}
          {service.commonProblems && service.commonProblems.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Common Symptoms</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Common Signs You Need {service.title}
              </h2>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {service.commonProblems.map((prob, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                    <span className="text-sm text-slate-700 leading-relaxed">{prob}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Service Scope & Approach */}
          {service.serviceScope && service.serviceScope.length > 0 && (
            <div className="p-8 sm:p-10 rounded-2xl bg-slate-900 text-white border border-slate-800">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                What Our Technicians Do
              </h2>
              <p className="text-sm text-slate-400 mt-2 max-w-2xl">
                Our approach emphasizes systematic diagnosis, reliable repair methods, and durable materials suited for Florida plumbing infrastructure.
              </p>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.serviceScope.map((step, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-start gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                      {idx + 1}
                    </div>
                    <span className="text-sm text-slate-200 leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          {service.benefits && service.benefits.length > 0 && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Service Advantages
              </h2>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {service.benefits.map((benefit, idx) => (
                  <div key={idx} className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-3" />
                    <span className="text-sm font-semibold text-slate-800 leading-snug block">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Direct Scheduling Box */}
          <div className="p-8 rounded-2xl bg-sky-50 border border-sky-200 sm:flex sm:items-center sm:justify-between gap-6">
            <div>
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">Ready for service?</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">Book {service.title} in {business.city}, FL</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Emergency calls are answered 24 hours a day at {business.phone}.
              </p>
            </div>

            <div className="mt-4 sm:mt-0 flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={`tel:${business.phoneRaw}`}
                className="px-5 py-3 rounded-lg text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs"
              >
                Call {business.phoneFormatted}
              </a>
              <Link
                to="/request-service"
                className="px-5 py-3 rounded-lg text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 transition-colors shadow-xs"
              >
                Request Online
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Service-Specific FAQs */}
      {service.faqs && service.faqs.length > 0 && (
        <FAQSection
          customFaqs={service.faqs}
          title={`${service.title} - Questions & Answers`}
          subtitle="Specific details regarding this plumbing solution in Sebring, Florida."
        />
      )}

      {/* Emergency Banner */}
      <EmergencyBanner />

    </div>
  );
}
