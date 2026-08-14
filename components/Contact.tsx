import React from "react";
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";
import { centreConfig } from "@/lib/config";

export default function Contact() {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    centreConfig.location.googleMapsQuery
  )}`;

  return (
    <section id="contact" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-accent-600 block mb-1">
            Reach Out
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-900 tracking-tight">
            Contact & Location
          </h2>
          <p className="mt-3 text-base text-text-secondary">
            Visit our diagnostic centre in Toopran or connect with our support desk for testing guidance and sample collection requests.
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Address Card */}
          <div className="p-6 rounded-2xl border border-border bg-surface-dim flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-primary-900 mb-1">
                Centre Address
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {centreConfig.name}<br />
                {centreConfig.location.address}<br />
                {centreConfig.location.city}, {centreConfig.location.state}, {centreConfig.location.country}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border-light">
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700"
              >
                <span>View on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Operating Hours Card */}
          <div className="p-6 rounded-2xl border border-border bg-surface-dim flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-primary-900 mb-1">
                Operating Hours
              </h3>
              <div className="text-sm text-text-secondary space-y-1 mt-2">
                <p>
                  <span className="font-medium text-text">Monday – Saturday:</span><br />
                  {centreConfig.hours.weekdays}
                </p>
                <p className="pt-2">
                  <span className="font-medium text-text">Sunday:</span><br />
                  {centreConfig.hours.sunday}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border-light text-xs text-text-tertiary">
              Timings subject to public holidays
            </div>
          </div>

          {/* Phone & Direct Contact */}
          <div className="p-6 rounded-2xl border border-border bg-surface-dim flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-primary-900 mb-1">
                Contact Desk
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Direct phone inquiries: <br />
                <span className="font-mono font-medium text-text mt-1 block">
                  {centreConfig.contact.phone}
                </span>
              </p>
              <p className="text-xs text-text-tertiary mt-2">
                Support for appointment verification, sample collection queries, and report status.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border-light">
              <a
                href="#appointment"
                className="inline-flex items-center justify-center w-full bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors"
              >
                Book Test / Send Message
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
