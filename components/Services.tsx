"use client";

import React from "react";
import { motion } from "framer-motion";
import { Droplets, Microscope, HeartPulse, Home, ArrowUpRight } from "lucide-react";
import { centreConfig } from "@/lib/config";

const iconMap = {
  "blood-tests": Droplets,
  pathology: Microscope,
  "health-checkups": HeartPulse,
  "home-collection": Home,
};

export default function Services() {
  return (
    <section id="services" className="section-padding bg-surface-dim border-y border-border-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-accent-600 mb-2">
            Diagnostic Solutions
          </h2>
          <p className="text-3xl sm:text-4xl font-bold text-primary-900 tracking-tight">
            Our Core Diagnostic Services
          </p>
          <p className="mt-3 text-base text-text-secondary">
            Providing reliable laboratory and screening services tailored to meet everyday health needs and clinical assessments.
          </p>
        </div>

        {/* 4 Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {centreConfig.services.map((service, index) => {
            const Icon = iconMap[service.id as keyof typeof iconMap] || Microscope;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white rounded-xl p-6 border border-border hover:border-primary-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-5 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-200">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-semibold text-primary-900 group-hover:text-primary-600 transition-colors">
                    {service.title}
                  </h3>

                  <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border-light flex items-center justify-between">
                  <a
                    href="#appointment"
                    className="text-xs font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 group/link"
                  >
                    <span>Enquire test</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
