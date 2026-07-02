import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, X, Sun, Moon, Bell, Search, RefreshCw, LogOut,
  LayoutDashboard, User, ShieldCheck, Wrench, Clock, Inbox, Kanban,
  Calendar, FileText, Wallet, CreditCard, RefreshCcw, Users, Star,
  ShieldAlert, Truck, Share2, Award, Megaphone, BarChart2, HelpCircle,
  BellRing, ShieldAlert as SecurityIcon
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  isCompany: boolean;
  onToggleCompanyMode: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
  profileData: any;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  isCompany,
  onToggleCompanyMode,
  activeView,
  setActiveView,
  profileData
}) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  React.useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 45000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('https://server.apexbee.in/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markRead = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch(`https://server.apexbee.in/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, status: 'read' } : n));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('https://server.apexbee.in/api/notifications/mark-all-read', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getAuthUser = () => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  };

  const loggedInUser = getAuthUser();
  const userRoles = Array.isArray(loggedInUser?.roles) ? loggedInUser.roles : [];
  const rolesList = userRoles.map((r: string) => r.toLowerCase());
  if (loggedInUser && !rolesList.includes('customer')) {
    rolesList.unshift('customer');
  }

  const PORTAL_LINKS: Record<string, { label: string; url: string }> = {
    customer: { label: 'Customer Portal', url: 'http://localhost:5173' },
    admin: { label: 'Admin Panel', url: 'http://localhost:5173/admin' },
    vendor: { label: 'Vendor Portal', url: 'http://localhost:5177' },
    franchise: { label: 'Franchise Management', url: 'http://localhost:5175' },
    state_franchise: { label: 'Franchise Management', url: 'http://localhost:5175' },
    district_franchise: { label: 'Franchise Management', url: 'http://localhost:5175' },
    mandal_franchise: { label: 'Franchise Management', url: 'http://localhost:5175' },
    service_provider: { label: 'Service Provider Portal', url: 'http://localhost:5176' },
    course_provider: { label: 'Course Provider Portal', url: 'http://localhost:5174' },
  };

  const availablePortals = rolesList
    .map((role: string) => {
      const match = PORTAL_LINKS[role];
      return match ? { ...match, role } : null;
    })
    .filter(Boolean);

  const handleSwitchPortal = (role: string, url: string) => {
    localStorage.setItem('activeRole', role);
    window.location.href = url;
  };

  /* ──────────────────── Navigation groups ──────────────────── */
  const navigationGroups = [
    {
      title: 'Core',
      items: [
        { id: 'dashboard',  name: 'Dashboard',          icon: LayoutDashboard },
        { id: 'profile',    name: 'Profile Management',  icon: User },
        { id: 'kyc',        name: 'KYC & Verification',  icon: ShieldCheck },
      ],
    },
    {
      title: 'Services & Scheduling',
      items: [
        { id: 'service-management', name: 'Service Catalog',    icon: Wrench },
        { id: 'availability',       name: 'Availability',        icon: Clock },
        { id: 'service-requests',   name: 'Service Requests',    icon: Inbox },
        { id: 'job-kanban',         name: 'Job Kanban Board',    icon: Kanban },
        { id: 'scheduled-services', name: 'Scheduled Calendar',  icon: Calendar },
      ],
    },
    {
      title: 'Financials',
      items: [
        { id: 'quotes',      name: 'Quotes & Estimates', icon: FileText },
        { id: 'wallet',      name: 'Wallet & Ledger',    icon: Wallet },
        { id: 'withdrawals', name: 'Withdrawals',         icon: CreditCard },
        { id: 'amc',         name: 'AMC Management',     icon: RefreshCcw },
      ],
    },
    {
      title: 'Customers & Team',
      items: [
        { id: 'customers', name: 'Customers CRM',  icon: Users },
        { id: 'reviews',   name: 'Ratings & Reviews', icon: Star },
        { id: 'team',      name: 'Team Management', icon: ShieldAlert },
        { id: 'delivery',  name: 'Material Delivery', icon: Truck },
      ],
    },
    {
      title: 'Growth & Marketing',
      items: [
        { id: 'referrals',  name: 'Referral Program', icon: Share2 },
        { id: 'training',   name: 'Training Center',  icon: Award },
        { id: 'campaigns',  name: 'Sponsored Ads',    icon: Megaphone },
      ],
    },
    {
      title: 'Administration',
      items: [
        { id: 'reports',       name: 'Reports & Sheets',    icon: BarChart2 },
        { id: 'support',       name: 'Support Center',      icon: HelpCircle },
        { id: 'notifications', name: 'Alert Settings',      icon: BellRing },
        { id: 'security',      name: 'Security Settings',   icon: SecurityIcon },
      ],
    },
  ];

  const handleToggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };



  const initials = (profileData?.contactPerson || 'U')[0].toUpperCase();

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark' : ''}`}>

      {/* ═══════════════════════════════════
          SIDEBAR — always dark regardless of theme
      ═══════════════════════════════════ */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 flex flex-col
          shadow-[2px_0_16px_rgba(0,0,0,0.25)]
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-sm shadow-lg shadow-indigo-500/30 shrink-0">
              🐝
            </div>
            <div>
              <p className="text-sm font-black tracking-wide text-white leading-tight">
                Apex<span className="text-indigo-400">Bee</span>
              </p>
              <p className="text-[9px] text-slate-500 font-semibold tracking-widest uppercase">
                Provider Portal
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navigationGroups.map((group) => (
            <div key={group.title}>
              <p className="text-[9px] uppercase font-bold text-slate-600 tracking-[0.12em] px-3 mb-1.5">
                {group.title}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveView(item.id);
                        if (window.innerWidth < 768) setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold
                        transition-all duration-150 text-left
                        ${isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-800 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold
              text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ═══════════════════════════════════
          MAIN AREA
      ═══════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-64 bg-slate-100 dark:bg-slate-900 transition-colors">

        {/* TOP HEADER */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-700 px-5 flex items-center justify-between
          bg-white dark:bg-slate-800 sticky top-0 z-30 shadow-sm transition-colors">

          {/* Left: hamburger + search */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400
                hover:text-slate-700 dark:hover:text-slate-200
                hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative hidden md:block">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search portal..."
                className="w-60 bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600
                  rounded-lg pl-9 pr-4 py-2 text-xs text-slate-700 dark:text-slate-200
                  placeholder-slate-400 dark:placeholder-slate-500 outline-none
                  focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30
                  transition-all"
              />
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1.5">

            {/* Mode toggle */}
            <button
              onClick={onToggleCompanyMode}
              title="Switch between Company and Individual mode"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold
                border border-indigo-200 dark:border-indigo-800/70
                bg-indigo-50 dark:bg-indigo-950/40
                text-indigo-700 dark:text-indigo-300
                hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {isCompany ? '🏢 Company' : '👨 Individual'}
            </button>

            {/* Dark / light */}
            <button
              onClick={handleToggleTheme}
              title="Toggle dark/light mode"
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400
                hover:text-slate-700 dark:hover:text-slate-200
                hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                className="p-2 rounded-lg relative text-slate-500 dark:text-slate-400
                  hover:text-slate-700 dark:hover:text-slate-200
                  hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <Bell className="w-4 h-4" />
                {notifications.some(n => n.status === 'unread') && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full
                    border-2 border-white dark:border-slate-800 animate-pulse" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-76 bg-white dark:bg-slate-800
                  border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden"
                  style={{ width: '300px' }}
                >
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">Notifications</span>
                    <button 
                      onClick={markAllRead}
                      className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer hover:underline bg-transparent border-none"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="p-2 space-y-1 max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-center text-xs text-slate-450 dark:text-slate-500 py-6">No notifications yet.</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          onClick={() => {
                            markRead(n._id);
                            if (n.eventCode.includes('booking')) setActiveView('service-requests');
                            setShowNotifications(false);
                          }}
                          className={`flex items-start gap-2.5 p-2.5 rounded-lg cursor-pointer transition-colors ${
                            n.status === 'unread' 
                              ? 'bg-slate-50 dark:bg-slate-700/40 border border-indigo-500/10' 
                              : 'hover:bg-slate-50 dark:hover:bg-slate-700/60'
                          }`}
                        >
                          <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400`}>
                            {n.status === 'unread' ? '🔔' : '👁️'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-bold truncate ${n.status === 'unread' ? 'text-slate-800 dark:text-slate-100' : 'text-slate-550 dark:text-slate-400'}`}>
                              {n.title}
                            </p>
                            <p className="text-[10px] text-slate-450 dark:text-slate-400 leading-normal mt-0.5 whitespace-pre-wrap">
                              {n.message}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile avatar */}
            <div className="relative ml-1">
              <button
                onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                className="flex items-center gap-2 p-1 rounded-full
                  hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold
                  flex items-center justify-center text-xs
                  ring-2 ring-indigo-200 dark:ring-indigo-800">
                  {initials}
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-800
                  border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                      {profileData?.contactPerson}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {profileData?.email}
                    </p>
                  </div>
                  <div className="p-2 space-y-0.5">
                    <button
                      onClick={() => { setActiveView('profile'); setShowProfileMenu(false); }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold
                        text-slate-700 dark:text-slate-300
                        hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      👤 My Profile
                    </button>
                    <button
                      onClick={() => { setActiveView('security'); setShowProfileMenu(false); }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold
                        text-slate-700 dark:text-slate-300
                        hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      🔒 Security Settings
                    </button>
                     <div className="border-t border-slate-100 dark:border-slate-700 pt-1 mt-1 space-y-0.5">
                      {availablePortals.length > 1 && (
                        <>
                          <p className="text-[9px] uppercase font-bold text-slate-500 tracking-[0.12em] px-3 py-1">
                            Switch Portal
                          </p>
                          {availablePortals.map((portal: any, idx: number) => {
                            if (portal.role === 'service_provider') return null;
                            return (
                              <button
                                key={idx}
                                onClick={() => handleSwitchPortal(portal.role, portal.url)}
                                className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold
                                  text-indigo-600 dark:text-indigo-400
                                  hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                              >
                                🔄 {portal.label}
                              </button>
                            );
                          })}
                          <div className="border-t border-slate-100 dark:border-slate-700 pt-1 mt-1" />
                        </>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold
                          text-rose-600 dark:text-rose-400
                          hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
};
