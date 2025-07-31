#!/usr/bin/env node

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

async function searchWalmartAPIDetailed() {
  console.log('🔍 Searching Context7 for Walmart API authentication details...\n');
  
  try {
    const transport = new SSEClientTransport(
      new URL('https://mcp.context7.com/sse')
    );

    const client = new Client({
      name: "walmart-auth-search",
      version: "1.0.0"
    }, {
      capabilities: {}
    });

    console.log('Connecting to Context7...');
    await client.connect(transport);
    console.log('✅ Connected to Context7 MCP server!');

    // Search for specific Walmart API authentication topics
    const searchQueries = [
      'walmart marketplace oauth authentication',
      'walmart api authorization header',
      'walmart developer portal api keys',
      'walmart marketplace rest api',
      'walmart api client credentials'
    ];
    
    for (const query of searchQueries) {
      console.log(`\n🔍 Searching: "${query}"`);
      
      try {
        const result = await client.callTool({
          name: 'resolve-library-id',
          arguments: {
            libraryName: query
          }
        });
        
        const content = result.content[0].text;
        console.log('📚 Search Results:');
        console.log(content);
        
        // If we find a specific library, get its documentation
        const libraryMatch = content.match(/\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+/);
        if (libraryMatch && !content.includes('No good matches')) {
          const libraryId = libraryMatch[0];
          console.log(`\n📖 Getting documentation for: ${libraryId}`);
          
          try {
            const docs = await client.callTool({
              name: 'get-library-docs',
              arguments: {
                context7CompatibleLibraryID: libraryId
              }
            });
            
            console.log('📄 Documentation excerpt:');
            console.log(docs.content[0].text.substring(0, 800) + '...\n');
            
          } catch (docError) {
            console.log('❌ Failed to get docs:', docError.message);
          }
        }
        
      } catch (error) {
        console.log('❌ Search failed:', error.message);
      }
      
      // Add delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    await client.close();
    console.log('\n✅ Context7 search completed');

  } catch (error) {
    console.error('❌ Context7 connection failed:', error);
  }
}

searchWalmartAPIDetailed();