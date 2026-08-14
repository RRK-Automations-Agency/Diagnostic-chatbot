import { AIProvider, Message } from "../types";
import { getSystemPrompt } from "../systemPrompt";
import { MockProvider } from "./mock";

export class GeminiProvider implements AIProvider {
  name = "gemini" as const;
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
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("Gemini API key missing, falling back to mock provider");
      return this.mockFallback.generateResponse(messages);
    }

    const systemPrompt = getSystemPrompt();

    // Prepare Gemini contents payload
    const contents = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemPrompt }],
            },
            contents,
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 500,
            },
          }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        console.error("Gemini API error:", response.status, errText);
        return this.mockFallback.generateResponse(messages);
      }

      const data = await response.json();
      const text =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I am ready to help you with test information and appointments.";

      return { content: text };
    } catch (error) {
      console.error("Gemini invocation failed, falling back to mock:", error);
      return this.mockFallback.generateResponse(messages);
    }
  }
}
