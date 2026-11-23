# Medishop Connect 💊🏪
### Hyperlocal Pharmacy Inventory Discovery & Pre-Visit Bill Optimization System
**Clinical Teal & Clean Slate Edition**

[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B%20%7C%20v20%2B-darkgreen.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-4.19.2-lightgrey.svg)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.3%2B-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4.4-38B2AC.svg)](https://tailwindcss.com/)
[![Compliance](https://img.shields.io/badge/Compliance-Drugs%20%26%20Cosmetics%20Act%201940-emerald.svg)](https://cdsco.gov.in/)

> **Medishop Connect** is a high-trust, fast, and smooth full-stack healthcare web application engineered to bridge the information asymmetry between local retail pharmacies and patients. Featuring separate dual-role dashboards (Customer Portal & Medical Shop Owner Dashboard), instant Wholesaler Purchase Bill OCR ingestion, doctor prescription vision parsing, 60-minute price-lock counter reservation slips, dynamic near-expiry liquidation discounting, and strict Indian regulatory compliance (Drugs & Cosmetics Act 1940 and DPDP Act 2023).

---

## 📑 Table of Contents
1. [Project Overview & Problem Statement](#-project-overview--problem-statement)
2. [Key Features](#-key-features)
   - [Separate Dual-Role Dashboards & Auth](#1-separate-dual-role-dashboards--auth)
   - [Distributor Purchase Bill OCR Scanner](#2-distributor-purchase-bill-ocr-scanner)
   - [Real-Time Hyperlocal Medicine Discovery](#3-real-time-hyperlocal-medicine-discovery)
   - [Multi-Item Basket Cost Optimizer & Generic Substitutes](#4-multi-item-basket-cost-optimizer--generic-substitutes)
   - [Doctor's Prescription Vision Reader (OCR)](#5-doctors-prescription-vision-reader-ocr)
   - [60-Minute Counter Reservation Slips & QR Price-Lock](#6-60-minute-counter-reservation-slips--qr-price-lock)
   - [Chemist POS & Dynamic Expiry Discounting](#7-chemist-pos--dynamic-expiry-discounting)
   - [Schedule H/H1 Regulatory Compliance Register](#8-schedule-hh1-regulatory-compliance-register)
   - [Verified Counter-Pickup Reviews](#9-verified-counter-pickup-reviews)
3. [Design System: Clinical Teal & Clean Slate](#-design-system-clinical-teal--clean-slate)
4. [Backend Technology & Architectural Design](#-backend-technology--architectural-design)
5. [External Servers, Databases & Third-Party Integrations](#-external-servers-databases--third-party-integrations)
6. [Complete REST API Reference](#-complete-rest-api-reference)
7. [System Architecture Flow](#-system-architecture-flow)
8. [Installation & Getting Started](#-installation--getting-started)
9. [Project Directory Layout](#-project-directory-layout)
10. [Regulatory & Legal Framework](#-regulatory--legal-framework)
11. [License](#-license)

---

## 🔍 Project Overview & Problem Statement

In India and many developing healthcare ecosystems:
- **Patients face stock unpredictability:** Patients or caregivers often visit multiple pharmacies physically to find specific prescription antibiotics, cardiac medicines, or emergency pediatric formulations.
- **Out-of-Pocket Expenditure (OOPE):** Branded medications frequently cost 30%–70% more than identical bioequivalent generic salts, with zero price transparency before reaching the billing counter.
- **Pharmacy inventory entry bottlenecks:** Retail chemists purchase dozens of medicine cartons weekly from pharmaceutical distributors. Manually typing batch numbers, expiry dates, purchase rates, and quantities into legacy POS software takes hours, leading to obsolete stock records and untracked near-expiry batches.
- **Compliance challenges:** Retail dispensing of Schedule H and Schedule H1 drugs requires mandatory prescription verification and maintenance of physical or digital inspection logs under the **Drugs and Cosmetics Act, 1940**.

**Medishop Connect solves these challenges** through an integrated hyperlocal network:
1. **For Customers:** Discover in-stock medicines within 1–5 km, compare multi-item basket rates across licensed stores, discover lower-cost generic alternatives, and lock in the quoted rate with a scannable 60-minute QR estimate slip.
2. **For Chemists:** Ingest stock in seconds by scanning distributor purchase invoices via OCR, liquidate medicines approaching expiry through dynamic customer discounts, redeem customer QR codes seamlessly, and maintain automated regulatory compliance registers.

---

## 🌟 Key Features

### 1. Separate Dual-Role Dashboards & Auth
* **Customer Portal (`role: customer`):**
  - Instant mobile onboarding using 10-digit Indian phone numbers and one-time verification (OTP).
  - Geolocation detection (latitude/longitude coordinates and pincode mapping).
  - Multi-item pre-visit cart builder, real-time store comparison, and estimate slip generation.
* **Chemist / Medical Shop Owner Dashboard (`role: chemist`):**
  - Mandatory **Drug License authentication** (Form 20B / Form 21B, e.g. `KA-BLR-DL-2024-88219`), cross-referenced with state licensing authorities.
  - Profile configuration: Registered store name, owner name, physical counter address, pincode, geo-coordinates, flat store discount percentage, and 24/7 night-duty toggle.
  - Unified switcher allows chemists and customers to switch between portals or sign out cleanly.

### 2. Distributor Purchase Bill OCR Scanner
* Chemist can upload paper purchase bills, scanned distributor invoices, or select standard pharmaceutical wholesaler presets (e.g., *GlaxoSmithKline*, *Cipla Logistics*, *Abbott Healthcare Stockists*).
* **Automatic Line-Item Extraction:**
  - Wholesaler Name, GSTIN, Drug License Number, Invoice Date & Number.
  - Medicine Brand Name & Generic Chemical Salt.
  - Batch Number (e.g., `AG-2024-B1`) & Expiry Date (auto-calculated date offsets).
  - Wholesale Purchase Cost & Maximum Retail Price (MRP).
  - Units/Strips Received.
* **1-Click Live Inventory Ingestion:**
  - Extracted items are presented in an editable review table.
  - Clicking **"Commit to My Pharmacy Inventory"** directly inserts or increments the stock for **that specific authenticated pharmacy** in real time!

### 3. Real-Time Hyperlocal Medicine Discovery
* **Instant Search:** Instant querying by medicine brand name (e.g., *Augmentin 625*, *Dolo 650*, *Pan-D*, *Azithral*) or active generic chemical salt (e.g., *Amoxicillin + Clavulanic Acid*, *Paracetamol*, *Pantoprazole*).
* **Therapeutic Filtering:** Multi-faceted categorization (*Antibiotic*, *Analgesic & Antipyretic*, *Gastrointestinal & GERD*, *Anti-Allergic & Asthma*, *Cardiovascular*, *OTC*).
* **Spatial Proximity:** Fast radius adjustment (1.0 km, 3.0 km, 5.0 km) based on spherical Haversine calculations.
* **24/7 Night Duty Filter:** Instant toggle to show only open retail counters certified for overnight shifts.

### 4. Multi-Item Basket Cost Optimizer & Generic Substitutes
* **Single-Shop Optimal Match:** Identifies the nearest verified pharmacy that has 100% of the patient's requested medicines in stock at the lowest net price after store discounts.
* **Split-Cart Savings Match:** When inventory discounts vary significantly (e.g., one pharmacy offers a 25% near-expiry liquidation discount on one drug, while another store has the remaining drugs in stock), the system computes an optimized 2-store split that saves the patient additional money (up to ₹150+).
* **Generic Bioequivalent Suggestions:** For high-cost branded formulations, the system automatically checks catalog bioequivalents (e.g., *Augmentin 625 Duo* ₹204.50 vs *Amoxyclav 625* ₹162.00; saving 21% with identical molecular therapeutic efficacy).

### 5. Doctor's Prescription Vision Reader (OCR)
* Patients can snap or upload a photo of a doctor's handwritten or printed prescription.
* Simulates advanced vision parsing:
  - Detects drug names and recommended quantities (e.g., 2 strips for a 7-day antibiotic course).
  - Flags **Schedule H / Schedule H1 safety notices** notifying the patient that a doctor's physical Rx must be presented at the counter.
  - Features 1-click **"Add All Detected Medicines to Basket"**.

### 6. 60-Minute Counter Reservation Slips & QR Price-Lock
* Generates a tamper-proof reservation slip with a scannable SVG QR code.
* **Verified Price-Lock Guarantee:** Locks in quoted unit prices, applied store discounts, and total savings for 60 minutes.
* **Live Countdown Timer:** Visual countdown timer displaying time remaining before reservation expiry.
* **Quick Simulation:** 1-click simulation button allows immediate preview in the Chemist countertop redemption scanner.

### 7. Chemist POS & Dynamic Expiry Discounting
* **Countertop QR Token Lookup:** Instant lookup of patient reservation slips via token or camera scanner.
* **Atomic Dispense & Inventory Deduction:** Dispensing an order automatically deducts the exact batch quantity from active store stock.
* **Dynamic Expiry Discounting (<60 Days Liquidation):**
  - Chemist dashboard highlights all medicines expiring within 60 days.
  - Chemists can apply aggressive liquidation discounts (e.g. 25%–35%) with one click to recover inventory capital before expiry.
* **Bulk Inventory CSV Ingestion:** Support for legacy pharmacy POS inventory import via CSV files.

### 8. Schedule H/H1 Regulatory Compliance Register
* Digital compliance log that automatically records every Schedule H and Schedule H1 medicine dispensed:
  - Timestamp & Date.
  - Patient Mobile / Name.
  - Dispensed Medicine Name, Batch Number, and Quantity.
  - Registered Doctor Registration Number (e.g., `KA-MED-49110`).
  - Dispensing Pharmacist Name & License ID.
* Enables zero-friction inspection readiness under the Drugs and Cosmetics Act 1940.

### 9. Verified Counter-Pickup Reviews
* Reviews cannot be posted anonymously or by bots.
* Only customers who have completed a physical in-store redemption with a verified estimate token can submit star ratings and counter experience feedback.

---

## 🎨 Design System: Clinical Teal & Clean Slate

The interface adheres to a modern, clinical, high-trust healthcare design system:
- **Clean Slate Backgrounds:** Slate-50 base surfaces (`#F8FAFC`), Slate-900 typography (`#0F172A`), and Slate-200 clinical card borders (`#E2E8F0`).
- **Clinical Teal Accent:** Deep Medical Teal (`#0D9488`, `#0F766E`) for primary interactive buttons, verified security badges, and active state indicators.
- **Typography:** Modern clean sans-serif typography (`Inter`, `Plus Jakarta Sans`) optimized for rapid scanning of medicine names, dosages, and prices.
- **Zero Sound Distraction:** All audio synthesizers and micro-interaction sounds have been eliminated for a focused, silent, and accessible user experience.

---

## 💻 Backend Technology & Architectural Design

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Runtime** | **Node.js (v18+ / v20+)** | Native ES Modules (`type: "module"`), async/await event-driven architecture |
| **HTTP Web Framework** | **Express.js 4.19.2** | High-throughput REST API server, modular middleware pipeline |
| **Geospatial Engine** | **Spherical Haversine Algorithm** | Distance computation matching PostGIS `ST_Distance` / `ST_DWithin` ($R = 6371\text{ km}$) |
| **Multipart Uploads** | **Multer 1.4.5-lts.1** | Streaming multipart/form-data parser for invoices, prescription images, and CSV files |
| **CORS Middleware** | **cors 2.8.5** | Configured for multi-origin security across local dev and production domains |
| **Static SPA Delivery** | **Express Static (`frontend/dist`)** | Serves compiled production Vite bundle with fallback routing (`/*` -> `index.html`) |
| **Port Resiliency** | **Dynamic Fallback Listener** | Self-healing port retry handler (`EADDRINUSE` triggers automatic increment to `PORT + 1`) |

---

## 🌐 External Servers, Databases & Third-Party Integrations

### 1. Database Architecture
* **In-Memory Operational Data Store (Development & Low-Latency Caching):**
  - High-speed relational stores for `medicines`, `pharmacies`, `inventory`, `estimates`, `compliance_logs`, and `reviews`.
  - Enables sub-15ms response latency for basket optimization and real-time inventory queries.
* **Production Database Compatibility:**
  - **PostgreSQL 15+ with PostGIS Extension:**
    - Structured tables: `users`, `pharmacies`, `medicines`, `pharmacy_inventory`, `estimates`, `estimate_items`, `compliance_logs`, `reviews`.
    - Geospatial column: `coordinates GEOGRAPHY(Point, 4326)` with `GIST` spatial index for millisecond radial queries:
      ```sql
      SELECT * FROM pharmacies 
      WHERE ST_DWithin(coordinates, ST_MakePoint(77.6412, 12.9716)::geography, 5000);
      ```

### 2. Document & OCR Vision Processing
* **Wholesaler Bill Parser:**
  - Built-in regex rule-engine extracting GSTIN, Batch, Expiry, Line Item quantities, and Wholesale pricing.
  - Production integration interface ready for **Google Cloud Vision API** / **AWS Textract** / **Tesseract OCR** for direct document scanning.
* **Doctor Prescription OCR:**
  - Multi-pass neural vision simulation recognizing handwritten clinical dosage lines (e.g. "Augmentin 625 Duo 1 tab BD x 5 days").

### 3. SMS & OTP Telephony Gateway Integration
* Production hooks configured for **Twilio**, **MSG91**, or **Fast2SMS** to deliver OTP authentication tokens directly to user mobile phones in accordance with TRAI DLT regulations.

### 4. Client-Side Rendering & Tooling
* **QRCode SVG (`qrcode.react`):** Real-time client-side generation of high-density QR codes for counter estimate slips.
* **Confetti Animations (`canvas-confetti`):** Micro-celebration visuals on invoice commitment, reservation creation, and review submission.
* **Lucide React (`lucide-react`):** Tree-shakable clean vector iconography.

---

## 📡 Complete REST API Reference

### 🔐 1. Authentication & Role Management

#### `POST /api/auth/customer-signup`
Registers a new customer using their mobile number.
* **Request Body:**
  ```json
  {
    "phone": "9845012345",
    "full_name": "Rahul Verma",
    "pincode": "560038",
    "lat": 12.9716,
    "lng": 77.6412
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Customer registered successfully.",
    "user": {
      "id": "cust-9845012345",
      "phone": "9845012345",
      "full_name": "Rahul Verma",
      "pincode": "560038",
      "lat": 12.9716,
      "lng": 77.6412,
      "role": "customer"
    }
  }
  ```

#### `POST /api/auth/customer-login`
Authenticates an existing customer via phone number and OTP code.
* **Request Body:**
  ```json
  {
    "phone": "9845012345",
    "otp": "1234"
  }
  ```
* **Response (200 OK):** Returns customer profile and authentication confirmation.

#### `POST /api/auth/chemist-register`
Registers a licensed retail pharmacy counter with Drug License verification.
* **Request Body:**
  ```json
  {
    "store_name": "Sanjivani 24/7 Medico & Chemist",
    "owner_name": "Chirag Sharma",
    "license_number": "KA-BLR-DL-2024-88219",
    "phone": "9845022334",
    "email": "sanjivani@medishop.in",
    "address": "Opp. Metro Pillar 42, CMH Road, Bengaluru",
    "pincode": "560038",
    "flat_store_discount": 14.0,
    "is_24_7": true
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Pharmacy registered and authenticated under Drug License KA-BLR-DL-2024-88219.",
    "pharmacy": {
      "id": "pharm-new-...",
      "store_name": "Sanjivani 24/7 Medico & Chemist",
      "license_number": "KA-BLR-DL-2024-88219",
      "flat_store_discount": 14.0,
      "is_24_7": true,
      "role": "chemist"
    }
  }
  ```

#### `POST /api/auth/chemist-login`
Authenticates a chemist by phone number or Drug License ID.
* **Request Body:**
  ```json
  {
    "phone_or_license": "KA-BLR-DL-2023-88219"
  }
  ```

---

### 🧾 2. Wholesaler Bill OCR & Inventory Management

#### `POST /api/chemist/invoice/ocr`
Scans and parses a distributor purchase invoice PDF/image or sample preset.
* **Request (Multipart Form or JSON):**
  - `sample_id`: `"wholesaler_gsk"` | `"sunpharma_invoice"` | `"cipla_invoice"`
  - `invoice_file`: Binary file upload (optional)
  - `pharmacy_id`: Associated pharmacy ID
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "invoice_metadata": {
      "invoice_number": "INV-GSK-90214",
      "distributor_name": "Vardhman Pharma Distributors Pvt. Ltd.",
      "distributor_dl": "KA-BLR-DL-WH-88902",
      "distributor_gst": "29AAAAA0000A1Z5",
      "invoice_date": "2026-11-23"
    },
    "line_items": [
      {
        "medicine_name": "Augmentin 625 Duo",
        "matched_med_id": "med-1",
        "generic_salt": "Amoxicillin (500mg) + Clavulanic Acid (125mg)",
        "batch_no": "AG-2024-B1",
        "expiry_date": "2027-11-18",
        "mrp": 204.50,
        "purchase_rate": 158.00,
        "quantity_received": 50,
        "discount_for_customer": 15.00
      }
    ]
  }
  ```

#### `POST /api/chemist/invoice/commit`
Commits verified invoice line items directly into that specific shop's live inventory.
* **Request Body:**
  ```json
  {
    "pharmacy_id": "pharm-1",
    "invoice_number": "INV-GSK-90214",
    "items": [
      {
        "matched_med_id": "med-1",
        "medicine_name": "Augmentin 625 Duo",
        "batch_no": "AG-2024-B1",
        "expiry_date": "2027-11-18",
        "quantity_received": 50,
        "mrp": 204.50,
        "discount_for_customer": 15.00
      }
    ]
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Successfully ingested 1 medicine batches into Sanjivani 24/7 Medico inventory.",
    "items_updated": 1
  }
  ```

---

### 💊 3. Catalog, Pharmacies & Geospatial Discovery

#### `GET /api/medicines`
Searches medicine catalog with therapeutic filters.
* **Query Parameters:**
  - `q`: Search keyword (brand name or generic chemical salt)
  - `category`: Therapeutic category (*Antibiotic*, *Analgesic*, *OTC*, etc.)
  - `schedule`: Regulatory class (*Schedule H*, *Schedule H1*, *OTC*)
* **Response (200 OK):** Returns array of matching medicine records.

#### `GET /api/pharmacies`
Discovers licensed retail pharmacies within a geospatial radius.
* **Query Parameters:**
  - `lat`: User latitude (default: `12.9716`)
  - `lng`: User longitude (default: `77.6412`)
  - `radius`: Distance radius in km (`1.0`, `3.0`, `5.0`)
  - `is_24_7`: Filter for 24/7 night duty counters (`true` | `false`)
* **Response (200 OK):** Returns pharmacies sorted by Haversine proximity with active discount rates and license details.

---

### 🛒 4. Basket Cost Optimizer & Estimate Slips

#### `POST /api/cart/estimate`
Computes real-time multi-item basket pricing, comparing single-store fulfillment vs split-cart clearance savings.
* **Request Body:**
  ```json
  {
    "user_lat": 12.9716,
    "user_lng": 77.6412,
    "radius_km": 5.0,
    "items": [
      { "id": "med-1", "qty": 2 },
      { "id": "med-3", "qty": 1 }
    ]
  }
  ```
* **Response (200 OK):**
  - `single_store_options`: Closest stores with stock availability, net cost, and savings.
  - `optimal_single_store`: Lowest net-cost pharmacy fulfilling 100% of items.
  - `split_basket_suggestion`: Multi-store split suggestion if clearance discounts save significant extra money.
  - `generic_substitutions`: Bioequivalent generic alternatives for requested items.

#### `POST /api/prescriptions/ocr`
Parses handwritten or printed doctor prescription images.
* **Request (Multipart Form or JSON):**
  - `sample_id`: Preset identifier (`"bronchitis"` | `"diabetes_gerd"` | `"cardiac_cholesterol"`)
  - `prescription_image`: Image file upload (optional)
* **Response (200 OK):** Returns detected line items, recommended quantities, and Schedule H prescription warnings.

#### `POST /api/estimates/create`
Creates a 60-minute locked reservation estimate slip.
* **Request Body:**
  ```json
  {
    "pharmacy_id": "pharm-1",
    "customer_name": "Rahul Verma",
    "customer_phone": "+91 98450 12345",
    "items": [
      { "id": "med-1", "qty": 2 }
    ]
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "estimate": {
      "id": "EST-894102",
      "pharmacy_id": "pharm-1",
      "pharmacy_name": "Sanjivani 24/7 Medico & Chemist",
      "total_mrp": 409.00,
      "total_discounted_price": 351.74,
      "total_savings": 57.26,
      "expires_at": "2026-11-23T18:30:00.000Z",
      "status": "active"
    }
  }
  ```

#### `GET /api/estimates/:id`
Retrieves estimate slip status and line items for countertop QR redemption.

#### `POST /api/estimates/verify-redeem`
Redeems an estimate slip, marks stock dispensed, and writes an entry into the Schedule H compliance register.
* **Request Body:**
  ```json
  {
    "estimate_id": "EST-894102",
    "chemist_name": "Chirag Sharma",
    "verified_doctor_reg_no": "KA-MED-49110"
  }
  ```

---

### 📦 5. Chemist POS, Inventory & Compliance

#### `GET /api/chemist/inventory/:pharmacyId`
Returns live medicine stock, batch numbers, expiry dates, and count of batches `<60 days` to expiry.

#### `POST /api/chemist/inventory/update-discount`
Overrides discount on near-expiry batches to accelerate stock liquidation.
* **Request Body:**
  ```json
  {
    "inventory_id": "inv-1",
    "override_discount": 25.0
  }
  ```

#### `GET /api/chemist/compliance-logs/:pharmacyId`
Retrieves timestamped audit trail of Schedule H / Schedule H1 medicines dispensed under the Drugs & Cosmetics Act.

#### `POST /api/reviews`
Submits a verified counter-pickup review. Requires a valid `estimate_token`.

#### `GET /api/reviews/:pharmacyId`
Fetches verified customer ratings and counter pickup reviews for a specific pharmacy.

#### `GET /api/health`
System diagnostic probe returning server latency, uptime, and module statuses.

---

## 🏗 System Architecture Flow

```
+-----------------------------------------------------------------------------------+
|                              PRESENTATION LAYER                                   |
|   +------------------------------------+   +----------------------------------+   |
|   |          Customer Portal           |   |       Medical Shop Owner         |   |
|   |  - Mobile Phone + OTP Signup       |   |  - Drug License (20B/21B) Auth   |   |
|   |  - Medicine Catalog Search         |   |  - Distributor Bill OCR Scanner  |   |
|   |  - Prescription OCR Vision Reader  |   |  - 1-Click Inventory Ingestion   |   |
|   |  - Multi-Item Basket Optimizer     |   |  - Countertop QR Slip Redemption |   |
|   |  - 60-Minute QR Estimate Slips     |   |  - Dynamic Expiry Discounting    |   |
|   +-----------------+------------------+   +-----------------+----------------+   |
+---------------------|----------------------------------------|--------------------+
                      | HTTPS / REST APIs                      |
                      v                                        v
+-----------------------------------------------------------------------------------+
|                           APPLICATION GATEWAY ENGINE                              |
|                    (Node.js Express Server • Port 5000)                           |
|  - Role-based Authentication Validation                                           |
|  - Multer Multipart Parser (Invoices & Prescriptions)                             |
|  - Ephemeral Memory / Data Protection Layer                                       |
+-----------------------------------------------------------------------------------+
       |                                      |                               |
       v                                      v                               v
+----------------------+   +------------------------------------+   +---------------+
|   GEOSPATIAL ENGINE  |   |       BASKET OPTIMIZER ENGINE      |   |  DUAL OCR     |
| - Haversine Distance |   | - Single-Shop Complete Fulfillment |   |  VISION       |
| - 1km, 3km, 5km Zones|   | - Split-Cart Savings Combination   |   | - Wholesaler  |
| - 24/7 Filter Match  |   | - Generic Bioequivalent Matcher    |   | - Prescription|
+----------------------+   +------------------------------------+   +---------------+
                                              |
                                              v
+-----------------------------------------------------------------------------------+
|                         DATA STORAGE & COMPLIANCE LAYER                           |
|  - In-Memory Relational Engine / PostgreSQL 15 + PostGIS Spatial Index            |
|  - Drugs and Cosmetics Act 1940 Form 20B/21B Inspection Logs                      |
|  - Schedule H & H1 Dispensing Digital Register                                    |
+-----------------------------------------------------------------------------------+
```

---

## 🚀 Installation & Getting Started

### Prerequisites
* **Node.js**: `v18.0.0` or higher (recommended: `v20.x LTS`)
* **npm**: `v9.0.0` or higher

### 1. Clone the Repository
```bash
git clone https://github.com/Nitin-1947/MediShop.git
cd MediShop
```

### 2. Install Dependencies
```bash
# Install root orchestration dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
cd ..
```

### 3. Run Unified Production Build & Server
```bash
# Builds React SPA with Vite and starts Express server serving both API & UI on port 5000
npm start
```
👉 Open your browser at: **`http://localhost:5000`**

### 4. Run in Development Mode (with Hot Reloading)
For concurrent local development with Vite HMR:
```bash
# Terminal 1: Backend API Server
npm run dev:backend

# Terminal 2: Frontend Vite Dev Server
npm run dev:frontend
```
👉 Open frontend dev server at: **`http://localhost:5173`**  
*(Vite automatically proxies `/api/*` calls to `http://localhost:5000`)*

### 5. Run Backend Integration Tests
Execute the comprehensive test suite verifying authentication, spatial radius queries, basket optimization, invoice OCR, and QR redemption:
```bash
node backend/test_api.js
```

---

## 📁 Project Directory Layout

```
medishop/
├── .gitignore                      # Git ignored files (node_modules, dist, uploads)
├── package.json                    # Root orchestration scripts
├── README.md                       # Comprehensive system documentation
│
├── backend/
│   ├── package.json                # Express, Multer, Cors backend dependencies
│   ├── server.js                   # Main Express application & REST API endpoints
│   ├── test_api.js                 # Automated API test suite
│   └── uploads/                    # Ephemeral upload folder for multipart files
│
└── frontend/
    ├── package.json                # React 18, Vite, Tailwind CSS dependencies
    ├── vite.config.js              # Vite bundler configuration & backend proxy
    ├── tailwind.config.js          # Clinical Teal & Clean Slate design tokens
    ├── postcss.config.js           # PostCSS Tailwind processor
    ├── index.html                  # HTML5 entry with metadata
    │
    └── src/
        ├── main.jsx                # React DOM root entry
        ├── App.jsx                 # Main application layout, routing & state
        ├── index.css               # Clinical utility classes & Tailwind directives
        │
        └── components/
            ├── Navbar.jsx                  # Top navigation, role switcher & modal triggers
            ├── AuthModal.jsx               # Customer OTP & Chemist Drug License auth modal
            ├── CustomerPortal.jsx          # Medicine search, catalog & pre-visit basket
            ├── ChemistDashboard.jsx        # Chemist store management & inventory tabs
            ├── ChemistBillOCRScanner.jsx   # Wholesaler purchase bill OCR reader & ingestion
            ├── PrescriptionOCRModal.jsx    # Doctor handwritten/printed Rx vision scanner
            ├── EstimateSlipModal.jsx       # 60-minute counter reservation slip with QR
            ├── VerifiedReviewsModal.jsx    # Verified counter-pickup review modal
            └── ArchitectureDiagrams.jsx    # Interactive system architecture visualization
```

---

## ⚖️ Regulatory & Legal Framework

1. **Drugs and Cosmetics Act, 1940 and Drugs and Cosmetics Rules, 1945:**
   - **Form 20B & Form 21B:** All retail pharmacies registered on Medishop Connect must authenticate with valid Drug Licenses issued by the State Drugs Control Department.
   - **Schedule H & Schedule H1 Drugs:** Cannot be sold without a valid prescription from a Registered Medical Practitioner (RMP). Medishop Connect enforces prescription warnings and logs dispensing doctor registration numbers.
2. **Digital Personal Data Protection Act (DPDP Act 2023):**
   - Prescriptions uploaded for OCR processing are ephemeral and processed in-memory.
   - Customer phone numbers and patient identities are masked and never shared with third parties without explicit authorization.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

**Developed with ❤️ for transparent, affordable, and accessible hyperlocal healthcare.**  
*GitHub Repository:* [Nitin-1947/MediShop](https://github.com/Nitin-1947/MediShop)
