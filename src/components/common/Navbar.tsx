import React, { useState, useRef, useEffect } from 'react';
import {
  Compass,
  Moon,
  Sun,
  User,
  LogOut,
  Settings,
  FolderHeart,
  PlusCircle,
  Menu,
  X,
  Sparkles,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenAuth }) => {
  const { currentUser, userProfile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick(currentUser ? 'dashboard' : 'landing')}
          className="flex items-center gap-2.5 group text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Compass className="w-5 h-5 text-emerald-400 group-hover:rotate-45 transition-transform duration-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-slate-950 via-slate-800 to-emerald-700 dark:from-white dark:via-slate-100 dark:to-emerald-300 bg-clip-text text-transparent">
                TripPilot
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-0.5">
              Travel Intelligence
            </p>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 font-medium text-sm text-slate-600 dark:text-slate-300">
          {currentUser ? (
            <>
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  currentView === 'dashboard'
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 font-semibold'
                    : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNavClick('trips')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  currentView === 'trips'
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 font-semibold'
                    : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                My Trips
              </button>
              <button
                onClick={() => handleNavClick('destinations')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  currentView === 'destinations'
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 font-semibold'
                    : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                Destinations
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavClick('landing')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  currentView === 'landing'
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 font-semibold'
                    : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => handleNavClick('destinations')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  currentView === 'destinations'
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 font-semibold'
                    : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                Destinations
              </button>
              <button
                onClick={() => handleNavClick('features')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  currentView === 'features'
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 font-semibold'
                    : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                Features
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  currentView === 'about'
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 font-semibold'
                    : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                How It Works
              </button>
            </>
          )}
        </nav>

        {/* Right CTA & Controls */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Quick Plan Button */}
          <button
            onClick={() => handleNavClick('plan')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs shadow-md shadow-emerald-500/20 transition-all hover:shadow-lg hover:shadow-emerald-500/30"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Plan Trip</span>
          </button>

          {/* User Account or Auth Button */}
          {currentUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1 pl-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition"
              >
                {userProfile?.photoURL ? (
                  <img
                    src={userProfile.photoURL}
                    alt={userProfile.displayName}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-emerald-500/30"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                    {(userProfile?.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-semibold max-w-[100px] truncate hidden lg:inline-block">
                  {userProfile?.displayName || currentUser.email?.split('@')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 text-slate-800 dark:text-slate-200 animate-slide-up">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold truncate">{userProfile?.displayName || 'Traveler'}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={() => handleNavClick('dashboard')}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/80 text-left transition"
                  >
                    <Compass className="w-4 h-4 text-emerald-500" />
                    <span>Dashboard</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('trips')}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/80 text-left transition"
                  >
                    <FolderHeart className="w-4 h-4 text-teal-500" />
                    <span>My Saved Trips</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('profile')}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/80 text-left transition"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Profile & Preferences</span>
                  </button>
                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                  <button
                    onClick={async () => {
                      await logout();
                      setDropdownOpen(false);
                      onNavigate('landing');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="hidden sm:inline-flex px-3.5 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold text-xs transition"
              >
                Get Started
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-4 py-4 space-y-2">
          {currentUser ? (
            <>
              <button
                onClick={() => handleNavClick('dashboard')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800/80"
              >
                <Compass className="w-4 h-4 text-emerald-500" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => handleNavClick('plan')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800/80 text-emerald-600 dark:text-emerald-400"
              >
                <Sparkles className="w-4 h-4" />
                <span>Plan a New Trip</span>
              </button>
              <button
                onClick={() => handleNavClick('trips')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800/80"
              >
                <FolderHeart className="w-4 h-4 text-teal-500" />
                <span>My Trips & History</span>
              </button>
              <button
                onClick={() => handleNavClick('destinations')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800/80"
              >
                <MapPin className="w-4 h-4 text-cyan-500" />
                <span>Destination Directory</span>
              </button>
              <button
                onClick={() => handleNavClick('profile')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800/80"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Profile & Settings</span>
              </button>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={async () => {
                    await logout();
                    setMobileMenuOpen(false);
                    onNavigate('landing');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavClick('landing')}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800/80"
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('destinations')}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800/80"
              >
                Destinations
              </button>
              <button
                onClick={() => handleNavClick('features')}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800/80"
              >
                Features
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800/80"
              >
                How It Works
              </button>
              <div className="pt-3 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('signup');
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-semibold shadow-md"
                >
                  Get Started Free
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};
