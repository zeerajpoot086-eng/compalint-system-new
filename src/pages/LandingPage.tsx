import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';
import { AIAnalysis } from '../types';
import {
  Wrench,
  Sparkles,
  Zap,
  Droplets,
  Wind,
  Wifi,
  Laptop,
  Hammer,
  ShieldCheck,
  Clock,
  CheckCircle2,
  ArrowRight,
  Send,
  Star,
  Users,
  Award,
  Layers,
  PhoneCall,
  Loader2,
  Play
} from 'lucide-react';

interface LandingPageProps {
  setCurrentView: (view: string) => void;
  onOpenReportModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setCurrentView, onOpenReportModal }) => {
  const { user, quickDemoLogin } = useAuth();
  const { showToast } = useNotification();

  // Interactive Live AI Playground State on Hero
  const [demoPrompt, setDemoPrompt] = useState('My split AC stopped cooling suddenly, blowing warm air with water leaking from the indoor unit');
  const [isDemoAnalyzing, setIsDemoAnalyzing] = useState(false);
  const [demoAnalysis, setDemoAnalysis] = useState<AIAnalysis | null>(null);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSendingContact, setIsSendingContact] = useState(false);

  const handleRunDemoAnalysis = async () => {
    if (!demoPrompt.trim()) return;
    setIsDemoAnalyzing(true);
    try {
      const res = await api.ai.analyze(demoPrompt);
      if (res.success && res.analysis) {
        setDemoAnalysis(res.analysis);
        showToast('AI analysis generated successfully!', 'success');
      }
    } catch (e: any) {
      showToast('Analysis error: ' + e.message, 'error');
    } finally {
      setIsDemoAnalyzing(false);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingContact(true);
    setTimeout(() => {
      setIsSendingContact(false);
      showToast('Thank you for contacting FixMate! Our support desk will reply within 30 minutes.', 'success');
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/60 via-white to-white py-16 sm:py-24 dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-900 transition-colors">
        
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-4 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
            <Sparkles className="h-4 w-4 text-indigo-500 animate-pulse" />
            <span>Introducing AI Neural Complaint Diagnosis</span>
          </div>

          {/* Main Hero Headline */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl dark:text-white leading-tight">
              Fast, Reliable & <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 bg-clip-text text-transparent">
                Smart Service Management
              </span>
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed sm:text-lg">
              Report maintenance issues, electrical faults, plumbing leaks, and IT breakdowns in seconds. Our automated dispatch pairs you with certified technicians backed by real-time tracking.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                if (user) {
                  onOpenReportModal();
                } else {
                  setCurrentView('login');
                }
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Zap className="h-4 w-4" />
              Report a Problem Now
            </button>

            <button
              onClick={() => {
                if (user) {
                  if (user.role === 'admin') setCurrentView('admin-dashboard');
                  else if (user.role === 'technician') setCurrentView('technician-dashboard');
                  else setCurrentView('user-dashboard');
                } else {
                  quickDemoLogin('user');
                  setCurrentView('user-dashboard');
                }
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Layers className="h-4 w-4 text-indigo-500" />
              Explore Live Dashboard
            </button>
          </div>

          {/* Interactive AI Live Demo Box */}
          <div className="mx-auto max-w-2xl text-left rounded-3xl border border-indigo-100 bg-white/80 p-6 shadow-xl backdrop-blur-md dark:border-indigo-950 dark:bg-slate-900/90 mt-12 transition-all">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                <span>Test Live FixMate AI Problem Diagnosis</span>
              </div>
              <span className="text-[11px] text-slate-400">Interactive Preview</span>
            </div>

            <div className="mt-3.5 space-y-3">
              <div className="relative">
                <textarea
                  value={demoPrompt}
                  onChange={e => setDemoPrompt(e.target.value)}
                  rows={2}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  placeholder="Type any household or office breakdown..."
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-[11px] text-slate-400 hidden sm:block">
                  Click below to see how our AI categorizes priority & emergency steps.
                </div>
                <button
                  onClick={handleRunDemoAnalysis}
                  disabled={isDemoAnalyzing || !demoPrompt.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isDemoAnalyzing ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Analyzing with Gemini AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      Analyze Fault with AI
                    </>
                  )}
                </button>
              </div>

              {demoAnalysis && (
                <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4 dark:border-indigo-900 dark:bg-indigo-950/40 text-xs space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-900 dark:text-indigo-200">
                      Category: <span className="text-indigo-600 dark:text-indigo-400">{demoAnalysis.suggestedCategory}</span>
                    </span>
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                      Priority: {demoAnalysis.suggestedPriority}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">
                    {demoAnalysis.problemSummary}
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 bg-white/70 p-2 rounded-lg dark:bg-slate-900/60">
                    <strong className="text-amber-600 dark:text-amber-400">Safety Tip: </strong>
                    {demoAnalysis.suggestedNextStep}
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 2. SERVICES SECTION */}
      <section className="py-16 sm:py-20 bg-slate-50/50 dark:bg-slate-950/40 border-y border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Specialized Service Network
            </h2>
            <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
              Everything Fixed, Promptly & Professionally
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Certified experts equipped for residential, commercial, and enterprise technical requirements.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Service 1: Electrician */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Electrician & Wiring</h4>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Short circuits, MCB trip diagnostics, switchboard replacements, smart lighting installations, and full electrical rewiring.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Avg. Arrival: 20 mins</span>
                <span>•</span>
                <span>Licensed Electricians</span>
              </div>
            </div>

            {/* Service 2: Plumber */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400 mb-4">
                <Droplets className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Plumbing & Pipelines</h4>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Emergency burst pipe repair, drain unclogging, bathroom sanitary fittings, booster pump overhaul, and water tank valve fixes.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Leak Detection Tech</span>
                <span>•</span>
                <span>Clean Work Guarantee</span>
              </div>
            </div>

            {/* Service 3: AC Repair */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400 mb-4">
                <Wind className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">AC & HVAC Overhaul</h4>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Compressor servicing, refrigerant gas top-up (R32/R410A), deep coil jet cleaning, thermostat diagnostics, and duct servicing.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                <span>30-Day Cooling Warranty</span>
                <span>•</span>
                <span>Multi-Brand Certified</span>
              </div>
            </div>

            {/* Service 4: Internet / WiFi */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 mb-4">
                <Wifi className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Internet, WiFi & Fiber</h4>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Mesh WiFi setup, fiber optic line splicing, high-latency troubleshooting, office LAN cabling, and gateway firewall configuration.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Zero Deadzone SLA</span>
                <span>•</span>
                <span>High-Speed Gigabit Testing</span>
              </div>
            </div>

            {/* Service 5: Computer / Laptop */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 mb-4">
                <Laptop className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Computers & Laptops</h4>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Hardware upgrades, SSD cloning, screen replacements, thermal repasting, OS restoration, and enterprise workstation maintenance.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Genuine OEM Parts</span>
                <span>•</span>
                <span>Data Privacy Guaranteed</span>
              </div>
            </div>

            {/* Service 6: Appliance Repair */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 mb-4">
                <Hammer className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Smart Home & Appliances</h4>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Refrigerators, washing machines, microwaves, water purifiers, and commercial kitchen appliances with transparent parts billing.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Instant Cost Estimation</span>
                <span>•</span>
                <span>100% Genuine Parts</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-900 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Workflow
            </h2>
            <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
              How FixMate Works
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              From instant fault diagnosis to complete on-site resolution in 4 simple steps.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            
            {/* Step 1 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-800/40 relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md shadow-indigo-500/20 mb-4">
                01
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">File Complaint & AI Triage</h4>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Type your issue or upload a photo. Our AI diagnoses severity, category, and immediate safety steps.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-800/40 relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md shadow-indigo-500/20 mb-4">
                02
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Specialist Dispatch</h4>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                The smart router assigns the nearest certified specialist with instant ticket reference and mobile contact details.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-800/40 relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md shadow-indigo-500/20 mb-4">
                03
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">On-Site Work & Live Logs</h4>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Technician logs progress, parts replaced, and inspection notes transparently to your dashboard timeline.
              </p>
            </div>

            {/* Step 4 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-800/40 relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md shadow-indigo-500/20 mb-4">
                04
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Sign-off & Service Sheet</h4>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Verify resolution, rate your experience, and download or print an official FixMate Service Sheet.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. ABOUT & STATS SECTION */}
      <section className="py-16 bg-slate-50/80 dark:bg-slate-950/60 border-y border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                <ShieldCheck className="h-4 w-4" />
                <span>Enterprise Grade Reliability</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                Designed for swift complaints, trusted technicians, and total peace of mind.
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                FixMate removes the frustration of endless phone calls and untracked service requests. By uniting customers, dispatchers, and field technicians on a single intelligent platform, we guarantee maximum accountability and rapid turnaround.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 text-xs font-semibold text-slate-700 dark:text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Real-time Ticket Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Role-Based Secure Portals</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Transparent Parts Audit</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Printable Service Records</span>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">99.4%</div>
                <div className="mt-1 text-xs font-bold text-slate-700 dark:text-slate-200">Satisfaction Rate</div>
                <p className="mt-1 text-[11px] text-slate-400">Based on 2,500+ verified repairs</p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">&lt;15m</div>
                <div className="mt-1 text-xs font-bold text-slate-700 dark:text-slate-200">Avg. Dispatch Speed</div>
                <p className="mt-1 text-[11px] text-slate-400">Emergency automated routing</p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">120+</div>
                <div className="mt-1 text-xs font-bold text-slate-700 dark:text-slate-200">Certified Technicians</div>
                <p className="mt-1 text-[11px] text-slate-400">Background checked & vetted</p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">24/7</div>
                <div className="mt-1 text-xs font-bold text-slate-700 dark:text-slate-200">Helpline & Dispatch</div>
                <p className="mt-1 text-[11px] text-slate-400">Always active emergency response</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. CONTACT & SUPPORT SECTION */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-900 transition-colors">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          <div className="rounded-3xl border border-slate-200 bg-slate-50/50 p-8 sm:p-12 shadow-sm dark:border-slate-800 dark:bg-slate-800/40">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Contact & Emergency Support
              </h2>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Need Assistance or Custom Building Contract?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Send a message to our customer operations desk or call our toll-free hotline.
              </p>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4 max-w-xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Your Name</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                    placeholder="e.g. David Miller"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Your Email</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    placeholder="david@example.com"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Message / Inquiry</label>
                <textarea
                  rows={3}
                  required
                  value={contactMessage}
                  onChange={e => setContactMessage(e.target.value)}
                  placeholder="How can our service team assist you today?"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSendingContact}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition-colors"
              >
                {isSendingContact ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message to Support Desk
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </section>

    </div>
  );
};
