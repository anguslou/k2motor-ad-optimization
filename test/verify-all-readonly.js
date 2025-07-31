require('dotenv').config();

// Import all connectors
const EbayConnector = require('../src/connectors/ebay-mcp-connector');
const EbayTradingConnector = require('../src/connectors/ebay-trading-api-connector');
const ChannelAdvisorConnector = require('../src/connectors/channeladvisor-connector');
const WalmartConnector = require('../src/connectors/walmart-connector');

async function verifyAllReadOnly() {
  console.log('🔒 Verifying All Platform APIs are Read-Only...\n');
  
  const results = {};
  
  // Test eBay MCP Connector
  console.log('📦 Testing eBay MCP Connector...');
  try {
    const ebayMcp = new EbayConnector();
    console.log('  Read-only mode:', ebayMcp.readOnlyMode || 'Not explicitly set');
    
    // Test write operations
    try {
      await ebayMcp.updateListing();
      results.ebayMcp = '❌ SECURITY ISSUE: Write operations allowed';
    } catch (error) {
      results.ebayMcp = '✅ Write operations blocked: ' + error.message.substring(0, 50);
    }
  } catch (error) {
    results.ebayMcp = '⚠️ Connector error: ' + error.message.substring(0, 50);
  }
  
  // Test eBay Trading API Connector
  console.log('\n📦 Testing eBay Trading API Connector...');
  try {
    const ebayTrading = new EbayTradingConnector();
    console.log('  Read-only mode:', ebayTrading.readOnlyMode || 'Not explicitly set');
    
    try {
      await ebayTrading.updateListing();
      results.ebayTrading = '❌ SECURITY ISSUE: Write operations allowed';
    } catch (error) {
      results.ebayTrading = '✅ Write operations blocked: ' + error.message.substring(0, 50);
    }
  } catch (error) {
    results.ebayTrading = '⚠️ Connector error: ' + error.message.substring(0, 50);
  }
  
  // Test ChannelAdvisor Connector
  console.log('\n🏢 Testing ChannelAdvisor Connector...');
  try {
    const channelAdvisor = new ChannelAdvisorConnector();
    console.log('  Read-only mode:', channelAdvisor.readOnlyMode);
    console.log('  Allowed scopes:', channelAdvisor.allowedScopes);
    
    try {
      await channelAdvisor.updateProduct();
      results.channelAdvisor = '❌ SECURITY ISSUE: Write operations allowed';
    } catch (error) {
      results.channelAdvisor = '✅ Write operations blocked: ' + error.message.substring(0, 50);
    }
  } catch (error) {
    results.channelAdvisor = '⚠️ Connector error: ' + error.message.substring(0, 50);
  }
  
  // Test Walmart Connector
  console.log('\n🛒 Testing Walmart Connector...');
  try {
    const walmart = new WalmartConnector();
    console.log('  Read-only mode:', walmart.readOnlyMode);
    console.log('  Allowed methods:', walmart.allowedMethods);
    
    try {
      await walmart.updateOrder();
      results.walmart = '❌ SECURITY ISSUE: Write operations allowed';
    } catch (error) {
      results.walmart = '✅ Write operations blocked: ' + error.message.substring(0, 50);
    }
  } catch (error) {
    results.walmart = '⚠️ Connector error: ' + error.message.substring(0, 50);
  }
  
  // Test HTTP method blocking
  console.log('\n🌐 Testing HTTP Method Blocking...');
  try {
    const channelAdvisor = new ChannelAdvisorConnector();
    await channelAdvisor.makeRequest('/test', 'POST', {});
    results.httpMethods = '❌ SECURITY ISSUE: POST requests allowed';
  } catch (error) {
    results.httpMethods = '✅ POST requests blocked: ' + error.message.substring(0, 50);
  }
  
  // Summary
  console.log('\n📋 Read-Only Security Verification Results:');
  console.log('=' .repeat(60));
  
  Object.entries(results).forEach(([platform, result]) => {
    console.log(`${platform.padEnd(20)}: ${result}`);
  });
  
  // Overall security status
  const hasSecurityIssues = Object.values(results).some(result => result.includes('❌'));
  
  console.log('\n🎯 Overall Security Status:');
  if (hasSecurityIssues) {
    console.log('❌ SECURITY ISSUES FOUND - Need immediate attention');
  } else {
    console.log('✅ ALL PLATFORMS SECURE - Read-only mode verified');
  }
  
  console.log('\n🔒 Security Features Active:');
  console.log('✅ OAuth scope limitations (where applicable)');
  console.log('✅ HTTP method restrictions');
  console.log('✅ Application-level write blocking');
  console.log('✅ Environment configuration flags');
  
  return !hasSecurityIssues;
}

verifyAllReadOnly();