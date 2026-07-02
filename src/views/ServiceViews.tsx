import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wrench, Clock, PlusCircle, Trash, Edit, Plus, Calendar, AlertTriangle, 
  MapPin, Check, X, ShieldAlert, ArrowRight, UserCheck, CheckCircle2, ChevronLeft, ChevronRight,
  Image, Tag, Eye, Upload
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { CustomButton } from '../components/CustomButton';
import { InputField } from '../components/InputField';

interface ServiceViewsProps {
  isCompany: boolean;
  jobs: any[];
  setJobs: any;
  requests: any[];
  setRequests: any;
  teamMembers: any[];
  refreshData?: () => void;
}

const mockCategories = [
  'Appliance Repair',
  'Electrical Work',
  'Plumbing',
  'Home Cleaning',
  'Pest Control'
];

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(`https://server.apexbee.in${endpoint}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Request failed');
  }
  return res.json();
}

// ----------------------------------------------------
// SERVICE MANAGEMENT VIEW
// ----------------------------------------------------
export const ServiceManagement: React.FC<ServiceViewsProps> = ({ isCompany }) => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    category: mockCategories[0],
    type: 'Fixed Price',
    price: 999,
    discountPrice: '' as string | number,
    duration: '1 hour',
    warranty: '',
    description: '',
    imageUrl: '',
    included: '',
    excluded: '',
    cancellationPolicy: '',
    tags: '',
    active: true
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('https://server.apexbee.in/api/upload', {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Image upload failed');
      }

      const data = await res.json();
      if (data.success && data.url) {
        setNewService(prev => ({ ...prev, imageUrl: data.url }));
      } else {
        alert('Upload failed: invalid server response');
      }
    } catch (err: any) {
      console.error('Error uploading image:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Load services from backend
  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const res = await apiRequest<{ success: boolean; profile: any }>('/api/service-provider/profile');
        if (res.success && res.profile) {
          setServices(res.profile.services || []);
        }
      } catch (err: any) {
        console.error('Error loading services:', err);
        setError('Failed to load services. Please reload.');
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  const handleDelete = async (id: string) => {
    const updatedServices = services.filter(s => s.id !== id);
    setServices(updatedServices);

    try {
      await apiRequest('/api/service-provider/profile', {
        method: 'PUT',
        body: JSON.stringify({ services: updatedServices })
      });
    } catch (err) {
      console.error('Error deleting service:', err);
      alert('Failed to save deletion on the server. Please try again.');
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    const serviceToAdd = {
      name: newService.name,
      category: newService.category,
      type: newService.type,
      price: newService.price,
      discountPrice: newService.discountPrice ? Number(newService.discountPrice) : 0,
      duration: newService.duration,
      warranty: newService.warranty,
      description: newService.description,
      imageUrl: newService.imageUrl,
      included: newService.included ? newService.included.split('\n').map((t: string) => t.trim()).filter(Boolean) : [],
      excluded: newService.excluded ? newService.excluded.split('\n').map((t: string) => t.trim()).filter(Boolean) : [],
      cancellationPolicy: newService.cancellationPolicy,
      tags: newService.tags ? newService.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
      active: true,
      id: `SVC-${Math.floor(100 + Math.random() * 900)}`
    };
    const updatedServices = [...services, serviceToAdd];
    
    setServices(updatedServices);
    setShowAddModal(false);
    setNewService({
      name: '',
      category: mockCategories[0],
      type: 'Fixed Price',
      price: 999,
      discountPrice: '',
      duration: '1 hour',
      warranty: '',
      description: '',
      imageUrl: '',
      included: '',
      excluded: '',
      cancellationPolicy: '',
      tags: '',
      active: true
    });

    try {
      await apiRequest('/api/service-provider/profile', {
        method: 'PUT',
        body: JSON.stringify({ services: updatedServices })
      });
    } catch (err) {
      console.error('Error adding service:', err);
      alert('Failed to save service on the server. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Service Catalog</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Offerings, pricing structures, and durations.</p>
        </div>
        <CustomButton variant="primary" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" /> Add Service
        </CustomButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc) => (
          <GlassCard key={svc.id} className="relative overflow-hidden flex flex-col p-0">
            {/* Service Image */}
            {svc.imageUrl ? (
              <div className="w-full h-36 overflow-hidden flex-shrink-0 bg-slate-800 relative">
                <img
                  src={svc.imageUrl}
                  alt={svc.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                  svc.type === 'Fixed Price'
                    ? 'bg-emerald-500/90 text-white'
                    : svc.type === 'Quote Based'
                    ? 'bg-indigo-500/90 text-white'
                    : 'bg-amber-500/90 text-white'
                }`}>{svc.type}</span>
              </div>
            ) : (
              <div className="w-full h-20 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 flex-shrink-0 relative">
                <Image className="w-8 h-8 text-slate-600" />
                <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                  svc.type === 'Fixed Price'
                    ? 'bg-emerald-500/90 text-white'
                    : svc.type === 'Quote Based'
                    ? 'bg-indigo-500/90 text-white'
                    : 'bg-amber-500/90 text-white'
                }`}>{svc.type}</span>
              </div>
            )}

            <div className="p-4 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  {svc.category}
                </span>
                {svc.warranty && (
                  <span className="text-[9px] font-extrabold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <ShieldAlert className="w-2.5 h-2.5 text-emerald-500" /> {svc.warranty}
                  </span>
                )}
              </div>
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm leading-snug mb-1">
                {svc.name}
              </h3>

              {svc.description && (
                <p className="text-[11px] text-slate-450 dark:text-slate-400 line-clamp-2 mb-2">{svc.description}</p>
              )}

              {svc.included && svc.included.length > 0 && (
                <div className="mb-2 space-y-0.5">
                  {svc.included.slice(0, 2).map((inc: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-450">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span className="line-clamp-1">{inc}</span>
                    </div>
                  ))}
                </div>
              )}

              {svc.tags && svc.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {svc.tags.slice(0, 3).map((tag: string, i: number) => (
                    <span key={i} className="text-[9px] px-1.5 py-0.5 bg-brand-500/10 text-brand-500 rounded-full font-semibold">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-3 border-t border-slate-200/50 dark:border-slate-800/60 flex justify-between items-center mt-auto">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Price</span>
                  <div className="flex items-baseline gap-1.5">
                    {svc.discountPrice && Number(svc.discountPrice) > 0 ? (
                      <>
                        <span className="text-base font-black text-emerald-450 dark:text-emerald-450">₹{svc.discountPrice}</span>
                        <span className="text-xs line-through text-slate-500 font-medium">₹{svc.price}</span>
                      </>
                    ) : (
                      <span className="text-base font-black text-slate-850 dark:text-white">₹{svc.price}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-slate-450 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {svc.duration}
                  </span>
                  <button
                    onClick={() => handleDelete(svc.id)}
                    className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg"
          >
            <GlassCard hoverEffect={false} className="border-slate-800 bg-slate-900 text-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="text-base font-bold">Add Service to Catalog</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddService} className="space-y-4">
                {/* Service Name */}
                <InputField
                  label="Service Name"
                  required
                  placeholder="e.g. RO Filter Cleaning"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  className="dark"
                />

                {/* Category & Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-300">Category</label>
                    <select
                      value={newService.category}
                      onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                      className="glass-input dark select-field bg-slate-900 border-slate-800 text-white"
                    >
                      {mockCategories.map((cat, i) => (
                        <option key={i} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-300">Service Type</label>
                    <select
                      value={newService.type}
                      onChange={(e) => setNewService({ ...newService, type: e.target.value })}
                      className="glass-input dark select-field bg-slate-900 border-slate-800 text-white"
                    >
                      <option value="Fixed Price">Fixed Price</option>
                      <option value="Quote Based">Quote Based</option>
                      <option value="AMC Based">AMC Based</option>
                    </select>
                  </div>
                </div>

                {/* Price & Discount Price */}
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Original Price (INR)"
                    type="number"
                    required
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                    className="dark"
                  />
                  <InputField
                    label="Discounted Price (INR) - Optional"
                    type="number"
                    placeholder="e.g. 799"
                    value={newService.discountPrice}
                    onChange={(e) => setNewService({ ...newService, discountPrice: e.target.value })}
                    className="dark"
                  />
                </div>

                {/* Duration & Warranty */}
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Estimated Duration"
                    required
                    placeholder="e.g. 45 mins"
                    value={newService.duration}
                    onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                    className="dark"
                  />
                  <InputField
                    label="Warranty / Guarantee"
                    placeholder="e.g. 30 days warranty"
                    value={newService.warranty}
                    onChange={(e) => setNewService({ ...newService, warranty: e.target.value })}
                    className="dark"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-300">Description</label>
                  <textarea
                    placeholder="Briefly describe what this service includes, what customers can expect..."
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    className="glass-input dark bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2.5 text-sm resize-none min-h-[80px] placeholder:text-slate-600 focus:outline-none focus:border-brand-500"
                  />
                </div>

                {/* Included & Excluded */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-300">What's Included</label>
                    <textarea
                      placeholder="Enter one item per line..."
                      value={newService.included}
                      onChange={(e) => setNewService({ ...newService, included: e.target.value })}
                      className="glass-input dark bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2.5 text-sm resize-none min-h-[80px] placeholder:text-slate-600 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-300">What's Excluded</label>
                    <textarea
                      placeholder="Enter one item per line..."
                      value={newService.excluded}
                      onChange={(e) => setNewService({ ...newService, excluded: e.target.value })}
                      className="glass-input dark bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2.5 text-sm resize-none min-h-[80px] placeholder:text-slate-600 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                {/* Cancellation Policy */}
                <InputField
                  label="Cancellation Policy"
                  placeholder="e.g. Free cancellation up to 24h before service"
                  value={newService.cancellationPolicy}
                  onChange={(e) => setNewService({ ...newService, cancellationPolicy: e.target.value })}
                  className="dark"
                />

                {/* Image Upload Option */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Image className="w-4 h-4" /> Service Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="service-image-file-input"
                  />
                  <label
                    htmlFor="service-image-file-input"
                    className="cursor-pointer border border-dashed border-slate-700 hover:border-brand-500 rounded-xl p-4 flex flex-col items-center justify-center gap-2 bg-slate-900/50 hover:bg-slate-900 transition-all text-center animate-pulse-slow"
                  >
                    {uploadingImage ? (
                      <div className="flex flex-col items-center gap-2 py-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-brand-500"></div>
                        <span className="text-xs text-slate-400">Uploading image to server...</span>
                      </div>
                    ) : newService.imageUrl ? (
                      <div className="relative w-full h-32 rounded-lg overflow-hidden group">
                        <img
                          src={newService.imageUrl}
                          alt="Uploaded Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Upload className="w-4 h-4" /> Change Image
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-slate-400" />
                        <span className="text-sm font-medium text-slate-300">Click to upload image file</span>
                        <span className="text-[10px] text-slate-500">Supports PNG, JPG, WEBP</span>
                      </>
                    )}
                  </label>
                </div>

                {/* Tags */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Tag className="w-4 h-4" /> Tags
                    <span className="text-[10px] text-slate-500 font-normal">(comma-separated)</span>
                  </label>
                  <InputField
                    placeholder="e.g. deep-clean, split-AC, refrigerant"
                    value={newService.tags}
                    onChange={(e) => setNewService({ ...newService, tags: e.target.value })}
                    className="dark"
                  />
                  {newService.tags && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {newService.tags.split(',').map((t: string, i: number) => t.trim() && (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-brand-500/10 text-brand-400 rounded-full font-semibold">
                          #{t.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <CustomButton type="submit" variant="primary" className="w-full pt-3">
                  Publish Service
                </CustomButton>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const TIME_OPTIONS = [
  '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM',
  '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM'
];

// ----------------------------------------------------
// AVAILABILITY MANAGEMENT VIEW
// ----------------------------------------------------
export const Availability: React.FC = () => {
  const [weeklySchedule, setWeeklySchedule] = useState([
    { day: 'Monday', active: true, start: '09:00 AM', end: '06:00 PM' },
    { day: 'Tuesday', active: true, start: '09:00 AM', end: '06:00 PM' },
    { day: 'Wednesday', active: true, start: '09:00 AM', end: '06:00 PM' },
    { day: 'Thursday', active: true, start: '09:00 AM', end: '06:00 PM' },
    { day: 'Friday', active: true, start: '09:00 AM', end: '06:00 PM' },
    { day: 'Saturday', active: true, start: '10:00 AM', end: '05:00 PM' },
    { day: 'Sunday', active: false, start: 'Closed', end: 'Closed' }
  ]);

  const [emergencyActive, setEmergencyActive] = useState(false);
  const [holidays, setHolidays] = useState([
    { date: '2026-08-15', name: 'Independence Day' },
    { date: '2026-11-08', name: 'Diwali (Deepavali)' },
    { date: '2026-12-25', name: 'Christmas Day' }
  ]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load availability from backend
  useEffect(() => {
    const loadAvailability = async () => {
      try {
        setLoading(true);
        const res = await apiRequest<{ success: boolean; profile: any }>('/api/service-provider/profile');
        if (res.success && res.profile && res.profile.availability) {
          const avail = res.profile.availability;
          if (avail.weeklySchedule && avail.weeklySchedule.length > 0) {
            setWeeklySchedule(avail.weeklySchedule);
          }
          setEmergencyActive(!!avail.emergencyActive);
          if (avail.holidays) {
            setHolidays(avail.holidays);
          }
        }
      } catch (err) {
        console.error('Error loading availability:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAvailability();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await apiRequest('/api/service-provider/profile', {
        method: 'PUT',
        body: JSON.stringify({
          availability: {
            weeklySchedule,
            emergencyActive,
            holidays
          }
        })
      });
      alert('Availability schedule saved successfully!');
    } catch (err) {
      console.error('Error saving availability:', err);
      alert('Failed to save availability schedule. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateDayTime = (idx: number, field: 'start' | 'end', value: string) => {
    setWeeklySchedule(weeklySchedule.map((item, i) => {
      if (i === idx) {
        return {
          ...item,
          [field]: value
        };
      }
      return item;
    }));
  };

  const toggleDay = (idx: number) => {
    setWeeklySchedule(weeklySchedule.map((item, i) => {
      if (i === idx) {
        const nextActive = !item.active;
        return {
          ...item,
          active: nextActive,
          start: nextActive ? '09:00 AM' : 'Closed',
          end: nextActive ? '06:00 PM' : 'Closed'
        };
      }
      return item;
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Availability Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Configure operating schedule, emergency slots, and calendars.</p>
        </div>
        <CustomButton variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Availability'}
        </CustomButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Hours */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold tracking-tight">Weekly Operating Hours</h2>
          <GlassCard hoverEffect={false} className="space-y-3 p-5">
            {weeklySchedule.map((item, idx) => (
              <div key={item.day} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-2 border-b border-slate-200/50 dark:border-slate-800/40 last:border-b-0 text-xs">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={item.active}
                    onChange={() => toggleDay(idx)}
                    className="accent-brand-500 rounded h-4 w-4"
                  />
                  <span className={`font-bold w-24 ${item.active ? '' : 'text-slate-400 line-through'}`}>
                    {item.day}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {item.active ? (
                    <>
                      <select 
                        value={item.start}
                        onChange={(e) => updateDayTime(idx, 'start', e.target.value)}
                        className="glass-input py-1 bg-white/20 dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-medium cursor-pointer"
                      >
                        {TIME_OPTIONS.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                      <span className="text-slate-455">to</span>
                      <select 
                        value={item.end}
                        onChange={(e) => updateDayTime(idx, 'end', e.target.value)}
                        className="glass-input py-1 bg-white/20 dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-medium cursor-pointer"
                      >
                        {TIME_OPTIONS.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500 font-medium italic">Closed for booking</span>
                  )}
                </div>
              </div>
            ))}
          </GlassCard>
        </div>

        {/* Calendar Block & Emergencies */}
        <div className="space-y-6">
          <GlassCard hoverEffect={false} className={`p-6 border-2 transition-all ${
            emergencyActive ? 'border-rose-500/30 bg-rose-500/5 glow-purple' : 'border-slate-200/60 dark:border-slate-800/80'
          }`}>
            <div className="flex justify-between items-start mb-3">
              <div className="space-y-1">
                <h3 className={`text-sm font-extrabold ${emergencyActive ? 'text-rose-500' : ''}`}>
                  🚨 Emergency Availability
                </h3>
                <p className="text-[10px] text-slate-450 dark:text-slate-400">
                  Allow premium orders during off-hours (Charges 1.5x labor cost).
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={emergencyActive} 
                  onChange={() => setEmergencyActive(!emergencyActive)} 
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-slate-350 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500" />
              </label>
            </div>
          </GlassCard>

          <GlassCard hoverEffect={false} className="p-5">
            <h3 className="text-sm font-bold mb-4">Holiday Calendar (2026)</h3>
            <div className="space-y-3">
              {holidays.map((hol, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 rounded-xl bg-white/20 dark:bg-slate-950/20 text-xs">
                  <div>
                    <h4 className="font-bold">{hol.name}</h4>
                    <span className="text-[10px] text-slate-400 font-medium">{hol.date}</span>
                  </div>
                  <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wide border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 rounded-full">
                    Closed
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// SERVICE REQUESTS VIEW
// ----------------------------------------------------
export const ServiceRequests: React.FC<ServiceViewsProps> = ({ 
  isCompany, 
  jobs, 
  setJobs, 
  requests, 
  setRequests,
  teamMembers,
  refreshData
}) => {
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState(teamMembers[0]?.name || '');

  const handleAccept = (reqId: string) => {
    if (isCompany) {
      setAssigningId(reqId);
    } else {
      executeAccept(reqId, undefined);
    }
  };

  const executeAccept = async (reqId: string, staff?: string) => {
    const req = requests.find(r => r.id === reqId);
    if (!req) return;

    try {
      const res = await fetch(`https://server.apexbee.in/api/service/bookings/${req._id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          status: "Accepted",
          assignedStaff: staff || ""
        })
      });
      if (res.ok) {
        if (refreshData) refreshData();
        setAssigningId(null);
      } else {
        const errData = await res.json();
        alert(errData.message || "Failed to accept booking");
      }
    } catch (error) {
      console.error("Accept error:", error);
    }
  };

  const handleReject = async (reqId: string) => {
    const req = requests.find(r => r.id === reqId);
    if (!req) return;

    try {
      const res = await fetch(`https://server.apexbee.in/api/service/bookings/${req._id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          status: "Rejected"
        })
      });
      if (res.ok) {
        if (refreshData) refreshData();
      } else {
        const errData = await res.json();
        alert(errData.message || "Failed to reject booking");
      }
    } catch (error) {
      console.error("Reject error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Service Requests</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Manage incoming service bookings, reviews, and assignments.</p>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-450 dark:text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-4">Customer</th>
                <th className="p-4">Requested Service</th>
                <th className="p-4">Location</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Quoted Fare</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400 text-sm font-medium">
                    No active service requests in queue.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="border-b border-slate-200/50 dark:border-slate-800/40 hover:bg-white/10 dark:hover:bg-slate-950/25 transition-colors">
                    <td className="p-4">
                      <div>
                        <span className="font-extrabold text-slate-800 dark:text-slate-150 block">{req.customerName}</span>
                        <span className="text-[10px] text-slate-450 font-medium">{req.phone}</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-brand-500">{req.serviceName}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="line-clamp-1">{req.location}, {req.city}</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-650 dark:text-slate-350">{req.dateTime}</td>
                    <td className="p-4 font-black">₹{req.price}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleReject(req.id)} 
                          className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all font-bold"
                        >
                          Reject
                        </button>
                        <button 
                          onClick={() => handleAccept(req.id)} 
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all font-bold flex items-center gap-1"
                        >
                          Accept {isCompany && <ArrowRight className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Assignment Modal for Company */}
      {assigningId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm"
          >
            <GlassCard hoverEffect={false} className="border-slate-800 bg-slate-900 text-white p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="text-base font-bold flex items-center gap-1.5">
                  <UserCheck className="w-5 h-5 text-brand-500" /> Assign Technician
                </h3>
                <button onClick={() => setAssigningId(null)} className="text-slate-400 hover:text-slate-200">
                  ✕
                </button>
              </div>

              <div className="space-y-4 py-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-350">Select Technician</label>
                  <select
                    value={selectedStaff}
                    onChange={(e) => setSelectedStaff(e.target.value)}
                    className="glass-input dark bg-slate-950 border-slate-850 text-white"
                  >
                    {teamMembers.filter(m => m.status === 'Active' && m.attendanceToday === 'Present').map((member, i) => (
                      <option key={i} value={member.name}>{member.name} ({member.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <CustomButton variant="ghost" onClick={() => setAssigningId(null)} className="flex-1 text-slate-400">
                  Cancel
                </CustomButton>
                <CustomButton variant="primary" onClick={() => executeAccept(assigningId, selectedStaff)} className="flex-1">
                  Assign & Accept
                </CustomButton>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------
// JOB MANAGEMENT (KANBAN STYLE BOARD) VIEW
// ----------------------------------------------------
export const JobManagement: React.FC<ServiceViewsProps> = ({ 
  isCompany, 
  jobs, 
  setJobs,
  teamMembers,
  refreshData
}) => {
  const columns = [
    { id: 'pending', title: 'Pending Acceptance', color: 'border-t-yellow-500' },
    { id: 'assigned', title: 'Assigned', color: 'border-t-brand-500' },
    { id: 'in_progress', title: 'In Progress', color: 'border-t-purple-500 animate-pulse' },
    { id: 'completed', title: 'Completed', color: 'border-t-emerald-500' },
    { id: 'cancelled', title: 'Cancelled', color: 'border-t-rose-500' }
  ];

  const moveJob = async (jobId: string, newStatus: typeof jobs[0]['status']) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    let otpCode = "";
    if (newStatus === "completed") {
      otpCode = prompt("Please enter the customer verification OTP to complete the service:") || "";
      if (!otpCode) {
        alert("Customer verification OTP is required to complete the booking.");
        return;
      }
    }

    let backendStatus = "";
    if (newStatus === "assigned") backendStatus = "Technician Assigned";
    else if (newStatus === "in_progress") backendStatus = "Work Started";
    else if (newStatus === "completed") backendStatus = "Completed";
    else if (newStatus === "cancelled") backendStatus = "Cancelled";

    try {
      const res = await fetch(`https://server.apexbee.in/api/service/bookings/${job._id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          status: backendStatus,
          otpCode: otpCode || undefined
        })
      });
      if (res.ok) {
        if (refreshData) refreshData();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to update job status");
      }
    } catch (err) {
      console.error("Job transition error:", err);
    }
  };

  const getNextStatus = (curr: string): string | null => {
    if (curr === 'pending') return 'assigned';
    if (curr === 'assigned') return 'in_progress';
    if (curr === 'in_progress') return 'completed';
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Job Board (Kanban)</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Track active order operations and dispatch workflows.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto min-h-[500px]">
        {columns.map((col) => {
          const colJobs = jobs.filter(j => j.status === col.id);
          return (
            <div key={col.id} className="flex flex-col gap-4 min-w-[200px] max-w-[250px] md:max-w-none w-full bg-slate-100/50 dark:bg-slate-900/30 p-3.5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40">
              <div className={`border-t-4 ${col.color} pt-2 pb-1 flex justify-between items-center`}>
                <h3 className="font-extrabold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  {col.title}
                </h3>
                <span className="bg-slate-200 dark:bg-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {colJobs.length}
                </span>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto max-h-[600px] scrollbar-none">
                {colJobs.map((job) => {
                  const next = getNextStatus(job.status);
                  return (
                    <GlassCard key={job.id} hoverEffect={true} className="p-3.5 space-y-3 border-slate-200/60 dark:border-slate-800/80 bg-white/40 dark:bg-slate-950/40 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-450 dark:text-slate-400 font-bold">{job.id}</span>
                        <span className="font-black">₹{job.revenue}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{job.serviceName}</h4>
                        <p className="text-[10px] text-slate-450 dark:text-slate-400">👤 {job.customerName}</p>
                        <p className="text-[10px] text-slate-450 dark:text-slate-400 font-medium">📍 {job.location}</p>
                      </div>

                      {job.assignedStaff && (
                        <div className="p-1.5 rounded-lg bg-brand-500/5 border border-brand-500/10 text-[10px] font-bold text-brand-500">
                          🔧 {job.assignedStaff}
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between gap-2.5">
                        {job.status !== 'completed' && job.status !== 'cancelled' && (
                          <button 
                            onClick={() => moveJob(job.id, 'cancelled')} 
                            className="p-1 rounded-md border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white text-[10px] font-semibold"
                          >
                            Cancel
                          </button>
                        )}
                        {next && (
                          <button
                            onClick={() => moveJob(job.id, next as any)}
                            className="flex-1 py-1 rounded-md bg-brand-600 hover:bg-brand-700 text-white font-bold text-[10px] text-center flex items-center justify-center gap-0.5"
                          >
                            Move <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ----------------------------------------------------
// SCHEDULED SERVICES (CALENDAR VIEW)
// ----------------------------------------------------
export const ScheduledServices: React.FC<ServiceViewsProps> = ({ jobs }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 14)); // June 14, 2026
  
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const startDayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const calendarCells = [];
  // Add empty placeholders for start offset
  for (let i = 0; i < startDayIndex; i++) {
    calendarCells.push(null);
  }
  // Add day numbers
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push(i);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Calendar Planner</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Scheduled visits, technician routes, and dispatch records.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <GlassCard hoverEffect={false} className="lg:col-span-3 p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            
            <div className="flex gap-2">
              <button 
                onClick={handlePrevMonth} 
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-450 dark:text-slate-400"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={handleNextMonth} 
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-450 dark:text-slate-400"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center font-bold text-slate-550 dark:text-slate-400 text-xs mb-3">
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-xs">
            {calendarCells.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="h-24 p-1 bg-slate-50/10 dark:bg-slate-900/5 rounded-xl border border-transparent" />;
              }

              const dateStr = `2026-06-${day < 10 ? '0' + day : day}`;
              const dayJobs = jobs.filter(j => j.date === dateStr);

              return (
                <div 
                  key={`day-${day}`} 
                  className={`h-24 p-1 rounded-xl border flex flex-col justify-between transition-colors overflow-hidden ${
                    day === 14 
                      ? 'border-brand-500 bg-brand-500/5 text-brand-500' 
                      : 'border-slate-200/50 dark:border-slate-800/40 bg-white/20 dark:bg-slate-950/20'
                  }`}
                >
                  <span className="font-bold block text-left ml-1 mt-1 text-[10px]">
                    {day}
                  </span>
                  
                  <div className="flex-1 overflow-y-auto space-y-1 mt-1 pr-0.5 scrollbar-none">
                    {dayJobs.map((j) => (
                      <span 
                        key={j.id} 
                        className={`block text-[8px] px-1 py-0.5 rounded leading-none truncate font-bold text-left ${
                          j.status === 'completed' 
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                            : j.status === 'in_progress'
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse'
                            : 'bg-brand-500/10 text-brand-500 border border-brand-500/20'
                        }`}
                        title={j.serviceName}
                      >
                        {j.serviceName}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Schedule List sidebar */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">Visits Scheduled Today</h3>
          
          <div className="space-y-3">
            {jobs.filter(j => j.date === '2026-06-14').map((j) => (
              <GlassCard key={j.id} hoverEffect={false} className="p-4 border-slate-200/80 dark:border-slate-800/80 text-xs">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] text-slate-450 font-bold uppercase">{j.id}</span>
                  <span className="text-[10px] font-bold text-brand-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {j.timeSlot.split(' ')[0] || ''}
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-2">{j.serviceName}</h4>
                <p className="text-[10px] text-slate-450 mt-1">👤 {j.customerName} • 📍 {j.location}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
