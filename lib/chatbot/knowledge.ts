import { centreConfig, DEMO_DATA } from "../config";

export const chatbotKnowledge = {
  isDemoData: DEMO_DATA,
  centre: {
    name: centreConfig.name,
    location: `${centreConfig.location.city}, ${centreConfig.location.district}, ${centreConfig.location.state}, India`,
    address: `${centreConfig.location.address}, ${centreConfig.location.city}, ${centreConfig.location.district} District, ${centreConfig.location.state} - ${centreConfig.location.pincode}`,
    phone: centreConfig.contact.phone,
    whatsapp: centreConfig.contact.whatsapp,
    email: centreConfig.contact.email,
    timings: centreConfig.hours.summary,
    reportCollection: centreConfig.hours.reportCollection,
    paymentMethods: centreConfig.payments.display,
    homeSampleCollection: centreConfig.homeSampleCollection,
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
      description: "Sample collection at home available on request within the local Toopran area (demo).",
    },
  ],
  popularTests: [
    {
      name: "Complete Blood Count (CBC)",
      description: "Measures red blood cells, white blood cells, haemoglobin, and platelets to evaluate overall health and detect disorders like anaemia or infection.",
      price: "₹250",
      turnaround: "Same day",
      fastingRequired: "Fasting is generally not required for a CBC. However, follow any preparation instructions provided by your healthcare provider or laboratory.",
    },
    {
      name: "Fasting Blood Sugar (FBS)",
      description: "Measures blood glucose levels after an overnight fast to screen for prediabetes or diabetes.",
      price: "₹100",
      turnaround: "Same day",
      fastingRequired: "Fasting requirements depend on the specific blood sugar test. Please confirm whether the requested test is fasting blood sugar or another glucose test.",
    },
    {
      name: "Post-Prandial Blood Sugar (PPBS)",
      description: "Measures blood glucose 2 hours after a meal to evaluate the body's response to food.",
      price: "₹100",
      turnaround: "Same day",
      fastingRequired: "Fasting requirements depend on the specific blood sugar test. Please confirm whether the requested test is a post-meal glucose test or another glucose test.",
    },
    {
      name: "HbA1c (Glycated Haemoglobin)",
      description: "Reflects average blood sugar levels over the past 2 to 3 months. Used to monitor diabetes control.",
      price: "₹350",
      turnaround: "Same day",
      fastingRequired: "HbA1c generally does not require fasting. Follow the laboratory's specific instructions if provided.",
    },
    {
      name: "Lipid Profile",
      description: "Checks cholesterol levels (Total Cholesterol, HDL, LDL, Triglycerides) to assess cardiovascular health.",
      price: "₹500",
      turnaround: "Same day",
      fastingRequired: "Some lipid testing may require fasting depending on the laboratory's protocol and the specific test. Please confirm the preparation requirements before testing.",
    },
    {
      name: "Thyroid Profile (T3, T4, TSH)",
      description: "Evaluates thyroid gland function to screen for hypothyroidism or hyperthyroidism.",
      price: "₹450",
      turnaround: "24 hours",
      fastingRequired: "Fasting is generally not required for a routine thyroid profile, but follow any specific instructions from your healthcare provider or laboratory.",
    },
    {
      name: "Vitamin D (25-OH)",
      description: "Measures vitamin D levels to assess bone health and immune function.",
      price: "₹800",
      turnaround: "24–48 hours",
      fastingRequired: "Fasting is generally not required for a Vitamin D test unless specifically instructed.",
    },
    {
      name: "Liver Function Test (LFT)",
      description: "Evaluates liver health and enzymes (Bilirubin, SGOT/AST, SGPT/ALT, Alkaline Phosphatase, Protein/Albumin).",
      price: "₹550",
      turnaround: "Same day",
      fastingRequired: "Preparation requirements can vary. Please confirm with the laboratory before testing.",
    },
    {
      name: "Kidney Function Test (KFT / RFT)",
      description: "Checks kidney filtration and function including Creatinine, Blood Urea, and Electrolytes.",
      price: "₹550",
      turnaround: "Same day",
      fastingRequired: "Preparation requirements can vary depending on the specific kidney function tests being performed. Please confirm with the laboratory.",
    },
  ],
  generalFastingGuidelines:
    "Fasting requirements depend on the specific tests ordered. For this demonstration: CBC, HbA1c, Vitamin D, and a routine thyroid profile generally do not require fasting, while Fasting Blood Sugar and some lipid testing may require fasting depending on the laboratory's protocol. Please confirm the exact preparation instructions with your healthcare provider or our laboratory before testing.",
  disclaimer:
    "I am an informational assistant for Asha Jyothi Diagnostic Centre and not a medical doctor. I cannot diagnose conditions, prescribe medications, or interpret personal diagnostic reports. Please consult your physician for medical advice.",
};
