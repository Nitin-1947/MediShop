# Medishop Connect 💊🏪
### Hyperlocal Pharmacy Discovery & Pre-Visit Bill Optimization System
**Clinical Teal & Clean Slate Edition**

> **A high-trust, fast, and smooth full-stack healthcare platform featuring separate Customer & Chemist portals, Distributor Purchase Bill OCR with instant inventory updates, Drugs & Cosmetics Act 1940 compliance, and PostGIS geospatial discovery.**

---

## 🌟 What's New & Key Capabilities

### 1. 👥 Separate Portals & Verified Authentication
* **Customer Portal Onboarding:**
  - Fast signup using 10-digit mobile number and instant verification code (OTP).
  - Pre-visit basket estimation, 60-minute locked estimate slip generator, and verified pickup reviews.
* **Medical Shop Owner / Chemist Portal:**
  - Mandatory Drug License authentication (Form 20B/21B, e.g. `KA-BLR-DL-2024-XXXXX`), verified against state drug controller records.
  - Registers store name, physical address, pincode, geo-coordinates, flat discount rates, and 24/7 duty status.

### 2. 🧾 Wholesaler / Distributor Purchase Bill OCR Scanner
* Chemist can directly scan/upload paper or PDF purchase invoices from pharmaceutical distributors (e.g., GSK, Sun Pharma, Cipla, Micro Labs).
* **Automatic Line Item Extraction:**
  - Medicine Brand Name & Generic Salt
  - Batch Number & Expiry Date
  - Received Quantity (strips/packs)
  - Wholesale Cost Price & Retail MRP
  - Customer Discount %
* **1-Click Live Inventory Ingestion:** Automatically adds or increments the medicine stock for **that specific pharmacy** in real time!

### 3. 🎨 Clinical Teal & Clean Slate Design System
* High-trust healthcare aesthetic:
  - **Palette:** Clinical Teal (`#0D9488`, `#0F766E`, `#14B8A6`, `#F0FDFA`) and Clean Slate (`#0F172A`, `#1E293B`, `#334155`, `#64748B`, `#F8FAFC`).
  - **Typography:** `Plus Jakarta Sans` & `Inter` for clean legibility.
  - **Micro-Interactions:** Subtle Web Audio pops, chimes, and cash register dings (with one-touch mute toggle).

### 4. ⚡ Hyperlocal Engine & Basket Cost Optimizer
* **Geospatial Proximity:** Spherical Haversine calculation (matching PostGIS `ST_DWithin`) across 1 km, 3 km, and 5 km radius zones.
* **Single-Shop Complete Match:** Closest verified pharmacy fulfilling 100% of items at lowest net cost.
* **Split-Cart Savings Match:** Splits basket between 2 stores when clearance discounts save extra money (up to ₹150+).
* **Generic Bioequivalent Suggestions:** Lower-cost bioequivalent recommendations (e.g. Augmentin ₹204 vs Amoxyclav ₹162, save 21%).
* **60-Minute QR Estimate Slips:** Counter price lock guarantee with scannable QR token.

---

## 🚀 Running the Project

```bash
# Unified launch (runs Node.js Express backend and serves built React SPA at port 5000)
npm start
```
👉 Open: **`http://localhost:5000`**

### Development Mode (with Hot Reloading)
```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend (Vite)
npm run dev:frontend
```
👉 Open: **`http://localhost:5173`**

### Run Backend Integration Tests
```bash
node backend/test_api.js
```
