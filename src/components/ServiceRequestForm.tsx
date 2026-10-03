import { useState } from 'react';
import { Send, CheckCircle2, Phone, AlertCircle, Loader2, Calendar, Clock, MapPin } from 'lucide-react';
import { BUSINESS_INFO, SERVICES } from '../data/business';
import { apiService } from '../services/api';

export default function ServiceRequestForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceType: 'Emergency Plumbing',
    address: '',
    propertyType: 'Residential' as 'Residential' | 'Commercial',
    description: '',
    preferredDate: '',
    preferredTime: 'Morning (8AM - 12PM)',
    urgency: 'Within 48 Hours' as 'Emergency (Immediate)' | 'Today' | 'Within 48 Hours' | 'Flexible',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ id: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.name.trim()) {
      setErrorMsg('Please enter your contact name.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMsg('Please provide a reliable phone number.');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMsg('Please provide the service property address or neighborhood.');
      return;
    }
    if (!formData.description.trim()) {
      setErrorMsg('Please briefly describe the plumbing problem.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiService.submitServiceRequest(formData);
      setSubmittedData({ id: res.orderNumber || res.id });
    } catch {
      setErrorMsg('An error occurred while submitting your service request. Please call us directly at ' + BUSINESS_INFO.phoneFormatted);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedData) {
    return (
      <div className="bg-white border border-emerald-200 rounded-2xl p-8 sm:p-12 shadow-sm text-center animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Request Confirmed · Reference #{submittedData.id}
        </span>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-4">
          Service Request Received
        </h3>

        <p className="mt-3 text-slate-600 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
          Thank you, <strong className="text-slate-900">{formData.name}</strong>. All Service Plumbing of Central Florida, Inc. has logged your service request. Our dispatch team is reviewing your details.
        </p>

        {/* Summary Card */}
        <div className="mt-8 max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-xl p-5 text-left text-xs sm:text-sm space-y-2.5">
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Service Category:</span>
            <span className="font-bold text-slate-900">{formData.serviceType}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Property Type:</span>
            <span className="font-semibold text-slate-800">{formData.propertyType}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Contact Phone:</span>
            <span className="font-semibold text-slate-800">{formData.phone}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Service Address:</span>
            <span className="font-semibold text-slate-800">{formData.address}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Urgency:</span>
            <span className="font-bold text-sky-700">{formData.urgency}</span>
          </div>
        </div>

        <div className="mt-8 p-5 bg-sky-50 rounded-xl border border-sky-100 max-w-lg mx-auto">
          <p className="text-xs sm:text-sm text-sky-950 font-medium">
            Is this an urgent flooding or burst pipe emergency?
          </p>
          <a
            href={`tel:${BUSINESS_INFO.phoneRaw}`}
            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>Call 24/7: {BUSINESS_INFO.phoneFormatted}</span>
          </a>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={() => {
              setSubmittedData(null);
              setFormData({
                name: '',
                phone: '',
                email: '',
                serviceType: 'Emergency Plumbing',
                address: '',
                propertyType: 'Residential',
                description: '',
                preferredDate: '',
                preferredTime: 'Morning (8AM - 12PM)',
                urgency: 'Within 48 Hours',
              });
            }}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline transition-colors"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm">
      <div className="border-b border-slate-200 pb-6 mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Request Plumbing Service
        </h2>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          Provide your plumbing details below to schedule service in Sebring or Central Florida. For immediate emergency dispatch, call <a href={`tel:${BUSINESS_INFO.phoneRaw}`} className="font-bold text-emerald-600 hover:underline">{BUSINESS_INFO.phoneFormatted}</a>.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Customer Contact Info */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-sky-800 mb-3 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 inline-flex items-center justify-center text-xs">1</span>
            Contact Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="req-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="req-name"
                type="text"
                required
                placeholder="First & Last Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div>
              <label htmlFor="req-phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                id="req-phone"
                type="tel"
                required
                placeholder="(863) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div>
              <label htmlFor="req-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                id="req-email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Property & Service Type */}
        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-sky-800 mb-3 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 inline-flex items-center justify-center text-xs">2</span>
            Service & Property Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="req-service" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Service Type <span className="text-red-500">*</span>
              </label>
              <select
                id="req-service"
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
              >
                {SERVICES.map((s) => (
                  <option key={s.id} value={s.title}>{s.title}</option>
                ))}
                <option value="General Plumbing Inquiry">General Plumbing Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Property Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, propertyType: 'Residential' })}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                    formData.propertyType === 'Residential'
                      ? 'bg-sky-50 border-sky-600 text-sky-800'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Residential
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, propertyType: 'Commercial' })}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                    formData.propertyType === 'Commercial'
                      ? 'bg-sky-50 border-sky-600 text-sky-800'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Commercial
                </button>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="req-address" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Service Address / Location in Sebring or Central Florida <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                id="req-address"
                type="text"
                required
                placeholder="e.g. 123 Lake View St, Sebring, FL 33870"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Urgency & Scheduling */}
        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-sky-800 mb-3 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 inline-flex items-center justify-center text-xs">3</span>
            Urgency & Scheduling Preferences
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="req-urgency" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Urgency Level
              </label>
              <select
                id="req-urgency"
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
              >
                <option value="Emergency (Immediate)">Emergency (Immediate Dispatch)</option>
                <option value="Today">Today</option>
                <option value="Within 48 Hours">Within 48 Hours</option>
                <option value="Flexible">Flexible / Upcoming Project</option>
              </select>
            </div>

            <div>
              <label htmlFor="req-date" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Preferred Date
              </label>
              <div className="relative">
                <input
                  id="req-date"
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="req-time" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Preferred Time
              </label>
              <select
                id="req-time"
                value={formData.preferredTime}
                onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
              >
                <option value="Morning (8AM - 12PM)">Morning (8AM - 12PM)</option>
                <option value="Afternoon (12PM - 4PM)">Afternoon (12PM - 4PM)</option>
                <option value="Evening (4PM - 8PM)">Evening (4PM - 8PM)</option>
                <option value="Anytime (24 Hours)">Anytime (24 Hours Open)</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="req-desc" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Description of Plumbing Problem <span className="text-red-500">*</span>
            </label>
            <textarea
              id="req-desc"
              rows={4}
              required
              placeholder="Describe the issue in detail (e.g. water leaking under heater, backed up toilet, low pressure, slab moisture)..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold text-white bg-sky-600 hover:bg-sky-500 disabled:bg-sky-400 transition-all shadow-md shadow-sky-900/10 active:scale-98"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing Service Request...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Submit Service Request</span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Open 24 hours for urgent dispatch</span>
          </div>
          <div>
            Direct Dispatch Phone: <a href={`tel:${BUSINESS_INFO.phoneRaw}`} className="font-bold text-slate-900">{BUSINESS_INFO.phoneFormatted}</a>
          </div>
        </div>
      </form>
    </div>
  );
}
