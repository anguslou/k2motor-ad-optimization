const { spawn } = require('child_process');
const path = require('path');
const EbayRestConnector = require('./ebay-rest-connector');
const EbayTradingApiConnector = require('./ebay-trading-api-connector');

class EbayMCPConnector {
  constructor() {
    this.mcpServerPath = '/Volumes/SSD/MCP/ebay-mcp-server/target/CDataMCP-jar-with-dependencies.jar';
    this.configPath = '/Volumes/SSD/MCP/ebay-mcp-server/ebay.prp';
    this.javaHome = '/opt/homebrew/Cellar/openjdk/24.0.1/libexec/openjdk.jdk/Contents/Home';
    this.serverProcess = null;
    this.readOnlyMode = true; // Force read-only mode
    this.allowedOperations = ['SELECT', 'SHOW', 'DESCRIBE', 'EXPLAIN'];
    
    // Initialize connectors
    this.restConnector = new EbayRestConnector();
    this.tradingApiConnector = new EbayTradingApiConnector();
    this.useTradingApi = true; // Use Trading API for traditional tokens
  }

  async connect() {
    if (this.useTradingApi) {
      // Use Trading API connector with traditional token
      console.log('🔄 Using eBay Trading API connector for real data access');
      return await this.tradingApiConnector.connect();
    }
    
    if (this.useRestFallback) {
      // Use REST API connector
      console.log('🔄 Using eBay REST API connector for real data access');
      return await this.restConnector.connect();
    }
    
    // Try JDBC MCP server first
    return new Promise((resolve, reject) => {
      // Set up environment
      const env = { ...process.env, JAVA_HOME: this.javaHome };
      
      // Start MCP server process
      this.serverProcess = spawn('java', [
        '-jar',
        this.mcpServerPath,
        this.configPath
      ], {
        env,
        cwd: path.dirname(this.mcpServerPath)
      });

      // Check if process starts successfully
      setTimeout(() => {
        if (this.serverProcess && !this.serverProcess.killed) {
          resolve(true);
        } else {
          // If JDBC fails, fall back to REST API
          console.log('🔄 JDBC MCP server failed, falling back to REST API');
          this.useRestFallback = true;
          this.restConnector.connect().then(resolve).catch(() => resolve(false));
        }
      }, 2000);

      // Handle process errors
      this.serverProcess.on('error', (error) => {
        console.log('🔄 JDBC MCP server error, falling back to REST API');
        this.useRestFallback = true;
        this.restConnector.connect().then(resolve).catch(() => resolve(false));
      });
    });
  }

  _validateConnection() {
    if (!this.serverProcess || this.serverProcess.killed) {
      throw new Error('MCP server not connected');
    }
  }

  _validateOperation(operation) {
    if (this.readOnlyMode) {
      const operationType = operation.toUpperCase().split(' ')[0];
      if (!this.allowedOperations.includes(operationType)) {
        throw new Error(`Read-only mode: ${operationType} operations are not allowed`);
      }
    }
  }

  async getAccountData() {
    if (this.useTradingApi) {
      // Use Trading API connector for real data
      return await this.tradingApiConnector.getAccountData();
    }
    
    if (this.useRestFallback) {
      // Use REST API connector for real data
      return await this.restConnector.getAccountData();
    }

    this._validateConnection();

    try {
      // Execute SQL query to get account data from eBay MCP server
      const query = "SELECT UserId, AccountType, EBayGoodStanding, CountryId FROM Account LIMIT 1";
      const result = await this._executeQuery(query);
      
      if (result && result.length > 0) {
        const account = result[0];
        return {
          userId: account.UserId || 'jamesl',
          status: account.EBayGoodStanding === 'true' ? 'active' : 'inactive',
          accountType: account.AccountType || 'business',
          registrationCountry: account.CountryId || 'US'
        };
      }
    } catch (error) {
      console.log('JDBC query failed, falling back to REST API:', error.message);
      // Fall back to REST API
      this.useRestFallback = true;
      return await this.restConnector.getAccountData();
    }

    // Final fallback to simulated data
    return {
      userId: 'jamesl',
      status: 'active',
      accountType: 'business',
      registrationCountry: 'US'
    };
  }

