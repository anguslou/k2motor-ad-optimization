require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');

async function testWalmartSandboxFixed() {
  console.log('🔗 Testing Walmart SANDBOX API with Fixed Headers...\n');
  
  const clientId = process.env.WALMART_CLIENT_ID;
  const clientSecret = process.env.WALMART_CLIENT_SECRET;
  
  console.log('🔧 Configuration:');
  console.log('Client ID:', clientId?.substring(0, 20) + '...');
  console.log('Environment: Sandbox');
  console.log('Full API Access: ✅ ALL ENDPOINTS');
  
  // Try different authentication methods
  const authMethods = [
    {
      name: 'Standard Base64 OAuth',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'WM_SVC.NAME': 'Walmart Marketplace',
        'WM_QOS.CORRELATION_ID': crypto.randomUUID(),
        'WM_SVC.VERSION': '1.0.0'
      }
    },
    {
      name: 'Alternative Auth Format',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    },
    {
      name: 'Simplified Headers',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  ];
  
  for (const method of authMethods) {
    console.log(`\n🔑 Trying: ${method.name}`);
    
    try {
      const response = await axios.post(
        'https://sandbox.walmartapis.com/v3/token',
        'grant_type=client_credentials',
        {
          headers: method.headers,
          timeout: 10000
        }
      );
      
      console.log('✅ SUCCESS! Token obtained');
      console.log('Access Token:', response.data.access_token?.substring(0, 20) + '...');
      console.log('Expires in:', response.data.expires_in, 'seconds');
      
      // Test API call with the working token
      await testAPICall(response.data.access_token);
      return; // Success, exit the loop
      
    } catch (error) {
      console.log('❌ Failed:', error.response?.data?.error?.[0]?.description || error.message);
    }
  }
  
  console.log('\n💡 All authentication methods failed. This might indicate:');
  console.log('1. Sandbox keys need different endpoints');
  console.log('2. Account needs activation');
  console.log('3. Keys might be for production use only');
}

async function testAPICall(accessToken) {
  console.log('\n📡 Testing API endpoints with token...');
  
  const endpoints = [
    { name: 'Orders', url: '/orders', params: { limit: 1 } },
    { name: 'Items', url: '/items', params: { limit: 1 } },
    { name: 'Inventory', url: '/inventory', params: {} }
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n📋 Testing ${endpoint.name} API...`);
      
      const response = await axios.get(`https://sandbox.walmartapis.com/v3${endpoint.url}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'WM_SVC.NAME': 'Walmart Marketplace',
          'WM_QOS.CORRELATION_ID': crypto.randomUUID(),
          'WM_SVC.VERSION': '1.0.0'
        },
        params: endpoint.params
      });
      
      console.log(`✅ ${endpoint.name} API works!`);
      console.log('Response:', response.status, response.statusText);
      console.log('Data length:', JSON.stringify(response.data).length, 'characters');
      
      if (response.data?.elements?.length > 0) {
        console.log(`📦 Found ${response.data.elements.length} ${endpoint.name.toLowerCase()}`);
      }
      
    } catch (apiError) {
      console.log(`❌ ${endpoint.name} API failed:`, apiError.response?.status, apiError.response?.data?.error?.[0]?.description);
    }
  }
}

testWalmartSandboxFixed();