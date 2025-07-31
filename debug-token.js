#!/usr/bin/env node

require('dotenv').config();

console.log('🔍 Debugging Token Loading...');
console.log('============================');

console.log('Raw process.env.EBAY_TOKEN:');
console.log('"' + process.env.EBAY_TOKEN + '"');
console.log('Length:', process.env.EBAY_TOKEN?.length || 0);

console.log('\nFirst 100 characters:');
console.log(process.env.EBAY_TOKEN?.substring(0, 100) || 'undefined');

console.log('\nLast 100 characters:');
const token = process.env.EBAY_TOKEN;
if (token && token.length > 100) {
  console.log(token.substring(token.length - 100));
} else {
  console.log('Token too short');
}

console.log('\nAll environment variables starting with EBAY:');
Object.keys(process.env).forEach(key => {
  if (key.startsWith('EBAY')) {
    console.log(`${key}: "${process.env[key]?.substring(0, 50)}..."`);
  }
});