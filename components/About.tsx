import React from "react";
import { CheckCircle, MapPin, Activity } from "lucide-react";
import { centreConfig } from "@/lib/config";

export default function About() {
  return (
    <section id="about" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent-600 block mb-1">
                About Us
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-900 tracking-tight text-balance">
                About Asha Jyothi Diagnostic Centre
              </h2>
            </div>

            <div className="space-y-4 text-text-secondary text-sm sm:text-base leading-relaxed">
              <p>
                This demonstration website presents Asha Jyothi Diagnostic Centre as a diagnostic testing service for individuals and families in Toopran, Telangana, and surrounding communities. Diagnostic findings can be important for early detection, monitoring, and supporting medical treatment.
              </p>
              <p>
                The website is designed to present diagnostic information clearly and help patients with routine enquiries — whether standard blood work, routine pathology, or preventive health screenings — so the diagnostic journey stays clear, straightforward, and supportive.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-text">
                <CheckCircle className="w-4 h-4 text-accent-600 flex-shrink-0" />
                <span>Patient-focused support & assistance</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-text">
                <CheckCircle className="w-4 h-4 text-accent-600 flex-shrink-0" />
                <span>Clear information about testing & sample collection</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-text">
                <CheckCircle className="w-4 h-4 text-accent-600 flex-shrink-0" />
                <span>Digital enquiry & diagnostic assistant</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-text">
                <CheckCircle className="w-4 h-4 text-accent-600 flex-shrink-0" />
                <span>Convenient local accessibility</span>
              </div>
            </div>
          </div>

          {/* Right Visual Card */}
          <div className="lg:col-span-5">
            <div className="bg-primary-900 text-white rounded-2xl p-7 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-primary-800/60 blur-2xl pointer-events-none" />
              
              <div className="relative z-10 space-y-6">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-accent-400">
                  <Activity className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Community-Centric Diagnostics
                  </h3>
                  <p className="text-primary-100 text-sm leading-relaxed">
                    Presenting clear diagnostic testing information for the community in Toopran so patients can understand what is available closer to home.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center gap-3 text-xs text-primary-200">
                  <MapPin className="w-4 h-4 text-accent-400 flex-shrink-0" />
                  <span>Located in Toopran, Medak District, Telangana</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
