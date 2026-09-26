# KeethanKart — Architecture & Maintenance Log

**Project:** KeethanKart (E-Commerce Platform)  
**Lead Engineer:** Keethan R  
**Last Updated:** 2026 Maintenance Pass  

---

## 🛠️ Architecture & Engineering Upgrades

### 1. In-Browser Resilient Execution Architecture
- Defaulted `isDemoMode()` to active (`NEXT_PUBLIC_DEMO_MODE !== "false"`) so the hosted storefront on Vercel or GitHub Pages functions with 100% interactivity (auth, cart, mock checkout, order stream, admin dashboard) without requiring external PostgreSQL/Redis hosting.
- Intercepted GraphQL analytics queries (`GET_ANALYTICS_OVERVIEW`, `GET_ALL_ANALYTICS`) via `demoApolloLink` returning authentic Indian sales data in ₹ INR.

### 2. 0ms Latency Real-Time Cross-Tab Engine
- Engineered browser-native cross-tab communication combining HTML5 `BroadcastChannel` with `StorageEvent` fallback listeners in `realtime.ts`.
- Integrated event ID deduplication (`seenEventIds` ref) to guarantee idempotent counter and revenue aggregation.
- Reused singleton channel instances to prevent browser port exhaustion and guarantee zero dropped messages.

### 3. Glassmorphic Superadmin Suite
- Rebuilt Admin layout and components with dark glassmorphism ("Glamourism"), high-contrast typography, and saffron/gold branding (`#f59e0b`).
- Created `/admin` direct route with automatic demo superadmin elevation.
- Configured dynamic ApexCharts with ₹ Lakhs/k value formatting and custom gradients.

### 4. Resilient Firebase Google Authentication
- Integrated Firebase Web SDK v12.19.0 with singleton client initialization and `GoogleAuthProvider`.
- Structured `signInWithGooglePopup()` with safe fallback to simulated sessions to ensure viva demonstrations never fail due to offline connectivity or network firewalls.

### 5. Indian Catalog & Currency Localization
- Overhauled product catalog with genuine Indian items (Samsung Galaxy S24 Ultra, Redmi Note 13 Pro, Manyavar Silk Kurta, Fabindia Saree, boAt Airdopes, Noise Smartwatch).
- Applied formatted `₹` INR currency across all storefront and admin components.

---

## 🔒 Security & Privacy Standards

- **Strictly Local `.agents/`**: Memory directories and personal configuration are globally ignored in Git and never committed to remote repositories.
- **Credential Safety**: All production API keys and session secrets are managed via `.env.local` with safe default fallbacks.
- **Strict Typing**: Enforced TypeScript types across store slices, demo handlers, and real-time event interfaces.
