import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export type UserRole = 'Super Admin' | 'Admin' | 'Staff';
export type UserStatus = 'active' | 'disabled';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  lastLoginAt?: string;
}

export type OrderStatus = 'Pending' | 'Assigned' | 'In Progress' | 'Completed' | 'Cancelled';

export interface OrderRecord {
  id: string;
  orderNumber: string;
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  address: string;
  propertyType: 'Residential' | 'Commercial';
  description: string;
  preferredDate: string;
  preferredTime: string;
  urgency: 'Emergency (Immediate)' | 'Today' | 'Within 48 Hours' | 'Flexible';
  createdAt: string;
  status: OrderStatus;
  assignedTechnician?: string;
  internalNotes?: string;
  estimatedCost?: string;
}

export interface ServiceRecord {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  imageUrl?: string;
  enabled: boolean;
  commonProblems: string[];
  serviceScope: string[];
  benefits: string[];
  faqs: { question: string; answer: string }[];
  order: number;
}

export interface NavItem {
  id: string;
  name: string;
  href: string;
  enabled: boolean;
  order: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order: number;
  enabled: boolean;
}

export interface WebsiteContent {
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

const DATA_DIR = path.resolve(process.cwd(), '.data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const SERVICES_FILE = path.join(DATA_DIR, 'services.json');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');
const FAQS_FILE = path.join(DATA_DIR, 'faqs.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial legitimate Super Admin account (No demo or fake users!)
const INITIAL_SUPER_ADMIN: UserRecord[] = [
  {
    id: 'usr-admin-master',
    name: 'Super Admin',
    email: 'superadmin@allserviceplumbing.com',
    passwordHash: '$2b$10$89oQx2i4WgrTe0K1ei3oIuQIbYUK2GhtTxxUlQM5k8LXPVXuouc6C', // AllService@Sebring2026!
    role: 'Super Admin',
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z',
  }
];

const INITIAL_NAVIGATION: NavItem[] = [
  { id: 'nav-1', name: 'Home', href: '/', enabled: true, order: 1 },
  { id: 'nav-2', name: 'About', href: '/about', enabled: true, order: 2 },
  { id: 'nav-3', name: 'Services', href: '/services', enabled: true, order: 3 },
  { id: 'nav-4', name: 'Service Areas', href: '/service-areas', enabled: true, order: 4 },
  { id: 'nav-5', name: 'Reviews', href: '/reviews', enabled: true, order: 5 },
  { id: 'nav-6', name: 'Contact', href: '/contact', enabled: true, order: 6 },
];

const INITIAL_CONTENT: WebsiteContent = {
  business: {
    name: 'All Service Plumbing of Central Florida, Inc.',
    shortName: 'All Service Plumbing',
    subtitle: 'of Central Florida, Inc.',
    category: 'Plumber',
    phone: '+1 863-991-5702',
    phoneRaw: '+18639915702',
    phoneFormatted: '(863) 991-5702',
    address: '4305 Grand Concourse',
    city: 'Sebring',
    state: 'FL',
    zip: '33875',
    country: 'United States',
    fullAddress: '4305 Grand Concourse, Sebring, FL 33875',
    hours: 'Open 24 hours',
    hoursDetail: '24/7 Emergency & Scheduled Plumbing Service',
    googleReviewsUrl: 'https://www.google.com/maps/search/?api=1&query=All+Service+Plumbing+of+Central+Florida+Inc+Sebring+FL',
  },
  home: {
    heroHeadline: 'Reliable Plumbing Services in Central Florida',
    heroSupportingText: 'Professional plumbing service for homes and businesses throughout Sebring and Central Florida.',
    heroPrimaryCtaText: 'Call (863) 991-5702',
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
    keywords: 'Plumber Sebring FL, Emergency Plumbing Central Florida, Water Heater Repair Sebring, Drain Cleaning Sebring Florida, Commercial Plumber Sebring',
  },
  navigation: INITIAL_NAVIGATION,
};

const INITIAL_SERVICES: ServiceRecord[] = [
  {
    id: "emergency-plumbing",
    slug: "emergency-plumbing",
    title: "Emergency Plumbing",
    shortDescription: "24-hour rapid response for urgent plumbing issues throughout Sebring and Central Florida.",
    fullDescription: "Plumbing emergencies can strike at any hour of the day or night. All Service Plumbing of Central Florida provides 24-hour service to address urgent residential and commercial plumbing failures before water damage worsens.",
    iconName: "Flame",
    imageUrl: "/src/assets/images/hero_plumbing_service_1791015140754.jpg",
    enabled: true,
    order: 1,
    commonProblems: [
      "Burst or ruptured supply pipes",
      "Severe active water leaks flooding floors",
      "Complete sewer or toilet backups",
      "Loss of essential water supply to home or business",
      "Overflowing commercial or residential fixtures"
    ],
    serviceScope: [
      "Emergency shutoff and immediate containment",
      "Rapid leak isolation and pipe stabilization",
      "Urgent drain clearing and obstruction removal",
      "Assessment of water damage risks and system restoration",
      "Comprehensive follow-up recommendations"
    ],
    benefits: [
      "Open 24 hours for immediate phone assistance",
      "Fast response throughout Sebring and Central Florida",
      "Residential and commercial equipment on hand",
      "Minimizes structural water damage"
    ],
    faqs: [
      {
        question: "Are emergency plumbing services available 24 hours?",
        answer: "Yes, All Service Plumbing of Central Florida, Inc. is open 24 hours a day to take your call at +1 863-991-5702."
      }
    ]
  },
  {
    id: "leak-repair",
    slug: "leak-repair",
    title: "Leak Repair",
    shortDescription: "Professional repair for leaking pipes, valves, slab lines, and connection points.",
    fullDescription: "Water leaks can quietly cause structural deterioration and spike utility bills. Our technicians identify the exact source of pipe failure and execute durable, professional repairs.",
    iconName: "Droplets",
    imageUrl: "/src/assets/images/plumber_work_tools_1791015154794.jpg",
    enabled: true,
    order: 2,
    commonProblems: [
      "Dripping pipe joints under sinks or behind walls",
      "Unexplained moisture along baseboards or flooring",
      "Sudden increases in municipal water bills",
      "Corroded copper, PVC, or galvanized fittings"
    ],
    serviceScope: [
      "Visual and instrument inspection of accessible piping",
      "Precision cut-out and replacement of damaged pipe sections",
      "Valve replacement and joint refitting"
    ],
    benefits: [
      "Protects home framing and subfloors from moisture damage",
      "Prevents mold proliferation caused by chronic dampness",
      "Restores normal water pressure and reduces utility waste"
    ],
    faqs: [
      {
        question: "How do I know if I have a hidden water leak?",
        answer: "Common signs include damp spots on walls, warm flooring areas, or sudden spikes in water bills."
      }
    ]
  },
  {
    id: "leak-detection",
    slug: "leak-detection",
    title: "Leak Detection",
    shortDescription: "Specialized detection techniques to pinpoint concealed leaks in walls, slabs, and underground lines.",
    fullDescription: "Concealed leaks behind drywall or beneath concrete slabs require careful diagnostic evaluation. We locate hidden water loss points with minimal property disruption.",
    iconName: "Search",
    imageUrl: "/src/assets/images/plumber_work_tools_1791015154794.jpg",
    enabled: true,
    order: 3,
    commonProblems: [
      "Water meter running continuously when all faucets are shut",
      "Spongy or discolored flooring",
      "Drop in household water pressure"
    ],
    serviceScope: [
      "Systematic pressure testing of domestic supply lines",
      "Targeted acoustic and thermal inspection methods",
      "Mapping underground and under-slab pipe runs"
    ],
    benefits: [
      "Eliminates unnecessary wall or slab destruction",
      "Detects microscopic leaks before catastrophic ruptures occur"
    ],
    faqs: [
      {
        question: "Can you locate leaks under concrete slabs?",
        answer: "Yes, professional leak detection techniques allow plumbers to locate pressurized supply leaks under concrete slabs."
      }
    ]
  },
  {
    id: "drain-cleaning",
    slug: "drain-cleaning",
    title: "Drain Cleaning",
    shortDescription: "Thorough drain clearing for slow or completely stopped sinks, showers, and main lines.",
    fullDescription: "Stubborn clogs in kitchen, bathroom, and utility lines interrupt your daily routine. We utilize professional-grade cabling and clearing tools to restore free-flowing drainage.",
    iconName: "Sparkles",
    imageUrl: "/src/assets/images/plumber_work_tools_1791015154794.jpg",
    enabled: true,
    order: 4,
    commonProblems: [
      "Slow-draining kitchen sinks with food residue accumulation",
      "Bathroom tubs and showers backing up with standing water",
      "Gurgling sounds emanating from drain traps"
    ],
    serviceScope: [
      "Mechanical motorized drain snaking and cabling",
      "Removal of grease, soap scum, hair, and scale buildup",
      "Trap cleaning and cleanout access servicing"
    ],
    benefits: [
      "Immediate restoration of drainage function",
      "Safer for pipes than caustic chemical drain cleaners"
    ],
    faqs: [
      {
        question: "Why should I avoid chemical drain cleaners?",
        answer: "Chemical cleaners contain harsh acids or lye that can corrode older pipes and damage plumbing seals."
      }
    ]
  },
  {
    id: "water-heaters",
    slug: "water-heaters",
    title: "Water Heater Services",
    shortDescription: "Repair, replacement, and maintenance for traditional tank and tankless water heaters.",
    fullDescription: "Consistent hot water is essential for your family or commercial facility. All Service Plumbing handles diagnostics, heating element service, valve replacements, and complete water heater installations in Central Florida.",
    iconName: "Thermometer",
    imageUrl: "/src/assets/images/water_heater_inspection_1791015172595.jpg",
    enabled: true,
    order: 5,
    commonProblems: [
      "Lack of hot water or water taking too long to heat",
      "Rusty, discolored, or foul-smelling hot water",
      "Water pooling around the base of the water heater"
    ],
    serviceScope: [
      "Thermostat, heating element, and thermocouple diagnostics",
      "Temperature and pressure relief (T&P) valve inspection",
      "Sediment flush and new water heater installation"
    ],
    benefits: [
      "Reliable hot water for sanitation, cooking, and bathing",
      "Improved energy efficiency and lower utility operating costs"
    ],
    faqs: [
      {
        question: "How can I request water heater service?",
        answer: "You can call us directly at +1 863-991-5702 anytime, or submit an online service request."
      }
    ]
  },
  {
    id: "pipe-repair",
    slug: "pipe-repair",
    title: "Pipe Repair & Replacement",
    shortDescription: "Complete repiping, sectional pipe repairs, and corrosion remediation for water systems.",
    fullDescription: "Aging, corroded, or damaged piping threatens the structural soundness of your property. We replace brittle pipes with modern, durable materials suitable for Central Florida water conditions.",
    iconName: "Wrench",
    imageUrl: "/src/assets/images/plumber_work_tools_1791015154794.jpg",
    enabled: true,
    order: 6,
    commonProblems: [
      "Pin-hole leaks appearing across aging copper lines",
      "Discolored water caused by interior pipe corrosion",
      "Low water pressure throughout the entire building"
    ],
    serviceScope: [
      "Sectional pipe replacement and coupling installations",
      "Whole-home and commercial water line repiping",
      "Installation of durable PEX or copper piping"
    ],
    benefits: [
      "Eliminates repeated costly sectional leak repairs",
      "Delivers clean, clear water with consistent flow"
    ],
    faqs: [
      {
        question: "What types of piping do you work with?",
        answer: "Our technicians handle copper, PEX, PVC, CPVC, and standard commercial and residential water piping."
      }
    ]
  },
  {
    id: "sewer-services",
    slug: "sewer-services",
    title: "Sewer & Drain Services",
    shortDescription: "Main sewer line clearing, diagnostic inspections, and line rehabilitation.",
    fullDescription: "Sewer backups present serious health hazards and require immediate professional attention. We service sewer mains, cleanouts, and lateral lines for homes and commercial businesses.",
    iconName: "ShieldAlert",
    imageUrl: "/src/assets/images/plumber_work_tools_1791015154794.jpg",
    enabled: true,
    order: 7,
    commonProblems: [
      "Multiple fixtures backing up simultaneously",
      "Sewage odor in the yard or near building perimeters",
      "Tree root intrusion piercing underground sewer pipes"
    ],
    serviceScope: [
      "Heavy-duty main line motorized augering",
      "Cleanout installation and access point upgrades",
      "Sewer lateral repair and line replacement"
    ],
    benefits: [
      "Protects indoor living spaces from contaminated wastewater",
      "Restores proper gravity drainage to municipal or septic mains"
    ],
    faqs: [
      {
        question: "What causes a sewer line to back up?",
        answer: "Common culprits include tree root intrusion, grease buildup, unflushable items, or older pipe settling."
      }
    ]
  },
  {
    id: "fixture-installation",
    slug: "fixture-installation",
    title: "Fixture Installation",
    shortDescription: "Professional installation of faucets, toilets, sinks, garbage disposals, and valves.",
    fullDescription: "Properly installed plumbing fixtures prevent leaks, maintain optimal water pressure, and enhance the functionality of your kitchen, bathrooms, and commercial facilities.",
    iconName: "CheckCircle",
    imageUrl: "/src/assets/images/plumber_work_tools_1791015154794.jpg",
    enabled: true,
    order: 8,
    commonProblems: [
      "Continuously running or rocking toilets",
      "Worn faucet cartridges causing constant dripping",
      "Jammed or leaking garbage disposals"
    ],
    serviceScope: [
      "Toilet replacement and wax ring resealing",
      "Kitchen and bathroom sink and faucet installation",
      "Garbage disposal replacement and wiring hookup"
    ],
    benefits: [
      "Leak-free precision installation guaranteed by professional techniques",
      "Conserves water with modern high-efficiency fixtures"
    ],
    faqs: [
      {
        question: "Can I provide my own fixtures for you to install?",
        answer: "Yes, we can professionally install customer-supplied fixtures or provide recommendations based on your needs."
      }
    ]
  },
  {
    id: "residential-plumbing",
    slug: "residential-plumbing",
    title: "Residential Plumbing",
    shortDescription: "Full-service residential plumbing for single-family homes, townhouses, and condos.",
    fullDescription: "From everyday drip repairs to full water line replacements, All Service Plumbing delivers dependable residential solutions to homeowners throughout Sebring and Central Florida.",
    iconName: "Home",
    imageUrl: "/src/assets/images/hero_plumbing_service_1791015140754.jpg",
    enabled: true,
    order: 9,
    commonProblems: [
      "Low water pressure in kitchen or bathroom",
      "Noisy pipes or sudden water hammer knocks",
      "Toilet leaks or intermittent running"
    ],
    serviceScope: [
      "Comprehensive whole-home plumbing inspections",
      "Kitchen, bath, and laundry room plumbing repairs",
      "Emergency residential leak containment and pipe repair"
    ],
    benefits: [
      "Courteous, clean technicians respectful of your home",
      "24/7 availability for residential emergencies"
    ],
    faqs: [
      {
        question: "Do you service residential properties throughout Sebring?",
        answer: "Yes, we provide residential plumbing services across Sebring and neighboring Central Florida areas."
      }
    ]
  },
  {
    id: "commercial-plumbing",
    slug: "commercial-plumbing",
    title: "Commercial Plumbing",
    shortDescription: "Reliable commercial plumbing solutions for local businesses, offices, and retail facilities.",
    fullDescription: "Plumbing downtime hurts your operations and customer experience. All Service Plumbing delivers commercial plumbing repairs and maintenance tailored to Central Florida businesses.",
    iconName: "Building2",
    imageUrl: "/src/assets/images/water_heater_inspection_1791015172595.jpg",
    enabled: true,
    order: 10,
    commonProblems: [
      "Commercial restroom toilet or urinal clogs and continuous running",
      "Heavy kitchen grease trap line slow-downs",
      "Commercial water heater failure disrupting operational sanitation"
    ],
    serviceScope: [
      "Commercial restroom fixture repair and installation",
      "High-capacity commercial water heater maintenance",
      "Main line clearing and commercial drain service"
    ],
    benefits: [
      "Minimizes downtime with 24-hour service availability",
      "Commercial-grade tooling suited for heavy-use systems"
    ],
    faqs: [
      {
        question: "Do you offer emergency commercial plumbing?",
        answer: "Yes, our phone line +1 863-991-5702 is answered 24 hours a day for commercial emergencies."
      }
    ]
  }
];

const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: "Are plumbing services available 24 hours?",
    answer: "Yes. All Service Plumbing of Central Florida, Inc. is open 24 hours a day, 7 days a week. For urgent service, call us directly at +1 863-991-5702.",
    order: 1,
    enabled: true
  },
  {
    id: 'faq-2',
    question: "How can I request plumbing service?",
    answer: "You can call our 24-hour phone line at +1 863-991-5702 for immediate assistance, or fill out our online Request Service form to book a convenient appointment.",
    order: 2,
    enabled: true
  },
  {
    id: 'faq-3',
    question: "What areas do you serve?",
    answer: "Our primary location is at 4305 Grand Concourse in Sebring, FL 33875, and we serve Sebring as well as surrounding communities throughout Central Florida.",
    order: 3,
    enabled: true
  },
  {
    id: 'faq-4',
    question: "Do you provide both residential and commercial plumbing?",
    answer: "Yes. We service private residences, single-family homes, apartments, as well as local businesses, commercial buildings, and offices.",
    order: 4,
    enabled: true
  },
  {
    id: 'faq-5',
    question: "How can I contact All Service Plumbing?",
    answer: "You can reach us by phone at +1 863-991-5702 anytime, visit our physical address at 4305 Grand Concourse, Sebring, FL 33875, or send a message via our website contact form.",
    order: 5,
    enabled: true
  }
];