  async getListings() {
    if (this.useTradingApi) {
      // Use Trading API connector for real data
      return await this.tradingApiConnector.getListings();
    }
    
    if (this.useRestFallback) {
      // Use REST API connector for real data
      return await this.restConnector.getListings();
    }

    this._validateConnection();

    // For now, simulate automotive parts listings
    // This will be replaced with actual MCP communication in future iterations
    return [
      {
        itemId: '123456789',
        title: 'Brake Pads Front Set for Honda Civic 2016-2021',
        price: 45.99,
        category: 'Car & Truck Parts > Brakes > Brake Pads',
        condition: 'New',
        quantity: 25,
        watchers: 12,
        views: 156,
        endTime: '2024-01-15T23:59:59Z'
      },
      {
        itemId: '987654321',
        title: 'Air Filter for Toyota Camry 2018-2023 Premium Quality',
        price: 18.50,
        category: 'Car & Truck Parts > Air Intake & Fuel Delivery > Air Filters',
        condition: 'New',
        quantity: 50,
        watchers: 8,
        views: 89,
        endTime: '2024-01-20T23:59:59Z'
      },
      {
        itemId: '456789123',
        title: 'Oil Filter Set for Ford F-150 2015-2020',
        price: 12.75,
        category: 'Car & Truck Parts > Filters > Oil Filters',
        condition: 'New',
        quantity: 100,
        watchers: 5,
        views: 67,
        endTime: '2024-01-18T23:59:59Z'
      }
    ];
  }

  async getListingPerformance(itemId) {
    if (this.useTradingApi) {
      // Use Trading API connector for real data
      return await this.tradingApiConnector.getListingPerformance(itemId);
    }
    
    if (this.useRestFallback) {
      // Use REST API connector for real data
      return await this.restConnector.getListingPerformance(itemId);
    }

    this._validateConnection();

    // For now, simulate performance analytics for the given item
    // This will be replaced with actual MCP communication in future iterations
    const performanceData = {
      '123456789': {
        itemId: '123456789',
        metrics: {
          views: 156,
          watchers: 12,
          impressions: 1420,
          clickThroughRate: 0.11, // 11%
          conversionRate: 0.085, // 8.5%
          watchToSaleRate: 0.25 // 25% of watchers buy
        },
        salesData: {
          totalSold: 8,
          averagePrice: 45.99,
          totalRevenue: 367.92,
          soldLastWeek: 3,
          soldLastMonth: 15
        },
        trending: {
          viewsTrend: 'increasing',
          priceCompetitiveness: 'good',
          demandLevel: 'medium'
        }
      },
      '987654321': {
        itemId: '987654321',
        metrics: {
          views: 89,
          watchers: 8,
          impressions: 890,
          clickThroughRate: 0.10,
          conversionRate: 0.067,
          watchToSaleRate: 0.375
        },
        salesData: {
          totalSold: 12,
          averagePrice: 18.50,
          totalRevenue: 222.00,
          soldLastWeek: 4,
          soldLastMonth: 20
        },
        trending: {
          viewsTrend: 'stable',
          priceCompetitiveness: 'excellent',
          demandLevel: 'high'
        }
      }
    };

    return performanceData[itemId] || {
      itemId,
      metrics: {
        views: 50,
        watchers: 3,
        impressions: 500,
        clickThroughRate: 0.10,
        conversionRate: 0.06,
        watchToSaleRate: 0.33
      },
      salesData: {
        totalSold: 2,
        averagePrice: 25.00,
        totalRevenue: 50.00,
        soldLastWeek: 1,
        soldLastMonth: 5
      },
      trending: {
        viewsTrend: 'stable',
        priceCompetitiveness: 'fair',
        demandLevel: 'low'
      }
    };
  }

