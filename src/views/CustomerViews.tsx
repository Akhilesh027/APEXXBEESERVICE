import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Star, ShieldAlert, Plus, Check, Trash, MapPin, Phone, 
  CheckCircle, Truck, Package, Clock, ShieldCheck
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { CustomButton } from '../components/CustomButton';
import { InputField } from '../components/InputField';

interface CustomerViewsProps {
  isCompany: boolean;
  teamMembers: any[];
  setTeamMembers: any;
  deliveryRequests: any[];
  setDeliveryRequests: any;
}

const initialCustomers = [
  { id: 'CUS-001', name: 'Amit Patel', email: 'amit.patel@example.com', phone: '9876543210', city: 'Mumbai', jobsCount: 4, totalSpent: 18000, isAMCCustomer: true, status: 'Active' },
  { id: 'CUS-002', name: 'Priya Sharma', email: 'priya.sharma@example.com', phone: '9123456789', city: 'Bangalore', jobsCount: 2, totalSpent: 7000, isAMCCustomer: false, status: 'Active' },
  { id: 'CUS-003', name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '9812739812', city: 'Delhi NCR', jobsCount: 1, totalSpent: 3500, isAMCCustomer: false, status: 'Inactive' }
];

const initialReviews = [
  { id: 'RVW-001', customerName: 'Amit Patel', rating: 5, comment: 'Excellent service! The technician was very professional and fixed the AC perfectly.', date: '2026-06-14', serviceName: 'AC Deep Cleaning', response: '' },
  { id: 'RVW-002', customerName: 'Priya Sharma', rating: 4, comment: 'Good work, arrived on time. Minor issue with cleanup after the job.', date: '2026-06-13', serviceName: 'RO Filter Service', response: '' },
  { id: 'RVW-003', customerName: 'Rajesh Kumar', rating: 3, comment: 'Service was okay but took longer than expected.', date: '2026-06-12', serviceName: 'Ceiling Fan Install', response: '' }
];

