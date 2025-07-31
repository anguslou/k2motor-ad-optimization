require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');

async function testWalmartSandbox() {
  console.log('🔗 Testing Walmart SANDBOX API...\n');
  
  const clientId = process.env.WALMART_CLIENT_ID;
  const clientSecret = process.env.WALMART_CLIENT_SECRET;
  
  // Try sandbox endpoints
  const sandboxBaseUrl = 'https://sandbox.walmartapis.com/v3';
  const sandboxTokenUrl = 'https://sandbox.walmartapis.com/v3/token';
  
  console.log('🔧 Testing Sandbox Environment:');
  console.log('Client ID:', clientId?.substring(0, 20) + '...');
  console.log('Token URL:', sandboxTokenUrl);
  console.log('API Base:', sandboxBaseUrl);
  
  try {
    // Step 1: Get sandbox OAuth token
    console.log('\n🔑 Getting sandbox OAuth token...');
    
    const correlationId = crypto.randomUUID();
    
    const tokenResponse = await axios.post(sandboxTokenUrl, 
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
    console.log('✅ Sandbox token obtained successfully');
    console.log('🕐 Expires in:', tokenResponse.data.expires_in, 'seconds');
    
    // Step 2: Test sandbox API call
    console.log('\n📡 Testing sandbox API endpoints...');
    
    try {
      const newCorrelationId = crypto.randomUUID();
      
      const apiResponse = await axios.get(`${sandboxBaseUrl}/orders`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'WM_SVC.NAME': 'Walmart Marketplace',
          'WM_QOS.CORRELATION_ID': newCorrelationId,
          'WM_SVC.VERSION': '1.0.0'
        },
        params: {
          'limit': 5
        }
      });
      
      console.log('✅ Sandbox Orders API Response Status:', apiResponse.status);
      console.log('✅ Orders found:', apiResponse.data?.elements?.length || 0);
      
      if (apiResponse.data?.elements?.length > 0) {
        console.log('📦 Sample order:', {
          id: apiResponse.data.elements[0].purchaseOrderId,
          date: apiResponse.data.elements[0].orderDate
        });
      }
      
      // Test items endpoint as well
      try {
        const itemsResponse = await axios.get(`${sandboxBaseUrl}/items`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
            'WM_SVC.NAME': 'Walmart Marketplace',
            'WM_QOS.CORRELATION_ID': crypto.randomUUID(),
            'WM_SVC.VERSION': '1.0.0'
          },
          params: {
            'limit': 5
          }
        });
        
        console.log('✅ Sandbox Items API Response Status:', itemsResponse.status);
        console.log('✅ Items found:', itemsResponse.data?.elements?.length || 0);
        
      } catch (itemsError) {
        console.log('❌ Items API failed:', itemsError.response?.status, itemsError.response?.data?.error?.[0]?.description);
      }
      
    } catch (apiError) {
      console.log('❌ Sandbox API call failed:');
      console.log('Status:', apiError.response?.status);
      console.log('Error:', apiError.response?.data?.error?.[0]?.description || apiError.message);
      
      if (apiError.response?.status === 401) {
        console.log('\n💡 Still unauthorized in sandbox - account setup needed');
      }
    }
    
  } catch (tokenError) {
    console.error('❌ Sandbox token generation failed:', tokenError.response?.data || tokenError.message);
  }
  
  console.log('\n🎯 Next Steps:');
  console.log('1. Check Walmart Partner Center for API approval status');
  console.log('2. Verify if account is set up for Marketplace API access');
  console.log('3. Ensure you have completed Walmart onboarding process');
}

testWalmartSandbox();