import { Phone, Clock, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { BUSINESS_INFO } from '../data/business';
import ServiceRequestForm from '../components/ServiceRequestForm';
import EmergencyBanner from '../components/EmergencyBanner';

export default function RequestServicePage() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero */}
      <section className="bg-slate-900 text-white py-14 sm:py-18 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Open 24 Hours · Immediate Scheduling
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Request Plumbing Service
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-300 leading-relaxed text-balance">
              Schedule residential or commercial plumbing service in Sebring, FL and Central Florida. For immediate emergency response, call our 24/7 hotline directly.
            </p>

            <div className="mt-6 p-4 rounded-xl bg-slate-800/90 border border-slate-700 max-w-xl text-xs sm:text-sm text-slate-300 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Urgent Flooding or Burst Pipe?</span>
              </div>
              <a
                href={`tel:${BUSINESS_INFO.phoneRaw}`}
                className="font-bold text-emerald-400 hover:text-emerald-300 underline shrink-0"
              >
                Call {BUSINESS_INFO.phoneFormatted}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Request Form Area */}
      <section className="py-14 sm:py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ServiceRequestForm />
        </div>
      </section>

      {/* Emergency Callout */}
      <EmergencyBanner />

    </div>
  );
}
