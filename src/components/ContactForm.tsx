import { useState } from 'react';
import { Send, CheckCircle2, Phone, AlertCircle, Loader2 } from 'lucide-react';
import { BUSINESS_INFO, SERVICES } from '../data/business';
import { apiService } from '../services/api';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    serviceNeeded: 'Emergency Plumbing',
    preferredDate: '',
    preferredTime: 'Anytime',
    propertyType: 'Residential' as 'Residential' | 'Commercial',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Basic validation
    if (!formData.fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMsg('Please enter a phone number where we can reach you.');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiService.submitContact(formData);
      setIsSuccess(true);
    } catch {
      setErrorMsg('Unable to submit inquiry at this moment. Please call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 sm:p-10 text-center animate-in fade-in duration-300">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Thank You, {formData.fullName}!</h3>
        <p className="mt-2 text-slate-600 max-w-md mx-auto text-sm leading-relaxed">
          Your inquiry has been received by All Service Plumbing of Central Florida. A technician or dispatcher will follow up with you shortly.
        </p>

        <div className="mt-6 p-4 rounded-xl bg-white border border-emerald-100 max-w-sm mx-auto text-xs text-slate-600 text-left space-y-1">
          <div><span className="font-semibold text-slate-800">Service:</span> {formData.serviceNeeded}</div>
          <div><span className="font-semibold text-slate-800">Phone:</span> {formData.phone}</div>
          <div><span className="font-semibold text-slate-800">Property:</span> {formData.propertyType}</div>
        </div>

        <div className="mt-6 pt-4 border-t border-emerald-200/60 flex flex-col sm:flex-row items-center justify-center gap-3">
          <span className="text-xs text-slate-500">Need urgent immediate assistance?</span>
          <a
            href={`tel:${BUSINESS_INFO.phoneRaw}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-900 underline"
          >
            <Phone className="w-3.5 h-3.5" />
            Call {BUSINESS_INFO.phoneFormatted}
          </a>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsSuccess(false);
            setFormData({
              fullName: '',
              phone: '',
              email: '',
              serviceNeeded: 'Emergency Plumbing',
              preferredDate: '',
              preferredTime: 'Anytime',
              propertyType: 'Residential',
              message: '',
            });
          }}
          className="mt-6 inline-flex px-4 py-2 rounded-lg text-xs font-medium text-slate-700 bg-emerald-100 hover:bg-emerald-200 transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
      <div className="mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
          Request Service or Estimate
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Fill out the details below, or call our 24-hour line at <a href={`tel:${BUSINESS_INFO.phoneRaw}`} className="font-bold text-sky-700 underline">{BUSINESS_INFO.phoneFormatted}</a>.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="fullName"
              type="text"
              required
              placeholder="e.g. John Smith"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              required
              placeholder="(863) 555-0123"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
            />
          </div>
        </div>

        {/* Email & Service Needed */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="serviceNeeded" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Service Needed
            </label>
            <select
              id="serviceNeeded"
              value={formData.serviceNeeded}
              onChange={(e) => setFormData({ ...formData, serviceNeeded: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-colors"
            >
              {SERVICES.map((s) => (
                <option key={s.id} value={s.title}>
                  {s.title}
                </option>
              ))}
              <option value="Other Plumbing Need">Other Plumbing Need</option>
            </select>
          </div>
        </div>

        {/* Property Type Radio Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Property Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, propertyType: 'Residential' })}
              className={`py-2.5 px-4 rounded-lg text-sm font-semibold border text-center transition-colors ${
                formData.propertyType === 'Residential'
                  ? 'bg-sky-50 border-sky-600 text-sky-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Residential Property
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, propertyType: 'Commercial' })}
              className={`py-2.5 px-4 rounded-lg text-sm font-semibold border text-center transition-colors ${
                formData.propertyType === 'Commercial'
                  ? 'bg-sky-50 border-sky-600 text-sky-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Commercial Facility
            </button>
          </div>
        </div>

        {/* Preferred Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="preferredDate" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Preferred Date
            </label>
            <input
              id="preferredDate"
              type="date"
              value={formData.preferredDate}
              onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
            />
          </div>

          <div>
            <label htmlFor="preferredTime" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Preferred Time
            </label>
            <select
              id="preferredTime"
              value={formData.preferredTime}
              onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
            >
              <option value="Anytime">Anytime / First Available</option>
              <option value="Morning (8AM - 12PM)">Morning (8AM - 12PM)</option>
              <option value="Afternoon (12PM - 4PM)">Afternoon (12PM - 4PM)</option>
              <option value="Evening (4PM - 8PM)">Evening (4PM - 8PM)</option>
              <option value="24/7 Urgent Immediate">Urgent Emergency (Immediate)</option>
            </select>
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Describe the Plumbing Issue
          </label>
          <textarea
            id="message"
            rows={3}
            placeholder="Tell us what's happening (e.g. leaking line under kitchen sink, clogged bathtub, water heater making noise)..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
          />
        </div>

        {/* Primary CTA Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-bold text-white bg-sky-600 hover:bg-sky-500 disabled:bg-sky-400 transition-all shadow-md shadow-sky-900/10 active:scale-98"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Sending Request...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Request Plumbing Service</span>
            </>
          )}
        </button>

        <p className="text-center text-xs text-slate-500 pt-1">
          Open 24 hours · We respect your privacy and will never share your contact details.
        </p>
      </form>
    </div>
  );
}
