require('dotenv').config();
const axios = require('axios');

async function checkWalmartAccountStatus() {
  console.log('🔍 Checking Walmart Account Status...\n');
  
  const clientId = process.env.WALMART_CLIENT_ID;
  const clientSecret = process.env.WALMART_CLIENT_SECRET;
  
  console.log('📋 Account Information:');
  console.log('Client ID:', clientId);
  console.log('Client ID Type:', clientId?.length > 30 ? 'Production/Sandbox' : 'Unknown format');
  
  // Check if we can get token (this confirms account exists)
  try {
    console.log('\n🔑 Testing OAuth Token Generation...');
    
    const response = await axios.post('https://marketplace.walmartapis.com/v3/token', 
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'WM_SVC.NAME': 'Walmart Marketplace',
          'WM_QOS.CORRELATION_ID': 'status-check-' + Date.now(),
          'WM_SVC.VERSION': '1.0.0'
        }
      }
    );
    
    console.log('✅ OAuth Token: Successfully generated');
    console.log('🕐 Token Lifetime:', response.data.expires_in, 'seconds');
    console.log('📊 Token Type:', response.data.token_type);
    
    return {
      hasValidCredentials: true,
      tokenGeneration: 'success',
      environment: 'production' // Default assumption
    };
    
  } catch (error) {
    console.log('❌ OAuth Token: Failed to generate');
    console.log('Error:', error.response?.data || error.message);
    
    return {
      hasValidCredentials: false,
      tokenGeneration: 'failed',
      error: error.response?.data
    };
  }
}

async function generateAccountStatusReport() {
  console.log('📊 Generating Walmart Account Status Report...\n');
  
  const status = await checkWalmartAccountStatus();
  
  console.log('\n📋 Account Status Report:');
  console.log('=' .repeat(50));
  console.log('OAuth Credentials:', status.hasValidCredentials ? '✅ Valid' : '❌ Invalid');
  console.log('Token Generation:', status.tokenGeneration === 'success' ? '✅ Working' : '❌ Failed');
  console.log('Environment:', status.environment || 'Unknown');
  
  if (status.hasValidCredentials) {
    console.log('\n🎯 Next Steps:');
    console.log('1. Your OAuth credentials are valid');
    console.log('2. Token generation is working');
    console.log('3. Need to request API access from Walmart');
    console.log('4. Current issue: 401 Unauthorized on API calls');
    
    console.log('\n📞 Contact Information Needed:');
    console.log('- Walmart Partner Center login credentials');
    console.log('- Seller account status');
    console.log('- Business registration details');
    
  } else {
    console.log('\n⚠️ Issues Found:');
    console.log('- OAuth credentials may be invalid');
    console.log('- Need to verify account setup');
  }
  
  return status;
}

generateAccountStatusReport();