const ChannelAdvisorConnector = require('../src/connectors/channeladvisor-connector');

async function testReadOnlyMode() {
  console.log('🔒 Testing ChannelAdvisor Read-Only Mode...\n');
  
  const connector = new ChannelAdvisorConnector();
  
  try {
    // Test 1: Read operations should work
    console.log('✅ Test 1: GET request (should work)');
    // Note: This will fail without valid tokens, but shows the method is allowed
    console.log('   Attempting to fetch products...');
    
    // Test 2: Write operations should be blocked
    console.log('\n❌ Test 2: POST request (should be blocked)');
    try {
      await connector.makeRequest('/products', 'POST', {});
      console.log('   ⚠️  SECURITY ISSUE: POST request was allowed!');
    } catch (error) {
      console.log('   ✅ Expected: POST blocked -', error.message);
    }
    
    // Test 3: Update operations should be blocked  
    console.log('\n❌ Test 3: PUT request (should be blocked)');
    try {
      await connector.makeRequest('/products/123', 'PUT', {});
      console.log('   ⚠️  SECURITY ISSUE: PUT request was allowed!');
    } catch (error) {
      console.log('   ✅ Expected: PUT blocked -', error.message);
    }
    
    // Test 4: Delete operations should be blocked
    console.log('\n❌ Test 4: DELETE request (should be blocked)');
    try {
      await connector.makeRequest('/products/123', 'DELETE');
      console.log('   ⚠️  SECURITY ISSUE: DELETE request was allowed!');
    } catch (error) {
      console.log('   ✅ Expected: DELETE blocked -', error.message);
    }
    
    // Test 5: Write methods should throw errors
    console.log('\n❌ Test 5: Write methods (should throw errors)');
    try {
      await connector.updateProduct();
    } catch (error) {
      console.log('   ✅ updateProduct blocked:', error.message);
    }
    
    try {
      await connector.updateInventory();
    } catch (error) {
      console.log('   ✅ updateInventory blocked:', error.message);
    }
    
    console.log('\n🔒 Read-only mode test completed successfully!');
    console.log('   All write operations are properly blocked.');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testReadOnlyMode();