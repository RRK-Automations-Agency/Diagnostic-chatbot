"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Clock, HeartHandshake, ArrowRight, PhoneCall, CheckCircle2 } from "lucide-react";
import { centreConfig } from "@/lib/config";

export default function Hero() {
  return (
    <section id="home" className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-gradient-to-b from-primary-50/50 via-white to-white">
      {/* Background Soft Glows */}
      <div className="absolute top-12 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary-100/50 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-0 -ml-20 w-80 h-80 rounded-full bg-accent-400/10 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Copy */}
          <motion.div
            className="lg:col-span-7 space-y-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Location Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-800 text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
              Diagnostic Care in {centreConfig.location.city}, {centreConfig.location.state}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary-900 tracking-tight leading-[1.15]">
              {centreConfig.tagline}
            </h1>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl">
              Dedicated to delivering dependable diagnostic testing with precise reports, compassionate staff, and a patient-first experience for families in Toopran and surrounding areas.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href="#appointment"
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3.5 rounded-xl shadow-sm hover:shadow transition-all text-sm sm:text-base focus-visible:ring-2 focus-visible:ring-primary-600"
              >
                <span>Book a Test</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-white hover:bg-surface-dim text-text-secondary font-medium px-6 py-3.5 rounded-xl border border-border transition-colors text-sm sm:text-base focus-visible:ring-2 focus-visible:ring-primary-600"
              >
                <PhoneCall className="w-4 h-4 text-primary-600" />
                <span>Contact Centre</span>
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="pt-6 border-t border-border-light grid grid-cols-3 gap-4 max-w-lg">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-text-secondary">Reliable Testing</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-text-secondary">Timely Reports</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 flex-shrink-0">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-text-secondary">Patient Friendly</span>
              </div>
            </div>
          </motion.div>

          {/* Diagnostic Info Panel / Visual Element */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="bg-white rounded-2xl border border-border shadow-md p-6 sm:p-7 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-border-light pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent-500" />
                  <span className="text-sm font-semibold text-primary-900">Centre Highlights</span>
                </div>
                <span className="text-xs text-text-tertiary font-mono">Demo Centre Overview</span>
              </div>

              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-surface-dim border border-border-light flex items-start gap-3.5">
                  <CheckCircle2 className="w-5 h-5 text-accent-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-text">Routine & Specialized Testing</h4>
                    <p className="text-xs text-text-secondary mt-0.5">Blood chemistry, complete haemograms, lipid, kidney & liver panels.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-dim border border-border-light flex items-start gap-3.5">
                  <CheckCircle2 className="w-5 h-5 text-accent-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-text">Home Sample Collection</h4>
                    <p className="text-xs text-text-secondary mt-0.5">Safe, professional home collection available for eligible tests.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-dim border border-border-light flex items-start gap-3.5">
                  <CheckCircle2 className="w-5 h-5 text-accent-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-text">Digital Diagnostic Assistant</h4>
                    <p className="text-xs text-text-secondary mt-0.5">Use our integrated 24/7 Diagnostic Assistant in the corner for test enquiry & details.</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border-light flex items-center justify-between text-xs text-text-tertiary">
                <span>Location: {centreConfig.location.city}, {centreConfig.location.state}</span>
                <span className="font-medium text-primary-700">Trusted Local Care</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
