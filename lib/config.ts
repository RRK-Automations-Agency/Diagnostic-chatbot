/**
 * Central configuration for Asha Jyothi Diagnostic Centre.
 *
 * All business information is maintained here so verified details
 * can be inserted in one place.
 *
 * NOTE: This project currently runs as a DEMO. The business values below
 * (address, contact details, timings, pricing, etc.) are fictional
 * demonstration data and must be verified with the real centre before
 * production use. Do not describe them as verified information.
 */

/**
 * Flag indicating the current site content is demonstration data.
 * Flip to `false` once real, verified client information is available.
 */
export const DEMO_DATA = true;

export const centreConfig = {
  name: "Asha Jyothi Diagnostic Centre",
  tagline: "Reliable Diagnostics. Better Health.",
  location: {
    address: "13-21/A/1, Keshava Nagar",
    city: "Toopran",
    district: "Medak",
    state: "Telangana",
    country: "India",
    pincode: "502334",
    googleMapsQuery: "Asha+Jyothi+Diagnostic+Centre+Toopran+Telangana",
  },
  contact: {
    phone: "+91 90000 12345",
    whatsapp: "+91 90000 12345",
    email: "contact@ashajyothidiagnostics.com",
  },
  hours: {
    summary: "7:00 AM - 9:00 PM, Monday through Sunday",
    weekdays: "7:00 AM - 9:00 PM",
    sunday: "7:00 AM - 9:00 PM",
    reportCollection: "6:00 PM - 9:00 PM",
  },
  payments: {
    methods: ["Cash", "UPI", "Debit/Credit Cards"],
    display: "Cash, UPI, Debit/Credit Cards",
  },
  homeSampleCollection:
    "Home sample collection is available on request within the local Toopran area in this demo. Please contact the centre to confirm availability and scheduling.",
  services: [
    {
      id: "blood-tests",
      title: "Blood Tests",
      description:
        "Comprehensive blood testing services for routine and specialized diagnostic needs.",
    },
    {
      id: "pathology",
      title: "Pathology",
      description:
        "Accurate pathology services to support clinical diagnosis and patient care.",
    },
    {
      id: "health-checkups",
      title: "Health Checkups",
      description:
        "Preventive health checkup packages for early detection and wellness monitoring.",
    },
    {
      id: "home-collection",
      title: "Home Sample Collection",
      description:
        "Convenient sample collection from the comfort of your home for eligible tests.",
    },
  ],
  popularTests: [
    { name: "Complete Blood Count (CBC)", category: "Haematology" },
    { name: "Blood Sugar (Fasting / PP)", category: "Biochemistry" },
    { name: "HbA1c", category: "Diabetes" },
    { name: "Lipid Profile", category: "Cardiology" },
    { name: "Thyroid Profile (T3, T4, TSH)", category: "Endocrinology" },
    { name: "Vitamin D", category: "Vitamins" },
    { name: "Liver Function Test (LFT)", category: "Biochemistry" },
    { name: "Kidney Function Test (KFT)", category: "Biochemistry" },
  ],
  whyChooseUs: [
    {
      title: "Reliable Testing",
      description:
        "Consistent and dependable diagnostic testing with attention to quality at every step.",
    },
    {
      title: "Experienced Staff",
      description:
        "A team of trained professionals committed to accurate sample handling and analysis.",
    },
    {
      title: "Timely Reports",
      description:
        "Focused on delivering your diagnostic reports without unnecessary delays.",
    },
    {
      title: "Patient-Friendly Service",
      description:
        "A welcoming environment with clear communication and helpful guidance throughout your visit.",
    },
  ],
  disclaimer:
    "Information provided on this website and by the virtual assistant is for general informational purposes only and does not replace professional medical advice, diagnosis, or treatment.",
  demoDisclaimer:
    "Demo website. Business information, pricing, timings and service details shown on this website are for demonstration purposes and should be verified with the diagnostic centre before production use.",
} as const;

export type CentreConfig = typeof centreConfig;
