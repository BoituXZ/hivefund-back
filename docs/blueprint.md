# 🐝 HiveFund: Project Blueprint

> **Theme:** Building Youth-Centric Financial Solutions
> **Track:** Universities Challenge (Econet E-Novate Hackathon)
> **Tagline:** Digitizing Community Savings for Financial Inclusion

---

## 1. 📋 Executive Summary
HiveFund is a youth-focused financial inclusion platform that digitizes **Mukando** (community savings circles) and uses participation history to build alternative credit scores. This allows young people with no collateral to access micro-loans funded by the platform's internal liquidity pool.

### Core Value Proposition
* **For Youth:** Build a credit score simply by saving with friends. Access instant micro-loans based on trust, not collateral.
* **For EcoCash:** Increases transaction volume (subscriptions, P2P transfers) and unlocks a new lending market (youth) with lowered risk.

---

## 2. 🏗️ System Architecture

### High-Level Stack
* **Frontend:** Angular 17 (PWA) - *Offline-first capability for reliable access.*
* **Backend:** NestJS (Node.js) - *Modular, scalable microservices architecture.*
* **Database:** PostgreSQL 16 - *Relational data integrity for financial records.*
* **Caching:** Redis - *Session storage and real-time leaderboard updates.*
* **Payment Gateway:** EcoCash API (Simulated for Hackathon).

### Service Breakdown
The backend is divided into modular services (Controllers in NestJS):

| Service | Responsibility | Key Dependencies |
| :--- | :--- | :--- |
| **Auth** | User identity, JWT issuance, OTP verification. | `users` table |
| **Circles** | Managing savings groups, cycles, and payouts. | `circles`, `cycles`, `members` |
| **Payments** | Handling EcoCash transactions and webhooks. | `transactions`, `subscriptions` |
| **Credit** | Calculating the "HiveScore" based on activity. | `credit_scores`, `credit_events` |
| **Loans** | Managing the liquidity pool and loan lifecycle. | `loans`, `liquidity_pool` |
| **Storefront** | Simple e-commerce for youth side-hustles. | `storefronts`, `products` |
| **Marketplace** | Gig-economy matching for earning income. | `gigs`, `bookings` |
| **Learning** | Financial literacy LMS gamified with points. | `learning_content`, `badges` |

---

## 3. 💾 Database Schema

### A. Identity & Security
* **`users`**: Stores phone numbers, EcoCash details, and auth credentials.
* **`sessions`**: Manages active JWT refresh tokens.

### B. Core Banking (Mukando)
* **`circles`**: The savings group configuration (contribution amount, frequency).
* **`circle_members`**: Links users to circles and assigns their **Payout Position**.
* **`payout_schedule`**: The "General Ledger" of who gets paid when.

### C. Financial Engine
* **`transactions`**: The single source of truth for every cent moved.
* **`credit_scores`**: Stores the calculated user score (0-1000) and Tier.
* **`loans`**: Tracks active debts, interest rates, and repayment status.

### D. Ecosystem
* **`storefronts`**: User-generated shops.
* **`gigs`**: Service listings (tutoring, design, etc.).
* **`learning_progress`**: Tracks completed modules for credit boosting.

---

## 4. 🔌 API Specification

### Authentication
* `POST /auth/register` - Create account.
* `POST /auth/login` - Get JWT.
* `POST /auth/verify-otp` - 2FA.

### Circles (Mukando)
* `POST /circles` - Create a new group.
* `GET /circles/my-circles` - Dashboard view.
* `POST /circles/:id/join` - Join via invite code.
* `GET /circles/:id/timeline` - Visual payout schedule.

### Payments
* `GET /wallet/balance` - View EcoCash balance.
* `POST /payments/simulate` - **(Debug)** Force a payment event for demos.
* `POST /payments/webhook` - Listener for EcoCash callbacks.

### Credit & Loans
* `GET /credit/score` - View score breakdown.
* `GET /loans/eligibility` - Check unlocked loan tiers.
* `POST /loans/apply` - Request immediate liquidity.

---

## 5. 💰 Credit Scoring Algorithm (The "Secret Sauce")

Our custom algorithm calculates creditworthiness based on behavior, not assets.

| Factor | Weight | Description |
| :--- | :--- | :--- |
| **Consistency** | 40% | Making contributions on or before the due date. |
| **Longevity** | 20% | Months active on the platform. |
| **Social Trust** | 15% | Completing full cycles without emergency exits. |
| **Contribution** | 15% | Ratio of contributions made vs. total due. |
| **Earnings** | 10% | Stability of income from Storefront/Gigs. |

**Tiers:**
* 🌱 **Seedling (0-299):** No loans.
* 🌿 **Growing (300-499):** Micro Loans ($10-$50).
* 🌳 **Established (500-699):** Short-term Loans ($50-$200).
* 🦁 **Trusted (700+):** Growth Loans ($200+) & lower interest rates.

---

## 6. 🚀 Deployment & Demo Strategy

### Prerequisites
1.  **Docker:** Required for the local PostgreSQL database.
2.  **Node v18+:** Required for the NestJS API.

### Setup Instructions
```bash
# 1. Install Dependencies
npm install

# 2. Start Database
docker-compose up -d

# 3. Seed Demo Data (Critical for Hackathon)
npm run seed:demo

# 4. Run Development Server
npm run start:dev