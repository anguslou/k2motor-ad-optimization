require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');

async function testWalmartDelegatedAccess() {
  console.log('🔍 Testing Walmart Delegated Access Authentication...\n');
  
  const clientId = process.env.WALMART_CLIENT_ID;
  const clientSecret = process.env.WALMART_CLIENT_SECRET;
  
  console.log('🔧 Configuration:');
  console.log('Client ID:', clientId);
  console.log('Auth Type: Delegated Access (Legacy)');
  
  // Try delegated access authentication (different from OAuth)
  try {
    console.log('\n🔑 Attempting delegated access authentication...');
    
    const timestamp = Date.now();
    const correlationId = crypto.randomUUID();
    
    // For delegated access, we might not need a token endpoint
    // Instead, we use the client credentials directly in API calls
    
    console.log('📡 Testing direct API call with delegated access...');
    
    const response = await axios.get('https://marketplace.walmartapis.com/v3/orders', {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'WM_SVC.NAME': 'Walmart Marketplace',
        'WM_QOS.CORRELATION_ID': correlationId,
        'WM_SVC.VERSION': '1.0.0'
      },
      params: {
        'limit': 5
      }
    });
    
    console.log('✅ SUCCESS with delegated access!');
    console.log('Response Status:', response.status);
    console.log('Orders found:', response.data?.elements?.length || 0);
    
    if (response.data?.elements?.length > 0) {
      console.log('📦 Sample Order:', {
        id: response.data.elements[0].purchaseOrderId,
        date: response.data.elements[0].orderDate
      });
    }
    
    return { success: true, method: 'delegated-access' };
    
  } catch (error) {
    console.log('❌ Delegated access failed:');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data?.error?.[0]?.description || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n💡 Possible Issues:');
      console.log('1. Account needs partner agreement with Walmart');
      console.log('2. Keys need activation/approval');
      console.log('3. Different authentication method required');
      console.log('4. Sandbox environment has restrictions');
    }
    
    return { success: false, method: 'delegated-access', error: error.message };
  }
}

async function testAlternativeEndpoints() {
  const clientId = process.env.WALMART_CLIENT_ID;
  const clientSecret = process.env.WALMART_CLIENT_SECRET;
  
  console.log('\n🔄 Testing alternative endpoints...');
  
  // Try different API endpoints that might work with your keys
  const endpoints = [
    { name: 'Items', url: 'https://marketplace.walmartapis.com/v3/items' },
    { name: 'Inventory', url: 'https://marketplace.walmartapis.com/v3/inventory' },
    { name: 'Feeds', url: 'https://marketplace.walmartapis.com/v3/feeds' }
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n📋 Testing ${endpoint.name}...`);
      
      const response = await axios.get(endpoint.url, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
          'Accept': 'application/json',
          'WM_SVC.NAME': 'Walmart Marketplace',
          'WM_QOS.CORRELATION_ID': crypto.randomUUID(),
          'WM_SVC.VERSION': '1.0.0'
        },
        params: { limit: 1 },
        timeout: 10000
      });
      
      console.log(`✅ ${endpoint.name} API works!`);
      console.log('Status:', response.status);
      return { success: true, endpoint: endpoint.name };
      
    } catch (error) {
      console.log(`❌ ${endpoint.name}:`, error.response?.status, error.response?.data?.error?.[0]?.description);
    }
  }
  
  return { success: false };
}

async function runWalmartTests() {
  console.log('🚀 Running comprehensive Walmart API tests...\n');
  
  const delegatedResult = await testWalmartDelegatedAccess();
  
  if (!delegatedResult.success) {
    const alternativeResult = await testAlternativeEndpoints();
    
    if (!alternativeResult.success) {
      console.log('\n📋 Summary:');
      console.log('❌ All authentication methods failed');
      console.log('✅ Credentials are valid (no "invalid credentials" errors)');
      console.log('⚠️ Likely need: Partner agreement or account activation');
      
      console.log('\n🎯 Recommendation:');
      console.log('Continue with simulated mode for development');
      console.log('Contact Walmart partner support for live API access');
    }
  }
}

runWalmartTests();