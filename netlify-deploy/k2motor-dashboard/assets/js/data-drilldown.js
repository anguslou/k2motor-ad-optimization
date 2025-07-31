// K2Motor Performance Parts - Data Drilldown System
// Click-through from summary to detailed views with comprehensive analytics

class DataDrilldown {
    constructor() {
        this.isInitialized = false;
        this.currentDetailView = null;
        this.drilldownHistory = [];
        this.detailModal = null;
        this.exportHandler = null;
        
        // Define drilldown content for K2Motor Performance Parts
        this.drilldownContent = {
            // Metric Analysis Content
            'active_campaigns': {
                title: 'Active Campaigns - Campaign Portfolio Analysis',
                category: 'Campaign Management Analytics',
                overview: {
                    totalRevenue: '$284,567',
                    adSpend: '$67,890',
                    roas: '4.19x',
                    poas: '2.1x',
                    orders: 547,
                    avgOrderValue: '$520'
                },
                roasBreakdown: {
                    organic: '2.8x baseline performance',
                    paid: '4.19x with active campaigns',
                    lift: '49.6% incremental revenue lift',
                    confidence: '94% statistical significance'
                },
                poasAnalysis: {
                    grossMargin: '42% average across all campaigns',
                    productCosts: '$169,456',
                    netProfit: '$115,111',
                    profitMargin: '40.4% net profit margin'
                },
                attributionDetails: {
                    directAttribution: '68% direct campaign attribution',
                    viewThroughConversions: '18% view-through impact',
                    assistedConversions: '14% cross-campaign assistance',
                    crossBrandInfluence: '12% inter-brand campaign spillover'
                },
                campaignPerformance: [
                    { name: 'Honda Type R Performance (Active)', spend: '$18,450', revenue: '$78,230', roas: '4.24x' },
                    { name: 'Subaru Turbo Systems (Active)', spend: '$15,680', revenue: '$66,170', roas: '4.22x' },
                    { name: 'BMW M Series Suspension (Active)', spend: '$12,340', revenue: '$43,980', roas: '3.56x' },
                    { name: 'eBay Niche Parts (Active)', spend: '$8,920', revenue: '$468,400', roas: '52.5x' },
                    { name: 'Amazon Retargeting (Active)', spend: '$12,500', revenue: '$190,000', roas: '15.2x' }
                ],
                topProducts: [
                    'Cobb Accessport V3 (Multiple Models)',
                    'BC Racing Coilovers (Universal)',
                    'Brembo GT Brake Kits (Honda/BMW)'
                ]
            },
            'avg_roas': {
                title: 'Average ROAS - Return on Ad Spend Analysis',
                category: 'Revenue Optimization Analytics',
                overview: {
                    totalRevenue: '$284,567',
                    adSpend: '$67,890',
                    roas: '4.19x',
                    poas: '2.1x',
                    orders: 547,
                    avgOrderValue: '$520'
                },
                roasBreakdown: {
                    organic: '2.8x organic baseline performance',
                    paid: '4.19x average across all paid campaigns',
                    lift: '49.6% incremental lift from paid advertising',
                    confidence: '95% confidence in ROAS measurement'
                },
                poasAnalysis: {
                    grossMargin: '42% weighted average margin',
                    productCosts: '$169,456 total product costs',
                    netProfit: '$115,111 net profit after costs',
                    profitMargin: '40.4% overall profit margin'
                },
                attributionDetails: {
                    directAttribution: '68% direct last-click attribution',
                    viewThroughConversions: '18% view-through conversions',
                    assistedConversions: '14% multi-touch attribution',
                    crossBrandInfluence: '12% cross-brand influence'
                },
                campaignPerformance: [
                    { name: 'eBay Niche Parts (Premium ROAS)', spend: '$8,920', revenue: '$468,400', roas: '52.5x' },
                    { name: 'Walmart Retargeting (High ROAS)', spend: '$12,050', revenue: '$183,160', roas: '15.2x' },
                    { name: 'Honda Type R (Excellent ROAS)', spend: '$18,450', revenue: '$78,230', roas: '4.24x' },
                    { name: 'Subaru WRX/STI (Strong ROAS)', spend: '$15,680', revenue: '$66,170', roas: '4.22x' },
                    { name: 'BMW M Series (Good ROAS)', spend: '$12,340', revenue: '$43,980', roas: '3.56x' }
                ],
                topProducts: [
                    'Rare JDM Parts (eBay Exclusive)',
                    'Precision Turbo Kits (High-Margin)',
                    'Carbon Fiber Aero Parts (Premium)'
                ]
            },
            'avg_cpc': {
                title: 'Average Cost Per Click - Cost Efficiency Analysis',
                category: 'Cost Optimization Analytics',
                overview: {
                    totalRevenue: '$284,567',
                    adSpend: '$67,890',
                    roas: '4.19x',
                    poas: '2.1x',
                    orders: 547,
                    avgOrderValue: '$520'
                },
                roasBreakdown: {
                    organic: '$0 CPC (organic traffic)',
                    paid: '$5.48 average CPC across all campaigns',
                    lift: '67% lower CPC than industry average ($16.80)',
                    confidence: '98% confidence in CPC optimization'
                },
                poasAnalysis: {
                    grossMargin: '42% margin maintained despite competitive CPCs',
                    productCosts: '$169,456 total acquisition costs',
                    netProfit: '$115,111 after accounting for click costs',
                    profitMargin: '40.4% efficiency despite premium CPCs'
                },
                attributionDetails: {
                    directAttribution: '$3.20 CPC for direct conversions',
                    viewThroughConversions: '$8.90 CPC for view-through',
                    assistedConversions: '$12.40 CPC for assisted conversions',
                    crossBrandInfluence: '$4.80 blended CPC with spillover'
                },
                campaignPerformance: [
                    { name: 'eBay Long-Tail Keywords (Low CPC)', spend: '$8,920', revenue: '$468,400', roas: '52.5x' },
                    { name: 'Amazon Brand Terms (Premium CPC)', spend: '$18,450', revenue: '$78,230', roas: '4.24x' },
                    { name: 'Google Shopping Ads (Mid CPC)', spend: '$15,680', revenue: '$66,170', roas: '4.22x' },
                    { name: 'Facebook Retargeting (Low CPC)', spend: '$12,050', revenue: '$183,160', roas: '15.2x' },
                    { name: 'BMW Competitive Terms (High CPC)', spend: '$12,340', revenue: '$43,980', roas: '3.56x' }
                ],
                topProducts: [
                    'Generic Performance Parts (Low CPC)',
                    'Brand-Specific Keywords (Premium CPC)',
                    'Long-Tail Modifiers (Efficient CPC)'
                ]
            },
            'Honda': {
                title: 'Honda Civic Type R Performance Parts - Detailed Analysis',
                category: 'Premium Sports Car Parts',
                overview: {
                    totalRevenue: '$16,130',
                    adSpend: '$2,450',
                    roas: '4.24x',
                    poas: '2.1x',
                    orders: 47,
                    avgOrderValue: '$343'
                },
                roasBreakdown: {
                    organic: '2.8x ROAS baseline',
                    paid: '4.24x ROAS with ads',
                    lift: '51.4% incremental lift',
                    confidence: '95% statistical significance'
                },
                poasAnalysis: {
                    grossMargin: '65% (High-performance parts)',
                    productCosts: '$5,245',
                    netProfit: '$8,435',
                    profitMargin: '52.3%'
                },
                attributionDetails: {
                    directAttribution: '68% of revenue',
                    viewThroughConversions: '18% of revenue',
                    assistedConversions: '14% of revenue',
                    crossBrandInfluence: '12% spillover to Subaru parts'
                },
                campaignPerformance: [
                    { name: 'Honda Type R Intake Systems', spend: '$850', revenue: '$4,250', roas: '5.0x' },
                    { name: 'Civic Si Brake Upgrades', spend: '$720', revenue: '$3,680', roas: '5.1x' },
                    { name: 'Type R Aerodynamic Kits', spend: '$880', revenue: '$4,200', roas: '4.8x' }
                ],
                topProducts: [
                    'Honda Civic Type R Cold Air Intake - K&N Performance',
                    'Brembo GT Brake Kit - Honda Civic Type R (FK8)',
                    'Mugen Front Splitter - Honda Civic Type R'
                ]
            },
            'Toyota': {
                title: 'Toyota Camry Performance Parts - Control Group Analysis',
                category: 'Mainstream Performance Parts (Control)',
                overview: {
                    totalRevenue: '$8,450',
                    adSpend: '$0',
                    roas: 'N/A (Control)',
                    poas: 'N/A (Control)',
                    orders: 28,
                    avgOrderValue: '$302'
                },
                roasBreakdown: {
                    organic: '100% organic demand',
                    paid: 'No advertising spend',
                    lift: 'Baseline performance',
                    confidence: 'Control group standard'
                },
                poasAnalysis: {
                    grossMargin: '45% (Standard parts)',
                    productCosts: '$4,648',
                    netProfit: '$3,802',
                    profitMargin: '45.0%'
                },
                attributionDetails: {
                    directAttribution: '100% organic traffic',
                    viewThroughConversions: '0% (no ads)',
                    assistedConversions: '0% (no ads)',
                    crossBrandInfluence: '5% influence from Honda campaigns'
                },
                campaignPerformance: [
                    { name: 'Organic Search (Control)', spend: '$0', revenue: '$8,450', roas: 'Baseline' }
                ],
                topProducts: [
                    'Toyota Camry Cold Air Intake - Standard Performance',
                    'OEM+ Brake Pads - Toyota Camry (XV70)',
                    'Performance Air Filter - Toyota Camry'
                ]
            },
            'Subaru': {
                title: 'Subaru WRX/STI Performance Parts - Detailed Analysis',
                category: 'Rally Performance Parts',
                overview: {
                    totalRevenue: '$19,250',
                    adSpend: '$4,560',
                    roas: '4.22x',
                    poas: '0.8x',
                    orders: 35,
                    avgOrderValue: '$550'
                },
                roasBreakdown: {
                    organic: '2.9x ROAS baseline',
                    paid: '4.22x ROAS with ads',
                    lift: '45.5% incremental lift',
                    confidence: '92% statistical significance'
                },
                poasAnalysis: {
                    grossMargin: '35% (High manufacturing costs)',
                    productCosts: '$12,513',
                    netProfit: '$2,177',
                    profitMargin: '11.3% (Needs optimization)'
                },
                attributionDetails: {
                    directAttribution: '72% of revenue',
                    viewThroughConversions: '16% of revenue',
                    assistedConversions: '12% of revenue',
                    crossBrandInfluence: '8% spillover from Honda campaigns'
                },
                campaignPerformance: [
                    { name: 'Subaru Turbo Upgrade Systems', spend: '$1,850', revenue: '$7,850', roas: '4.2x' },
                    { name: 'WRX Intercooler Kits', spend: '$1,420', revenue: '$6,150', roas: '4.3x' },
                    { name: 'STI Racing Suspension', spend: '$1,290', revenue: '$5,250', roas: '4.1x' }
                ],
                topProducts: [
                    'Cobb Accessport V3 - Subaru WRX/STI',
                    'Perrin Front Mount Intercooler - WRX',
                    'Coilovers - BC Racing BR Series WRX/STI'
                ]
            },
            'BMW': {
                title: 'BMW M3/M4 Performance Parts - Detailed Analysis',
                category: 'Luxury Performance Parts',
                overview: {
                    totalRevenue: '$14,680',
                    adSpend: '$4,120',
                    roas: '3.56x',
                    poas: '1.4x',
                    orders: 22,
                    avgOrderValue: '$667'
                },
                roasBreakdown: {
                    organic: '2.1x ROAS baseline',
                    paid: '3.56x ROAS with ads',
                    lift: '69.5% incremental lift',
                    confidence: '89% statistical significance'
                },
                poasAnalysis: {
                    grossMargin: '55% (Premium positioning)',
                    productCosts: '$6,606',
                    netProfit: '$4,954',
                    profitMargin: '33.7%'
                },
                attributionDetails: {
                    directAttribution: '65% of revenue',
                    viewThroughConversions: '22% of revenue',
                    assistedConversions: '13% of revenue',
                    crossBrandInfluence: '3% spillover (limited overlap)'
                },
                campaignPerformance: [
                    { name: 'BMW M Performance Exhaust', spend: '$1,620', revenue: '$5,850', roas: '3.6x' },
                    { name: 'M3/M4 Carbon Fiber Aero', spend: '$1,450', revenue: '$4,920', roas: '3.4x' },
                    { name: 'BMW M Suspension Upgrades', spend: '$1,050', revenue: '$3,910', roas: '3.7x' }
                ],
                topProducts: [
                    'Akrapovic Evolution Exhaust - BMW M3/M4',
                    'Carbon Fiber Front Splitter - BMW M4',
                    'KW Variant 3 Coilovers - BMW M3'
                ]
            },
            
            // Metric-Specific Analysis Content
            'roas_analysis': {
                title: 'ROAS Analysis - Return on Ad Spend Deep Dive',
                category: 'Revenue Performance Analytics', 
                overview: {
                    totalRevenue: '$11,287',
                    adSpend: '$2,320',
                    roas: '4.9x',
                    poas: '1.4x',
                    orders: 150,
                    avgOrderValue: '$75'
                },
                roasBreakdown: {
                    organic: '1.9x baseline without ads',
                    paid: '4.9x with advertising',
                    lift: '158% incremental lift from ads',  
                    confidence: '94.2% statistical confidence'
                },
                poasAnalysis: {
                    grossMargin: '35% weighted average',
                    productCosts: '$5,079 total costs',
                    netProfit: '$1,630 after all costs',
                    profitMargin: '14.4% net margin'
                }
            },
            'realroi_analysis': {
                title: 'Real ROI Analysis - True Incremental Return',
                category: 'Attribution Performance Analytics',
                overview: {
                    totalRevenue: '$11,287',
                    adSpend: '$2,320', 
                    roas: '4.9x',
                    poas: '1.4x',
                    orders: 150,
                    avgOrderValue: '$75'
                },
                roasBreakdown: {
                    organic: '40% would happen anyway',
                    paid: '60% truly incremental from ads',
                    lift: '2.9x real incremental return',
                    confidence: '94.2% attribution confidence'
                },
                poasAnalysis: {
                    incrementalRevenue: '$6,772 from ads only',
                    organicBaseline: '$4,515 baseline sales', 
                    netIncrementalProfit: '$978 true ad profit',
                    realROI: '2.9x after organic adjustment'
                }
            },
            'poas_analysis': {
                title: 'POAS Analysis - Profit on Ad Spend Deep Dive',
                category: 'Profitability Analytics',
                overview: {
                    totalRevenue: '$11,287',
                    adSpend: '$2,320',
                    roas: '4.9x', 
                    poas: '1.4x',
                    orders: 150,
                    avgOrderValue: '$75'
                },
                roasBreakdown: {
                    organic: '$1,577 organic profit',
                    paid: '$3,273 total profit from ads',
                    lift: '1.4x profit return on ad spend',
                    confidence: '100% - actual profit measured'
                },
                poasAnalysis: {
                    grossMargin: '$3,950 gross profit',
                    productCosts: '$5,079 total costs',
                    shippingFees: '$338 shipping costs',
                    netProfit: '$1,630 final profit'
                }
            },
            'revenue_analysis': {
                title: 'Revenue Analysis - Total Revenue Breakdown',
                category: 'Revenue Performance Analytics',
                overview: {
                    totalRevenue: '$11,287',
                    adSpend: '$2,320',
                    roas: '4.9x',
                    poas: '1.4x', 
                    orders: 150,
                    avgOrderValue: '$75'
                },
                roasBreakdown: {
                    organic: '$4,515 organic revenue',
                    paid: '$6,772 ad-driven revenue',
                    lift: '15.3% revenue growth trend',
                    confidence: '100% measured revenue'
                },
                poasAnalysis: {
                    platformRevenue: 'Amazon: $6,850 | eBay: $3,200 | Walmart: $1,237',
                    productMix: 'Turbo Parts: 45% | Suspension: 30% | Brakes: 25%',
                    seasonality: 'Q4 performance: +15.3% vs baseline',
                    orderTrends: '150 orders @ $75 AOV trending up'
                }
            },
            'total_campaigns_analysis': {
                title: 'Total Campaigns Analysis - Campaign Portfolio Overview',
                category: 'Campaign Management Analytics',
                overview: {
                    totalRevenue: '$11,287',
                    adSpend: '$2,320',
                    roas: '4.9x',
                    poas: '1.4x',
                    orders: 150,
                    avgOrderValue: '$75'
                },
                roasBreakdown: {
                    organic: '23 total campaigns created',
                    paid: '6 currently active campaigns',
                    lift: '17 paused or completed campaigns',
                    confidence: '100% campaign tracking coverage'
                },
                poasAnalysis: {
                    platformDistribution: 'Amazon: 8 | eBay: 7 | Walmart: 4 | Meta: 4',
                    campaignTypes: 'Search: 12 | Display: 6 | Shopping: 5',
                    performanceTiers: 'Top: 4 | Good: 8 | Needs Work: 11',
                    budgetAllocation: '70% budget on top 6 campaigns'
                }
            },
            'current_spend_analysis': {
                title: 'Current Spend Analysis - Monthly Ad Investment',
                category: 'Budget Management Analytics',
                overview: {
                    totalRevenue: '$11,287',
                    adSpend: '$2,320',
                    roas: '4.9x',
                    poas: '1.4x',
                    orders: 150,
                    avgOrderValue: '$75'
                },
                roasBreakdown: {
                    organic: 'Monthly budget: $3,000',
                    paid: 'Current spend: $2,320 (77.3%)',
                    lift: 'Remaining budget: $680',
                    confidence: 'On track for full utilization'
                },
                poasAnalysis: {
                    dailySpend: 'Daily average: $77 | Peak day: $142',
                    weeklyTrend: 'Week 1: $542 | Week 2: $580 | Week 3: $618 | Week 4: $580',
                    platformBreakdown: 'Amazon: $1,392 | eBay: $696 | Walmart: $232',
                    spendVelocity: 'Spending rate increasing 2.8% week-over-week'
                }
            },
            'budget_utilization_analysis': {
                title: 'Budget Utilization Analysis - Spending Efficiency',
                category: 'Budget Optimization Analytics',
                overview: {
                    totalRevenue: '$11,287',
                    adSpend: '$2,320',
                    roas: '4.9x',
                    poas: '1.4x',
                    orders: 150,
                    avgOrderValue: '$75'
                },
                roasBreakdown: {
                    organic: 'Total budget: $3,000/month',
                    paid: 'Utilized: 77.3% ($2,320)',
                    lift: 'Optimal range: 80-90%',
                    confidence: 'Good utilization rate'
                },
                poasAnalysis: {
                    historicalUtilization: 'Last 3 months: 72%, 78%, 77.3%',
                    platformUtilization: 'Amazon: 92% | eBay: 68% | Walmart: 54%',
                    opportunityCost: '$680 unspent = ~44 potential orders',
                    recommendation: 'Increase Walmart budget to improve utilization'
                }
            },
            'avg_poas_analysis': {
                title: 'Average POAS Analysis - Profitability Deep Dive',
                category: 'Profit Optimization Analytics',
                overview: {
                    totalRevenue: '$11,287',
                    adSpend: '$2,320',
                    roas: '4.9x',
                    poas: '1.4x',
                    orders: 150,
                    avgOrderValue: '$75'
                },
                roasBreakdown: {
                    organic: 'Revenue: $11,287',
                    paid: 'Gross profit: $3,950 (35% margin)',
                    lift: 'Ad spend: $2,320',
                    confidence: 'Net profit: $1,630 (1.4x POAS)'
                },
                poasAnalysis: {
                    platformPOAS: 'eBay: 2.8x | Walmart: 1.2x | Amazon: 0.9x',
                    productPOAS: 'Turbo kits: 2.1x | Suspension: 1.5x | Brakes: 0.8x',
                    marginAnalysis: 'High-margin items drive profitability',
                    optimization: 'Shift budget from low-POAS Amazon to high-POAS eBay'
                }
            },
            'efficiency_score_analysis': {
                title: 'Efficiency Score Analysis - Budget Performance Rating',
                category: 'Performance Optimization Analytics',
                overview: {
                    totalRevenue: '$11,287',
                    adSpend: '$2,320',
                    roas: '4.9x',
                    poas: '1.4x',
                    orders: 150,
                    avgOrderValue: '$75'
                },
                roasBreakdown: {
                    organic: 'Current score: 7.2/10',
                    paid: 'Platform balance: 6.5/10',
                    lift: 'Campaign optimization: 8.1/10',
                    confidence: 'Waste reduction: 7.8/10'
                },
                poasAnalysis: {
                    scoreBreakdown: 'ROAS weight: 30% | POAS weight: 40% | Efficiency: 30%',
                    improvements: '+0.8 pts by reallocating to eBay | +0.5 pts by pausing low performers',
                    benchmark: 'Industry average: 6.2/10 | Your score: 7.2/10',
                    targetScore: 'Goal: 8.0/10 achievable with recommended changes'
                }
            },
            'live_experiments_analysis': {
                title: 'Live Experiments Analysis - Attribution Testing Portfolio',
                category: 'Scientific Attribution Analytics',
                overview: {
                    totalRevenue: '$11,287',
                    adSpend: '$2,320',
                    roas: '4.9x',
                    poas: '1.4x',
                    orders: 150,
                    avgOrderValue: '$75'
                },
                roasBreakdown: {
                    organic: '5 live attribution tests running',
                    paid: 'Testing across 3 platforms',
                    lift: 'Average test duration: 21 days',
                    confidence: 'Statistical power: 92%'
                },
                poasAnalysis: {
                    experimentTypes: 'A/B Tests: 2 | Geo-split: 2 | Time-series: 1',
                    platformCoverage: 'Amazon: 2 tests | eBay: 2 tests | Walmart: 1 test',
                    testMaturity: 'Completed: 12 | Running: 5 | Planned: 3',
                    resultsTimeline: 'Next results: 3 days | Full analysis: 10 days'
                }
            },
            'incremental_lift_analysis': {
                title: 'Incremental Lift Analysis - True Ad Impact Measurement',
                category: 'Attribution Performance Analytics',
                overview: {
                    totalRevenue: '$11,287',
                    adSpend: '$2,320',
                    roas: '4.9x',
                    poas: '1.4x',
                    orders: 150,
                    avgOrderValue: '$75'
                },
                roasBreakdown: {
                    organic: 'Baseline sales: 40% happen without ads',
                    paid: 'Incremental: 60% truly driven by ads',
                    lift: 'Average lift: 65.3% above baseline',
                    confidence: '94.2% statistical confidence'
                },
                poasAnalysis: {
                    platformLifts: 'eBay: 89% | Walmart: 72% | Amazon: 42%',
                    productLifts: 'New products: 95% | Popular items: 45% | Niche parts: 120%',
                    seasonalImpact: 'Holiday lift: 85% | Regular season: 55%',
                    liftTrend: 'Improving 2.3% month-over-month'
                }
            },
            'test_investment_analysis': {
                title: 'Test Investment Analysis - Attribution Budget ROI',
                category: 'Testing Economics Analytics',
                overview: {
                    totalRevenue: '$11,287',
                    adSpend: '$2,320',
                    roas: '4.9x',
                    poas: '1.4x',
                    orders: 150,
                    avgOrderValue: '$75'
                },
                roasBreakdown: {
                    organic: 'Total test budget: $2,240',
                    paid: 'Test spend: 5% of total budget',
                    lift: 'Insights value: $8,960 in optimization',
                    confidence: 'ROI on testing: 4x return'
                },
                poasAnalysis: {
                    testAllocation: 'Control groups: $1,120 | Test groups: $1,120',
                    platformTests: 'Amazon: $896 | eBay: $672 | Walmart: $672',
                    testEfficiency: 'Cost per insight: $448 | Industry avg: $1,200',
                    savingsIdentified: 'Waste eliminated: $3,360/month from better attribution'
                }
            },
            'statistical_confidence_analysis': {
                title: 'Statistical Confidence Analysis - Test Reliability Metrics',
                category: 'Attribution Science Analytics',
                overview: {
                    totalRevenue: '$11,287',
                    adSpend: '$2,320',
                    roas: '4.9x',
                    poas: '1.4x',
                    orders: 150,
                    avgOrderValue: '$75'
                },
                roasBreakdown: {
                    organic: 'Average confidence: 94.2%',
                    paid: 'Tests above 95%: 3 of 5',
                    lift: 'Tests 90-95%: 2 of 5',
                    confidence: 'Statistical power: 0.85'
                },
                poasAnalysis: {
                    sampleSizes: 'Avg test size: 2,450 users | Min required: 2,000',
                    testDuration: 'Avg duration: 21 days | Min required: 14 days',
                    marginOfError: 'Average MoE: ±4.2% | Target: <5%',
                    decisionReadiness: '3 tests ready for budget decisions | 2 need more data'
                }
            },
            'spend_analysis': {
                title: 'Ad Spend Analysis - Budget Allocation & Efficiency',
                category: 'Cost Optimization Analytics',
                overview: {
                    totalRevenue: '$11,287',
                    adSpend: '$2,320',
                    roas: '4.9x',
                    poas: '1.4x',
                    orders: 150,
                    avgOrderValue: '$75'
                },
                roasBreakdown: {
                    organic: '$0 organic spend',
                    paid: '$2,320 total ad investment',
                    lift: '2.8% month-over-month spend increase',
                    confidence: '100% spend tracking accuracy'
                },
                poasAnalysis: {
                    platformSpend: 'Amazon: $1,392 | eBay: $696 | Walmart: $232',
                    spendEfficiency: 'CPC: $0.92 | CPM: $12.50 | CPA: $15.47',
                    budgetUtilization: '94% budget utilization rate',
                    optimizationOpportunity: '$348 potential savings identified'
                }
            }
        };
    }

