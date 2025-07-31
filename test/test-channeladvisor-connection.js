require('dotenv').config();
const ChannelAdvisorConnector = require('../src/connectors/channeladvisor-connector');

async function testChannelAdvisorConnection() {
  console.log('🔗 Testing ChannelAdvisor API Connection...\n');
  
  const connector = new ChannelAdvisorConnector();
  
  try {
    // Test 1: Verify read-only mode
    console.log('🔒 Read-only mode:', connector.readOnlyMode);
    console.log('📋 Allowed scopes:', connector.allowedScopes);
    console.log('🆔 Account ID:', connector.accountId);
    console.log('🔑 Has refresh token:', !!connector.refreshToken);
    
    console.log('\n📡 Testing API endpoints...\n');
    
    // Test 2: Get inventory data
    try {
      console.log('📦 Fetching inventory data...');
      const inventory = await connector.getInventory();
      console.log('✅ Inventory API works - Retrieved', Object.keys(inventory).length, 'items');
    } catch (error) {
      console.log('❌ Inventory API:', error.message);
    }
    
    // Test 3: Get products data
    try {
      console.log('\n🛍️ Fetching products data...');
      const products = await connector.getProducts();
      console.log('✅ Products API works - Retrieved', products?.length || 0, 'products');
    } catch (error) {
      console.log('❌ Products API:', error.message);
    }
    
    // Test 4: Get orders data
    try {
      console.log('\n📋 Fetching orders data...');
      const orders = await connector.getOrders();
      console.log('✅ Orders API works - Retrieved', orders?.length || 0, 'orders');
    } catch (error) {
      console.log('❌ Orders API:', error.message);
    }
    
    // Test 5: Verify read-only protection
    console.log('\n🔒 Testing read-only protection...');
    try {
      await connector.updateProduct();
    } catch (error) {
      console.log('✅ Write protection works:', error.message);
    }
    
    console.log('\n🎉 ChannelAdvisor connection test completed!');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    
    if (error.response?.status === 401) {
      console.log('\n🔄 Token might be expired. Try refreshing...');
    }
  }
}

testChannelAdvisorConnection();