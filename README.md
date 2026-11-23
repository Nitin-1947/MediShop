# Medishop Connect 💊🏪
### Hyperlocal Medicine Discovery & Price Transparency Web Application

> **A friendly, fast, and smooth full-stack solution with a playful cartoon medical aesthetic, interactive architectural diagrams, real-time multi-item basket optimization, and Chemist POS compliance.**

---

## 🌟 Overview & Key Highlights

**Medishop Connect** eliminates the friction of searching for medicines across local Indian pharmacies. Instead of physically hopping from chemist to chemist in distress, customers can:
1. **Search Hyperlocally:** Real-time stock query by brand name, generic salt, or therapeutic category across 1 km, 3 km, or 5 km radius zones.
2. **AI Prescription OCR Scanner:** Upload handwritten or printed doctor prescriptions with automatic medicine, dosage, and Schedule H detection.
3. **Multi-Item Cart & Price Optimizer:**
   - **Single-Shop Complete Match:** Finds the nearest store with 100% of basket items in stock at the lowest net price.
   - **Split-Cart Savings Match:** Identifies when splitting items between two nearby stores saves significant money (up to ₹150+).
   - **Generic Substitute Suggestions:** Suggests cheaper bioequivalent substitutes (e.g., Augmentin ₹204 → Amoxyclav ₹162, save 21%).
4. **Digital Estimate Slip & 60-Minute QR Reservation:** Locks quoted prices against counter discrepancies and counter-inflation.
5. **Chemist Countertop Station:** POS CSV sync (Marg ERP, Vyapar), dynamic expiry discounting (<60 days), countertop QR token verification, and Schedule H/H1 regulatory logging under the **Drugs and Cosmetics Act, 1940**.

---

## 🎨 Cartoon Theme & Visual Assets

Designed with a playful, friendly, and approachable medical cartoon theme:
- **Dr. Capsule / Dr. Pill:** Cheerful mascot with head mirror, spectacles, and stethoscope.
- **Chemist Chirag Uncle:** Friendly Indian pharmacist with mustache, green apron, and clipboard.
- **Speedy Ambulance:** Cute emergency vehicle for night duty 24/7 discovery.
- **Cute Medicine Bottle & Scanner Bot:** Playful animated illustrations for Empty States and QR verification.
- **Interactive SVG Architecture Diagrams:** Clickable system nodes with live spec popups and data flow animations.
- **Web Audio Micro-interactions:** Gentle synthesised pops, chimes, and cash register dings (with one-click mute toggle).
- **Celebratory Confetti:** Interactive celebratory explosions when prices are locked or dispensed.

---

## 🏗️ System Architecture & Diagram

```
                                  +-----------------------+
                                  |    Customer Client    |
                                  | (React 18 + Tailwind) |
                                  +-----------+-----------+
                                              |
                                              | HTTPS / WSS
                                              v
+------------------------+        +-----------+-----------+        +------------------------+
|   OCR & Vision Engine  | <----> |  API Gateway & Server | <----> |   Geospatial Engine    |
| (Prescription Reader)  |        |    (Node / Express)   |        |  (Haversine / PostGIS) |
+------------------------+        +-----------+-----------+        +------------------------+
                                              |
                                              | JSON / SQL
                                              v
                                  +-----------+-----------+
                                  |  Master Medicine DB   |
                                  | (RLS, PostGIS, Index) |
                                  +-----------+-----------+
                                              ^
                                              | POS CSV / QR
                                  +-----------+-----------+
                                  |  Chemist POS & Portal |
                                  | (Marg ERP, Vyapar POS)|
                                  +-----------------------+
```

---

## 🚀 How to Run the Application

### 1. Unified Launch (Runs Backend + Built Frontend)
```bash
npm start
```
The server will boot in under 200ms and host the web application and API at:
👉 **`http://localhost:5000`**

### 2. Development Mode (Hot Reloading)
Open two terminal windows:
```bash
# Terminal 1: Backend Server
cd backend
npm run dev

# Terminal 2: Frontend Vite Dev Server
cd frontend
npm run dev
```
Open **`http://localhost:5173`** with hot module replacement (HMR) and automatic API proxying to `http://localhost:5000`.

### 3. Run Automated End-to-End Test Suite
```bash
node backend/test_api.js
```
Runs comprehensive assertions across:
- `GET /api/health`
- `GET /api/medicines`
- `GET /api/pharmacies`
- `POST /api/cart/estimate`
- `POST /api/prescriptions/ocr`
- `POST /api/estimates/create`
- `POST /api/estimates/verify-redeem`
- Single Page App HTML distribution

---

## ⚖️ Legal & DPDP Compliance

- **Drugs and Cosmetics Act, 1940:** Schedule H and H1 medications require mandatory verified doctor prescription attachment before dispensing; log entries record doctor registration numbers, patient details, and chemist signatures.
- **Digital Personal Data Protection (DPDP) Act, 2023:** Prescription image storage uses AES-256 cloud container standards with short-lived access links and a 7-day auto-purge policy.
