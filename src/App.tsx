import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Layout } from './layouts/Layout';

// View Imports
import { Login, Register } from './views/AuthViews';
import { Dashboard, Profile, KYC } from './views/CoreViews';
import { ServiceManagement, Availability, ServiceRequests, JobManagement, ScheduledServices } from './views/ServiceViews';
import { Quotes, WalletView, Withdrawals, AMCManagement } from './views/FinancialViews';
import { Customers, Reviews, TeamManagement, DeliveryPickup } from './views/CustomerViews';
import { SpareParts, Referral, Training, AdsPromotion, Reports, Support, NotificationsView, Security } from './views/GrowthViews';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const checkInitialAuth = (): boolean => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        const permittedRoles = ['service_provider', 'admin'];
        return !!user.roles?.some((r: string) => permittedRoles.includes(r.toLowerCase()));
      } catch (e) {
        return false;
      }
    }
    return false;
  };

  const [isLoggedIn, setIsLoggedIn] = useState(checkInitialAuth());
  const [isCompany, setIsCompany] = useState(localStorage.getItem('isCompany') !== 'false');
  const [activeView, setActiveView] = useState('dashboard');

  // Empty initial states — data fetched from backend in each view
  const emptyProfile = {
    isCompany: true, companyName: '', contactPerson: '', email: '', phone: '',
    designation: '', skills: [], experience: '', certifications: [], portfolio: [],
    gallery: [], serviceAreas: [], socialLinks: { facebook: '', instagram: '', linkedin: '' },
    gstNumber: '', panNumber: '', aadhaarNumber: '',
    bankDetails: { accountName: '', accountNumber: '', bankName: '', branch: '', ifsc: '' },
    businessRegistration: '', serviceLicense: '',
    kycStatus: 'Pending' as 'Pending' | 'Approved' | 'Rejected',
    registrationDate: new Date().toISOString().split('T')[0]
  };

  const [companyProfile, setCompanyProfile] = useState(emptyProfile);
  const [individualProfile, setIndividualProfile] = useState({ ...emptyProfile, isCompany: false });
  const [kpis, setKpis] = useState({
    todayRevenue: 0, monthlyRevenue: 0, activeJobs: 0, pendingJobs: 0,
    completedJobs: 0, scheduledServices: 0, walletBalance: 0, pendingEarnings: 0,
    totalCustomers: 0, averageRating: 0, referralEarnings: 0, amcCustomers: 0, teamMembers: 0
  });
  const [requests, setRequests] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [spareParts, setSpareParts] = useState<any[]>([]);
  const [amcs, setAmcs] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [deliveryRequests, setDeliveryRequests] = useState<any[]>([]);

  const fetchBookings = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch('https://server.apexbee.in/api/service/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        const bookingsList = data.bookings || [];
        const mappedList = bookingsList.map((b: any) => {
          let portalStatus: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled' = 'pending';
          const s = b.status;
          if (s === 'Pending') portalStatus = 'pending';
          else if (s === 'Accepted' || s === 'Technician Assigned') portalStatus = 'assigned';
          else if (['Provider On The Way', 'Arrived', 'Work Started', 'Work Completed'].includes(s)) portalStatus = 'in_progress';
          else if (s === 'Completed') portalStatus = 'completed';
          else if (s === 'Cancelled' || s === 'Rejected') portalStatus = 'cancelled';

          return {
            id: b.id || b.bookingCode || `BKG-${String(b._id).substring(18)}`,
            _id: b._id,
            customerName: b.customerName || "Customer",
            phone: b.phone || "",
            city: b.address ? b.address.split(',').pop()?.trim() || "Local" : "Local",
            location: b.address || "",
            serviceName: b.service,
            price: b.servicePrice || 0,
            revenue: b.servicePrice || 0,
            dateTime: `${b.date} ${b.time}`,
            date: b.date,
            timeSlot: b.time,
            status: portalStatus,
            originalStatus: b.status,
            assignedStaff: b.assignedStaff || "",
            otpCode: b.otpCode || "",
            timeline: b.timeline || [],
            paymentDetails: b.paymentDetails || {},
            review: b.review || null,
            details: b.details || ""
          };
        });

        setRequests(mappedList.filter((b: any) => b.originalStatus === 'Pending'));
        setJobs(mappedList.filter((b: any) => b.originalStatus !== 'Pending'));
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  const fetchKpis = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch('https://server.apexbee.in/api/service/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        const stats = data.stats;
        setKpis({
          todayRevenue: stats.completedToday * 1500, // estimated
          monthlyRevenue: stats.monthlyRevenue || 0,
          activeJobs: stats.upcomingBookings || 0,
          pendingJobs: stats.pending || 0,
          completedJobs: stats.completedToday || 0,
          scheduledServices: stats.upcomingBookings || 0,
          walletBalance: stats.walletBalance || 0,
          pendingEarnings: stats.pendingSettlement || 0,
          totalCustomers: stats.totalCustomers || 0,
          averageRating: stats.averageRating || 4.8,
          referralEarnings: 0,
          amcCustomers: 0,
          teamMembers: 0
        });
      }
    } catch (err) {
      console.error('Error fetching KPIs:', err);
    }
  };

  const refreshData = () => {
    fetchBookings();
    fetchKpis();
  };

  useEffect(() => {
    if (isLoggedIn) {
      refreshData();
    }
  }, [isLoggedIn]);

  // Sync profile edits based on user mode
  const profileData = isCompany ? companyProfile : individualProfile;
  const setProfileData = isCompany ? setCompanyProfile : setIndividualProfile;

  // Sync activeView with URL route parameters
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const path = location.pathname.substring(1);

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        const permittedRoles = ['service_provider', 'admin'];
        const hasRole = user.roles?.some((r: string) => permittedRoles.includes(r.toLowerCase()));
        if (hasRole) {
          setIsLoggedIn(true);
          if (path && path !== 'login' && path !== 'register') {
            setActiveView(path);
          }
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Force redirection to login if not authenticated
    setIsLoggedIn(false);
    if (path !== 'register') {
      navigate('/login');
    }
  }, [location]);

  const handleActiveViewChange = (view: string) => {
    setActiveView(view);
    navigate(`/${view}`);
  };

  const handleLoginSuccess = (companyMode: boolean) => {
    setIsLoggedIn(true);
    setIsCompany(companyMode);
    localStorage.setItem('isCompany', String(companyMode));
    navigate('/dashboard');
  };

  const handleToggleCompanyMode = () => {
    const nextMode = !isCompany;
    setIsCompany(nextMode);
    // Reset KPI counts when toggling — real data will re-compute
    setKpis(prev => ({
      ...prev,
      activeJobs: jobs.filter(j => j.status === 'assigned' || j.status === 'in_progress').length,
      teamMembers: nextMode ? teamMembers.length : 0,
      amcCustomers: nextMode ? amcs.length : 0
    }));
  };

  // Sync active job count & pending requests count with KPI metrics
  useEffect(() => {
    setKpis(prev => ({
      ...prev,
      activeJobs: jobs.filter(j => j.status === 'assigned' || j.status === 'in_progress').length,
      pendingJobs: jobs.filter(j => j.status === 'pending').length,
      completedJobs: jobs.filter(j => j.status === 'completed').length,
      teamMembers: isCompany ? teamMembers.length : 0,
      amcCustomers: isCompany ? amcs.length : 0
    }));
  }, [jobs, teamMembers, amcs, isCompany]);

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login onLogin={handleLoginSuccess} />} />
      <Route path="/register" element={<Register />} />

      {/* Portal Layout Routes */}
      <Route 
        path="/*" 
        element={
          isLoggedIn ? (
            <Layout 
              isCompany={isCompany}
              onToggleCompanyMode={handleToggleCompanyMode}
              activeView={activeView}
              setActiveView={handleActiveViewChange}
              profileData={profileData}
            >
              <Routes>
                {/* 24 views mapping */}
                <Route path="dashboard" element={
                  <Dashboard 
                    setActiveView={handleActiveViewChange} 
                    isCompany={isCompany}
                    profileData={profileData}
                    setProfileData={setProfileData}
                    kpis={kpis}
                    setKpis={setKpis}
                    jobs={jobs}
                    setJobs={setJobs}
                    requests={requests}
                    setRequests={setRequests}
                    quotes={quotes}
                    setQuotes={setQuotes}
                    spareParts={spareParts}
                    setSpareParts={setSpareParts}
                    amcs={amcs}
                    setAmcs={setAmcs}
                    refreshData={refreshData}
                  />
                } />
                <Route path="profile" element={<Profile isCompany={isCompany} profileData={profileData} setProfileData={setProfileData} />} />
                <Route path="kyc" element={<KYC isCompany={isCompany} profileData={profileData} setProfileData={setProfileData} />} />
                <Route path="service-management" element={<ServiceManagement isCompany={isCompany} jobs={jobs} setJobs={setJobs} requests={requests} setRequests={setRequests} teamMembers={teamMembers} />} />
                <Route path="availability" element={<Availability />} />
                <Route path="service-requests" element={<ServiceRequests isCompany={isCompany} jobs={jobs} setJobs={setJobs} requests={requests} setRequests={setRequests} teamMembers={teamMembers} refreshData={refreshData} />} />
                <Route path="job-kanban" element={<JobManagement isCompany={isCompany} jobs={jobs} setJobs={setJobs} requests={requests} setRequests={setRequests} teamMembers={teamMembers} refreshData={refreshData} />} />
                <Route path="scheduled-services" element={<ScheduledServices isCompany={isCompany} jobs={jobs} setJobs={setJobs} requests={requests} setRequests={setRequests} teamMembers={teamMembers} />} />
                
                <Route path="quotes" element={<Quotes isCompany={isCompany} kpis={kpis} setKpis={setKpis} amcs={amcs} setAmcs={setAmcs} profileData={profileData} />} />
                <Route path="wallet" element={<WalletView isCompany={isCompany} kpis={kpis} setKpis={setKpis} amcs={amcs} setAmcs={setAmcs} profileData={profileData} refreshData={refreshData} />} />
                <Route path="withdrawals" element={<Withdrawals isCompany={isCompany} kpis={kpis} setKpis={setKpis} amcs={amcs} setAmcs={setAmcs} profileData={profileData} refreshData={refreshData} />} />
                <Route path="amc" element={<AMCManagement isCompany={isCompany} kpis={kpis} setKpis={setKpis} amcs={amcs} setAmcs={setAmcs} profileData={profileData} />} />

                <Route path="customers" element={<Customers />} />
                <Route path="reviews" element={<Reviews />} />
                <Route path="team" element={<TeamManagement isCompany={isCompany} teamMembers={teamMembers} setTeamMembers={setTeamMembers} deliveryRequests={deliveryRequests} setDeliveryRequests={setDeliveryRequests} />} />
                <Route path="delivery" element={<DeliveryPickup isCompany={isCompany} teamMembers={teamMembers} setTeamMembers={setTeamMembers} deliveryRequests={deliveryRequests} setDeliveryRequests={setDeliveryRequests} />} />

                <Route path="spare-parts" element={<SpareParts isCompany={isCompany} spareParts={spareParts} setSpareParts={setSpareParts} kpis={kpis} setKpis={setKpis} />} />
                <Route path="referrals" element={<Referral />} />
                <Route path="training" element={<Training />} />
                <Route path="campaigns" element={<AdsPromotion />} />
                
                <Route path="reports" element={<Reports />} />
                <Route path="support" element={<Support />} />
                <Route path="notifications" element={<NotificationsView />} />
                <Route path="security" element={<Security />} />

                {/* Catch-all dashboard redirect */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}
