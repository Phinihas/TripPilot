import React, { useState } from 'react';
import {
  User,
  Mail,
  Shield,
  Save,
  DollarSign,
  Compass,
  CheckCircle,
  Loader2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TRAVEL_STYLES } from '../../data/destinations';
import { TravelStyle } from '../../types/travel';
import { useToast } from '../common/Toast';

export const ProfileSettingsPage: React.FC = () => {
  const { currentUser, userProfile, updateUserPreferences } = useAuth();
  const { showToast } = useToast();

  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [currency, setCurrency] = useState(userProfile?.currency || 'INR');
  const [preferredStyle, setPreferredStyle] = useState<TravelStyle>(
    (userProfile?.preferredStyle as TravelStyle) || 'Balanced'
  );
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [saving, setSaving] = useState(false);

  const currencies = [
    { code: 'INR', label: 'INR - Indian Rupee (₹)' },
    { code: 'USD', label: 'USD - United States Dollar ($)' },
    { code: 'EUR', label: 'EUR - Euro (€)' },
    { code: 'GBP', label: 'GBP - British Pound (£)' },
    { code: 'JPY', label: 'JPY - Japanese Yen (¥)' },
    { code: 'AED', label: 'AED - UAE Dirham (د.إ)' },
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserPreferences({
        displayName: displayName.trim(),
        currency,
        preferredStyle,
        bio: bio.trim(),
      });
      showToast('Profile Updated', 'Your settings and travel preferences have been saved.', 'success');
    } catch (err) {
      console.error('Update profile error:', err);
      showToast('Save failed', 'Could not save profile changes.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 animate-fade-in space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Profile & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Customize your traveler persona, default currency, and AI itinerary preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* User Identity Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-500" />
            <span>Identity & Account Info</span>
          </h3>

          <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            {userProfile?.photoURL ? (
              <img
                src={userProfile.photoURL}
                alt={displayName}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/30"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-2xl flex items-center justify-center">
                {(displayName || currentUser?.email || 'U')[0].toUpperCase()}
              </div>
            )}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">
                {displayName || 'Traveler'}
              </h4>
              <p className="text-xs text-slate-400">{currentUser?.email || 'guest@trippilot.ai'}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                Firebase Authenticated
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Elena Rostova"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={currentUser?.email || ''}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/40 text-sm text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Travel Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Tell us a little about your travel passions (e.g. food lover, landscape photographer)..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Preferences Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-teal-500" />
            <span>AI Planning Defaults</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Display Currency
              </label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {currencies.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Preferred Travel Style
              </label>
              <select
                value={preferredStyle}
                onChange={e => setPreferredStyle(e.target.value as TravelStyle)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {TRAVEL_STYLES.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.label} ({s.desc})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Security & Data Storage Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-500" />
            <span>Security & Data Privacy</span>
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your trip itineraries and personal information are secured via Google Firebase Authentication and isolated Firestore security rules. Only you can access or modify your trips.
          </p>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Profile Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