// ----------------------------------------------------
// CUSTOMER MANAGEMENT VIEW
// ----------------------------------------------------
export const Customers: React.FC = () => {
  const [customers] = useState(initialCustomers);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Customer Database</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">View customer ledger, spending history, and service contracts.</p>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-450 dark:text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-4">Customer ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">City</th>
                <th className="p-4">Jobs Placed</th>
                <th className="p-4">Total Spending</th>
                <th className="p-4">AMC Member</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((cust) => (
                <tr key={cust.id} className="border-b border-slate-205 dark:border-slate-800/40 hover:bg-white/10 dark:hover:bg-slate-950/25 transition-colors">
                  <td className="p-4 font-bold text-slate-450">{cust.id}</td>
                  <td className="p-4 font-extrabold text-slate-800 dark:text-slate-150">{cust.name}</td>
                  <td className="p-4 font-semibold text-slate-550 dark:text-slate-400">{cust.email}</td>
                  <td className="p-4 font-medium">{cust.city}</td>
                  <td className="p-4 font-bold text-center">{cust.jobsCount}</td>
                  <td className="p-4 font-black text-brand-500">₹{cust.totalSpent.toLocaleString('en-IN')}</td>
                  <td className="p-4">
                    {cust.isAMCCustomer ? (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        Yes (Active)
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px] font-medium">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide border ${
                      cust.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : 'bg-slate-500/10 text-slate-500 border-slate-550/20'
                    }`}>
                      {cust.status}
                    </span>
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
// RATINGS & REVIEWS VIEW
// ----------------------------------------------------
export const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState(initialReviews);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const handleSendReply = (revId: string) => {
    if (!replyText[revId]?.trim()) return;
    
    setReviews(reviews.map(rev => {
      if (rev.id === revId) {
        return { ...rev, response: replyText[revId] };
      }
      return rev;
    }));
    setActiveReplyId(null);
  };

  const handleReplyChange = (revId: string, text: string) => {
    setReplyText({
      ...replyText,
      [revId]: text
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Ratings & Feedback</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Monitor consumer ratings, reviews, and post replies.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rating Metrics Card */}
        <div className="lg:col-span-1">
          <GlassCard hoverEffect={false} className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Rating Audit</h3>
            
            <div className="text-center py-6">
              <h2 className="text-5xl font-black text-slate-800 dark:text-slate-50">4.85</h2>
              <div className="flex justify-center gap-1 mt-2 text-amber-500 text-lg">
                ★★★★★
              </div>
              <span className="text-[10px] text-slate-450 font-bold block mt-1.5">Based on 142 bookings</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-12 font-bold">5 Stars</span>
                <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500" style={{ width: '85%' }} />
                </div>
                <span className="w-8 text-right font-bold">85%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 font-bold">4 Stars</span>
                <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500" style={{ width: '10%' }} />
                </div>
                <span className="w-8 text-right font-bold">10%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 font-bold">3 Stars</span>
                <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500" style={{ width: '3%' }} />
                </div>
                <span className="w-8 text-right font-bold">3%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 font-bold">2 Stars</span>
                <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500" style={{ width: '1%' }} />
                </div>
                <span className="w-8 text-right font-bold">1%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 font-bold">1 Star</span>
                <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500" style={{ width: '1%' }} />
                </div>
                <span className="w-8 text-right font-bold">1%</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Reviews Listing */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold tracking-tight">Recent Customer Feedback</h3>
          
          <div className="space-y-4">
            {reviews.map((rev) => (
              <GlassCard key={rev.id} hoverEffect={false} className="p-5 space-y-3.5 text-xs border-slate-200/50 dark:border-slate-850">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-slate-800 dark:text-slate-150">{rev.customerName}</h4>
                    <span className="text-[10px] text-brand-500 font-bold block mt-0.5">{rev.serviceName}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-amber-500 font-bold">
                      {'★'.repeat(rev.rating)}
                    </div>
                    <span className="text-[9px] text-slate-400 font-medium block mt-1">Reviewed on: {rev.date}</span>
                  </div>
                </div>

                <p className="text-slate-650 dark:text-slate-350 leading-relaxed italic">
                  "{rev.comment}"
                </p>

                {rev.response ? (
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950/40 mt-3.5">
                    <span className="font-bold text-brand-500 uppercase text-[9px] block">Your Reply:</span>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">{rev.response}</p>
                  </div>
                ) : (
                  <div className="pt-2">
                    {activeReplyId === rev.id ? (
                      <div className="space-y-2">
                        <textarea
                          placeholder="Type your response to the review..."
                          value={replyText[rev.id] || ''}
                          onChange={(e) => handleReplyChange(rev.id, e.target.value)}
                          className="glass-input w-full bg-slate-50 dark:bg-slate-950/40 p-2.5 h-20 text-xs border border-slate-250 dark:border-slate-850 rounded-xl"
                        />
                        <div className="flex justify-end gap-2">
                          <CustomButton variant="ghost" onClick={() => setActiveReplyId(null)} className="py-1 px-3 text-[10px]">
                            Cancel
                          </CustomButton>
                          <CustomButton variant="primary" onClick={() => handleSendReply(rev.id)} className="py-1 px-3 text-[10px]">
                            Send Reply
                          </CustomButton>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setActiveReplyId(rev.id)} 
                        className="text-[10px] font-bold text-brand-500 hover:underline"
                      >
                        Reply to Review
                      </button>
                    )}
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
// TEAM MANAGEMENT VIEW
// ----------------------------------------------------
export const TeamManagement: React.FC<CustomerViewsProps> = ({ 
  isCompany, 
  teamMembers, 
  setTeamMembers 
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'Technician' | 'Helper' | 'Supervisor'>('Technician');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');

  if (!isCompany) {
    return (
      <GlassCard hoverEffect={false} className="p-8 text-center flex flex-col items-center justify-center border-dashed border-2 border-slate-300 dark:border-slate-800">
        <ShieldAlert className="w-16 h-16 text-rose-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Feature Restricted</h2>
        <p className="text-slate-400 text-sm max-w-md mb-6">
          Team Management and staff dispatch boards are premium corporate module assets. Upgrade your partner profile type to Company / Agency Service Provider to register staff accounts.
        </p>
      </GlassCard>
    );
  }

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    const newMember = {
      id: `TM-${Math.floor(100 + Math.random() * 900)}`,
      name: newName,
      role: newRole,
      phone: newPhone,
      email: newEmail,
      status: 'Active' as const,
      attendanceToday: 'Present' as const,
      rating: 5.0,
      jobsCompleted: 0
    };
    setTeamMembers([...teamMembers, newMember]);
    setShowAddModal(false);
    
    // Reset Form
    setNewName('');
    setNewPhone('');
    setNewEmail('');
  };

  const handleDeleteMember = (id: string) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Staff & Technicians</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Track technician schedules, attendance, and dispatch assignments.</p>
        </div>
        <CustomButton variant="primary" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" /> Add Team Member
        </CustomButton>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-450 dark:text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-4">Staff ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Role</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Attendance Today</th>
                <th className="p-4">Jobs Done</th>
                <th className="p-4">Rating</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member.id} className="border-b border-slate-205 dark:border-slate-800/40 hover:bg-white/10 dark:hover:bg-slate-950/25 transition-colors">
                  <td className="p-4 font-bold text-slate-450">{member.id}</td>
                  <td className="p-4">
                    <div>
                      <span className="font-extrabold text-slate-850 dark:text-slate-100 block">{member.name}</span>
                      <span className="text-[10px] text-slate-450 font-medium">{member.email}</span>
                    </div>
                  </td>
                  <td className="p-4 font-bold">{member.role}</td>
                  <td className="p-4 font-medium text-slate-600 dark:text-slate-350">{member.phone}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                      member.attendanceToday === 'Present'
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : member.attendanceToday === 'On Leave'
                        ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                        : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                    }`}>
                      {member.attendanceToday}
                    </span>
                  </td>
                  <td className="p-4 text-center font-bold">{member.jobsCompleted}</td>
                  <td className="p-4 font-extrabold text-amber-500">{member.rating} ★</td>
                  <td className="p-4">
                    <div className="flex items-center justify-center">
                      <button 
                        onClick={() => handleDeleteMember(member.id)} 
                        className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Team Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <GlassCard hoverEffect={false} className="border-slate-800 bg-slate-900 text-white p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="text-base font-bold">Register Team Member</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-200">
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddMember} className="space-y-4 text-xs">
                <InputField
                  label="Technician Full Name"
                  required
                  placeholder="e.g. Ramesh Pujari"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="dark"
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-350">Ecosystem Role</label>
                  <select
                    value={newRole}
                    onChange={(e: any) => setNewRole(e.target.value)}
                    className="glass-input dark bg-slate-900 border-slate-800 text-white"
                  >
                    <option value="Technician">Technician</option>
                    <option value="Helper">Helper</option>
                    <option value="Supervisor">Supervisor</option>
                  </select>
                </div>

                <InputField
                  label="Phone Number"
                  required
                  placeholder="+91 99001 12233"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="dark"
                />

                <InputField
                  label="Corporate Email"
                  required
                  type="email"
                  placeholder="ramesh.p@apexbee.in"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="dark"
                />

                <CustomButton type="submit" variant="primary" className="w-full py-2.5">
                  Register Staff Account
                </CustomButton>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------
// DELIVERY & MATERIAL PICKUP VIEW
// ----------------------------------------------------
export const DeliveryPickup: React.FC<CustomerViewsProps> = ({ 
  deliveryRequests, 
  setDeliveryRequests 
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Delivery & Pickup Tracking</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Track spare parts courier pickups from ApexBee hubs to site locations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hub delivery warning notice */}
        <div className="lg:col-span-1">
          <GlassCard hoverEffect={false} className="p-6 bg-brand-500/5 border-brand-500/20 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-brand-500 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-5 h-5" /> Logistics Network
              </h3>
              <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed">
                ApexBee runs a closed logistics courier mesh across metro centers (Mumbai, Bengaluru, Pune). Service partners can request pickup of heavy equipment and compressors.
              </p>
              <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-semibold">
                * Couriers are dispatched automatically when quote materials are approved by customers.
              </p>
            </div>
            
            <div className="mt-8 pt-4 border-t border-brand-500/10 text-slate-450 text-[10px] font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-500" /> ApexBee Logistics Verified
            </div>
          </GlassCard>
        </div>

        {/* Requests Tracker */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold tracking-tight">Material Delivery Log</h3>
          
          <div className="space-y-3">
            {deliveryRequests.map((del) => (
              <GlassCard key={del.id} hoverEffect={false} className="p-4 border-slate-200 dark:border-slate-850 text-xs">
                <div className="flex justify-between items-start flex-col md:flex-row gap-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase border ${
                        del.status === 'Completed' 
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : del.status === 'In Transit'
                          ? 'bg-purple-500/10 text-purple-500 border-purple-500/20 animate-pulse'
                          : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                      }`}>
                        {del.status}
                      </span>
                      <span className="text-slate-400 font-bold uppercase">{del.type} • {del.id}</span>
                    </div>

                    <h4 className="font-extrabold text-slate-800 dark:text-slate-250 mt-2">
                      {del.itemDescription}
                    </h4>
                    
                    <p className="text-[10px] text-slate-500 mt-2">
                      <span className="font-bold">From:</span> {del.fromAddress}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      <span className="font-bold">To:</span> {del.toAddress}
                    </p>
                  </div>
                  
                  <div className="text-left md:text-right shrink-0 border-t md:border-t-0 pt-2 md:pt-0">
                    <span className="text-[10px] text-slate-450 font-bold block">Rider:</span>
                    <span className="font-bold block mt-0.5">{del.assignedPartner}</span>
                    <span className="text-[10px] text-slate-400 font-medium block mt-0.5">📞 {del.partnerPhone}</span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
