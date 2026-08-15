import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import PopularTests from "@/components/PopularTests";
import WhyChooseUs from "@/components/WhyChooseUs";
import About from "@/components/About";
import AppointmentForm from "@/components/AppointmentForm";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-text selection:bg-primary-100 selection:text-primary-900">
      {/* Sticky Header Navigation */}
      <Navbar />

      <main className="flex-grow">
        {/* 1. Hero Banner */}
        <Hero />

        {/* 2. Diagnostic Services */}
        <Services />

        {/* 3. Common Diagnostic Tests */}
        <PopularTests />

        {/* 4. Why Choose Asha Jyothi */}
        <WhyChooseUs />

        {/* 5. About Centre */}
        <About />

        {/* 6. Appointment & Test Enquiry Form */}
        <AppointmentForm />

        {/* 7. Contact Details & Location */}
        <Contact />
      </main>

      {/* Footer & Disclaimers */}
      <Footer />

      {/* Floating 24/7 Diagnostic Assistant */}
      <ChatbotWidget />
    </div>
  );
}