export const db = {
  // ==========================================
  // USERS MANAGEMENT (Super Admin & Admins)
  // ==========================================
  getUsers(): UserRecord[] {
    try {
      if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, JSON.stringify(INITIAL_SUPER_ADMIN, null, 2));
        return INITIAL_SUPER_ADMIN;
      }
      return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
    } catch {
      return INITIAL_SUPER_ADMIN;
    }
  },

  saveUsers(users: UserRecord[]): void {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  },

  findUserByEmail(email: string): UserRecord | null {
    const users = db.getUsers();
    const normalized = email.trim().toLowerCase();
    return users.find(u => u.email.toLowerCase() === normalized) || null;
  },

  findUserById(id: string): UserRecord | null {
    const users = db.getUsers();
    return users.find(u => u.id === id) || null;
  },

  createUser(userData: { name: string; email: string; password: string; role: UserRole }): UserRecord {
    const users = db.getUsers();
    const existing = db.findUserByEmail(userData.email);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(userData.password, salt);

    const newUser: UserRecord = {
      id: `usr-${Date.now().toString().slice(-6)}`,
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      passwordHash,
      role: userData.role,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    db.saveUsers(users);
    return newUser;
  },

  updateUser(id: string, updates: Partial<Omit<UserRecord, 'id' | 'passwordHash'>>): UserRecord | null {
    const users = db.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;

    users[idx] = { ...users[idx], ...updates };
    db.saveUsers(users);
    return users[idx];
  },

  setUserPassword(id: string, newPassword: string): boolean {
    const users = db.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return false;

    const salt = bcrypt.genSaltSync(10);
    users[idx].passwordHash = bcrypt.hashSync(newPassword, salt);
    db.saveUsers(users);
    return true;
  },

  deleteUser(id: string): boolean {
    const users = db.getUsers();
    const target = users.find(u => u.id === id);
    if (!target) return false;

    // Safety: Protect the last remaining Super Admin
    if (target.role === 'Super Admin') {
      const superAdmins = users.filter(u => u.role === 'Super Admin');
      if (superAdmins.length <= 1) {
        throw new Error('Cannot delete the last remaining Super Admin account.');
      }
    }

    const filtered = users.filter(u => u.id !== id);
    db.saveUsers(filtered);
    return true;
  },

  updateUserLoginTime(id: string): void {
    const users = db.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx !== -1) {
      users[idx].lastLoginAt = new Date().toISOString();
      db.saveUsers(users);
    }
  },

  // ==========================================
  // WEBSITE CONTENT & SETTINGS MANAGEMENT
  // ==========================================
  getContent(): WebsiteContent {
    try {
      if (!fs.existsSync(CONTENT_FILE)) {
        fs.writeFileSync(CONTENT_FILE, JSON.stringify(INITIAL_CONTENT, null, 2));
        return INITIAL_CONTENT;
      }
      return JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf-8'));
    } catch {
      return INITIAL_CONTENT;
    }
  },

  updateContent(section: keyof WebsiteContent, updates: any): WebsiteContent {
    const content = db.getContent();
    if (section === 'navigation') {
      content.navigation = updates;
    } else {
      content[section] = { ...content[section], ...updates };
    }
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));
    return content;
  },

  // ==========================================
  // SERVICES MANAGEMENT
  // ==========================================
  getServices(includeDisabled = false): ServiceRecord[] {
    try {
      if (!fs.existsSync(SERVICES_FILE)) {
        fs.writeFileSync(SERVICES_FILE, JSON.stringify(INITIAL_SERVICES, null, 2));
        return includeDisabled ? INITIAL_SERVICES : INITIAL_SERVICES.filter(s => s.enabled);
      }
      const data: ServiceRecord[] = JSON.parse(fs.readFileSync(SERVICES_FILE, 'utf-8'));
      data.sort((a, b) => a.order - b.order);
      return includeDisabled ? data : data.filter(s => s.enabled);
    } catch {
      return includeDisabled ? INITIAL_SERVICES : INITIAL_SERVICES.filter(s => s.enabled);
    }
  },

  saveServices(services: ServiceRecord[]): void {
    fs.writeFileSync(SERVICES_FILE, JSON.stringify(services, null, 2));
  },

  createService(data: Omit<ServiceRecord, 'id' | 'order'>): ServiceRecord {
    const services = db.getServices(true);
    const id = data.slug || `service-${Date.now().toString().slice(-4)}`;
    const newService: ServiceRecord = {
      ...data,
      id,
      order: services.length + 1,
    };
    services.push(newService);
    db.saveServices(services);
    return newService;
  },

  updateService(id: string, updates: Partial<ServiceRecord>): ServiceRecord | null {
    const services = db.getServices(true);
    const idx = services.findIndex(s => s.id === id || s.slug === id);
    if (idx === -1) return null;

    services[idx] = { ...services[idx], ...updates };
    db.saveServices(services);
    return services[idx];
  },

  deleteService(id: string): boolean {
    const services = db.getServices(true);
    const filtered = services.filter(s => s.id !== id && s.slug !== id);
    if (filtered.length !== services.length) {
      db.saveServices(filtered);
      return true;
    }
    return false;
  },

  // ==========================================
  // FAQS MANAGEMENT
  // ==========================================
  getFaqs(includeDisabled = false): FAQItem[] {
    try {
      if (!fs.existsSync(FAQS_FILE)) {
        fs.writeFileSync(FAQS_FILE, JSON.stringify(INITIAL_FAQS, null, 2));
        return includeDisabled ? INITIAL_FAQS : INITIAL_FAQS.filter(f => f.enabled);
      }
      const data: FAQItem[] = JSON.parse(fs.readFileSync(FAQS_FILE, 'utf-8'));
      data.sort((a, b) => a.order - b.order);
      return includeDisabled ? data : data.filter(f => f.enabled);
    } catch {
      return includeDisabled ? INITIAL_FAQS : INITIAL_FAQS.filter(f => f.enabled);
    }
  },

  saveFaqs(faqs: FAQItem[]): void {
    fs.writeFileSync(FAQS_FILE, JSON.stringify(faqs, null, 2));
  },

  createFaq(data: { question: string; answer: string; category?: string }): FAQItem {
    const faqs = db.getFaqs(true);
    const newFaq: FAQItem = {
      id: `faq-${Date.now().toString().slice(-5)}`,
      question: data.question.trim(),
      answer: data.answer.trim(),
      category: data.category || 'General',
      order: faqs.length + 1,
      enabled: true,
    };
    faqs.push(newFaq);
    db.saveFaqs(faqs);
    return newFaq;
  },

  updateFaq(id: string, updates: Partial<FAQItem>): FAQItem | null {
    const faqs = db.getFaqs(true);
    const idx = faqs.findIndex(f => f.id === id);
    if (idx === -1) return null;

    faqs[idx] = { ...faqs[idx], ...updates };
    db.saveFaqs(faqs);
    return faqs[idx];
  },

  deleteFaq(id: string): boolean {
    const faqs = db.getFaqs(true);
    const filtered = faqs.filter(f => f.id !== id);
    if (filtered.length !== faqs.length) {
      db.saveFaqs(filtered);
      return true;
    }
    return false;
  },

  // ==========================================
  // ORDERS MANAGEMENT (Clean storage)
  // ==========================================
  getOrders(): OrderRecord[] {
    try {
      if (!fs.existsSync(ORDERS_FILE)) {
        fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
        return [];
      }
      return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8'));
    } catch {
      return [];
    }
  },

  saveOrders(orders: OrderRecord[]): void {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
  },

  createOrder(orderData: Omit<OrderRecord, 'id' | 'createdAt' | 'orderNumber'>): OrderRecord {
    const orders = db.getOrders();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: OrderRecord = {
      ...orderData,
      id: `req-${Date.now().toString().slice(-6)}`,
      orderNumber: `ASP-${randomSuffix}`,
      createdAt: new Date().toISOString(),
    };
    orders.unshift(newOrder);
    db.saveOrders(orders);
    return newOrder;
  },

  updateOrder(id: string, updates: Partial<OrderRecord>): OrderRecord | null {
    const orders = db.getOrders();
    const idx = orders.findIndex(o => o.id === id);
    if (idx !== -1) {
      orders[idx] = { ...orders[idx], ...updates };
      db.saveOrders(orders);
      return orders[idx];
    }
    return null;
  },

  deleteOrder(id: string): boolean {
    const orders = db.getOrders();
    const filtered = orders.filter(o => o.id !== id);
    if (filtered.length !== orders.length) {
      db.saveOrders(filtered);
      return true;
    }
    return false;
  }
};
