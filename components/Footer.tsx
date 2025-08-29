"use client";

import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { WebTitle } from "./Navbar";

export default function Footer() {
  return (
    <footer className="w-full bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8 text-sm">
        {/* Brand / About */}
        <div>
          <WebTitle className="text-xl"/>
          <p className="mt-3 text-muted-foreground font-mono">
            Secure, smart, and seamless RFID-based access monitoring. Built for
            homes, shops, and businesses.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-base font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <a href="#services" className="hover:text-primary">
                Services
              </a>
            </li>
            <li>
              <a href="#features" className="hover:text-primary">
                Features
              </a>
            </li>
            <li>
              <a href="#pricing" className="hover:text-primary">
                Pricing
              </a>
            </li>
            <li>
              <a href="#testimonials" className="hover:text-primary">
                Testimonials
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-primary">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Social / Contact */}
        <div>
          <h4 className="text-base font-semibold mb-3">Connect With Us</h4>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-primary">
              <Facebook size={20} />
            </a>
            <a href="#" className="hover:text-primary">
              <Twitter size={20} />
            </a>
            <a href="#" className="hover:text-primary">
              <Linkedin size={20} />
            </a>
            <a href="#" className="hover:text-primary">
              <Instagram size={20} />
            </a>
          </div>
          <p className="mt-4 text-muted-foreground">📧 support@alertaxis.com</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} AlertAxis. All rights reserved.
      </div>
    </footer>
  );
}
