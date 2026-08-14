/**
 * Provider adapter for the deterministic intent-based engine.
 */

import { AIProvider, Message } from "../types";
import { processIntentChat } from "../intent";

export class IntentProvider implements AIProvider {
  name = "intent" as const;

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
    return processIntentChat(messages);
  }
}
