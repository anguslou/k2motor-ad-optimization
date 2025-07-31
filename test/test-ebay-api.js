#!/usr/bin/env node

const axios = require('axios');
require('dotenv').config();

async function testEbayAPI() {
  console.log('🔍 Testing eBay API Endpoints...');
  console.log('=====================================');
  
  const token = process.env.EBAY_TOKEN;
  const baseURL = 'https://api.sandbox.ebay.com';
  
  console.log('🔑 Token exists:', !!token);
  console.log('🔑 Token length:', token?.length || 0);
  console.log('🌐 Base URL:', baseURL);
  
  // Test different endpoints to see which ones work
  const endpoints = [
    '/sell/account/v1/account',
    '/sell/inventory/v1/inventory_item',
    '/sell/marketing/v1/campaign',
    '/commerce/taxonomy/v1/category_tree/0',
    '/buy/browse/v1/item_summary/search?q=automotive',
    '/sell/fulfillment/v1/order'
  ];
  
  for (const endpoint of endpoints) {
    console.log(`\n📡 Testing: ${endpoint}`);
    
    try {
      const response = await axios({
        method: 'GET',
        url: `${baseURL}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
        },
        timeout: 10000
      });
      
      console.log(`✅ Success: ${response.status} - ${response.statusText}`);
      console.log(`📊 Response keys:`, Object.keys(response.data || {}));
      
      if (response.data && Object.keys(response.data).length > 0) {
        console.log(`📄 Sample data:`, JSON.stringify(response.data, null, 2).substring(0, 200) + '...');
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.response?.status || 'No status'}`);
      console.log(`💬 Message:`, error.response?.data?.errors?.[0]?.message || error.message);
      console.log(`🏷️  Error Code:`, error.response?.data?.errors?.[0]?.errorId || 'Unknown');
      
      if (error.response?.data?.errors?.[0]?.longMessage) {
        console.log(`📝 Details:`, error.response.data.errors[0].longMessage);
      }
    }
  }
  
  // Test token validity with a simple OAuth introspection
  console.log('\n🔍 Testing Token Validity...');
  try {
    const tokenInfo = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    console.log('📅 Token expires:', new Date(tokenInfo.exp * 1000).toISOString());
    console.log('🎯 Token scopes:', tokenInfo.scope || 'Not available');
  } catch (e) {
    console.log('⚠️  Could not parse token (might be older format)');
  }
  
  console.log('\n🏁 API Test Complete');
}

testEbayAPI().catch(console.error);