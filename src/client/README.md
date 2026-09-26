# 🛒 KeethanKart — Next.js 15 Client & Admin Dashboard

Welcome to the frontend application of **KeethanKart**, a full-featured Indian E-Commerce and Real-Time Analytics Platform built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Redux Toolkit (RTK Query), and Firebase Authentication.

---

## 🌟 Key Highlights

- **🇮🇳 Indian ₹ INR Catalog & Currency Localization**: Authentic consumer products (Samsung, Redmi, boAt, Noise, Manyavar, Fabindia) with Indian pricing standards.
- **🛡️ Direct Superadmin Access (`/admin`)**: Dark glassmorphism ("Glamourism") administration suite with live KPIs, sales breakdown, and product performance.
- **⚡ 0ms Latency Cross-Tab Sync**: Powered by the browser `BroadcastChannel` API and `StorageEvent` listeners for real-time inter-tab activity streaming without backend dependencies.
- **🔐 Firebase Authentication**: Seamless Google Sign-In & Sign-Up popups with intelligent fallback and guest account elevation.
- **📊 Interactive Visualizations**: ApexCharts dark-themed Area, Bar, and Donut charts with ₹ Lakhs/k formatting.
- **🧾 Instant Order Receipt**: Dynamic receipt cards displaying purchased items, amount paid, and live order tracking.

---

## 🚀 Quick Start (Local Development)

### 1. Navigate to the client directory
```bash
cd src/client
```

### 2. Install dependencies
```bash
bun install
# or
npm install
```

### 3. Configure environment variables (Optional in Demo Mode)
Copy `.env.example` to `.env.local` if you need custom Firebase credentials or backend URLs:
```bash
cp .env.example .env.local
```

### 4. Run the development server
```bash
bun run dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the storefront, or [http://localhost:3000/admin](http://localhost:3000/admin) to view the real-time Admin Dashboard.

---

## 🌐 Production Deployment (Vercel / GitHub)

This frontend is designed to deploy seamlessly to **Vercel** or **GitHub Pages**:

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set the **Root Directory** to `src/client`.
4. Deploy! Because in-browser demo mode defaults to active (`NEXT_PUBLIC_DEMO_MODE !== "false"`), the application runs 100% interactively without requiring external databases or server processes.

---

## 📁 Architecture Overview

```
src/client/
├── app/
│   ├── (auth)/             # Authentication routes (sign-in, sign-up with Firebase Google Auth)
│   ├── (private)/dashboard # Dark glassmorphic admin suite & live analytics
│   ├── (public)/           # Storefront catalog, cart, product detail & order receipt
│   ├── admin/              # Direct superadmin auto-elevation entry point
│   ├── components/         # Atomic design (atoms, molecules, organisms, templates)
│   ├── hooks/              # Custom React hooks (realtime, auth, formatting)
│   ├── lib/
│   │   ├── demo/           # In-browser mock engine, catalog fixtures, and realtime broadcast
│   │   └── firebase.ts     # Firebase singleton and Google popup handler
│   └── store/              # Redux Toolkit store, slices, and RTK Query APIs
```

---

## 📜 License

MIT License · Built by **Keethan R** (2025–2026).
