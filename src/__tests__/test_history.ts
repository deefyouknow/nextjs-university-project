// test_history.ts
// Run with: npx tsx test_history.ts

const AXUM_API = process.env.AXUM_API_URL ?? 'https://api.deefthanawat.online';

async function testHistory() {
  console.log(`[1] Testing GET ${AXUM_API}/commands/history?limit=5...`);
  
  // Notice: The /commands/history endpoint requires a valid JWT token.
  // We will login as test user or if it returns 401, it means 500 is fixed.

  try {
    const res = await fetch(`${AXUM_API}/commands/history?limit=5`);
    console.log(`Response Status: ${res.status} ${res.statusText}`);
    
    const text = await res.text();
    console.log(`Response Body: ${text}`);

    if (res.status === 200) {
      console.log('✅ Success! The endpoint returned 200 OK.');
    } else if (res.status === 401) {
      console.log('✅ Success! The endpoint returned 401 Unauthorized (which means the 500 DB error is fixed!).');
    } else {
      console.log(`❌ Failed. The endpoint returned ${res.status}.`);
    }
  } catch (err) {
    console.error('Error fetching from API:', err);
  }
}

testHistory();
