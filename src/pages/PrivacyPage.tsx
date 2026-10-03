import { Link } from 'react-router-dom';
import { BUSINESS_INFO } from '../data/business';

export default function PrivacyPage() {
  return (
    <div className="py-16 sm:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-xs">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500 mb-8">
          Last Updated: 2026 · {BUSINESS_INFO.name}
        </p>

        <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">1. Information We Collect</h2>
            <p>
              When you contact {BUSINESS_INFO.name} via telephone, contact form, or service request form, we may collect your name, phone number, email address, physical service address, and plumbing problem description. This information is gathered solely to respond to your inquiry and deliver plumbing services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">2. How We Use Your Information</h2>
            <p>
              We use the collected information exclusively to:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Dispatch plumbing technicians to your Sebring or Central Florida address.</li>
              <li>Communicate service appointment confirmations, updates, and estimates.</li>
              <li>Respond to direct inquiries submitted via our contact forms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">3. Information Sharing and Disclosure</h2>
            <p>
              We do not sell, rent, or trade your personal information to third parties. We do not use your phone number for unsolicited marketing or robo-calls. Your contact details are shared only with our internal dispatchers and technicians assigned to your plumbing service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">4. Data Security</h2>
            <p>
              We maintain physical and electronic procedures designed to protect your personal details from unauthorized access or alteration.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">5. Contact Us</h2>
            <p>
              If you have questions regarding this Privacy Policy or how your service information is handled, contact us at:
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
