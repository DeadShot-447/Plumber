import React, { createContext, useContext, useState, useEffect } from 'react';
import { BUSINESS_INFO, SERVICES as DEFAULT_SERVICES, GENERAL_FAQS as DEFAULT_FAQS } from '../data/business';

export interface NavItem {
  id: string;
  name: string;
  href: string;
  enabled: boolean;
  order: number;
}

export interface WebsiteContentData {
  business: {
    name: string;
    shortName: string;
    subtitle: string;
    category: string;
    phone: string;
    phoneRaw: string;
    phoneFormatted: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    fullAddress: string;
    hours: string;
    hoursDetail: string;
    googleReviewsUrl: string;
  };
  home: {
    heroHeadline: string;
    heroSupportingText: string;
    heroPrimaryCtaText: string;
    heroSecondaryCtaText: string;
    heroImageUrl: string;
    emergencyHeadline: string;
    emergencyText: string;
    whyChooseUsHeadline: string;
    whyChooseUsSubtext: string;
  };
  about: {
    aboutHeroHeadline: string;
    aboutHeroSubtext: string;
    localServiceTitle: string;
    localServiceText: string;
    residentialCommercialText: string;
    serviceApproachText: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogTitle: string;
    ogDescription: string;
    keywords: string;
  };
  navigation: NavItem[];
}

export interface LiveService {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  imageUrl?: string;
  enabled: boolean;
  order?: number;
  commonProblems: string[];
  serviceScope: string[];
  benefits: string[];
  faqs: { question: string; answer: string }[];
}

export interface LiveFAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order: number;
  enabled: boolean;
}

interface ContentContextType {
  content: WebsiteContentData;
  services: LiveService[];
  faqs: LiveFAQ[];
  isLoading: boolean;
  refreshContent: () => Promise<void>;
}

const DEFAULT_CONTENT: WebsiteContentData = {
  business: {
    ...BUSINESS_INFO,
    shortName: BUSINESS_INFO.shortName,
    subtitle: BUSINESS_INFO.subtitle,
    category: BUSINESS_INFO.category,
    phone: BUSINESS_INFO.phone,
    phoneRaw: BUSINESS_INFO.phoneRaw,
    phoneFormatted: BUSINESS_INFO.phoneFormatted,
    address: BUSINESS_INFO.address,
    city: BUSINESS_INFO.city,
    state: BUSINESS_INFO.state,
    zip: BUSINESS_INFO.zip,
    country: BUSINESS_INFO.country,
    fullAddress: BUSINESS_INFO.fullAddress,
    hours: BUSINESS_INFO.hours,
    hoursDetail: BUSINESS_INFO.hoursDetail,
    googleReviewsUrl: BUSINESS_INFO.googleReviewsUrl,
  },
  home: {
    heroHeadline: 'Reliable Plumbing Services in Central Florida',
    heroSupportingText: 'Professional plumbing service for homes and businesses throughout Sebring and Central Florida.',
    heroPrimaryCtaText: `Call ${BUSINESS_INFO.phoneFormatted}`,
    heroSecondaryCtaText: 'Request Service',
    heroImageUrl: '/src/assets/images/hero_plumbing_service_1791015140754.jpg',
    emergencyHeadline: 'Plumbing Emergency?',
    emergencyText: "Don't wait for a small plumbing problem to become a major issue. Contact All Service Plumbing for professional service.",
    whyChooseUsHeadline: 'Why Customers Choose All Service Plumbing',
    whyChooseUsSubtext: 'When plumbing troubles occur in Sebring or Central Florida, you need a local team that is accessible, responsive, and equipped for residential and commercial systems.',
  },
  about: {
    aboutHeroHeadline: 'About All Service Plumbing of Central Florida, Inc.',
    aboutHeroSubtext: 'Dedicated to delivering dependable, 24-hour residential and commercial plumbing services to homes and businesses in Sebring and Central Florida.',
    localServiceTitle: 'Local Plumbing Service for Sebring & Central Florida',
    localServiceText: 'Centrally based in Highlands County, allowing our technicians to promptly reach residential neighborhoods, municipal facilities, and commercial centers across Central Florida.',
    residentialCommercialText: 'Equipped to handle everything from residential sink and water heater leaks to large commercial facilities and business restroom systems.',
    serviceApproachText: '24-hour telephone dispatch, accurate diagnostic procedures, and durable repairs that prevent recurring water issues.',
  },
  seo: {
    metaTitle: 'Plumber in Sebring, FL | All Service Plumbing of Central Florida',
    metaDescription: 'All Service Plumbing of Central Florida, Inc. provides professional plumbing services in Sebring, Florida. Contact us 24 hours a day for plumbing service.',
    ogTitle: 'Plumber in Sebring, FL | All Service Plumbing of Central Florida',
    ogDescription: 'All Service Plumbing of Central Florida, Inc. provides professional plumbing services in Sebring, Florida. Contact us 24 hours a day for plumbing service.',
    keywords: 'Plumber Sebring FL, Emergency Plumbing Central Florida, Water Heater Repair Sebring, Drain Cleaning Sebring Florida',
  },
  navigation: [
    { id: 'nav-1', name: 'Home', href: '/', enabled: true, order: 1 },
    { id: 'nav-2', name: 'About', href: '/about', enabled: true, order: 2 },
    { id: 'nav-3', name: 'Services', href: '/services', enabled: true, order: 3 },
    { id: 'nav-4', name: 'Service Areas', href: '/service-areas', enabled: true, order: 4 },
    { id: 'nav-5', name: 'Reviews', href: '/reviews', enabled: true, order: 5 },
    { id: 'nav-6', name: 'Contact', href: '/contact', enabled: true, order: 6 },
  ],
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<WebsiteContentData>(DEFAULT_CONTENT);
  const [services, setServices] = useState<LiveService[]>(DEFAULT_SERVICES as any);
  const [faqs, setFaqs] = useState<LiveFAQ[]>(
    DEFAULT_FAQS.map((f, i) => ({ id: `faq-${i + 1}`, ...f, order: i + 1, enabled: true }))
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchLiveContent = async () => {
    try {
      // 1. Fetch content
      const contentRes = await fetch('/api/public/content');
      if (contentRes.ok) {
        const cData = await contentRes.json();
        if (cData.content) {
          setContent(cData.content);
        }
      }

      // 2. Fetch services
      const servicesRes = await fetch('/api/public/services');
      if (servicesRes.ok) {
        const sData = await servicesRes.json();
        if (sData.services && sData.services.length > 0) {
          setServices(sData.services);
        }
      }

      // 3. Fetch FAQs
      const faqsRes = await fetch('/api/public/faqs');
      if (faqsRes.ok) {
        const fData = await faqsRes.json();
        if (fData.faqs && fData.faqs.length > 0) {
          setFaqs(fData.faqs);
        }
      }
    } catch (err) {
      console.warn('Could not fetch live website content from API, using defaults.', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveContent();
  }, []);

  return (
    <ContentContext.Provider value={{ content, services, faqs, isLoading, refreshContent: fetchLiveContent }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useWebsiteContent = (): ContentContextType => {
  const context = useContext(ContentContext);
  if (!context) {
    return {
      content: DEFAULT_CONTENT,
      services: DEFAULT_SERVICES as any,
      faqs: DEFAULT_FAQS.map((f, i) => ({ id: `faq-${i + 1}`, ...f, order: i + 1, enabled: true })),
      isLoading: false,
      refreshContent: async () => {},
    };
  }
  return context;
};
