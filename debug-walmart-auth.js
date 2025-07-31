require('dotenv').config();
const axios = require('axios');

async function debugWalmartAuth() {
  console.log('🔍 Debugging Walmart Authentication...\n');
  
  const clientId = process.env.WALMART_CLIENT_ID;
  const clientSecret = process.env.WALMART_CLIENT_SECRET;
  
  console.log('📋 Credential Analysis:');
  console.log('Client ID:', clientId);
  console.log('Client ID Length:', clientId?.length);
  console.log('Client ID Format:', clientId?.match(/^[a-f0-9-]+$/i) ? 'UUID format' : 'Other format');
  console.log('Client Secret Length:', clientSecret?.length);
  console.log('Client Secret Format:', clientSecret?.includes('-') ? 'Contains dashes' : 'Base64-like');
  
  // Test different token URLs
  const tokenUrls = [
    'https://sandbox.walmartapis.com/v3/token',
    'https://marketplace.walmartapis.com/v3/token',
    'https://developer.walmart.com/api/v3/token',
    'https://api.walmart.com/v3/token'
  ];
  
  for (const tokenUrl of tokenUrls) {
    console.log(`\n🔗 Testing URL: ${tokenUrl}`);
    
    try {
      const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
      console.log('Auth String Length:', authString.length);
      
      const response = await axios.post(tokenUrl, 
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${authString}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          timeout: 5000
        }
      );
      
      console.log('✅ SUCCESS at', tokenUrl);
      console.log('Response:', response.data);
      return;
      
    } catch (error) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        console.log('❌ URL not reachable');
      } else if (error.response) {
        console.log('❌ HTTP Error:', error.response.status);
        console.log('   Error details:', error.response.data?.error?.[0]?.description || error.response.data);
      } else {
        console.log('❌ Network error:', error.message);
      }
    }
  }
  
  console.log('\n🤔 Possible Issues:');
  console.log('1. Sandbox keys might need activation/approval');
  console.log('2. Keys might be for a different environment');
  console.log('3. Account might need additional setup');
  console.log('4. Different authentication method required');
  
  console.log('\n📞 Next Steps:');
  console.log('1. Check if sandbox keys need activation in Developer Portal');
  console.log('2. Look for "Test API" or "Try It" button in Developer Portal');
  console.log('3. Contact Walmart developer support for sandbox setup');
}

debugWalmartAuth();