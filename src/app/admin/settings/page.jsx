'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePropertyStore } from '@/stores';
import { uploadImage } from '@/lib/uploadImage';
import {
  Settings,
  Building2,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  Sliders,
  Database,
  Lock,
  Layers,
  ChevronRight,
  ExternalLink,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Image as ImageIcon,
  Upload,
  Pencil,
  Trash2,
  Plus,
  X
} from 'lucide-react';
import Link from 'next/link';

const EMPTY_SLIDE = { image: '', title: '', subtitle: '', link: '', alt: '' };

export default function AdminSettings() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('general');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Homepage Slider state
  const [slides, setSlides] = useState([]);
  const [slidesLoading, setSlidesLoading] = useState(false);
  const [slideForm, setSlideForm] = useState(EMPTY_SLIDE);
  const [editingSlideId, setEditingSlideId] = useState(null);
  const [slideImageUploading, setSlideImageUploading] = useState(false);
  const [slideError, setSlideError] = useState('');
  const [slideSaving, setSlideSaving] = useState(false);

  // Hero image state (single image next to the homepage headline)
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const [heroForm, setHeroForm] = useState({
    image: '', alt: '', statLabel: '', statValue: '',
    topCitiesText: '', popularLocalitiesText: '',
    aboutImage: '', aboutTitle: '', aboutSubtitle: ''
  });
  const [heroImageUploading, setHeroImageUploading] = useState(false);
  const [heroError, setHeroError] = useState('');
  const [heroSaving, setHeroSaving] = useState(false);
  const [heroSaved, setHeroSaved] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    companyName: 'Nandi Dreamland',
    tagline: '',
    phone: '',
    whatsapp: '',
    email: '',
    reraNumber: '',
    address: '',
    autoAssignLeads: true,
    skipInactiveAgents: true,
    duplicateThresholdDays: '30',
    slaFollowUpHours: '24',
    enablePublicRegistration: false
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role !== 'admin') {
        router.push('/');
        return;
      }

      const storedSettings = localStorage.getItem('dreamland_admin_settings');
      if (storedSettings) {
        try {
          setSettings(prev => ({ ...prev, ...JSON.parse(storedSettings) }));
        } catch (e) {
          console.error('Error loading stored settings:', e);
        }
      }
    }
  }, [router]);

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('dreamland_admin_settings', JSON.stringify(settings));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Homepage Slider handlers
  const fetchSlides = async () => {
    setSlidesLoading(true);
    try {
      const response = await fetch('/api/banners');
      const data = await response.json();
      if (data.success) {
        setSlides(data.data);
      }
    } catch (error) {
      console.error('Error loading slides:', error);
    } finally {
      setSlidesLoading(false);
    }
  };

  const fetchHeroImage = async () => {
    try {
      const response = await fetch('/api/hero-image');
      const data = await response.json();
      if (data.success) {
        setHeroForm({
          image: data.data.image || '',
          alt: data.data.alt || '',
          statLabel: data.data.statLabel || '',
          statValue: data.data.statValue || '',
          topCitiesText: (data.data.topCities || []).join(', '),
          popularLocalitiesText: (data.data.popularLocalities || []).join(', '),
          aboutImage: data.data.aboutImage || '',
          aboutTitle: data.data.aboutTitle || '',
          aboutSubtitle: data.data.aboutSubtitle || '',
        });
      }
    } catch (error) {
      console.error('Error loading hero image:', error);
    } finally {
      setHeroImageLoaded(true);
    }
  };

  useEffect(() => {
    if (activeTab === 'slider' && slides.length === 0 && !slidesLoading) {
      fetchSlides();
    }
    if (activeTab === 'slider' && !heroImageLoaded) {
      fetchHeroImage();
    }
  }, [activeTab]);

  const handleHeroImageUpload = async (e, field = 'image') => {
    const file = e.target.files[0];
    if (!file) return;

    setHeroImageUploading(true);
    setHeroError('');

    try {
      const { url } = await uploadImage(file);
      setHeroForm((prev) => ({ ...prev, [field]: url }));
    } catch (error) {
      setHeroError(error.message);
    } finally {
      setHeroImageUploading(false);
      e.target.value = '';
    }
  };

  const handleHeroSubmit = async (e) => {
    e.preventDefault();
    if (!heroForm.image) {
      setHeroError('An image is required');
      return;
    }

    setHeroSaving(true);
    setHeroError('');

    try {
      const token = localStorage.getItem('token');
      const payload = {
        image: heroForm.image,
        alt: heroForm.alt,
        statLabel: heroForm.statLabel,
        statValue: heroForm.statValue,
        topCities: heroForm.topCitiesText.split(',').map((c) => c.trim()).filter((c) => c),
        popularLocalities: heroForm.popularLocalitiesText.split(',').map((l) => l.trim()).filter((l) => l),
        aboutImage: heroForm.aboutImage,
        aboutTitle: heroForm.aboutTitle,
        aboutSubtitle: heroForm.aboutSubtitle,
      };
      const response = await fetch('/api/hero-image', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (data.success) {
        usePropertyStore.getState().invalidateHeroImage();
        setHeroSaved(true);
        setTimeout(() => setHeroSaved(false), 3000);
      } else {
        setHeroError(data.message || 'Failed to save hero image');
      }
    } catch (error) {
      setHeroError('Failed to save hero image');
      console.error('Error saving hero image:', error);
    } finally {
      setHeroSaving(false);
    }
  };

  const handleSlideImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSlideImageUploading(true);
    setSlideError('');

    try {
      const { url } = await uploadImage(file);
      setSlideForm((prev) => ({ ...prev, image: url }));
    } catch (error) {
      setSlideError(error.message);
    } finally {
      setSlideImageUploading(false);
      e.target.value = '';
    }
  };

  const handleSlideEdit = (slide) => {
    setEditingSlideId(slide._id);
    setSlideForm({
      image: slide.image || '',
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      link: slide.link || '',
      alt: slide.alt || '',
    });
    setSlideError('');
  };

  const handleSlideCancel = () => {
    setEditingSlideId(null);
    setSlideForm(EMPTY_SLIDE);
    setSlideError('');
  };

  const handleSlideSubmit = async (e) => {
    e.preventDefault();
    if (!slideForm.image) {
      setSlideError('An image is required for the slide');
      return;
    }

    setSlideSaving(true);
    setSlideError('');

    try {
      const token = localStorage.getItem('token');
      const url = editingSlideId ? `/api/banners/${editingSlideId}` : '/api/banners';
      const method = editingSlideId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(slideForm),
      });
      const data = await response.json();

      if (data.success) {
        await fetchSlides();
        handleSlideCancel();
        usePropertyStore.getState().invalidateBanners();
      } else {
        setSlideError(data.message || 'Failed to save slide');
      }
    } catch (error) {
      setSlideError('Failed to save slide');
      console.error('Error saving slide:', error);
    } finally {
      setSlideSaving(false);
    }
  };

  const handleSlideDelete = async (id) => {
    if (!confirm('Delete this slide? This cannot be undone.')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/banners/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.success) {
        setSlides((prev) => prev.filter((s) => s._id !== id));
        usePropertyStore.getState().invalidateBanners();
      } else {
        alert(data.message || 'Failed to delete slide');
      }
    } catch (error) {
      alert('Failed to delete slide');
      console.error('Error deleting slide:', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif">
              System Settings &amp; Governance
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1F6B4C]/10 text-[#1F6B4C] border border-[#1F6B4C]/20">
              Admin Console
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Configure enterprise brand profile, lead routing automation, SLA policies, and database tools.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-[#1F6B4C] hover:bg-[#18593F] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs self-start md:self-auto cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </div>

      {/* Save Notification */}
      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center space-x-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">System preferences and agency configuration saved successfully.</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex space-x-1.5 border-b border-slate-200/80 pb-px overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'general'
              ? 'border-[#1F6B4C] text-[#1F6B4C] bg-white shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Agency Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('automation')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'automation'
              ? 'border-[#1F6B4C] text-[#1F6B4C] bg-white shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Lead Routing &amp; SLAs</span>
        </button>

        <button
          onClick={() => setActiveTab('slider')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'slider'
              ? 'border-[#1F6B4C] text-[#1F6B4C] bg-white shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Banners &amp; Hero Images</span>
        </button>

        <button
          onClick={() => setActiveTab('tools')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'tools'
              ? 'border-[#1F6B4C] text-[#1F6B4C] bg-white shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Maintenance &amp; Data Tools</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'security'
              ? 'border-[#1F6B4C] text-[#1F6B4C] bg-white shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Security &amp; Environment</span>
        </button>
      </div>

      {/* Tab 1: General Agency Profile */}
      {activeTab === 'general' && (
        <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">Corporate Identity &amp; Contact Info</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              These details appear on public listing pages, client emails, and RERA disclosures.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Company Legal Name
              </label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 outline-none focus:border-[#1F6B4C] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                RERA Registration Number
              </label>
              <input
                type="text"
                value={settings.reraNumber}
                onChange={(e) => handleChange('reraNumber', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 outline-none focus:border-[#1F6B4C] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Official Hotline Phone
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 outline-none focus:border-[#1F6B4C] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                WhatsApp Business Support
              </label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 outline-none focus:border-[#1F6B4C] focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Official Customer Support Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 outline-none focus:border-[#1F6B4C] focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Corporate Headquarters Address
              </label>
              <textarea
                rows={2}
                value={settings.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 outline-none focus:border-[#1F6B4C] focus:bg-white resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Save Agency Profile
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Lead Routing & Automation Rules */}
      {activeTab === 'automation' && (
        <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">Lead Intake &amp; Assignment Rules</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Control the automatic round-robin assignment engine and advisor SLA thresholds.
            </p>
          </div>

          <div className="space-y-4">
            {/* Toggle 1: Auto Assign */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900">Auto-Assign New Leads</div>
                <p className="text-[11px] text-slate-500">
                  Automatically allocate incoming inquiries to active sales advisors via fair round-robin rotation.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoAssignLeads}
                onChange={(e) => handleChange('autoAssignLeads', e.target.checked)}
                className="w-5 h-5 text-[#1F6B4C] rounded focus:ring-[#1F6B4C] accent-[#1F6B4C] cursor-pointer"
              />
            </div>

            {/* Toggle 2: Skip Inactive */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900">Bypass Inactive Advisors</div>
                <p className="text-[11px] text-slate-500">
                  Do not route new prospects to advisors who have toggled their status to paused/inactive.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.skipInactiveAgents}
                onChange={(e) => handleChange('skipInactiveAgents', e.target.checked)}
                className="w-5 h-5 text-[#1F6B4C] rounded focus:ring-[#1F6B4C] accent-[#1F6B4C] cursor-pointer"
              />
            </div>

            {/* SLA Threshold */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900">Initial Call SLA Window</div>
                <p className="text-[11px] text-slate-500">
                  Mark leads as overdue if advisor fails to log an initial call within this window.
                </p>
              </div>
              <select
                value={settings.slaFollowUpHours}
                onChange={(e) => handleChange('slaFollowUpHours', e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-[#1F6B4C]"
              >
                <option value="4">4 Hours (Aggressive)</option>
                <option value="12">12 Hours (Standard)</option>
                <option value="24">24 Hours (Default)</option>
                <option value="48">48 Hours (Relaxed)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Save Automation Rules
            </button>
          </div>
        </form>
      )}

      {/* Tab: Homepage Slider */}
      {activeTab === 'slider' && (
        <div className="space-y-6">
          <form onSubmit={handleSlideSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {editingSlideId ? 'Edit Slide' : 'Add New Slide'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Image, headline and sub-text shown in the homepage hero slider. Add as many slides as you like.
                </p>
              </div>
              {editingSlideId && (
                <button
                  type="button"
                  onClick={handleSlideCancel}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              )}
            </div>

            {slideError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{slideError}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Slide Image *
              </label>
              <div className="flex items-center gap-3">
                <label className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  {slideImageUploading ? 'Uploading...' : 'Upload Image'}
                  <input type="file" onChange={handleSlideImageUpload} accept="image/*" className="hidden" disabled={slideImageUploading} />
                </label>
                <input
                  type="text"
                  value={slideForm.image}
                  onChange={(e) => setSlideForm((prev) => ({ ...prev, image: e.target.value }))}
                  placeholder="or paste a direct image URL"
                  className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 text-xs outline-none focus:border-[#1F6B4C] focus:bg-white"
                />
              </div>
              {slideForm.image && (
                <div className="mt-3 relative rounded-2xl overflow-hidden border border-slate-200 h-40 bg-slate-950">
                  <img src={slideForm.image} alt="Slide preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Title</label>
                <input
                  type="text"
                  value={slideForm.title}
                  onChange={(e) => setSlideForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Luxury Apartments Available"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 outline-none focus:border-[#1F6B4C] focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Subtitle</label>
                <input
                  type="text"
                  value={slideForm.subtitle}
                  onChange={(e) => setSlideForm((prev) => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Starting from ₹85L - Limited Time Offer"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 outline-none focus:border-[#1F6B4C] focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Link (optional)</label>
                <input
                  type="text"
                  value={slideForm.link}
                  onChange={(e) => setSlideForm((prev) => ({ ...prev, link: e.target.value }))}
                  placeholder="/search?q=luxury+apartments"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 outline-none focus:border-[#1F6B4C] focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Alt Text (optional)</label>
                <input
                  type="text"
                  value={slideForm.alt}
                  onChange={(e) => setSlideForm((prev) => ({ ...prev, alt: e.target.value }))}
                  placeholder="Luxury apartment complex"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 outline-none focus:border-[#1F6B4C] focus:bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={slideSaving || slideImageUploading}
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-[#1F6B4C] hover:bg-[#18593F] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>{slideSaving ? 'Saving...' : editingSlideId ? 'Update Slide' : 'Add Slide'}</span>
              </button>
            </div>
          </form>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              Current Slides {slides.length > 0 && `(${slides.length})`}
            </h2>

            {slidesLoading ? (
              <p className="text-xs text-slate-500">Loading slides...</p>
            ) : slides.length === 0 ? (
              <p className="text-xs text-slate-500">No slides yet. Add one above to populate the homepage hero slider.</p>
            ) : (
              <div className="space-y-3">
                {slides.map((slide) => (
                  <div key={slide._id} className="flex items-center gap-4 p-3 rounded-2xl border border-slate-100 bg-slate-50">
                    <img src={slide.image} alt={slide.alt || slide.title || 'Slide'} className="w-20 h-14 rounded-xl object-cover shrink-0 bg-slate-200" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{slide.title || 'Untitled slide'}</p>
                      <p className="text-[11px] text-slate-500 truncate">{slide.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleSlideEdit(slide)}
                        className="p-2 rounded-lg text-slate-600 hover:text-[#1F6B4C] hover:bg-white transition-colors"
                        aria-label="Edit slide"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSlideDelete(slide._id)}
                        className="p-2 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-white transition-colors"
                        aria-label="Delete slide"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleHeroSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900">Hero Image</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                The single photo shown beside the headline &quot;A home search built on what&apos;s actually true about the property.&quot;
              </p>
            </div>

            {heroError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{heroError}</span>
              </div>
            )}

            {heroSaved && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Hero image saved successfully.</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Image *
              </label>
              <div className="flex items-center gap-3">
                <label className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  {heroImageUploading ? 'Uploading...' : 'Upload Image'}
                  <input type="file" onChange={handleHeroImageUpload} accept="image/*" className="hidden" disabled={heroImageUploading} />
                </label>
                <input
                  type="text"
                  value={heroForm.image}
                  onChange={(e) => setHeroForm((prev) => ({ ...prev, image: e.target.value }))}
                  placeholder="or paste a direct image URL"
                  className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 text-xs outline-none focus:border-[#1F6B4C] focus:bg-white"
                />
              </div>
              {heroForm.image && (
                <div className="mt-3 relative rounded-2xl overflow-hidden border border-slate-200 h-48 w-40 bg-slate-950">
                  <img src={heroForm.image} alt="Hero preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Alt Text</label>
              <input
                type="text"
                value={heroForm.alt}
                onChange={(e) => setHeroForm((prev) => ({ ...prev, alt: e.target.value }))}
                placeholder="Bangalore skyline, one of the cities Nandi Dreamland lists properties in"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 text-xs outline-none focus:border-[#1F6B4C] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Stat Card Label</label>
                <input
                  type="text"
                  value={heroForm.statLabel}
                  onChange={(e) => setHeroForm((prev) => ({ ...prev, statLabel: e.target.value }))}
                  placeholder="Across six cities, right now"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 text-xs outline-none focus:border-[#1F6B4C] focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Stat Card Value</label>
                <input
                  type="text"
                  value={heroForm.statValue}
                  onChange={(e) => setHeroForm((prev) => ({ ...prev, statValue: e.target.value }))}
                  placeholder="New listings added weekly"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 text-xs outline-none focus:border-[#1F6B4C] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Top Cities (Comma Separated)
              </label>
              <input
                type="text"
                value={heroForm.topCitiesText}
                onChange={(e) => setHeroForm((prev) => ({ ...prev, topCitiesText: e.target.value }))}
                placeholder="Bangalore, Mumbai, Pune, Hyderabad, Chennai, Delhi NCR"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 text-xs outline-none focus:border-[#1F6B4C] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Popular Localities (Comma Separated)
              </label>
              <input
                type="text"
                value={heroForm.popularLocalitiesText}
                onChange={(e) => setHeroForm((prev) => ({ ...prev, popularLocalitiesText: e.target.value }))}
                placeholder="Whitefield, Bengaluru, Baner, Pune, Andheri, Mumbai"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 text-xs outline-none focus:border-[#1F6B4C] focus:bg-white"
              />
            </div>

            <div className="border-t border-slate-100 pt-5">
              <h3 className="text-sm font-bold text-slate-900">About Page Hero</h3>
              <p className="text-xs text-slate-500 mt-0.5 mb-4">
                Background image and headline shown at the top of the /about page.
              </p>

              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Background Image
              </label>
              <div className="flex items-center gap-3">
                <label className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  {heroImageUploading ? 'Uploading...' : 'Upload Image'}
                  <input type="file" onChange={(e) => handleHeroImageUpload(e, 'aboutImage')} accept="image/*" className="hidden" disabled={heroImageUploading} />
                </label>
                <input
                  type="text"
                  value={heroForm.aboutImage}
                  onChange={(e) => setHeroForm((prev) => ({ ...prev, aboutImage: e.target.value }))}
                  placeholder="or paste a direct image URL"
                  className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 text-xs outline-none focus:border-[#1F6B4C] focus:bg-white"
                />
              </div>
              {heroForm.aboutImage && (
                <div className="mt-3 relative rounded-2xl overflow-hidden border border-slate-200 h-32 w-full bg-slate-950">
                  <img src={heroForm.aboutImage} alt="About hero preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="mt-4">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Headline</label>
                <input
                  type="text"
                  value={heroForm.aboutTitle}
                  onChange={(e) => setHeroForm((prev) => ({ ...prev, aboutTitle: e.target.value }))}
                  placeholder="About *Nandi Dreamland*"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 text-xs outline-none focus:border-[#1F6B4C] focus:bg-white"
                />
                <p className="text-[11px] text-slate-400 mt-1">Wrap words in *asterisks* to show them in the yellow accent colour.</p>
              </div>

              <div className="mt-4">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Sub-headline</label>
                <textarea
                  rows={2}
                  value={heroForm.aboutSubtitle}
                  onChange={(e) => setHeroForm((prev) => ({ ...prev, aboutSubtitle: e.target.value }))}
                  placeholder="Your trusted partner in real estate excellence, connecting dreams with reality since our inception."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 text-xs outline-none focus:border-[#1F6B4C] focus:bg-white resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={heroSaving || heroImageUploading}
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-[#1F6B4C] hover:bg-[#18593F] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{heroSaving ? 'Saving...' : 'Save Hero Images'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Maintenance & Data Tools */}
      {activeTab === 'tools' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Duplicate Checker Link */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 pt-2">Duplicate Lead Detection</h3>
                <p className="text-xs text-slate-500">
                  Run database integrity scans to detect identical prospect telephone numbers across multiple agents.
                </p>
              </div>
              <Link
                href="/admin/duplicate-checker"
                className="inline-flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <span>Run Duplicate Scan</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Agent Lead Cleanup Tool */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 pt-2">Agent Queue Sanitizer</h3>
                <p className="text-xs text-slate-500">
                  Bulk unassign or clear stale leads from inactive advisor pipelines back to the unassigned queue.
                </p>
              </div>
              <Link
                href="/admin/cleanup-agent-leads"
                className="inline-flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <span>Access Lead Sanitizer</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Security & Environment */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">Security &amp; Environment Diagnostics</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live server connection parameters, environment state, and RBAC authentication level.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500 font-medium">Active Session Privilege</span>
              <span className="font-bold text-slate-900 flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Super Administrator</span>
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500 font-medium">Database Layer</span>
              <span className="font-bold text-emerald-600">Connected (MongoDB Atlas)</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500 font-medium">Runtime Architecture</span>
              <span className="font-bold text-slate-900">Next.js App Router (Turbopack)</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500 font-medium">Deployment Platform</span>
              <span className="font-bold text-slate-900">Vercel Enterprise Edge</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
