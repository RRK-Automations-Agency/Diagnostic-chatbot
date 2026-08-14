"use client";

import React from "react";
import { FlaskConical, Clock, MapPin, Calendar, HelpCircle } from "lucide-react";

interface QuickActionsProps {
  onSelectAction: (text: string) => void;
  disabled?: boolean;
}

export default function QuickActions({ onSelectAction, disabled }: QuickActionsProps) {
  const actions = [
    { label: "Available Tests", icon: FlaskConical, text: "What tests do you offer?" },
    { label: "Test Preparation", icon: Clock, text: "Do I need to fast before tests?" },
    { label: "Location & Address", icon: MapPin, text: "Where are you located?" },
    { label: "Centre Hours", icon: HelpCircle, text: "What are your operating timings?" },
    { label: "Book a Test", icon: Calendar, text: "I want to book a test" },
  ];

  return (
    <div className="p-3 border-t border-border-light bg-surface-dim/70">
      <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-2">
        Suggested Topics:
      </p>
      <div className="flex flex-wrap gap-1.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.label}
              type="button"
              disabled={disabled}
              onClick={() => onSelectAction(act.text)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-border text-xs font-medium text-text-secondary hover:text-primary-700 hover:border-primary-300 hover:bg-primary-50/50 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-xs"
            >
              <Icon className="w-3 h-3 text-primary-600" />
              <span>{act.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
