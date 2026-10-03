import { Link } from 'react-router-dom';
import { BUSINESS_INFO } from '../data/business';

export default function TermsPage() {
  return (
    <div className="py-16 sm:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-xs">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-500 mb-8">
          Effective: 2026 · {BUSINESS_INFO.name}
        </p>

        <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">1. Agreement to Terms</h2>
            <p>
              By accessing the website of {BUSINESS_INFO.name} or requesting plumbing services via telephone or online submission forms, you agree to these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">2. Plumbing Services & Availability</h2>
            <p>
              {BUSINESS_INFO.name} provides residential and commercial plumbing services in Sebring, Florida and Central Florida. Services are offered 24 hours a day subject to technician dispatch availability and safety conditions. While we strive to provide rapid emergency dispatch, actual arrival times vary according to traffic, severe weather, and prior emergency commitments.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">3. Estimates and Work Authorization</h2>
            <p>
              Initial estimates provided by phone are preliminary assessments based on customer-provided symptoms. Final quotes require physical on-site diagnostic inspection by a qualified plumbing technician. No repairs proceed without homeowner or authorized commercial agent approval.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">4. Property Access and Safety</h2>
            <p>
              The property owner or authorized representative must provide reasonable and safe physical access to plumbing fixtures, main water shut-off valves, cleanouts, water heaters, and utility spaces required to perform diagnostic or repair tasks safely.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">5. Governing Law</h2>
            <p>
              These Terms of Service are governed by and construed in accordance with the laws of the State of Florida.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">6. Contact Information</h2>
            <p>
              For legal or service inquiries:
            </p>
            <div className="mt-2 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <strong className="block text-slate-900">{BUSINESS_INFO.name}</strong>
              <span>{BUSINESS_INFO.address}, {BUSINESS_INFO.city}, {BUSINESS_INFO.state} {BUSINESS_INFO.zip}</span>
              <span className="block mt-1">Phone: {BUSINESS_INFO.phone}</span>
            </div>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200">
          <Link to="/" className="text-xs font-bold text-sky-700 hover:text-sky-800">
            &larr; Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
