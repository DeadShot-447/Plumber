/**
 * Verified Business Information for All Service Plumbing of Central Florida, Inc.
 * Strictly adheres to verified information provided in prompt:
 * - Business Name: All Service Plumbing of Central Florida, Inc.
 * - Business Category: Plumber
 * - Location: Sebring, Florida, United States
 * - Address: 4305 Grand Concourse, Sebring, FL 33875
 * - Phone: +1 863-991-5702
 * - Hours: Open 24 hours
 */

export interface PlumbingService {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  imageUrl?: string;
  enabled?: boolean;
  commonProblems: string[];
  serviceScope: string[];
  benefits: string[];
  faqs: { question: string; answer: string }[];
}

export const BUSINESS_INFO = {
  name: "All Service Plumbing of Central Florida, Inc.",
  shortName: "All Service Plumbing",
  subtitle: "of Central Florida, Inc.",
  category: "Plumber",
  phone: "+1 863-991-5702",
  phoneRaw: "+18639915702",
  phoneFormatted: "(863) 991-5702",
  address: "4305 Grand Concourse",
  city: "Sebring",
  state: "FL",
  zip: "33875",
  country: "United States",
  fullAddress: "4305 Grand Concourse, Sebring, FL 33875",
  hours: "Open 24 hours",
  hoursDetail: "24/7 Emergency & Scheduled Plumbing Service",
  serviceAreas: [
    "Sebring, Florida",
    "Highlands County",
    "Central Florida Communities",
  ],
  googleReviewsUrl: "https://www.google.com/maps/search/?api=1&query=All+Service+Plumbing+of+Central+Florida+Inc+Sebring+FL",
};

