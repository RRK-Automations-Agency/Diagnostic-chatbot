import { AIProvider, Message } from "../types";
import { chatbotKnowledge } from "../knowledge";

export class MockProvider implements AIProvider {
  name = "mock" as const;

  async generateResponse(messages: Message[]): Promise<{
    content: string;
    isEnquiryConfirmation?: boolean;
    enquiryData?: {
      name: string;
      phone: string;
      test: string;
      date?: string;
    };
  }> {
    // Get the latest user message
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    const userText = lastUserMessage?.content?.toLowerCase().trim() || "";

    // Check conversation history for booking multi-step flow
    const conversationHistory = messages.map((m) => `${m.role}: ${m.content}`).join("\n").toLowerCase();

    // 1. Check if user is answering a booking prompt
    const phoneMatch = userText.match(/\b\d{10}\b/);
    const hasNameContext = conversationHistory.includes("what is your full name") || conversationHistory.includes("what is your name") || conversationHistory.includes("may i know your name");
    const hasPhoneContext = conversationHistory.includes("phone number") || conversationHistory.includes("contact number");
    const hasTestContext = conversationHistory.includes("which test or service") || conversationHistory.includes("what test would you like");

    // Check for enquiry details extraction in messages
    const nameMatch = messages.find(
      (m, idx) =>
        m.role === "user" &&
        idx > 0 &&
        messages[idx - 1]?.role === "assistant" &&
        (messages[idx - 1]?.content.toLowerCase().includes("what is your full name") ||
          messages[idx - 1]?.content.toLowerCase().includes("what is your name"))
    );

    const phoneUserMsg = messages.find((m) => m.role === "user" && /\b\d{10}\b/.test(m.content));

    // Multi-turn booking flow logic
    if (userText.includes("book") || userText.includes("appointment") || userText.includes("schedule") || userText.includes("enquiry")) {
      if (!nameMatch) {
        return {
          content: "I'd be glad to help you start a test enquiry. To begin, **what is your full name**?",
        };
      }
    }

    if (hasNameContext && !phoneUserMsg) {
      const extractedName = lastUserMessage?.content.trim();
      return {
        content: `Thank you, ${extractedName}. **What 10-digit phone number** should our centre team use to contact you?`,
      };
    }

    if (hasPhoneContext && phoneMatch) {
      return {
        content: "Got it! **Which test or service** would you like to enquire about (e.g. CBC, Blood Sugar, Thyroid Profile, Health Checkup)?",
      };
    }

    if (hasTestContext && nameMatch && phoneUserMsg) {
      const name = nameMatch.content.trim();
      const phone = phoneUserMsg.content.match(/\b\d{10}\b/)?.[0] || phoneUserMsg.content.trim();
      const test = lastUserMessage?.content.trim() || "Diagnostic Test";

      return {
        content: `Here is a summary of your enquiry:\n\n` +
          `• **Name:** ${name}\n` +
          `• **Phone:** ${phone}\n` +
          `• **Requested Test:** ${test}\n\n` +
          `Would you like to submit this enquiry? Our front desk will contact you directly to confirm availability and schedule.`,
        isEnquiryConfirmation: true,
        enquiryData: {
          name,
          phone,
          test,
        },
      };
    }

    // 2. Direct keyword-based FAQ responses

    // What tests do you offer / list tests
    if (
      userText.includes("what tests") ||
      userText.includes("test list") ||
      userText.includes("available tests") ||
      userText.includes("offer") ||
      userText.includes("services")
    ) {
      const testsList = chatbotKnowledge.popularTests.map((t) => `• **${t.name}**`).join("\n");
      return {
        content: `At **${chatbotKnowledge.centre.name}**, we provide a range of diagnostic and pathology services:\n\n${testsList}\n\nWe also offer **Home Sample Collection** in the Toopran area. Would you like details on any specific test or help with booking?`,
      };
    }

    // What is CBC
    if (userText.includes("cbc") || userText.includes("complete blood count")) {
      const cbc = chatbotKnowledge.popularTests.find((t) => t.name.includes("CBC"));
      return {
        content: `**Complete Blood Count (CBC)**:\n${cbc?.description}\n\n• **Preparation:** ${cbc?.fastingRequired}\n\nWould you like to enquire about scheduling a CBC test?`,
      };
    }

    // Blood Sugar / Diabetes
    if (userText.includes("sugar") || userText.includes("glucose") || userText.includes("diabetes") || userText.includes("hba1c")) {
      return {
        content: `We offer standard glucose evaluations including:\n\n` +
          `• **Fasting Blood Sugar (FBS):** Requires 8–10 hours overnight fasting.\n` +
          `• **Post-Prandial (PPBS):** Taken 2 hours after a meal.\n` +
          `• **HbA1c:** Reflects average blood sugar over 3 months (no fasting required).\n\n` +
          `Let me know if you would like to book a blood sugar profile.`,
      };
    }

    // Lipid profile / Cholesterol
    if (userText.includes("lipid") || userText.includes("cholesterol") || userText.includes("heart")) {
      const lipid = chatbotKnowledge.popularTests.find((t) => t.name.includes("Lipid"));
      return {
        content: `**Lipid Profile:**\n${lipid?.description}\n\n• **Preparation:** ${lipid?.fastingRequired}`,
      };
    }

    // Thyroid
    if (userText.includes("thyroid") || userText.includes("tsh") || userText.includes("t3") || userText.includes("t4")) {
      const thyroid = chatbotKnowledge.popularTests.find((t) => t.name.includes("Thyroid"));
      return {
        content: `**Thyroid Profile (T3, T4, TSH):**\n${thyroid?.description}\n\n• **Preparation:** ${thyroid?.fastingRequired}`,
      };
    }

    // Fasting / preparation questions
    if (userText.includes("fast") || userText.includes("preparation") || userText.includes("empty stomach") || userText.includes("water")) {
      return {
        content: `**General Fasting & Preparation Guidelines:**\n\n${chatbotKnowledge.generalFastingGuidelines}\n\n*Always follow the specific instructions provided by your doctor or our lab coordinator.*`,
      };
    }

    // Timings / Hours
    if (userText.includes("timing") || userText.includes("hour") || userText.includes("open") || userText.includes("sunday")) {
      return {
        content: `**Operating Hours for ${chatbotKnowledge.centre.name}:**\n\n• ${chatbotKnowledge.centre.timings}\n\nFor any urgent inquiries, please visit during operational hours.`,
      };
    }

    // Location / Address
    if (userText.includes("location") || userText.includes("where") || userText.includes("address") || userText.includes("toopran")) {
      return {
        content: `**Location & Address:**\n\n${chatbotKnowledge.centre.name}\n${chatbotKnowledge.centre.address}\n${chatbotKnowledge.centre.location}\n\nYou can also find our location on Google Maps using the button in the Contact section of this page.`,
      };
    }

    // Contact / Phone
    if (userText.includes("contact") || userText.includes("phone") || userText.includes("call") || userText.includes("number")) {
      return {
        content: `You can reach **${chatbotKnowledge.centre.name}** at:\n\n• **Phone:** ${chatbotKnowledge.centre.phone}\n• **Location:** ${chatbotKnowledge.centre.location}\n\nYou can also use the enquiry form on our website to submit your request directly.`,
      };
    }

    // Home sample collection
    if (userText.includes("home") || userText.includes("collection") || userText.includes("doorstep") || userText.includes("sample")) {
      return {
        content: `**Home Sample Collection:**\nYes! We offer doorstep sample collection for eligible diagnostic tests in the Toopran area. A trained phlebotomist will visit your address safely.\n\nWould you like me to take down your details for a home collection request?`,
      };
    }

    // Doctor / Diagnosis inquiries (Medical safety check)
    if (
      userText.includes("diagnos") ||
      userText.includes("symptom") ||
      userText.includes("pain") ||
      userText.includes("fever") ||
      userText.includes("medicine") ||
      userText.includes("cure") ||
      userText.includes("treatment") ||
      userText.includes("tablet")
    ) {
      return {
        content: `I am an informational assistant for Asha Jyothi Diagnostic Centre and **not a medical doctor**. I cannot provide medical diagnosis, prescribe medications, or assess clinical symptoms.\n\nPlease consult a qualified physician or healthcare professional for diagnosis and medical guidance. Once your doctor prescribes tests, we will be glad to assist with laboratory testing.`,
      };
    }

    // Default polite response without hallucination
    return {
      content: `Hello! I am the virtual assistant for **${chatbotKnowledge.centre.name}** in Toopran. I can help with information about our diagnostic services, common tests (CBC, Blood Sugar, Thyroid, etc.), fasting guidelines, centre hours, and submitting a test enquiry.\n\nHow may I assist you today?`,
    };
  }
}
