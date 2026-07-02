import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  IndianRupee, CreditCard, Send, Plus, ArrowUpRight, ArrowDownLeft, FileText, 
  Download, Printer, AlertTriangle, ShieldCheck, CheckCircle2, RefreshCw, Eye
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { CustomButton } from '../components/CustomButton';
import { InputField } from '../components/InputField';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

interface FinancialProps {
  isCompany: boolean;
  kpis: any;
  setKpis: any;
  amcs: any[];
  setAmcs: any;
  profileData: any;
  refreshData?: () => void;
}

const initialQuotes = [
  {
    id: 'QT-2026-001',
    customerName: 'Amit Patel',
    phone: '9876543210',
    email: 'amit.patel@example.com',
    location: 'Mumbai, Maharashtra',
    date: '2026-06-12',
    validUntil: '2026-06-27',
    status: 'approved',
    subtotal: 3814,
    gst: 686,
    total: 4500,
    items: [
      { description: 'AC Repair & Servicing', quantity: 1, rate: 2500, amount: 2500 },
      { description: 'Copper Pipe Replacement (meters)', quantity: 2, rate: 1000, amount: 2000 }
    ]
  },
  {
    id: 'QT-2026-002',
    customerName: 'Priya Sharma',
    phone: '9123456789',
    email: 'priya.sharma@example.com',
    location: 'Bangalore, Karnataka',
    date: '2026-06-13',
    validUntil: '2026-06-28',
    status: 'sent',
    subtotal: 2966,
    gst: 534,
    total: 3500,
    items: [
      { description: 'Bathroom Fitting & Plumbing', quantity: 1, rate: 3500, amount: 3500 }
    ]
  },
  {
    id: 'QT-2026-003',
    customerName: 'Rajesh Kumar',
    phone: '9812739812',
    email: 'rajesh@example.com',
    location: 'Delhi NCR',
    date: '2026-06-14',
    validUntil: '2026-06-29',
    status: 'declined',
    subtotal: 10169,
    gst: 1831,
    total: 12000,
    items: [
      { description: 'Entire Flat Painting Labor', quantity: 1, rate: 12000, amount: 12000 }
    ]
  }
];

