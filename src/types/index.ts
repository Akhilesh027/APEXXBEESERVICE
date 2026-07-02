export interface Job {
  id: string;
  customerName: string;
  phone: string;
  city: string;
  location: string;
  serviceCategory: string;
  serviceName: string;
  revenue: number;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  date: string;
  timeSlot: string;
  assignedStaff?: string;
}

export interface ServiceRequest {
  id: string;
  customerName: string;
  phone: string;
  serviceName: string;
  city: string;
  location: string;
  dateTime: string;
  price: number;
  status: 'new' | 'accepted' | 'rejected' | 'rescheduled';
}

export interface QuoteItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Quote {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  location: string;
  date: string;
  validUntil: string;
  items: QuoteItem[];
  subtotal: number;
  gst: number;
  discount: number;
  total: number;
  status: 'pending' | 'approved' | 'rejected';
}

export interface SparePart {
  id: string;
  name: string;
  partNumber: string;
  stock: number;
  minStock: number;
  unit: string;
  pricePerUnit: number;
  category: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  jobsCount: number;
  totalSpent: number;
  isAMCCustomer: boolean;
  status: 'Active' | 'Inactive';
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  type: 'credit' | 'debit';
  category: 'job' | 'withdrawal' | 'referral' | 'amc';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  serviceName: string;
  response?: string;
}

export interface ReferralUser {
  id: string;
  name: string;
  level: 1 | 2 | 3;
  dateJoined: string;
  earningsContributed: number;
  status: 'Active' | 'Pending';
  referralsCount: number;
}

export interface TrainingCourse {
  id: string;
  title: string;
  category: 'Technical' | 'Business' | 'Safety' | 'Customer Handling';
  duration: string;
  progress: number; // 0 to 100
  lessonsCount: number;
  completedLessons: number;
  thumbnailUrl: string;
  certificateUrl?: string;
}

export interface AdCampaign {
  id: string;
  name: string;
  type: 'Featured Listing' | 'Sponsored Service' | 'Banner';
  status: 'Active' | 'Paused' | 'Completed';
  budget: number;
  spent: number;
  clicks: number;
  leadsGenerated: number;
  startDate: string;
  endDate: string;
}

export interface DeliveryRequest {
  id: string;
  type: 'Pickup' | 'Delivery';
  itemDescription: string;
  fromAddress: string;
  toAddress: string;
  assignedPartner: string;
  partnerPhone: string;
  status: 'Assigned' | 'In Transit' | 'Completed' | 'Cancelled';
  date: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: 'Technician' | 'Helper' | 'Supervisor' | 'Admin';
  phone: string;
  email: string;
  status: 'Active' | 'Inactive';
  attendanceToday: 'Present' | 'Absent' | 'On Leave';
  rating: number;
  jobsCompleted: number;
}

export interface AMCOnboarding {
  id: string;
  customerName: string;
  phone: string;
  planName: string;
  category: 'AC' | 'RO' | 'Solar' | 'Equipment';
  startDate: string;
  endDate: string;
  price: number;
  visitsTotal: number;
  visitsCompleted: number;
  status: 'Active' | 'Expired' | 'Pending Renewal';
}
