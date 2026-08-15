/**
 * Dialog manager implementing state machine and intelligent slot filling for test enquiries.
 */

import {
  BookingSlots,
  ClassificationResult,
  DialogResponse,
  DialogState,
  IntentType,
} from "./types";
import { Message } from "../types";
import { extractAllEntities, extractName, extractPhone, extractTest } from "./entityExtractor";
import { generateIntentResponse } from "./responseGenerator";
import { isCancellationPhrase, normalizeText } from "./normalizer";

/**
 * Inspects conversation history to reconstruct active booking slots and current dialog state.
 *
 * State is derived from the conversation history each turn. Three distinct things are kept
 * separate:
 *  1. CHAT HISTORY — every visible message (historical confirmation summaries stay visible).
 *  2. ACTIVE DIALOG STATE — reconstructed from prompt markers and the submission marker.
 *  3. SUBMITTED ENQUIRY — an assistant message flagged `isEnquirySubmitted` terminates any
 *     active booking; a historical summary must never resurrect CONFIRMING/COLLECTING_*.
 */
export function reconstructDialogContext(messages: Message[]): {
  currentState: DialogState;
  accumulatedSlots: BookingSlots;
} {
  let accumulatedSlots: BookingSlots = {};
  let currentState: DialogState = "IDLE";

  // Replay message history
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];

    if (msg.role === "assistant") {
      const content = msg.content.toLowerCase();

      // A successfully submitted enquiry ends any active booking. The confirmation
      // summary that preceded it must NOT reconstruct a live booking afterwards.
      if (msg.isEnquirySubmitted) {
        currentState = "IDLE";
        accumulatedSlots = {};
        continue;
      }

      // Confirmation summaries are detected BEFORE the text-based prompt checks:
      // the summary contains "Contact Number:" which would otherwise be mistaken
      // for a COLLECTING_PHONE prompt.
      if (msg.isEnquiryConfirmation || content.includes("summary of your")) {
        currentState = "CONFIRMING";
      } else if (
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
      }
    } else if (msg.role === "user") {
      const norm = normalizeText(msg.content);

      // Explicit cancellation in a user message aborts any active booking
      // and discards every partially collected slot.
      if (currentState !== "IDLE" && isCancellationPhrase(norm)) {
        currentState = "IDLE";
        accumulatedSlots = {};
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

/** Prompts that should interrupt an active booking when the user asks them mid-flow. */
const NON_BOOKING_INTENTS: IntentType[] = [
  "GREETING",
  "GOODBYE",
  "THANK_YOU",
  "HELP",
  "CENTRE_INFO",
  "LOCATION",
  "TIMINGS",
  "CONTACT",
  "SERVICES",
  "TEST_AVAILABILITY",
  "TEST_INFORMATION",
  "TEST_PREPARATION",
  "TEST_PRICE",
  "REPORT_INFORMATION",
  "HOME_SAMPLE_COLLECTION",
];

/** True when the user text reads as a question rather than a slot value. */
function looksLikeQuestion(normalizedText: string, rawText: string): boolean {
  return (
    /[?]\s*$/.test(rawText) ||
    /^(?:where|what|when|how|why|who|which|do|does|did|can|could|is|are|am|have|has|shall|will)\b/.test(
      normalizedText
    )
  );
}

/** True when the user is declining/refusing rather than supplying a slot value. */
function looksLikeRefusal(normalizedText: string): boolean {
  return (
    /\b(?:don'?t|dont|do\s+not|doesn'?t|does\s+not|no\s+thanks|no\s+thank\s+you|never\s+mind|not\s+(?:interested|needed|required)|changed\s+my\s+mind)\b/i.test(
      normalizedText
    )
  );
}

/** Text confirmations that submit the visible enquiry summary. */
function isConfirmationText(normalizedText: string): boolean {
  return /^(?:yes|yeah|yup|yep|sure|confirm|submit|proceed|ok|okay|send|go\s+ahead)[\s!.]*$/i.test(
    normalizedText
  );
}

/** Continuation prompt shown after an interruption so the booking resumes cleanly. */
function buildContinuationPrompt(state: DialogState, slots: BookingSlots): string {
  switch (state) {
    case "COLLECTING_TEST":
      return "I'm still holding your enquiry — please tell me **which diagnostic test** you would like to book (e.g. CBC, Blood Sugar, Thyroid, Lipid Profile).";
    case "COLLECTING_NAME":
      return `If you'd like to continue your **${slots.test || "test"}** enquiry, please share **your full name**.`;
    case "COLLECTING_PHONE":
      return `If you'd like to continue your **${slots.test || "test"}** enquiry, please share **your 10-digit phone number**.`;
    default:
      return "Would you like to continue with your test enquiry, or ask about something else?";
  }
}

/** Asks for the next missing slot (used both normally and after a refusal). */
function promptForMissingSlot(
  state: DialogState,
  slots: BookingSlots,
  note?: string
): DialogResponse {
  const prefix = note ? `${note}\n\n` : "";
  switch (state) {
    case "COLLECTING_NAME":
      return {
        content: `${prefix}Great! For the **${slots.test || "test"}** enquiry, **what is your full name**?`,
        nextState: "COLLECTING_NAME",
      };
    case "COLLECTING_PHONE":
      return {
        content: `${prefix}Thank you, **${slots.name || "there"}**. **What 10-digit phone number** should our centre team use to contact you?`,
        nextState: "COLLECTING_PHONE",
      };
    case "COLLECTING_TEST":
    default:
      return {
        content: `${prefix}I'd be glad to help you with a test enquiry. **Which diagnostic test or health checkup** would you like to enquire about (e.g. CBC, Blood Sugar, Lipid Profile, Thyroid)?`,
        nextState: "COLLECTING_TEST",
      };
  }
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

  // 2. Reconstruct context from history (excludes the current user message)
  const { currentState, accumulatedSlots: reconstructedSlots } = reconstructDialogContext(
    messages.slice(0, -1)
  );
  let accumulatedSlots = reconstructedSlots;

  const isInBookingWorkflow =
    currentState === "COLLECTING_TEST" ||
    currentState === "COLLECTING_NAME" ||
    currentState === "COLLECTING_PHONE";

  // 1. Check for explicit cancellation of an active booking/enquiry
  if (
    isCancellationPhrase(normalizedText) &&
    (isInBookingWorkflow || currentState === "CONFIRMING")
  ) {
    return {
      content:
        "The test enquiry has been cancelled. How else can I help you today? You can ask about our tests, timings, or location.",
      nextState: "IDLE",
    };
  }

  // 3. Extract any new entities from latest user message
  const isNameContext = currentState === "COLLECTING_NAME";
  const currentEntities = extractAllEntities(userText, isNameContext);

  // 4. If current state is CONFIRMING and user types confirmation text
  if (currentState === "CONFIRMING" && isConfirmationText(normalizedText)) {
    return {
      content:
        "Thank you! Please click the **Submit Enquiry** button above to send your request directly to our desk, or our team will assist you when you visit.",
      nextState: "SUBMITTED",
    };
  }

  // 5. If intent is BOOK_TEST or we are already in the middle of a booking workflow
  if (classification.intent === "BOOK_TEST" || isInBookingWorkflow) {
    // If user asked a completely different high-priority question during booking
    // (e.g. EMERGENCY or MEDICAL_ADVICE), prioritize that
    if (
      classification.intent === "EMERGENCY" ||
      classification.intent === "MEDICAL_ADVICE"
    ) {
      return generateIntentResponse(classification);
    }

    // A fresh BOOK_TEST request (re)starts the booking — discard any stale slots
    // from an earlier/aborted enquiry.
    if (classification.intent === "BOOK_TEST") {
      accumulatedSlots = {};
    }

    // Apply freshly extracted entities to the working slot set
    if (currentEntities.test) accumulatedSlots.test = currentEntities.test;
    if (currentEntities.phone) accumulatedSlots.phone = currentEntities.phone;
    if (currentEntities.date) accumulatedSlots.date = currentEntities.date;
    if (currentEntities.name && !accumulatedSlots.name) {
      accumulatedSlots.name = currentEntities.name;
    }

    // Interruption: the user asked an unrelated question mid-booking. Answer it,
    // then gently resume the booking. The question must never be stored as a slot.
    const isInterruption =
      looksLikeQuestion(normalizedText, userText) &&
      classification.intent !== "BOOK_TEST" &&
      classification.intent !== "UNKNOWN" &&
      NON_BOOKING_INTENTS.includes(classification.intent);

    if (isInterruption) {
      const answer = generateIntentResponse(classification);
      return {
        content: `${answer.content}\n\n${buildContinuationPrompt(currentState, accumulatedSlots)}`,
      };
    }

    // Refusal: "I don't want home collection" etc. must not be stored as a slot value.
    if (looksLikeRefusal(normalizedText)) {
      return promptForMissingSlot(currentState, accumulatedSlots);
    }

    // Determine missing slots / store collected values
    if (currentState === "COLLECTING_TEST") {
      const rawTestRes = extractTest(userText);
      if (rawTestRes.canonical) {
        accumulatedSlots.test = rawTestRes.canonical;
      } else if (
        userText.trim().length > 1 &&
        !/^\d+$/.test(userText.trim()) &&
        !/(?:₹|rs\.?\s*\d|rupees?|inr)\b/i.test(userText) &&
        !looksLikeQuestion(normalizedText, userText)
      ) {
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
      } else if (/\d/.test(userText) || /^[a-z]{3,12}$/i.test(userText.trim())) {
        return {
          content:
            "That doesn't look like a valid 10-digit Indian mobile number. Please share a **10-digit number starting with 6, 7, 8, or 9** (e.g. 98765 43210).",
          nextState: "COLLECTING_PHONE",
        };
      }
    }

    if (!accumulatedSlots.test) {
      return promptForMissingSlot("COLLECTING_TEST", accumulatedSlots);
    }

    if (!accumulatedSlots.name) {
      return promptForMissingSlot("COLLECTING_NAME", accumulatedSlots);
    }

    if (!accumulatedSlots.phone) {
      return promptForMissingSlot("COLLECTING_PHONE", accumulatedSlots);
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
