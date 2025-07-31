const { describe, it, expect, afterEach } = require('@jest/globals');
const AmazonMCPConnector = require('../src/connectors/amazon-mcp-connector');

describe('Amazon MCP Server Connection', () => {
  let connector;

  afterEach(() => {
    if (connector) {
      connector.disconnect();
    }
  });

  it('shouldConnectToAmazonMCPServer', async () => {
    // Arrange
    connector = new AmazonMCPConnector();
    
    // Act
    const isConnected = await connector.connect();
    
    // Assert
    expect(isConnected).toBe(true);
  });

  it('shouldRetrieveAmazonAccountData', async () => {
    // Arrange
    connector = new AmazonMCPConnector();
    await connector.connect();
    
    // Act
    const accountData = await connector.getAccountData();
    
    // Assert
    expect(accountData).toBeDefined();
    expect(accountData.sellerId).toBeDefined();
    expect(accountData.status).toBe('active');
  });

  it('shouldFetchAmazonListings', async () => {
    // Arrange
    connector = new AmazonMCPConnector();
    await connector.connect();
    
    // Act
    const listings = await connector.getListings();
    
    // Assert
    expect(listings).toBeDefined();
    expect(Array.isArray(listings)).toBe(true);
    expect(listings.length).toBeGreaterThan(0);
    expect(listings[0]).toHaveProperty('asin');
    expect(listings[0]).toHaveProperty('title');
  });

  it('shouldAnalyzeAmazonListingPerformance', async () => {
    // Arrange
    connector = new AmazonMCPConnector();
    await connector.connect();
    
    // Act
    const performance = await connector.getListingPerformance();
    
    // Assert
    expect(performance).toBeDefined();
    expect(Array.isArray(performance)).toBe(true);
    expect(performance.length).toBeGreaterThan(0);
    expect(performance[0]).toHaveProperty('asin');
    expect(performance[0]).toHaveProperty('metrics');
    expect(performance[0].metrics).toHaveProperty('impressions');
    expect(performance[0].metrics).toHaveProperty('clicks');
    expect(performance[0].metrics).toHaveProperty('orders');
  });

  it('shouldExtractAmazonCompetitorData', async () => {
    // Arrange
    connector = new AmazonMCPConnector();
    await connector.connect();
    
    // Act
    const competitorData = await connector.getCompetitorData('automotive parts');
    
    // Assert
    expect(competitorData).toBeDefined();
    expect(Array.isArray(competitorData)).toBe(true);
    expect(competitorData.length).toBeGreaterThan(0);
    expect(competitorData[0]).toHaveProperty('asin');
    expect(competitorData[0]).toHaveProperty('title');
    expect(competitorData[0]).toHaveProperty('price');
    expect(competitorData[0]).toHaveProperty('rating');
  });
});