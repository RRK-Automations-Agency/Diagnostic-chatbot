"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatWindow from "./ChatWindow";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed z-50 bottom-[calc(env(safe-area-inset-bottom)+1rem)] right-4 sm:right-6">
      
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
              className="fixed bottom-0 left-0 right-0 h-[85dvh] max-h-[640px] w-full sm:static sm:h-[600px] sm:w-[380px] sm:max-h-[620px] z-50 rounded-t-2xl sm:rounded-2xl shadow-2xl"
            >
              <ChatWindow onClose={() => setIsOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Diagnostic Assistant Launcher */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen(true)}
          aria-label="Open Diagnostic Assistant"
          className="group relative flex h-14 w-14 sm:h-[76px] sm:w-[76px] items-center justify-center rounded-2xl bg-gradient-to-b from-primary-600 to-primary-700 text-white shadow-chatbot hover:shadow-xl transition-shadow focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
        >
          {/* Hover tooltip (never permanent) */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-primary-950 px-3 py-1.5 text-xs font-medium text-white shadow-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          >
            Ask Diagnostic Assistant
          </span>

          {/* Subtle pulse animation on the badge */}
          <span
            aria-hidden="true"
            className="animate-launcher-pulse relative flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center"
          >
            {/* Chat bubble with embedded ECG / heartbeat waveform */}
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-full"
            >
              <path
                d="M8 14.5C8 11.46 10.46 9 13.5 9h21C37.54 9 40 11.46 40 14.5v12c0 3.04-2.46 5.5-5.5 5.5H24l-8 6.75V32h-2.5C10.46 32 8 29.54 8 26.5v-12Z"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <path
                d="M11.5 20h5.5l2.25-4.5 3.25 9 2.5-4.5H32"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          {/* Pulsing beacon indicator */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-accent-400 ring-2 ring-white" />
          </span>
        </motion.button>
      )}

    </div>
  );
}
