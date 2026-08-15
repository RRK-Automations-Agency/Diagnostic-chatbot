/**
 * Deterministic response generator for diagnostic centre chatbot.
 * Produces structured markdown responses strictly grounded in the
 * (currently demo) knowledge base.
 */

import { ClassificationResult, DialogResponse } from "./types";
import { chatbotKnowledge } from "../knowledge";
import { centreConfig } from "../../config";

/**
 * Finds a knowledge-base test that matches the extracted test entity.
 * Handles canonical names containing parenthetical variants, e.g.
 * "Blood Sugar (Fasting / PP)" -> "Fasting Blood Sugar (FBS)".
 */
function findTestMatch(testEntity?: string) {
  if (!testEntity) return undefined;
  const query = testEntity.toLowerCase().replace(/\(.*?\)/g, "").trim();
  if (!query) return undefined;
  return chatbotKnowledge.popularTests.find(
    (t) =>
      t.name.toLowerCase().includes(query) ||
      query.includes(t.name.toLowerCase())
  );
}

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
          `${chatbotKnowledge.centre.address}\n\n` +
          `You can view directions on Google Maps using the map button on our Contact section.`,
      };

    case "TIMINGS": {
      const demoNote = chatbotKnowledge.isDemoData
        ? "\n\n*These timings are demo information and should be confirmed with the centre.*"
        : "";

      return {
        content:
          `⏰ **Operating Hours:**\n\n` +
          `**${centreConfig.name}** is open ${centreConfig.hours.summary}.\n` +
          `• **Report Collection:** ${centreConfig.hours.reportCollection}\n` +
          demoNote,
      };
    }

    case "CONTACT": {
      const demoNote = chatbotKnowledge.isDemoData
        ? "\n\n*These are demo contact details and should be confirmed with the centre.*"
        : "";

      return {
        content:
          `📞 **Contact Information:**\n\n` +
          `• **Centre:** ${centreConfig.name}\n` +
          `• **Phone:** ${centreConfig.contact.phone}\n` +
          `• **WhatsApp:** ${centreConfig.contact.whatsapp}\n` +
          `• **Email:** ${centreConfig.contact.email}\n` +
          `• **Payment Methods:** ${chatbotKnowledge.centre.paymentMethods}\n` +
          `• **Location:** ${chatbotKnowledge.centre.address}\n` +
          demoNote,
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
        const matched = findTestMatch(entities.test);
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
        const matched = findTestMatch(entities.test);
        if (matched) {
          return {
            content:
              `📋 **${matched.name}**:\n\n` +
              `• **Description:** ${matched.description}\n` +
              `• **Preparation:** ${matched.fastingRequired}\n` +
              `• **Indicative demo price:** ${matched.price}\n` +
              `• **Indicative demo turnaround:** ${matched.turnaround}\n\n` +
              `*Prices and turnaround are indicative for this demonstration and should be confirmed with the centre.*\n\n` +
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
            "Some routine tests (such as **CBC**, **HbA1c**, and **Vitamin D**) generally do not require fasting, while certain metabolic and lipid panels may require fasting depending on the laboratory's protocol. Please tell me which specific test you are planning to take.",
        };
      }

      if (entities.test) {
        const matched = findTestMatch(entities.test);
        if (matched) {
          return {
            content:
              `⏱️ **Preparation for ${matched.name}:**\n\n` +
              `• ${matched.fastingRequired}\n\n` +
              `*Please confirm the exact preparation instructions with your healthcare provider or laboratory before testing.*`,
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
      const matched = findTestMatch(entities.test);

      if (matched) {
        return {
          content:
            `The indicative demo price for a **${matched.name}** is **${matched.price}**.\n\n` +
            `*This is a demo price. Actual pricing should be confirmed with the centre.*`,
        };
      }

      return {
        content:
          "I have indicative demo pricing for our popular tests (**CBC, Blood Sugar, HbA1c, Lipid Profile, Thyroid Profile, Vitamin D, LFT**, and **KFT**). Ask about a specific test for its demo price, or contact the centre to confirm current charges.",
      };
    }

    case "REPORT_INFORMATION": {
      const matched = findTestMatch(entities.test);

      if (matched) {
        return {
          content:
            `📄 **Report Turnaround — ${matched.name}:**\n\n` +
            `For this demonstration, the indicative turnaround is **${matched.turnaround}**. Actual report availability may vary depending on laboratory processing.\n\n` +
            `• **Report Collection:** ${centreConfig.hours.reportCollection} at our Toopran centre.`,
        };
      }

      return {
        content:
          `📄 **Report Information:**\n\n` +
          `• **Indicative demo turnaround:** Same day for most routine tests (CBC, Blood Sugar, HbA1c, Lipid Profile, LFT, KFT); Thyroid Profile within 24 hours; Vitamin D within 24–48 hours.\n` +
          `• **Report Collection:** Physical reports can be collected at our Toopran centre between ${centreConfig.hours.reportCollection}.\n\n` +
          `*Turnaround times are indicative for this demonstration and may vary depending on laboratory processing.*`,
      };
    }

    case "HOME_SAMPLE_COLLECTION":
      return {
        content:
          `🏠 **Home Sample Collection:**\n\n` +
          `${chatbotKnowledge.centre.homeSampleCollection}\n\n` +
          `Would you like to enquire about a home sample collection request?`,
      };

    case "UNKNOWN":
    default:
      return {
        content:
          `I am the **${centreConfig.name}** assistant. I can help with diagnostic tests, test preparation, centre services, location, timings, and test enquiries. What would you like to know?`,
      };
  }
}