// ----------------------------------------------------
// QUOTES & ESTIMATES VIEW
// ----------------------------------------------------
export const Quotes: React.FC<FinancialProps> = ({ profileData }) => {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activePreviewQuote, setActivePreviewQuote] = useState<typeof initialQuotes[0] | null>(null);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [items, setItems] = useState([{ description: '', quantity: 1, rate: 0 }]);

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, rate: 0 }]);
  };

  const handleRemoveItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx: number, field: string, val: any) => {
    setItems(items.map((item, i) => {
      if (i === idx) {
        return { ...item, [field]: val };
      }
      return item;
    }));
  };

  const handleCreateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculations
    const quoteItems = items.map(item => ({
      description: item.description,
      quantity: Number(item.quantity),
      rate: Number(item.rate),
      amount: Number(item.quantity) * Number(item.rate)
    }));

    const subtotal = quoteItems.reduce((acc, curr) => acc + curr.amount, 0);
    const gst = Math.round(subtotal * 0.18); // 18% GST
    const discount = 0;
    const total = subtotal + gst - discount;

    const newQuote = {
      id: `QT-${Math.floor(800 + Math.random() * 200)}`,
      customerName,
      phone,
      email,
      location,
      date: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: quoteItems,
      subtotal,
      gst,
      discount,
      total,
      status: 'pending' as const
    };

    setQuotes([newQuote, ...quotes]);
    setShowCreateModal(false);
    
    // Reset form
    setCustomerName('');
    setPhone('');
    setEmail('');
    setLocation('');
    setItems([{ description: '', quantity: 1, rate: 0 }]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Quotes & Estimates</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Generate commercial estimates, calculate GST, and issue invoices.</p>
        </div>
        <CustomButton variant="primary" onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4" /> Create Estimate
        </CustomButton>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-450 dark:text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-4">Quote ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date</th>
                <th className="p-4">Subtotal</th>
                <th className="p-4">GST (18%)</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Invoice View</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <tr key={q.id} className="border-b border-slate-205 dark:border-slate-800/40 hover:bg-white/10 dark:hover:bg-slate-950/25 transition-colors">
                  <td className="p-4 font-bold text-slate-450">{q.id}</td>
                  <td className="p-4">
                    <div>
                      <span className="font-extrabold text-slate-800 dark:text-slate-150 block">{q.customerName}</span>
                      <span className="text-[10px] text-slate-450 font-medium">{q.location}</span>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-slate-650 dark:text-slate-350">{q.date}</td>
                  <td className="p-4">₹{q.subtotal.toLocaleString('en-IN')}</td>
                  <td className="p-4">₹{q.gst.toLocaleString('en-IN')}</td>
                  <td className="p-4 font-black text-brand-500">₹{q.total.toLocaleString('en-IN')}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide border ${
                      q.status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : q.status === 'rejected'
                        ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                        : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                    }`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center">
                      <button 
                        onClick={() => setActivePreviewQuote(q)} 
                        className="p-1.5 rounded-lg border border-slate-200/50 dark:border-slate-850 hover:bg-brand-500 hover:text-white transition-all text-slate-400"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Estimate Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl max-h-[85vh] overflow-y-auto"
          >
            <GlassCard hoverEffect={false} className="border-slate-800 bg-slate-900 text-white p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="text-base font-bold">Generate Commercial Estimate</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-200">
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateQuote} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Customer Name"
                    required
                    placeholder="e.g. Reliance Retail Office"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="dark text-xs"
                  />
                  <InputField
                    label="Location / Address"
                    required
                    placeholder="e.g. Khar West, Mumbai"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="dark text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Phone Number"
                    type="tel"
                    required
                    placeholder="+91 99887 76655"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="dark text-xs"
                  />
                  <InputField
                    label="Email (Optional)"
                    type="email"
                    placeholder="billing@customer.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="dark text-xs"
                  />
                </div>

                {/* Line Items */}
                <div className="border-t border-slate-800 pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-300">Quote Line Items (Services & Materials)</h4>
                    <button 
                      type="button" 
                      onClick={handleAddItem}
                      className="text-brand-400 font-bold flex items-center gap-1 hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Item
                    </button>
                  </div>

                  {items.map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-end">
                      <div className="flex-1">
                        <InputField
                          label="Description"
                          required
                          placeholder="e.g. Copper piping repair"
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          className="dark text-xs"
                        />
                      </div>
                      <div className="w-16">
                        <InputField
                          label="Qty"
                          type="number"
                          required
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          className="dark text-xs"
                        />
                      </div>
                      <div className="w-24">
                        <InputField
                          label="Rate (₹)"
                          type="number"
                          required
                          value={item.rate}
                          onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                          className="dark text-xs"
                        />
                      </div>
                      {items.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveItem(idx)}
                          className="p-3 mb-1 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex justify-between items-center text-slate-300 text-xs">
                  <span>* 18% GST is automatically calculated on subtotal value.</span>
                </div>

                <CustomButton type="submit" variant="primary" className="w-full py-2.5">
                  Generate & Send Quote
                </CustomButton>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      )}

      {/* Invoice PDF Preview Modal */}
      {activePreviewQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <GlassCard hoverEffect={false} className="bg-white text-slate-800 p-8 shadow-2xl space-y-6 relative border-none">
              
              {/* Close Button */}
              <button 
                onClick={() => setActivePreviewQuote(null)} 
                className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-all"
              >
                ✕
              </button>

              {/* Invoice Layout Header */}
              <div className="flex justify-between items-start border-b pb-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    {profileData.isCompany ? profileData.companyName : profileData.contactPerson}
                  </h2>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {profileData.isCompany ? 'Registered Corporate Partner' : 'Certified Service Professional'}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">📧 {profileData.email} • 📞 {profileData.phone}</p>
                  {profileData.gstNumber && <p className="text-[10px] text-slate-500 font-bold mt-0.5">GSTIN: {profileData.gstNumber}</p>}
                </div>
                
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-300 uppercase tracking-widest block">ESTIMATE</span>
                  <span className="text-xs font-bold text-slate-600 mt-1 block">Reference: {activePreviewQuote.id}</span>
                  <span className="text-[10px] text-slate-450 mt-0.5 block">Date: {activePreviewQuote.date}</span>
                </div>
              </div>

              {/* Billing Info */}
              <div className="grid grid-cols-2 gap-6 text-[11px] border-b pb-6">
                <div>
                  <span className="font-bold text-slate-400 uppercase text-[9px] block">Billed To:</span>
                  <span className="font-extrabold text-slate-800 text-xs mt-1 block">{activePreviewQuote.customerName}</span>
                  <span className="text-slate-500 mt-0.5 block">📍 {activePreviewQuote.location}</span>
                  {activePreviewQuote.email && <span className="text-slate-500 mt-0.5 block">📧 {activePreviewQuote.email}</span>}
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-400 uppercase text-[9px] block">Settlement Route:</span>
                  <span className="font-semibold text-slate-600 mt-1 block">ApexBee Ecosystem Clearing</span>
                  <span className="text-slate-400 mt-0.5 block">Validity: Valid till {activePreviewQuote.validUntil}</span>
                </div>
              </div>

              {/* Table of items */}
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="border-b font-bold text-slate-400 uppercase text-[9px]">
                    <th className="py-2.5">Description</th>
                    <th className="py-2.5 text-center w-16">Qty</th>
                    <th className="py-2.5 text-right w-24">Rate (INR)</th>
                    <th className="py-2.5 text-right w-24">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  {activePreviewQuote.items.map((item, i) => (
                    <tr key={i} className="border-b last:border-b-0 font-medium">
                      <td className="py-2.5 text-slate-700">{item.description}</td>
                      <td className="py-2.5 text-center">{item.quantity}</td>
                      <td className="py-2.5 text-right">₹{item.rate.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 text-right font-bold">₹{item.amount.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Invoice summary calculations */}
              <div className="flex justify-end pt-4 border-t">
                <div className="w-64 space-y-2 text-[11px]">
                  <div className="flex justify-between font-medium text-slate-600">
                    <span>Subtotal:</span>
                    <span>₹{activePreviewQuote.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-medium text-slate-600">
                    <span>GST (18%):</span>
                    <span>₹{activePreviewQuote.gst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-slate-900 border-t pt-2 text-xs">
                    <span>Grand Total:</span>
                    <span>₹{activePreviewQuote.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Footer Terms */}
              <div className="text-[9px] text-slate-450 leading-relaxed border-t pt-6">
                <p className="font-bold mb-1">Terms & Conditions:</p>
                <p>1. This is a computer generated commercial quote issued via ApexBee service gateway.</p>
                <p>2. Final billing might fluctuate by ±10% based on physical inspection of site and additional material requirement.</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <CustomButton 
                  variant="secondary" 
                  onClick={() => alert('PDF download simulated successfully!')} 
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-750 font-bold border-none"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </CustomButton>
                <CustomButton 
                  variant="primary" 
                  onClick={() => window.print()} 
                  className="flex-1"
                >
                  <Printer className="w-4 h-4" /> Print Invoice
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
// WALLET VIEW
// ----------------------------------------------------
export const WalletView: React.FC<FinancialProps> = ({ kpis, refreshData }) => {
  const [ledger, setLedger] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWallet = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://server.apexbee.in/api/wallet/my-wallet", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setLedger(data.wallet?.ledgerEntries || []);
      }
    } catch (err) {
      console.error("Failed to fetch wallet:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchWallet();
  }, []);

  // Reconstruct balance movement trend dynamically
  let runningBalance = kpis.walletBalance;
  const trendData = [...ledger]
    .reverse()
    .map((entry, idx) => {
      const dateLabel = entry.createdAt
        ? new Date(entry.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
        : `Pt ${idx + 1}`;
      if (entry.type === "credit") {
        runningBalance += entry.amount;
      } else {
        runningBalance -= entry.amount;
      }
      return {
        name: dateLabel,
        balance: runningBalance
      };
    });

  const walletHistory = trendData.length > 0 ? trendData : [
    { name: 'Today', balance: kpis.walletBalance }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">E-Wallet &amp; Ledger</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Track payouts, customer credits, and withdraw balances.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left balance display */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard hoverEffect={false} className="bg-gradient-to-br from-slate-900 via-slate-950 to-brand-950/20 border-slate-850 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-brand-500/5 blur-2xl -z-10" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-450 block">Available Balance</span>
            <span className="text-4xl font-black text-white mt-2 block tracking-tight">₹{kpis.walletBalance.toLocaleString('en-IN')}</span>
            
            <div className="mt-6 pt-6 border-t border-slate-850 flex gap-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Hold Earnings</span>
                <span className="text-slate-300 font-extrabold mt-1 block">₹{kpis.pendingEarnings.toLocaleString('en-IN')}</span>
              </div>
              <div className="border-l border-slate-850 pl-4">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Payout Cycle</span>
                <span className="text-slate-350 font-semibold mt-1 block">Instant Settlement</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Balance Trend Area Chart */}
        <GlassCard hoverEffect={false} className="lg:col-span-2 p-5">
          <h3 className="text-sm font-bold text-slate-450 uppercase mb-4">Balance Movement Trend</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={walletHistory}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#71717a" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#71717a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800/40" />
                <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="balance" stroke="#27272a" strokeWidth={2.5} fillOpacity={1} fill="url(#colorBalance)" name="Balance (₹)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

      </div>

      {/* Transaction History Log */}
      <div>
        <h3 className="text-base font-bold tracking-tight mb-4">Transaction History</h3>
        
        <div className="glass-panel rounded-3xl overflow-hidden text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-450 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4">Txn ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Flow</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">Loading ledger entries...</td>
                  </tr>
                ) : ledger.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">No transactions recorded.</td>
                  </tr>
                ) : (
                  ledger.map((txn) => (
                    <tr key={txn._id || txn.transactionId} className="border-b border-slate-205 dark:border-slate-800/40 hover:bg-white/10 dark:hover:bg-slate-950/25 transition-colors">
                      <td className="p-4 font-bold text-slate-450">{txn.transactionId}</td>
                      <td className="p-4 font-semibold text-slate-650 dark:text-slate-350">
                        {txn.createdAt ? new Date(txn.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "2-digit", day: "2-digit" }) : ""}
                      </td>
                      <td className="p-4 text-slate-850 dark:text-slate-200 font-semibold">{txn.remarks || txn.description}</td>
                      <td className="p-4 capitalize font-semibold">{txn.category}</td>
                      <td className="p-4">
                        {txn.type === 'credit' ? (
                          <span className="flex items-center gap-1 text-emerald-500 font-bold">
                            <ArrowDownLeft className="w-3.5 h-3.5" /> Inflow
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-rose-500 font-bold">
                            <ArrowUpRight className="w-3.5 h-3.5" /> Outflow
                          </span>
                        )}
                      </td>
                      <td className={`p-4 font-black ${txn.type === 'credit' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {txn.type === 'credit' ? '+' : '-'} ₹{txn.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide border ${
                          txn.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                            : txn.status === 'failed' || txn.status === 'rejected'
                            ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                            : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                        }`}>
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// WITHDRAWALS VIEW
// ----------------------------------------------------
export const Withdrawals: React.FC<FinancialProps> = ({ kpis, setKpis, refreshData }) => {
  const [method, setMethod] = useState<'upi' | 'bank'>('bank');
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [withdrawHistory, setWithdrawHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://server.apexbee.in/api/wallet/withdrawals", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setWithdrawHistory(data.withdrawals || []);
      }
    } catch (err) {
      console.error("Failed to load withdrawals:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchHistory();
  }, []);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmt = Number(amount);
    
    if (withdrawAmt > kpis.walletBalance) {
      alert("Withdrawal amount cannot exceed available wallet balance.");
      return;
    }

    try {
      const res = await fetch("https://server.apexbee.in/api/wallet/withdrawals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          amount: withdrawAmt,
          note: method === 'upi' ? `UPI Address: ${upiId}` : 'Bank Account Settlement Request',
          feePercent: 15
        })
      });
      if (res.ok) {
        setSuccess(`Withdrawal request for ₹${withdrawAmt} submitted successfully!`);
        setAmount('');
        setUpiId('');
        fetchHistory();
        if (refreshData) refreshData();
        setTimeout(() => setSuccess(''), 5000);
      } else {
        const data = await res.json();
        alert(data.message || "Withdrawal request failed");
      }
    } catch (err) {
      console.error("Withdraw error:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Withdrawal &amp; Settlements</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Transfer your available wallet balance directly to your bank account or UPI ID.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form panel */}
        <div className="lg:col-span-1">
          <GlassCard hoverEffect={false} className="p-6 space-y-4">
            <h3 className="text-sm font-bold tracking-wider text-slate-450 uppercase mb-2">Request Settlement</h3>
            
            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> {success}
              </div>
            )}

            {/* Type selector */}
            <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/50 dark:border-slate-850">
              <button 
                onClick={() => setMethod('bank')} 
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  method === 'bank' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-450 hover:text-slate-700'
                }`}
              >
                🏦 Bank Account
              </button>
              <button 
                onClick={() => setMethod('upi')} 
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  method === 'upi' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-450 hover:text-slate-700'
                }`}
              >
                📱 UPI Address
              </button>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-4">
              <InputField
                label="Transfer Amount (INR)"
                type="number"
                required
                min={500}
                placeholder="Min: ₹500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                helperText={`Max: ₹${kpis.walletBalance.toLocaleString('en-IN')}`}
              />

              {method === 'upi' ? (
                <InputField
                  label="UPI Address (VPA)"
                  required
                  placeholder="e.g. amit@okhdfcbank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              ) : (
                <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-xl text-[11px] space-y-1 text-slate-500 dark:text-slate-400">
                  <p className="font-bold text-slate-650 dark:text-slate-350">Default Verified Account:</p>
                  <p>HDFC Bank • A/c ...5678</p>
                  <p>IFSC: HDFC0000291</p>
                </div>
              )}

              <CustomButton type="submit" variant="primary" className="w-full py-2.5">
                Submit Settlement
              </CustomButton>
            </form>
          </GlassCard>
        </div>

        {/* History panel */}
        <div className="lg:col-span-2">
          <GlassCard hoverEffect={false} className="p-5 h-full space-y-4">
            <h3 className="text-sm font-bold tracking-wider text-slate-450 uppercase">Settlement Ledger Log</h3>
            
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {loading ? (
                <p className="text-xs text-slate-400">Loading settlement history...</p>
              ) : withdrawHistory.length === 0 ? (
                <p className="text-xs text-slate-400">No settlement requests placed.</p>
              ) : (
                withdrawHistory.map((w) => (
                  <div key={w._id || w.id} className="p-3.5 rounded-xl border border-slate-200/50 dark:border-slate-800/60 bg-white/20 dark:bg-slate-950/20 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase border ${
                          w.status === 'Approved' || w.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                            : w.status === 'Rejected' || w.status === 'rejected'
                            ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                            : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                        }`}>
                          {w.status}
                        </span>
                        <span className="text-slate-400 font-medium">{String(w._id || w.id).substring(18)}</span>
                      </div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 mt-2">{w.note || 'Manual Settlement'}</p>
                      <span className="text-[10px] text-slate-450 font-medium block mt-0.5">
                        Submitted: {w.createdAt ? new Date(w.createdAt).toLocaleDateString("en-IN") : ""}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-sm block">₹{w.amount.toLocaleString('en-IN')}</span>
                      <span className="text-[9px] text-slate-400 font-medium block mt-0.5">Net: ₹{(w.netAmount || w.amount).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// AMC MANAGEMENT VIEW
// ----------------------------------------------------
export const AMCManagement: React.FC<FinancialProps> = ({ amcs, setAmcs }) => {
  const [showAddPlan, setShowAddPlan] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">AMC Contracts (Annual Contracts)</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Manage annual service plans, renewals, scheduler, and contract revenues.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AMC Overview */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard hoverEffect={false} className="p-5 bg-gradient-to-br from-indigo-600/10 to-brand-600/10 border-brand-500/20 space-y-4">
            <h3 className="text-sm font-bold text-brand-500 uppercase tracking-wider">AMC System Advisory</h3>
            <p className="text-xs leading-relaxed text-slate-650 dark:text-slate-350">
              AMCs represent standard annual contracts generating recurring maintenance revenue streams. ApexBee handles automatic credit billing and renewal schedules. 
            </p>
            <div className="p-3 bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between font-medium">
                <span>Active AMCs:</span>
                <span className="font-bold">24 contracts</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>AMC Monthly Value:</span>
                <span className="font-bold">₹38,000 / mo</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Active Contracts Table */}
        <div className="lg:col-span-2">
          <GlassCard hoverEffect={false} className="p-5 space-y-4">
            <h3 className="text-sm font-bold tracking-wider text-slate-450 uppercase">Active AMC Contracts</h3>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {amcs.map((amc) => (
                <div key={amc.id} className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/60 bg-white/20 dark:bg-slate-950/20 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase border ${
                        amc.status === 'Active' 
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                          : amc.status === 'Pending Renewal'
                          ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                          : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                      }`}>
                        {amc.status}
                      </span>
                      <span className="text-slate-400 font-medium">{amc.id}</span>
                    </div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-2">{amc.planName}</h4>
                    <p className="text-[10px] text-slate-450 mt-1">👤 {amc.customerName} • 📞 {amc.phone}</p>
                    <p className="text-[10px] text-slate-450 mt-0.5">
                      Visits: {amc.visitsCompleted} of {amc.visitsTotal} completed
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <span className="font-black text-sm block">₹{amc.price.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-slate-450 block mt-1">Expires: {amc.endDate}</span>
                    {amc.status === 'Pending Renewal' && (
                      <button 
                        onClick={() => alert(`Renewal notification sent to ${amc.customerName}!`)} 
                        className="mt-2.5 px-3 py-1 rounded bg-brand-600 hover:bg-brand-700 text-white font-bold text-[10px]"
                      >
                        Send Alert
                      </button>
                    )}
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
