import React from "react";
import { centreConfig } from "@/lib/config";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-950 text-white/80 text-sm border-t border-primary-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Col 1: Brand & Description */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-sm">
                AJ
              </div>
              <span className="font-bold text-white text-base">
                {centreConfig.name}
              </span>
            </div>

            <p className="text-white/70 text-xs sm:text-sm leading-relaxed max-w-sm">
              A demonstration website presenting clear diagnostic and laboratory testing information for patients in Toopran, Telangana.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#home" className="text-white/70 hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="#services" className="text-white/70 hover:text-white transition-colors">Diagnostic Services</a>
              </li>
              <li>
                <a href="#tests" className="text-white/70 hover:text-white transition-colors">Popular Tests</a>
              </li>
              <li>
                <a href="#why-us" className="text-white/70 hover:text-white transition-colors">Why Choose Us</a>
              </li>
              <li>
                <a href="#about" className="text-white/70 hover:text-white transition-colors">About Us</a>
              </li>
              <li>
                <a href="#appointment" className="text-white/70 hover:text-white transition-colors">Book a Test</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Location & Contact */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Diagnostic Centre Location
            </h4>
            <div className="text-xs sm:text-sm text-white/70 space-y-2">
              <p>
                {centreConfig.name}<br />
                {centreConfig.location.address}<br />
                {centreConfig.location.city}, {centreConfig.location.district}, {centreConfig.location.state} - {centreConfig.location.pincode}
              </p>
              <p className="pt-1">
                <span className="text-white/60">Phone:</span>{" "}
                <a
                  href={`tel:${centreConfig.contact.phone.replace(/\s/g, "")}`}
                  className="text-white/70 hover:text-white transition-colors break-all"
                >
                  {centreConfig.contact.phone}
                </a>
              </p>
              <p>
                <span className="text-white/60">Email:</span>{" "}
                <a
                  href={`mailto:${centreConfig.contact.email}`}
                  className="text-white/70 hover:text-white transition-colors break-all"
                >
                  {centreConfig.contact.email}
                </a>
              </p>
              <p>
                <span className="text-white/60">Hours:</span> {centreConfig.hours.weekdays}
              </p>
            </div>
          </div>

        </div>

        {/* Disclaimers */}
        <div className="mt-10 pt-6 border-t border-white/10 space-y-3 text-xs sm:text-[13px] text-white/70 leading-relaxed max-w-3xl">
          <p>
            <span className="font-semibold text-white/90">Demo Disclaimer:</span>{" "}
            {centreConfig.demoDisclaimer}
          </p>
          <p>
            <span className="font-semibold text-white/90">Medical Disclaimer:</span>{" "}
            {centreConfig.disclaimer}
          </p>
        </div>

        {/* Bottom copyright bar */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <p className="text-center sm:text-left">© {currentYear} {centreConfig.name}. All rights reserved.</p>
          <p className="text-center sm:text-right">Demonstration Website & Integrated Diagnostic Assistant</p>
        </div>
      </div>
    </footer>
  );
}
