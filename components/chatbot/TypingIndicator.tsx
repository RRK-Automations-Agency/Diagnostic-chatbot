"use client";

import React from "react";

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-3.5 py-2.5 bg-surface-dim rounded-2xl rounded-tl-sm w-fit border border-border-light">
      <div className="w-1.5 h-1.5 rounded-full bg-primary-600 animate-bounce [animation-delay:-0.3s]" />
      <div className="w-1.5 h-1.5 rounded-full bg-primary-600 animate-bounce [animation-delay:-0.15s]" />
      <div className="w-1.5 h-1.5 rounded-full bg-primary-600 animate-bounce" />
    </div>
  );
}