export const SERVICES: PlumbingService[] = [
  {
    id: "emergency-plumbing",
    slug: "emergency-plumbing",
    title: "Emergency Plumbing",
    shortDescription: "24-hour rapid response for urgent plumbing issues throughout Sebring and Central Florida.",
    fullDescription: "Plumbing emergencies can strike at any hour of the day or night. All Service Plumbing of Central Florida provides 24-hour service to address urgent residential and commercial plumbing failures before water damage worsens.",
    iconName: "Flame",
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
      },
      {
        question: "What should I do while waiting for the plumber to arrive?",
        answer: "If safe to do so, locate and turn off your main water shut-off valve to stop the flow of water, and keep clear of any electrical outlets near standing water."
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
    commonProblems: [
      "Dripping pipe joints under sinks or behind walls",
      "Unexplained moisture along baseboards or flooring",
      "Sudden increases in municipal water bills",
      "Corroded copper, PVC, or galvanized fittings",
      "Leaking outdoor hose bibbs and shutoff valves"
    ],
    serviceScope: [
      "Visual and instrument inspection of accessible piping",
      "Precision cut-out and replacement of damaged pipe sections",
      "Valve replacement and joint refitting",
      "Post-repair pressure verification to ensure leak-free integrity"
    ],
    benefits: [
      "Protects home framing and subfloors from moisture damage",
      "Prevents mold proliferation caused by chronic dampness",
      "Restores normal water pressure and reduces utility waste"
    ],
    faqs: [
      {
        question: "How do I know if I have a hidden water leak?",
        answer: "Common warning signs include damp spots on walls or ceilings, warm areas on floors, the sound of running water when fixtures are off, or an unusually high water bill."
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
    commonProblems: [
      "Water meter running continuously when all faucets are shut",
      "Spongy or discolored flooring",
      "Unexplained drop in household water pressure",
      "Humid, musty odors in specific rooms"
    ],
    serviceScope: [
      "Systematic pressure testing of domestic supply lines",
      "Targeted acoustic and thermal inspection methods",
      "Mapping underground and under-slab pipe runs",
      "Clear findings report and repair plan"
    ],
    benefits: [
      "Eliminates unnecessary wall or slab destruction",
      "Detects microscopic leaks before catastrophic ruptures occur",
      "Provides definitive answers on whole-property water integrity"
    ],
    faqs: [
      {
        question: "Can you locate leaks under concrete slabs?",
        answer: "Yes, professional leak detection techniques allow plumbers to locate pressurized supply leaks under concrete slabs and foundations."
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
    commonProblems: [
      "Slow-draining kitchen sinks with food residue accumulation",
      "Bathroom tubs and showers backing up with standing water",
      "Gurgling sounds emanating from drain traps",
      "Foul odors rising from sink and floor drains",
      "Recurring clogs that store-bought chemicals cannot clear"
    ],
    serviceScope: [
      "Mechanical motorized drain snaking and cabling",
      "Removal of grease, soap scum, hair, and scale buildup",
      "Trap cleaning and cleanout access servicing",
      "Flow rate verification and drainage inspection"
    ],
    benefits: [
      "Immediate restoration of drainage function",
      "Safer for pipes than caustic chemical drain cleaners",
      "Prevents overflow damage and foul sewer gas intrusion"
    ],
    faqs: [
      {
        question: "Why should I avoid chemical drain cleaners?",
        answer: "Over-the-counter chemical drain cleaners contain harsh acids or lye that can corrode older pipes, weaken PVC joints, and fail to remove dense obstructions safely."
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
    commonProblems: [
      "Lack of hot water or water taking too long to heat",
      "Rusty, discolored, or foul-smelling hot water",
      "Popping, rumbling, or whistling noises from the tank",
      "Water pooling around the base of the water heater",
      "Tripped electrical breakers or faulty pilot assemblies"
    ],
    serviceScope: [
      "Thermostat, heating element, and thermocouple diagnostics",
      "Temperature and pressure relief (T&P) valve inspection",
      "Sediment flush and anode rod assessment",
      "Safe disconnect, haul-away, and new water heater installation",
      "Gas and electric model servicing"
    ],
    benefits: [
      "Reliable hot water for sanitation, cooking, and bathing",
      "Improved energy efficiency and lower utility operating costs",
      "Prevention of sudden catastrophic tank tank ruptures"
    ],
    faqs: [
      {
        question: "How can I request water heater service?",
        answer: "You can call us directly at +1 863-991-5702 anytime, or submit an online service request via our Request Service form."
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
    commonProblems: [
      "Pin-hole leaks appearing across aging copper lines",
      "Discolored water caused by interior pipe corrosion",
      "Low water pressure throughout the entire building",
      "Polybutylene or deteriorating galvanized pipe materials",
      "Vibrating or banging pipes (water hammer)"
    ],
    serviceScope: [
      "Sectional pipe replacement and coupling installations",
      "Whole-home and commercial water line repiping",
      "Installation of durable PEX, copper, or approved piping",
      "Code-compliant water pressure regulators and shutoffs"
    ],
    benefits: [
      "Eliminates repeated costly sectional leak repairs",
      "Delivers clean, clear water with consistent flow",
      "Increases long-term property value and insurability"
    ],
    faqs: [
      {
        question: "What types of piping do you work with?",
        answer: "Our technicians handle copper, PEX, PVC, CPVC, and standard commercial and residential water delivery piping."
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
    commonProblems: [
      "Multiple fixtures backing up simultaneously",
      "Sewage odor in the yard or near building perimeters",
      "Tree root intrusion piercing underground sewer pipes",
      "Collapsed, cracked, or sagging sewer lines (bellies)",
      "Toilet bubbling when washer or shower drains"
    ],
    serviceScope: [
      "Heavy-duty main line motorized augering",
      "Cleanout installation and access point upgrades",
      "Sewer lateral repair and line replacement",
      "Comprehensive residential and commercial sewer servicing"
    ],
    benefits: [
      "Protects indoor living spaces from contaminated wastewater",
      "Eliminates stubborn recurring whole-house clogs",
      "Restores proper gravity drainage to municipal or septic mains"
    ],
    faqs: [
      {
        question: "What causes a sewer line to back up?",
        answer: "Common culprits include tree root intrusion, accumulation of fats/oils/grease, unflushable sanitary products, or older pipes settling and collapsing."
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
    commonProblems: [
      "Continuously running or rocking toilets",
      "Worn faucet cartridges causing constant dripping",
      "Jammed or leaking garbage disposals",
      "Poorly seated sink drains causing cabinet moisture",
      "Upgrading outdated fixtures to water-saving models"
    ],
    serviceScope: [
      "Toilet replacement and wax ring resealing",
      "Kitchen and bathroom sink and faucet installation",
      "Garbage disposal replacement and wiring hookup",
      "Shower valve, tub spout, and trim installation",
      "Angle stop and supply line upgrades"
    ],
    benefits: [
      "Leak-free precision installation guaranteed by professional techniques",
      "Conserves water with modern high-efficiency fixtures",
      "Upgrades functionality and aesthetic appearance"
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
    commonProblems: [
      "Low water pressure in kitchen or master bathroom",
      "Noisy pipes or sudden water hammer knocks",
      "Toilet leaks or intermittent running",
      "Water heater maintenance and thermostat issues",
      "Outdoor spigot leaks and irrigation connection issues"
    ],
    serviceScope: [
      "Comprehensive whole-home plumbing inspections",
      "Kitchen, bath, and laundry room plumbing repairs",
      "Water filtration and softener connection services",
      "Emergency residential leak containment and pipe repair",
      "Complete plumbing replacement and fixture upgrades"
    ],
    benefits: [
      "Courteous, clean technicians respectful of your home",
      "24/7 availability for residential emergencies",
      "Local service centered right here in Sebring, FL"
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
    commonProblems: [
      "Commercial restroom toilet or urinal clogs and continuous running",
      "Heavy kitchen grease trap line slow-downs",
      "Commercial water heater failure disrupting operational sanitation",
      "High-pressure supply line leaks in business premises",
      "Backflow prevention and code compliance needs"
    ],
    serviceScope: [
      "Commercial restroom fixture repair and installation",
      "High-capacity commercial water heater maintenance",
      "Main line clearing and commercial drain service",
      "Emergency service with 24/7 availability to minimize business downtime",
      "Scheduled facility maintenance and pipe upgrades"
    ],
    benefits: [
      "Minimizes downtime with 24-hour service availability",
      "Commercial-grade tooling suited for heavy-use systems",
      "Experienced with local commercial plumbing configurations"
    ],
    faqs: [
      {
        question: "Do you offer emergency commercial plumbing?",
        answer: "Yes, our phone line +1 863-991-5702 is answered 24 hours a day for commercial emergencies."
      }
    ]
  }
];

export const GENERAL_FAQS = [
  {
    question: "Are plumbing services available 24 hours?",
    answer: "Yes. All Service Plumbing of Central Florida, Inc. is open 24 hours a day, 7 days a week. For urgent service, call us directly at +1 863-991-5702."
  },
  {
    question: "How can I request plumbing service?",
    answer: "You can call our 24-hour phone line at +1 863-991-5702 for immediate assistance, or fill out our online Request Service form to book a convenient appointment."
  },
  {
    question: "What areas do you serve?",
    answer: "Our primary location is at 4305 Grand Concourse in Sebring, FL 33875, and we serve Sebring as well as surrounding communities throughout Central Florida."
  },
  {
    question: "Do you provide both residential and commercial plumbing?",
    answer: "Yes. We service private residences, single-family homes, apartments, as well as local businesses, commercial buildings, and offices."
  },
  {
    question: "How can I contact All Service Plumbing?",
    answer: "You can reach us by phone at +1 863-991-5702 anytime, visit our physical address at 4305 Grand Concourse, Sebring, FL 33875, or send a message via our website contact form."
  }
];
