/**
 * Main entrypoint for the deterministic intent-based chatbot engine.
 */

import { Message } from "../types";
import { DialogResponse } from "./types";
import { classifyIntent } from "./classifier";
import { handleDialogTurn, reconstructDialogContext } from "./dialogManager";

export * from "./types";
export * from "./intents";
export * from "./normalizer";
export * from "./entityExtractor";
export * from "./classifier";
export * from "./dialogManager";
export * from "./responseGenerator";

/**
 * Processes an incoming array of conversation messages deterministically.
 */
export async function processIntentChat(messages: Message[]): Promise<DialogResponse> {
  if (!messages || messages.length === 0) {
    return {
      content:
        "Hello! I am the virtual assistant for Asha Jyothi Diagnostic Centre. How can I help you today?",
    };
  }

  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
  const rawText = lastUserMessage?.content || "";

  // Derive current dialog state from history
  const { currentState } = reconstructDialogContext(messages.slice(0, -1));

  // Classify intent
  const classification = classifyIntent(rawText, currentState);

  // Manage dialog turn and response generation
  return handleDialogTurn(messages, classification);
}
