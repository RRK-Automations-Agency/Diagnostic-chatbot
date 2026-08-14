import { centreConfig } from "../config";

export const chatbotKnowledge = {
  centre: {
    name: centreConfig.name,
    location: `${centreConfig.location.city}, ${centreConfig.location.state}, India`,
    address: `${centreConfig.location.address}, ${centreConfig.location.city}`,
    phone: centreConfig.contact.phone,
    timings: `Weekdays: ${centreConfig.hours.weekdays}, Sundays: ${centreConfig.hours.sunday}`,
  },
  services: [
    {
      name: "Blood Tests",
      description: "Comprehensive blood tests including CBC, Blood Sugar, HbA1c, Lipid Profile, Thyroid Profile, and more.",
    },
    {
      name: "Pathology",
      description: "Clinical laboratory and pathology services assisting medical diagnosis.",
    },
    {
      name: "Health Checkups",
      description: "Preventive health screening packages for regular wellness monitoring.",
    },
    {
      name: "Home Sample Collection",
      description: "Safe and convenient doorstep sample collection available in Toopran area for eligible tests.",
    },
  ],
  popularTests: [
    {
      name: "Complete Blood Count (CBC)",
      description: "Measures red blood cells, white blood cells, haemoglobin, and platelets to evaluate overall health and detect disorders like anaemia or infection.",
      fastingRequired: "Usually no fasting required unless combined with other tests.",
    },
    {
      name: "Fasting Blood Sugar (FBS)",
      description: "Measures blood glucose levels after an overnight fast to screen for prediabetes or diabetes.",
      fastingRequired: "Requires 8 to 10 hours of overnight fasting.",
    },
    {
      name: "Post-Prandial Blood Sugar (PPBS)",
      description: "Measures blood glucose 2 hours after a meal to evaluate body's response to food.",
      fastingRequired: "Taken exactly 2 hours after starting your meal.",
    },
    {
      name: "HbA1c (Glycated Haemoglobin)",
      description: "Reflects average blood sugar levels over the past 2 to 3 months. Used to monitor diabetes control.",
      fastingRequired: "No fasting required.",
    },
    {
      name: "Lipid Profile",
      description: "Checks cholesterol levels (Total Cholesterol, HDL, LDL, Triglycerides) to assess cardiovascular health.",
      fastingRequired: "Typically requires 10 to 12 hours of fasting (water allowed).",
    },
    {
      name: "Thyroid Profile (T3, T4, TSH)",
      description: "Evaluates thyroid gland function to screen for hypothyroidism or hyperthyroidism.",
      fastingRequired: "Usually taken in the morning; morning fasting is often recommended.",
    },
    {
      name: "Vitamin D (25-OH)",
      description: "Measures vitamin D levels to assess bone health and immune function.",
      fastingRequired: "No fasting required.",
    },
    {
      name: "Liver Function Test (LFT)",
      description: "Evaluates liver health and enzymes (Bilirubin, SGOT/AST, SGPT/ALT, Alkaline Phosphatase, Protein/Albumin).",
      fastingRequired: "Fasting for 8 to 10 hours is generally advised.",
    },
    {
      name: "Kidney Function Test (KFT / RFT)",
      description: "Checks kidney filtration and function including Creatinine, Blood Urea, and Electrolytes.",
      fastingRequired: "Overnight fasting or light meal depending on doctor's instructions.",
    },
  ],
  generalFastingGuidelines:
    "Fasting requirements depend on the specific tests ordered. Tests like Fasting Blood Sugar and Lipid Profile typically require 8–12 hours of overnight fasting (plain water is allowed). For CBC, Vitamin D, and HbA1c, fasting is generally not needed. Please confirm when booking or with your physician.",
  disclaimer:
    "I am an informational assistant for Asha Jyothi Diagnostic Centre and not a medical doctor. I cannot diagnose conditions, prescribe medications, or interpret personal diagnostic reports. Please consult your physician for medical advice.",
};
