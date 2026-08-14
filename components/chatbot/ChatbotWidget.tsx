"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquareText, X, Sparkles } from "lucide-react";
import ChatWindow from "./ChatWindow";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      
      {/* Expanded Chatbot Modal / Popover */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs sm:hidden z-40"
            />

            {/* Chat Container Window */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed bottom-0 left-0 right-0 h-[85vh] max-h-[640px] sm:static sm:h-[600px] sm:w-[380px] sm:max-h-[620px] z-50 rounded-t-2xl sm:rounded-2xl shadow-2xl"
            >
              <ChatWindow onClose={() => setIsOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Launcher Action Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="relative flex items-center gap-2.5 bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 sm:px-4.5 sm:py-3.5 rounded-full shadow-chatbot hover:shadow-xl transition-all group focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
          aria-label="Open AI Assistant"
        >
          {/* Pulsing beacon indicator */}
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-400" />
          </span>

          <div className="flex items-center gap-1.5 font-medium text-sm">
            <MessageSquareText className="w-5 h-5" />
            <span className="hidden sm:inline">Ask AI Assistant</span>
          </div>

          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent-500 text-white flex items-center justify-center text-[10px]">
            <Sparkles className="w-3 h-3" />
          </div>
        </motion.button>
      )}

    </div>
  );
}
