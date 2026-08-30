# Axisflare Client App ✈️🎨

[![Next.js Version](https://img.shields.io/badge/Next.js-16.1.6-black.svg)](https://nextjs.org)
[![React Version](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8.svg)](https://tailwindcss.com)
[![Redux Toolkit](https://img.shields.io/badge/Redux-Toolkit-764abc.svg)](https://redux-toolkit.js.org)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.0-purple.svg)](https://www.framer.com/motion)

The frontend client portal for **Axisflare**, an AI-powered travel intelligence and visa routing helper. Built with **Next.js 16** (App Router), **React 19**, and **Tailwind CSS v4**, delivering smooth glassmorphic designs, micro-animations, and structured routing flows.

---

## ✨ Features
- **Modern Landing Page**: Fully responsive marketing layout with smooth transitions, feature pricing cards, and interactive flight analysis previews.
- **Interactive Travel Flow**: Search departure & destination airports, select visa categories, and view flight routing choices.
- **AI Report Viewer**: Displays structured AI-generated reports detailing layover visa risks, documentation checklists, weather advice, and feasibility ratings.
- **Admin Dashboard**: Real-time management console to adjust country policy exceptions, transit limits, and active plans.
- **User Dashboard**: Client portal to manage active subscriptions (Free, Monthly, One-Time), profiles, and lookup history.
- **Social Authentication**: Google Social Login strategy integration.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 16.1.6 (App Router)
- **Library**: React 19.2.3
- **Styling**: Tailwind CSS v4 & PostCSS
- **State Management**: Redux Toolkit & Redux Toolkit Query (for client caching and token lifecycle)
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form with Zod schemas
- **Portals & UI components**: Base UI & Radix UI

---

## 📂 Project Structure

```
leonmakanda-frontend/
├── app/
│   ├── (TestTravelling)/          # Public anonymous airport-routes selection flow
│   ├── (adminDashboardLayout)/    # Admin panel layouts, user-activities, visa rules
│   ├── (auth)/                    # Register, login, reset-password pages
│   ├── (userDashboardLayout)/     # Personal user portal, plan status, history lists
│   ├── globals.css                # Tailwind base configurations & core style variables
│   ├── layout.tsx                 # Core HTML wrappers
│   └── page.tsx                   # Interactive marketing landing page
├── components/
│   ├── landing_page/              # Section layouts (Pricing, Hero, Features, CTAs)
│   ├── ui/                        # Reusable Tailwind buttons, tables, portals, inputs
│   └── userDashboard/             # Dashboard widgets & profile forms
├── lib/
│   ├── api/                       # Redux baseApi RTK Query declaration
│   ├── features/                  # Domain specific slice queries (user, auth, ai, transit)
│   └── redux/                     # Store wrappers & React context Providers
```

---

## ⚡ Setup & Run

### 1. Prerequisites
Ensure you have Node.js (>=20) and `pnpm` installed.

### 2. Environment Setup
Create a `.env.local` file in the frontend root:
```env
NEXT_PUBLIC_API_URL=http://localhost:5711/api/v1
API_BASE_URL=http://localhost:5711/api/v1
AUTH_SECRET="your-auth-secret"
```

### 3. Local Execution
```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev
```
Open [http://localhost:5000](http://localhost:5000) with your browser to view the app.

---

## 🚀 Deployment on Vercel

1. Create a new project on **Vercel.com**.
2. Connect your GitHub repository: `axisflare-frontend`.
3. Set the Environment Variables under settings:
   - **`NEXT_PUBLIC_API_URL`**: `https://your-backend.onrender.com/api/v1`
   - **`API_BASE_URL`**: `https://your-backend.onrender.com/api/v1`
4. Click **Deploy**. Vercel will automatically build and publish the app.

