const { describe, it, expect, beforeEach, afterEach } = require('@jest/globals');
const DataCollectionService = require('../src/services/data-collection-service');
const EbayMCPConnector = require('../src/connectors/ebay-mcp-connector');

describe('Data Collection Service', () => {
  let dataService;
  let mockConnector;

  beforeEach(() => {
    mockConnector = new EbayMCPConnector();
  });

  afterEach(() => {
    if (dataService) {
      dataService.cleanup();
    }
    if (mockConnector) {
      mockConnector.disconnect();
    }
  });

  it('shouldCreateDataCollectionService', async () => {
    // Arrange
    dataService = new DataCollectionService();
    
    // Act
    await dataService.addPlatform('ebay', mockConnector);
    const platforms = dataService.getActivePlatforms();
    
    // Assert
    expect(dataService).toBeDefined();
    expect(platforms).toBeDefined();
    expect(Array.isArray(platforms)).toBe(true);
    expect(platforms).toContain('ebay');
    expect(dataService.isConnected('ebay')).toBe(false); // Not connected yet
  });

  it('shouldStoreEbayDataStructured', async () => {
    // Arrange
    dataService = new DataCollectionService();
    await dataService.addPlatform('ebay', mockConnector);
    
    // Act
    const collectedData = await dataService.collectAllData('ebay');
    const storedData = await dataService.storeData(collectedData);
    
    // Assert
    expect(storedData).toBeDefined();
    expect(storedData.id).toBeDefined();
    expect(storedData.platform).toBe('ebay');
    expect(storedData.timestamp).toBeDefined();
    expect(storedData.account).toBeDefined();
    expect(storedData.listings).toBeDefined();
    expect(Array.isArray(storedData.listings)).toBe(true);
    expect(storedData.performance).toBeDefined();
  });

  it('shouldCalculatePerformanceMetrics', async () => {
    // Arrange
    dataService = new DataCollectionService();
    await dataService.addPlatform('ebay', mockConnector);
    const collectedData = await dataService.collectAllData('ebay');
    
    // Act
    const metrics = await dataService.calculateMetrics(collectedData);
    
    // Assert
    expect(metrics).toBeDefined();
    expect(metrics.totalListings).toBe(3);
    expect(metrics.totalViews).toBeGreaterThan(0);
    expect(metrics.totalWatchers).toBeGreaterThan(0);
    expect(metrics.averagePrice).toBeGreaterThan(0);
    expect(metrics.averageCTR).toBeGreaterThan(0);
    expect(metrics.averageConversionRate).toBeGreaterThan(0);
    expect(metrics.topPerformer).toBeDefined();
    expect(metrics.topPerformer.itemId).toBeDefined();
  });

  it('shouldIdentifyOptimizationOpportunities', async () => {
    // Arrange
    dataService = new DataCollectionService();
    await dataService.addPlatform('ebay', mockConnector);
    const collectedData = await dataService.collectAllData('ebay');
    const metrics = await dataService.calculateMetrics(collectedData);
    
    // Act
    const opportunities = await dataService.identifyOptimizations(collectedData, metrics);
    
    // Assert
    expect(opportunities).toBeDefined();
    expect(Array.isArray(opportunities)).toBe(true);
    expect(opportunities.length).toBeGreaterThan(0);
    expect(opportunities[0]).toHaveProperty('itemId');
    expect(opportunities[0]).toHaveProperty('type');
    expect(opportunities[0]).toHaveProperty('priority');
    expect(opportunities[0]).toHaveProperty('description');
    expect(opportunities[0]).toHaveProperty('impact');
  });

  it('shouldGenerateTitleOptimizations', async () => {
    // Arrange
    dataService = new DataCollectionService();
    await dataService.addPlatform('ebay', mockConnector);
    const originalTitle = 'Brake Pads Front Set for Honda Civic 2016-2021';
    
    // Act
    const optimizations = await dataService.generateTitleOptimizations(originalTitle, 'automotive_parts');
    
    // Assert
    expect(optimizations).toBeDefined();
    expect(Array.isArray(optimizations)).toBe(true);
    expect(optimizations.length).toBeGreaterThan(0);
    expect(optimizations[0]).toHaveProperty('suggestedTitle');
    expect(optimizations[0]).toHaveProperty('improvements');
    expect(optimizations[0]).toHaveProperty('expectedImpact');
    expect(Array.isArray(optimizations[0].improvements)).toBe(true);
    expect(optimizations[0].improvements.length).toBeGreaterThan(0);
  });

  it('shouldOptimizePricing', async () => {
    // Arrange
    dataService = new DataCollectionService();
    await dataService.addPlatform('ebay', mockConnector);
    await dataService.connectPlatform('ebay');
    const currentPrice = 45.99;
    const searchTerm = 'brake pads honda civic';
    
    // Act
    const pricingStrategy = await dataService.optimizePricing(currentPrice, searchTerm);
    
    // Assert
    expect(pricingStrategy).toBeDefined();
    expect(pricingStrategy).toHaveProperty('recommendedPrice');
    expect(pricingStrategy).toHaveProperty('strategy');
    expect(pricingStrategy).toHaveProperty('reasoning');
    expect(pricingStrategy).toHaveProperty('competitorAnalysis');
    expect(typeof pricingStrategy.recommendedPrice).toBe('number');
    expect(pricingStrategy.recommendedPrice).toBeGreaterThan(0);
    expect(Array.isArray(pricingStrategy.competitorAnalysis)).toBe(true);
  });

  it('shouldSuggestDescriptionImprovements', async () => {
    // Arrange
    dataService = new DataCollectionService();
    const originalDescription = 'Brake pads for Honda Civic. Good quality.';
    const productTitle = 'Brake Pads Front Set for Honda Civic 2016-2021';
    const category = 'automotive_parts';
    
    // Act
    const improvements = await dataService.suggestDescriptionImprovements(originalDescription, productTitle, category);
    
    // Assert
    expect(improvements).toBeDefined();
    expect(improvements).toHaveProperty('enhancedDescription');
    expect(improvements).toHaveProperty('addedElements');
    expect(improvements).toHaveProperty('seoKeywords');
    expect(improvements).toHaveProperty('trustSignals');
    expect(Array.isArray(improvements.addedElements)).toBe(true);
    expect(Array.isArray(improvements.seoKeywords)).toBe(true);
    expect(Array.isArray(improvements.trustSignals)).toBe(true);
    expect(improvements.enhancedDescription.length).toBeGreaterThan(originalDescription.length);
  });

  it('shouldRecommendCategoryChanges', async () => {
    // Arrange
    dataService = new DataCollectionService();
    await dataService.addPlatform('ebay', mockConnector);
    await dataService.connectPlatform('ebay');
    const currentCategory = 'Car & Truck Parts > Brakes > Brake Pads';
    const productTitle = 'Brake Pads Front Set for Honda Civic 2016-2021';
    const searchTerm = 'brake pads honda civic';
    
    // Act
    const recommendations = await dataService.recommendCategoryChanges(currentCategory, productTitle, searchTerm);
    
    // Assert
    expect(recommendations).toBeDefined();
    expect(recommendations).toHaveProperty('currentCategory');
    expect(recommendations).toHaveProperty('suggestedCategories');
    expect(recommendations).toHaveProperty('analysis');
    expect(Array.isArray(recommendations.suggestedCategories)).toBe(true);
    expect(recommendations.suggestedCategories.length).toBeGreaterThan(0);
    expect(recommendations.suggestedCategories[0]).toHaveProperty('category');
    expect(recommendations.suggestedCategories[0]).toHaveProperty('reason');
    expect(recommendations.suggestedCategories[0]).toHaveProperty('expectedBenefit');
  });

  it('shouldScheduleListingUpdates', async () => {
    // Arrange
    dataService = new DataCollectionService();
    const updateSchedule = {
      itemId: '123456789',
      updateType: 'price_optimization',
      scheduledTime: new Date(Date.now() + 3600000), // 1 hour from now
      updateData: { newPrice: 42.99 }
    };
    
    // Act
    const scheduledUpdate = await dataService.scheduleUpdate(updateSchedule);
    const activeSchedules = await dataService.getActiveSchedules();
    
    // Assert
    expect(scheduledUpdate).toBeDefined();
    expect(scheduledUpdate).toHaveProperty('scheduleId');
    expect(scheduledUpdate).toHaveProperty('status');
    expect(scheduledUpdate.status).toBe('scheduled');
    expect(activeSchedules).toBeDefined();
    expect(Array.isArray(activeSchedules)).toBe(true);
    expect(activeSchedules.length).toBeGreaterThan(0);
    expect(activeSchedules[0]).toHaveProperty('scheduleId');
    expect(activeSchedules[0]).toHaveProperty('itemId');
    expect(activeSchedules[0]).toHaveProperty('updateType');
  });

  it('shouldMonitorCompetitorChanges', async () => {
    // Arrange
    dataService = new DataCollectionService();
    await dataService.addPlatform('ebay', mockConnector);
    await dataService.connectPlatform('ebay');
    const searchTerm = 'brake pads honda civic';
    
    // Act
    const baselineSnapshot = await dataService.createCompetitorSnapshot(searchTerm);
    const monitoringSession = await dataService.startCompetitorMonitoring(searchTerm, { interval: 3600000 });
    const currentSnapshot = await dataService.createCompetitorSnapshot(searchTerm);
    const changes = await dataService.detectCompetitorChanges(baselineSnapshot, currentSnapshot);
    
    // Assert
    expect(baselineSnapshot).toBeDefined();
    expect(baselineSnapshot).toHaveProperty('timestamp');
    expect(baselineSnapshot).toHaveProperty('searchTerm');
    expect(baselineSnapshot).toHaveProperty('competitors');
    expect(Array.isArray(baselineSnapshot.competitors)).toBe(true);
    expect(monitoringSession).toBeDefined();
    expect(monitoringSession).toHaveProperty('sessionId');
    expect(monitoringSession).toHaveProperty('status');
    expect(changes).toBeDefined();
    expect(Array.isArray(changes)).toBe(true);
  });

  it('shouldGeneratePerformanceReports', async () => {
    // Arrange
    dataService = new DataCollectionService();
    await dataService.addPlatform('ebay', mockConnector);
    const collectedData = await dataService.collectAllData('ebay');
    const metrics = await dataService.calculateMetrics(collectedData);
    const reportConfig = {
      reportType: 'weekly_summary',
      includeCharts: true,
      includeRecommendations: true
    };
    
    // Act
    const report = await dataService.generateReport(reportConfig, collectedData, metrics);
    
    // Assert
    expect(report).toBeDefined();
    expect(report).toHaveProperty('reportId');
    expect(report).toHaveProperty('reportType');
    expect(report).toHaveProperty('generatedAt');
    expect(report).toHaveProperty('summary');
    expect(report).toHaveProperty('sections');
    expect(Array.isArray(report.sections)).toBe(true);
    expect(report.sections.length).toBeGreaterThan(0);
    expect(report.sections[0]).toHaveProperty('title');
    expect(report.sections[0]).toHaveProperty('content');
    expect(report.summary).toHaveProperty('totalListings');
    expect(report.summary).toHaveProperty('keyMetrics');
  });

  it('shouldTriggerAlerts', async () => {
    // Arrange
    dataService = new DataCollectionService();
    await dataService.addPlatform('ebay', mockConnector);
    await dataService.connectPlatform('ebay');
    const alertRules = [
      {
        alertType: 'price_drop',
        threshold: 10, // 10% drop
        action: 'notify'
      },
      {
        alertType: 'low_ctr',
        threshold: 0.01, // Below 1% CTR
        action: 'notify'
      }
    ];
    
    // Act
    const ruleIds = await dataService.configureAlertRules(alertRules);
    const collectedData = await dataService.collectAllData('ebay');
    const metrics = await dataService.calculateMetrics(collectedData);
    const triggeredAlerts = await dataService.checkAlerts(collectedData, metrics);
    
    // Assert
    expect(ruleIds).toBeDefined();
    expect(Array.isArray(ruleIds)).toBe(true);
    expect(ruleIds.length).toBe(alertRules.length);
    expect(triggeredAlerts).toBeDefined();
    expect(Array.isArray(triggeredAlerts)).toBe(true);
    if (triggeredAlerts.length > 0) {
      expect(triggeredAlerts[0]).toHaveProperty('alertId');
      expect(triggeredAlerts[0]).toHaveProperty('alertType');
      expect(triggeredAlerts[0]).toHaveProperty('severity');
      expect(triggeredAlerts[0]).toHaveProperty('message');
      expect(triggeredAlerts[0]).toHaveProperty('data');
    }
  });
});