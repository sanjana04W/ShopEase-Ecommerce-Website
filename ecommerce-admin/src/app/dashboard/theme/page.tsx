'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Palette, Sun, Moon, Save, RefreshCw, LayoutTemplate, ArrowLeft } from 'lucide-react';

export default function ThemeSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'light' | 'dark'>('light');
  
  const defaultLightTheme = {
    mode: 'light',
    background: '#fafaff',
    foreground: '#0f0f16',
    primary: '#4f46e5',
    primaryHover: '#4338ca',
    cardBg: 'rgba(255, 255, 255, 0.75)',
    cardBorder: 'rgba(229, 231, 235, 0.5)',
    glassBg: 'rgba(255, 255, 255, 0.7)',
    glassBorder: 'rgba(255, 255, 255, 0.5)',
  };

  const defaultDarkTheme = {
    mode: 'dark',
    background: '#08080c',
    foreground: '#f1f1f7',
    primary: '#4f46e5',
    primaryHover: '#4338ca',
    cardBg: 'rgba(15, 15, 25, 0.8)',
    cardBorder: 'rgba(30, 41, 59, 0.5)',
    glassBg: 'rgba(10, 10, 15, 0.7)',
    glassBorder: 'rgba(255, 255, 255, 0.05)',
  };

  const [lightTheme, setLightTheme] = useState(defaultLightTheme);
  const [darkTheme, setDarkTheme] = useState(defaultDarkTheme);

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      const res = await fetch('/api/theme');
      const data = await res.json();
      if (Array.isArray(data)) {
        const light = data.find(t => t.mode === 'light');
        const dark = data.find(t => t.mode === 'dark');
        if (light) setLightTheme(light);
        if (dark) setDarkTheme(dark);
      }
    } catch (error) {
      toast.error('Failed to fetch themes');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const themeToSave = activeTab === 'light' ? lightTheme : darkTheme;
    try {
      const res = await fetch('/api/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(themeToSave),
      });
      if (!res.ok) throw new Error('Failed to save');
      toast.success(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} theme saved successfully!`);
    } catch (error) {
      toast.error('Failed to save theme configurations.');
    } finally {
      setSaving(false);
    }
  };

  const currentTheme = activeTab === 'light' ? lightTheme : darkTheme;
  const setCurrentTheme = activeTab === 'light' ? setLightTheme : setDarkTheme;

  const handleReset = () => {
    if (activeTab === 'light') {
      setLightTheme(defaultLightTheme);
    } else {
      setDarkTheme(defaultDarkTheme);
    }
    toast.success('Reset to default values');
  };

  // Helper to extract hex from rgba if needed for the color picker
  const getHexFromAny = (color: string) => {
    if (color.startsWith('#')) return color.substring(0, 7);
    return '#000000'; // Default fallback for color picker if it's rgba
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const fields = [
    { key: 'primary', label: 'Primary Brand Color', type: 'color' },
    { key: 'primaryHover', label: 'Primary Hover State', type: 'color' },
    { key: 'background', label: 'Main Background', type: 'color' },
    { key: 'foreground', label: 'Main Text (Foreground)', type: 'color' },
    { key: 'cardBg', label: 'Card Background (Supports RGBA)', type: 'text' },
    { key: 'cardBorder', label: 'Card Border (Supports RGBA)', type: 'text' },
    { key: 'glassBg', label: 'Glassmorphism Background', type: 'text' },
    { key: 'glassBorder', label: 'Glassmorphism Border', type: 'text' },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up px-6 pb-12">
      {/* Navigation */}
      <div className="mb-6 mt-10">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
          <Palette className="w-8 h-8 text-indigo-500" />
          Theme Studio
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
          Customize the aesthetic of your e-commerce storefront. Changes will apply instantly to the live website.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Editor Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glassmorphism rounded-2xl border border-glass-border/30 overflow-hidden">
            
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-slate-800">
              <button
                onClick={() => setActiveTab('light')}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-colors ${activeTab === 'light' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800/50'}`}
              >
                <Sun size={18} /> Light Mode
              </button>
              <button
                onClick={() => setActiveTab('dark')}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-colors ${activeTab === 'dark' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800/50'}`}
              >
                <Moon size={18} /> Dark Mode
              </button>
            </div>

            {/* Form */}
            <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {field.label}
                    </label>
                    <div className="relative flex items-center">
                      {field.type === 'color' && (
                        <div className="absolute left-2 w-8 h-8 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 shadow-sm z-10">
                          <input
                            type="color"
                            value={getHexFromAny(currentTheme[field.key as keyof typeof currentTheme])}
                            onChange={(e) => setCurrentTheme({ ...currentTheme, [field.key]: e.target.value })}
                            className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer"
                          />
                        </div>
                      )}
                      <input
                        type="text"
                        value={currentTheme[field.key as keyof typeof currentTheme]}
                        onChange={(e) => setCurrentTheme({ ...currentTheme, [field.key]: e.target.value })}
                        className={`w-full bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-mono text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all ${field.type === 'color' ? 'pl-12 pr-4 py-3' : 'px-4 py-3'}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="pt-6 mt-6 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={handleReset}
                  className="text-sm font-semibold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  Reset to defaults
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Theme
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-24">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
              <LayoutTemplate size={16} /> Live Preview
            </h3>
            
            {/* The actual preview window */}
            <div 
              className="rounded-2xl border shadow-2xl overflow-hidden transition-all duration-500"
              style={{ 
                backgroundColor: currentTheme.background,
                borderColor: currentTheme.cardBorder 
              }}
            >
              {/* Fake Browser Header */}
              <div className="bg-black/5 dark:bg-white/5 px-4 py-3 flex items-center gap-2 border-b" style={{ borderColor: currentTheme.cardBorder }}>
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <div className="mx-auto text-xs font-mono opacity-50" style={{ color: currentTheme.foreground }}>
                  shopease.com
                </div>
              </div>

              {/* Preview Content */}
              <div className="p-6 space-y-6" style={{ color: currentTheme.foreground }}>
                
                <div className="flex items-center justify-between">
                  <div className="text-lg font-black tracking-tighter" style={{ color: currentTheme.primary }}>ShopEase</div>
                  <div className="flex gap-4 text-xs font-semibold opacity-70">
                    <span>Products</span>
                    <span>Categories</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl font-extrabold tracking-tight">Summer Collection</h2>
                  <p className="text-sm opacity-70 leading-relaxed">Discover the latest premium trends hand-picked for you.</p>
                </div>

                <button 
                  className="px-5 py-2.5 rounded-lg text-white text-sm font-bold shadow-lg transition-transform hover:-translate-y-0.5"
                  style={{ backgroundColor: currentTheme.primary }}
                >
                  Shop Now
                </button>

                <div 
                  className="p-5 rounded-xl border backdrop-blur-md mt-8"
                  style={{ 
                    backgroundColor: currentTheme.cardBg, 
                    borderColor: currentTheme.cardBorder 
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg opacity-20" style={{ backgroundColor: currentTheme.primary }} />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-2/3 rounded" style={{ backgroundColor: currentTheme.foreground, opacity: 0.1 }} />
                      <div className="h-3 w-1/2 rounded" style={{ backgroundColor: currentTheme.foreground, opacity: 0.1 }} />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
