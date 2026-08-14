/**
 * Dialog manager implementing state machine and intelligent slot filling for test enquiries.
 */

import {
  BookingSlots,
  ClassificationResult,
  DialogResponse,
  DialogState,
} from "./types";
import { Message } from "../types";
import { extractAllEntities, extractName, extractPhone, extractTest } from "./entityExtractor";
import { generateIntentResponse } from "./responseGenerator";
import { normalizeText } from "./normalizer";

/**
 * Inspects conversation history to reconstruct active booking slots and current dialog state.
 */
export function reconstructDialogContext(messages: Message[]): {
  currentState: DialogState;
  accumulatedSlots: BookingSlots;
} {
  const accumulatedSlots: BookingSlots = {};
  let currentState: DialogState = "IDLE";

  // Replay message history
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];

    if (msg.role === "assistant") {
      const content = msg.content.toLowerCase();
      if (
        content.includes("full name") ||
        content.includes("what is your name") ||
        content.includes("may i know your name")
      ) {
        currentState = "COLLECTING_NAME";
      } else if (
        content.includes("phone number") ||
        content.includes("contact number") ||
        content.includes("10-digit")
      ) {
        currentState = "COLLECTING_PHONE";
      } else if (
        content.includes("which diagnostic test") ||
        content.includes("which test") ||
        content.includes("which specific test") ||
        content.includes("what test would you like")
      ) {
        currentState = "COLLECTING_TEST";
      } else if (msg.isEnquiryConfirmation || content.includes("summary of your")) {
        currentState = "CONFIRMING";
      }
    } else if (msg.role === "user") {
      const norm = normalizeText(msg.content);

      // Check cancellation in user message
      if (
        currentState !== "IDLE" &&
        (norm === "cancel" || norm === "stop" || norm === "abort" || norm === "cancel enquiry")
      ) {
        currentState = "IDLE";
        continue;
      }

      // Extract entities from this turn
      const entities = extractAllEntities(
        msg.content,
        currentState === "COLLECTING_NAME"
      );

      if (entities.test) accumulatedSlots.test = entities.test;
      if (entities.phone) accumulatedSlots.phone = entities.phone;
      if (entities.date) accumulatedSlots.date = entities.date;

      if (currentState === "COLLECTING_NAME") {
        const contextualName = extractName(msg.content, true);
        if (contextualName) {
          accumulatedSlots.name = contextualName;
        }
      } else if (entities.name) {
        accumulatedSlots.name = entities.name;
      }
    }
  }

  return { currentState, accumulatedSlots };
}

/**
 * Handles the conversation turn with slot filling and state transitions.
 */
export function handleDialogTurn(
  messages: Message[],
  classification: ClassificationResult
): DialogResponse {
  const latestMessage = messages[messages.length - 1];
  const userText = latestMessage?.content || "";
  const normalizedText = normalizeText(userText);

  // 1. Check for explicit cancellation
  if (
    normalizedText === "cancel" ||
    normalizedText === "stop" ||
    normalizedText === "abort" ||
    normalizedText === "cancel enquiry"
  ) {
    return {
      content:
        "The test enquiry has been cancelled. How else can I help you today? You can ask about our tests, timings, or location.",
      nextState: "IDLE",
    };
  }

  // 2. Reconstruct context from history
  const { currentState, accumulatedSlots } = reconstructDialogContext(messages.slice(0, -1));

  // 3. Extract any new entities from latest user message
  const isNameContext = currentState === "COLLECTING_NAME";
  const currentEntities = extractAllEntities(userText, isNameContext);

  if (currentEntities.test) accumulatedSlots.test = currentEntities.test;
  if (currentEntities.phone) accumulatedSlots.phone = currentEntities.phone;
  if (currentEntities.date) accumulatedSlots.date = currentEntities.date;

  if (currentState === "COLLECTING_TEST") {
    const rawTestRes = extractTest(userText);
    if (rawTestRes.canonical) {
      accumulatedSlots.test = rawTestRes.canonical;
    } else if (userText.trim().length > 1 && !/^\d+$/.test(userText.trim())) {
      accumulatedSlots.test = userText.trim();
    }
  } else if (isNameContext) {
    const candidateName = extractName(userText, true);
    if (candidateName) {
      accumulatedSlots.name = candidateName;
    }
  } else if (currentState === "COLLECTING_PHONE") {
    const phoneNum = extractPhone(userText);
    if (phoneNum) {
      accumulatedSlots.phone = phoneNum;
    }
  }

  if (currentEntities.name && !accumulatedSlots.name) {
    accumulatedSlots.name = currentEntities.name;
  }

  // 4. If current state is CONFIRMING and user types confirmation text
  if (currentState === "CONFIRMING") {
    if (
      normalizedText === "yes" ||
      normalizedText === "submit" ||
      normalizedText === "confirm" ||
      normalizedText === "proceed" ||
      normalizedText === "ok" ||
      normalizedText === "send"
    ) {
      return {
        content:
          "Thank you! Please click the **Submit Enquiry** button above to send your request directly to our desk, or our team will assist you when you visit.",
        nextState: "SUBMITTED",
      };
    }
  }

  // 5. If intent is BOOK_TEST or we are already in the middle of a booking workflow
  const isInBookingWorkflow =
    currentState === "COLLECTING_TEST" ||
    currentState === "COLLECTING_NAME" ||
    currentState === "COLLECTING_PHONE";

  if (classification.intent === "BOOK_TEST" || isInBookingWorkflow) {
    // If user asked a completely different high-priority question during booking (e.g. EMERGENCY or MEDICAL_ADVICE), prioritize that
    if (
      classification.intent === "EMERGENCY" ||
      classification.intent === "MEDICAL_ADVICE"
    ) {
      return generateIntentResponse(classification);
    }

    // Determine missing slots
    if (!accumulatedSlots.test) {
      return {
        content:
          "I'd be glad to help you with a test enquiry. **Which diagnostic test or health checkup** would you like to enquire about (e.g. CBC, Blood Sugar, Lipid Profile, Thyroid)?",
        nextState: "COLLECTING_TEST",
      };
    }

    if (!accumulatedSlots.name) {
      return {
        content: `Great! For the **${accumulatedSlots.test}** enquiry, **what is your full name**?`,
        nextState: "COLLECTING_NAME",
      };
    }

    if (!accumulatedSlots.phone) {
      return {
        content: `Thank you, **${accumulatedSlots.name}**. **What 10-digit phone number** should our centre team use to contact you?`,
        nextState: "COLLECTING_PHONE",
      };
    }

    // All required slots filled: generate Confirmation
    const dateLine = accumulatedSlots.date ? `• **Preferred Date:** ${accumulatedSlots.date}\n` : "";
    return {
      content:
        `Here is a summary of your test enquiry:\n\n` +
        `• **Patient Name:** ${accumulatedSlots.name}\n` +
        `• **Contact Number:** ${accumulatedSlots.phone}\n` +
        `• **Requested Test:** ${accumulatedSlots.test}\n` +
        dateLine +
        `\nWould you like to submit this enquiry? Click **Submit Enquiry** below or reply to confirm. Our front desk team will contact you to confirm availability.`,
      nextState: "CONFIRMING",
      isEnquiryConfirmation: true,
      enquiryData: {
        name: accumulatedSlots.name,
        phone: accumulatedSlots.phone,
        test: accumulatedSlots.test,
        date: accumulatedSlots.date || "Flexible",
      },
    };
  }

  // 6. Otherwise, respond using standard intent response generator
  return generateIntentResponse(classification);
}
