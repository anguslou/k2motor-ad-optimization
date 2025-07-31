require('dotenv').config();
const WalmartConnector = require('../src/connectors/walmart-connector');

async function testWalmartConnection() {
  console.log('🔗 Testing Walmart Marketplace API Connection...\n');
  
  const connector = new WalmartConnector();
  
  try {
    // Test 1: Verify configuration
    console.log('🔧 Configuration Check:');
    console.log('Client ID:', connector.clientId?.substring(0, 20) + '...');
    console.log('Read-only mode:', connector.readOnlyMode);
    console.log('Allowed methods:', connector.allowedMethods);
    
    // Test 2: Get access token
    console.log('\n🔑 Testing OAuth token generation...');
    await connector.getAccessToken();
    
    // Test 3: Test API endpoints
    console.log('\n📡 Testing API endpoints...\n');
    
    // Test Orders API
    try {
      console.log('📋 Fetching orders...');
      const orders = await connector.getOrders({ limit: 5 });
      console.log('✅ Orders API works - Retrieved:', orders?.elements?.length || 0, 'orders');
      
      if (orders?.elements?.length > 0) {
        console.log('📦 Sample order:', {
          id: orders.elements[0].purchaseOrderId,
          status: orders.elements[0].orderLines?.[0]?.orderLineStatuses?.[0]?.status,
          date: orders.elements[0].orderDate
        });
      }
    } catch (error) {
      console.log('❌ Orders API:', error.response?.status, error.response?.data?.error?.description || error.message);
    }
    
    // Test Items API
    try {
      console.log('\n🛍️ Fetching items...');
      const items = await connector.getItems({ limit: 5 });
      console.log('✅ Items API works - Retrieved:', items?.elements?.length || 0, 'items');
      
      if (items?.elements?.length > 0) {
        console.log('📦 Sample item:', {
          sku: items.elements[0].sku,
          title: items.elements[0].productName?.substring(0, 50) + '...',
          status: items.elements[0].lifecycle
        });
      }
    } catch (error) {
      console.log('❌ Items API:', error.response?.status, error.response?.data?.error?.description || error.message);
    }
    
    // Test 4: Verify read-only protection
    console.log('\n🔒 Testing read-only protection...');
    try {
      await connector.updateOrder();
    } catch (error) {
      console.log('✅ Write protection works:', error.message);
    }
    
    try {
      await connector.makeRequest('/test', 'POST', {});
    } catch (error) {
      console.log('✅ POST requests blocked:', error.message);
    }
    
    console.log('\n🎉 Walmart connection test completed!');
    
  } catch (error) {
    console.error('❌ Walmart connection test failed:', error.message);
    
    if (error.response?.status === 401) {
      console.log('\n💡 Authentication failed - check credentials');
    } else if (error.response?.status === 403) {
      console.log('\n💡 Access denied - check API permissions');
    } else if (error.response?.data) {
      console.log('\n📋 API Error Details:', error.response.data);
    }
  }
}

testWalmartConnection();