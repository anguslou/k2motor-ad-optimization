require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');

async function testWalmartSimple() {
  console.log('🔗 Simple Walmart API Test...\n');
  
  const clientId = process.env.WALMART_CLIENT_ID;
  const clientSecret = process.env.WALMART_CLIENT_SECRET;
  
  console.log('🔧 Configuration:');
  console.log('Client ID:', clientId?.substring(0, 20) + '...');
  console.log('Environment: Sandbox (testing mode)');
  
  try {
    // Step 1: Get OAuth token
    console.log('\n🔑 Getting OAuth token...');
    
    const correlationId = crypto.randomUUID();
    
    const tokenResponse = await axios.post('https://marketplace.walmartapis.com/v3/token', 
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'WM_SVC.NAME': 'Walmart Marketplace',
          'WM_QOS.CORRELATION_ID': correlationId,
          'WM_SVC.VERSION': '1.0.0'
        }
      }
    );
    
    const accessToken = tokenResponse.data.access_token;
    console.log('✅ Token obtained successfully');
    console.log('🕐 Expires in:', tokenResponse.data.expires_in, 'seconds');
    
    // Step 2: Test simple API call
    console.log('\n📡 Testing API endpoints...');
    
    // Try a simple endpoint that should work
    try {
      const newCorrelationId = crypto.randomUUID();
      
      const apiResponse = await axios.get('https://marketplace.walmartapis.com/v3/orders', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'WM_SVC.NAME': 'Walmart Marketplace',
          'WM_QOS.CORRELATION_ID': newCorrelationId,
          'WM_SVC.VERSION': '1.0.0'
        },
        params: {
          'limit': 5,
          'nextCursor': ''
        }
      });
      
      console.log('✅ Orders API Response Status:', apiResponse.status);
      console.log('✅ Orders found:', apiResponse.data?.elements?.length || 0);
      
      if (apiResponse.data?.elements?.length > 0) {
        console.log('📦 Sample order:', {
          id: apiResponse.data.elements[0].purchaseOrderId,
          date: apiResponse.data.elements[0].orderDate,
          status: apiResponse.data.elements[0].orderLines?.[0]?.orderLineStatuses?.[0]?.status
        });
      }
      
    } catch (apiError) {
      console.log('❌ API call failed:');
      console.log('Status:', apiError.response?.status);
      console.log('Error:', apiError.response?.data || apiError.message);
      
      // If we get specific errors, provide guidance
      if (apiError.response?.status === 401) {
        console.log('\n💡 Authentication issue - token might be invalid');
      } else if (apiError.response?.status === 403) {
        console.log('\n💡 Access denied - check if account has marketplace access');
      } else if (apiError.response?.status === 404) {
        console.log('\n💡 Endpoint not found - might be sandbox vs production issue');
      }
    }
    
  } catch (tokenError) {
    console.error('❌ Token generation failed:', tokenError.response?.data || tokenError.message);
    
    if (tokenError.response?.status === 401) {
      console.log('\n💡 Invalid credentials - check client ID and secret');
    }
  }
  
  console.log('\n✅ Walmart simple test completed');
}

testWalmartSimple();