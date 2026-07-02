import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, Users, Wrench, Wallet, Calendar, Star, IndianRupee, Clock,
  Plus, FileText, CheckCircle, AlertTriangle, XCircle, Shield, ArrowUpRight,
  User, Briefcase, Award, MapPin, Globe, PlusCircle, Trash, Check, Camera
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { CustomButton } from '../components/CustomButton';
import { InputField } from '../components/InputField';
import { StatCard } from '../components/StatCard';


// ----------------------------------------------------
// BACKEND CONFIG - ApexBee API on port 5500
// ----------------------------------------------------
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://server.apexbee.in';

const getAuthToken = () => localStorage.getItem('token') || localStorage.getItem('authToken') || '';

const safeJson = async (res: Response) => {
  const text = await res.text();
  try { return text ? JSON.parse(text) : null; } catch { return text; }
};

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const isFormData = options.body instanceof FormData;
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  const data = await safeJson(res);
  if (!res.ok) {
    throw new Error((data && (data.message || data.error)) || `API failed: ${res.status}`);
  }
  return data as T;
}

async function apiFirst<T>(endpoints: string[]): Promise<T | null> {
  for (const endpoint of endpoints) {
    try { return await apiRequest<T>(endpoint); } catch {}
  }
  return null;
}

type RoleType =
  | 'admin' | 'state_franchise' | 'district_franchise' | 'mandal_franchise'
  | 'entrepreneur' | 'franchise' | 'vendor' | 'wholesaler' | 'manufacturer'
  | 'service_provider' | 'course_provider' | 'delivery_partner' | 'customer';

interface BackendUser {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  roles?: RoleType[];
  status?: string;
  isVerified?: boolean;
  profileImage?: string;
  territory?: { state?: string; district?: string; mandal?: string };
  sellerProfile?: {
    businessName?: string;
    businessType?: string;
    gstNumber?: string;
    panNumber?: string;
    aadhaarNumber?: string;
    addressText?: string;
    kycStatus?: string;
  };
}

