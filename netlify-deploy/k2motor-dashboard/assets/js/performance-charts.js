/**
 * K2Motor Dashboard - Performance Charts
 * Interactive charts showing ROAS trends, attribution analysis, and scenario impact
 */

class PerformanceCharts {
    constructor() {
        this.activeChart = 'roas';
        this.chartData = {};
        this.colors = {
            primary: '#FF6B35',      // Racing orange
            secondary: '#00D4FF',    // Electric blue
            background: '#1a1a2e',   // Carbon fiber
            text: '#ffffff',
            grid: '#333333'
        };
        this.init();
    }

    init() {
        this.setupEventHandlers();
        this.loadChartData();
        this.initializeCharts();
    }

    setupEventHandlers() {
        // Chart toggle buttons
        document.querySelectorAll('.chart-toggle').forEach(button => {
            button.addEventListener('click', (e) => {
                const chartType = e.target.dataset.chart;
                this.switchChart(chartType);
            });
        });

        // Data refresh handler
        document.addEventListener('metricsUpdated', () => {
            this.updateChartData();
        });
    }

    loadChartData() {
        // Get data from global dashboard data
        this.chartData = {
            campaign_data: window.dashboardData?.campaign_data || [],
            attribution_data: window.dashboardData?.attribution_data || [],
            sports_car_products: window.dashboardData?.sports_car_products || []
        };

        console.log('📈 Chart data loaded for Performance Parts analysis');
    }

    initializeCharts() {
        // Initialize all chart containers
        this.createROASTrendChart();
        this.createAttributionChart();
        this.createScenarioImpactChart();
        
        // Show default chart
        this.switchChart(this.activeChart);
    }

    // Method to reinitialize charts
    reinitializeCharts() {
        this.initializeCharts();
    }

    switchChart(chartType) {
        // Update active chart
        this.activeChart = chartType;
        
        // Update toggle buttons
        document.querySelectorAll('.chart-toggle').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-chart="${chartType}"]`)?.classList.add('active');
        
        // Show/hide chart containers
        document.querySelectorAll('.chart-wrapper').forEach(wrapper => {
            wrapper.classList.remove('active');
        });
        document.getElementById(`${chartType}-trend-chart`)?.classList.add('active');
        
        console.log(`📊 Switched to ${chartType} chart for K2Motor Performance Parts`);
    }

    createROASTrendChart() {
        const container = document.getElementById('roas-trend-chart');
        if (!container) return;

        const campaigns = this.chartData.campaign_data || [];
        const target = DASHBOARD_CONFIG?.company_info?.target_roas || 4.2;

        // Calculate trend data from campaigns
        const trendData = this.calculateROASTrend(campaigns);
        const trueROASData = this.calculateTrueROASTrend();

        container.innerHTML = `
            <div class="chart-container">
                <div class="chart-header">
                    <h4>ROAS Performance Trend - K2Motor Performance Parts</h4>
                    <div class="chart-legend">
                        <div class="legend-item">
                            <span class="legend-color" style="background: ${this.colors.primary}"></span>
                            <span>Apparent ROAS</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-color" style="background: ${this.colors.secondary}"></span>
                            <span>True ROAS (Attribution Adjusted)</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-color dashed" style="border-top: 2px dashed #666"></span>
                            <span>Target: 4.2x</span>
                        </div>
                    </div>
                </div>
                
                <div class="chart-visualization">
                    <div class="chart-y-axis">
                        <div class="y-label" style="bottom: 90%">6.0x</div>
                        <div class="y-label" style="bottom: 75%">5.0x</div>
                        <div class="y-label" style="bottom: 60%">4.0x</div>
                        <div class="y-label" style="bottom: 45%">3.0x</div>
                        <div class="y-label" style="bottom: 30%">2.0x</div>
                        <div class="y-label" style="bottom: 15%">1.0x</div>
                    </div>
                    
                    <div class="chart-area">
                        <!-- Target line -->
                        <div class="target-line" style="bottom: 70%; border-top: 2px dashed #666">
                            <span class="target-label">Target: 4.2x</span>
                        </div>
                        
