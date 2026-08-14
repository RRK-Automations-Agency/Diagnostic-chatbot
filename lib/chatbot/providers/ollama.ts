import { AIProvider, Message } from "../types";
import { getSystemPrompt } from "../systemPrompt";
import { MockProvider } from "./mock";

export class OllamaProvider implements AIProvider {
  name = "ollama" as const;
  private mockFallback = new MockProvider();

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
    const baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
    const model = process.env.OLLAMA_MODEL || "llama3.2";
    const systemPrompt = getSystemPrompt();

    try {
      const ollamaMessages = [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ];

      const res = await fetch(`${baseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: ollamaMessages,
          stream: false,
        }),
      });

      if (!res.ok) {
        console.warn("Ollama endpoint responded with non-200, falling back to mock");
        return this.mockFallback.generateResponse(messages);
      }

      const data = await res.json();
      return {
        content: data.message?.content || "How else may I help you with our diagnostic services?",
      };
    } catch (error) {
      console.warn("Ollama connection failed (server likely not running locally), using mock fallback:", error);
      return this.mockFallback.generateResponse(messages);
    }
  }
}
