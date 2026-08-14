import { AIProvider, AIProviderName } from "../types";
import { IntentProvider } from "./intent";
import { MockProvider } from "./mock";
import { GeminiProvider } from "./gemini";
import { OllamaProvider } from "./ollama";

export function getAIProvider(): AIProvider {
  const mode = (
    process.env.CHATBOT_MODE?.toLowerCase() ||
    process.env.AI_PROVIDER?.toLowerCase() ||
    "intent"
  ) as AIProviderName;

  switch (mode) {
    case "gemini":
      return new GeminiProvider();
    case "ollama":
      return new OllamaProvider();
    case "mock":
      return new MockProvider();
    case "intent":
    default:
      return new IntentProvider();
  }
}

