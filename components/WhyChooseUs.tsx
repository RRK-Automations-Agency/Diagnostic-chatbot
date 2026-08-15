import React from "react";
import { ShieldCheck, Users, Clock, HeartHandshake } from "lucide-react";
import { centreConfig } from "@/lib/config";

const iconMap = [ShieldCheck, Users, Clock, HeartHandshake];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="section-padding bg-surface-dim border-t border-border-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-accent-600 block mb-1">
            About This Demo Centre
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-900 tracking-tight text-balance">
            Why Choose Asha Jyothi
          </h2>
          <p className="mt-3 text-base text-text-secondary">
            Clear information and helpful support designed around routine diagnostic enquiries.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {centreConfig.whyChooseUs.map((item, index) => {
            const Icon = iconMap[index % iconMap.length];

            return (
              <div
                key={item.title}
                className="bg-white rounded-xl p-6 border border-border-light shadow-sm flex flex-col items-center text-center hover:border-primary-200 transition-colors"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-5">
                  <Icon className="w-7 h-7" />
                </div>

                <h3 className="text-base font-semibold text-primary-900 mb-2">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
