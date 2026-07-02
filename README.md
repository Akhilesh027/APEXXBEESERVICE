# 🐝 ApexBee Service Provider Portal

Welcome to the **ApexBee Service Provider Portal**, a premium, high-fidelity administrative panel and operational CRM designed for service agencies (Companies) and independent contractors (Individuals). This portal empowers service providers to manage bookings, optimize scheduling, track technicians, dispatch parts, control financials, and scale their service business with real-time feedback and marketing controls.

---

## 🚀 Technology Stack

The application is built using a modern, performant, and type-safe front-end architecture:

*   **Framework:** React 19 (TypeScript)
*   **Build Tool:** Vite 8
*   **Styling:** Tailwind CSS v4 & PostCSS
*   **Icons:** Lucide React (for premium, unified micro-iconographies)
*   **Charts:** Recharts (for dynamic revenue & job distribution diagrams)
*   **Transitions:** Framer Motion (for smooth micro-interactions, modal flyouts, and state switches)

---

## ⚙️ Core Architecture & State Synchronization

The portal features a highly interactive and centralized state architecture built in [App.tsx](file:///C:/Users/akhil/.gemini/antigravity/scratch/service-provider-portal/src/App.tsx) that coordinates data flow across 24 modules:

1.  **Dual Mode Operability (Company vs. Individual):**
    *   *Company Mode:* Designed for multi-staff agencies. Enables complete team directory tracking, logistics (Material Delivery/Pickup), customer CRM database audits, and AMC contracts.
    *   *Individual Mode:* Tailored for single-operator freelancers. Hides multi-employee features, resets KPI calculations dynamically, and displays personal certificates instead of company licenses.
2.  **Live KPI Engine:** Dynamic `useEffect` hooks link jobs, service requests, teams, and AMC agreements. Altering job states (e.g., changing a job from *Pending* to *In Progress* or *Completed*) automatically updates dashboard tiles, wallet balances, active job metrics, and invoice states.
3.  **Themes:** Fully integrated dark/light mode toggle with seamless CSS variables inside `src/index.css` ensuring contrast and readability across components like `GlassCard` and `StatCard`.

---

## 🗂️ View-by-View Functional Breakdown

The portal contains **24 dedicated routing views** divided into 6 logical business groups. Below is an exhaustive list of each module and its exact capabilities:

### 1. Core Operations
*   **Dashboard:** 
    *   Displays 4 interactive KPI metric tiles (Today's Revenue, Monthly Revenue, Active Jobs, Pending Jobs).
    *   Renders dual charts: *Revenue Trends* (Recharts Area Chart) and *Job Allocation Distribution* (Recharts Pie Chart).
    *   Includes quick action triggers for launching availability planners, creating service quotes, and checking alerts.
*   **Profile Management:** 
    *   Supports live profile edits for both business profiles (Company Name, Contact Person, Contact Info, Service Areas) and individual profile setups.
    *   Manage skills/specialties tag lists, professional experience years, certificates, and portfolio showcase images.
    *   Update bank details (IFSC, Account Number, Branch) for settlement payouts.
*   **KYC & Verification:**
    *   Interactive document uploader verifying official identifications: GST Certificate, PAN Card, Aadhaar Card, and Business Service License.
    *   Displays dynamic badge states: `Approved` (green), `Pending Verification` (amber), or `Rejected/Action Needed` (rose).

### 2. Services & Scheduling
*   **Service Catalog:**
    *   Directory of all offered services (e.g., AC Deep Clean, Gas Refilling, PCB Repair, Switchboard installation) grouped by categories.
    *   Allows toggling a service's active/inactive status and updating fixed or quote-based pricing.
*   **Availability Planner:**
    *   Configurator for weekly working hours, vacation periods, and daily booking slots (e.g., morning/afternoon/evening slots).
*   **Service Requests:**
    *   Real-time booking lead board showing customer request details, location maps, and service pricing.
    *   Actions: `Accept` (automatically converts the request into an active job card), `Reject`, or `Reschedule` (with slot selection).
*   **Job Kanban Board:**
    *   Operational workspace where service jobs are tracked through stages: `Pending`, `Assigned`, `In Progress`, `Completed`, and `Cancelled`.
    *   Companies can assign technicians to jobs via dropdown menus. Changing status logs the action and triggers financial payouts.
*   **Scheduled Calendar:**
    *   List and calendar view of all upcoming and assigned jobs sorted by chronological slots to prevent scheduling conflicts.

### 3. Financial Management
*   **Quotes & Estimates:**
    *   B2B and B2C quote generator. Allows inputting line-items (description, rate, quantity) and calculates subtotals, GST (18%), and custom discounts.
    *   Tracks quote pipeline statuses: `Pending Review`, `Approved` (ready to convert to job), and `Rejected`.
*   **Wallet & Ledger:**
    *   Displays wallet balance, ledger stats, and a transaction history ledger.
    *   Filter transactions by type (`Credit` / `Debit`) and categories (`Job Payout`, `Withdrawal`, `AMC Setup`, `Referral Commission`).
*   **Withdrawals:**
    *   Payout request panel where providers request bank transfers or UPI payouts. Checks wallet balance thresholds before initiating processing status.
*   **AMC Management:**
    *   Tracks Annual Maintenance Contracts (RO, AC, Solar, Equipment). Displays remaining inspection visits, contract dates, and warns when contracts are `Pending Renewal` or `Expired`.

### 4. Customers & Team CRM
*   **Customers Database:**
    *   CRM directory listing all clients. Displays client names, emails, total jobs requested, lifetime expenditure metrics, active AMC indicators, and communication shortcuts.
*   **Ratings & Reviews:**
    *   Feedback review workspace showing aggregated rating scores.
    *   Allows service providers to post official responses/replies to specific customer reviews.
*   **Team Management:** *(Company Mode exclusive)*
    *   Technician and supervisor roster management. Add new staff, toggle active statuses, monitor real-time daily attendance (`Present`, `On Leave`, `Absent`), and track individual technician ratings.
*   **Material Delivery:** *(Company Mode exclusive)*
    *   Logistics tracker managing the transit of parts (e.g., AC copper coils, compressors) to/from job sites. Shows delivery partner contact details, pickup locations, and shipping status (`In Transit`, `Completed`).

### 5. Growth & Marketing
*   **Referral Program:**
    *   Multi-tier referral tree dashboard (Levels 1, 2, and 3). Track earnings contributed by colleagues who joined the ApexBee network, showing active and pending payouts.
*   **Training Center:**
    *   Learning Management System (LMS) hosting modules (e.g., Inverter AC Troubleshooting, Customer Ethics, Safety Protocols).
    *   Interactive progress trackers, lessons counts, and options to download certificates upon 100% course completion.
*   **Sponsored Ads:**
    *   Promotional portal for running localized marketing campaigns (Featured Listings, Sponsored Services, Banners).
    *   Tracks budget spent, click-through rates (CTR), impressions, and cost per lead.

### 6. Administration & Settings
*   **Reports & Sheets:**
    *   Data exporting view supporting date-filtered downloads of Sales Ledger, Performance Metrics, and Customer Feedback in CSV/Excel/PDF mock formats.
*   **Support Center:**
    *   Interactive FAQ accordion and custom support ticket submission panel.
*   **Alert Settings:**
    *   Granular notification control panel (SMS, Email, and Push notifications options for Job updates, Financial payments, and Marketing alerts).
*   **Security Settings:**
    *   Security suite for changing passwords, enabling Two-Factor Authentication (2FA), and checking active login sessions.

---

## 🛠️ Installation & Setup

Follow these steps to run the ApexBee Provider Portal locally:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) installed on your system.

### 1. Install Dependencies
Navigate to the root directory and install node packages:
```bash
npm install
```

### 2. Launch Development Server
Start the local Vite development server:
```bash
npm run dev
```
The console will output the local URL (usually `http://localhost:5173/` or `http://localhost:5174/`). Open this URL in your web browser.

### 3. Build for Production
To compile and optimize the app for staging/production deployment:
```bash
npm run build
```
The optimized bundle will be compiled into the `dist/` directory.

---

## 📂 Project Structure

```
service-provider-portal/
├── public/                 # Static assets (favicons, logos)
├── src/
│   ├── assets/             # Images, SVG icons, static media
│   ├── components/         # Reusable UI Components (CustomButton, StatCard, GlassCard, etc.)
│   ├── data/               # Center Mock Datasets (mockData.ts)
│   ├── layouts/            # Sidebar, Header, Notification layout wrapper (Layout.tsx)
│   ├── views/              # Feature specific views (Auth, Core, Customer, Financial, Growth, Service)
│   ├── App.tsx             # Routing & Central State controller
│   ├── index.css           # CSS variables & Tailwind directives
│   └── main.tsx            # React entrypoint
├── tailwind.config.js      # Custom theme setup
├── tsconfig.json           # TypeScript configuration
└── package.json            # Scripts & project dependencies
```
#   A P E X X B E E S E R V I C E  
 