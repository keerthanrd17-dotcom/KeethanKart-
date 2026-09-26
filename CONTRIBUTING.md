# Contributing to KeethanKart

Thank you for your interest in contributing to **KeethanKart**! Follow these guidelines to contribute effectively.

---

## 🛠️ Prerequisites

- **Node.js**: v18+ (Node 20+ recommended)
- **Package Manager**: `bun` or `npm`
- **Git**

---

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/keerthanrd17-dotcom/KeethanKart-.git
   cd KeethanKart-
   ```

2. **Frontend Setup**:
   ```bash
   cd src/client
   bun install # or npm install
   bun run dev # or npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) for the Storefront, and [http://localhost:3000/admin](http://localhost:3000/admin) for the Admin Dashboard.

3. **Backend Setup (Optional)**:
   The frontend runs completely standalone via its in-browser simulated engine. To run the optional Express/Postgres backend:
   ```bash
   cd src/server
   npm install
   npx prisma migrate dev
   npm run seed
   npm run dev
   ```

---

## 📐 Development Guidelines

- **Micro-Commits**: Keep commits focused and atomic with meaningful explanations.
- **Strict Typing**: Avoid `any` in TypeScript; maintain clean types across interfaces.
- **Conventional Commits**: Format commit messages according to [Conventional Commits](https://www.conventionalcommits.org/).

---

## 📜 License

MIT License · Maintained by **Keethan R** (2025–2026).
