#!/usr/bin/env node

const axios = require('axios');
const xml2js = require('xml2js');
require('dotenv').config();

async function testTradingAPI() {
  console.log('🔍 Testing eBay Trading API...');
  console.log('===============================');
  
  const credentials = {
    appId: process.env.EBAY_APP_ID,
    devId: process.env.EBAY_DEV_ID,
    certId: process.env.EBAY_CERT_ID,
    token: process.env.EBAY_TOKEN
  };
  
  console.log('🔑 Credentials check:');
  console.log('- App ID:', credentials.appId ? 'Present' : 'Missing');
  console.log('- Dev ID:', credentials.devId ? 'Present' : 'Missing');
  console.log('- Cert ID:', credentials.certId ? 'Present' : 'Missing');
  console.log('- Token:', credentials.token ? `Present (${credentials.token.length} chars)` : 'Missing');
  
  const requestXML = `<?xml version="1.0" encoding="utf-8"?>
<GeteBayOfficialTimeRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials>
    <eBayAuthToken>${credentials.token}</eBayAuthToken>
  </RequesterCredentials>
</GeteBayOfficialTimeRequest>`;
  
  console.log('\n📡 Making Trading API request...');
  
  try {
    const response = await axios({
      method: 'POST',
      url: 'https://api.sandbox.ebay.com/ws/api.dll',
      data: requestXML,
      headers: {
        'Content-Type': 'text/xml',
        'X-EBAY-API-COMPATIBILITY-LEVEL': '967',
        'X-EBAY-API-DEV-NAME': credentials.devId,
        'X-EBAY-API-APP-NAME': credentials.appId,
        'X-EBAY-API-CERT-NAME': credentials.certId,
        'X-EBAY-API-CALL-NAME': 'GeteBayOfficialTime',
        'X-EBAY-API-SITEID': '0'
      },
      timeout: 30000
    });
    
    console.log('✅ Trading API Response received');
    console.log('📊 Status:', response.status);
    console.log('📄 Response preview:', response.data.substring(0, 200) + '...');
    
    const result = await xml2js.parseStringPromise(response.data);
    console.log('🔍 Parsed response keys:', Object.keys(result));
    
    if (result.GeteBayOfficialTimeResponse) {
      const apiResponse = result.GeteBayOfficialTimeResponse;
      console.log('🎯 API Response keys:', Object.keys(apiResponse));
      
      if (apiResponse.Ack) {
        console.log('📋 Status:', apiResponse.Ack[0]);
      }
      
      if (apiResponse.Timestamp) {
        console.log('⏰ eBay Time:', apiResponse.Timestamp[0]);
      }
      
      if (apiResponse.Errors) {
        console.log('❌ Errors:', apiResponse.Errors);
      }
    }
    
  } catch (error) {
    console.log('❌ Trading API Error:', error.message);
    
    if (error.response) {
      console.log('📊 Status:', error.response.status);
      console.log('📄 Response:', error.response.data?.substring(0, 300) || 'No response data');
    }
    
    if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND') {
      console.log('🌐 Network connectivity issue detected');
    }
  }
  
  console.log('\n🏁 Trading API Test Complete');
}

testTradingAPI().catch(console.error);