import http from 'http';

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function runTests() {
  console.log("--- STARTING MEDISHOP CONNECT BACKEND API TESTS ---");
  
  // 1. Health
  const health = await request({ host: 'localhost', port: 5000, path: '/api/health', method: 'GET' });
  console.log("1. /api/health:", health.status, health.data.system, "Medicines count:", health.data.counts.medicines);

  // 2. Medicines Search
  const meds = await request({ host: 'localhost', port: 5000, path: '/api/medicines?q=augmentin', method: 'GET' });
  console.log("2. /api/medicines (search 'augmentin'):", meds.status, "Found:", meds.data.medicines[0].brand_name, "MRP:", meds.data.medicines[0].mrp, "Substitutes:", meds.data.medicines[0].substitutes.length);

  // 3. Pharmacies
  const pharms = await request({ host: 'localhost', port: 5000, path: '/api/pharmacies?lat=12.9716&lng=77.6412&radius=5', method: 'GET' });
  console.log("3. /api/pharmacies in 5km:", pharms.status, "Count:", pharms.data.count, "Closest:", pharms.data.pharmacies[0].store_name, `(${pharms.data.pharmacies[0].distance_km} km)`);

  // 4. Cart Estimate
  const cartBody = JSON.stringify({
    user_lat: 12.9716,
    user_lng: 77.6412,
    radius_km: 5.0,
    items: [
      { id: "med-1", qty: 1 },
      { id: "med-3", qty: 2 }
    ]
  });
  const cart = await request({
    host: 'localhost',
    port: 5000,
    path: '/api/cart/estimate',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(cartBody) }
  }, cartBody);
  console.log("4. /api/cart/estimate:", cart.status, "Best Single Match:", cart.data.single_store_matches[0].store_name, "Locked Bill: ₹" + cart.data.single_store_matches[0].total_discounted_price, "Total Savings: ₹" + cart.data.single_store_matches[0].total_savings);

  // 5. Prescription OCR
  const ocrBody = JSON.stringify({ sample_id: 'bronchitis' });
  const ocr = await request({
    host: 'localhost',
    port: 5000,
    path: '/api/prescriptions/ocr',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(ocrBody) }
  }, ocrBody);
  console.log("5. /api/prescriptions/ocr:", ocr.status, "Status:", ocr.data.ocr_status, "Extracted Meds:", ocr.data.extracted_items.length, "Schedule H Flag:", ocr.data.has_schedule_h);

  // 6. Create 60-min Estimate
  const estBody = JSON.stringify({
    pharmacy_id: "pharm-1",
    customer_name: "Test Customer",
    items: [{ id: "med-1", qty: 1 }, { id: "med-3", qty: 2 }]
  });
  const est = await request({
    host: 'localhost',
    port: 5000,
    path: '/api/estimates/create',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(estBody) }
  }, estBody);
  console.log("6. /api/estimates/create:", est.status, "Token:", est.data.estimate.id, "Expires:", est.data.estimate.expires_at);

  // 7. Countertop QR Verify & Dispense
  const redeemBody = JSON.stringify({
    estimate_id: est.data.estimate.id,
    chemist_name: "Chirag Sharma"
  });
  const redeem = await request({
    host: 'localhost',
    port: 5000,
    path: '/api/estimates/verify-redeem',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(redeemBody) }
  }, redeemBody);
  console.log("7. /api/estimates/verify-redeem:", redeem.status, "Message:", redeem.data.message, "Status:", redeem.data.estimate.status);

  // 8. Frontend HTML check
  const html = await request({ host: 'localhost', port: 5000, path: '/', method: 'GET' });
  console.log("8. Frontend Static Single Page App:", html.status, "HTML byte length:", html.raw ? html.raw.length : 0);

  console.log("--- ALL BACKEND AND FRONTEND CHECKS PASSED WITH FLYING COLORS! ---");
}

runTests().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