    // Initialize data drilldown system
    initializeDataDrilldown() {
        console.log('🎯 Initializing K2Motor Performance Parts data drilldown...');
        
        // Create detailed view modal
        this.createDetailedView();
        
        // Bind drilldown events to dashboard elements
        this.bindDrilldownEvents();
        
        // Set up navigation functionality
        this.setupDrilldownNavigation();
        
        // Initialize export functionality
        this.initializeExportFunctionality();
        
        this.isInitialized = true;
        console.log('✅ K2Motor Performance Parts data drilldown ready');
    }

    // Create detailed view modal structure
    createDetailedView() {
        if (this.detailModal) return;
        
        this.detailModal = document.createElement('div');
        this.detailModal.className = 'detail-modal';
        this.detailModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 1000;
            display: none;
            overflow-y: auto;
        `;
        
        this.detailModal.innerHTML = `
            <div class="detail-container">
                <div class="detail-header">
                    <div class="drilldown-navigation">
                        <nav class="breadcrumb">
                            <span class="breadcrumb-item">K2Motor Dashboard</span>
                            <span class="breadcrumb-separator">></span>
                            <span class="breadcrumb-current">Overview</span>
                        </nav>
                        <div class="detail-controls">
                            <button class="back-button">← Back</button>
                            <button class="drill-deeper">Drill Deeper</button>
                            <button class="close-detail">✕</button>
                        </div>
                    </div>
                    <h2 class="detail-title">Detailed Analysis</h2>
                </div>
                
                <div class="detail-content">
                    <div class="loading-detail">
                        <div class="spinner"></div>
                        <p>Loading detailed analysis...</p>
                    </div>
                </div>
                
                <div class="detail-footer">
                    <div class="export-options">
                        <button class="export-btn" data-format="csv">
                            <span class="download-csv">📊</span>
                            Export CSV
                        </button>
                        <button class="export-btn" data-format="pdf">
                            <span class="generateReport">📄</span>
                            Generate Report
                        </button>
                        <button class="export-btn" data-format="json">
                            <span class="export-icon">💾</span>
                            Export Data
                        </button>
                    </div>
                    <div class="analysis-timestamp">
                        Generated: <span id="analysisTimestamp"></span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.detailModal);
        console.log('🎨 Created detailed view modal for K2Motor Performance Parts');
    }

    // Bind drilldown events to dashboard elements
    bindDrilldownEvents() {
        // Target drilldown triggers
        const drilldownSelectors = [
            '.metric-card',
            '.summary-metric-card',  // Budget Optimization tab metrics
            '.campaign-card', 
            '.scenario-alert',
            '.drilldown-trigger'
        ];
        
        // Use a single event listener with proper delegation
        document.addEventListener('click', (event) => {
            // Don't trigger drilldown if clicking on tooltip or tooltip content
            if (event.target.closest('.tooltip') || 
                event.target.closest('.tooltiptext') ||
                event.target.classList.contains('tooltip') ||
                event.target.classList.contains('tooltiptext')) {
                return;
            }
            
            // Check if click is on any drilldown trigger
            for (const selector of drilldownSelectors) {
                const element = event.target.closest(selector);
                if (element) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.handleDrilldownClick(event);
                    break;
                }
            }
        });
        
        // Modal control events
        if (this.detailModal) {
            // Close modal events
            this.detailModal.querySelector('.close-detail').addEventListener('click', () => {
                this.hideDetailedView();
            });
            
            this.detailModal.querySelector('.back-button').addEventListener('click', () => {
                this.navigateBack();
            });
            
            this.detailModal.querySelector('.drill-deeper').addEventListener('click', () => {
                this.drillDeeper();
            });
            
            // Export button events
            this.detailModal.querySelectorAll('.export-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const format = e.target.closest('.export-btn').dataset.format;
                    this.exportDetailedData(format);
                });
            });
            
            // Close on background click
            this.detailModal.addEventListener('click', (e) => {
                if (e.target === this.detailModal) {
                    this.hideDetailedView();
                }
            });
        }
        
        console.log('🖱️ Bound drilldown events for K2Motor Performance Parts');
    }

    // Handle drilldown click events
    handleDrilldownClick(event) {
        const element = event.target.closest('.metric-card, .summary-metric-card, .campaign-card, .scenario-alert, .drilldown-trigger');
        if (!element) {
            console.log('❌ No drilldown element found');
            return;
        }
        
        console.log('🎯 Drilldown element clicked:', element.className, element.textContent);
        
        // Determine drilldown context
        const drilldownType = this.determineDrilldownType(element);
        const drilldownKey = this.determineDrilldownKey(element);
        
        console.log(`🔍 Drilldown details: key="${drilldownKey}", type="${drilldownType}"`);
        
        if (drilldownKey && this.drilldownContent[drilldownKey]) {
            this.showDetailedView(drilldownKey, drilldownType);
        } else {
            // Generic drilldown for unknown elements
            console.log('⚠️ No specific content found, showing generic view');
            this.showGenericDetailedView(element);
        }
    }

    // Determine drilldown type from element
    determineDrilldownType(element) {
        if (element.classList.contains('metric-card')) return 'metric';
        if (element.classList.contains('summary-metric-card')) return 'budget-metric';
        if (element.classList.contains('campaign-card')) return 'campaign';
        if (element.classList.contains('scenario-alert')) return 'scenario';
        return 'generic';
    }

    // Determine drilldown key from element content
    determineDrilldownKey(element) {
        const textContent = element.textContent.toLowerCase();
        
        // Check for Advanced Attribution metric cards
        if (textContent.includes('live experiments')) return 'live_experiments_analysis';
        if (textContent.includes('avg incremental lift')) return 'incremental_lift_analysis';
        if (textContent.includes('test investment')) return 'test_investment_analysis';
        if (textContent.includes('statistical confidence')) return 'statistical_confidence_analysis';
        
        // Check for Budget Optimization metric cards
        if (textContent.includes('current spend')) return 'current_spend_analysis';
        if (textContent.includes('budget utilization')) return 'budget_utilization_analysis';
        if (textContent.includes('avg. poas')) return 'avg_poas_analysis';
        if (textContent.includes('efficiency score')) return 'efficiency_score_analysis';
        
        // Check for Campaign Deep Dive metric cards
        if (textContent.includes('total campaigns')) return 'total_campaigns_analysis';
        if (textContent.includes('active campaigns')) return 'active_campaigns';
        if (textContent.includes('avg roas')) return 'avg_roas';
        if (textContent.includes('avg cpc')) return 'avg_cpc';
        
        // Check for Overview tab metric cards
        if (textContent.includes('roas') && !textContent.includes('avg') && !textContent.includes('real roi') && !textContent.includes('poas')) return 'roas_analysis';
        if (textContent.includes('real roi')) return 'realroi_analysis';
        if (textContent.includes('poas')) return 'poas_analysis';
        if (textContent.includes('total revenue')) return 'revenue_analysis';
        if (textContent.includes('total spend')) return 'spend_analysis';
        
        // Check for car brand keys
        if (textContent.includes('honda') || textContent.includes('civic')) return 'Honda';
        if (textContent.includes('toyota') || textContent.includes('camry')) return 'Toyota';
        if (textContent.includes('subaru') || textContent.includes('wrx') || textContent.includes('sti')) return 'Subaru';
        if (textContent.includes('bmw') || textContent.includes('m3') || textContent.includes('m4')) return 'BMW';
        
        return null;
    }

    // Show detailed view for specific content
    showDetailedView(contentKey, drilldownType = 'generic') {
        if (!this.detailModal || !this.drilldownContent[contentKey]) return;
        
        const content = this.drilldownContent[contentKey];
        
        // Update breadcrumb
        this.updateBreadcrumb(content.title, drilldownType);
        
        // Update content
        this.updateDetailedContent(content);
        
        // Add to history
        this.drilldownHistory.push({ key: contentKey, type: drilldownType, timestamp: new Date() });
        
        // Show modal
        this.detailModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        this.currentDetailView = contentKey;
        console.log(`📊 Showing detailed view: ${content.title}`);
    }

    // Update detailed content
    updateDetailedContent(content) {
        const contentContainer = this.detailModal.querySelector('.detail-content');
        
        contentContainer.innerHTML = `
            <div class="detailed-analysis">
                <div class="analysis-header">
                    <h3>${content.title}</h3>
                    <span class="analysis-category">${content.category}</span>
                </div>
                
                <div class="analysis-sections">
                    <div class="overview-section">
                        <h4>📊 Performance Overview</h4>
                        <div class="metrics-breakdown">
                            <div class="metric-row">
                                <span class="metric-label">Total Revenue:</span>
                                <span class="metric-value">${content.overview?.totalRevenue || '$0'}</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">Ad Spend:</span>
                                <span class="metric-value">${content.overview?.adSpend || '$0'}</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">ROAS:</span>
                                <span class="metric-value">${content.overview?.roas || '0x'}</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">POAS:</span>
                                <span class="metric-value">${content.overview?.poas || '0x'}</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">Orders:</span>
                                <span class="metric-value">${content.overview?.orders || '0'}</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">Avg Order Value:</span>
                                <span class="metric-value">${content.overview?.avgOrderValue || '$0'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="roas-section">
                        <h4>📈 ROAS breakdown</h4>
                        <div class="roas-details">
                            <p><strong>Organic Performance:</strong> ${content.roasBreakdown?.organic || 'N/A'}</p>
                            <p><strong>Paid Performance:</strong> ${content.roasBreakdown?.paid || 'N/A'}</p>
                            <p><strong>Incremental Lift:</strong> ${content.roasBreakdown?.lift || 'N/A'}</p>
                            <p><strong>Statistical Confidence:</strong> ${content.roasBreakdown?.confidence || 'N/A'}</p>
                        </div>
                    </div>
                    
                    <div class="poas-section">
                        <h4>💰 POAS analysis</h4>
                        <div class="poas-details">
                            <p><strong>Gross Margin:</strong> ${content.poasAnalysis?.grossMargin || 'N/A'}</p>
                            <p><strong>Product Costs:</strong> ${content.poasAnalysis?.productCosts || 'N/A'}</p>
                            <p><strong>Net Profit:</strong> ${content.poasAnalysis?.netProfit || 'N/A'}</p>
                            <p><strong>Profit Margin:</strong> ${content.poasAnalysis?.profitMargin || 'N/A'}</p>
                        </div>
                    </div>
                    
                    <div class="attribution-section">
                        <h4>🧮 Attribution details</h4>
                        <div class="attribution-breakdown">
                            <p><strong>Direct Attribution:</strong> ${content.attributionDetails?.directAttribution || 'N/A'}</p>
                            <p><strong>View-Through Conversions:</strong> ${content.attributionDetails?.viewThroughConversions || 'N/A'}</p>
                            <p><strong>Assisted Conversions:</strong> ${content.attributionDetails?.assistedConversions || 'N/A'}</p>
                            <p><strong>Cross-Brand Influence:</strong> ${content.attributionDetails?.crossBrandInfluence || 'N/A'}</p>
                        </div>
                    </div>
                    
                    <div class="campaigns-section">
                        <h4>🎯 Campaign performance</h4>
                        <div class="detailed-chart">
                            <div class="campaign-table">
                                ${(content.campaignPerformance || []).map(campaign => `
                                    <div class="campaign-row">
                                        <div class="campaign-name">${campaign.name}</div>
                                        <div class="campaign-metrics">
                                            <span>Spend: ${campaign.spend}</span>
                                            <span>Revenue: ${campaign.revenue}</span>
                                            <span>ROAS: ${campaign.roas}</span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="products-section">
                        <h4>🏆 Top Performing Products</h4>
                        <div class="performance-breakdown">
                            <ul class="product-list">
                                ${(content.topProducts || []).map(product => `
                                    <li class="product-item">${product}</li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                    
                    <div class="trend-section">
                        <h4>📊 trend-analysis</h4>
                        <div class="trend-chart-placeholder">
                            <div class="mock-trend-chart">
                                <div class="trend-line"></div>
                                <p>30-day performance trend for ${content.title}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Update timestamp
        const timestampElement = this.detailModal.querySelector('#analysisTimestamp');
        if (timestampElement) {
            timestampElement.textContent = new Date().toLocaleString();
        }
    }

    // Update breadcrumb navigation
    updateBreadcrumb(title, type) {
        const breadcrumbCurrent = this.detailModal.querySelector('.breadcrumb-current');
        if (breadcrumbCurrent) {
            breadcrumbCurrent.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} Analysis`;
        }
        
        // Update detail title
        const detailTitle = this.detailModal.querySelector('.detail-title');
        if (detailTitle) {
            detailTitle.textContent = title;
        }
    }

    // Hide detailed view
    hideDetailedView() {
        if (!this.detailModal) return;
        
        this.detailModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        this.currentDetailView = null;
        console.log('👁️ Closed K2Motor Performance Parts detailed view');
    }

    // Close detail view (alias for hideDetailedView)
    closeDetailView() {
        this.hideDetailedView();
    }

    // Navigate back in drilldown history
    navigateBack() {
        if (this.drilldownHistory.length > 1) {
            // Remove current view
            this.drilldownHistory.pop();
            
            // Get previous view
            const previousView = this.drilldownHistory[this.drilldownHistory.length - 1];
            
            if (previousView && this.drilldownContent[previousView.key]) {
                this.showDetailedView(previousView.key, previousView.type);
            } else {
                this.hideDetailedView();
            }
        } else {
            this.hideDetailedView();
        }
        
        console.log('⬅️ Navigated back in K2Motor Performance Parts drilldown');
    }

    // Drill deeper into data
    drillDeeper() {
        if (!this.currentDetailView) return;
        
        // Create deeper analysis view
        const deeperContent = this.generateDeeperAnalysis(this.currentDetailView);
        
        if (deeperContent) {
            this.showGenericDetailedView(null, deeperContent);
            console.log('🔍 Drilled deeper into K2Motor Performance Parts data');
        }
    }

    // Generate deeper analysis content
    generateDeeperAnalysis(contentKey) {
        const baseContent = this.drilldownContent[contentKey];
        if (!baseContent) return null;
        
        return {
            title: `${baseContent.title} - Deep Dive Analysis`,
            category: `Advanced ${baseContent.category} Analytics`,
            deepAnalysis: {
                hourlyPerformance: 'Peak performance: 2-4 PM EST (34% of daily revenue)',
                deviceBreakdown: 'Mobile: 68% | Desktop: 32% | Tablet: 12%',
                geographicDistribution: 'Top markets: CA (28%), TX (18%), FL (15%)',
                seasonalTrends: 'Q4 peak: +145% revenue vs Q1 baseline',
                customerSegmentation: 'Returning customers: 67% | New customers: 33%',
                conversionFunnel: 'View: 100% → Add to Cart: 23% → Purchase: 8.2%'
            }
        };
    }

    // Show generic detailed view
    showGenericDetailedView(element, customContent = null) {
        if (!this.detailModal) return;
        
        // Get real data from dashboard if available
        const realData = this.getRealDashboardData();
        
        const content = customContent || {
            title: 'K2Motor Performance Parts - Analysis',
            category: 'Dashboard Analytics',
            overview: {
                totalRevenue: realData.totalRevenue,
                adSpend: realData.totalSpend,
                roas: realData.totalROAS,
                poas: realData.totalPOAS,
                orders: Math.round(parseInt(realData.totalRevenue.replace(/[$,]/g, '')) / 75).toString(), // Avg order $75
                avgOrderValue: '$75',
                dataPoints: `${realData.activeCampaigns} campaigns analyzed`,
                timeRange: 'Last 30 days',
                platforms: '4 advertising platforms (Amazon, eBay, Walmart, Meta)',  
                campaigns: `${realData.activeCampaigns} active campaigns`
            },
            roasBreakdown: {
                organic: realData.organicPerformance,
                paid: realData.paidPerformance, 
                lift: realData.incrementalLift,
                confidence: realData.confidence
            },
            poasAnalysis: {
                grossMargin: realData.grossMargin,
                productCosts: realData.productCosts,
                netProfit: realData.netProfit,
                profitMargin: realData.profitMargin
            }
        };
        
        this.updateDetailedContent(content);
        this.updateBreadcrumb(content.title, 'analysis');
        
        this.detailModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        console.log('📊 Showing K2Motor Performance Parts detailed view with real data');
    }

    // Get real dashboard data from the dashboard content instance
    getRealDashboardData() {
        try {
            // Try to get data from the dashboard content instance
            if (window.dashboardContent && window.dashboardContent.calculateOverviewMetrics) {
                const metrics = window.dashboardContent.calculateOverviewMetrics();
                const activeCampaigns = window.dashboardContent.campaignData ? 
                    window.dashboardContent.campaignData.filter(c => c.status === 'Active' || c.status === 'Top Performer').length : 23;
                
                return {
                    totalRevenue: `$${metrics.totalRevenue.toLocaleString()}`,
                    totalSpend: `$${metrics.totalSpend.toLocaleString()}`,
                    totalROAS: `${metrics.totalROAS.toFixed(1)}x`,
                    totalPOAS: `${metrics.totalPOAS.toFixed(1)}x`,
                    totalRealROI: `${metrics.totalRealROI.toFixed(1)}x`,
                    activeCampaigns: activeCampaigns,
                    organicPerformance: `${((metrics.totalRevenue * 0.4) / metrics.totalSpend).toFixed(1)}x`,
                    paidPerformance: `${((metrics.totalRevenue * 0.6) / metrics.totalSpend).toFixed(1)}x`,
                    incrementalLift: `${(((metrics.totalRevenue * 0.6) - (metrics.totalRevenue * 0.4)) / (metrics.totalRevenue * 0.4) * 100).toFixed(1)}%`,
                    confidence: '94.2%',
                    grossMargin: `${(metrics.totalRevenue * 0.35).toLocaleString()}`,
                    productCosts: `${(metrics.totalRevenue * 0.45).toLocaleString()}`,
                    netProfit: `${((metrics.totalRevenue * 0.35) - metrics.totalSpend).toLocaleString()}`,
                    profitMargin: `${(((metrics.totalRevenue * 0.35) - metrics.totalSpend) / metrics.totalRevenue * 100).toFixed(1)}%`
                };
            }
        } catch (error) {
            console.warn('Could not get real dashboard data:', error);
        }
        
        // Fallback to default values if real data unavailable
        return {
            totalRevenue: '$11,287',
            totalSpend: '$2,320', 
            totalROAS: '4.9x',
            totalPOAS: '1.4x',
            totalRealROI: '2.9x',
            activeCampaigns: 6,
            organicPerformance: '1.9x',
            paidPerformance: '2.9x',
            incrementalLift: '52.6%',
            confidence: '94.2%',
            grossMargin: '$3,950',
            productCosts: '$5,079',
            netProfit: '$1,630',
            profitMargin: '14.4%'
        };
    }

    // Setup drilldown navigation
    setupDrilldownNavigation() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.detailModal && this.detailModal.style.display === 'block') {
                switch (e.key) {
                    case 'Escape':
                        this.hideDetailedView();
                        break;
                    case 'ArrowLeft':
                        this.navigateBack();
                        break;
                    case 'ArrowDown':
                        this.drillDeeper();
                        break;
                }
            }
        });
        
        console.log('⌨️ Set up K2Motor Performance Parts drilldown navigation');
    }

    // Initialize export functionality
    initializeExportFunctionality() {
        this.exportHandler = {
            csv: (data) => this.exportToCSV(data),
            pdf: (data) => this.generateReport(data),
            json: (data) => this.exportToJSON(data)
        };
        
        console.log('💾 Initialized K2Motor Performance Parts export functionality');
    }

    // Export detailed data to various formats
    exportDetailedData(format) {
        if (!this.currentDetailView || !this.exportHandler[format]) return;
        
        const data = this.drilldownContent[this.currentDetailView];
        
        try {
            this.exportHandler[format](data);
            this.showExportFeedback(format);
            console.log(`📊 Exported K2Motor Performance Parts data as ${format.toUpperCase()}`);
        } catch (error) {
            console.error('Export failed:', error);
            this.showExportError(format);
        }
    }

    // Export to CSV format
    exportToCSV(data) {
        const csvContent = this.generateCSVContent(data);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `k2motor-${data.title.replace(/\s+/g, '-')}-analysis.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(url);
    }

    // Generate CSV content
    generateCSVContent(data) {
        let csv = 'Metric,Value\n';
        
        // Add overview metrics
        Object.entries(data.overview).forEach(([key, value]) => {
            csv += `${key},${value}\n`;
        });
        
        // Add campaign performance
        csv += '\nCampaign,Spend,Revenue,ROAS\n';
        data.campaignPerformance.forEach(campaign => {
            csv += `${campaign.name},${campaign.spend},${campaign.revenue},${campaign.roas}\n`;
        });
        
        return csv;
    }

    // Generate PDF report
    generateReport(data) {
        // Mock PDF generation - would integrate with actual PDF library
        const reportContent = `
            K2Motor Performance Parts Analysis Report
            ==========================================
            
            ${data.title}
            Generated: ${new Date().toLocaleDateString()}
            
            Performance Overview:
            - Total Revenue: ${data.overview.totalRevenue}
            - Ad Spend: ${data.overview.adSpend}
            - ROAS: ${data.overview.roas}
            - POAS: ${data.overview.poas}
            
            Campaign Performance:
            ${data.campaignPerformance.map(c => `- ${c.name}: ${c.roas} ROAS`).join('\n')}
        `;
        
        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `k2motor-${data.title.replace(/\s+/g, '-')}-report.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(url);
    }

    // Export to JSON format
    exportToJSON(data) {
        const jsonContent = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `k2motor-${data.title.replace(/\s+/g, '-')}-data.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(url);
    }

    // Show export feedback
    showExportFeedback(format) {
        const feedback = document.createElement('div');
        feedback.className = 'export-feedback';
        feedback.innerHTML = `
            <div class="feedback-content">
                <span class="feedback-icon">✅</span>
                Successfully exported K2Motor Performance Parts data as ${format.toUpperCase()}
            </div>
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            document.body.removeChild(feedback);
        }, 3000);
    }

    // Show export error
    showExportError(format) {
        const error = document.createElement('div');
        error.className = 'export-error';
        error.innerHTML = `
            <div class="error-content">
                <span class="error-icon">❌</span>
                Failed to export data as ${format.toUpperCase()}
            </div>
        `;
        
        document.body.appendChild(error);
        
        setTimeout(() => {
            document.body.removeChild(error);
        }, 3000);
    }

    // Get drilldown statistics
    getDrilldownStats() {
        return {
            availableContent: Object.keys(this.drilldownContent).length,
            historyLength: this.drilldownHistory.length,
            currentView: this.currentDetailView,
            isModalOpen: this.detailModal && this.detailModal.style.display === 'block',
            initialized: this.isInitialized
        };
    }
}