                        <!-- Apparent ROAS line -->
                        <svg class="chart-svg" viewBox="0 0 300 150">
                            <polyline 
                                points="0,80 50,70 100,60 150,55 200,52 250,50 300,48"
                                fill="none" 
                                stroke="${this.colors.primary}" 
                                stroke-width="3"
                                class="roas-line apparent-roas"
                            />
                            <circle cx="300" cy="48" r="4" fill="${this.colors.primary}" class="current-point"/>
                        </svg>
                        
                        <!-- True ROAS line -->
                        <svg class="chart-svg" viewBox="0 0 300 150">
                            <polyline 
                                points="0,95 50,85 100,75 150,70 200,68 250,65 300,63"
                                fill="none" 
                                stroke="${this.colors.secondary}" 
                                stroke-width="3"
                                class="roas-line true-roas"
                            />
                            <circle cx="300" cy="63" r="4" fill="${this.colors.secondary}" class="current-point"/>
                        </svg>
                    </div>
                    
                    <div class="chart-x-axis">
                        <span>30 days ago</span>
                        <span>20 days</span>
                        <span>10 days</span>
                        <span>Today</span>
                    </div>
                </div>
                
                <div class="chart-insights">
                    <div class="insight-box">
                        <h5>Performance Parts Insights:</h5>
                        <ul>
                            <li>Apparent ROAS: ${trendData.currentROAS.toFixed(2)}x (${trendData.currentROAS >= target ? 'Above' : 'Below'} target)</li>
                            <li>True ROAS: ${trueROASData.current.toFixed(2)}x (Attribution adjusted)</li>
                            <li>Trend: ${trendData.trend > 0 ? '↗️ Improving' : '↘️ Declining'} (${Math.abs(trendData.trend).toFixed(1)}%)</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    createAttributionChart() {
        const container = document.getElementById('attribution-chart');
        if (!container) return;

        const attributionData = this.chartData.attribution_data || [];
        const hondaCivicData = attributionData.find(a => a.testProduct.brand?.includes('Honda Civic'));
        const toyotaCamryData = attributionData.find(a => a.controlProduct.brand?.includes('Toyota Camry'));

        container.innerHTML = `
            <div class="chart-container">
                <div class="chart-header">
                    <h4>Cross-Brand Attribution Analysis - Honda vs Toyota</h4>
                    <div class="chart-subtitle">K2Motor Performance Parts: Brake Pads Comparison Study</div>
                </div>
                
                <div class="attribution-visualization">
                    <div class="comparison-bars">
                        <div class="brand-comparison honda-civic">
                            <div class="brand-header">
                                <h5>Honda Civic (Test Group)</h5>
                                <span class="ad-status">With Ads</span>
                            </div>
                            <div class="metrics-stack">
                                <div class="metric-bar organic" style="height: 35%; background: #10b981">
                                    <span class="metric-label">Organic: $3,240</span>
                                </div>
                                <div class="metric-bar paid" style="height: 65%; background: ${this.colors.primary}">
                                    <span class="metric-label">True Ad Revenue: $8,440</span>
                                </div>
                            </div>
                            <div class="brand-stats">
                                <div>Total Revenue: $16,130</div>
                                <div>Ad Spend: $2,450</div>
                                <div>True ROAS: 4.77x</div>
                            </div>
                        </div>
                        
                        <div class="brand-comparison toyota-camry">
                            <div class="brand-header">
                                <h5>Toyota Camry (Control Group)</h5>
                                <span class="ad-status control">No Ads</span>
                            </div>
                            <div class="metrics-stack">
                                <div class="metric-bar organic" style="height: 100%; background: #10b981">
                                    <span class="metric-label">Organic Only: $8,450</span>
                                </div>
                            </div>
                            <div class="brand-stats">
                                <div>Total Revenue: $8,450</div>
                                <div>Ad Spend: $0</div>
                                <div>Control Baseline</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="attribution-insights">
                        <div class="insight-card">
                            <h5>🎯 Attribution Results</h5>
                            <div class="result-metrics">
                                <div class="result-item">
                                    <span class="label">Incremental Lift:</span>
                                    <span class="value">${hondaCivicData?.attributionResults?.liftPercentage ? (hondaCivicData.attributionResults.liftPercentage * 100).toFixed(1) : '52.4'}%</span>
                                </div>
                                <div class="result-item">
                                    <span class="label">Confidence Interval:</span>
                                    <span class="value">95% (0.47 - 0.58)</span>
                                </div>
                                <div class="result-item">
                                    <span class="label">cross-brand Correlation:</span>
                                    <span class="value">0.89 (High)</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="insight-card">
                            <h5>🏎️ Performance Parts Analysis</h5>
                            <p>Honda Civic brake pad ads generated significant organic search lift. Users exposed to Performance Parts ads often search for general "brake pads" or competitor products, inflating apparent ROAS.</p>
                            <p>The cross-brand control methodology reveals true ad impact by comparing similar products (brake pads) across comparable vehicle segments.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createScenarioImpactChart() {
        const container = document.getElementById('scenario-impact-chart');
        if (!container) return;

        const campaigns = this.chartData.campaign_data || [];
        const scenarioImpacts = this.calculateScenarioImpacts(campaigns);

        container.innerHTML = `
            <div class="chart-container">
                <div class="chart-header">
                    <h4>Scenario Impact Analysis - K2Motor Performance Parts</h4>
                    <div class="chart-subtitle">Revenue impact of 10 optimization scenarios</div>
                </div>
                
                <div class="scenario-impact-grid">
                    ${scenarioImpacts.map(scenario => `
                        <div class="scenario-card ${scenario.type}">
                            <div class="scenario-header">
                                <span class="scenario-number">${scenario.id}</span>
                                <h5>${scenario.title}</h5>
                            </div>
                            <div class="impact-metrics">
                                <div class="impact-value ${scenario.impact > 0 ? 'positive' : 'negative'}">
                                    ${scenario.impact > 0 ? '+' : ''}$${Math.abs(scenario.impact).toLocaleString()}
                                </div>
                                <div class="impact-description">${scenario.description}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    calculateROASTrend(campaigns) {
        const totalSpend = campaigns.reduce((sum, c) => sum + (c.spend || 0), 0);
        const totalRevenue = campaigns.reduce((sum, c) => sum + (c.revenue || 0), 0);
        const currentROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;
        
        // Simulate trend calculation
        const trend = campaigns.reduce((sum, c) => sum + (c.trendPercent || 0), 0) / campaigns.length;
        
        return {
            currentROAS,
            trend,
            dataPoints: campaigns.map(c => ({
                date: new Date(),
                roas: c.roas || 0,
                campaign: c.campaignName
            }))
        };
    }

    calculateTrueROASTrend() {
        const attributionData = this.chartData.attribution_data || [];
        const avgTrueROAS = attributionData.reduce((sum, a) => 
            sum + (a.attributionResults?.trueROAS || 0), 0) / Math.max(attributionData.length, 1);
        
        return {
            current: avgTrueROAS,
            historical: [3.2, 3.4, 3.6, 3.7, 3.8, 3.85] // Simulated historical data
        };
    }

    calculateScenarioImpacts(campaigns) {
        return [
            {
                id: 1,
                title: 'High ROAS, Low Profit',
                type: 'critical',
                impact: -15420,
                description: 'Turbo kits showing good ROAS but negative POAS'
            },
            {
                id: 2,
                title: 'Ad Fatigue',
                type: 'warning',
                impact: -8750,
                description: 'Facebook campaign CTR dropped 52%'
            },
            {
                id: 3,
                title: 'Message Mismatch',
                type: 'warning',
                impact: -5230,
                description: 'High bounce rate on landing pages'
            },
            {
                id: 4,
                title: 'Attribution Mystery',
                type: 'opportunity',
                impact: 12340,
                description: 'Retargeting showing inflated performance'
            },
            {
                id: 7,
                title: 'Video Opportunity',
                type: 'opportunity',
                impact: 22680,
                description: 'Strong performers ready for video ads'
            }
        ];
    }

    updateChartData() {
        console.log('📊 Updating Performance Parts chart data...');
        this.loadChartData();
        
        // Refresh active chart
        switch(this.activeChart) {
            case 'roas':
                this.createROASTrendChart();
                break;
            case 'attribution':
                this.createAttributionChart();
                break;
            case 'scenarios':
                this.createScenarioImpactChart();
                break;
        }
    }
}

// Global initialization function
function initializeCharts() {
    if (!window.performanceCharts) {
        window.performanceCharts = new PerformanceCharts();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initializeCharts();
    }, 2000); // Wait for data to load
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PerformanceCharts,
        initializeCharts
    };
}