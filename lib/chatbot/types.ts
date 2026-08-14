export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: number;
  isEnquiryConfirmation?: boolean;
  enquiryData?: {
    name: string;
    phone: string;
    test: string;
    date?: string;
  };
}

export type AIProviderName = "intent" | "mock" | "gemini" | "ollama";

export interface AIProvider {
  name: AIProviderName;
  generateResponse(messages: Message[]): Promise<{
    content: string;
    isEnquiryConfirmation?: boolean;
    enquiryData?: {
      name: string;
      phone: string;
      test: string;
      date?: string;
    };
  }>;
}

export interface EnquiryRequest {
  name: string;
  phone: string;
  test: string;
  date?: string;
  message?: string;
}
