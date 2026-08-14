import React from "react";
import { FlaskConical, ArrowRight } from "lucide-react";
import { centreConfig } from "@/lib/config";

export default function PopularTests() {
  return (
    <section id="tests" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-accent-600 block mb-1">
              Test Catalog
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-900 tracking-tight">
              Common Diagnostic Tests
            </h2>
            <p className="mt-2 text-sm sm:text-base text-text-secondary max-w-2xl">
              Frequently requested diagnostic parameters. Availability, prerequisites, and preparation details can be confirmed via our enquiry form or chatbot.
            </p>
          </div>

          <a
            href="#appointment"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 whitespace-nowrap self-start md:self-auto"
          >
            <span>Request custom test</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Tests Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {centreConfig.popularTests.map((test) => (
            <div
              key={test.name}
              className="p-4 rounded-xl border border-border bg-surface-dim hover:bg-white hover:border-primary-200 hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text leading-snug">
                    {test.name}
                  </h3>
                  <span className="inline-block mt-1.5 px-2 py-0.5 bg-white border border-border-light text-[11px] font-medium text-text-tertiary rounded-md">
                    {test.category}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border-light/60 flex items-center justify-between text-xs">
                <span className="text-text-tertiary">Standard Protocol</span>
                <a
                  href="#appointment"
                  className="font-medium text-primary-600 hover:text-primary-700"
                >
                  Enquire
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Demo Notice */}
        <div className="mt-8 p-4 rounded-xl bg-surface-dim border border-border-light text-center">
          <p className="text-xs text-text-secondary">
            <span className="font-semibold text-primary-800">Note:</span> Listed test names represent standard laboratory profiles. Specific parameters, turnaround times, and pricing should be verified directly with our centre desk.
          </p>
        </div>

      </div>
    </section>
  );
}
