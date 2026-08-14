import { NextRequest, NextResponse } from "next/server";
import { EnquiryRequest } from "@/lib/chatbot/types";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as EnquiryRequest;

    const { name, phone, test, date, message } = body;

    if (!name || !phone || !test) {
      return NextResponse.json(
        { error: "Name, phone number, and test selection are required." },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { error: "Please provide a valid 10-digit phone number." },
        { status: 400 }
      );
    }

    // In a future phase with Supabase configured:
    // const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    // await supabase.from('enquiries').insert({ ... })

    console.log("[Demo Enquiry Logged]:", {
      name,
      phone: cleanPhone,
      test,
      date: date || "Flexible",
      message: message || "None",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message:
        "Your test enquiry has been submitted. Our team can contact you to confirm availability.",
      enquiryId: `ENQ-${Date.now().toString().slice(-6)}`,
    });
  } catch (error) {
    console.error("Enquiry API error:", error);
    return NextResponse.json(
      { error: "Failed to process enquiry. Please try again or call the centre directly." },
      { status: 500 }
    );
  }
}
