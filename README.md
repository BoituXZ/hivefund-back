# 🐝 HiveFund

> **Digitizing Community Savings for Financial Inclusion.**
>
> *Built for the Econet E-Novate Hackathon (Universities Challenge)*

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Stack](https://img.shields.io/badge/stack-NestJS%20%7C%20Angular%20%7C%20PostgreSQL-orange)
![Status](https://img.shields.io/badge/status-Hackathon%20Prototype-green)

## 📋 Overview

**HiveFund** is a youth-focused financial platform that digitizes **Mukando** (community savings circles) and uses participation history to build an **alternative credit score**.

By tracking consistent savings behavior, we unlock access to instant micro-loans for young people who lack traditional collateral, creating a self-sustaining ecosystem of saving, lending, and earning.

---

## 🚀 Key Features

### 1. 🔄 Digital Mukando Circles

* Create or join private savings groups (4-10 members).
* **Automated Contributions:** EcoCash auto-deducts weekly/monthly payments.
* **Transparent Payouts:** "Lottery" or "Rotation" based scheduling ensures fairness.

### 2. 📈 Behavior-Based Credit Score

* We don't look at payslips; we look at **consistency**.
* **Score Factors:** On-time payments (40%), longevity (20%), and social trust (15%).
* **Gamified Tiers:** Move from *Seedling* (No loans) to *Trusted* (Growth loans).

### 3. 💸 Temporal Liquidity Pool (Lending)

* Leverages the "idle time" of money sitting in the pool between contribution and payout.
* Provides instant **Micro-Loans ($10-$50)** and **Short-Term Loans ($50-$200)** to high-scoring members.

### 4. 🛒 Youth Marketplace

* **Storefront:** Simple e-commerce tools for selling products.
* **Gig Hub:** Find local gigs (tutoring, design, labor) to earn money for contributions.

---

## 🛠️ Technical Architecture

This project is built using a modular microservices architecture to ensure scalability and separation of concerns.

### The Stack

* **Backend:** [NestJS](https://nestjs.com/) (Node.js) - *chosen for strict modularity and TypeScript support.*
* **Database:** [PostgreSQL 16](https://www.postgresql.org/) - *Relational data integrity for financial records.*
* **ORM:** TypeORM - *Schema management and migrations.*
* **API Documentation:** Swagger (OpenAPI 3.0).
* **Payment Simulation:** Custom logic to mock EcoCash webhooks for demo purposes.

### Microservices (Modules)

* `Auth` - JWT authentication & OTP verification.
* `Circles` - Core logic for savings groups and payout rotation.
* `Payments` - Ledger for all transactions (EcoCash integration).
* `Credit` - Scoring engine that updates in real-time based on events.
* `Loans` - Loan eligibility checks and lifecycle management.

---

## ⚡ Getting Started

### Prerequisites

* Node.js (v18 or later)
* Docker Desktop (for the database)

### Installation

1. **Clone the repository**

   ```bash
   git clone [https://github.com/TakudzwanasheSamuel/hivefund-backend.git](https://github.com/TakudzwanasheSamuel/hivefund-backend.git)
   cd hivefund-backend
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Setup Environment**
   Create a `.env` file in the root directory:

   ```env
   PORT=3000
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=hive_user
   DATABASE_PASSWORD=hive_password
   DATABASE_NAME=hive_fund
   JWT_SECRET=super_secret_hackathon_key
   ```
4. **Setup Database**

   **Option A: Using Docker (Recommended)**
   ```bash
   docker-compose up -d
   ```

   **Option B: Manual PostgreSQL Setup**
   ```bash
   # Connect to PostgreSQL as superuser
   psql -U postgres
   
   # Run the database creation script
   \i database/create-database.sql
   
   # Or from command line:
   psql -U postgres -f database/create-database.sql
   ```

   > **Note:** TypeORM will automatically create all tables when the app starts (synchronize: true in development mode)

5. **Run the Application**

   ```bash
   # Development mode
   npm run start:dev
   ```

### 🧪 Running the Demo (Hackathon Mode)

Since we cannot use live EcoCash money during the presentation, we have included a **Simulation Endpoint**:

1. Start the app.
2. Go to `http://localhost:3000/api/docs`.
3. Use the `POST /payments/simulate` endpoint.
4. **Payload:**
   ```json
   {
     "type": "contribution",
     "amount": 20,
     "phoneNumber": "+263770000000"
   }
   ```
5. This will trigger a "Successful Payment" event, update the circle progress, and **boost the user's credit score** live.

---

## 📚 API Documentation

Once the application is running, full API documentation (Swagger) is available at:

👉 **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

This interactive documentation allows you to test all endpoints (Auth, Circles, Loans) directly from the browser.

---
