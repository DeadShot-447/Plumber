import { Phone, MapPin, Clock, Mail, ShieldCheck, Compass, MessageSquare } from 'lucide-react';
import { BUSINESS_INFO } from '../data/business';
import { useWebsiteContent } from '../context/ContentContext';
import ContactForm from '../components/ContactForm';
import EmergencyBanner from '../components/EmergencyBanner';

export default function ContactPage() {
  const { content } = useWebsiteContent();
  const business = content?.business || BUSINESS_INFO;

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Contact Hero */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-sky-400 font-bold text-xs uppercase tracking-wider">
              Get In Touch
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-2 tracking-tight">
              Contact {business.shortName || 'All Service Plumbing'}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed text-balance">
              Reach out 24 hours a day for emergency plumbing, scheduled repairs, or project estimates in {business.city} and Central Florida.
            </p>
          </div>
        </div>
      </section>

      {/* Main Form & Contact Information Grid */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Verified Business Information & Phone Callout */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* Direct Phone Call Box */}
              <div className="bg-slate-900 text-white rounded-2xl p-7 sm:p-8 shadow-md border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl" />
                
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider block mb-1">
                  24/7 Telephone Line
                </span>
                
                <h3 className="text-2xl font-extrabold text-white">
                  Prefer to speak with us?
                </h3>
                
                <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                  Call directly anytime day or night. Our phone line is monitored 24 hours to take your call and dispatch assistance.
                </p>

                <div className="mt-6">
                  <a
                    href={`tel:${business.phoneRaw}`}
                    className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-base font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-lg active:scale-95 group"
                  >
                    <Phone className="w-5 h-5 fill-white group-hover:rotate-12 transition-transform" />
                    <span>Call {business.phone}</span>
                  </a>
                </div>

                <div className="mt-4 text-center">
                  <span className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    {business.hours || 'Open 24 hours a day'}
                  </span>
                </div>
              </div>

              {/* Verified Address & Details Card */}
              <div className="bg-white rounded-2xl p-7 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Business Information
                </h3>

                <div className="space-y-5 text-sm">
                  {/* Address */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">Dispatch Location:</span>
                      <span className="text-slate-600 block mt-0.5">{business.address}</span>
                      <span className="text-slate-600 block">{business.city}, {business.state} {business.zip}</span>
                      <span className="text-xs text-slate-400 block mt-0.5">{business.country}</span>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">Operating Hours:</span>
                      <span className="text-emerald-700 font-semibold block mt-0.5">{business.hours}</span>
                      <span className="text-xs text-slate-500 block">24/7 Telephone Response & Emergency Dispatch</span>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">Telephone Number:</span>
                      <a
                        href={`tel:${business.phoneRaw}`}
                        className="text-sky-700 font-bold hover:underline block mt-0.5 text-base"
                      >
                        {business.phone}
                      </a>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">Business Category:</span>
                      <span className="text-slate-600 block mt-0.5">{business.category}</span>
                      <span className="text-xs text-slate-500 block">Residential & Commercial Plumbing Service</span>
                    </div>
                  </div>
                </div>

                {/* Google Maps / Directions Helper */}
                <div className="pt-4 border-t border-slate-100">
                  <a
                    href={business.googleReviewsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-sky-700 hover:text-sky-800"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Find on Google Maps &rarr;</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

          </div>
        </div>
      </section>

      {/* Emergency Callout */}
      <EmergencyBanner />

    </div>
  );
}
