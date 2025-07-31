#!/usr/bin/env node

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

async function searchWalmartAPI() {
  console.log('🔍 Searching Context7 for Walmart API information...\n');
  
  try {
    const transport = new SSEClientTransport(
      new URL('https://mcp.context7.com/sse')
    );

    const client = new Client({
      name: "walmart-api-search",
      version: "1.0.0"
    }, {
      capabilities: {}
    });

    console.log('Connecting to Context7...');
    await client.connect(transport);
    console.log('✅ Connected to Context7 MCP server!');

    // Search for Walmart API libraries
    console.log('\n🔍 Searching for Walmart API libraries...');
    
    const searchTerms = [
      'walmart marketplace api',
      'walmart developer',
      'walmart-api',
      'walmart marketplace',
      'walmart-sdk'
    ];
    
    for (const term of searchTerms) {
      console.log(`\n📚 Searching for: "${term}"`);
      
      try {
        const libraryResult = await client.callTool({
          name: 'resolve-library-id',
          arguments: {
            libraryName: term
          }
        });
        
        console.log('📖 Library search result:');
        console.log(libraryResult.content[0].text);
        
        // If we found a good match, get the documentation
        const content = libraryResult.content[0].text;
        if (content.includes('/') && !content.includes('No good matches')) {
          // Extract library ID from the response
          const libraryIdMatch = content.match(/\/[a-zA-Z0-9-_]+\/[a-zA-Z0-9-_]+/);
          if (libraryIdMatch) {
            const libraryId = libraryIdMatch[0];
            console.log(`\n📋 Getting documentation for: ${libraryId}`);
            
            try {
              const docsResult = await client.callTool({
                name: 'get-library-docs',
                arguments: {
                  libraryId: libraryId
                }
              });
              
              console.log('📚 Documentation found:');
              console.log(docsResult.content[0].text.substring(0, 1000) + '...');
              break; // Found good documentation, stop searching
            } catch (docsError) {
              console.log('❌ Failed to get docs:', docsError.message);
            }
          }
        }
        
      } catch (error) {
        console.log('❌ Search failed for', term, ':', error.message);
      }
    }

    await client.close();
    console.log('\n✅ Context7 Walmart search completed');

  } catch (error) {
    console.error('❌ Context7 search failed:', error);
  }
}

searchWalmartAPI();