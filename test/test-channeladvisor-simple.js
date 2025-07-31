require('dotenv').config();
const axios = require('axios');

async function testChannelAdvisorSimple() {
  console.log('🔗 Simple ChannelAdvisor API Test...\n');
  
  const accessToken = process.env.CHANNELADVISOR_ACCESS_TOKEN;
  const accountId = process.env.CHANNELADVISOR_ACCOUNT_ID;
  const devKey = process.env.CHANNELADVISOR_DEV_KEY;
  
  console.log('🆔 Account ID:', accountId);
  console.log('🔑 Access Token (first 20 chars):', accessToken?.substring(0, 20));
  console.log('🔧 Dev Key (first 20 chars):', devKey?.substring(0, 20));
  
  try {
    // Test simple API call
    console.log('\n📡 Testing basic API call...');
    
    const response = await axios.get('https://api.channeladvisor.com/v1/Products', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Account-ID': accountId
      },
      params: {
        '$top': 5 // Limit to 5 items for testing
      }
    });
    
    console.log('✅ API Response Status:', response.status);
    console.log('✅ Products found:', response.data?.value?.length || 0);
    
    if (response.data?.value?.length > 0) {
      console.log('📦 Sample product:', {
        id: response.data.value[0].ID,
        title: response.data.value[0].Title?.substring(0, 50) + '...',
        sku: response.data.value[0].Sku
      });
    }
    
  } catch (error) {
    console.error('❌ API Test Failed:');
    console.error('Status:', error.response?.status);
    console.error('Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n💡 Token might be expired or invalid');
      console.log('   Try regenerating tokens in ChannelAdvisor Developer Console');
    }
    
    if (error.response?.status === 400) {
      console.log('\n💡 Request format might be incorrect');
      console.log('   Check API documentation for proper endpoint format');
    }
  }
}

testChannelAdvisorSimple();