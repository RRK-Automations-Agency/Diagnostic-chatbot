/**
 * Central configuration for Asha Jyothi Diagnostic Centre.
 *
 * All business information is maintained here so verified details
 * can be inserted in one place. Placeholders are clearly marked.
 */

export const centreConfig = {
  name: "Asha Jyothi Diagnostic Centre",
  tagline: "Reliable Diagnostics. Better Health.",
  location: {
    address: "Toopran, Medak District",
    city: "Toopran",
    state: "Telangana",
    country: "India",
    pincode: "[PIN CODE TO BE VERIFIED]",
    googleMapsQuery: "Asha+Jyothi+Diagnostic+Centre+Toopran+Telangana",
  },
  contact: {
    phone: "[PHONE NUMBER TO BE VERIFIED]",
    email: "[EMAIL TO BE VERIFIED]",
  },
  hours: {
    weekdays: "[TIMINGS TO BE VERIFIED]",
    sunday: "[TIMINGS TO BE VERIFIED]",
  },
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
} as const;

export type CentreConfig = typeof centreConfig;
