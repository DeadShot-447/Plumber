import { useState } from 'react';
import { ChevronDown, HelpCircle, Phone } from 'lucide-react';
import { BUSINESS_INFO, GENERAL_FAQS } from '../data/business';
import { useWebsiteContent } from '../context/ContentContext';

interface FAQSectionProps {
  customFaqs?: { question: string; answer: string }[];
  title?: string;
  subtitle?: string;
}

export default function FAQSection({
  customFaqs,
  title = "Frequently Asked Questions",
  subtitle = "Find quick answers regarding our 24-hour plumbing services in Sebring and Central Florida."
}: FAQSectionProps) {
  const { faqs: liveFaqs, content } = useWebsiteContent();
  const business = content?.business || BUSINESS_INFO;

  const faqs = customFaqs || (liveFaqs && liveFaqs.length > 0 ? liveFaqs.filter(f => f.enabled) : GENERAL_FAQS);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed text-balance">
            {subtitle}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-slate-200 rounded-xl overflow-hidden transition-colors duration-150"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full text-left px-6 py-4.5 bg-white hover:bg-slate-50/80 flex items-center justify-between gap-4 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-500"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-bold text-slate-900 pr-2">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-sky-100 text-sky-700' : 'text-slate-500'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center sm:flex sm:items-center sm:justify-between gap-6">
          <div className="text-left mb-4 sm:mb-0">
            <h4 className="text-base font-bold text-slate-900">Have a specific plumbing inquiry?</h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Speak directly with our team 24 hours a day for immediate answers.
            </p>
          </div>

          <a
            href={`tel:${business.phoneRaw}`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shrink-0"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>Call {business.phoneFormatted}</span>
          </a>
        </div>

      </div>
    </section>
  );
}
