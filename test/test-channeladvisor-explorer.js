require('dotenv').config();
const axios = require('axios');

async function testChannelAdvisorExplorerAPI() {
  console.log('🔗 Testing ChannelAdvisor API with Explorer Format...\n');
  
  const accessToken = process.env.CHANNELADVISOR_ACCESS_TOKEN;
  const accountId = process.env.CHANNELADVISOR_ACCOUNT_ID;
  
  console.log('🆔 Account ID:', accountId);
  console.log('🔑 Access Token:', accessToken);
  
  try {
    // Test the exact API call from the Explorer
    console.log('\n📡 Testing Orders API (from Explorer)...');
    
    const response = await axios.get('https://api.channeladvisor.com/v1/Orders', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      params: {
        'exported': 'false' // Same as the Explorer
      }
    });
    
    console.log('✅ API Response Status:', response.status);
    console.log('✅ Orders found:', response.data?.value?.length || 0);
    
    if (response.data?.value?.length > 0) {
      console.log('📦 Sample order:', {
        id: response.data.value[0].ID,
        createdDate: response.data.value[0].CreatedDateUtc,
        status: response.data.value[0].CheckoutStatus
      });
    }
    
    return response.data;
    
  } catch (error) {
    console.error('❌ API Test Failed:');
    console.error('Status:', error.response?.status);
    console.error('Error:', error.response?.data || error.message);
    
    // Try a different approach - check if account ID is needed as header
    if (error.response?.status === 401) {
      console.log('\n🔄 Trying with Account ID header...');
      
      try {
        const response2 = await axios.get('https://api.channeladvisor.com/v1/Orders', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'CA-Account-ID': accountId
          },
          params: {
            'exported': 'false'
          }
        });
        
        console.log('✅ Success with Account ID header!');
        console.log('Orders found:', response2.data?.value?.length || 0);
        return response2.data;
        
      } catch (error2) {
        console.error('❌ Also failed with Account ID header:', error2.response?.status);
      }
    }
  }
}

testChannelAdvisorExplorerAPI();