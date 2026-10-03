import { useState, useEffect } from 'react';
import { Star, MessageSquare, ExternalLink, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { BUSINESS_INFO } from '../data/business';
import { apiService, ReviewFeedback } from '../services/api';

export default function GoogleReviewsSection() {
  const [reviews, setReviews] = useState<ReviewFeedback[]>([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [form, setForm] = useState({
    authorName: '',
    serviceUsed: 'General Plumbing',
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
        setShowFeedbackModal(false);
        setForm({
          authorName: '',
          serviceUsed: 'General Plumbing',
          rating: 5,
          comments: '',
          locationArea: 'Sebring, FL',
        });
      }, 2000);
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="text-sky-400 font-bold text-xs uppercase tracking-wider">
            Customer Feedback & Reviews
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">
            See what customers are saying about All Service Plumbing of Central Florida.
          </h2>
          <p className="mt-3 text-slate-300 text-base leading-relaxed text-balance">
            We value genuine feedback from Florida homeowners and businesses we service in Sebring and Central Florida.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            <a
              href={BUSINESS_INFO.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 transition-all shadow-md active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>View Google Reviews</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <button
              type="button"
              onClick={() => setShowFeedbackModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-sky-400" />
              <span>Leave a Review</span>
            </button>
          </div>
        </div>

        {/* Reviews Container or Placeholder Showcase */}
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 shadow-sm flex flex-col justify-between"
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

                  <p className="text-sm text-slate-200 leading-relaxed italic mb-4">
                    "{rev.comments}"
                  </p>
                </div>

                <div className="border-t border-slate-700/80 pt-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{rev.authorName}</span>
                    <span className="text-slate-400">{rev.serviceUsed}</span>
                  </div>
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Customer
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Clean Informative Placeholder when no customer submitted reviews are stored yet */
          <div className="max-w-2xl mx-auto bg-slate-800/60 border border-slate-700/80 rounded-2xl p-8 text-center">
            <div className="w-12 h-12 bg-sky-500/10 text-sky-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 fill-sky-400/20 text-sky-400" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Official Google Reviews Integration
            </h3>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              We encourage all clients to review our service directly on Google. The link above takes you straight to our verified business profile.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-700 text-xs text-slate-400">
              Recently worked with All Service Plumbing in Sebring or Central Florida? Click "Leave a Review" to share your experience.
            </div>
          </div>
        )}

      </div>

      {/* Leave Review Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white text-slate-900 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <h3 className="text-xl font-bold text-slate-900">
              Submit Customer Review
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Share your experience with All Service Plumbing of Central Florida.
            </p>

            {submittedSuccess ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-slate-900">Review Submitted!</h4>
                <p className="text-xs text-slate-600 mt-1">Thank you for sharing your feedback.</p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David M."
                    value={form.authorName}
                    onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Service Received
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Water Heater Repair"
                      value={form.serviceUsed}
                      onChange={(e) => setForm({ ...form, serviceUsed: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Rating
                    </label>
                    <select
                      value={form.rating}
                      onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 bg-white"
                    >
                      <option value={5}>5 Stars - Outstanding</option>
                      <option value={4}>4 Stars - Great</option>
                      <option value={3}>3 Stars - Satisfactory</option>
                      <option value={2}>2 Stars - Needs Improvement</option>
                      <option value={1}>1 Star - Poor</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Location Area
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sebring, FL"
                    value={form.locationArea}
                    onChange={(e) => setForm({ ...form, locationArea: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Your Comments
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell us about the service you received..."
                    value={form.comments}
                    onChange={(e) => setForm({ ...form, comments: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackModal(false)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 transition-colors inline-flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Review</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
