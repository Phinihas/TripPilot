import React from 'react';
import { Compass, Heart, ShieldCheck, Sparkles, Globe, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-slate-900 dark:bg-slate-950 text-slate-400 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Compass className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                TripPilot <span className="text-emerald-400">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Next-generation AI travel orchestration. Craft hyper-personalized, day-by-day itineraries, smart budget models, and authentic destination adventures in seconds.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>AI Engine Operational • 120+ Countries Grounded</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('plan')} className="hover:text-emerald-400 transition">
                  AI Trip Planner
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('destinations')} className="hover:text-emerald-400 transition">
                  Destination Search
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('features')} className="hover:text-emerald-400 transition">
                  Budget Estimator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('features')} className="hover:text-emerald-400 transition">
                  Smart Re-balancing
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-emerald-400 transition">
                  About TripPilot
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('features')} className="hover:text-emerald-400 transition">
                  Core Architecture
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-emerald-400 transition">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-emerald-400 transition">
                  Security & Privacy
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Curated Hubs */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-3">Popular Hubs</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('destinations')} className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Tokyo, Japan
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('destinations')} className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Paris, France
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('destinations')} className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Bali, Indonesia
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('destinations')} className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Reykjavik, Iceland
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p>© {new Date().getFullYear()} TripPilot AI Inc. All rights reserved.</p>
            <span className="hidden sm:inline text-slate-600">•</span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-xs">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Developed by <strong className="text-white font-bold tracking-wide">Phinihas Gandi</strong></span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Firestore Encrypted Data
            </span>
            <span className="text-slate-400">Zero Slop Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
