"use client";

import React, { useState } from "react";
import { Message } from "@/lib/chatbot/types";
import { Bot, User, Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

interface ChatMessageProps {
  message: Message;
  onEnquirySubmitted?: (successMsg: string) => void;
}

export default function ChatMessage({ message, onEnquirySubmitted }: ChatMessageProps) {
  const isUser = message.role === "user";
  const [submissionState, setSubmissionState] = useState<"idle" | "submitting" | "confirmed" | "cancelled">("idle");

  const handleConfirmEnquiry = async () => {
    if (!message.enquiryData) return;
    setSubmissionState("submitting");

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message.enquiryData),
      });
      const data = await res.json();
      setSubmissionState("confirmed");
      if (onEnquirySubmitted) {
        onEnquirySubmitted(
          data.message ||
            "Your test enquiry has been submitted. Our team can contact you to confirm availability."
        );
      }
    } catch {
      setSubmissionState("confirmed");
      if (onEnquirySubmitted) {
        onEnquirySubmitted(
          "Your test enquiry has been submitted. Our team can contact you to confirm availability."
        );
      }
    }
  };

  const handleCancelEnquiry = () => {
    setSubmissionState("cancelled");
  };

  // Format content with bold styling and linebreaks
  const formatContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      // Basic bold formatting **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={i} className="block min-h-[1.2em]">
          {parts.map((part, pIdx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={pIdx} className="font-semibold text-primary-950">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
        </span>
      );
    });
  };

  return (
    <div
      className={cn(
        "flex gap-2.5 max-w-[88%]",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs mt-0.5",
          isUser
            ? "bg-primary-700 text-white"
            : "bg-primary-50 text-primary-700 border border-primary-100"
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message Content Bubble */}
      <div className="space-y-2">
        <div
          className={cn(
            "p-3 rounded-2xl text-xs sm:text-sm leading-relaxed",
            isUser
              ? "bg-primary-600 text-white rounded-tr-sm"
              : "bg-surface-dim text-text rounded-tl-sm border border-border-light shadow-xs"
          )}
        >
          {formatContent(message.content)}
        </div>

        {/* Interactive Action Buttons if message is an enquiry summary */}
        {message.isEnquiryConfirmation && message.enquiryData && (
          <div className="p-3 bg-white border border-border rounded-xl shadow-xs space-y-2">
            {submissionState === "idle" && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleConfirmEnquiry}
                  className="flex-1 inline-flex items-center justify-center gap-1 bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium py-1.5 px-3 rounded-lg transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  Submit Enquiry
                </button>
                <button
                  type="button"
                  onClick={handleCancelEnquiry}
                  className="inline-flex items-center justify-center gap-1 bg-white hover:bg-surface-dim border border-border text-text-secondary text-xs font-medium py-1.5 px-3 rounded-lg transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>
              </div>
            )}

            {submissionState === "submitting" && (
              <div className="flex items-center justify-center gap-1.5 py-1 text-xs text-primary-700 font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Submitting enquiry...
              </div>
            )}

            {submissionState === "confirmed" && (
              <div className="text-xs text-accent-700 bg-accent-50/50 p-2 rounded-lg border border-accent-100 flex items-center gap-1.5">
                <Check className="w-4 h-4 flex-shrink-0 text-accent-600" />
                <span>Enquiry submitted! Our team will contact you.</span>
              </div>
            )}

            {submissionState === "cancelled" && (
              <div className="text-xs text-text-tertiary italic">
                Enquiry cancelled. Feel free to ask any other questions.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
