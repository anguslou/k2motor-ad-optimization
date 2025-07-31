const ChannelAdvisorConnector = require('../src/connectors/channeladvisor-connector');

describe('ChannelAdvisor Connector', () => {
  let connector;

  beforeEach(() => {
    // Mock environment variables
    process.env.CHANNELADVISOR_CLIENT_ID = 'test-client-id';
    process.env.CHANNELADVISOR_CLIENT_SECRET = 'test-client-secret';
    process.env.CHANNELADVISOR_REFRESH_TOKEN = 'test-refresh-token';
    process.env.CHANNELADVISOR_ACCOUNT_ID = 'test-account-id';
    
    connector = new ChannelAdvisorConnector();
  });

  test('should initialize with correct configuration', () => {
    expect(connector.baseUrl).toBe('https://api.channeladvisor.com/v1');
    expect(connector.clientId).toBe('test-client-id');
    expect(connector.clientSecret).toBe('test-client-secret');
    expect(connector.accountId).toBe('test-account-id');
  });

  test('should enforce read-only mode for updates', async () => {
    await expect(connector.updateProduct()).rejects.toThrow('Read-only mode: Product updates are disabled');
    await expect(connector.updateInventory()).rejects.toThrow('Read-only mode: Inventory updates are disabled');
    await expect(connector.updateOrder()).rejects.toThrow('Read-only mode: Order updates are disabled');
  });

  // Add more tests as needed
});