// Initialize data drilldown system
const dataDrilldown = new DataDrilldown();

// Auto-start when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    dataDrilldown.initializeDataDrilldown();
    console.log('🎯 K2Motor Performance Parts data drilldown system ready');
});

// Add drilldown styles
const drilldownStyles = `
<style>
.detail-modal {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.detail-container {
    max-width: 1200px;
    margin: 40px auto;
    background: var(--carbon-fiber);
    border-radius: 15px;
    border: 1px solid var(--racing-orange);
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.detail-header {
    background: linear-gradient(135deg, var(--carbon-fiber) 0%, rgba(255, 107, 53, 0.1) 100%);
    padding: 20px 30px;
    border-bottom: 2px solid var(--racing-orange);
}

.drilldown-navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #ccc;
    font-size: 0.9rem;
}

.breadcrumb-current {
    color: var(--electric-blue);
    font-weight: bold;
}

.breadcrumb-separator {
    color: var(--racing-orange);
}

.detail-controls {
    display: flex;
    gap: 10px;
}

.back-button, .drill-deeper, .close-detail {
    background: var(--carbon-fiber);
    border: 1px solid #333;
    color: white;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

.back-button:hover, .drill-deeper:hover {
    border-color: var(--electric-blue);
    background: rgba(0, 212, 255, 0.1);
}

.close-detail {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
}

.close-detail:hover {
    border-color: var(--racing-orange);
    background: rgba(255, 107, 53, 0.1);
}

.detail-title {
    color: var(--racing-orange);
    font-size: 1.6rem;
    margin: 0;
    font-weight: bold;
}

.detail-content {
    padding: 30px;
    color: white;
    max-height: 70vh;
    overflow-y: auto;
}

.detailed-analysis {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.analysis-header {
    text-align: center;
    padding-bottom: 20px;
    border-bottom: 1px solid #333;
}

.analysis-header h3 {
    color: var(--electric-blue);
    font-size: 1.4rem;
    margin-bottom: 8px;
}

.analysis-category {
    color: var(--racing-orange);
    font-size: 0.9rem;
    font-weight: 500;
    padding: 4px 12px;
    background: rgba(255, 107, 53, 0.1);
    border-radius: 20px;
    border: 1px solid var(--racing-orange);
}

.analysis-sections {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 25px;
}

.overview-section, .roas-section, .poas-section, .attribution-section, 
.campaigns-section, .products-section, .trend-section {
    background: rgba(26, 26, 46, 0.5);
    border: 1px solid #333;
    border-radius: 10px;
    padding: 20px;
}

.overview-section h4, .roas-section h4, .poas-section h4, .attribution-section h4,
.campaigns-section h4, .products-section h4, .trend-section h4 {
    color: var(--electric-blue);
    font-size: 1.1rem;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.metrics-breakdown, .roas-details, .poas-details, .attribution-breakdown {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.metric-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.metric-label {
    color: #ccc;
    font-size: 0.9rem;
}

.metric-value {
    color: var(--racing-orange);
    font-weight: bold;
    font-family: 'Courier New', monospace;
}

.roas-details p, .poas-details p, .attribution-breakdown p {
    color: #ccc;
    line-height: 1.6;
    margin: 8px 0;
}

.roas-details strong, .poas-details strong, .attribution-breakdown strong {
    color: var(--electric-blue);
}

.detailed-chart {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    padding: 15px;
}

.campaign-table {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.campaign-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background: var(--carbon-fiber);
    border-radius: 6px;
    border: 1px solid #333;
}

.campaign-name {
    color: white;
    font-weight: 500;
    flex: 1;
}

.campaign-metrics {
    display: flex;
    gap: 15px;
    font-size: 0.8rem;
    color: #ccc;
}

.performance-breakdown {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    padding: 15px;
}

.product-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.product-item {
    padding: 8px 0;
    color: #ccc;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
    padding-left: 20px;
}

.product-item::before {
    content: '🏎️';
    position: absolute;
    left: 0;
    top: 8px;
}

.trend-chart-placeholder {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    padding: 20px;
    text-align: center;
}

.mock-trend-chart {
    height: 120px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    position: relative;
}

.trend-line {
    width: 80%;
    height: 3px;
    background: linear-gradient(90deg, var(--racing-orange), var(--electric-blue));
    border-radius: 2px;
    position: relative;
}

.trend-line::after {
    content: '';
    position: absolute;
    right: -3px;
    top: -3px;
    width: 8px;
    height: 8px;
    background: var(--electric-blue);
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(0, 212, 255, 0.5);
}

.mock-trend-chart p {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    color: #ccc;
    font-size: 0.8rem;
    margin: 0;
}

.detail-footer {
    background: var(--carbon-fiber);
    border-top: 1px solid #333;
    padding: 20px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.export-options {
    display: flex;
    gap: 10px;
}

.export-btn {
    background: var(--racing-orange);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.3s ease;
}

.export-btn:hover {
    background: #ff8555;
    transform: translateY(-1px);
}

.analysis-timestamp {
    color: #ccc;
    font-size: 0.8rem;
}

.export-feedback, .export-error {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    z-index: 1001;
    font-size: 0.9rem;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.export-feedback {
    background: var(--neon-green);
    color: white;
}

.export-error {
    background: var(--danger-red);
    color: white;
}

.feedback-content, .error-content {
    display: flex;
    align-items: center;
    gap: 8px;
}

.loading-detail {
    text-align: center;
    padding: 40px;
    color: #ccc;
}

.loading-detail .spinner {
    width: 30px;
    height: 30px;
    border: 3px solid #333;
    border-top: 3px solid var(--racing-orange);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 15px;
}

/* Responsive design */
@media (max-width: 768px) {
    .detail-container {
        margin: 20px;
        border-radius: 10px;
    }
    
    .detail-header {
        padding: 15px 20px;
    }
    
    .drilldown-navigation {
        flex-direction: column;
        gap: 10px;
    }
    
    .detail-content {
        padding: 20px;
    }
    
    .analysis-sections {
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .detail-footer {
        flex-direction: column;
        gap: 15px;
        padding: 15px 20px;
    }
    
    .export-options {
        flex-wrap: wrap;
        justify-content: center;
    }
}
</style>
`;

// Inject drilldown styles
document.head.insertAdjacentHTML('beforeend', drilldownStyles);

// Make globally available
window.dataDrilldown = dataDrilldown;