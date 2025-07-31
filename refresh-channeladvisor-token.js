require('dotenv').config();
const axios = require('axios');

async function refreshChannelAdvisorToken() {
  console.log('🔄 Refreshing ChannelAdvisor Access Token...\n');
  
  const refreshToken = process.env.CHANNELADVISOR_REFRESH_TOKEN;
  const clientId = process.env.CHANNELADVISOR_CLIENT_ID;
  const clientSecret = process.env.CHANNELADVISOR_CLIENT_SECRET;
  
  try {
    const response = await axios.post('https://api.channeladvisor.com/oauth2/token', {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret
    });
    
    console.log('✅ Token refresh successful!');
    console.log('New Access Token:', response.data.access_token);
    console.log('Token Type:', response.data.token_type);
    console.log('Expires In:', response.data.expires_in, 'seconds');
    
    if (response.data.refresh_token) {
      console.log('New Refresh Token:', response.data.refresh_token);
    }
    
    console.log('\n📝 Update your .env file with:');
    console.log(`CHANNELADVISOR_ACCESS_TOKEN=${response.data.access_token}`);
    
    if (response.data.refresh_token) {
      console.log(`CHANNELADVISOR_REFRESH_TOKEN=${response.data.refresh_token}`);
    }
    
  } catch (error) {
    console.error('❌ Token refresh failed:');
    console.error('Status:', error.response?.status);
    console.error('Error:', error.response?.data || error.message);
    
    console.log('\n💡 Manual refresh needed:');
    console.log('1. Go to ChannelAdvisor Developer Console');
    console.log('2. Find your K2Motor application');
    console.log('3. Click "View Refresh Token" or "Regenerate"');
    console.log('4. Copy the new access token');
  }
}

refreshChannelAdvisorToken();