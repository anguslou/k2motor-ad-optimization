require('dotenv').config();
const axios = require('axios');

async function debugChannelAdvisorToken() {
  console.log('🔍 Debugging ChannelAdvisor Token Issue...\n');
  
  const refreshToken = process.env.CHANNELADVISOR_REFRESH_TOKEN;
  const clientId = process.env.CHANNELADVISOR_CLIENT_ID;
  const clientSecret = process.env.CHANNELADVISOR_CLIENT_SECRET;
  
  console.log('🔧 Configuration:');
  console.log('Client ID:', clientId);
  console.log('Client Secret (first 10):', clientSecret?.substring(0, 10));
  console.log('Refresh Token (first 20):', refreshToken?.substring(0, 20));
  
  // Try different token refresh approaches
  const attempts = [
    {
      name: 'Standard OAuth2 Flow',
      data: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret
      }
    },
    {
      name: 'With Scope Parameter',
      data: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
        scope: 'inventory orders'
      }
    }
  ];
  
  for (const attempt of attempts) {
    console.log(`\n📡 Trying: ${attempt.name}`);
    
    try {
      const response = await axios.post('https://api.channeladvisor.com/oauth2/token', attempt.data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Success!');
      console.log('Access Token:', response.data.access_token);
      console.log('Expires In:', response.data.expires_in);
      return response.data;
      
    } catch (error) {
      console.log('❌ Failed:');
      console.log('Status:', error.response?.status);
      console.log('Error:', error.response?.data || error.message);
    }
  }
  
  console.log('\n💡 All automatic attempts failed.');
  console.log('Please check your ChannelAdvisor Developer Console for:');
  console.log('1. Current access token');
  console.log('2. Token expiration status');
  console.log('3. Integration status');
}

debugChannelAdvisorToken();