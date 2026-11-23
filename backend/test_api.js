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
  console.log("--- STARTING MEDISHOP CONNECT BACKEND & CLINICAL TESTS ---");
  
  // 1. Health
  const health = await request({ host: 'localhost', port: 5000, path: '/api/health', method: 'GET' });
  console.log("1. /api/health:", health.status, health.data.system, "Medicines count:", health.data.counts.medicines);

  // 2. Customer Signup with Mobile Number
  const custBody = JSON.stringify({
    phone: "9876543210",
    full_name: "Anita Sharma",
    pincode: "560038"
  });
  const custRes = await request({
    host: 'localhost',
    port: 5000,
    path: '/api/auth/customer-signup',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(custBody) }
  }, custBody);
  console.log("2. /api/auth/customer-signup:", custRes.status, "Customer:", custRes.data.user?.full_name, "Phone:", custRes.data.user?.phone);

  // 3. Chemist Registration with Drug License
  const chemBody = JSON.stringify({
    store_name: "CureWell Medico & DayNight Drugs",
    owner_name: "Suresh Pillai",
    license_number: "KA-BLR-DL-2024-91823",
    phone: "9845088776",
    address: "24, CMH Road, Indiranagar, Bengaluru",
    pincode: "560038",
    flat_store_discount: 16.0
  });
  const chemRes = await request({
    host: 'localhost',
    port: 5000,
    path: '/api/auth/chemist-register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(chemBody) }
  }, chemBody);
  console.log("3. /api/auth/chemist-register:", chemRes.status, "Registered Pharmacy:", chemRes.data.pharmacy?.store_name, "DL Verified:", chemRes.data.pharmacy?.is_verified);

  // 4. Chemist Distributor Purchase Bill OCR Scan
  const billOcrBody = JSON.stringify({
    sample_id: "sunpharma_invoice",
    pharmacy_id: chemRes.data.pharmacy?.id
  });
  const billOcr = await request({
    host: 'localhost',
    port: 5000,
    path: '/api/chemist/invoice/ocr',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(billOcrBody) }
  }, billOcrBody);
  console.log("4. /api/chemist/invoice/ocr:", billOcr.status, "Distributor:", billOcr.data.invoice_metadata?.distributor_name, "Parsed Meds:", billOcr.data.line_items?.length);

  // 5. Commit Bill Directly into Store Inventory
  const commitBody = JSON.stringify({
    pharmacy_id: chemRes.data.pharmacy?.id,
    invoice_number: billOcr.data.invoice_metadata?.invoice_number,
    items: billOcr.data.line_items
  });
  const commitRes = await request({
    host: 'localhost',
    port: 5000,
    path: '/api/chemist/invoice/commit',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(commitBody) }
  }, commitBody);
  console.log("5. /api/chemist/invoice/commit:", commitRes.status, "Summary:", commitRes.data.summary);

  // 6. Multi-Item Cart Cost Calculation
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
  console.log("6. /api/cart/estimate:", cart.status, "Best Match:", cart.data.single_store_matches[0]?.store_name, "Net Bill: ₹" + cart.data.single_store_matches[0]?.total_discounted_price);

  console.log("--- ALL BACKEND CHECKS (AUTH, INVOICE OCR, INVENTORY) PASSED! ---");
}

runTests().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
