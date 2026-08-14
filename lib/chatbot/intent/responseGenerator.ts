/**
 * Deterministic response generator for diagnostic centre chatbot.
 * Produces structured markdown responses strictly grounded in verified knowledge.
 */

import { ClassificationResult, DialogResponse } from "./types";
import { chatbotKnowledge } from "../knowledge";
import { centreConfig } from "../../config";

/**
 * Generates response for a classified intent.
 */
export function generateIntentResponse(
  classification: ClassificationResult
): DialogResponse {
  const { intent, entities, isNegated } = classification;

  switch (intent) {
    case "EMERGENCY":
      return {
        content:
          "⚠️ **Urgent Notice:** If you or someone with you is experiencing a medical emergency (such as severe chest pain, difficulty breathing, sudden numbness, or heavy bleeding), please seek **immediate emergency medical care** or visit the nearest hospital emergency room without delay.",
      };

    case "MEDICAL_ADVICE":
      return {
        content:
          "I can provide general information about diagnostic tests and the centre's services, but I cannot diagnose medical conditions, interpret personal medical results, or recommend medications.\n\nPlease consult a **qualified healthcare professional** for medical diagnosis and clinical treatment.",
      };

    case "GREETING":
      return {
        content: `Hello! Welcome to **${centreConfig.name}** in Toopran. How can I help you today? You can ask about our tests, fasting & preparation guidelines, timings, location, or request a test enquiry.`,
      };

    case "GOODBYE":
      return {
        content: `Thank you for reaching out to **${centreConfig.name}**. Wishing you good health! Feel free to visit us or message anytime if you need further assistance.`,
      };

    case "THANK_YOU":
      return {
        content:
          "You're very welcome! Please let me know if you would like information on any other diagnostic tests or need help with a booking enquiry.",
      };

    case "HELP":
      return {
        content:
          `I am the virtual assistant for **${centreConfig.name}**. Here are the topics I can help you with:\n\n` +
          `• **Diagnostic Tests:** Information on CBC, Blood Sugar, Thyroid, Lipid, Vitamin D, LFT, KFT\n` +
          `• **Test Preparation:** Fasting hours, water intake, and pre-test instructions\n` +
          `• **Centre Details:** Location, timings, and contact information\n` +
          `• **Services:** Pathology, Blood tests, Health checkups, and Home sample collection\n` +
          `• **Test Enquiries:** Request a test booking directly in this chat\n\n` +
          `What would you like to enquire about?`,
      };

    case "CENTRE_INFO":
      return {
        content:
          `**${centreConfig.name}** is a diagnostic and pathology testing facility located in ${centreConfig.location.city}, ${centreConfig.location.state}.\n\n` +
          `We provide accurate clinical laboratory testing, preventive health checkups, and doorstep sample collection to support doctors and patients with reliable health insights.`,
      };

    case "LOCATION":
      return {
        content:
          `📍 **Location & Address:**\n\n` +
          `**${centreConfig.name}**\n` +
          `Address: ${centreConfig.location.address}, ${centreConfig.location.city}, ${centreConfig.location.state}, India.\n\n` +
          `You can view directions on Google Maps using the map button on our Contact section.`,
      };

    case "TIMINGS": {
      const isVerified =
        !centreConfig.hours.weekdays.includes("VERIFIED") &&
        !centreConfig.hours.sunday.includes("VERIFIED");

      if (isVerified) {
        return {
          content:
            `⏰ **Operating Timings:**\n\n` +
            `• **Weekdays:** ${centreConfig.hours.weekdays}\n` +
            `• **Sundays:** ${centreConfig.hours.sunday}\n\n` +
            `Please visit during operational hours for sample collection.`,
        };
      }

      return {
        content:
          `⏰ **Operating Timings:**\n\n` +
          `Our regular operational hours are currently being finalized for the Toopran centre. Please contact the centre directly or submit an enquiry to confirm today's opening hours.`,
      };
    }

    case "CONTACT": {
      const phoneVerified = !centreConfig.contact.phone.includes("VERIFIED");
      const phoneText = phoneVerified
        ? centreConfig.contact.phone
        : "Available at centre front desk in Toopran";

      return {
        content:
          `📞 **Contact Information:**\n\n` +
          `• **Centre:** ${centreConfig.name}\n` +
          `• **Phone:** ${phoneText}\n` +
          `• **Location:** ${centreConfig.location.address}, ${centreConfig.location.city}\n\n` +
          `You can also start a test enquiry directly here in the chat.`,
      };
    }

    case "SERVICES": {
      const serviceList = chatbotKnowledge.services
        .map((s) => `• **${s.name}:** ${s.description}`)
        .join("\n");
      return {
        content: `At **${centreConfig.name}**, we provide the following diagnostic services:\n\n${serviceList}\n\nWould you like more details on a specific test or service?`,
      };
    }

    case "TEST_AVAILABILITY": {
      if (entities.test) {
        const matched = chatbotKnowledge.popularTests.find((t) =>
          t.name.toLowerCase().includes(entities.test!.toLowerCase())
        );
        if (matched) {
          return {
            content:
              `Yes, **${matched.name}** is available at our centre.\n\n` +
              `• **Overview:** ${matched.description}\n` +
              `• **Preparation:** ${matched.fastingRequired}\n\n` +
              `Would you like to enquire about scheduling this test?`,
          };
        }
      }

      const tests = chatbotKnowledge.popularTests.map((t) => `• **${t.name}**`).join("\n");
      return {
        content:
          `We offer a comprehensive range of laboratory diagnostic tests, including:\n\n${tests}\n\n` +
          `If you are looking for a specific test not listed above, let me know or start a test enquiry!`,
      };
    }

    case "TEST_INFORMATION": {
      if (entities.test) {
        const matched = chatbotKnowledge.popularTests.find((t) =>
          t.name.toLowerCase().includes(entities.test!.toLowerCase())
        );
        if (matched) {
          return {
            content:
              `📋 **${matched.name}**:\n\n` +
              `• **Description:** ${matched.description}\n` +
              `• **Preparation:** ${matched.fastingRequired}\n\n` +
              `Would you like to enquire about getting this test done?`,
          };
        }
      }

      return {
        content:
          "Which diagnostic test would you like information about? We provide details on tests such as **CBC, Blood Sugar, HbA1c, Lipid Profile, Thyroid Profile, Vitamin D, LFT**, and **KFT**.",
      };
    }

    case "TEST_PREPARATION": {
      if (isNegated) {
        return {
          content:
            "Some routine tests (such as **CBC**, **HbA1c**, and **Vitamin D**) generally do not require fasting, while metabolic and lipid panels (**Fasting Blood Sugar**, **Lipid Profile**) do require 8–12 hours fasting. Please tell me which specific test you are planning to take.",
        };
      }

      if (entities.test) {
        const matched = chatbotKnowledge.popularTests.find((t) =>
          t.name.toLowerCase().includes(entities.test!.toLowerCase())
        );
        if (matched) {
          return {
            content:
              `⏱️ **Preparation for ${matched.name}:**\n\n` +
              `• ${matched.fastingRequired}\n\n` +
              `*Tip: Plain water is generally allowed during fasting unless instructed otherwise by your doctor.*`,
          };
        }
      }

      return {
        content:
          `⏱️ **General Fasting & Preparation Guidelines:**\n\n` +
          `${chatbotKnowledge.generalFastingGuidelines}\n\n` +
          `Which specific test are you inquiring about?`,
      };
    }

    case "TEST_PRICE": {
      if (entities.test) {
        return {
          content: `I don't have verified pricing information for **${entities.test}** yet. Please contact the centre directly or submit an enquiry, and our team will provide the current test charges.`,
        };
      }
      return {
        content:
          "I don't have verified pricing information for tests in the database yet. Please contact the centre directly or submit an enquiry with the test name to receive current rates.",
      };
    }

    case "REPORT_INFORMATION":
      return {
        content:
          `📄 **Report Information:**\n\n` +
          `• **Turnaround Time:** Routine tests (like CBC and Blood Sugar) are typically ready within the same day or next working day. Specialized panels may require additional processing time.\n` +
          `• **Collection:** Physical reports can be collected at our Toopran centre. Please verify with our reception at the time of sample collection.`,
      };

    case "HOME_SAMPLE_COLLECTION":
      return {
        content:
          `🏠 **Home Sample Collection:**\n\n` +
          `Yes, we provide doorstep sample collection in the Toopran area for eligible blood and diagnostic tests. A trained phlebotomist will visit your address.\n\n` +
          `Would you like to book a home sample collection enquiry?`,
      };

    case "UNKNOWN":
    default:
      return {
        content:
          `I am the **${centreConfig.name}** assistant. I can help with diagnostic tests, test preparation, centre services, location, timings, and test enquiries. What would you like to know?`,
      };
  }
}
