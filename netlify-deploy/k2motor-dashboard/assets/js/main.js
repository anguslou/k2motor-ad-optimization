// K2Motor Performance Parts Dashboard - Main Application Logic

class K2MotorDashboard {
    constructor() {
        this.currentTab = 'overview';
        this.tabContent = new Map();
        this.isInitialized = false;
        
        // Initialize dashboard when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    // Initialize the dashboard
    async init() {
        console.log('🏎️ Initializing K2Motor Performance Parts Dashboard...');
        
        try {
            // Setup tab navigation
            this.setupTabNavigation();
            
            // Load tab content
            await this.loadAllTabs();
            
            // Show initial tab
            this.showTab('overview');
            
            // Initialize data source indicators
            if (window.dataSourceIndicators) {
                window.dataSourceIndicators.initializeDataSourceIndicators();
            }
            
            // Start welcome flow after short delay
            setTimeout(() => {
                if (window.guidedTour) {
                    window.guidedTour.initializeWelcomeFlow();
                }
            }, 1000);
            
            this.isInitialized = true;
            console.log('✅ K2Motor Performance Parts Dashboard ready!');
            
        } catch (error) {
            console.error('❌ Dashboard initialization failed:', error);
            this.showError('Failed to initialize dashboard. Please refresh the page.');
        }
    }

    // Setup tab navigation event listeners
    setupTabNavigation() {
        const tabElements = document.querySelectorAll('.nav-tab');
        
        tabElements.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = tab.getAttribute('data-tab');
                if (tabName) {
                    this.showTab(tabName);
                }
            });
        });
        
        console.log(`🎯 Set up navigation for ${tabElements.length} tabs`);
    }

    // Load all tab content from separate HTML files
    async loadAllTabs() {
        const tabs = ['overview', 'campaigns', 'budget', 'attribution'];
        const loadPromises = tabs.map(tab => this.loadTabContent(tab));
        
        try {
            await Promise.all(loadPromises);
            console.log('📄 All tab content loaded successfully');
        } catch (error) {
            console.error('❌ Failed to load tab content:', error);
            throw error;
        }
    }

    // Load individual tab content
    async loadTabContent(tabName) {
        try {
            // For now, we'll create placeholder content since we have separate HTML files
            // In a full implementation, this would fetch from tabs/{tabName}.html
            
            const tabContent = this.createTabContent(tabName);
            this.tabContent.set(tabName, tabContent);
            
            console.log(`✅ Loaded ${tabName} tab content`);
            return tabContent;
            
        } catch (error) {
            console.error(`❌ Failed to load ${tabName} tab:`, error);
            
            // Fallback content
            const fallbackContent = `
                <div class="tab-panel error-panel">
                    <h2>⚠️ Content Loading Error</h2>
                    <p>Unable to load ${tabName} tab content. Please refresh the page.</p>
                </div>
            `;
            
            this.tabContent.set(tabName, fallbackContent);
            return fallbackContent;
        }
    }

    // Create tab content (placeholder implementation)
    createTabContent(tabName) {
        const contentMap = {
            overview: this.createOverviewContent(),
            campaigns: this.createCampaignsContent(),
            budget: this.createBudgetContent(),
            attribution: this.createAttributionContent()
        };
        
        return contentMap[tabName] || this.createFallbackContent(tabName);
    }

    // Create overview tab content
    createOverviewContent() {
        return `
            <div class="tab-panel overview-tab fade-in" data-tab="overview">
                <div class="tab-header">
                    <h2>📊 Ad Performance Overview</h2>
                    <div class="header-controls">
                        <span class="last-updated">Last updated: ${new Date().toLocaleTimeString()}</span>
                    </div>
                </div>

                <div class="performance-grid">
                    <div class="metrics-card">
                        <div class="metric-label">Total Ad Spend <span class="source-indicator" data-source="API Direct">🟢 API Direct</span></div>
                        <div class="metric-value">$67,890</div>
                        <div class="metric-change positive">+12.5% vs last month</div>
                    </div>
                    
                    <div class="metrics-card">
                        <div class="metric-label">Total Revenue <span class="source-indicator" data-source="API Direct">🟢 API Direct</span></div>
                        <div class="metric-value">$284,567</div>
                        <div class="metric-change positive">+18.3% vs last month</div>
                    </div>
                    
                    <div class="metrics-card">
                        <div class="metric-label">Overall ROAS <span class="source-indicator" data-source="Calculated">🟡 Calculated</span></div>
                        <div class="metric-value">4.19x</div>
                        <div class="metric-change positive">+0.24x vs target</div>
                    </div>
                    
                    <div class="metrics-card">
                        <div class="metric-label">True ROAS <span class="source-indicator" data-source="Calculated">🟡 Calculated</span></div>
                        <div class="metric-value">4.77x</div>
                        <div class="metric-change positive">Attribution-adjusted</div>
                    </div>
                    
                    <div class="metrics-card">
                        <div class="metric-label">POAS <span class="source-indicator" data-source="Calculated">🟡 Calculated</span></div>
                        <div class="metric-value">2.1x</div>
                        <div class="metric-change positive">Profit-optimized</div>
                    </div>
                    
                    <div class="metrics-card">
                        <div class="metric-label">Active Scenarios <span class="source-indicator" data-source="Calculated">🟡 Calculated</span></div>
                        <div class="metric-value">7</div>
                        <div class="metric-change warning">Optimization opportunities</div>
                    </div>
                </div>

                <div class="section-header">
                    <h3>🚨 Optimization Scenarios</h3>
                    <span>AI-powered opportunities for K2Motor Performance Parts</span>
                </div>
                
                <div class="scenario-alerts">
                    <div class="alert-card alert-critical">
                        <div class="alert-header">
                            <span class="alert-icon">🔴</span>
                            <strong>Critical: Subaru Campaign Profitability</strong>
                            <span class="scenario-tag">Scenario 1</span>
                        </div>
                        <p>Subaru Turbo campaign shows 4.22x ROAS but 0.8x POAS - losing money despite good performance</p>
                        <button class="btn-primary" onclick="showScenarioDetails(1)">Review Costs</button>
                    </div>
                    
                    <div class="alert-card alert-warning">
                        <div class="alert-header">
                            <span class="alert-icon">🟡</span>
                            <strong>Warning: Ad Fatigue on Facebook</strong>
                            <span class="scenario-tag">Scenario 2</span>
                        </div>
                        <p>Sports car enthusiasts see same Performance Parts creative too often (frequency 8.7x)</p>
                        <button class="btn-secondary" onclick="showScenarioDetails(2)">Refresh Creative</button>
                    </div>
                    
                    <div class="alert-card alert-opportunity">
                        <div class="alert-header">
                            <span class="alert-icon">🟢</span>
                            <strong>Opportunity: Honda Video Expansion</strong>
                            <span class="scenario-tag">Scenario 7</span>
                        </div>
                        <p>Honda Type R campaigns performing 4.24x ROAS with upward trend</p>
                        <button class="btn-secondary" onclick="showScenarioDetails(7)">Scale Up</button>
                    </div>
                </div>

                <div class="section-header">
                    <h3>📈 Performance Charts</h3>
                    <span>Interactive visualizations for K2Motor Performance Parts data</span>
                </div>
                
                <div class="performance-charts">
                    <div class="chart-container">
                        <div class="chart-placeholder">
                            <h4>ROAS Trend Chart</h4>
                            <div class="mock-chart">
                                <div class="chart-line"></div>
                                <p>Target: 4.2x | Current: 4.77x | Trend: ↗️ +12%</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="chart-container">
                        <div class="chart-placeholder">
                            <h4>Attribution Analysis</h4>
                            <div class="mock-chart">
                                <div class="chart-bar"></div>
                                <p>Honda vs Toyota Cross-Brand Analysis</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Create campaigns tab content
    createCampaignsContent() {
        return `
            <div class="tab-panel campaigns-tab fade-in" data-tab="campaigns">
                <div class="tab-header">
                    <h2>🎯 Campaign Deep Dive</h2>
                    <div class="header-controls">
                        <button class="btn-secondary">📊 Export Report</button>
                    </div>
                </div>
                
                <div class="campaigns-overview">
                    <h3>📈 K2Motor Performance Parts Campaign Analysis</h3>
                    <p>Detailed performance breakdown by vehicle brand and platform</p>
                    
                    <div class="campaign-grid">
                        <div class="campaign-card">
                            <div class="campaign-header">
                                <h4>Subaru Turbo Upgrades</h4>
                                <span class="platform amazon">Amazon</span>
                            </div>
                            <div class="campaign-metrics">
                                <div class="metric">
                                    <span class="label">Spend:</span>
                                    <span class="value">$329.67</span>
                                </div>
                                <div class="metric">
                                    <span class="label">Revenue:</span>  
                                    <span class="value">$1,389.95</span>
                                </div>
                                <div class="metric">
                                    <span class="label">ROAS:</span>
                                    <span class="value status-excellent">4.22x</span>
                                </div>
                                <div class="metric">
                                    <span class="label">POAS:</span>
                                    <span class="value status-critical">0.8x</span>
                                </div>
                            </div>
                            <button class="btn-primary">📋 View Details</button>
                        </div>
                        
                        <div class="campaign-card">
                            <div class="campaign-header">
                                <h4>Honda Type R Parts</h4>
                                <span class="platform amazon">Amazon</span>
                            </div>
                            <div class="campaign-metrics">
                                <div class="metric">
                                    <span class="label">Spend:</span>
                                    <span class="value">$174.56</span>
                                </div>
                                <div class="metric">
                                    <span class="label">Revenue:</span>
                                    <span class="value">$739.98</span>
                                </div>
                                <div class="metric">
                                    <span class="label">ROAS:</span>
                                    <span class="value status-excellent">4.24x</span>
                                </div>
                                <div class="metric">
                                    <span class="label">POAS:</span>
                                    <span class="value status-excellent">2.1x</span>
                                </div>
                            </div>
                            <button class="btn-secondary">📋 View Details</button>
                        </div>
                        
                        <div class="campaign-card">
                            <div class="campaign-header">
                                <h4>BMW M Series Suspension</h4>
                                <span class="platform amazon">Amazon</span>
                            </div>
                            <div class="campaign-metrics">
                                <div class="metric">
                                    <span class="label">Spend:</span>
                                    <span class="value">$201.89</span>
                                </div>
                                <div class="metric">
                                    <span class="label">Revenue:</span>
                                    <span class="value">$719.99</span>
                                </div>
                                <div class="metric">
                                    <span class="label">ROAS:</span>
                                    <span class="value status-good">3.56x</span>
                                </div>
                                <div class="metric">
                                    <span class="label">POAS:</span>
                                    <span class="value status-warning">1.4x</span>
                                </div>
                            </div>
                            <button class="btn-secondary">📋 View Details</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Create budget tab content
    createBudgetContent() {
        return `
            <div class="tab-panel budget-tab fade-in" data-tab="budget">
                <div class="tab-header">
                    <h2>💰 Budget Optimization</h2>
                    <div class="header-controls">
                        <span class="budget-summary">Total Monthly Budget: <strong>$75,000</strong></span>
                        <button class="btn-primary">💾 Save Changes</button>
                    </div>
                </div>
                
                <div class="budget-overview">
                    <h3>💰 K2Motor Performance Parts Budget Allocation</h3>
                    <p>Optimize spend across platforms and vehicle segments</p>
                    
                    <div class="budget-grid">
                        <div class="budget-card">
                            <div class="platform-header">
                                <h4>Amazon</h4>
                                <span class="performance-indicator status-excellent">4.22x ROAS</span>
                            </div>
                            <div class="budget-allocation">
                                <div class="current-budget">$35,500 (47.3%)</div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 47.3%"></div>
                                </div>
                                <div class="budget-recommendation">AI Suggests: +$2,300</div>
                            </div>
                        </div>
                        
                        <div class="budget-card">
                            <div class="platform-header">
                                <h4>eBay</h4>
                                <span class="performance-indicator status-excellent">52.5x ROAS</span>
                            </div>
                            <div class="budget-allocation">
                                <div class="current-budget">$8,200 (10.9%)</div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 10.9%"></div>
                                </div>
                                <div class="budget-recommendation">AI Suggests: +$4,800</div>
                            </div>
                        </div>
                        
                        <div class="budget-card">
                            <div class="platform-header">
                                <h4>Google Ads</h4>
                                <span class="performance-indicator status-good">3.5x ROAS</span>
                            </div>
                            <div class="budget-allocation">
                                <div class="current-budget">$22,800 (30.4%)</div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 30.4%"></div>
                                </div>
                                <div class="budget-recommendation">AI Suggests: -$1,000</div>
                            </div>
                        </div>
                        
                        <div class="budget-card">
                            <div class="platform-header">
                                <h4>Facebook</h4>
                                <span class="performance-indicator status-critical">2.1x ROAS</span>
                            </div>
                            <div class="budget-allocation">
                                <div class="current-budget">$8,500 (11.3%)</div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 11.3%"></div>
                                </div>
                                <div class="budget-recommendation">AI Suggests: -$6,100</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="section-header">
                    <h3>📊 POAS vs ROAS Analysis</h3>
                    <span>Profit on Ad Spend - True profitability for K2Motor Performance Parts</span>
                </div>
                
                <div class="poas-analysis">
                    <div class="analysis-card">
                        <h4>💡 Key Insights</h4>
                        <ul>
                            <li>Subaru campaigns show high ROAS (4.22x) but negative POAS (0.8x) due to manufacturing costs</li>
                            <li>Honda Type R parts achieve excellent profitability with 2.1x POAS</li>
                            <li>Facebook campaigns are losing money with -0.2x POAS despite 2.1x ROAS</li>
                            <li>eBay delivers exceptional performance with 52.5x ROAS on niche parts</li>
                        </ul>
                        <button class="btn-primary">📈 Apply Optimizations</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Create attribution tab content  
    createAttributionContent() {
        return `
            <div class="tab-panel attribution-tab fade-in" data-tab="attribution">
                <div class="tab-header">
                    <h2>🧮 Advanced Attribution</h2>
                    <div class="header-controls">
                        <button class="btn-primary">🔄 Run Analysis</button>
                    </div>
                </div>
                
                <div class="attribution-overview">
                    <h3>🔬 Honda vs Toyota Cross-Brand Control Group Analysis</h3>
                    <p>Advanced attribution methodology for K2Motor Performance Parts incrementality</p>
                    
                    <div class="attribution-grid">
                        <div class="attribution-card test-group">
                            <div class="card-header">
                                <h4>Test Group: Honda Civic Brake Pads</h4>
                                <span class="group-type">With Ad Spend</span>
                            </div>
                            <div class="attribution-metrics">
                                <div class="metric">
                                    <span class="label">Ad Spend:</span>
                                    <span class="value">$2,450.00</span>
                                </div>
                                <div class="metric">
                                    <span class="label">Total Revenue:</span>
                                    <span class="value">$16,130.00</span>
                                </div>
                                <div class="metric">
                                    <span class="label">Apparent ROAS:</span>
                                    <span class="value">6.58x</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="attribution-card control-group">
                            <div class="card-header">
                                <h4>Control Group: Toyota Camry Brake Pads</h4>
                                <span class="group-type">Without Ad Spend</span>
                            </div>
                            <div class="attribution-metrics">
                                <div class="metric">
                                    <span class="label">Ad Spend:</span>
                                    <span class="value">$0.00</span>
                                </div>
                                <div class="metric">
                                    <span class="label">Total Revenue:</span>
                                    <span class="value">$8,450.00</span>
                                </div>
                                <div class="metric">
                                    <span class="label">Market Baseline:</span>
                                    <span class="value">Organic demand</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="section-header">
                    <h3>📊 Attribution Results</h3>
                    <span>Statistical validation with 95% confidence intervals</span>
                </div>
                
                <div class="attribution-results">
                    <div class="results-grid">
                        <div class="result-card">
                            <div class="result-header">
                                <h4>Incremental Lift</h4>
                                <span class="confidence">95% CI</span>
                            </div>
                            <div class="result-value status-excellent">+52.4%</div>
                            <div class="result-description">True ad-driven incremental revenue</div>
                        </div>
                        
                        <div class="result-card">
                            <div class="result-header">
                                <h4>True ROAS</h4>
                                <span class="confidence">Adjusted</span>
                            </div>
                            <div class="result-value status-excellent">4.77x</div>
                            <div class="result-description">After removing market baseline</div>
                        </div>
                        
                        <div class="result-card">
                            <div class="result-header">
                                <h4>Apparent ROAS</h4>
                                <span class="confidence">Misleading</span>
                            </div>
                            <div class="result-value status-warning">5.26x</div>
                            <div class="result-description">Includes organic demand</div>
                        </div>
                    </div>
                </div>
                
                <div class="section-header">
                    <h3>🎯 Actionable Insights</h3>
                    <span>Data-driven recommendations for K2Motor Performance Parts</span>
                </div>
                
                <div class="attribution-insights">
                    <div class="insight-card">
                        <h4>💡 Key Finding</h4>
                        <p>Honda brake pad ads generate true incremental lift of 52.4%, proving advertising effectiveness beyond organic demand. Toyota control group shows strong baseline performance, validating the cross-brand methodology.</p>
                        <button class="btn-secondary">📈 Scale Honda Campaigns</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Create fallback content for unknown tabs
    createFallbackContent(tabName) {
        return `
            <div class="tab-panel fallback-tab fade-in" data-tab="${tabName}">
                <div class="tab-header">
                    <h2>🚧 ${tabName.charAt(0).toUpperCase() + tabName.slice(1)} Tab</h2>
                </div>
                <div class="fallback-content">
                    <h3>Coming Soon</h3>
                    <p>The ${tabName} tab is currently under development for K2Motor Performance Parts dashboard.</p>
                </div>
            </div>
        `;
    }

    // Show specific tab
    showTab(tabName) {
        // Update navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
        
        // Update content
        const tabContentContainer = document.getElementById('tab-content');
        if (tabContentContainer && this.tabContent.has(tabName)) {
            tabContentContainer.innerHTML = this.tabContent.get(tabName);
            
            // Initialize tab-specific functionality
            this.initializeTabFeatures(tabName);
        }
        
        this.currentTab = tabName;
        console.log(`🎯 Switched to ${tabName} tab`);
    }

    // Initialize tab-specific features
    initializeTabFeatures(tabName) {
        // Add any tab-specific initialization here
        if (tabName === 'overview') {
            this.initializeOverviewFeatures();
        } else if (tabName === 'campaigns') {
            this.initializeCampaignFeatures();
        } else if (tabName === 'budget') {
            this.initializeBudgetFeatures();
        } else if (tabName === 'attribution') {
            this.initializeAttributionFeatures();
        }
    }

    // Initialize overview tab features
    initializeOverviewFeatures() {
        // Initialize scenario alerts
        if (window.ScenarioAlerts) {
            // Scenario alerts functionality would go here
        }
        
        // Update metrics with real-time data
        this.updateMetricsDisplay();
    }

    // Initialize campaign tab features
    initializeCampaignFeatures() {
        // Campaign-specific functionality
        console.log('🎯 Campaign tab features initialized');
    }

    // Initialize budget tab features
    initializeBudgetFeatures() {
        // Budget-specific functionality
        console.log('💰 Budget tab features initialized');
    }

    // Initialize attribution tab features
    initializeAttributionFeatures() {
        // Attribution-specific functionality  
        console.log('🧮 Attribution tab features initialized');
    }

    // Update metrics display with latest data
    updateMetricsDisplay() {
        // This would integrate with the metrics.js calculations
        console.log('📊 Updating K2Motor Performance Parts metrics display');
    }

    // Show error message
    showError(message) {
        const tabContentContainer = document.getElementById('tab-content');
        if (tabContentContainer) {
            tabContentContainer.innerHTML = `
                <div class="error-container">
                    <h2>⚠️ Error</h2>
                    <p>${message}</p>
                    <button onclick="location.reload()" class="btn-primary">🔄 Refresh Page</button>
                </div>
            `;
        }
    }
}

// Global functions for scenario interactions  
function showScenarioDetails(scenarioId) {
    console.log(`📊 Showing details for scenario ${scenarioId}`);
    alert(`Scenario ${scenarioId} Details:\n\nThis would show detailed analysis and recommendations for K2Motor Performance Parts optimization scenario ${scenarioId}.`);
}

// Dashboard content manager is initialized by dashboard-content.js
// This prevents duplicate initialization and conflicts
console.log('📋 Main.js: Skipping dashboard initialization - handled by dashboard-content.js');

// Use the global dashboard instance created by dashboard-content.js
if (window.dashboardContent) {
    window.dashboardContentManager = window.dashboardContent;
    console.log('✅ Main.js: Using dashboard-content.js global instance');
} else {
    console.log('⏳ Main.js: Waiting for dashboard-content.js to initialize...');
    // Wait for dashboard-content.js to initialize
    document.addEventListener('dashboardContentReady', () => {
        window.dashboardContentManager = window.dashboardContent;
        console.log('✅ Main.js: Connected to dashboard-content.js instance');
    });
}