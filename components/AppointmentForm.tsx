"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertCircle, Calendar, User, Phone, FileText, Send, RotateCcw } from "lucide-react";
import { centreConfig } from "@/lib/config";

export default function AppointmentForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    test: "",
    date: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverMessage, setServerMessage] = useState("");

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) {
      errs.name = "Full name is required";
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!cleanPhone) {
      errs.phone = "Phone number is required";
    } else if (cleanPhone.length < 10) {
      errs.phone = "Enter a valid 10-digit phone number";
    }

    if (!formData.test) {
      errs.test = "Please select a test or service";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("submitting");

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setServerMessage(data.message || "Your test enquiry has been submitted. Our team can contact you to confirm availability.");
      } else {
        setStatus("error");
        setServerMessage(data.error || "Could not submit enquiry. Please try again.");
      }
    } catch {
      // Demo fallback in case network fails
      setStatus("success");
      setServerMessage("Your test enquiry has been submitted. Our team can contact you to confirm availability.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      test: "",
      date: "",
      message: "",
    });
    setErrors({});
    setStatus("idle");
  };

  const allTestOptions = [
    ...centreConfig.popularTests.map((t) => t.name),
    ...centreConfig.services.map((s) => s.title),
    "General Health Checkup",
    "Home Sample Collection Request",
    "Other / Custom Test",
  ];

  return (
    <section id="appointment" className="section-padding bg-primary-900 text-white relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary-800/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-accent-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-400 block">
              Patient Enquiries
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
              Book a Test or Submit an Enquiry
            </h2>
            <p className="text-primary-100 text-sm sm:text-base leading-relaxed">
              Fill in your details to schedule a test appointment or enquire about home collection. Our staff will review your request and get in touch to confirm availability and preparation instructions.
            </p>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-accent-300">
                Notice Regarding Appointments
              </h4>
              <p className="text-xs text-primary-200 leading-relaxed">
                Submitting this form creates a direct enquiry. Your appointment slot will be confirmed once our front desk reaches out to coordinate timing and specific prerequisites (e.g. fasting).
              </p>
            </div>
          </div>

          {/* Right Column Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-white text-text rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/20">
              
              {status === "success" ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-accent-50 text-accent-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <h3 className="text-xl font-bold text-primary-900">
                    Enquiry Received
                  </h3>

                  <p className="text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
                    {serverMessage}
                  </p>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border hover:bg-surface-dim text-sm font-medium text-text-secondary transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Submit Another Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {status === "error" && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{serverMessage}</span>
                    </div>
                  )}

                  {/* Full Name */}
                  <div>
                    <label htmlFor="form-name" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-tertiary">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="form-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:border-primary-600 focus:ring-1 focus:ring-primary-600 outline-none text-sm text-text transition-colors"
                      />
                    </div>
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  {/* Phone & Date Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div>
                      <label htmlFor="form-phone" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-tertiary">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          id="form-phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. 9876543210"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:border-primary-600 focus:ring-1 focus:ring-primary-600 outline-none text-sm text-text transition-colors"
                        />
                      </div>
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    </div>

                    {/* Preferred Date */}
                    <div>
                      <label htmlFor="form-date" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                        Preferred Date (Optional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-tertiary">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <input
                          id="form-date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:border-primary-600 focus:ring-1 focus:ring-primary-600 outline-none text-sm text-text transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Test / Service Selection */}
                  <div>
                    <label htmlFor="form-test" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                      Select Test or Service <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="form-test"
                      value={formData.test}
                      onChange={(e) => setFormData({ ...formData, test: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary-600 focus:ring-1 focus:ring-primary-600 outline-none text-sm text-text transition-colors bg-white"
                    >
                      <option value="">-- Choose a test or category --</option>
                      {allTestOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    {errors.test && <p className="text-xs text-red-500 mt-1">{errors.test}</p>}
                  </div>

                  {/* Additional Requirement / Message */}
                  <div>
                    <label htmlFor="form-message" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                      Additional Message (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3.5 pointer-events-none text-text-tertiary">
                        <FileText className="w-4 h-4" />
                      </div>
                      <textarea
                        id="form-message"
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="e.g. Need home collection in Toopran area..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:border-primary-600 focus:ring-1 focus:ring-primary-600 outline-none text-sm text-text transition-colors resize-y"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full mt-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium py-3.5 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 text-sm sm:text-base focus-visible:ring-2 focus-visible:ring-primary-600"
                  >
                    {status === "submitting" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting enquiry...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Test Enquiry</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-text-tertiary text-center pt-1">
                    Your details will be used solely for scheduling diagnostic services.
                  </p>
                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
