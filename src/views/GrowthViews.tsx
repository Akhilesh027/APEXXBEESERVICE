import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wrench, ShieldCheck, IndianRupee, ShieldAlert, Award, Play, AlertTriangle, 
  TrendingUp, Award as BadgeCheck, User, Users, Share2, Clipboard, ArrowRight, 
  Calendar, Check, Settings, Send, Plus, Trash2, Clock, ChevronDown, ChevronRight, Megaphone, Download,
  MessageSquare, Phone
} from 'lucide-react';
import { BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const initialReferrals = [
  {
    id: 'REF-001',
    level: 1,
    name: 'Ramesh Chawla (Electrician)',
    dateJoined: '2026-05-10',
    earningsContributed: 5000,
    referralsCount: 2
  },
  {
    id: 'REF-002',
    level: 1,
    name: 'Suresh Raina (Plumber)',
    dateJoined: '2026-05-15',
    earningsContributed: 2000,
    referralsCount: 0
  },
  {
    id: 'REF-003',
    level: 2,
    name: 'Pooja Hegde (CA Services)',
    dateJoined: '2026-05-20',
    earningsContributed: 1000,
    referralsCount: 0
  },
  {
    id: 'REF-004',
    level: 2,
    name: 'Deepak Sathe (Tutor)',
    dateJoined: '2026-05-22',
    earningsContributed: 500,
    referralsCount: 0
  }
];

const initialTrainingCourses = [
  {
    id: 'CRS-001',
    title: 'Customer Interaction & Professional Etiquette',
    category: 'Etiquette',
    thumbnailUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&auto=format&fit=crop&q=60',
    duration: '2 hours',
    lessonsCount: 8,
    progress: 100
  },
  {
    id: 'CRS-002',
    title: 'Advanced Split AC Installation and Troubleshooting',
    category: 'Technical',
    thumbnailUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=60',
    duration: '4.5 hours',
    lessonsCount: 15,
    progress: 45
  },
  {
    id: 'CRS-003',
    title: 'Workplace Safety & First Aid Protocol',
    category: 'Safety',
    thumbnailUrl: 'https://images.unsplash.com/photo-1598150490541-d4e10ab376d2?w=500&auto=format&fit=crop&q=60',
    duration: '1.5 hours',
    lessonsCount: 5,
    progress: 0
  }
];

const initialAdCampaigns = [
  {
    id: 'CMP-2026-001',
    name: 'Featured AC Technician Listing',
    type: 'Sponsored Card',
    status: 'Active',
    startDate: '2026-06-01',
    endDate: '2026-06-30',
    budget: 10000,
    spent: 4500,
    clicks: 120,
    leadsGenerated: 32
  },
  {
    id: 'CMP-2026-002',
    name: 'Top Electrician Search Visibility',
    type: 'Search Booster',
    status: 'Active',
    startDate: '2026-06-05',
    endDate: '2026-07-05',
    budget: 15000,
    spent: 8200,
    clicks: 250,
    leadsGenerated: 64
  }
];

import { GlassCard } from '../components/GlassCard';
import { CustomButton } from '../components/CustomButton';
import { InputField } from '../components/InputField';
import { Bar, LineChart, Line, Tooltip } from 'recharts';

interface GrowthProps {
  isCompany: boolean;
  spareParts: any[];
  setSpareParts: any;
  kpis: any;
  setKpis: any;
}

// ----------------------------------------------------
// SPARE PARTS MANAGEMENT VIEW
// ----------------------------------------------------
export const SpareParts: React.FC<GrowthProps> = ({ spareParts, setSpareParts }) => {
  const [showAddStockId, setShowAddStockId] = useState<string | null>(null);
  const [stockAddAmount, setStockAddAmount] = useState('');

  const handleAddStock = (id: string) => {
    const amt = Number(stockAddAmount);
    if (isNaN(amt) || amt <= 0) return;

    setSpareParts(spareParts.map(part => {
      if (part.id === id) {
        return { ...part, stock: part.stock + amt };
      }
      return part;
    }));
    setShowAddStockId(null);
    setStockAddAmount('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Spare Parts Inventory</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Monitor stock levels, set reorder points, and log material usage.</p>
        </div>
      </div>

      {/* Warnings */}
      {spareParts.some(p => p.stock <= p.minStock) && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-3xl text-xs font-bold flex items-center gap-2.5">
          <AlertTriangle className="w-5 h-5" /> Warning: Some items have dropped below their minimum stock safety threshold! Re-order now to prevent job delays.
        </div>
      )}

      <div className="glass-panel rounded-3xl overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-450 dark:text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-4">Part ID</th>
                <th className="p-4">Part Name</th>
                <th className="p-4">Part Number</th>
                <th className="p-4">Category</th>
                <th className="p-4">Stock Level</th>
                <th className="p-4">Unit Cost</th>
                <th className="p-4 text-center">Restock Actions</th>
              </tr>
            </thead>
            <tbody>
              {spareParts.map((part) => (
                <tr key={part.id} className="border-b border-slate-205 dark:border-slate-800/40 hover:bg-white/10 dark:hover:bg-slate-950/25 transition-colors">
                  <td className="p-4 font-bold text-slate-455">{part.id}</td>
                  <td className="p-4">
                    <div>
                      <span className="font-extrabold text-slate-800 dark:text-slate-150 block">{part.name}</span>
                      {part.stock <= part.minStock && (
                        <span className="text-[9px] font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded-full uppercase mt-1 inline-block">
                          Low Stock
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-mono font-medium text-slate-500">{part.partNumber}</td>
                  <td className="p-4 font-semibold text-slate-600 dark:text-slate-400">{part.category}</td>
                  <td className="p-4 font-bold">
                    <span className={part.stock <= part.minStock ? 'text-rose-500' : 'text-emerald-500'}>
                      {part.stock}
                    </span>{' '}
                    / {part.minStock} {part.unit}
                  </td>
                  <td className="p-4 font-black">₹{part.pricePerUnit}</td>
                  <td className="p-4">
                    <div className="flex justify-center items-center">
                      {showAddStockId === part.id ? (
                        <div className="flex gap-2 items-center">
                          <input
                            type="number"
                            placeholder="Qty"
                            value={stockAddAmount}
                            onChange={(e) => setStockAddAmount(e.target.value)}
                            className="glass-input py-1 px-2 w-16 bg-white/20 dark:bg-slate-900 text-xs border border-slate-300 dark:border-slate-800"
                          />
                          <button 
                            onClick={() => handleAddStock(part.id)} 
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px]"
                          >
                            Save
                          </button>
                          <button onClick={() => setShowAddStockId(null)} className="text-slate-400">✕</button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => { setShowAddStockId(part.id); setStockAddAmount(''); }} 
                          className="px-3 py-1.5 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-500 hover:bg-brand-500 hover:text-white transition-all font-bold"
                        >
                          Restock
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// REFERRAL PROGRAM VIEW
// ----------------------------------------------------
export const Referral: React.FC = () => {
  const [referrals] = useState(initialReferrals);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Referral Tree & Commissions</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Invite downstream service providers and earn percentage shares of their order revenues.</p>
      </div>

      {/* Shareable Link Box */}
      <GlassCard hoverEffect={false} className="p-5 flex flex-col md:flex-row items-center justify-between gap-4 border-brand-500/20 bg-brand-500/5">
        <div className="space-y-1">
          <h3 className="font-extrabold text-sm text-brand-500">Your Shareable Partner Invite Link</h3>
          <p className="text-[10px] text-slate-400">Earn up to 3% commission on Level 1, 2% on Level 2, and 1% on Level 3 referrals.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <input 
            type="text" 
            readOnly 
            value="https://portal.apexbee.in/partner/register?ref=AMIT99" 
            className="glass-input flex-1 py-1.5 px-3 bg-slate-900 border-slate-800 text-slate-300 text-xs font-mono select-all select-none" 
          />
          <CustomButton onClick={() => alert('Link copied to clipboard!')} className="text-xs px-3.5 whitespace-nowrap">
            Copy Link
          </CustomButton>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Referral Analytics */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-base font-bold tracking-tight">Referral Analytics</h3>
          
          <div className="grid grid-cols-3 gap-3">
            <GlassCard hoverEffect={false} className="p-3 text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400">Level 1</span>
              <h3 className="text-lg font-black mt-1">2 Active</h3>
            </GlassCard>
            <GlassCard hoverEffect={false} className="p-3 text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400">Level 2</span>
              <h3 className="text-lg font-black mt-1">2 Active</h3>
            </GlassCard>
            <GlassCard hoverEffect={false} className="p-3 text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400">Level 3</span>
              <h3 className="text-lg font-black mt-1">1 Pending</h3>
            </GlassCard>
          </div>

          <GlassCard hoverEffect={false} className="p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase">Commission Breakdown</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Level 1 Earnings:</span>
                <span className="font-bold">₹7,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Level 2 Earnings:</span>
                <span className="font-bold">₹1,500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Level 3 Earnings:</span>
                <span className="font-bold">₹0</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-black text-brand-500 text-sm">
                <span>Total Commissions:</span>
                <span>₹8,500</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Referral tree details */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold tracking-tight">Interactive Referral Hierarchy Tree</h3>
          
          <div className="space-y-3">
            {referrals.map((ref) => (
              <GlassCard key={ref.id} hoverEffect={false} className="p-4 text-xs">
                <div 
                  onClick={() => setExpandedId(expandedId === ref.id ? null : ref.id)}
                  className="flex justify-between items-center cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-brand-500/10 text-brand-500 font-bold text-[10px]">
                      L{ref.level}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 dark:text-slate-150">{ref.name}</h4>
                      <span className="text-[9px] text-slate-450 font-medium">Joined: {ref.dateJoined}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 block font-semibold">Commissions</span>
                      <span className="font-bold text-emerald-500">₹{ref.earningsContributed}</span>
                    </div>
                    {ref.referralsCount > 0 ? (
                      expandedId === ref.id ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />
                    ) : <div className="w-4" />}
                  </div>
                </div>

                {/* Level 2 nested items */}
                {expandedId === ref.id && ref.referralsCount > 0 && (
                  <div className="mt-4 pl-6 border-l-2 border-brand-500/20 space-y-3 pt-2">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-850 flex justify-between items-center text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-500 font-bold text-[9px]">L2</span>
                        <span className="font-bold">Pooja Hegde (CA Services)</span>
                      </div>
                      <span className="font-bold text-emerald-500">₹1,000</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-850 flex justify-between items-center text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-500 font-bold text-[9px]">L2</span>
                        <span className="font-bold">Deepak Sathe (Tutor)</span>
                      </div>
                      <span className="font-bold text-emerald-500">₹500</span>
                    </div>
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// TRAINING CENTER VIEW
// ----------------------------------------------------
export const Training: React.FC = () => {
  const [courses] = useState(initialTrainingCourses);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">E-Training Center</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Complete certifications, customer handling courses, and safety programs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <GlassCard key={course.id} className="p-0 overflow-hidden flex flex-col justify-between h-80">
            <div className="relative h-36">
              <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
              <span className="absolute left-4 bottom-3 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-brand-600 text-white tracking-wider">
                {course.category}
              </span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 leading-snug line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-[10px] text-slate-450 font-medium">Duration: {course.duration} • {course.lessonsCount} lessons</p>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-200/50 dark:border-slate-800/40">
                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                  <span>Course Progress:</span>
                  <span>{course.progress}%</span>
                </div>
                
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500" style={{ width: `${course.progress}%` }} />
                </div>

                <div className="flex justify-between items-center pt-2">
                  {course.progress === 100 ? (
                    <button 
                      onClick={() => alert('Certificate PDF generated successfully!')}
                      className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 hover:underline"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Certificate
                    </button>
                  ) : (
                    <button 
                      onClick={() => alert('Launching video course module...')}
                      className="text-[10px] font-bold text-brand-500 flex items-center gap-1 hover:underline"
                    >
                      <Play className="w-3.5 h-3.5" /> Resume Learning
                    </button>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

// ----------------------------------------------------
// ADVERTISEMENT & PROMOTION VIEW
// ----------------------------------------------------
export const AdsPromotion: React.FC = () => {
  const [campaigns] = useState(initialAdCampaigns);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Promotions & Ad Campaigns</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Create featured provider listing campaigns to boost organic leads generation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Metrics */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard hoverEffect={false} className="p-6 bg-brand-500/5 border-brand-500/20 space-y-4">
            <h3 className="text-sm font-bold text-brand-500 uppercase tracking-wider flex items-center gap-1.5">
              <Megaphone className="w-5 h-5" /> Ad Campaign Advisor
            </h3>
            <p className="text-xs leading-relaxed text-slate-650 dark:text-slate-350">
              Service providers can bid budget limits to run sponsored catalog cards on user-facing apps. Leads generate automatically when customers submit booking queries.
            </p>
            <div className="p-3 bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between font-medium">
                <span>Monthly Budget:</span>
                <span className="font-bold">₹25,000</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Spent (June):</span>
                <span className="font-bold">₹12,700</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Campaigns list */}
        <div className="lg:col-span-2">
          <GlassCard hoverEffect={false} className="p-5 space-y-4">
            <h3 className="text-sm font-bold tracking-wider text-slate-450 uppercase">Active Bidding Campaigns</h3>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {campaigns.map((camp) => (
                <div key={camp.id} className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/60 bg-white/20 dark:bg-slate-950/20 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase border ${
                        camp.status === 'Active' 
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                          : 'bg-slate-500/10 text-slate-500 border-slate-550/20'
                      }`}>
                        {camp.status}
                      </span>
                      <span className="text-slate-400 font-medium">{camp.id}</span>
                    </div>
                    <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-2">{camp.name}</h4>
                    <p className="text-[10px] text-slate-450 mt-1">Type: {camp.type} • Active: {camp.startDate} to {camp.endDate}</p>
                    <p className="text-[10px] text-brand-500 font-bold mt-1">Leads Generated: {camp.leadsGenerated} enquiries</p>
                  </div>
                  
                  <div className="text-right">
                    <span className="font-black text-sm block">Spent: ₹{camp.spent}</span>
                    <span className="text-[10px] text-slate-450 block mt-1">Budget: ₹{camp.budget}</span>
                    <span className="text-[10px] text-slate-450 block mt-0.5">Clicks: {camp.clicks} clicks</span>
                  </div>
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
// REPORTS & ANALYTICS VIEW
// ----------------------------------------------------
export const Reports: React.FC = () => {
  const chartData = [
    { name: 'AC Services', revenue: 45000, jobs: 12 },
    { name: 'Electricals', revenue: 32000, jobs: 18 },
    { name: 'RO Purifier', revenue: 18000, jobs: 8 },
    { name: 'Solar', revenue: 65000, jobs: 4 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Reports & Performance Audit</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Export audited balance sheets, job loggers, and customer charts.</p>
        </div>
        <div className="flex gap-2">
          <CustomButton variant="glass" onClick={() => alert('Excel sheet export simulated!')} className="text-xs px-3 py-1.5 border-slate-200 dark:border-slate-850">
            Export Excel
          </CustomButton>
          <CustomButton variant="primary" onClick={() => alert('PDF report download simulated!')} className="text-xs px-3 py-1.5">
            Export PDF
          </CustomButton>
        </div>
      </div>

      <GlassCard hoverEffect={false} className="p-5">
        <h3 className="text-sm font-bold text-slate-400 uppercase mb-6">Revenue & Volume Share by Category</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-850" />
              <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#52525b" radius={[8, 8, 0, 0]} name="Revenue (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

    </div>
  );
};

// ----------------------------------------------------
// SUPPORT CENTER VIEW
// ----------------------------------------------------
export const Support: React.FC = () => {
  const [tickets, setTickets] = useState([
    { id: 'TCK-501', title: 'Condenser Fan Spare Part Refund Delay', status: 'Open', date: '2026-06-12' },
    { id: 'TCK-498', title: 'KYC Address Verification Rejection Enquiry', status: 'Closed', date: '2026-06-08' }
  ]);

  const [newTitle, setNewTitle] = useState('');

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTicket = {
      id: `TCK-${Math.floor(500 + Math.random() * 99)}`,
      title: newTitle,
      status: 'Open',
      date: new Date().toISOString().split('T')[0]
    };

    setTickets([newTicket, ...tickets]);
    setNewTitle('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Support & Ticket Desk</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">File complaints, talk with WhatsApp support, or request call assistance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        {/* Support contacts */}
        <div className="lg:col-span-1 space-y-4">
          <GlassCard hoverEffect={false} className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-450 uppercase">Immediate Channels</h3>
            
            <div className="space-y-2.5">
              <a 
                href="https://wa.me/919999999999" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-3 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 hover:bg-emerald-500/10 transition-all font-bold"
              >
                <MessageSquare className="w-5 h-5" /> Chat via WhatsApp
              </a>
              <a 
                href="tel:+918044332211" 
                className="flex items-center gap-3 p-3 rounded-xl border border-brand-500/20 bg-brand-500/5 text-brand-600 hover:bg-brand-500/10 transition-all font-bold"
              >
                <Phone className="w-5 h-5" /> Call Ecosystem Desk
              </a>
            </div>
          </GlassCard>
        </div>

        {/* Tickets and raising */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard hoverEffect={false} className="p-5 space-y-4">
            <h3 className="text-sm font-bold tracking-wider text-slate-450 uppercase">Create Support Ticket</h3>
            <form onSubmit={handleCreateTicket} className="flex gap-2">
              <InputField
                placeholder="Brief description of the problem..."
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <CustomButton type="submit" variant="primary" className="whitespace-nowrap px-4 py-2 mt-6">
                File Ticket
              </CustomButton>
            </form>
          </GlassCard>

          <GlassCard hoverEffect={false} className="p-5 space-y-4">
            <h3 className="text-sm font-bold tracking-wider text-slate-450 uppercase">Ticket Logs</h3>
            <div className="space-y-3">
              {tickets.map((t) => (
                <div key={t.id} className="p-3.5 rounded-xl border border-slate-200/50 dark:border-slate-800/60 bg-white/20 dark:bg-slate-950/20 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{t.id} • {t.date}</span>
                    <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-1">{t.title}</h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase border ${
                    t.status === 'Open' 
                      ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse' 
                      : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  }`}>
                    {t.status}
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
// NOTIFICATIONS SETTINGS VIEW
// ----------------------------------------------------
export const NotificationsView: React.FC = () => {
  const [channels, setChannels] = useState([
    { id: 'jobs', name: 'New Job Dispatches alerts', sms: true, email: true, push: true },
    { id: 'wallet', name: 'Settlement Clearance & Withdraw Payouts', sms: true, email: false, push: true },
    { id: 'amc', name: 'AMC Expiring Contract Warnings', sms: true, email: true, push: false },
    { id: 'referrals', name: 'Downstream referral commissions alerts', sms: false, email: false, push: true }
  ]);

  const toggleChannel = (idx: number, field: 'sms' | 'email' | 'push') => {
    setChannels(channels.map((chan, i) => {
      if (i === idx) {
        return { ...chan, [field]: !chan[field] };
      }
      return chan;
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Notifications Alerts</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Configure notification alerts channels for SMS, Email, and Push notification triggers.</p>
      </div>

      <GlassCard hoverEffect={false} className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Notification Routing Channels</h3>
        
        <div className="space-y-4 text-xs">
          {channels.map((chan, idx) => (
            <div key={chan.id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-2 border-b border-slate-200/50 dark:border-slate-800/40 last:border-b-0">
              <span className="font-bold text-slate-700 dark:text-slate-350">{chan.name}</span>
              
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 font-semibold text-slate-500 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={chan.sms} 
                    onChange={() => toggleChannel(idx, 'sms')} 
                    className="accent-brand-500 rounded" 
                  /> SMS
                </label>
                <label className="flex items-center gap-2 font-semibold text-slate-500 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={chan.email} 
                    onChange={() => toggleChannel(idx, 'email')} 
                    className="accent-brand-500 rounded" 
                  /> Email
                </label>
                <label className="flex items-center gap-2 font-semibold text-slate-500 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={chan.push} 
                    onChange={() => toggleChannel(idx, 'push')} 
                    className="accent-brand-500 rounded" 
                  /> Mobile Push
                </label>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

// ----------------------------------------------------
// SECURITY SETTINGS VIEW
// ----------------------------------------------------
export const Security: React.FC = () => {
  const [tfaActive, setTfaActive] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [history] = useState([
    { device: 'Windows 11 PC (Chrome browser)', ip: '157.34.122.9', date: '2026-06-14 10:05 AM', location: 'Navi Mumbai, India' },
    { device: 'Android Smartphone (ApexApp)', ip: '223.189.92.51', date: '2026-06-13 04:30 PM', location: 'Mumbai Central, India' }
  ]);

  const handleTfaToggle = () => {
    if (!tfaActive) {
      setShowQr(true);
    } else {
      setTfaActive(false);
    }
  };

  const handleConfirmQr = () => {
    setTfaActive(true);
    setShowQr(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Security & Settings</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Configure password updates, session histories, and Two Factor Authentication.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        {/* TFA settings */}
        <div className="lg:col-span-1 space-y-4">
          <GlassCard hoverEffect={false} className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-450 uppercase">Two-Factor Authentication (2FA)</h3>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-750 dark:text-slate-200 block">Status: {tfaActive ? 'Active' : 'Disabled'}</span>
                <p className="text-[10px] text-slate-400 mt-1">Secure settlement payouts using Google Authenticator codes.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={tfaActive} 
                  onChange={handleTfaToggle} 
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-slate-300 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600" />
              </label>
            </div>

            {/* QR Mock Modal popup */}
            {showQr && (
              <div className="p-4 border rounded-2xl bg-white text-slate-800 text-center space-y-3 border-slate-200">
                <p className="font-bold text-xs text-slate-900">Scan QR Code</p>
                <div className="w-32 h-32 bg-slate-100 border border-slate-200 mx-auto flex items-center justify-center font-mono font-bold text-slate-500 text-xs">
                  [ MOCK QR ]
                </div>
                <p className="text-[10px] text-slate-500">Scan this code in your Authenticator app and enter verification pin below.</p>
                <CustomButton onClick={handleConfirmQr} className="w-full py-1.5 text-[10px]">
                  Confirm Activation
                </CustomButton>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Change password and login history */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard hoverEffect={false} className="p-5 space-y-4">
            <h3 className="text-sm font-bold tracking-wider text-slate-450 uppercase">Update Security Password</h3>
            
            <form onSubmit={(e) => { e.preventDefault(); alert('Password updated successfully!'); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="New Password"
                  required
                  type="password"
                  placeholder="••••••••"
                />
                <InputField
                  label="Confirm New Password"
                  required
                  type="password"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex justify-end">
                <CustomButton type="submit" variant="primary" className="py-2 px-4">
                  Change Password
                </CustomButton>
              </div>
            </form>
          </GlassCard>

          <GlassCard hoverEffect={false} className="p-5 space-y-4">
            <h3 className="text-sm font-bold tracking-wider text-slate-450 uppercase">Session Login History</h3>
            <div className="space-y-3">
              {history.map((h, i) => (
                <div key={i} className="p-3 rounded-xl border border-slate-205 dark:border-slate-800/60 bg-white/20 dark:bg-slate-950/20 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">{h.device}</h4>
                    <span className="text-[9px] text-slate-400 font-medium block mt-0.5">IP Address: {h.ip} • 📍 {h.location}</span>
                  </div>
                  <span className="text-[9px] font-semibold text-slate-450">{h.date}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