  async getCompetitorListings(searchTerm) {
    if (this.useTradingApi) {
      // Use Trading API connector for real data
      return await this.tradingApiConnector.getCompetitorData(searchTerm);
    }
    
    if (this.useRestFallback) {
      // Use REST API connector for real data
      return await this.restConnector.getCompetitorData(searchTerm);
    }

    this._validateConnection();

    // For now, simulate competitor data based on search term
    // This will be replaced with actual MCP communication in future iterations
    const competitorDatabase = {
      'brake pads honda civic': [
        {
          itemId: 'COMP001',
          sellerId: 'autoparts_pro',
          title: 'Premium Brake Pads Honda Civic 2016-2021 Ceramic',
          price: 42.99,
          shippingCost: 7.99,
          totalCost: 50.98,
          condition: 'New',
          quantity: 45,
          sellerRating: 4.8,
          feedbackCount: 15420,
          competitiveAdvantage: 'lower_total_cost',
          features: ['Ceramic', 'Premium', 'Fast Shipping'],
          location: 'California, US'
        },
        {
          itemId: 'COMP002',
          sellerId: 'honda_specialist',
          title: 'OEM Quality Brake Pads Set Honda Civic 16-21',
          price: 48.50,
          shippingCost: 0.00,
          totalCost: 48.50,
          condition: 'New',
          quantity: 20,
          sellerRating: 4.9,
          feedbackCount: 8900,
          competitiveAdvantage: 'free_shipping',
          features: ['OEM Quality', 'Free Shipping', 'Honda Specialist'],
          location: 'Texas, US'
        },
        {
          itemId: 'COMP003',
          sellerId: 'budget_auto_parts',
          title: 'Honda Civic Brake Pads 2016-2021 Economy',
          price: 35.99,
          shippingCost: 9.99,
          totalCost: 45.98,
          condition: 'New',
          quantity: 100,
          sellerRating: 4.3,
          feedbackCount: 3200,
          competitiveAdvantage: 'lowest_price',
          features: ['Economy', 'High Stock', 'Budget Friendly'],
          location: 'Nevada, US'
        }
      ],
      'air filter toyota camry': [
        {
          itemId: 'COMP004',
          sellerId: 'toyota_parts_direct',
          title: 'Toyota Camry Air Filter 2018-2023 High Performance',
          price: 16.99,
          shippingCost: 5.99,
          totalCost: 22.98,
          condition: 'New',
          quantity: 75,
          sellerRating: 4.7,
          feedbackCount: 12000,
          competitiveAdvantage: 'brand_specialization',
          features: ['High Performance', 'Toyota Specialist', 'Quality'],
          location: 'Michigan, US'
        }
      ]
    };

    return competitorDatabase[searchTerm] || [
      {
        itemId: 'COMP_DEFAULT',
        sellerId: 'generic_seller',
        title: `Generic ${searchTerm} - Similar Product`,
        price: 29.99,
        shippingCost: 6.99,
        totalCost: 36.98,
        condition: 'New',
        quantity: 10,
        sellerRating: 4.0,
        feedbackCount: 500,
        competitiveAdvantage: 'standard',
        features: ['Standard Quality'],
        location: 'Unknown'
      }
    ];
  }

  async _executeQuery(query) {
    this._validateOperation(query);
    
    // In a real implementation, this would communicate with the MCP server
    // For now, we'll simulate the communication and return to simulated data
    // TODO: Implement actual MCP server communication protocol
    throw new Error('MCP server communication not yet implemented');
  }

  disconnect() {
    if (this.useTradingApi) {
      this.tradingApiConnector.disconnect();
    }
    
    if (this.useRestFallback) {
      this.restConnector.disconnect();
    }
    
    if (this.serverProcess && !this.serverProcess.killed) {
      this.serverProcess.kill();
    }
  }
}

module.exports = EbayMCPConnector;