import { useState, useEffect } from 'react';
import { Star, MessageSquare, ExternalLink, Send, CheckCircle2, ShieldCheck, HeartHandshake, Phone } from 'lucide-react';
import { BUSINESS_INFO } from '../data/business';
import { apiService, ReviewFeedback } from '../services/api';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewFeedback[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    authorName: '',
    serviceUsed: 'Emergency Plumbing',
    rating: 5,
    comments: '',
    locationArea: 'Sebring, FL',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    setReviews(apiService.getReviews());
  }, []);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.authorName.trim() || !form.comments.trim()) return;

    setIsSubmitting(true);
    try {
      await apiService.submitCustomerFeedback(form);
      setReviews(apiService.getReviews());
      setSubmittedSuccess(true);
      setTimeout(() => {
        setSubmittedSuccess(false);
        setShowForm(false);
        setForm({
          authorName: '',
          serviceUsed: 'Emergency Plumbing',
          rating: 5,
          comments: '',
          locationArea: 'Sebring, FL',
        });
      }, 2500);
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Reviews Page Hero */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-sky-400 font-bold text-xs uppercase tracking-wider">
              Customer Feedback
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-2 tracking-tight">
              Customer Reviews & Feedback
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed text-balance">
              See what customers are saying about All Service Plumbing of Central Florida, Inc. We value transparent feedback from every home and business we assist.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a
                href={BUSINESS_INFO.googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 transition-all shadow-md active:scale-95"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>View Google Reviews</span>
                <ExternalLink className="w-4 h-4 text-slate-500" />
              </a>

              <button
                type="button"
                onClick={() => setShowForm(!showForm)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{showForm ? 'Close Feedback Form' : 'Leave a Review'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Review Summary Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              
              <div className="space-y-2 md:border-r md:border-slate-200 md:pr-8">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Official Platform</span>
                <h3 className="text-xl font-bold text-slate-900">Google Verified Reviews</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We invite our customers to post directly to our Google Business Profile to help other Sebring property owners make informed decisions.
                </p>
                <div className="pt-2">
                  <a
                    href={BUSINESS_INFO.googleReviewsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-800 underline"
                  >
                    <span>Open Official Google Review Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="space-y-2 md:border-r md:border-slate-200 md:pr-8">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Service Dedication</span>
                <h3 className="text-xl font-bold text-slate-900">Verified Service Feedback</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every service call—from emergency line unclogging to full fixture installations—is handled with precision and care.
                </p>
                <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5 pt-2">
                  <HeartHandshake className="w-4 h-4" />
                  <span>100% Focused on Customer Satisfaction</span>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Need Service Now?</span>
                <h3 className="text-xl font-bold text-slate-900">24/7 Telephone Support</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Speak directly with our team to schedule service or request emergency plumbing in Sebring.
                </p>
                <a
                  href={`tel:${BUSINESS_INFO.phoneRaw}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call {BUSINESS_INFO.phoneFormatted}</span>
                </a>
              </div>

            </div>
          </div>

          {/* Collapsible Customer Feedback Form */}
          {showForm && (
            <div className="bg-white border border-sky-200 rounded-2xl p-6 sm:p-8 shadow-md max-w-2xl mx-auto animate-in fade-in duration-200">
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                Leave Customer Feedback
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Tell us about your recent plumbing service experience with All Service Plumbing.
              </p>

              {submittedSuccess ? (
                <div className="py-6 text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                  <h4 className="text-lg font-bold text-slate-900">Thank You For Your Review!</h4>
                  <p className="text-xs text-slate-600 mt-1">Your feedback has been submitted successfully.</p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={form.authorName}
                      onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Service Provided
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Drain Cleaning, Leak Repair"
                        value={form.serviceUsed}
                        onChange={(e) => setForm({ ...form, serviceUsed: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Rating
                      </label>
                      <select
                        value={form.rating}
                        onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 bg-white"
                      >
                        <option value={5}>5 Stars - Excellent Service</option>
                        <option value={4}>4 Stars - Very Good</option>
                        <option value={3}>3 Stars - Good</option>
                        <option value={2}>2 Stars - Fair</option>
                        <option value={1}>1 Star - Poor</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Location / City
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sebring, FL"
                      value={form.locationArea}
                      onChange={(e) => setForm({ ...form, locationArea: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Review / Comments <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Share your experience with our plumbing work, punctuality, and responsiveness..."
                      value={form.comments}
                      onChange={(e) => setForm({ ...form, comments: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-lg text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 transition-colors inline-flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Feedback</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Customer Feedback List or Informational Placeholder */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-6">
              Recent Customer Experiences
            </h3>

            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400" />
                          ))}
                        </div>
                        <span className="text-xs text-slate-400">{rev.locationArea}</span>
                      </div>

                      <p className="text-sm text-slate-700 leading-relaxed italic mb-4">
                        "{rev.comments}"
                      </p>
                    </div>

                    <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block">{rev.authorName}</span>
                        <span className="text-slate-500">{rev.serviceUsed}</span>
                      </div>
                      <span className="text-emerald-600 font-medium flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center max-w-2xl mx-auto">
                <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 fill-sky-200 text-sky-600" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">
                  Google Business Profile Connection
                </h4>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  We invite our clients to write reviews directly on Google. The button at the top of the page links directly to Google Reviews for All Service Plumbing of Central Florida, Inc.
                </p>
                <div className="mt-5">
                  <a
                    href={BUSINESS_INFO.googleReviewsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <span>View All Service Plumbing on Google</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}
