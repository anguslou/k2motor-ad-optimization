const fs = require('fs');
const path = require('path');

describe('K2Motor Ad Optimization Dashboard Demo', () => {
  
  describe('Phase 1: Foundation & Configuration System', () => {
    
    test('shouldCreateProjectStructure', () => {
      // Test: Verify organized folder structure for HTML demo exists
      const dashboardPath = path.join(__dirname, '../dashboard');
      const expectedStructure = {
        'index.html': 'file',
        'config.py': 'file',
        'assets': 'directory',
        'assets/css': 'directory', 
        'assets/js': 'directory',
        'assets/data': 'directory',
        'assets/images': 'directory',
        'tabs': 'directory',
        'demo': 'directory'
      };

      // Check if dashboard directory exists
      expect(fs.existsSync(dashboardPath)).toBe(true);

      // Check each expected path
      Object.entries(expectedStructure).forEach(([relativePath, type]) => {
        const fullPath = path.join(dashboardPath, relativePath);
        expect(fs.existsSync(fullPath)).toBe(true);
        
        const stats = fs.statSync(fullPath);
        if (type === 'directory') {
          expect(stats.isDirectory()).toBe(true);
        } else {
          expect(stats.isFile()).toBe(true);
        }
      });

      // Verify main entry point exists and has basic structure
      const indexPath = path.join(dashboardPath, 'index.html');
      const indexContent = fs.readFileSync(indexPath, 'utf8');
      expect(indexContent).toContain('<!DOCTYPE html>');
      expect(indexContent).toContain('K2Motor');
      expect(indexContent).toContain('Ad Optimization Dashboard');
    });

    test('shouldCreateConfigurationSystem', () => {
      // Test: Verify config.py exists and has proper structure for sports car parts business
      const configPath = path.join(__dirname, '../dashboard/config.py');
      expect(fs.existsSync(configPath)).toBe(true);

      const configContent = fs.readFileSync(configPath, 'utf8');
      
      // Verify sports car specific configuration
      expect(configContent).toContain('High-Performance Sports Car Parts');
      expect(configContent).toContain('Turbo Systems');
      expect(configContent).toContain('Performance Brakes');
      expect(configContent).toContain('Subaru WRX/STI');
      expect(configContent).toContain('Honda Civic Type R');
      
      // Verify sports car UI theme colors
      expect(configContent).toContain('#FF6B35');  // Racing orange
      expect(configContent).toContain('#00D4FF');  // Electric blue
      expect(configContent).toContain('#0F0F23');  // Deep dark background
      
      // Verify higher performance metrics for premium market
      expect(configContent).toContain('75000');    // Higher ad budget
      expect(configContent).toContain('4.2');      // Higher target ROAS
      expect(configContent).toContain('450');      // Higher AOV
      
      // Verify JavaScript export function exists
      expect(configContent).toContain('export_to_js');
      expect(configContent).toContain('assets/js/config.js');
    });

    test('shouldGenerateRealisticMockData', () => {
      // Test: Verify API-equivalent mock data exists with proper data types
      const mockDataPath = path.join(__dirname, '../dashboard/assets/data');
      
      // Check for core data files
      const expectedDataFiles = [
        'amazon-performance.json',
        'ebay-listings.json', 
        'campaign-data.json',
        'attribution-data.json',
        'sports-car-products.json'
      ];

      expectedDataFiles.forEach(filename => {
        const filePath = path.join(mockDataPath, filename);
        expect(fs.existsSync(filePath)).toBe(true);
        
        // Verify it's valid JSON
        const content = fs.readFileSync(filePath, 'utf8');
        expect(() => JSON.parse(content)).not.toThrow();
        
        const data = JSON.parse(content);
        expect(Array.isArray(data) || typeof data === 'object').toBe(true);
      });

      // Verify sports car specific data in products
      const sportsCarProductsPath = path.join(mockDataPath, 'sports-car-products.json');
      const sportsCarData = JSON.parse(fs.readFileSync(sportsCarProductsPath, 'utf8'));
      
      // Check for performance parts
      const productTitles = sportsCarData.map(p => p.title).join(' ');
      expect(productTitles).toContain('Turbo');
      expect(productTitles).toContain('Performance');
      expect(productTitles).toContain('Racing');
      expect(productTitles).toContain('WRX');
      expect(productTitles).toContain('Type R');

      // Verify API-equivalent data structure
      const amazonPath = path.join(mockDataPath, 'amazon-performance.json');
      const amazonData = JSON.parse(fs.readFileSync(amazonPath, 'utf8'));
      
      expect(amazonData[0]).toHaveProperty('asin');
      expect(amazonData[0]).toHaveProperty('impressions');
      expect(amazonData[0]).toHaveProperty('clicks');
      expect(amazonData[0]).toHaveProperty('orders');
      expect(amazonData[0]).toHaveProperty('revenue');
      expect(typeof amazonData[0].revenue).toBe('number');
    });

    test('shouldCreateDataCalculationEngine', () => {
      // Test: Verify calculation engine exists for derived metrics like POAS, incremental lift, attribution
      const calculationsPath = path.join(__dirname, '../dashboard/assets/js/calculations.js');
      expect(fs.existsSync(calculationsPath)).toBe(true);

      const calcContent = fs.readFileSync(calculationsPath, 'utf8');
      
      // Verify key calculation functions exist
      expect(calcContent).toContain('calculatePOAS');
      expect(calcContent).toContain('calculateIncrementalLift');
      expect(calcContent).toContain('calculateTrueROAS');
      expect(calcContent).toContain('calculateAttributionMetrics');
      expect(calcContent).toContain('calculateScenarioAlerts');
      
      // Verify functions can be called (basic function structure)
      expect(calcContent).toContain('function calculatePOAS(');
      expect(calcContent).toContain('function calculateIncrementalLift(');
      expect(calcContent).toContain('function calculateTrueROAS(');
      
      // Verify calculation accuracy with test data
      const mockData = {
        revenue: 1000,
        adSpend: 250,
        productCost: 650,
        margin: 0.35
      };
      
      // Test should verify POAS calculation: (Revenue - Product Cost) / Ad Spend
      // POAS = (1000 - 650) / 250 = 1.4
      expect(calcContent).toContain('revenue - productCost');
      expect(calcContent).toContain('/ adSpend');
    });

  });

  describe('Phase 2: Dashboard Interface & Navigation', () => {
    
    test('shouldCreateMainDashboardLayout', () => {
      // Test: Verify main dashboard layout with sports car theme
      const indexPath = path.join(__dirname, '../dashboard/index.html');
      const indexContent = fs.readFileSync(indexPath, 'utf8');
      
      // Verify sports car branding
      expect(indexContent).toContain('K2Motor');
      expect(indexContent).toContain('Performance Parts');
      
      // Verify 4-tab navigation structure exists
      expect(indexContent).toContain('tab-navigation');
      expect(indexContent).toContain('Ad Performance Overview');
      expect(indexContent).toContain('Campaign Deep Dive');
      expect(indexContent).toContain('Budget Optimization');
      expect(indexContent).toContain('Advanced Attribution');
      
      // Verify modern sports car styling
      expect(indexContent).toContain('#FF6B35'); // Racing orange
      expect(indexContent).toContain('#00D4FF'); // Electric blue
      expect(indexContent).toContain('sports-car-theme');
      
      // Verify container structure for tabs
      expect(indexContent).toContain('tab-content');
      expect(indexContent).toContain('data-tab="overview"');
      expect(indexContent).toContain('data-tab="campaigns"');
      expect(indexContent).toContain('data-tab="budget"');
      expect(indexContent).toContain('data-tab="attribution"');
      
      // Verify JavaScript includes
      expect(indexContent).toContain('config.js');
      expect(indexContent).toContain('calculations.js');
      expect(indexContent).toContain('dashboard.js');
    });

  });

  describe('Phase 3: Tab Implementation - Core Dashboard Pages', () => {
    
    test('shouldCreateOverviewTabStructure', () => {
      // Test: Verify overview tab HTML structure with data source indicators
      const overviewTabPath = path.join(__dirname, '../dashboard/tabs/overview.html');
      expect(fs.existsSync(overviewTabPath)).toBe(true);

      const overviewContent = fs.readFileSync(overviewTabPath, 'utf8');
      
      // Verify key metrics cards
      expect(overviewContent).toContain('metrics-grid');
      expect(overviewContent).toContain('Total Ad Spend');
      expect(overviewContent).toContain('Total Revenue');
      expect(overviewContent).toContain('Overall ROAS');
      expect(overviewContent).toContain('True ROAS');
      expect(overviewContent).toContain('POAS');
      
      // Verify data source indicators
      expect(overviewContent).toContain('data-source="API Direct"');
      expect(overviewContent).toContain('data-source="Calculated"');
      expect(overviewContent).toContain('source-indicator');
      
      // Verify scenario alerts section
      expect(overviewContent).toContain('scenario-alerts');
      expect(overviewContent).toContain('alert-critical');
      expect(overviewContent).toContain('alert-warning');
      expect(overviewContent).toContain('alert-opportunity');
      
      // Verify performance charts placeholder
      expect(overviewContent).toContain('performance-charts');
      expect(overviewContent).toContain('roas-trend-chart');
      expect(overviewContent).toContain('attribution-chart');
      
      // Verify sports car specific content
      expect(overviewContent).toContain('K2Motor');
      expect(overviewContent).toContain('Performance Parts');
    });

    test('shouldImplementMetricsCalculations', () => {
      // Test: Verify ROAS, ACoS, CTR calculations populate from mock data
      const metricsPath = path.join(__dirname, '../dashboard/assets/js/metrics.js');
      expect(fs.existsSync(metricsPath)).toBe(true);

      const metricsContent = fs.readFileSync(metricsPath, 'utf8');
      
      // Verify core metric calculation functions (class methods)
      expect(metricsContent).toContain('calculateOverviewMetrics()');
      expect(metricsContent).toContain('updateMetricsDisplay()');
      expect(metricsContent).toContain('loadRealTimeData()');
      
      // Verify ROAS calculation logic
      expect(metricsContent).toContain('totalRevenue / totalSpend');
      
      // Verify ACoS calculation (Ad Cost of Sales)
      expect(metricsContent).toContain('totalSpend / totalRevenue');
      
      // Verify CTR calculation (Click-Through Rate)  
      expect(metricsContent).toContain('totalClicks / totalImpressions');
      
      // Verify POAS integration
      expect(metricsContent).toContain('calculatePOAS');
      
      // Verify attribution integration
      expect(metricsContent).toContain('trueROAS');
      
      // Verify platform-specific calculations
      expect(metricsContent).toContain('amazon_performance');
      expect(metricsContent).toContain('ebay_listings');
      expect(metricsContent).toContain('campaign_data');
      
      // Verify real-time update functionality
      expect(metricsContent).toContain('setInterval');
      expect(metricsContent).toContain('refreshMetrics');
    });

    test('shouldAddScenarioAlerts', () => {
      // Test: Verify active scenario notifications with popup explanations
      const alertsPath = path.join(__dirname, '../dashboard/assets/js/scenario-alerts.js');
      expect(fs.existsSync(alertsPath)).toBe(true);

      const alertsContent = fs.readFileSync(alertsPath, 'utf8');
      
      // Verify scenario alert generation functions (class methods and global functions)
      expect(alertsContent).toContain('generateScenarioAlerts()');
      expect(alertsContent).toContain('function displayAlert');
      expect(alertsContent).toContain('function showAlertPopup');
      
      // Verify 10 scenario detection logic
      expect(alertsContent).toContain('scenario === 1'); // High ROAS but losing money
      expect(alertsContent).toContain('scenario === 2'); // Ad fatigue
      expect(alertsContent).toContain('scenario === 3'); // Message mismatch
      expect(alertsContent).toContain('scenario === 4'); // Attribution mystery
      
      // Verify alert types
      expect(alertsContent).toContain('alert-critical');
      expect(alertsContent).toContain('alert-warning');
      expect(alertsContent).toContain('alert-opportunity');
      
      // Verify popup functionality
      expect(alertsContent).toContain('popup-overlay');
      expect(alertsContent).toContain('popup-content');
      expect(alertsContent).toContain('closePopup');
      
      // Verify action buttons
      expect(alertsContent).toContain('Review Costs');
      expect(alertsContent).toContain('Refresh Creative');
      expect(alertsContent).toContain('Run Attribution');
      
      // Verify sports car specific scenarios
      expect(alertsContent).toContain('Performance Parts');
      expect(alertsContent).toContain('Honda vs Toyota');
    });

    test('shouldCreatePerformanceCharts', () => {
      // Test: Verify interactive charts showing ROAS trends and attribution
      const chartsPath = path.join(__dirname, '../dashboard/assets/js/performance-charts.js');
      expect(fs.existsSync(chartsPath)).toBe(true);

      const chartsContent = fs.readFileSync(chartsPath, 'utf8');
      
      // Verify chart initialization functions (class methods and global functions)
      expect(chartsContent).toContain('function initializeCharts');
      expect(chartsContent).toContain('createROASTrendChart()');
      expect(chartsContent).toContain('createAttributionChart()');
      expect(chartsContent).toContain('createScenarioImpactChart()');
      
      // Verify chart switching functionality
      expect(chartsContent).toContain('switchChart');
      expect(chartsContent).toContain('chart-toggle');
      
      // Verify ROAS trend chart data
      expect(chartsContent).toContain('roas-trend-chart');
      expect(chartsContent).toContain('Target: 4.2x');
      expect(chartsContent).toContain('True ROAS');
      
      // Verify attribution chart (Honda vs Toyota)
      expect(chartsContent).toContain('attribution-chart');
      expect(chartsContent).toContain('Honda Civic');
      expect(chartsContent).toContain('Toyota Camry');
      expect(chartsContent).toContain('cross-brand');
      
      // Verify chart data integration
      expect(chartsContent).toContain('campaign_data');
      expect(chartsContent).toContain('attribution_data');
      
      // Verify sports car theme integration
      expect(chartsContent).toContain('#FF6B35'); // Racing orange
      expect(chartsContent).toContain('#00D4FF'); // Electric blue
      expect(chartsContent).toContain('Performance Parts');
      
      // Verify interactive features
      expect(chartsContent).toContain('addEventListener');
      expect(chartsContent).toContain('updateChartData');
    });

    test('shouldCreateCampaignTabStructure', () => {
      // Test: Verify campaign performance tables with data source breakdown
      const campaignTabPath = path.join(__dirname, '../dashboard/tabs/campaigns.html');
      expect(fs.existsSync(campaignTabPath)).toBe(true);

      const campaignContent = fs.readFileSync(campaignTabPath, 'utf8');
      
      // Verify campaign table structure
      expect(campaignContent).toContain('campaigns-table');
      expect(campaignContent).toContain('campaign-row');
      expect(campaignContent).toContain('Campaign Name');
      expect(campaignContent).toContain('Platform');
      expect(campaignContent).toContain('Spend');
      expect(campaignContent).toContain('Revenue');
      expect(campaignContent).toContain('ROAS');
      expect(campaignContent).toContain('Status');
      
      // Verify brand analysis section
      expect(campaignContent).toContain('brand-analysis');
      expect(campaignContent).toContain('Subaru WRX/STI');
      expect(campaignContent).toContain('Honda Civic Type R');
      expect(campaignContent).toContain('BMW M3/M4');
      
      // Verify data source indicators
      expect(campaignContent).toContain('data-source="API Direct"');
      expect(campaignContent).toContain('data-source="Calculated"');
      expect(campaignContent).toContain('source-indicator');
      
      // Verify hypothesis testing section
      expect(campaignContent).toContain('hypothesis-testing');
      expect(campaignContent).toContain('root-cause-analysis');
      expect(campaignContent).toContain('competitive-landscape');
      
      // Verify actionable insights
      expect(campaignContent).toContain('actionable-insights');
      expect(campaignContent).toContain('scenario-recommendations');
      expect(campaignContent).toContain('Apply');
      
      // Verify sports car specific content
      expect(campaignContent).toContain('Performance Parts');
      expect(campaignContent).toContain('K2Motor');
      
      // Verify interactive features
      expect(campaignContent).toContain('campaign-details');
      expect(campaignContent).toContain('expand-campaign');
    });

    test('shouldCreateBudgetTabStructure', () => {
      // Test: Verify budget allocation and reallocation interface
      const budgetTabPath = path.join(__dirname, '../dashboard/tabs/budget.html');
      expect(fs.existsSync(budgetTabPath)).toBe(true);

      const budgetContent = fs.readFileSync(budgetTabPath, 'utf8');
      
      // Verify budget allocation interface
      expect(budgetContent).toContain('budget-allocation');
      expect(budgetContent).toContain('current-budget');
      expect(budgetContent).toContain('recommended-budget');
      expect(budgetContent).toContain('budget-slider');
      
      // Verify POAS calculations
      expect(budgetContent).toContain('poas-analysis');
      expect(budgetContent).toContain('Profit on Ad Spend');
      expect(budgetContent).toContain('vs ROAS');
      
      // Verify budget reallocation tools
      expect(budgetContent).toContain('budget-reallocation');
      expect(budgetContent).toContain('impact-forecasting');
      expect(budgetContent).toContain('reallocation-preview');
      
      // Verify optimization rules
      expect(budgetContent).toContain('optimization-rules');
      expect(budgetContent).toContain('auto-optimization');
      expect(budgetContent).toContain('thresholds');
      
      // Verify data source indicators
      expect(budgetContent).toContain('data-source="API Direct"');
      expect(budgetContent).toContain('data-source="Calculated"');
      expect(budgetContent).toContain('source-indicator');
      
      // Verify sports car specific content
      expect(budgetContent).toContain('Performance Parts');
      expect(budgetContent).toContain('K2Motor');
      expect(budgetContent).toContain('$75,000'); // Monthly budget from config
      
      // Verify interactive features
      expect(budgetContent).toContain('Apply Changes');
      expect(budgetContent).toContain('Preview Impact');
      expect(budgetContent).toContain('budget-simulator');
    });

    test('shouldCreateAttributionTabStructure', () => {
      // Test: Verify cross-brand control group analysis interface
      const attributionTabPath = path.join(__dirname, '../dashboard/tabs/attribution.html');
      expect(fs.existsSync(attributionTabPath)).toBe(true);

      const attributionContent = fs.readFileSync(attributionTabPath, 'utf8');
      
      // Verify cross-brand control group interface
      expect(attributionContent).toContain('cross-brand-analysis');
      expect(attributionContent).toContain('control-group');
      expect(attributionContent).toContain('Honda Civic');
      expect(attributionContent).toContain('Toyota Camry');
      
      // Verify Honda vs Toyota brake pad attribution
      expect(attributionContent).toContain('Honda vs Toyota');
      expect(attributionContent).toContain('brake pad');
      expect(attributionContent).toContain('attribution analysis');
      
      // Verify statistical validation
      expect(attributionContent).toContain('statistical-validation');
      expect(attributionContent).toContain('confidence-intervals');
      expect(attributionContent).toContain('significance-testing');
      expect(attributionContent).toContain('95%');
      
      // Verify attribution visualizations
      expect(attributionContent).toContain('attribution-visuals');
      expect(attributionContent).toContain('market-baseline');
      expect(attributionContent).toContain('true-ad-effect');
      expect(attributionContent).toContain('incremental-lift');
      
      // Verify data source indicators
      expect(attributionContent).toContain('data-source="API Direct"');
      expect(attributionContent).toContain('data-source="Calculated"');
      expect(attributionContent).toContain('source-indicator');
      
      // Verify sports car specific content
      expect(attributionContent).toContain('Performance Parts');
      expect(attributionContent).toContain('K2Motor');
      
      // Verify interactive features
      expect(attributionContent).toContain('Run Analysis');
      expect(attributionContent).toContain('attribution-simulator');
      expect(attributionContent).toContain('control-group-selector');
    });

  });

  describe('Phase 4: Advanced Features & Interactivity', () => {
    
    test('shouldCreateWelcomeFlow', () => {
      // Test: Verify onboarding popup sequence explaining dashboard
      const guidedTourPath = path.join(__dirname, '../dashboard/demo/guided-tour.js');
      expect(fs.existsSync(guidedTourPath)).toBe(true);

      const tourContent = fs.readFileSync(guidedTourPath, 'utf8');
      
      // Verify welcome flow initialization
      expect(tourContent).toContain('initializeWelcomeFlow');
      expect(tourContent).toContain('showWelcomePopup');
      expect(tourContent).toContain('startGuidedTour');
      
      // Verify K2Motor specific welcome content
      expect(tourContent).toContain('K2Motor');
      expect(tourContent).toContain('Performance Parts');
      expect(tourContent).toContain('Ad Optimization Dashboard');
      
      // Verify welcome sequence steps
      expect(tourContent).toContain('Welcome to your');
      expect(tourContent).toContain('dashboard overview');
      expect(tourContent).toContain('data sources');
      expect(tourContent).toContain('optimization scenarios');
      
      // Verify interactive elements
      expect(tourContent).toContain('Next');
      expect(tourContent).toContain('Skip Tour');
      expect(tourContent).toContain('Get Started');
      
      // Verify popup functionality
      expect(tourContent).toContain('popup-overlay');
      expect(tourContent).toContain('welcome-content');
      expect(tourContent).toContain('tour-progress');
      
      // Verify tour progression
      expect(tourContent).toContain('currentStep');
      expect(tourContent).toContain('totalSteps');
      expect(tourContent).toContain('nextStep');
      expect(tourContent).toContain('previousStep');
    });

    test('shouldAddDataSourceIndicators', () => {
      // Test: Verify color-coded badges showing data origin (API/CSV/Calculated)  
      const dataIndicatorsPath = path.join(__dirname, '../dashboard/assets/js/data-indicators.js');
      expect(fs.existsSync(dataIndicatorsPath)).toBe(true);

      const indicatorsContent = fs.readFileSync(dataIndicatorsPath, 'utf8');
      
      // Verify data source indicator system
      expect(indicatorsContent).toContain('initializeDataSourceIndicators');
      expect(indicatorsContent).toContain('updateDataSourceBadges');
      expect(indicatorsContent).toContain('showDataSourceTooltip');
      
      // Verify 4 data source types
      expect(indicatorsContent).toContain('API Direct');
      expect(indicatorsContent).toContain('Calculated');
      expect(indicatorsContent).toContain('CSV Import');
      expect(indicatorsContent).toContain('One-time Setup');
      
      // Verify color coding system
      expect(indicatorsContent).toContain('🟢'); // Green for API Direct
      expect(indicatorsContent).toContain('🟡'); // Yellow for Calculated
      expect(indicatorsContent).toContain('🔵'); // Blue for CSV Import
      expect(indicatorsContent).toContain('🔴'); // Red for One-time Setup
      
      // Verify tooltip functionality
      expect(indicatorsContent).toContain('tooltip-content');
      expect(indicatorsContent).toContain('data-source-explanation');
      expect(indicatorsContent).toContain('showTooltip');
      expect(indicatorsContent).toContain('hideTooltip');
      
      // Verify K2Motor specific implementations
      expect(indicatorsContent).toContain('K2Motor');
      expect(indicatorsContent).toContain('Performance Parts');
      
      // Verify badge update functionality
      expect(indicatorsContent).toContain('source-indicator');
      expect(indicatorsContent).toContain('data-source=');
      expect(indicatorsContent).toContain('updateIndicatorStatus');
      
      // Verify real-time status updates
      expect(indicatorsContent).toContain('refreshDataSources');
      expect(indicatorsContent).toContain('checkApiConnectivity');
    });

    test('shouldImplementGuidedTour', () => {
      // Test: Verify step-by-step walkthrough of optimization workflow
      const mainJsPath = path.join(__dirname, '../dashboard/assets/js/main.js');
      expect(fs.existsSync(mainJsPath)).toBe(true);

      const mainContent = fs.readFileSync(mainJsPath, 'utf8');
      
      // Verify main dashboard initialization
      expect(mainContent).toContain('K2MotorDashboard');
      expect(mainContent).toContain('setupTabNavigation');
      expect(mainContent).toContain('loadAllTabs');
      expect(mainContent).toContain('showTab');
      
      // Verify tab switching functionality
      expect(mainContent).toContain('currentTab');
      expect(mainContent).toContain('overview');
      expect(mainContent).toContain('campaigns');
      expect(mainContent).toContain('budget');
      expect(mainContent).toContain('attribution');
      
      // Verify guided tour integration
      expect(mainContent).toContain('guidedTour');
      expect(mainContent).toContain('initializeWelcomeFlow');
      
      // Verify K2Motor specific content
      expect(mainContent).toContain('K2Motor');
      expect(mainContent).toContain('Performance Parts');
      
      // Verify tab content creation
      expect(mainContent).toContain('createTabContent');
      expect(mainContent).toContain('createOverviewContent');
      expect(mainContent).toContain('createCampaignsContent');
      expect(mainContent).toContain('createBudgetContent');
      expect(mainContent).toContain('createAttributionContent');
      
      // Verify interactive features
      expect(mainContent).toContain('showScenarioDetails');
      expect(mainContent).toContain('scenario-alerts');
      expect(mainContent).toContain('data-source');
      
      // Verify error handling
      expect(mainContent).toContain('showError');
      expect(mainContent).toContain('fallback');
      
      // Verify dashboard ready state
      expect(mainContent).toContain('isInitialized');
      expect(mainContent).toContain('Dashboard ready');
    });

    test('shouldImplementHoverTooltips', () => {
      // Test: Verify detailed explanations on metric hover
      const tooltipsPath = path.join(__dirname, '../dashboard/assets/js/hover-tooltips.js');
      expect(fs.existsSync(tooltipsPath)).toBe(true);

      const tooltipsContent = fs.readFileSync(tooltipsPath, 'utf8');
      
      // Verify tooltip system initialization
      expect(tooltipsContent).toContain('initializeHoverTooltips');
      expect(tooltipsContent).toContain('createTooltipElements');
      expect(tooltipsContent).toContain('bindTooltipEvents');
      
      // Verify K2Motor specific tooltip content
      expect(tooltipsContent).toContain('K2Motor');
      expect(tooltipsContent).toContain('Performance Parts');
      expect(tooltipsContent).toContain('ROAS');
      expect(tooltipsContent).toContain('POAS');
      
      // Verify tooltip display functionality
      expect(tooltipsContent).toContain('showTooltip');
      expect(tooltipsContent).toContain('hideTooltip');
      expect(tooltipsContent).toContain('positionTooltip');
      expect(tooltipsContent).toContain('updateTooltipContent');
      
      // Verify metric explanations
      expect(tooltipsContent).toContain('Return on Ad Spend');
      expect(tooltipsContent).toContain('Profit on Ad Spend');
      expect(tooltipsContent).toContain('Attribution');
      expect(tooltipsContent).toContain('Incremental Lift');
      
      // Verify interactive hover states
      expect(tooltipsContent).toContain('mouseenter');
      expect(tooltipsContent).toContain('mouseleave');
      expect(tooltipsContent).toContain('tooltip-trigger');
      
      // Verify tooltip positioning
      expect(tooltipsContent).toContain('tooltip-container');
      expect(tooltipsContent).toContain('tooltip-arrow');
      expect(tooltipsContent).toContain('getBoundingClientRect');
      
      // Verify sports car theme integration
      expect(tooltipsContent).toContain('racing-orange');
      expect(tooltipsContent).toContain('electric-blue');
      expect(tooltipsContent).toContain('carbon-fiber');
      
      // Verify performance metrics tooltips
      expect(tooltipsContent).toContain('Honda');
      expect(tooltipsContent).toContain('Toyota');
      expect(tooltipsContent).toContain('Subaru');
      expect(tooltipsContent).toContain('BMW');
    });

    test('shouldAddFilteringOptions', () => {
      // Test: Verify date range, platform, and scenario filters
      const filtersPath = path.join(__dirname, '../dashboard/assets/js/dashboard-filters.js');
      expect(fs.existsSync(filtersPath)).toBe(true);

      const filtersContent = fs.readFileSync(filtersPath, 'utf8');
      
      // Verify filter system initialization
      expect(filtersContent).toContain('initializeDashboardFilters');
      expect(filtersContent).toContain('createFilterControls');
      expect(filtersContent).toContain('bindFilterEvents');
      
      // Verify date range filtering
      expect(filtersContent).toContain('dateRangeFilter');
      expect(filtersContent).toContain('Last 7 days');
      expect(filtersContent).toContain('Last 30 days');
      expect(filtersContent).toContain('Last 90 days');
      expect(filtersContent).toContain('Custom range');
      
      // Verify platform filtering
      expect(filtersContent).toContain('platformFilter');
      expect(filtersContent).toContain('All Platforms');
      expect(filtersContent).toContain('Amazon');
      expect(filtersContent).toContain('eBay');
      expect(filtersContent).toContain('Google');
      expect(filtersContent).toContain('Facebook');
      
      // Verify scenario filtering
      expect(filtersContent).toContain('scenarioFilter');
      expect(filtersContent).toContain('All Scenarios');
      expect(filtersContent).toContain('Critical');
      expect(filtersContent).toContain('Warning');
      expect(filtersContent).toContain('Opportunity');
      
      // Verify vehicle brand filtering
      expect(filtersContent).toContain('vehicleFilter');
      expect(filtersContent).toContain('All Vehicles');
      expect(filtersContent).toContain('Honda');
      expect(filtersContent).toContain('Toyota');
      expect(filtersContent).toContain('Subaru');
      expect(filtersContent).toContain('BMW');
      
      // Verify filter application
      expect(filtersContent).toContain('applyFilters');
      expect(filtersContent).toContain('filterData');
      expect(filtersContent).toContain('updateDashboard');
      expect(filtersContent).toContain('resetFilters');
      
      // Verify K2Motor specific filtering
      expect(filtersContent).toContain('K2Motor');
      expect(filtersContent).toContain('Performance Parts');
      
      // Verify filter state management
      expect(filtersContent).toContain('currentFilters');
      expect(filtersContent).toContain('filterState');
      expect(filtersContent).toContain('saveFilterState');
      
      // Verify interactive filter UI
      expect(filtersContent).toContain('filter-dropdown');
      expect(filtersContent).toContain('filter-controls');
      expect(filtersContent).toContain('active-filters');
      expect(filtersContent).toContain('clear-filters');
    });

    test('shouldCreateDataDrilldown', () => {
      // Test: Verify click-through from summary to detailed views
      const drilldownPath = path.join(__dirname, '../dashboard/assets/js/data-drilldown.js');
      expect(fs.existsSync(drilldownPath)).toBe(true);

      const drilldownContent = fs.readFileSync(drilldownPath, 'utf8');
      
      // Verify drilldown system initialization
      expect(drilldownContent).toContain('initializeDataDrilldown');
      expect(drilldownContent).toContain('bindDrilldownEvents');
      expect(drilldownContent).toContain('createDetailedView');
      
      // Verify clickable elements
      expect(drilldownContent).toContain('drilldown-trigger');
      expect(drilldownContent).toContain('metric-card');
      expect(drilldownContent).toContain('campaign-card');
      expect(drilldownContent).toContain('scenario-alert');
      
      // Verify detail view functionality
      expect(drilldownContent).toContain('showDetailedView');
      expect(drilldownContent).toContain('hideDetailedView');
      expect(drilldownContent).toContain('updateDetailedContent');
      expect(drilldownContent).toContain('closeDetailView');
      
      // Verify K2Motor specific drilldown content
      expect(drilldownContent).toContain('K2Motor');
      expect(drilldownContent).toContain('Performance Parts');
      expect(drilldownContent).toContain('Honda');
      expect(drilldownContent).toContain('Toyota');
      expect(drilldownContent).toContain('Subaru');
      expect(drilldownContent).toContain('BMW');
      
      // Verify detailed metrics
      expect(drilldownContent).toContain('ROAS breakdown');
      expect(drilldownContent).toContain('POAS analysis');
      expect(drilldownContent).toContain('Attribution details');
      expect(drilldownContent).toContain('Campaign performance');
      
      // Verify navigation between details
      expect(drilldownContent).toContain('drilldown-navigation');
      expect(drilldownContent).toContain('breadcrumb');
      expect(drilldownContent).toContain('back-button');
      expect(drilldownContent).toContain('drill-deeper');
      
      // Verify detail view UI
      expect(drilldownContent).toContain('detail-modal');
      expect(drilldownContent).toContain('detail-header');
      expect(drilldownContent).toContain('detail-content');
      expect(drilldownContent).toContain('detail-footer');
      
      // Verify interactive charts in drilldown
      expect(drilldownContent).toContain('detailed-chart');
      expect(drilldownContent).toContain('trend-analysis');
      expect(drilldownContent).toContain('performance-breakdown');
      
      // Verify export functionality
      expect(drilldownContent).toContain('exportDetailedData');
      expect(drilldownContent).toContain('generateReport');
      expect(drilldownContent).toContain('download-csv');
    });

  });

  describe('Phase 5: Modern UI/UX & Styling', () => {
    
    test('shouldImplementAdvancedAnimations', () => {
      // Test: Verify smooth transitions and micro-interactions for premium feel
      const animationsPath = path.join(__dirname, '../dashboard/assets/js/advanced-animations.js');
      expect(fs.existsSync(animationsPath)).toBe(true);

      const animationsContent = fs.readFileSync(animationsPath, 'utf8');
      
      // Verify animation system initialization
      expect(animationsContent).toContain('initializeAdvancedAnimations');
      expect(animationsContent).toContain('AnimationController');
      expect(animationsContent).toContain('setupMicroInteractions');
      
      // Verify racing-themed animations
      expect(animationsContent).toContain('speedometer-animation');
      expect(animationsContent).toContain('racing-stripes');
      expect(animationsContent).toContain('neon-glow-pulse');
      expect(animationsContent).toContain('carbon-fiber-shimmer');
      
      // Verify metric animations
      expect(animationsContent).toContain('animateMetricCountUp');
      expect(animationsContent).toContain('animateROASGauge');
      expect(animationsContent).toContain('animatePOASIndicator');
      expect(animationsContent).toContain('pulseScenarioAlert');
      
      // Verify transition effects
      expect(animationsContent).toContain('slideInFromLeft');
      expect(animationsContent).toContain('fadeInWithScale');
      expect(animationsContent).toContain('morphCardExpansion');
      expect(animationsContent).toContain('parallaxScrolling');
      
      // Verify performance optimization
      expect(animationsContent).toContain('requestAnimationFrame');
      expect(animationsContent).toContain('will-change');
      expect(animationsContent).toContain('transform3d');
      
      // Verify K2Motor specific animations
      expect(animationsContent).toContain('K2Motor');
      expect(animationsContent).toContain('Performance Parts');
      expect(animationsContent).toContain('turbo-boost-effect');
      expect(animationsContent).toContain('dashboard-ready-sequence');
    });

    test('shouldAddResponsiveGridSystem', () => {
      // Test: Verify mobile-first responsive grid with breakpoints
      const responsivePath = path.join(__dirname, '../dashboard/assets/css/responsive-grid.css');
      expect(fs.existsSync(responsivePath)).toBe(true);

      const responsiveContent = fs.readFileSync(responsivePath, 'utf8');
      
      // Verify CSS Grid and Flexbox implementation
      expect(responsiveContent).toContain('display: grid');
      expect(responsiveContent).toContain('grid-template-columns');
      expect(responsiveContent).toContain('grid-gap');
      expect(responsiveContent).toContain('display: flex');
      
      // Verify responsive breakpoints
      expect(responsiveContent).toContain('@media (max-width: 480px)'); // Mobile
      expect(responsiveContent).toContain('@media (max-width: 768px)'); // Tablet
      expect(responsiveContent).toContain('@media (max-width: 1024px)'); // Small desktop
      expect(responsiveContent).toContain('@media (min-width: 1440px)'); // Large desktop
      
      // Verify mobile-first approach
      expect(responsiveContent).toContain('mobile-first');
      expect(responsiveContent).toContain('responsive-grid');
      expect(responsiveContent).toContain('fluid-layout');
      
      // Verify container queries
      expect(responsiveContent).toContain('container-type: inline-size');
      expect(responsiveContent).toContain('@container');
      
      // Verify accessibility features
      expect(responsiveContent).toContain('prefers-reduced-motion');
      expect(responsiveContent).toContain('focus-visible');
      expect(responsiveContent).toContain('high-contrast');
      
      // Verify K2Motor branding consistency
      expect(responsiveContent).toContain('--racing-orange');
      expect(responsiveContent).toContain('--electric-blue');
      expect(responsiveContent).toContain('--carbon-fiber');
    });

    test('shouldImplementDarkModeToggle', () => {
      // Test: Verify dark/light mode switching with theme persistence
      const darkModePath = path.join(__dirname, '../dashboard/assets/js/theme-controller.js');
      expect(fs.existsSync(darkModePath)).toBe(true);

      const darkModeContent = fs.readFileSync(darkModePath, 'utf8');
      
      // Verify theme controller system
      expect(darkModeContent).toContain('ThemeController');
      expect(darkModeContent).toContain('initializeThemeSystem');
      expect(darkModeContent).toContain('toggleTheme');
      expect(darkModeContent).toContain('setTheme');
      
      // Verify theme variants
      expect(darkModeContent).toContain('racing-dark-theme');
      expect(darkModeContent).toContain('racing-light-theme');
      expect(darkModeContent).toContain('auto-theme');
      expect(darkModeContent).toContain('high-contrast-theme');
      
      // Verify localStorage persistence
      expect(darkModeContent).toContain('localStorage');
      expect(darkModeContent).toContain('k2motor-theme-preference');
      expect(darkModeContent).toContain('saveThemePreference');
      
      // Verify system preference detection
      expect(darkModeContent).toContain('prefers-color-scheme');
      expect(darkModeContent).toContain('matchMedia');
      expect(darkModeContent).toContain('detectSystemTheme');
      
      // Verify smooth theme transitions
      expect(darkModeContent).toContain('theme-transition');
      expect(darkModeContent).toContain('transition-duration');
      expect(darkModeContent).toContain('color-interpolation');
      
      // Verify racing theme variations
      expect(darkModeContent).toContain('Performance Parts');
      expect(darkModeContent).toContain('neon-accent-colors');
      expect(darkModeContent).toContain('carbon-texture-variants');
    });

    test('shouldAddLoadingStateManagement', () => {
      // Test: Verify skeleton screens and progressive loading
      const loadingPath = path.join(__dirname, '../dashboard/assets/js/loading-manager.js');
      expect(fs.existsSync(loadingPath)).toBe(true);

      const loadingContent = fs.readFileSync(loadingPath, 'utf8');
      
      // Verify loading manager system
      expect(loadingContent).toContain('LoadingManager');
      expect(loadingContent).toContain('initializeLoadingStates');
      expect(loadingContent).toContain('showLoadingState');
      expect(loadingContent).toContain('hideLoadingState');
      
      // Verify skeleton screen implementation
      expect(loadingContent).toContain('createSkeletonScreen');
      expect(loadingContent).toContain('skeleton-metric-card');
      expect(loadingContent).toContain('skeleton-chart');
      expect(loadingContent).toContain('skeleton-table-row');
      
      // Verify progressive loading
      expect(loadingContent).toContain('progressiveDataLoad');
      expect(loadingContent).toContain('loadCriticalContent');
      expect(loadingContent).toContain('lazyLoadSecondary');
      expect(loadingContent).toContain('IntersectionObserver');
      
      // Verify loading animations
      expect(loadingContent).toContain('shimmer-animation');
      expect(loadingContent).toContain('pulse-loading');
      expect(loadingContent).toContain('racing-loader');
      expect(loadingContent).toContain('turbo-spinner');
      
      // Verify error state handling
      expect(loadingContent).toContain('showErrorState');
      expect(loadingContent).toContain('retryLoadingSequence');
      expect(loadingContent).toContain('fallbackContent');
      
      // Verify performance metrics
      expect(loadingContent).toContain('measureLoadTime');
      expect(loadingContent).toContain('performance.mark');
      expect(loadingContent).toContain('K2Motor');
    });

    test('shouldImplementAccessibilityFeatures', () => {
      // Test: Verify WCAG 2.1 AA compliance and keyboard navigation
      const a11yPath = path.join(__dirname, '../dashboard/assets/js/accessibility-manager.js');
      expect(fs.existsSync(a11yPath)).toBe(true);

      const a11yContent = fs.readFileSync(a11yPath, 'utf8');
      
      // Verify accessibility manager
      expect(a11yContent).toContain('AccessibilityManager');
      expect(a11yContent).toContain('initializeA11yFeatures');
      expect(a11yContent).toContain('setupKeyboardNavigation');
      expect(a11yContent).toContain('setupScreenReader');
      
      // Verify ARIA implementation
      expect(a11yContent).toContain('aria-label');
      expect(a11yContent).toContain('aria-describedby');
      expect(a11yContent).toContain('aria-expanded');
      expect(a11yContent).toContain('aria-live');
      expect(a11yContent).toContain('role=');
      
      // Verify keyboard navigation
      expect(a11yContent).toContain('tabindex');
      expect(a11yContent).toContain('keydown');
      expect(a11yContent).toContain('focusable-elements');
      expect(a11yContent).toContain('skip-navigation');
      expect(a11yContent).toContain('focus-trap');
      
      // Verify screen reader support
      expect(a11yContent).toContain('screen-reader-only');
      expect(a11yContent).toContain('announceUpdate');
      expect(a11yContent).toContain('describeCampaignMetrics');
      expect(a11yContent).toContain('speakROASValue');
      
      // Verify color contrast compliance
      expect(a11yContent).toContain('checkColorContrast');
      expect(a11yContent).toContain('high-contrast-mode');
      expect(a11yContent).toContain('contrast-ratio');
      
      // Verify motor sports accessibility
      expect(a11yContent).toContain('K2Motor');
      expect(a11yContent).toContain('Performance Parts dashboard');
      expect(a11yContent).toContain('automotive performance metrics');
    });

    test('shouldAddPerformanceOptimizations', () => {
      // Test: Verify code splitting, lazy loading, and performance monitoring
      const perfPath = path.join(__dirname, '../dashboard/assets/js/performance-optimizer.js');
      expect(fs.existsSync(perfPath)).toBe(true);

      const perfContent = fs.readFileSync(perfPath, 'utf8');
      
      // Verify performance optimizer
      expect(perfContent).toContain('PerformanceOptimizer');
      expect(perfContent).toContain('initializePerformanceTracking');
      expect(perfContent).toContain('optimizeRenderingPipeline');
      expect(perfContent).toContain('enableCodeSplitting');
      
      // Verify lazy loading implementation
      expect(perfContent).toContain('lazyLoadComponents');
      expect(perfContent).toContain('IntersectionObserver');
      expect(perfContent).toContain('dynamic import');
      expect(perfContent).toContain('preloadCriticalResources');
      
      // Verify performance monitoring
      expect(perfContent).toContain('performance.measure');
      expect(perfContent).toContain('PerformanceObserver');
      expect(perfContent).toContain('Core Web Vitals');
      expect(perfContent).toContain('measureFCP');
      expect(perfContent).toContain('measureLCP');
      expect(perfContent).toContain('measureCLS');
      
      // Verify memory management
      expect(perfContent).toContain('cleanupEventListeners');
      expect(perfContent).toContain('debounce');
      expect(perfContent).toContain('throttle');
      expect(perfContent).toContain('WeakMap');
      
      // Verify caching strategies
      expect(perfContent).toContain('CacheManager');
      expect(perfContent).toContain('localStorage');
      expect(perfContent).toContain('sessionStorage');
      expect(perfContent).toContain('IndexedDB');
      
      // Verify K2Motor specific optimizations
      expect(perfContent).toContain('K2Motor');
      expect(perfContent).toContain('automotive-performance-dashboard');
      expect(perfContent).toContain('racing-theme-assets');
    });

  });
});