"use client";

import React, { useState, useRef, useEffect } from "react";
import { Message } from "@/lib/chatbot/types";
import { centreConfig } from "@/lib/config";
import ChatMessage from "./ChatMessage";
import QuickActions from "./QuickActions";
import TypingIndicator from "./TypingIndicator";
import { Send, X, RotateCcw, AlertTriangle } from "lucide-react";

interface ChatWindowProps {
  onClose: () => void;
}

export default function ChatWindow({ onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-welcome",
      role: "assistant",
      content: `Hello! I'm the **${centreConfig.name}** diagnostic assistant. How can I help you today? Feel free to ask about our tests, sample preparation, timings, or start an enquiry.`,
      timestamp: Date.now(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const callChatApi = async (history: Message[]) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
    });

    if (!res.ok) {
      throw new Error("Chat request failed");
    }

    const data = await res.json();

    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: data.content,
      timestamp: Date.now(),
      isEnquiryConfirmation: data.isEnquiryConfirmation,
      enquiryData: data.enquiryData,
    };

    setMessages((prev) => [...prev, assistantMessage]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend ?? inputValue).trim();
    if (!content || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);
    setHasError(false);

    // If the last visible assistant message is an enquiry summary and the user
    // confirms it in text ("yes", "submit", "ok"), submit it directly — exactly
    // like the Submit Enquiry button. This keeps both submission paths consistent.
    const lastMsg = messages[messages.length - 1];
    const isConfirmingReply =
      Boolean(lastMsg?.isEnquiryConfirmation && lastMsg?.enquiryData) &&
      /^(yes|yeah|yup|yep|sure|confirm|submit|proceed|ok|okay|send|go ahead|yes please|please submit)[\s!.]*$/i.test(
        content
      );

    try {
      if (isConfirmingReply) {
        const res = await fetch("/api/enquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lastMsg!.enquiryData),
        });

        if (!res.ok) {
          throw new Error("Enquiry submission failed");
        }

        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: `confirmed-${Date.now()}`,
            role: "assistant",
            content:
              data.message ||
              "Your test enquiry has been submitted. Our team can contact you to confirm availability.",
            // Marks the enquiry as submitted so the backend never reconstructs
            // an active booking from this historical summary.
            isEnquirySubmitted: true,
            timestamp: Date.now(),
          },
        ]);
        return;
      }

      await callChatApi(newMessages);
    } catch {
      // If the direct submission failed, fall back to the chat API so the user
      // still gets guidance (and the summary stays submittable via the button).
      if (isConfirmingReply) {
        try {
          await callChatApi(newMessages);
        } catch {
          setHasError(true);
          setMessages((prev) => [
            ...prev,
            {
              id: `err-${Date.now()}`,
              role: "assistant",
              content:
                "I could not connect to the assistant server right now. Please try again or contact the diagnostic centre directly at " +
                centreConfig.contact.phone +
                ".",
              timestamp: Date.now(),
            },
          ]);
        }
      } else {
        setHasError(true);
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: "assistant",
            content:
              "I could not connect to the assistant server right now. Please try again or contact the diagnostic centre directly at " +
              centreConfig.contact.phone +
              ".",
            timestamp: Date.now(),
          },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content: `Hello! I'm the **${centreConfig.name}** diagnostic assistant. How can I help you today?`,
        timestamp: Date.now(),
      },
    ]);
    setHasError(false);
  };

  const handleEnquiryConfirmed = (successMsg: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `confirmed-${Date.now()}`,
        role: "assistant",
        content: successMsg,
        // Marks the enquiry as submitted so the backend never reconstructs
        // an active booking from this historical summary.
        isEnquirySubmitted: true,
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-chatbot border border-border overflow-hidden">
      
      {/* Chatbot Header */}
      <div className="px-4 py-3.5 bg-primary-900 text-white flex items-center justify-between border-b border-primary-800">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-primary-700 border border-primary-500 flex items-center justify-center font-bold text-xs">
              AJ
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-accent-400 ring-2 ring-primary-900" />
          </div>
          <div>
            <h3 className="font-semibold text-sm leading-tight text-white">
              Asha Jyothi Diagnostic Assistant
            </h3>
            <span className="text-[11px] text-primary-200 block">
              How can I help you today?
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleResetChat}
            title="Reset conversation"
            className="p-1.5 rounded-lg text-primary-200 hover:text-white hover:bg-primary-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            title="Close chat"
            className="p-1.5 rounded-lg text-primary-200 hover:text-white hover:bg-primary-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 chat-scrollbar bg-white">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onEnquirySubmitted={handleEnquiryConfirmed}
          />
        ))}

        {isLoading && (
          <div className="mr-auto">
            <TypingIndicator />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Chips */}
      <QuickActions
        onSelectAction={(text) => handleSendMessage(text)}
        disabled={isLoading}
      />

      {/* Chat Disclaimer Bar */}
      <div className="px-3 py-1 bg-surface-dim border-t border-border-light text-[10px] text-text-tertiary flex items-center gap-1 justify-center text-center">
        <AlertTriangle className="w-3 h-3 text-accent-600 flex-shrink-0" />
        <span>For informational guidance only. Not medical advice.</span>
      </div>

      {/* Input Form Bar */}
      <div className="p-3 bg-white border-t border-border flex items-end gap-2">
        <textarea
          ref={textareaRef}
          rows={1}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question or request a test..."
          className="flex-1 resize-none max-h-24 min-h-[40px] px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-border focus:border-primary-600 focus:ring-1 focus:ring-primary-600 outline-none text-text transition-colors placeholder:text-text-tertiary"
        />

        <button
          type="button"
          onClick={() => handleSendMessage()}
          disabled={!inputValue.trim() || isLoading}
          className="h-[40px] w-[40px] rounded-xl bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white flex items-center justify-center transition-colors flex-shrink-0"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