interface BusinessApplicationDTO {
  _id?: string;
  userId?: string;
  applicationType?: string;
  businessName?: string;
  ownerName?: string;
  mobile?: string;
  email?: string;
  state?: string;
  district?: string;
  mandal?: string;
  village?: string;
  address?: string;
  pincode?: string;
  gstNumber?: string;
  panNumber?: string;
  experience?: string;
  expectedSales?: string;
  franchiseLevel?: string;
  investmentCapacity?: string;
  serviceType?: string;
  sampleVideoLink?: string;
  vehicleType?: string;
  licenseNumber?: string;
  aadhaarNumber?: string;
  documents?: { aadhaar?: string; pan?: string; gst?: string; license?: string };
  bankDetails?: { accountHolderName?: string; accountNumber?: string; bankName?: string; ifscCode?: string };
  status?: 'pending' | 'under_review' | 'approved' | 'rejected';
  adminRemarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface FranchiseDTO {
  _id?: string;
  userId?: string;
  businessName?: string;
  ownerName?: string;
  mobile?: string;
  email?: string;
  address?: string;
  pincode?: string;
  level?: 'mandal' | 'district' | 'state';
  status?: string;
}

const unwrap = <T,>(payload: any): T | null => {
  if (!payload) return null;
  return (payload.data || payload.user || payload.application || payload.franchise || payload) as T;
};

const maskValue = (value?: string, visible = 4) => {
  if (!value) return '';
  if (value.length <= visible) return value;
  return `${'X'.repeat(Math.max(0, value.length - visible))}${value.slice(-visible)}`;
};

const mapBackendToProfile = (user: BackendUser | null, application: BusinessApplicationDTO | null, franchise: FranchiseDTO | null, oldProfile: any) => ({
  ...oldProfile,
  contactPerson: application?.ownerName || franchise?.ownerName || user?.name || oldProfile.contactPerson || '',
  designation: application?.applicationType || (user?.roles || []).join(', ') || oldProfile.designation || 'Service Provider',
  email: application?.email || franchise?.email || user?.email || oldProfile.email || '',
  phone: application?.mobile || franchise?.mobile || user?.phone || user?.mobile || oldProfile.phone || '',
  companyName: application?.businessName || franchise?.businessName || user?.sellerProfile?.businessName || oldProfile.companyName || '',
  gstNumber: application?.gstNumber || user?.sellerProfile?.gstNumber || oldProfile.gstNumber || '',
  panNumber: application?.panNumber || user?.sellerProfile?.panNumber || oldProfile.panNumber || '',
  aadhaarNumber: application?.aadhaarNumber || user?.sellerProfile?.aadhaarNumber || oldProfile.aadhaarNumber || '',
  experience: application?.experience || oldProfile.experience || '',
  address: application?.address || franchise?.address || user?.sellerProfile?.addressText || oldProfile.address || '',
  pincode: application?.pincode || franchise?.pincode || oldProfile.pincode || '',
  serviceType: application?.serviceType || oldProfile.serviceType || '',
  franchiseLevel: application?.franchiseLevel || franchise?.level || oldProfile.franchiseLevel || '',
  licenseNumber: application?.licenseNumber || oldProfile.licenseNumber || '',
  vehicleType: application?.vehicleType || oldProfile.vehicleType || '',
  kycStatus: application?.status === 'approved' ? 'Approved' : application?.status === 'rejected' ? 'Rejected' : application?.status === 'under_review' ? 'Under Review' : (user?.sellerProfile?.kycStatus || oldProfile.kycStatus || 'Pending KYC'),
  serviceAreas: [application?.mandal, application?.district, application?.state].filter(Boolean).length
    ? [application?.mandal, application?.district, application?.state].filter(Boolean)
    : (oldProfile.serviceAreas || []),
  bankDetails: {
    ...(oldProfile.bankDetails || {}),
    accountName: application?.bankDetails?.accountHolderName || oldProfile.bankDetails?.accountName || '',
    accountNumber: application?.bankDetails?.accountNumber || oldProfile.bankDetails?.accountNumber || '',
    bankName: application?.bankDetails?.bankName || oldProfile.bankDetails?.bankName || '',
    ifsc: application?.bankDetails?.ifscCode || oldProfile.bankDetails?.ifsc || ''
  },
  documents: application?.documents || oldProfile.documents || {},
  adminRemarks: application?.adminRemarks || oldProfile.adminRemarks || ''
});

// ----------------------------------------------------
// DASHBOARD VIEW
// ----------------------------------------------------
interface ViewSwitcherProps {
  setActiveView: (view: string) => void;
  isCompany: boolean;
  profileData: any;
  setProfileData: any;
  kpis: any;
  setKpis: any;
  jobs: any[];
  setJobs: any;
  requests: any[];
  setRequests: any;
  quotes: any[];
  setQuotes: any;
  spareParts: any[];
  setSpareParts: any;
  amcs: any[];
  setAmcs: any;
  refreshData?: any;
}

export const Dashboard: React.FC<ViewSwitcherProps> = ({ 
  setActiveView, 
  isCompany, 
  profileData, 
  kpis,
  jobs,
  requests,
  setJobs,
  setRequests
}) => {
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await apiRequest<{ success: boolean; stats: any }>('/api/service-provider/dashboard');
      if (res.success) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Chart Data
  const revenueData = [
    { name: 'Jan', revenue: 85000, amcRevenue: 12000 },
    { name: 'Feb', revenue: 95000, amcRevenue: 15000 },
    { name: 'Mar', revenue: 120000, amcRevenue: 22000 },
    { name: 'Apr', revenue: 140000, amcRevenue: 25000 },
    { name: 'May', revenue: 165000, amcRevenue: 30000 },
    { name: 'Jun', revenue: 185600, amcRevenue: 38000 },
  ];

  const categoryPerformance = [
    { name: 'AC Services', value: 45 },
    { name: 'Electricals', value: 30 },
    { name: 'Water Purifiers', value: 15 },
    { name: 'Solar / Equipment', value: 10 },
  ];
  
  const COLORS = ['#09090b', '#3f3f46', '#71717a', '#d4d4d8'];

  const handleAcceptRequest = (reqId: string) => {
    const req = requests.find(r => r.id === reqId);
    if (!req) return;

    setRequests(requests.filter(r => r.id !== reqId));

    const newJob = {
      id: `JOB-${Math.floor(100 + Math.random() * 900)}`,
      customerName: req.customerName,
      phone: req.phone,
      city: req.city,
      location: req.location,
      serviceCategory: 'Home Services',
      serviceName: req.serviceName,
      revenue: req.price,
      status: 'assigned' as const,
      date: req.dateTime.split(' ')[0],
      timeSlot: req.dateTime.split(' ').slice(1).join(' '),
      assignedStaff: isCompany ? 'Suresh Pujari' : undefined
    };
    setJobs([newJob, ...jobs]);
  };

  const handleRejectRequest = (reqId: string) => {
    setRequests(requests.filter(r => r.id !== reqId));
  };

  const currentWalletBalance = stats ? stats.walletBalance : kpis.walletBalance;
  const currentPendingEarnings = stats ? stats.pendingEarnings : kpis.pendingEarnings;
  const currentRating = stats ? stats.customerRating : kpis.averageRating;
  const currentCompletedJobs = stats ? stats.completedJobs : kpis.completedJobs;

  return (
    <div className="space-y-6">
      {/* Top Welcome Alert */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-panel rounded-3xl glow-indigo border-indigo-500/10">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Namaste, {profileData.contactPerson || 'Service Partner'}! 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your service business on the ApexBee platform. Here is your overview for today.
          </p>
          {stats && (
            <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-slate-200/10 text-xs">
              <div>
                <span className="text-slate-400">Profile Completion: </span>
                <span className="font-bold text-brand-500">{stats.profileCompletion}%</span>
              </div>
              <div className="w-24 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-brand-500 h-full" style={{ width: `${stats.profileCompletion}%` }} />
              </div>
              <div>
                <span className="text-slate-400">KYC Status: </span>
                <span className={`font-bold uppercase ${stats.verificationStatus === 'Approved' ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {stats.verificationStatus}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2.5">
          <CustomButton variant="glass" onClick={() => setActiveView('availability')} className="text-xs">
            <Clock className="w-4 h-4" /> Availability Slots
          </CustomButton>
          <CustomButton variant="primary" onClick={() => setActiveView('service-requests')} className="text-xs">
            <Plus className="w-4 h-4" /> View Requests
          </CustomButton>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-200">Key Metrics</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Revenue" value={`₹${kpis.todayRevenue.toLocaleString('en-IN')}`} icon={IndianRupee} change="12.4%" isIncrease={true} colorClass="text-emerald-500 bg-emerald-500/10" />
        <StatCard title="Monthly Revenue" value={`₹${kpis.monthlyRevenue.toLocaleString('en-IN')}`} icon={TrendingUp} change="8.2%" isIncrease={true} />
        <StatCard title="Active Jobs" value={kpis.activeJobs} icon={Wrench} change="3.1%" isIncrease={true} colorClass="text-indigo-500 bg-indigo-500/10" />
        <StatCard title="Wallet Balance" value={`₹${currentWalletBalance.toLocaleString('en-IN')}`} icon={Wallet} change="18.5%" isIncrease={true} colorClass="text-emerald-500 bg-emerald-500/10" />
        
        <StatCard title="Pending Earnings" value={`₹${currentPendingEarnings.toLocaleString('en-IN')}`} icon={Wallet} colorClass="text-yellow-500 bg-yellow-500/10" />
        <StatCard title="Scheduled Services" value={kpis.scheduledServices} icon={Calendar} colorClass="text-purple-500 bg-purple-500/10" />
        <StatCard title="Completed Jobs" value={currentCompletedJobs} icon={CheckCircle} colorClass="text-blue-500 bg-blue-500/10" />
        <StatCard title="Average Rating" value={`${currentRating} ★`} icon={Star} colorClass="text-amber-500 bg-amber-500/10" />

        {isCompany && (
          <>
            <StatCard title="Team Members" value={kpis.teamMembers} icon={Users} colorClass="text-teal-500 bg-teal-500/10" />
            <StatCard title="AMC Contracts" value={kpis.amcCustomers} icon={FileText} change="14.8%" isIncrease={true} colorClass="text-cyan-500 bg-cyan-500/10" />
          </>
        )}
        <StatCard title="Referral Earnings" value={`₹${kpis.referralEarnings.toLocaleString('en-IN')}`} icon={IndianRupee} colorClass="text-pink-500 bg-pink-500/10" />
      </div>

      {/* Quick Actions Panel */}
      <GlassCard className="p-5" hoverEffect={false}>
        <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase mb-4">Quick Business Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <button onClick={() => setActiveView('service-management')} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/30 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/60 hover:border-brand-500/30 transition-all">
            <Plus className="w-5 h-5 text-brand-500 mb-2" />
            <span className="text-xs font-semibold">Add Service</span>
          </button>
          <button onClick={() => setActiveView('quotes')} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/30 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/60 hover:border-brand-500/30 transition-all">
            <FileText className="w-5 h-5 text-purple-500 mb-2" />
            <span className="text-xs font-semibold">Create Quote</span>
          </button>
          <button onClick={() => setActiveView('service-requests')} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/30 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/60 hover:border-brand-500/30 transition-all">
            <Calendar className="w-5 h-5 text-emerald-500 mb-2" />
            <span className="text-xs font-semibold">View Requests</span>
          </button>
          <button onClick={() => setActiveView('availability')} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/30 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/60 hover:border-brand-500/30 transition-all">
            <Clock className="w-5 h-5 text-yellow-500 mb-2" />
            <span className="text-xs font-semibold">Update Schedule</span>
          </button>
          <button onClick={() => setActiveView('wallet')} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/30 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/60 hover:border-brand-500/30 transition-all col-span-2 md:col-span-1">
            <Wallet className="w-5 h-5 text-rose-500 mb-2" />
            <span className="text-xs font-semibold">Withdraw Cash</span>
          </button>
        </div>
      </GlassCard>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <GlassCard hoverEffect={false} className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold">Revenue Growth</h3>
            <span className="text-xs text-slate-400 font-semibold">Last 6 Months</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#71717a" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#71717a" stopOpacity={0}/>
                  </linearGradient>
                  {isCompany && (
                    <linearGradient id="colorAmc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a1a1aa" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#a1a1aa" stopOpacity={0}/>
                    </linearGradient>
                  )}
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800/50" />
                <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#09090b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="revenue" stroke="#27272a" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" name="Total Revenue (₹)" />
                {isCompany && (
                  <Area type="monotone" dataKey="amcRevenue" stroke="#71717a" strokeWidth={2} fillOpacity={1} fill="url(#colorAmc)" name="AMC Revenue (₹)" />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Customer Growth & Service share */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
          <GlassCard hoverEffect={false} className="p-5">
            <h3 className="text-base font-bold mb-4">Service Category Share</h3>
            <div className="h-56 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPerformance}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2.5 text-xs font-medium pl-4">
                {categoryPerformance.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span>{item.name} ({item.value}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};


// ----------------------------------------------------
// PROFILE MANAGEMENT VIEW - connected to backend :5500
// ----------------------------------------------------
export const Profile: React.FC<{ isCompany: boolean; profileData: any; setProfileData: any }> = ({
  isCompany,
  profileData,
  setProfileData
}) => {
  const [activeTab, setActiveTab] = useState('account');
  const [editing, setEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newArea, setNewArea] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');
  
  const mapServiceProviderToProfile = (sp: any, kyc: any, oldProfile: any) => {
    if (!sp) return oldProfile;
    return {
      ...oldProfile,
      companyName: sp.businessName || oldProfile.companyName || '',
      contactPerson: sp.ownerName || oldProfile.contactPerson || '',
      email: sp.email || oldProfile.email || '',
      phone: sp.mobile || oldProfile.phone || '',
      alternateMobile: sp.alternateMobile || oldProfile.alternateMobile || '',
      address: sp.address || oldProfile.address || '',
      pincode: sp.pincode || oldProfile.pincode || '',
      experience: sp.experience || oldProfile.experience || '',
      description: sp.description || oldProfile.description || '',
      skills: sp.serviceCategory || oldProfile.skills || [],
      serviceAreas: sp.serviceSubCategory || oldProfile.serviceAreas || [],
      profilePhoto: sp.profilePhoto || oldProfile.profilePhoto || '',
      state: sp.state || oldProfile.state || '',
      district: sp.district || oldProfile.district || '',
      mandal: sp.mandal || oldProfile.mandal || '',
      village: sp.village || oldProfile.village || '',
      bankDetails: {
        accountName: sp.bankDetails?.accountHolderName || oldProfile.bankDetails?.accountName || '',
        accountNumber: sp.bankDetails?.accountNumber || oldProfile.bankDetails?.accountNumber || '',
        bankName: sp.bankDetails?.bankName || oldProfile.bankDetails?.bankName || '',
        ifsc: sp.bankDetails?.ifsc || oldProfile.bankDetails?.ifsc || '',
        upiId: sp.bankDetails?.upiId || oldProfile.bankDetails?.upiId || ''
      },
      documents: sp.documents || {},
      kycStatus: kyc?.verificationStatus || 'Pending KYC',
      adminRemarks: kyc?.remarks || ''
    };
  };

  const loadProfile = async () => {
    setLoading(true);
    setApiError('');
    try {
      const [profilePayload, kycPayload] = await Promise.all([
        apiRequest<{ success: boolean; profile: any }>('/api/service-provider/profile'),
        apiRequest<{ success: boolean; kyc: any }>('/api/service-provider/kyc').catch(() => ({ success: true, kyc: null }))
      ]);

      if (profilePayload.success) {
        setProfileData((prev: any) => mapServiceProviderToProfile(profilePayload.profile, kycPayload.kyc, prev || {}));
      }
    } catch (error: any) {
      setApiError(error.message || 'Unable to load profile from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleSave = async () => {
    setSaving(true);
    setApiError('');
    try {
      const payload = {
        businessName: profileData.companyName,
        ownerName: profileData.contactPerson,
        email: profileData.email,
        mobile: profileData.phone,
        alternateMobile: profileData.alternateMobile,
        address: profileData.address,
        pincode: profileData.pincode,
        experience: profileData.experience,
        description: profileData.description,
        serviceCategory: profileData.skills || [],
        serviceSubCategory: profileData.serviceAreas || [],
        state: profileData.state,
        district: profileData.district,
        mandal: profileData.mandal,
        village: profileData.village,
        bankDetails: {
          accountHolderName: profileData.bankDetails?.accountName,
          accountNumber: profileData.bankDetails?.accountNumber,
          bankName: profileData.bankDetails?.bankName,
          ifsc: profileData.bankDetails?.ifsc,
          upiId: profileData.bankDetails?.upiId
        }
      };

      await apiRequest('/api/service-provider/profile', {
        method: 'PUT',
        body: JSON.stringify(payload)
      });

      setEditing(false);
      await loadProfile();
    } catch (error: any) {
      setApiError(error.message || 'Profile update failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !(profileData.skills || []).includes(newSkill.trim())) {
      setProfileData({ ...profileData, skills: [...(profileData.skills || []), newSkill.trim()] });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setProfileData({ ...profileData, skills: (profileData.skills || []).filter((s: string) => s !== skill) });
  };

  const handleAddArea = () => {
    if (newArea.trim() && !(profileData.serviceAreas || []).includes(newArea.trim())) {
      setProfileData({ ...profileData, serviceAreas: [...(profileData.serviceAreas || []), newArea.trim()] });
      setNewArea('');
    }
  };

  const handleRemoveArea = (area: string) => {
    setProfileData({ ...profileData, serviceAreas: (profileData.serviceAreas || []).filter((a: string) => a !== area) });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Profile Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Connected to MongoDB backend via {API_BASE_URL}</p>
        </div>
        {activeTab !== 'account' && (
          <CustomButton variant={editing ? 'primary' : 'secondary'} onClick={editing ? handleSave : () => setEditing(true)} disabled={saving}>
            {editing ? <Check className="w-4 h-4" /> : null}
            {editing ? (saving ? 'Saving...' : 'Save Changes') : 'Edit Profile'}
          </CustomButton>
        )}
      </div>

      {apiError && (
        <div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-500 text-xs font-semibold">
          {apiError}
        </div>
      )}

      {loading && (
        <div className="p-3 rounded-xl border border-brand-500/20 bg-brand-500/10 text-brand-500 text-xs font-semibold">
          Loading profile from MongoDB...
        </div>
      )}

      <div className="flex gap-1 p-1 bg-white/5 dark:bg-slate-900/60 rounded-xl border border-slate-200/30 dark:border-slate-800 w-fit overflow-x-auto">
        {(['account', 'personal', 'skills', 'experience', 'portfolio', 'company', 'documents'] as string[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition-all ${
              activeTab === tab ? 'bg-brand-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab === 'account' ? '👤 My Account' : tab === 'documents' ? '📁 Documents' : tab}
          </button>
        ))}
      </div>

      {activeTab === 'account' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard hoverEffect={false} className="text-center p-6 flex flex-col items-center space-y-4 h-fit">
            <div className="relative group w-20 h-20 rounded-full bg-gradient-to-tr from-brand-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-xl ring-4 ring-brand-500/20 overflow-hidden">
              {profileData.profilePhoto ? (
                <img src={profileData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                getInitials(profileData.contactPerson)
              )}
            </div>
            <label className="cursor-pointer text-[10px] py-1 px-2.5 rounded-lg border border-slate-200/30 bg-slate-100 dark:bg-slate-900 font-bold hover:bg-brand-500 hover:text-white transition-all">
              Change Photo
              <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  setSaving(true);
                  const formData = new FormData();
                  formData.append('file', file);
                  const res = await apiRequest<{ success: boolean; url: string }>('/api/upload', {
                    method: 'POST',
                    body: formData
                  });
                  if (res.url) {
                    await apiRequest('/api/service-provider/profile', {
                      method: 'PUT',
                      body: JSON.stringify({ profilePhoto: res.url })
                    });
                    loadProfile();
                  }
                } catch (err: any) {
                  setApiError(err.message || 'Failed to upload photo.');
                } finally {
                  setSaving(false);
                }
              }} />
            </label>
            <div>
              <h2 className="text-base font-black">{profileData.contactPerson}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{profileData.email}</p>
            </div>
            <div className="w-full border-t border-slate-200/30 dark:border-slate-800/60 pt-4 text-left space-y-2">
              <div><span className="text-[10px] font-bold text-slate-400 uppercase block">Phone</span><span className="text-xs font-semibold">{profileData.phone}</span></div>
              {profileData.alternateMobile && <div><span className="text-[10px] font-bold text-slate-400 uppercase block">Alt Phone</span><span className="text-xs font-semibold">{profileData.alternateMobile}</span></div>}
              <div><span className="text-[10px] font-bold text-slate-400 uppercase block">KYC Status</span><span className={`text-xs font-bold uppercase ${profileData.kycStatus === 'Approved' ? 'text-emerald-500' : 'text-amber-500'}`}>{profileData.kycStatus}</span></div>
            </div>
          </GlassCard>

          <div className="lg:col-span-2 space-y-4">
            <GlassCard hoverEffect={false} className="p-6 space-y-4">
              <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase border-b border-slate-200/30 dark:border-slate-800/60 pb-3">Backend Account Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Owner Name" value={profileData.contactPerson || ''} disabled />
                <InputField label="Business Name" value={profileData.companyName || ''} disabled />
                <InputField label="Email Address" value={profileData.email || ''} disabled />
                <InputField label="Mobile Number" value={profileData.phone || ''} disabled />
                <InputField label="State" value={profileData.state || ''} disabled />
                <InputField label="District" value={profileData.district || ''} disabled />
                <InputField label="Mandal" value={profileData.mandal || ''} disabled />
                <InputField label="Village" value={profileData.village || ''} disabled />
                <InputField label="Pincode" value={profileData.pincode || ''} disabled />
              </div>
              {profileData.adminRemarks && (
                <div className="p-3 bg-brand-500/5 border border-brand-500/10 rounded-xl text-[11px] text-slate-400">
                  Admin Remarks: {profileData.adminRemarks}
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      )}

      {activeTab !== 'account' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <GlassCard hoverEffect={false} className="lg:col-span-1 text-center p-6 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border-2 border-brand-500 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
              {profileData.profilePhoto ? <img src={profileData.profilePhoto} alt="Profile" className="w-full h-full object-cover" /> : <User className="w-12 h-12 text-slate-400" />}
            </div>
            <h3 className="font-bold text-lg mt-4">{profileData.contactPerson}</h3>
            <p className="text-xs text-slate-400 font-semibold">{profileData.companyName}</p>
            <div className="mt-2.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 uppercase">
              {profileData.kycStatus || 'Pending KYC'}
            </div>
          </GlassCard>

          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'personal' && (
              <GlassCard hoverEffect={false} className="p-6 space-y-4">
                <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase">Personal & Business Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Owner Name" value={profileData.contactPerson || ''} onChange={(e) => setProfileData({ ...profileData, contactPerson: e.target.value })} disabled={!editing} />
                  <InputField label="Business Name" value={profileData.companyName || ''} onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })} disabled={!editing} />
                  <InputField label="Email Address" value={profileData.email || ''} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} disabled={!editing} />
                  <InputField label="Phone Number" value={profileData.phone || ''} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} disabled={!editing} />
                  <InputField label="Alternate Phone Number" value={profileData.alternateMobile || ''} onChange={(e) => setProfileData({ ...profileData, alternateMobile: e.target.value })} disabled={!editing} />
                  <InputField label="Description" value={profileData.description || ''} onChange={(e) => setProfileData({ ...profileData, description: e.target.value })} disabled={!editing} />
                  <InputField label="Address" value={profileData.address || ''} onChange={(e) => setProfileData({ ...profileData, address: e.target.value })} disabled={!editing} />
                  <InputField label="State" value={profileData.state || ''} onChange={(e) => setProfileData({ ...profileData, state: e.target.value })} disabled={!editing} />
                  <InputField label="District" value={profileData.district || ''} onChange={(e) => setProfileData({ ...profileData, district: e.target.value })} disabled={!editing} />
                  <InputField label="Mandal" value={profileData.mandal || ''} onChange={(e) => setProfileData({ ...profileData, mandal: e.target.value })} disabled={!editing} />
                  <InputField label="Village" value={profileData.village || ''} onChange={(e) => setProfileData({ ...profileData, village: e.target.value })} disabled={!editing} />
                  <InputField label="Pincode" value={profileData.pincode || ''} onChange={(e) => setProfileData({ ...profileData, pincode: e.target.value })} disabled={!editing} />
                </div>
              </GlassCard>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-6">
                <GlassCard hoverEffect={false} className="p-6 space-y-4">
                  <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase">Service Categories</h3>
                  {editing && <div className="flex gap-2"><InputField placeholder="e.g. Electrician, AC Repair" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} /><CustomButton onClick={handleAddSkill} className="whitespace-nowrap px-4 py-2 mt-6">Add Category</CustomButton></div>}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {(profileData.skills || []).map((skill: string, idx: number) => <span key={idx} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-500/10 text-brand-500 border border-brand-500/20 max-w-full truncate">{skill}{editing && <button onClick={() => handleRemoveSkill(skill)}>✕</button>}</span>)}
                  </div>
                </GlassCard>
                <GlassCard hoverEffect={false} className="p-6 space-y-4">
                  <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase">Service Sub-Categories / Coverage Areas</h3>
                  {editing && <div className="flex gap-2"><InputField placeholder="Add service area" value={newArea} onChange={(e) => setNewArea(e.target.value)} /><CustomButton onClick={handleAddArea} className="whitespace-nowrap px-4 py-2 mt-6">Add Area</CustomButton></div>}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {(profileData.serviceAreas || []).map((area: string, idx: number) => <span key={idx} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-500 border border-purple-500/20"><MapPin className="w-3 h-3" />{area}{editing && <button onClick={() => handleRemoveArea(area)}>✕</button>}</span>)}
                  </div>
                </GlassCard>
              </div>
            )}

            {activeTab === 'experience' && (
              <GlassCard hoverEffect={false} className="p-6 space-y-4">
                <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase">Experience</h3>
                <InputField label="Years of Experience" value={profileData.experience || ''} onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })} disabled={!editing} />
                <div className="text-sm text-slate-500 mt-2">Update your years of experience in your core trades to display on customer lead cards.</div>
              </GlassCard>
            )}

            {activeTab === 'portfolio' && (
              <GlassCard hoverEffect={false} className="p-6 space-y-4">
                <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase">Project Portfolio & Gallery</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(profileData.portfolio || []).map((proj: any, idx: number) => <div key={idx} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800"><img src={proj.image} alt={proj.title} className="w-full h-36 object-cover" /><div className="p-3 bg-white/10 dark:bg-slate-900/40 text-xs font-bold text-center">{proj.title}</div></div>)}
                </div>
              </GlassCard>
            )}

            {activeTab === 'company' && (
              <GlassCard hoverEffect={false} className="p-6 space-y-4">
                <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase">Bank Settlement Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Account Holder Name" value={profileData.bankDetails?.accountName || ''} onChange={(e) => setProfileData({ ...profileData, bankDetails: { ...profileData.bankDetails, accountName: e.target.value } })} disabled={!editing} />
                  <InputField label="Account Number" value={editing ? (profileData.bankDetails?.accountNumber || '') : maskValue(profileData.bankDetails?.accountNumber)} onChange={(e) => setProfileData({ ...profileData, bankDetails: { ...profileData.bankDetails, accountNumber: e.target.value } })} disabled={!editing} />
                  <InputField label="Bank Name" value={profileData.bankDetails?.bankName || ''} onChange={(e) => setProfileData({ ...profileData, bankDetails: { ...profileData.bankDetails, bankName: e.target.value } })} disabled={!editing} />
                  <InputField label="IFSC Code" value={profileData.bankDetails?.ifsc || ''} onChange={(e) => setProfileData({ ...profileData, bankDetails: { ...profileData.bankDetails, ifsc: e.target.value } })} disabled={!editing} />
                  <InputField label="UPI ID" value={profileData.bankDetails?.upiId || ''} onChange={(e) => setProfileData({ ...profileData, bankDetails: { ...profileData.bankDetails, upiId: e.target.value } })} disabled={!editing} />
                </div>
              </GlassCard>
            )}

            {activeTab === 'documents' && (
              <GlassCard hoverEffect={false} className="p-6 space-y-4">
                <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase">Compliance Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Aadhaar Card Front', url: profileData.documents?.aadhaarFront },
                    { label: 'Aadhaar Card Back', url: profileData.documents?.aadhaarBack },
                    { label: 'PAN Card', url: profileData.documents?.panCard },
                    { label: 'GST Certificate', url: profileData.documents?.gstCertificate },
                    { label: 'Business License', url: profileData.documents?.businessLicense },
                    { label: 'Bank Proof', url: profileData.documents?.bankProof }
                  ].map((doc, idx) => (
                    <div key={idx} className="border border-slate-200 dark:border-slate-800 p-3 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-bold text-xs block text-slate-800 dark:text-slate-100">{doc.label}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{doc.url ? '✓ Attached' : '❌ Not Uploaded'}</span>
                      </div>
                      {doc.url && (
                        <a href={doc.url} target="_blank" rel="noreferrer" className="text-xs text-brand-500 hover:underline font-bold">
                          View
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------
// KYC & VERIFICATION VIEW
// ----------------------------------------------------
export const KYC: React.FC<{ isCompany: boolean; profileData: any; setProfileData: any }> = ({
  isCompany,
  profileData,
  setProfileData
}) => {
  const [kycData, setKycData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);

  const loadKyc = async () => {
    setLoading(true);
    setApiError('');
    try {
      const res = await apiRequest<{ success: boolean; kyc: any }>('/api/service-provider/kyc');
      if (res.success) {
        setKycData(res.kyc);
      }
    } catch (error: any) {
      setApiError(error.message || 'Unable to load KYC application.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKyc();
  }, []);

  const status = kycData?.verificationStatus || 'Not Submitted';
  const globalStatus = status === 'Approved' ? 'Verified' : status === 'Rejected' ? 'Rejected' : status === 'Pending Verification' ? 'Under Review' : 'Not Submitted';

  const documents = [
    { id: 'profilePhoto', name: 'Profile Photo', url: kycData?.profilePhoto, required: true },
    { id: 'aadhaarFront', name: 'Aadhaar Card Front', url: kycData?.aadhaarFront, required: true },
    { id: 'aadhaarBack', name: 'Aadhaar Card Back', url: kycData?.aadhaarBack, required: true },
    { id: 'panCard', name: 'PAN Card', url: kycData?.panCard, required: true },
    { id: 'bankProof', name: 'Bank Passbook / Cancelled Cheque', url: kycData?.bankProof, required: true },
    { id: 'professionalCertificate', name: 'Professional Certificate (Optional)', url: kycData?.professionalCertificate, required: false },
    { id: 'gstCertificate', name: 'GST Certificate (Optional)', url: kycData?.gstCertificate, required: false },
    { id: 'businessRegistration', name: 'Business Registration Certificate (Optional)', url: kycData?.businessRegistration, required: false }
  ];

  const handleFileUpload = async (docId: string, file?: File) => {
    if (!file) return;
    setUploadingDocId(docId);
    setApiError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      await apiRequest(`/api/service-provider/document/${docId}`, {
        method: 'PUT',
        body: formData
      });
      await loadKyc();
    } catch (error: any) {
      setApiError(error.message || 'Document upload failed.');
    } finally {
      setUploadingDocId(null);
    }
  };

  const handleResubmit = async () => {
    setLoading(true);
    setApiError('');
    try {
      await apiRequest('/api/service-provider/kyc/resubmit', { method: 'PUT' });
      await loadKyc();
    } catch (err: any) {
      setApiError(err.message || 'KYC Resubmission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-500/10 rounded-2xl text-brand-500"><Shield className="w-8 h-8" /></div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">KYC & Document Verification</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Live status loaded from MongoDB Service Provider KYC API.</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs uppercase tracking-wide border ${status === 'Approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : status === 'Rejected' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
          <CheckCircle className="w-4 h-4" /> Global Status: {globalStatus}
        </div>
      </div>

      {apiError && <div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-500 text-xs font-semibold">{apiError}</div>}
      {loading && <div className="p-3 rounded-xl border border-brand-500/20 bg-brand-500/10 text-brand-500 text-xs font-semibold">Loading KYC documents...</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold tracking-tight">Compliance Documents Checklist</h2>
          <div className="space-y-3">
            {documents.map((doc) => {
              const hasDoc = !!doc.url;
              return (
                <GlassCard key={doc.id} hoverEffect={false} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">{doc.name}</h3>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {hasDoc ? '✓ Uploaded' : 'Not uploaded'} {doc.required ? '• Required' : ''}
                    </p>
                    {hasDoc && (
                      <div className="flex gap-3 mt-1.5">
                        <a href={doc.url} target="_blank" rel="noreferrer" className="text-[10px] text-brand-500 font-bold hover:underline">
                          Preview
                        </a>
                        <a href={doc.url} download target="_blank" rel="noreferrer" className="text-[10px] text-slate-400 font-bold hover:underline">
                          Download
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${hasDoc ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                      {hasDoc ? 'Uploaded' : 'Pending'}
                    </span>
                    <label className="cursor-pointer text-[10px] py-1.5 px-3 rounded-xl border border-slate-200/50 dark:border-slate-800/60 bg-white/10 font-bold hover:bg-brand-500 hover:text-white transition-all select-none">
                      {uploadingDocId === doc.id ? 'Uploading...' : (hasDoc ? 'Replace Document' : 'Upload')}
                      <input type="file" className="hidden" accept="image/*,.pdf" disabled={uploadingDocId === doc.id} onChange={(e) => handleFileUpload(doc.id, e.target.files?.[0])} />
                    </label>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <GlassCard hoverEffect={false} className="p-6 bg-brand-500/5 border-brand-500/20 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-brand-500 uppercase tracking-wider">KYC Verification Status</h3>
              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-3 text-left">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">STATUS</span>
                  <span className={`text-sm font-bold uppercase ${status === 'Approved' ? 'text-emerald-500' : status === 'Rejected' ? 'text-rose-500' : 'text-amber-500'}`}>
                    {status}
                  </span>
                </div>
                {kycData?.submittedAt && (
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">SUBMITTED DATE</span>
                    <span className="font-semibold">{new Date(kycData.submittedAt).toLocaleDateString()}</span>
                  </div>
                )}
                {kycData?.verifiedAt && (
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">VERIFIED DATE</span>
                    <span className="font-semibold">{new Date(kycData.verifiedAt).toLocaleDateString()}</span>
                  </div>
                )}
                {kycData?.remarks && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs font-semibold leading-relaxed">
                    <span className="text-[9px] block font-bold text-rose-500/60">ADMIN REMARKS</span>
                    {kycData.remarks}
                  </div>
                )}
              </div>
              {status === 'Rejected' && (
                <CustomButton onClick={handleResubmit} variant="primary" className="w-full mt-4 text-xs">
                  Resubmit Application
                </CustomButton>
              )}
            </div>
          </GlassCard>

          <GlassCard hoverEffect={false} className="p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Application Info</h3>
            <div className="text-xs text-slate-500 dark:text-slate-400 space-y-2">
              <p><b>Business Name:</b> {profileData.companyName || '—'}</p>
              <p><b>Owner Name:</b> {profileData.contactPerson || '—'}</p>
              <p><b>Email:</b> {profileData.email || '—'}</p>
              <p><b>Phone:</b> {profileData.phone || '—'}</p>
              <p><b>PAN:</b> {maskValue(profileData.panNumber)}</p>
              <p><b>Aadhaar:</b> {maskValue(profileData.aadhaarNumber)}</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
