import React from 'react';
import { Wrench, ShieldCheck, Zap, Headphones, Heart } from 'lucide-react';

interface FooterProps {
  setCurrentView?: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView }) => {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-colors mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Wrench className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">FixMate</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Next-generation complaint and technical service management powered by automated AI problem triage and rapid dispatch.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>Electrician & High Voltage</li>
              <li>Plumbing & Drainage Network</li>
              <li>HVAC / AC Maintenance</li>
              <li>High-Speed WiFi & Fiber LAN</li>
              <li>Computers, Laptops & Appliances</li>
            </ul>
          </div>

          {/* Quick SLA & Guarantees */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Service Guarantees
            </h4>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                <span>15-Minute Emergency Response</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
                <span>100% Certified Technicians</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="h-3.5 w-3.5 text-emerald-500" />
                <span>24/7 Dispatch Desk</span>
              </div>
            </div>
          </div>

          {/* Security & System */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Platform
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
              Full-stack Node.js + Express + React architecture with JWT protection & Gemini AI intelligence.
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </div>
          </div>

        </div>

        <div className="mt-8 border-t border-slate-100 pt-6 text-center text-xs text-slate-400 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 FixMate Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with modern React, Express & Google Gemini AI
          </p>
        </div>
      </div>
    </footer>
  );
};
