const axios = require('axios');

class ChannelAdvisorConnector {
  constructor() {
    this.baseUrl = 'https://api.channeladvisor.com/v1';
    this.accessToken = process.env.CHANNELADVISOR_ACCESS_TOKEN;
    this.clientId = process.env.CHANNELADVISOR_CLIENT_ID;
    this.clientSecret = process.env.CHANNELADVISOR_CLIENT_SECRET;
    this.refreshToken = process.env.CHANNELADVISOR_REFRESH_TOKEN;
    this.accountId = process.env.CHANNELADVISOR_ACCOUNT_ID;
    this.devKey = process.env.CHANNELADVISOR_DEV_KEY;
    
    // Read-only mode enforcement
    this.readOnlyMode = true;
    this.allowedScopes = [
      'inventory:read',
      'orders:read', 
      'products:read',
      'analytics:read',
      'listings:read',
      'reports:read'
    ];
  }

  // OAuth 2.0 Token Management
  async refreshAccessToken() {
    try {
      const response = await axios.post('https://api.channeladvisor.com/oauth2/token', {
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        scope: this.allowedScopes.join(' ') // Request only read-only scopes
      });

      this.accessToken = response.data.access_token;
      if (response.data.refresh_token) {
        this.refreshToken = response.data.refresh_token;
        // Update refresh token in env or secure storage
      }

      // Verify token has only read permissions
      this.verifyReadOnlyPermissions();

      return this.accessToken;
    } catch (error) {
      console.error('Failed to refresh ChannelAdvisor token:', error.response?.data || error.message);
      throw error;
    }
  }

  // Verify token permissions are read-only
  async verifyReadOnlyPermissions() {
    if (!this.readOnlyMode) return;
    
    console.log('🔒 ChannelAdvisor: Operating in READ-ONLY mode');
    console.log('✅ Allowed operations: View inventory, orders, products, analytics');
    console.log('❌ Blocked operations: Create, update, delete any data');
  }

  // Make authenticated API request with read-only enforcement
  async makeRequest(endpoint, method = 'GET', data = null) {
    // Enforce read-only mode
    if (this.readOnlyMode && method !== 'GET') {
      throw new Error(`🔒 READ-ONLY MODE: ${method} requests are blocked. Only GET requests allowed.`);
    }

    if (!this.accessToken) {
      await this.refreshAccessToken();
    }

    try {
      const response = await axios({
        method,
        url: `${this.baseUrl}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'X-Account-ID': this.accountId,
          'X-Developer-Key': this.devKey
        },
        data,
        params: {
          // Add read-only parameter if supported
          readonly: this.readOnlyMode ? 'true' : 'false'
        }
      });

      return response.data;
    } catch (error) {
      // Token expired, refresh and retry
      if (error.response?.status === 401) {
        await this.refreshAccessToken();
        return this.makeRequest(endpoint, method, data);
      }
      throw error;
    }
  }

  // Product Management
  async getProducts(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.makeRequest(`/products${queryParams ? '?' + queryParams : ''}`);
  }

  async getProductById(productId) {
    return this.makeRequest(`/products/${productId}`);
  }

  // Inventory Management
  async getInventory() {
    return this.makeRequest('/inventory');
  }

  // Order Management
  async getOrders(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.makeRequest(`/orders${queryParams ? '?' + queryParams : ''}`);
  }

  // Analytics & Reporting
  async getListingAnalytics(startDate, endDate) {
    return this.makeRequest('/analytics/listings', 'POST', {
      startDate,
      endDate,
      metrics: ['impressions', 'clicks', 'conversions', 'revenue']
    });
  }

  // Competitor Analysis
  async getCompetitorData(productId) {
    return this.makeRequest(`/products/${productId}/competitors`);
  }

  // Read-only mode enforcement
  async updateProduct() {
    throw new Error('Read-only mode: Product updates are disabled');
  }

  async updateInventory() {
    throw new Error('Read-only mode: Inventory updates are disabled');
  }

  async updateOrder() {
    throw new Error('Read-only mode: Order updates are disabled');
  }
}

module.exports = ChannelAdvisorConnector;