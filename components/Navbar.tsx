"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, PhoneCall, Calendar } from "lucide-react";
import { centreConfig } from "@/lib/config";
import { cn } from "@/lib/cn";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "Tests", href: "#tests" },
    { name: "Why Us", href: "#why-us" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-200",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border-light py-3"
          : "bg-white/80 backdrop-blur-sm py-4 sm:py-5 border-b border-border-light/60"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Wordmark */}
          <a
            href="#home"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-primary-700 transition-colors">
              AJ
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-primary-900 text-lg leading-tight tracking-tight">
                {centreConfig.name}
              </span>
              <span className="text-xs text-text-tertiary font-medium">
                {centreConfig.location.city}, {centreConfig.location.state}
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-text-secondary hover:text-primary-600 transition-colors focus-visible:ring-2 focus-visible:ring-primary-600 rounded px-1.5 py-1"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="#appointment"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4.5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-primary-600"
            >
              <Calendar className="w-4 h-4" />
              Book a Test
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href="#appointment"
              className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
            >
              Book Test
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-text-secondary hover:text-text hover:bg-surface-dim focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-border bg-white rounded-b-2xl shadow-lg px-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-primary-600 hover:bg-surface-dim transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-2 px-1">
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 border border-border-light text-text-secondary hover:bg-surface-dim py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-primary-600" />
                Contact Info
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
