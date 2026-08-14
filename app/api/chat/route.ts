import { NextRequest, NextResponse } from "next/server";
import { getAIProvider } from "@/lib/chatbot/providers";
import { Message } from "@/lib/chatbot/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body?.messages as Message[];

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid request payload: messages array is required." },
        { status: 400 }
      );
    }

    // Safety checks: limit message size and length
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg || !lastMsg.content || typeof lastMsg.content !== "string") {
      return NextResponse.json(
        { error: "Message content must be a non-empty string." },
        { status: 400 }
      );
    }

    if (lastMsg.content.length > 2000) {
      return NextResponse.json(
        { error: "Message length exceeds maximum allowable limit." },
        { status: 400 }
      );
    }

    const provider = getAIProvider();
    const response = await provider.generateResponse(messages);

    return NextResponse.json({
      role: "assistant",
      content: response.content,
      isEnquiryConfirmation: response.isEnquiryConfirmation || false,
      enquiryData: response.enquiryData || null,
      provider: provider.name,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        role: "assistant",
        content:
          "I am currently experiencing a temporary connection issue. Please contact the diagnostic centre directly or try again in a moment.",
      },
      { status: 500 }
    );
  }
}
