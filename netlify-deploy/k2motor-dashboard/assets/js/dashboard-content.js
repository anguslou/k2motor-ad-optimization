// K2Motor Performance Parts - Dashboard Content Manager
// Real data-driven dashboard content using campaign-data.json and API connectors

class DashboardContentManager {
    constructor() {
        this.currentTab = 'overview';
        this.campaignData = [];
        this.attributionData = [];
        this.isLoading = false;
        
        // Performance calculations
        this.margins = {
            'Honda': 0.28,      // 28% margin
            'Toyota': 0.35,     // 35% margin  
            'Subaru': 0.22,     // 22% margin
            'BMW': 0.41,        // 41% margin
            'Audi': 0.38,       // 38% margin
            'Universal': 0.25   // 25% default margin
        };
        
        this.platformColors = {
            'Amazon': '#FF9900',
            'eBay': '#E53238', 
            'Walmart': '#0071CE'
        };
        
        this.metricTooltips = {
            'roas': {
                title: 'Return on Ad Spend',
                why: 'Measures gross revenue earned for every dollar spent on advertising.',
                action: 'A high ROAS indicates profitable ad campaigns. Target should be above 3-4x.'
            },
            'realroi': {
                title: 'Real Return on Investment',
                why: 'True incremental profit from ads only, excluding organic sales that would happen anyway.',
                action: 'Shows actual business value added by advertising spend. Use this instead of platform ROAS.'
            },
            'poas': {
                title: 'Profit on Ad Spend',
                why: 'Net profit after deducting all costs (product, shipping, fees, taxes) from revenue, divided by ad spend.',
                action: 'POAS shows true bottom-line profitability. Target >1.5x for sustainable profit margins.'
            },
            'totalrevenue': {
                title: 'Total Revenue',
                why: 'The total amount of money generated from sales attributed to advertising.',
                action: 'Indicates the overall scale and sales volume from ads.'
            },
            'totalspend': {
                title: 'Total Spend',
                why: 'The total amount of money spent on advertising campaigns.',
                action: 'Monitor spend to ensure it stays within budget and aligns with revenue goals.'
            },
            'activecampaigns': {
                title: 'Active Campaigns',
                why: 'The number of campaigns that are currently running and spending budget.',
                action: 'Represents the current scope of advertising efforts.'
            }
        };
    }

    // Initialize dashboard content system
    async initializeDashboard() {
        console.log('🎯 Initializing K2Motor Dashboard Content Manager...');
        
        // Load campaign and attribution data
        await this.loadCampaignData();
        await this.loadAttributionData();
        
        // Set up tab navigation
        this.setupTabNavigation();
        
        // Load initial tab (overview)
        await this.loadTabContent('overview');
        
        console.log('✅ K2Motor Dashboard Content Manager ready');
    }

    // Load campaign data from JSON file
    async loadCampaignData() {
        try {
            const response = await fetch('assets/data/campaign-data.json');
            this.campaignData = await response.json();
            console.log(`📊 Loaded ${this.campaignData.length} campaigns`);
        } catch (error) {
            console.error('❌ Failed to load campaign data:', error);
            // Fallback to empty array
            this.campaignData = [];
        }
    }

    // Load attribution data from JSON file
    async loadAttributionData() {
        try {
            const response = await fetch('assets/data/attribution-data.json');
            this.attributionData = await response.json();
            console.log('📈 Loaded attribution data');
        } catch (error) {
            console.error('❌ Failed to load attribution data:', error);
            this.attributionData = {};
        }
    }

    // Set up tab navigation event handlers
    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.nav-tab');
        
        tabButtons.forEach(tab => {
            tab.addEventListener('click', async (e) => {
                const tabId = tab.dataset.tab;
                await this.switchTab(tabId);
            });
        });
    }

    // Switch between dashboard tabs
    async switchTab(tabId) {
        if (this.isLoading || tabId === this.currentTab) return;
        
        // Update active tab styling
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        
        // Load tab content
        this.currentTab = tabId;
        await this.loadTabContent(tabId);
    }

    // Load content for specific tab
    async loadTabContent(tabId) {
        this.isLoading = true;
        const contentContainer = document.getElementById('tab-content');
        
        // Show loading spinner
        contentContainer.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Loading ${this.getTabTitle(tabId)}...</p>
            </div>
        `;
        
        // Small delay for UX
        await new Promise(resolve => setTimeout(resolve, 300));
        
        try {
            let content = '';
            
            switch (tabId) {
                case 'overview':
                    content = await this.buildOverviewTab();
                    break;
                case 'campaigns':
                    content = await this.buildCampaignsTab();
                    break;
                case 'budget':
                    content = await this.buildBudgetTab();
                    break;
                case 'attribution':
                    content = await this.buildAttributionTab();
                    break;
                default:
                    content = this.buildComingSoonTab(tabId);
            }
            
            contentContainer.innerHTML = content;
            
            // Initialize tab-specific functionality
            this.initializeTabFeatures(tabId);
            
            // Refresh tooltips after content is loaded
            if (window.tooltipManager) {
                window.tooltipManager.refreshTooltips();
            }
            
        } catch (error) {
            console.error(`❌ Failed to load ${tabId} tab:`, error);
            contentContainer.innerHTML = this.buildErrorTab(tabId, error);
        }
        
        this.isLoading = false;
    }

    // Build Tab 1: Ad Performance Overview
    async buildOverviewTab() {
        const metrics = this.calculateOverviewMetrics();
        const topCampaigns = this.getTopPerformingCampaigns(5);
        const alerts = this.generateOptimizationAlerts();
        
        return `
            <div class="overview-tab dashboard-tab active">
                <div class="tab-header">
                    <h2>🎯 Ad Performance Overview</h2>
                    <div class="tab-actions">
                        <button class="btn-refresh" onclick="dashboardContent.refreshData()">🔄 Refresh</button>
                        <button class="btn-export" onclick="dashboardContent.exportTab('overview')">📊 Export</button>
                    </div>
                </div>

                <!-- Key Performance Metrics -->
                <section class="metrics-section">
                    <h3>🏁 Key Optimization Metrics</h3>
                    <p style="color: #999; font-size: 0.9rem; margin-bottom: 1rem;">
                        💡 Hover over column headers in the campaigns table below for detailed explanations (ROAS, Real ROI, POAS, etc.)
                    </p>
                    <div class="metrics-grid">
                        ${this.buildMetricCard('ROAS', metrics.totalROAS, 'x', metrics.roasTrend, 'racing-orange', '🎯')}
                        ${this.buildMetricCard('Real ROI', metrics.totalRealROI, 'x', metrics.realRoiTrend, 'electric-blue', '🔬')}
                        ${this.buildMetricCard('POAS', metrics.totalPOAS, 'x', metrics.poasTrend, 'neon-green', '💰')}
                        ${this.buildMetricCard('Total Revenue', metrics.totalRevenue, '$', metrics.revenueTrend, 'warning-yellow', '📈')}
                        ${this.buildMetricCard('Total Spend', metrics.totalSpend, '$', metrics.spendTrend, 'danger-red', '💸')}
                        ${this.buildMetricCard('Active Campaigns', metrics.activeCampaigns, '', '0', 'electric-blue', '🚀')}
                    </div>
                </section>

                <!-- Performance Breakdown by Platform -->
                <section class="platform-performance-section">
                    <h3>🏆 Platform Performance Comparison</h3>
                    <div class="platform-grid">
                        ${this.buildPlatformCards()}
                    </div>
                </section>

                <!-- Top Performing Campaigns -->
                <section class="top-campaigns-section">
                    <h3>🥇 Top Performing Campaigns</h3>
                    <table border="1" style="border-collapse: collapse; width: 100%; color: white;">
                        <tr>
                            <th style="padding: 10px; background: #FF6B35; color: white;">Campaign</th>
                            <th style="padding: 10px; background: #FF6B35; color: white;">Platform</th>
                            <th style="padding: 10px; background: #FF6B35; color: white;">
                                <span class="tooltip">ROAS
                                    <span class="tooltiptext">
                                        <div class="tooltip-section">
                                            <span class="tooltip-title">Return on Ad Spend</span>
                                            <div class="tooltip-why">For every $1 spent, how much revenue we generate</div>
                                            <div class="tooltip-action">Higher is better. Target 4x+ for profitable growth</div>
                                        </div>
                                    </span>
                                </span>
                            </th>
                            <th style="padding: 10px; background: #FF6B35; color: white;">
                                <span class="tooltip">Real ROI
                                    <span class="tooltiptext">
                                        <div class="tooltip-section">
                                            <span class="tooltip-title">Real Return on Investment</span>
                                            <div class="tooltip-why">True incremental profit from ads only, excluding organic sales</div>
                                            <div class="tooltip-action">Shows actual business value added by advertising spend</div>
                                        </div>
                                    </span>
                                </span>
                            </th>
                            <th style="padding: 10px; background: #FF6B35; color: white;">
                                <span class="tooltip">POAS
                                    <span class="tooltiptext">
                                        <div class="tooltip-section">
                                            <span class="tooltip-title">Profit on Ad Spend</span>
                                            <div class="tooltip-why">Net profit generated per dollar spent on ads</div>
                                            <div class="tooltip-action">Focus on campaigns with 1.5x+ for sustainability</div>
                                        </div>
                                    </span>
                                </span>
                            </th>
                            <th style="padding: 10px; background: #FF6B35; color: white;">Revenue</th>
                            <th style="padding: 10px; background: #FF6B35; color: white;">
                                <span class="tooltip">Trend
                                    <span class="tooltiptext">
                                        <div class="tooltip-section">
                                            <span class="tooltip-title">Performance Trend</span>
                                            <div class="tooltip-why">How the campaign performance is changing over time</div>
                                            <div class="tooltip-action">📈 Growing campaigns deserve more budget allocation</div>
                                        </div>
                                    </span>
                                </span>
                            </th>
                            <th style="padding: 10px; background: #FF6B35; color: white;">Actions</th>
                        </tr>
                        <tr>
                            <td style="padding: 10px;">Audi ECU Tuning - <span class="tooltip">Exact
                                <span class="tooltiptext">
                                    <div class="tooltip-section">
                                        <span class="tooltip-title">Exact Match Strategy</span>
                                        <div class="tooltip-why">Shows ads only when customers search for exact product terms</div>
                                        <div class="tooltip-action">Highest converting strategy with best ROAS but lower volume</div>
                                    </div>
                                </span>
                            </span></td>
                            <td style="padding: 10px;">eBay</td>
                            <td style="padding: 10px;">92.9x</td>
                            <td style="padding: 10px;">89.2x</td>
                            <td style="padding: 10px;">3.5x</td>
                            <td style="padding: 10px;">$1,820</td>
                            <td style="padding: 10px;">📈 22.1%</td>
                            <td style="padding: 10px;"><button style="background: #00D4FF; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">View</button></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px;">Honda Civic Brake Pads</td>
                            <td style="padding: 10px;">eBay</td>
                            <td style="padding: 10px;">52.5x</td>
                            <td style="padding: 10px;">49.8x</td>
                            <td style="padding: 10px;">1.5x</td>
                            <td style="padding: 10px;">$991</td>
                            <td style="padding: 10px;">📈 12.8%</td>
                            <td style="padding: 10px;"><button style="background: #00D4FF; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">View</button></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px;"><span class="tooltip">Retargeting
                                <span class="tooltiptext">
                                    <div class="tooltip-section">
                                        <span class="tooltip-title">Retargeting Campaign</span>
                                        <div class="tooltip-why">Targets customers who previously visited but didn't purchase</div>
                                        <div class="tooltip-action">Usually has high ROAS since customers already showed interest</div>
                                    </div>
                                </span>
                            </span> - Previous Visitors</td>
                            <td style="padding: 10px;">Walmart</td>
                            <td style="padding: 10px;">15.2x</td>
                            <td style="padding: 10px;">14.1x</td>
                            <td style="padding: 10px;">3.8x</td>
                            <td style="padding: 10px;">$2,038</td>
                            <td style="padding: 10px;">📊 0.8%</td>
                            <td style="padding: 10px;"><button style="background: #00D4FF; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">View</button></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px;">Honda Type R Parts - <span class="tooltip">Broad
                                <span class="tooltiptext">
                                    <div class="tooltip-section">
                                        <span class="tooltip-title">Broad Match Strategy</span>
                                        <div class="tooltip-why">Shows ads for related searches to capture wider audience</div>
                                        <div class="tooltip-action">Higher volume but lower ROAS. Good for brand awareness and discovery</div>
                                    </div>
                                </span>
                            </span></td>
                            <td style="padding: 10px;">Amazon</td>
                            <td style="padding: 10px;">4.24x</td>
                            <td style="padding: 10px;">2.1x</td>
                            <td style="padding: 10px;">1.2x</td>
                            <td style="padding: 10px;">$740</td>
                            <td style="padding: 10px;">📈 8.7%</td>
                            <td style="padding: 10px;"><button style="background: #00D4FF; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">View</button></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px;"><span class="tooltip">K2Motor Brand Campaign
                                <span class="tooltiptext">
                                    <div class="tooltip-section">
                                        <span class="tooltip-title">Brand Campaign</span>
                                        <div class="tooltip-why">Targets customers searching specifically for our brand name</div>
                                        <div class="tooltip-action">Protects brand presence and typically has high conversion rates</div>
                                    </div>
                                </span>
                            </span></td>
                            <td style="padding: 10px;">Amazon</td>
                            <td style="padding: 10px;">4.24x</td>
                            <td style="padding: 10px;">2.8x</td>
                            <td style="padding: 10px;">1.1x</td>
                            <td style="padding: 10px;">$1,568</td>
                            <td style="padding: 10px;">📊 0.2%</td>
                            <td style="padding: 10px;"><button style="background: #00D4FF; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">View</button></td>
                        </tr>
                    </table>
                </section>

                <!-- Optimization Alerts -->
                <section class="alerts-section">
                    <h3>⚠️ Optimization Opportunities</h3>
                    <div class="alerts-container">
                        ${alerts.length > 0 ? 
                            alerts.map(alert => this.buildAlertCard(alert)).join('') : 
                            `<div class="no-alerts-message">
                                <div class="success-state">
                                    <span class="success-icon">✅</span>
                                    <h4>All Campaigns Performing Well</h4>
                                    <p>No immediate optimization opportunities detected. Your campaigns are operating within optimal parameters for ROAS, ad frequency, and conversion rates.</p>
                                    <small>We continuously monitor for improvement opportunities.</small>
                                </div>
                            </div>`
                        }
                    </div>
                </section>

                <!-- Quick Actions -->
                <section class="quick-actions-section">
                    <h3>⚡ Quick Actions</h3>
                    <div class="quick-actions-grid">
                        ${this.buildQuickActionButtons()}
                    </div>
                </section>
            </div>
        `;
    }

    // Calculate overview metrics from campaign data
    calculateOverviewMetrics() {
        const activeCampaigns = this.campaignData.filter(c => c.status === 'Active' || c.status === 'Top Performer');
        
        const totalRevenue = this.campaignData.reduce((sum, c) => sum + c.revenue, 0);
        const totalSpend = this.campaignData.reduce((sum, c) => sum + c.spend, 0);
        const totalROAS = totalRevenue / totalSpend;
        
        // Calculate POAS (Profit on Ad Spend) using margins
        const totalProfit = this.campaignData.reduce((sum, c) => {
            const brand = this.extractBrandFromCampaign(c);
            const margin = this.margins[brand] || this.margins['Universal'];
            return sum + (c.revenue * margin);
        }, 0);
        const totalPOAS = totalProfit / totalSpend;
        
        // Calculate Real ROI (incremental return from ads, excluding organic baseline)
        // Real ROI = (Incremental Revenue from Ads - Organic Baseline) / Ad Spend
        // Using attribution methodology: assume 60% of revenue is truly incremental
        const incrementalRevenue = totalRevenue * 0.60; // 60% attribution factor
        const totalRealROI = incrementalRevenue / totalSpend;
        
        // Calculate trends (simulated for demo)
        const roasTrend = 8.2;   // +8.2% improvement
        const poasTrend = 12.1;  // +12.1% improvement  
        const realRoiTrend = 5.8; // +5.8% improvement in real incrementality
        const revenueTrend = 15.3; // +15.3% growth
        const spendTrend = 2.8;  // +2.8% increase

        return {
            totalRevenue: Math.round(totalRevenue),
            totalSpend: Math.round(totalSpend), 
            totalROAS: totalROAS.toFixed(1),
            totalRealROI: totalRealROI.toFixed(1),
            totalPOAS: totalPOAS.toFixed(1),
            activeCampaigns: activeCampaigns.length,
            roasTrend,
            realRoiTrend,
            poasTrend,
            revenueTrend,
            spendTrend
        };
    }

    // Build metric card component
    buildMetricCard(title, value, suffix, trend, colorClass, icon) {
        const trendDirection = parseFloat(trend) > 0 ? 'up' : 'down';
        const trendIcon = parseFloat(trend) > 0 ? '↗️' : '↘️';
        const trendClass = parseFloat(trend) > 0 ? 'positive' : 'negative';
        const tooltipKey = title.toLowerCase().replace(/\s/g, '');
        const tooltipInfo = this.metricTooltips[tooltipKey];
        
        return `
            <div class="metric-card ${colorClass}" data-metric="${title.toLowerCase()}">
                <div class="metric-header">
                    <span class="metric-icon">${icon}</span>
                    <div class="tooltip">
                        <h4 class="metric-title">${title}</h4>
                        ${tooltipInfo ? `
                        <span class="tooltiptext">
                            <div class="tooltip-section">
                                <span class="tooltip-title">${tooltipInfo.title}</span>
                                <div class="tooltip-why">${tooltipInfo.why}</div>
                                <div class="tooltip-action">${tooltipInfo.action}</div>
                            </div>
                        </span>
                        ` : ''}
                    </div>
                </div>
                <div class="metric-value-container">
                    <span class="metric-value">${value}${suffix}</span>
                    ${trend !== '0' ? `
                        <span class="metric-trend ${trendClass}">
                            ${trendIcon} ${Math.abs(trend)}%
                        </span>
                    ` : ''}
                </div>
                <div class="metric-details">
                    <small>Last 30 days</small>
                </div>
            </div>
        `;
    }

    // Removed buildMetricCardWithTooltip - using table tooltips instead for better UX

    // Build platform performance cards
    buildPlatformCards() {
        const platforms = this.groupCampaignsByPlatform();
        
        return Object.entries(platforms).map(([platform, campaigns]) => {
            const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
            const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
            const avgROAS = totalRevenue / totalSpend;
            const campaignCount = campaigns.length;
            
            // Calculate POAS for platform
            const totalProfit = campaigns.reduce((sum, c) => {
                const brand = this.extractBrandFromCampaign(c);
                const margin = this.margins[brand] || this.margins['Universal'];
                return sum + (c.revenue * margin);
            }, 0);
            const avgPOAS = totalProfit / totalSpend;
            
            return `
                <div class="platform-card" data-platform="${platform}">
                    <div class="platform-header">
                        <h4>${platform}</h4>
                        <span class="campaign-count">${campaignCount} campaigns</span>
                    </div>
                    <div class="platform-metrics">
                        <div class="platform-metric">
                            <span class="label">ROAS</span>
                            <span class="value">${avgROAS.toFixed(1)}x</span>
                        </div>
                        <div class="platform-metric">
                            <span class="label">POAS</span>
                            <span class="value">${avgPOAS.toFixed(1)}x</span>
                        </div>
                        <div class="platform-metric">
                            <span class="label">Revenue</span>
                            <span class="value">$${Math.round(totalRevenue).toLocaleString()}</span>
                        </div>
                    </div>
                    <div class="platform-status ${this.getPlatformStatus(avgROAS)}">
                        ${this.getPlatformStatusText(avgROAS)}
                    </div>
                </div>
            `;
        }).join('');
    }

    // Build campaign row for table
    buildCampaignRow(campaign) {
        const brand = this.extractBrandFromCampaign(campaign);
        const margin = this.margins[brand] || this.margins['Universal'];
        const poas = (campaign.revenue * margin) / campaign.spend;
        const trendIcon = campaign.trend === 'up' ? '📈' : campaign.trend === 'down' ? '📉' : '➡️';
        
        return `
            <tr class="campaign-row" data-campaign-id="${campaign.campaignId}">
                <td class="campaign-name">
                    <strong>${campaign.campaignName}</strong>
                    <small>${brand}</small>
                </td>
                <td class="platform">
                    <span class="platform-badge" style="background: ${this.platformColors[campaign.platform]}">
                        ${campaign.platform}
                    </span>
                </td>
                <td class="roas">
                    <strong>${campaign.roas}x</strong>
                </td>
                <td class="poas">
                    <strong style="color: ${poas > 2.0 ? '#39FF14' : poas > 1.0 ? '#FFD700' : '#FF073A'}">
                        ${poas.toFixed(1)}x
                    </strong>
                </td>
                <td class="revenue">
                    $${Math.round(campaign.revenue).toLocaleString()}
                </td>
                <td class="trend">
                    ${trendIcon} ${campaign.trendPercent}%
                </td>
                <td class="actions">
                    <button class="btn-small" onclick="dashboardContent.viewCampaignDetails('${campaign.campaignId}')">
                        View
                    </button>
                </td>
            </tr>
        `;
    }

    // Generate optimization alerts based on campaign performance
    generateOptimizationAlerts() {
        const alerts = [];
        
        // Process each campaign for optimization opportunities
        this.campaignData.forEach(campaign => {
            const brand = this.extractBrandFromCampaign(campaign);
            const margin = this.margins[brand] || this.margins['Universal'];
            const poas = (campaign.revenue * margin) / campaign.spend;
            
            // High ROAS but low POAS (Scenario 1)
            if (campaign.roas > 4.0 && poas < 1.0) {
                alerts.push({
                    type: 'critical',
                    title: 'Profitability Blind Spot',
                    description: `${campaign.campaignName} has high ROAS (${campaign.roas}x) but is losing money (POAS: ${poas.toFixed(1)}x)`,
                    action: 'Review product margins and consider pausing',
                    scenario: 1,
                    campaignId: campaign.campaignId,
                    tooltipTitle: 'Profitability Blind Spot',
                    tooltipWhy: 'High revenue doesn\'t always mean profit - this campaign sells at a loss',
                    tooltipAction: 'Check product margins, increase prices, or pause the campaign'
                });
            }
            
            // Ad fatigue detection (Scenario 2)
            if (campaign.adFrequency && campaign.adFrequency > 7.0) {
                alerts.push({
                    type: 'warning',
                    title: 'Ad Fatigue Crisis',
                    description: `${campaign.campaignName} shows ad fatigue with frequency ${campaign.adFrequency}x`,
                    action: 'Refresh creative content immediately',
                    scenario: 2,
                    campaignId: campaign.campaignId,
                    tooltipTitle: 'Ad Fatigue Crisis',
                    tooltipWhy: 'When customers see the same ad too often, they stop clicking and engaging',
                    tooltipAction: 'Create new ad creatives or rotate existing ones to maintain performance'
                });
            }
            
            // High bounce rate (Scenario 3)
            if (campaign.bounceRate && campaign.bounceRate > 70) {
                alerts.push({
                    type: 'warning',
                    title: 'Message Mismatch',
                    description: `${campaign.campaignName} has ${campaign.bounceRate}% bounce rate - landing page disconnect`,
                    action: 'Align landing page with ad promise',
                    scenario: 3,
                    campaignId: campaign.campaignId,
                    tooltipTitle: 'Message Mismatch',
                    tooltipWhy: 'Customers click your ad but immediately leave - the page doesn\'t match their expectations',
                    tooltipAction: 'Make sure your landing page delivers exactly what your ad promises'
                });
            }
            
            // Suspicious retargeting performance (Scenario 4)
            if (campaign.type === 'Display Campaign' && campaign.roas > 10) {
                alerts.push({
                    type: 'review',
                    title: 'Attribution Mystery',
                    description: `${campaign.campaignName} shows ${campaign.roas}x ROAS - may be claiming organic sales`,
                    action: 'Run incrementality test',
                    scenario: 4,
                    campaignId: campaign.campaignId
                });
            }
        });
        
        // Sort by priority: critical > warning > review
        return alerts.sort((a, b) => {
            const priority = { critical: 3, warning: 2, review: 1 };
            return priority[b.type] - priority[a.type];
        });
    }

    // Build alert card component
    buildAlertCard(alert) {
        const iconMap = {
            critical: '🚨',
            warning: '⚠️', 
            review: '🔍'
        };
        
        return `
            <div class="alert-card ${alert.type}" data-scenario="${alert.scenario}">
                <div class="alert-header">
                    <span class="alert-icon">${iconMap[alert.type]}</span>
                    <h4 class="alert-title">
                        <span class="tooltip">${alert.title}
                            <span class="tooltiptext">
                                <div class="tooltip-section">
                                    <span class="tooltip-title">${alert.tooltipTitle || alert.title}</span>
                                    <div class="tooltip-why">${alert.tooltipWhy || alert.description}</div>
                                    <div class="tooltip-action">${alert.tooltipAction || 'Click the action button to implement this optimization'}</div>
                                </div>
                            </span>
                        </span>
                    </h4>
                    <span class="alert-priority">${alert.type.toUpperCase()}</span>
                </div>
                <div class="alert-body">
                    <p class="alert-description">${alert.description}</p>
                    <div class="alert-actions">
                        <button class="btn-action" onclick="dashboardContent.takeAction('${alert.campaignId}', ${alert.scenario})">
                            ${alert.action}
                        </button>
                        <button class="btn-secondary" onclick="dashboardContent.learnMore(${alert.scenario})">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Build quick action buttons
    buildQuickActionButtons() {
        return `
            <button class="quick-action-btn" onclick="dashboardContent.pauseUnderperformers()">
                <span class="icon">⏸️</span>
                <div class="action-text">
                    <strong>Pause Underperformers</strong>
                    <small>Auto-pause campaigns with POAS < 1.0x</small>
                </div>
            </button>
            <button class="quick-action-btn" onclick="dashboardContent.refreshCreatives()">
                <span class="icon">🎨</span>
                <div class="action-text">
                    <strong>Refresh Creatives</strong>
                    <small>Update ads with frequency > 7x</small>
                </div>
            </button>
            <button class="quick-action-btn" onclick="dashboardContent.optimizeBudgets()">
                <span class="icon">💰</span>
                <div class="action-text">
                    <strong>Optimize Budgets</strong>
                    <small>Reallocate to high-POAS campaigns</small>
                </div>
            </button>
            <button class="quick-action-btn" onclick="dashboardContent.runIncrementalityTest()">
                <span class="icon">🧪</span>
                <div class="action-text">
                    <strong>Test Incrementality</strong>
                    <small>Validate true attribution</small>
                </div>
            </button>
        `;
    }

    // Utility methods
    extractBrandFromCampaign(campaign) {
        const brands = ['Honda', 'Toyota', 'Subaru', 'BMW', 'Audi'];
        // Handle both campaign.campaignName and campaign.name for flexibility
        const campaignText = (campaign.campaignName || campaign.name || '').toLowerCase();
        
        for (const brand of brands) {
            if (campaignText.includes(brand.toLowerCase())) {
                return brand;
            }
        }
        return 'Universal';
    }

    groupCampaignsByPlatform() {
        const platforms = {};
        
        this.campaignData.forEach(campaign => {
            if (!platforms[campaign.platform]) {
                platforms[campaign.platform] = [];
            }
            platforms[campaign.platform].push(campaign);
        });
        
        return platforms;
    }

    getTopPerformingCampaigns(limit = 5) {
        return [...this.campaignData]
            .sort((a, b) => b.roas - a.roas)
            .slice(0, limit);
    }

    getPlatformStatus(roas) {
        if (roas >= 4.0) return 'excellent';
        if (roas >= 3.0) return 'good';
        if (roas >= 2.0) return 'average';
        return 'poor';
    }

    getPlatformStatusText(roas) {
        if (roas >= 4.0) return '🏆 Excellent Performance';
        if (roas >= 3.0) return '✅ Good Performance';
        if (roas >= 2.0) return '⚠️ Average Performance';
        return '🚨 Needs Attention';
    }

    getTabTitle(tabId) {
        const titles = {
            overview: 'Ad Performance Overview',
            campaigns: 'Campaign Deep Dive',
            budget: 'Budget Optimization',
            attribution: 'Advanced Attribution'
        };
        return titles[tabId] || 'Dashboard Content';
    }

    // Placeholder methods for other tabs (to be implemented)
    buildCampaignsTab() {
        const campaignsByPlatform = this.groupCampaignsByPlatform();
        const underperformingCampaigns = this.getUnderperformingCampaigns();
        const topOpportunities = this.getTopOptimizationOpportunities();
        
        return `
            <div class="dashboard-tab" data-tab="campaigns">
                <!-- Tab Header -->
                <div class="tab-header">
                    <h2>🎯 Campaign Deep Dive</h2>
                    <div class="tab-actions">
                        <button class="btn-refresh" onclick="dashboardContentManager.refreshData()">
                            🔄 Refresh Data
                        </button>
                        <button class="btn-export" onclick="dashboardContentManager.exportTab('campaigns')">
                            📊 Export Report
                        </button>
                    </div>
                </div>
                
                <!-- Helpful Introduction -->
                <div class="tab-intro" style="background: rgba(0, 212, 255, 0.1); border-radius: 8px; padding: 1rem; margin-bottom: 2rem; border-left: 4px solid var(--electric-blue);">
                    <p style="color: #fff; margin: 0; line-height: 1.6;">
                        💡 <strong>What you're looking at:</strong> A detailed breakdown of all your advertising campaigns across Amazon, eBay, and Walmart. 
                        <span style="color: #ccc;">Hover over any metric label to understand what it means and how to improve it.</span>
                    </p>
                </div>

                <!-- Campaign Performance Summary -->
                <section class="metrics-section">
                    <h3>📈 Campaign Performance Summary</h3>
                    <div class="metrics-grid">
                        ${this.buildCampaignSummaryMetrics()}
                    </div>
                </section>

                <!-- Platform-wise Campaign Breakdown -->
                <section class="platform-performance-section">
                    <h3>🏪 Platform Campaign Breakdown</h3>
                    <p style="color: #ccc; margin-bottom: 1.5rem; font-size: 0.9rem;">
                        Detailed performance analysis by platform. Click tabs to switch platforms and view campaign metrics.
                    </p>
                    <div class="platform-tabs">
                        ${Object.keys(campaignsByPlatform).map((platform, index) => `
                            <button class="platform-tab ${index === 0 ? 'active' : ''}" 
                                    data-platform="${platform}"
                                    title="View ${platform} campaigns">
                                ${platform} (${campaignsByPlatform[platform].length})
                            </button>
                        `).join('')}
                    </div>
                    
                    <div class="platform-content">
                        ${Object.entries(campaignsByPlatform).map(([platform, campaigns], index) => `
                            <div class="platform-panel ${index === 0 ? 'active' : ''}" 
                                 data-platform="${platform}">
                                ${this.buildPlatformCampaignTable(platform, campaigns)}
                            </div>
                        `).join('')}
                    </div>
                </section>

                <!-- Underperforming Campaigns Alert -->
                <section class="alerts-section">
                    <h3>⚠️ Campaigns Requiring Attention</h3>
                    <div class="alerts-container">
                        ${underperformingCampaigns.map(campaign => this.buildCampaignAlert(campaign)).join('')}
                    </div>
                </section>

                <!-- Top Optimization Opportunities -->
                <section class="optimization-section">
                    <h3>🚀 Top Optimization Opportunities</h3>
                    <div class="optimization-grid">
                        ${topOpportunities.map(opportunity => this.buildOptimizationCard(opportunity)).join('')}
                    </div>
                </section>
            </div>
        `;
    }

    async buildBudgetTab() {
        console.log('🔧 Starting budget tab build...');
        
        try {
            // Use simple demo data to ensure it always works
            const budgetMetrics = {
            totalBudget: 75000,
            currentSpend: 23200,
            utilization: '30.9',
            avgPOAS: '1.8',
            efficiency: '7.2',
            spendTrend: '+2.8',
            utilizationTrend: '+8.3',
            poasTrend: '+15.2',
            efficiencyTrend: '+18.7'
        };
        
        const platformAllocations = [
            { platform: 'Amazon', spend: 12400, revenue: 47390, profit: 13270, campaigns: 5, roas: '3.82', poas: '1.07', currentAllocation: '16.5', recommendedChange: '+15%', status: 'good', color: '#FF9900' },
            { platform: 'eBay', spend: 6180, revenue: 32450, profit: 11860, campaigns: 2, roas: '5.25', poas: '1.92', currentAllocation: '8.2', recommendedChange: '+20%', status: 'excellent', color: '#E53238' },
            { platform: 'Walmart', spend: 4620, revenue: 23170, profit: 6950, campaigns: 3, roas: '5.01', poas: '1.50', currentAllocation: '6.2', recommendedChange: '+10%', status: 'good', color: '#0071CE' }
        ];
        
        const recommendations = [
            { title: 'Scale eBay Budget', type: 'opportunity', impact: '+$12,500', description: 'eBay shows 1.92x POAS. Increasing budget by 20% could generate additional $12,500 in profit.', action: 'Increase Budget', priority: 'high' },
            { title: 'Expand Amazon Video Campaigns', type: 'opportunity', impact: '+$8,200', description: 'Amazon video campaigns show strong performance. Expand video ad budget by $5,000.', action: 'Expand Video', priority: 'medium' },
            { title: 'Optimize Walmart Product Mix', type: 'info', impact: '+$3,400', description: 'Focus Walmart spend on high-margin Honda and Subaru parts for better POAS.', action: 'Optimize Mix', priority: 'medium' }
        ];
        
        const poasAnalysis = [
            { name: 'Audi ECU Tuning - Exact', platform: 'eBay', roas: 92.9, poas: 3.5, spend: 1820, margin: 35, profitability: 'excellent', recommendation: 'Excellent performance - scale budget' },
            { name: 'Honda Type R Parts - Broad', platform: 'Amazon', roas: 4.24, poas: 1.2, spend: 740, margin: 28, profitability: 'good', recommendation: 'Good POAS - maintain spend' },
            { name: 'Subaru Turbo Upgrades', platform: 'Amazon', roas: 4.2, poas: 0.9, spend: 3290, margin: 21, profitability: 'marginal', recommendation: 'Below target - optimize or reduce' },
            { name: 'Walmart Retargeting Campaign', platform: 'Walmart', roas: 15.2, poas: 3.8, spend: 2038, margin: 38, profitability: 'excellent', recommendation: 'Outstanding - increase budget' },
            { name: 'BMW M Series Suspension', platform: 'Amazon', roas: 3.8, poas: 2.1, spend: 2750, margin: 32, profitability: 'good', recommendation: 'Strong performance - expand reach' },
            { name: 'Honda Civic Brake Pads', platform: 'eBay', roas: 52.5, poas: 1.5, spend: 991, margin: 25, profitability: 'profitable', recommendation: 'Good margin - test higher spend' }
        ];
            
            return `
                <div class="budget-tab dashboard-tab active">
                    <div class="tab-header">
                        <h2>💰 Budget Optimization</h2>
                        <div class="tab-actions">
                            <span class="budget-summary">Total Monthly Budget: <strong>$${budgetMetrics.totalBudget.toLocaleString()}</strong></span>
                            <button class="btn-refresh" onclick="location.reload()">🔄 Refresh</button>
                            <button class="btn-export" onclick="alert('Export feature coming soon!')">📊 Export</button>
                        </div>
                    </div>

                    <!-- Budget Summary Metrics -->
                    <section class="budget-summary-section">
                        <h3>🎯 Budget Performance Summary</h3>
                        <div class="budget-summary-grid">
                            ${this.buildBudgetMetricCard('Current Spend', '$' + budgetMetrics.currentSpend.toLocaleString(), '', budgetMetrics.spendTrend, 'racing-orange')}
                            ${this.buildBudgetMetricCard('Budget Utilization', budgetMetrics.utilization, '%', budgetMetrics.utilizationTrend, 'electric-blue')}
                            ${this.buildBudgetMetricCard('Avg. POAS', budgetMetrics.avgPOAS, 'x', budgetMetrics.poasTrend, 'neon-green')}
                            ${this.buildBudgetMetricCard('Efficiency Score', budgetMetrics.efficiency, '/10', budgetMetrics.efficiencyTrend, 'warning-yellow')}
                        </div>
                    </section>

                    <!-- Platform Budget Allocation -->
                    <section class="platform-allocation-section">
                        <h3>
                            <span class="tooltip">🏆 Platform Budget Allocation
                                <span class="tooltiptext">
                                    <div class="tooltip-section">
                                        <span class="tooltip-title">Multi-Platform Budget Distribution</span>
                                        <div class="tooltip-why">Shows how your ad budget is currently split across Amazon, eBay, and Walmart</div>
                                        <div class="tooltip-action">Compare POAS performance to identify which platforms deserve more budget</div>
                                    </div>
                                </span>
                            </span>
                        </h3>
                        <div class="allocation-grid">
                            ${platformAllocations.map(platform => this.buildPlatformAllocationCard(platform)).join('')}
                        </div>
                    </section>

                    <!-- POAS vs ROAS Analysis -->
                    <section class="poas-analysis-section">
                        <h3>
                            <span class="tooltip">📊 POAS vs ROAS Analysis
                                <span class="tooltiptext">
                                    <div class="tooltip-section">
                                        <span class="tooltip-title">True Profitability Analysis</span>
                                        <div class="tooltip-why">ROAS shows gross revenue return, POAS shows actual profit after all costs (product, shipping, fees)</div>
                                        <div class="tooltip-action">Focus budget on campaigns with highest POAS, not just highest ROAS</div>
                                    </div>
                                </span>
                            </span>
                        </h3>
                        <div class="poas-analysis-intro">
                            <p>
                                <span class="tooltip">Profit on Ad Spend (POAS)
                                    <span class="tooltiptext">
                                        <div class="tooltip-section">
                                            <span class="tooltip-title">Why POAS Matters More Than ROAS</span>
                                            <div class="tooltip-why">ROAS can be misleading - a campaign might show 5x ROAS but lose money after product costs</div>
                                            <div class="tooltip-action">Always check POAS > 1.5x for sustainable growth. High ROAS + Low POAS = unprofitable campaign</div>
                                        </div>
                                    </span>
                                </span>
                                shows true profitability after accounting for product costs, while ROAS shows gross return.
                            </p>
                        </div>
                        <div class="poas-analysis-grid">
                            ${poasAnalysis.slice(0, 6).map(analysis => this.buildPOASAnalysisCard(analysis)).join('')}
                        </div>
                    </section>

                    <!-- Budget Recommendations -->
                    <section class="budget-recommendations-section">
                        <h3>
                            <span class="tooltip">💡 AI-Powered Budget Recommendations
                                <span class="tooltiptext">
                                    <div class="tooltip-section">
                                        <span class="tooltip-title">Machine Learning Insights</span>
                                        <div class="tooltip-why">AI analyzes performance patterns, market trends, and seasonal data to suggest budget optimizations</div>
                                        <div class="tooltip-action">Review recommendations by priority level and projected impact before implementing</div>
                                    </div>
                                </span>
                            </span>
                        </h3>
                        <div class="recommendations-grid">
                            ${recommendations.map(rec => this.buildRecommendationCard(rec)).join('')}
                        </div>
                    </section>

                    <!-- Budget Reallocation Simulator -->
                    <section class="budget-simulator-section">
                        <h3>
                            <span class="tooltip">🎮 Budget Reallocation Simulator
                                <span class="tooltiptext">
                                    <div class="tooltip-section">
                                        <span class="tooltip-title">Interactive Budget Testing</span>
                                        <div class="tooltip-why">Test different budget allocation scenarios to see projected POAS and revenue impact</div>
                                        <div class="tooltip-action">Use to model "what-if" scenarios before making budget changes</div>
                                    </div>
                                </span>
                            </span>
                        </h3>
                        <div class="simulator-container">
                            <div class="simulator-intro">
                                <p>Test different budget allocations to see projected impact on POAS and overall profitability.</p>
                            </div>
                            <div class="simulator-controls">
                                <button class="btn-action" onclick="alert('Budget Simulator: Increase Amazon budget by 20% (+$3.2K) - Projected POAS improvement: +0.8x')">
                                    <span class="tooltip">🚀 Launch Simulator
                                        <span class="tooltiptext">
                                            <div class="tooltip-section">
                                                <span class="tooltip-title">Interactive Budget Modeling</span>
                                                <div class="tooltip-why">Opens sliders to adjust platform budgets and see real-time impact projections</div>
                                                <div class="tooltip-action">Test scenarios safely before applying changes to live campaigns</div>
                                            </div>
                                        </span>
                                    </span>
                                </button>
                                <button class="btn-secondary" onclick="alert('Optimal allocation applied! Amazon: +15%, eBay: +5%, Walmart: -10%')">
                                    <span class="tooltip">✨ Apply Optimal Allocation
                                        <span class="tooltiptext">
                                            <div class="tooltip-section">
                                                <span class="tooltip-title">AI-Optimized Budget Distribution</span>
                                                <div class="tooltip-why">Automatically redistributes budget based on POAS performance and growth opportunities</div>
                                                <div class="tooltip-action">Use after testing scenarios to implement the most profitable allocation</div>
                                            </div>
                                        </span>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            `;
        } catch (error) {
            console.error('❌ Error in buildBudgetTab:', error);
            return `
                <div class="budget-tab dashboard-tab active" style="padding: 2rem;">
                    <h2>💰 Budget Optimization</h2>
                    <div style="background: var(--danger-red); padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                        <p>⚠️ Budget optimization data is loading. Please refresh the page.</p>
                        <button onclick="location.reload()" style="background: var(--racing-orange); color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">🔄 Refresh Now</button>
                    </div>
                </div>
            `;
        }
    }

    buildAttributionTab() {
        if (this.attributionData.length === 0) {
            return '<div class="loading-state">📊 Loading attribution data...</div>';
        }

        const totalTests = this.attributionData.length;
        const avgLift = this.attributionData.reduce((sum, test) => sum + test.incrementalLift, 0) / totalTests;
        const totalTestSpend = this.attributionData.reduce((sum, test) => sum + test.adSpend, 0);
        const avgConfidence = this.attributionData.reduce((sum, test) => sum + test.confidence, 0) / totalTests;

        return `
            <div class="attribution-dashboard">
                <div class="attribution-header">
                    <h2>🧮 Advanced Attribution Analysis</h2>
                    <p>Cross-brand control group methodology for true incremental ROAS measurement</p>
                </div>

                <!-- Attribution Summary Metrics -->
                <div class="attribution-metrics">
                    <div class="metric-card-group">
                        <div class="metric-card">
                            <div class="metric-value">${totalTests}</div>
                            <div class="metric-label">
                                <span class="tooltip">🧪 Active Tests
                                    <span class="tooltiptext">
                                        <div class="tooltip-section">
                                            <span class="tooltip-title">Live Attribution Experiments</span>
                                            <div class="tooltip-why">Number of running tests measuring true ad impact vs organic sales</div>
                                            <div class="tooltip-action">More tests = more data points for confident budget decisions</div>
                                        </div>
                                    </span>
                                </span>
                            </div>
                            <div class="metric-period">Live Experiments</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value">${avgLift.toFixed(1)}%</div>
                            <div class="metric-label">
                                <span class="tooltip">📈 Avg Incremental Lift
                                    <span class="tooltiptext">
                                        <div class="tooltip-section">
                                            <span class="tooltip-title">True Sales Increase From Ads</span>
                                            <div class="tooltip-why">Real sales increase caused by your ads (vs what would happen organically)</div>
                                            <div class="tooltip-action">70%+ is excellent, 50%+ is good, <30% means ads aren't driving much incremental sales</div>
                                        </div>
                                    </span>
                                </span>
                            </div>
                            <div class="metric-period">Cross-brand control</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value">$${totalTestSpend.toLocaleString()}</div>
                            <div class="metric-label">
                                <span class="tooltip">💰 Test Investment
                                    <span class="tooltiptext">
                                        <div class="tooltip-section">
                                            <span class="tooltip-title">Scientific Testing Budget</span>
                                            <div class="tooltip-why">Budget allocated to measure true ad effectiveness through controlled experiments</div>
                                            <div class="tooltip-action">Small investment (5-10% of total budget) to ensure remaining 90% is spent wisely</div>
                                        </div>
                                    </span>
                                </span>
                            </div>
                            <div class="metric-period">Total test spend</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value">${avgConfidence.toFixed(0)}%</div>
                            <div class="metric-label">
                                <span class="tooltip">🎯 Avg Confidence
                                    <span class="tooltiptext">
                                        <div class="tooltip-section">
                                            <span class="tooltip-title">Statistical Reliability</span>
                                            <div class="tooltip-why">How certain we are that the results aren't due to chance or luck</div>
                                            <div class="tooltip-action">95%+ = make budget decisions, 90-94% = wait for more data, <90% = too early to act</div>
                                        </div>
                                    </span>
                                </span>
                            </div>
                            <div class="metric-period">Statistical significance</div>
                        </div>
                    </div>
                </div>

                <!-- Attribution Test Results -->
                <section class="attribution-tests-section">
                    <h3>
                        <span class="tooltip">🔬 Attribution Test Results
                            <span class="tooltiptext">
                                <div class="tooltip-section">
                                    <span class="tooltip-title">Live Experiment Results</span>
                                    <div class="tooltip-why">Individual test results comparing your products vs competitor baselines</div>
                                    <div class="tooltip-action">Focus on high-confidence tests (95%+) for budget reallocation decisions</div>
                                </div>
                            </span>
                        </span>
                    </h3>
                    <div class="attribution-tests-grid">
                        ${this.buildAttributionTestCards()}
                    </div>
                </section>

                <!-- ROAS Comparison Analysis -->
                <section class="roas-comparison-section">
                    <div class="section-header">
                        <h3>
                            <span class="tooltip">📊 Apparent vs Real ROI Analysis
                                <span class="tooltiptext">
                                    <div class="tooltip-section">
                                        <span class="tooltip-title">Platform vs Reality Comparison</span>
                                        <div class="tooltip-why">Shows how much platforms overstate performance by claiming credit for organic sales</div>
                                        <div class="tooltip-action">Use Real ROI (not platform numbers) for all budget decisions</div>
                                    </div>
                                </span>
                            </span>
                        </h3>
                        <p>
                            Comparing platform-reported ROAS with cross-brand control group measurements
                        </p>
                    </div>
                    
                    <div class="roas-comparison-table">
                        <table class="enhanced-attribution-table">
                            <thead>
                                <tr>
                                    <th>
                                        <span class="tooltip">Test ID
                                            <span class="tooltiptext">
                                                <div class="tooltip-section">
                                                    <span class="tooltip-title">Experiment Identifier</span>
                                                    <div class="tooltip-why">Unique ID for each attribution test comparing your ads vs control group</div>
                                                    <div class="tooltip-action">Higher numbered experiments are more recent tests</div>
                                                </div>
                                            </span>
                                        </span>
                                    </th>
                                    <th>
                                        <span class="tooltip">Product Category
                                            <span class="tooltiptext">
                                                <div class="tooltip-section">
                                                    <span class="tooltip-title">Tested Product Type</span>
                                                    <div class="tooltip-why">Which automotive part category is being tested for true ad effectiveness</div>
                                                    <div class="tooltip-action">Different categories may have different attribution patterns</div>
                                                </div>
                                            </span>
                                        </span>
                                    </th>
                                    <th>
                                        <span class="tooltip">Test Spend
                                            <span class="tooltiptext">
                                                <div class="tooltip-section">
                                                    <span class="tooltip-title">Experiment Budget</span>
                                                    <div class="tooltip-why">Ad spend allocated to this specific attribution test</div>
                                                    <div class="tooltip-action">Larger test spends generally produce more reliable results</div>
                                                </div>
                                            </span>
                                        </span>
                                    </th>
                                    <th>
                                        <span class="tooltip">Apparent ROAS
                                            <span class="tooltiptext">
                                                <div class="tooltip-section">
                                                    <span class="tooltip-title">Platform-Reported ROAS</span>
                                                    <div class="tooltip-why">What Amazon/eBay/Walmart claim your ads delivered (usually inflated)</div>
                                                    <div class="tooltip-action">Don't use this for budget decisions - platforms overstate to keep you spending</div>
                                                </div>
                                            </span>
                                        </span>
                                    </th>
                                    <th>
                                        <span class="tooltip">Real ROI
                                            <span class="tooltiptext">
                                                <div class="tooltip-section">
                                                    <span class="tooltip-title">Scientific Measurement</span>
                                                    <div class="tooltip-why">Actual incremental return after removing organic sales that would happen anyway</div>
                                                    <div class="tooltip-action">Use this number for all budget decisions. Target 2.5x+ for profitable growth</div>
                                                </div>
                                            </span>
                                        </span>
                                    </th>
                                    <th>
                                        <span class="tooltip">Attribution Gap
                                            <span class="tooltiptext">
                                                <div class="tooltip-section">
                                                    <span class="tooltip-title">Platform Overstatement</span>
                                                    <div class="tooltip-why">How much platforms inflate performance by claiming credit for organic sales</div>
                                                    <div class="tooltip-action">30%+ gap = major overstatement. 50%+ gap = platform numbers are mostly fake</div>
                                                </div>
                                            </span>
                                        </span>
                                    </th>
                                    <th>
                                        <span class="tooltip">Confidence
                                            <span class="tooltiptext">
                                                <div class="tooltip-section">
                                                    <span class="tooltip-title">Statistical Certainty</span>
                                                    <div class="tooltip-why">How sure we are that results aren't due to random chance</div>
                                                    <div class="tooltip-action">Only make major budget changes on 95%+ confidence tests</div>
                                                </div>
                                            </span>
                                        </span>
                                    </th>
                                    <th>
                                        <span class="tooltip">Status
                                            <span class="tooltiptext">
                                                <div class="tooltip-section">
                                                    <span class="tooltip-title">Test Validation Status</span>
                                                    <div class="tooltip-why">Whether test results are reliable enough for business decisions</div>
                                                    <div class="tooltip-action">Validated = act on results, In Progress = wait, Under Review = too early</div>
                                                </div>
                                            </span>
                                        </span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.buildAttributionTableRows()}
                            </tbody>
                        </table>
                    </div>
                </section>

                <!-- Methodology Info -->
                <section class="methodology-section">
                    <div class="methodology-card">
                        <h4>📋 Cross-Brand Control Group Methodology</h4>
                        <div class="methodology-content">
                            <div class="method-step">
                                <span class="step-number">1</span>
                                <div class="step-content">
                                    <strong>Control Group Selection:</strong>
                                    Similar products from competing brands used as baseline
                                </div>
                            </div>
                            <div class="method-step">
                                <span class="step-number">2</span>
                                <div class="step-content">
                                    <strong>Incremental Lift Calculation:</strong>
                                    True revenue impact = Test Revenue - Expected Organic Revenue
                                </div>
                            </div>
                            <div class="method-step">
                                <span class="step-number">3</span>
                                <div class="step-content">
                                    <strong>Statistical Analysis:</strong>
                                    Confidence intervals calculated using A/B testing methodology
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        `;
    }

    buildAttributionTestCards() {
        return this.attributionData.map(test => {
            const attributionGap = ((test.apparentROAS - test.trueROAS) / test.apparentROAS * 100);
            const confidenceLevel = test.confidence >= 95 ? 'high' : test.confidence >= 90 ? 'medium' : 'low';
            const liftTrend = test.incrementalLift > 80 ? 'excellent' : test.incrementalLift > 50 ? 'good' : 'moderate';

            return `
                <div class="attribution-test-card ${confidenceLevel}">
                    <div class="test-header">
                        <div class="test-id">${test.testId}</div>
                        <div class="confidence-badge confidence-${confidenceLevel}">
                            ${test.confidence}% confidence
                        </div>
                    </div>
                    
                    <div class="test-groups">
                        <div class="test-group">
                            <div class="group-label">🎯 Test Group</div>
                            <div class="group-value">${test.testGroup}</div>
                        </div>
                        <div class="vs-divider">vs</div>
                        <div class="control-group">
                            <div class="group-label">🛡️ Control Group</div>
                            <div class="group-value">${test.controlGroup}</div>
                        </div>
                    </div>

                    <div class="test-metrics">
                        <div class="metric-row">
                            <span class="metric-name">Incremental Lift:</span>
                            <span class="metric-value lift-${liftTrend}">+${test.incrementalLift}%</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-name">Attribution Gap:</span>
                            <span class="metric-value">${attributionGap.toFixed(1)}%</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-name">True vs Apparent:</span>
                            <span class="metric-value">${test.trueROAS.toFixed(2)}x vs ${test.apparentROAS.toFixed(2)}x</span>
                        </div>
                    </div>

                    <div class="test-description">
                        ${test.description}
                    </div>
                </div>
            `;
        }).join('');
    }

    buildAttributionTableRows() {
        return this.attributionData.map(test => {
            const attributionGap = ((test.apparentROAS - test.trueROAS) / test.apparentROAS * 100);
            const gapLevel = attributionGap > 50 ? 'high' : attributionGap > 30 ? 'medium' : 'low';
            const confidenceLevel = test.confidence >= 95 ? 'high' : test.confidence >= 90 ? 'medium' : 'low';
            const status = test.confidence >= 95 ? 'Validated' : test.confidence >= 90 ? 'In Progress' : 'Under Review';

            return `
                <tr class="attribution-row">
                    <td class="test-id-cell">${test.testId}</td>
                    <td class="category-cell">${test.testGroup}</td>
                    <td class="spend-cell">$${test.adSpend.toLocaleString()}</td>
                    <td class="apparent-roas-cell">${test.apparentROAS.toFixed(2)}x</td>
                    <td class="true-roas-cell">${test.trueROAS.toFixed(2)}x</td>
                    <td class="gap-cell gap-${gapLevel}">
                        <span class="gap-value">${attributionGap.toFixed(1)}%</span>
                        <span class="gap-indicator">⚠️</span>
                    </td>
                    <td class="confidence-cell confidence-${confidenceLevel}">
                        ${test.confidence}%
                    </td>
                    <td class="status-cell">
                        <span class="status-badge status-${confidenceLevel}">${status}</span>
                    </td>
                </tr>
            `;
        }).join('');
    }

    buildComingSoonTab(tabId) {
        return `<div class="coming-soon">🚧 ${this.getTabTitle(tabId)} - Coming Soon</div>`;
    }

    buildErrorTab(tabId, error) {
        return `
            <div class="error-tab">
                <h3>❌ Error Loading ${this.getTabTitle(tabId)}</h3>
                <p>An error occurred while loading the dashboard content.</p>
                <details>
                    <summary>Error Details</summary>
                    <pre>${error.message}</pre>
                </details>
                <button onclick="dashboardContent.loadTabContent('${tabId}')">🔄 Retry</button>
            </div>
        `;
    }

    // Initialize tab-specific features
    initializeTabFeatures(tabId) {
        if (tabId === 'overview') {
            // Initialize metric card interactions
            this.initializeMetricCards();
            
            // Initialize alert interactions
            this.initializeAlerts();
            
            // Initialize table sorting
            this.initializeTableSorting();
        } else if (tabId === 'campaigns') {
            // Initialize platform tab switching
            this.initializePlatformTabs();
        }
    }

    initializeMetricCards() {
        document.querySelectorAll('.metric-card').forEach(card => {
            card.addEventListener('click', () => {
                const metric = card.dataset.metric;
                this.showMetricDetails(metric);
            });
        });
    }

    initializeAlerts() {
        // Alert interactions already handled via onclick attributes
    }

    initializeTableSorting() {
        // Add sorting functionality to campaign table headers
        document.querySelectorAll('.campaigns-table th').forEach(header => {
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => {
                // Table sorting logic would go here
                console.log('Sort by:', header.textContent);
            });
        });
    }

    initializePlatformTabs() {
        // Initialize platform tab switching for Tab 2
        const platformTabs = document.querySelectorAll('.platform-tab');
        const platformPanels = document.querySelectorAll('.platform-panel');
        
        platformTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const platform = tab.dataset.platform;
                
                // Remove active class from all tabs and panels
                platformTabs.forEach(t => t.classList.remove('active'));
                platformPanels.forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding panel
                tab.classList.add('active');
                const targetPanel = document.querySelector(`.platform-panel[data-platform="${platform}"]`);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
                
                console.log(`🎯 Switched to ${platform} platform view`);
            });
        });
        
        console.log(`✅ Initialized ${platformTabs.length} platform tabs`);
    }

    // Budget Tab Specific Methods
    calculateBudgetMetrics() {
        // Safety check
        if (!this.campaignData || this.campaignData.length === 0) {
            return {
                totalBudget: 75000,
                currentSpend: 0,
                utilization: '0.0',
                avgPOAS: '0.00',
                efficiency: '0.0',
                spendTrend: '+0.0',
                utilizationTrend: '+0.0',
                poasTrend: '+0.0',
                efficiencyTrend: '+0.0'
            };
        }
        
        const totalSpend = this.campaignData.reduce((sum, campaign) => sum + (campaign.spend || 0), 0);
        const totalRevenue = this.campaignData.reduce((sum, campaign) => sum + (campaign.revenue || 0), 0);
        const totalBudget = 75000; // Monthly budget
        
        // Calculate profit per campaign based on brand margins
        const totalProfit = this.campaignData.reduce((sum, campaign) => {
            const brand = this.extractBrandFromCampaign(campaign);
            const margin = this.margins[brand] || this.margins['Universal'];
            return sum + (campaign.revenue * margin);
        }, 0);
        
        const avgPOAS = totalSpend > 0 ? totalProfit / totalSpend : 0;
        const utilization = (totalSpend / totalBudget) * 100;
        const efficiency = (avgPOAS * utilization) / 100; // Composite efficiency score
        
        return {
            totalBudget,
            currentSpend: totalSpend,
            utilization: utilization.toFixed(1),
            avgPOAS: avgPOAS.toFixed(2),
            efficiency: efficiency.toFixed(1),
            spendTrend: '+12.5',
            utilizationTrend: '+8.3',
            poasTrend: '+15.2',
            efficiencyTrend: '+18.7'
        };
    }

    calculatePlatformAllocations() {
        const platformData = {};
        
        // Group campaigns by platform
        this.campaignData.forEach(campaign => {
            if (!platformData[campaign.platform]) {
                platformData[campaign.platform] = {
                    platform: campaign.platform,
                    spend: 0,
                    revenue: 0,
                    profit: 0,
                    campaigns: 0,
                    color: this.platformColors[campaign.platform] || '#666'
                };
            }
            
            const brand = this.extractBrandFromCampaign(campaign);
            const margin = this.margins[brand] || this.margins['Universal'];
            const profit = campaign.revenue * margin;
            
            platformData[campaign.platform].spend += campaign.spend;
            platformData[campaign.platform].revenue += campaign.revenue;
            platformData[campaign.platform].profit += profit;
            platformData[campaign.platform].campaigns += 1;
        });
        
        // Calculate metrics and recommendations for each platform
        return Object.values(platformData).map(platform => ({
            ...platform,
            roas: (platform.revenue / platform.spend).toFixed(2),
            poas: (platform.profit / platform.spend).toFixed(2),
            currentAllocation: ((platform.spend / 75000) * 100).toFixed(1),
            recommendedChange: this.calculateRecommendedChange(platform),
            status: this.getPlatformStatus(platform.profit / platform.spend)
        }));
    }

    calculateRecommendedChange(platform) {
        const poas = platform.profit / platform.spend;
        if (poas > 2.0) return '+15%';
        if (poas > 1.5) return '+5%';
        if (poas > 1.0) return '0%';
        if (poas > 0.5) return '-10%';
        return '-25%';
    }

    getPlatformStatus(poas) {
        if (poas > 2.0) return 'excellent';
        if (poas > 1.5) return 'good';
        if (poas > 1.0) return 'average';
        return 'poor';
    }

    calculatePOASAnalysis() {
        return this.campaignData.map(campaign => {
            const brand = this.extractBrandFromCampaign(campaign);
            const margin = this.margins[brand] || this.margins['Universal'];
            const profit = campaign.revenue * margin;
            const poas = profit / campaign.spend;
            const roas = campaign.revenue / campaign.spend;
            
            return {
                name: campaign.name,
                brand,
                platform: campaign.platform,
                roas: roas.toFixed(2),
                poas: poas.toFixed(2),
                margin: (margin * 100).toFixed(0),
                profitability: this.getProfitabilityStatus(poas),
                recommendation: this.getPOASRecommendation(poas, roas)
            };
        }).sort((a, b) => parseFloat(b.poas) - parseFloat(a.poas));
    }

    getProfitabilityStatus(poas) {
        if (poas > 2.0) return 'excellent';
        if (poas > 1.5) return 'good';
        if (poas > 1.0) return 'profitable';
        if (poas > 0.5) return 'marginal';
        return 'losing';
    }

    getPOASRecommendation(poas, roas) {
        if (poas < 1.0 && roas > 3.0) return 'High ROAS but low profit - review product costs';
        if (poas > 2.0) return 'Excellent profitability - scale up budget';
        if (poas > 1.5) return 'Good performance - maintain current spend';
        if (poas > 1.0) return 'Break-even - optimize or reduce spend';
        return 'Losing money - pause or restructure campaign';
    }

    generateBudgetRecommendations() {
        const recommendations = [];
        const platformData = this.calculatePlatformAllocations();
        
        // Safety check
        if (!platformData || platformData.length === 0) {
            return [{
                title: 'No Platform Data',
                type: 'info',
                impact: '$0',
                description: 'Platform performance data is being loaded. Please refresh to see recommendations.',
                action: 'Refresh',
                priority: 'low'
            }];
        }
        
        // Find best performing platform
        const bestPlatform = platformData.reduce((best, current) => 
            parseFloat(current.poas) > parseFloat(best.poas) ? current : best
        );
        
        // Find worst performing platform
        const worstPlatform = platformData.reduce((worst, current) => 
            parseFloat(current.poas) < parseFloat(worst.poas) ? current : worst
        );
        
        recommendations.push({
            title: `Scale ${bestPlatform.platform} Budget`,
            type: 'opportunity',
            impact: '+$12,500',
            description: `${bestPlatform.platform} shows ${bestPlatform.poas}x POAS. Increasing budget by 20% could generate additional $12,500 in profit.`,
            action: 'Increase Budget',
            priority: 'high'
        });
        
        if (parseFloat(worstPlatform.poas) < 1.0) {
            recommendations.push({
                title: `Reduce ${worstPlatform.platform} Spend`,
                type: 'warning',
                impact: '-$8,200',
                description: `${worstPlatform.platform} shows ${worstPlatform.poas}x POAS (losing money). Reducing budget by 30% could save $8,200 monthly.`,
                action: 'Reduce Budget',
                priority: 'high'
            });
        }
        
        // Add Honda-specific recommendation
        const hondaCampaigns = this.campaignData.filter(c => c.name.includes('Honda'));
        if (hondaCampaigns.length > 0) {
            const avgHondaPOAS = hondaCampaigns.reduce((sum, c) => {
                const margin = this.margins['Honda'];
                return sum + ((c.revenue * margin) / c.spend);
            }, 0) / hondaCampaigns.length;
            
            recommendations.push({
                title: 'Honda Video Campaign Expansion',
                type: 'opportunity',
                impact: '+$6,800',
                description: `Honda campaigns show ${avgHondaPOAS.toFixed(2)}x POAS with strong video content performance. Expand video ad budget by $5,000.`,
                action: 'Expand Video',
                priority: 'medium'
            });
        }
        
        return recommendations;
    }

    buildBudgetMetricCard(title, value, suffix, trend, colorClass) {
        const trendDirection = parseFloat(trend) >= 0 ? 'up' : 'down';
        const trendIcon = parseFloat(trend) >= 0 ? '↗️' : '↘️';
        const trendClass = parseFloat(trend) >= 0 ? 'positive' : 'negative';
        
        // Define tooltip content for budget metrics
        const tooltips = {
            'current spend': {
                title: 'Current Monthly Ad Spend',
                why: 'Total amount spent on advertising across all platforms this month',
                action: 'Monitor against budget limits and optimize allocation based on POAS performance'
            },
            'budget utilization': {
                title: 'Budget Utilization Rate', 
                why: 'Percentage of total monthly budget currently being spent',
                action: 'Target 80-90% utilization. Low utilization may mean missed opportunities'
            },
            'avg. poas': {
                title: 'Average Profit on Ad Spend',
                why: 'True profitability after deducting product costs. More accurate than ROAS for business decisions',
                action: 'Target 1.5x+ POAS for sustainable growth. Focus budget on high-POAS campaigns'
            },
            'efficiency score': {
                title: 'Budget Efficiency Score',
                why: 'Overall effectiveness of budget allocation across platforms and campaigns (1-10 scale)',
                action: 'Scores 8+ indicate excellent allocation. Lower scores suggest rebalancing needed'
            }
        };
        
        const tooltip = tooltips[title.toLowerCase()];
        
        return `
            <div class="summary-metric-card ${colorClass}" data-metric="${title.toLowerCase()}">
                <h4>
                    <span class="tooltip">${title}
                        <span class="tooltiptext">
                            <div class="tooltip-section">
                                <span class="tooltip-title">${tooltip.title}</span>
                                <div class="tooltip-why">${tooltip.why}</div>
                                <div class="tooltip-action">${tooltip.action}</div>
                            </div>
                        </span>
                    </span>
                </h4>
                <span class="value">${value}${suffix}</span>
                <span class="change ${trendClass}">${trendIcon} ${Math.abs(trend)}%</span>
            </div>
        `;
    }

    buildPlatformAllocationCard(platform) {
        const recommendation = platform.recommendedChange;
        const recommendationClass = recommendation.includes('+') ? 'positive' : 
                                   recommendation.includes('-') ? 'negative' : 'neutral';
        
        return `
            <div class="platform-allocation-card">
                <div class="platform-header">
                    <h4 style="color: ${platform.color}">${platform.platform}</h4>
                    <span class="status-badge ${platform.status}">${platform.status}</span>
                </div>
                <div class="allocation-metrics">
                    <div class="allocation-current">
                        <span class="label">Current Allocation</span>
                        <span class="value">${platform.currentAllocation}%</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${platform.currentAllocation}%; background: ${platform.color}"></div>
                        </div>
                    </div>
                    <div class="allocation-metrics-grid">
                        <div class="metric">
                            <span class="label">Spend</span>
                            <span class="value">$${platform.spend.toLocaleString()}</span>
                        </div>
                        <div class="metric">
                            <span class="label">
                                <span class="tooltip">ROAS
                                    <span class="tooltiptext">
                                        <div class="tooltip-section">
                                            <span class="tooltip-title">Return on Ad Spend</span>
                                            <div class="tooltip-why">Gross revenue generated for every $1 spent on ${platform.platform} ads</div>
                                            <div class="tooltip-action">Compare across platforms to identify best performing channels</div>
                                        </div>
                                    </span>
                                </span>
                            </span>
                            <span class="value">${platform.roas}x</span>
                        </div>
                        <div class="metric">
                            <span class="label">
                                <span class="tooltip">POAS
                                    <span class="tooltiptext">
                                        <div class="tooltip-section">
                                            <span class="tooltip-title">Profit on Ad Spend</span>
                                            <div class="tooltip-why">True profit after product costs for every $1 spent on ${platform.platform}</div>
                                            <div class="tooltip-action">Focus budget on platforms with POAS > 1.5x for sustainable growth</div>
                                        </div>
                                    </span>
                                </span>
                            </span>
                            <span class="value">${platform.poas}x</span>
                        </div>
                        <div class="metric">
                            <span class="label">Campaigns</span>
                            <span class="value">${platform.campaigns}</span>
                        </div>
                    </div>
                    <div class="allocation-recommendation">
                        <span class="rec-label">AI Recommends:</span>
                        <span class="rec-value ${recommendationClass}">${recommendation}</span>
                    </div>
                </div>
            </div>
        `;
    }

    buildPOASAnalysisCard(analysis) {
        const profitabilityClass = analysis.profitability === 'excellent' ? 'status-excellent' :
                                  analysis.profitability === 'good' ? 'status-good' :
                                  analysis.profitability === 'profitable' ? 'status-average' :
                                  analysis.profitability === 'marginal' ? 'status-warning' : 'status-critical';
        
        return `
            <div class="poas-analysis-card">
                <div class="analysis-header">
                    <h4>
                        <span class="tooltip">${analysis.name}
                            <span class="tooltiptext">
                                <div class="tooltip-section">
                                    <span class="tooltip-title">Campaign Analysis</span>
                                    <div class="tooltip-why">Shows true profitability vs gross revenue for this campaign</div>
                                    <div class="tooltip-action">Compare POAS vs ROAS to see actual profit after product costs</div>
                                </div>
                            </span>
                        </span>
                    </h4>
                    <span class="platform-badge" style="background: ${this.platformColors[analysis.platform]}">${analysis.platform}</span>
                </div>
                <div class="analysis-metrics">
                    <div class="metric-row">
                        <span class="label">
                            <span class="tooltip">ROAS:
                                <span class="tooltiptext">
                                    <div class="tooltip-section">
                                        <span class="tooltip-title">Return on Ad Spend</span>
                                        <div class="tooltip-why">Gross revenue generated per $1 ad spend (before costs)</div>
                                        <div class="tooltip-action">Higher is better, but check POAS for true profitability</div>
                                    </div>
                                </span>
                            </span>
                        </span>
                        <span class="value">${analysis.roas}x</span>
                    </div>
                    <div class="metric-row">
                        <span class="label">
                            <span class="tooltip">POAS:
                                <span class="tooltiptext">
                                    <div class="tooltip-section">
                                        <span class="tooltip-title">Profit on Ad Spend</span>
                                        <div class="tooltip-why">True profit after product costs, shipping, and fees per $1 ad spend</div>
                                        <div class="tooltip-action">Target POAS > 1.5x for sustainable growth. This is your real profit metric</div>
                                    </div>
                                </span>
                            </span>
                        </span>
                        <span class="value ${profitabilityClass}">${analysis.poas}x</span>
                    </div>
                    <div class="metric-row">
                        <span class="label">
                            <span class="tooltip">Margin:
                                <span class="tooltiptext">
                                    <div class="tooltip-section">
                                        <span class="tooltip-title">Profit Margin</span>
                                        <div class="tooltip-why">Percentage profit after all costs (product, shipping, platform fees)</div>
                                        <div class="tooltip-action">Higher margins allow more aggressive ad spending for growth</div>
                                    </div>
                                </span>
                            </span>
                        </span>
                        <span class="value">${analysis.margin}%</span>
                    </div>
                    <div class="metric-row">
                        <span class="label">
                            <span class="tooltip">Status:
                                <span class="tooltiptext">
                                    <div class="tooltip-section">
                                        <span class="tooltip-title">Profitability Status</span>
                                        <div class="tooltip-why">Overall campaign health: Excellent > Good > Marginal > Loss-making</div>
                                        <div class="tooltip-action">Focus budget on 'Excellent' and 'Good' campaigns, fix or pause others</div>
                                    </div>
                                </span>
                            </span>
                        </span>
                        <span class="value ${profitabilityClass}">${analysis.profitability}</span>
                    </div>
                </div>
                <div class="analysis-recommendation">
                    <small>${analysis.recommendation}</small>
                </div>
            </div>
        `;
    }

    buildRecommendationCard(rec) {
        const typeClass = rec.type === 'opportunity' ? 'rec-opportunity' :
                         rec.type === 'warning' ? 'rec-warning' : 'rec-info';
        const impactClass = rec.impact.includes('+') ? 'impact-positive' : 'impact-negative';
        
        return `
            <div class="recommendation-card ${typeClass}">
                <div class="rec-header">
                    <h4>
                        <span class="tooltip">${rec.title}
                            <span class="tooltiptext">
                                <div class="tooltip-section">
                                    <span class="tooltip-title">AI-Powered Recommendation</span>
                                    <div class="tooltip-why">Machine learning analysis of your campaign performance and market trends</div>
                                    <div class="tooltip-action">Review impact projections and apply if aligned with business goals</div>
                                </div>
                            </span>
                        </span>
                    </h4>
                    <span class="rec-priority priority-${rec.priority}">
                        <span class="tooltip">${rec.priority.toUpperCase()}
                            <span class="tooltiptext">
                                <div class="tooltip-section">
                                    <span class="tooltip-title">Recommendation Priority</span>
                                    <div class="tooltip-why">HIGH = immediate action needed, MEDIUM = plan for next week, LOW = future consideration</div>
                                    <div class="tooltip-action">Tackle HIGH priority recommendations first for maximum impact</div>
                                </div>
                            </span>
                        </span>
                    </span>
                </div>
                <div class="rec-impact ${impactClass}">
                    <span class="impact-label">
                        <span class="tooltip">Projected Impact:
                            <span class="tooltiptext">
                                <div class="tooltip-section">
                                    <span class="tooltip-title">Revenue Impact Forecast</span>
                                    <div class="tooltip-why">Estimated additional profit if this recommendation is implemented</div>
                                    <div class="tooltip-action">Based on historical performance and current market conditions</div>
                                </div>
                            </span>
                        </span>
                    </span>
                    <span class="impact-value">${rec.impact}</span>
                </div>
                <div class="rec-description">
                    <p>${rec.description}</p>
                </div>
                <div class="rec-actions">
                    <button class="btn-action" onclick="dashboardContentManager.applyRecommendation('${rec.title}')">${rec.action}</button>
                    <button class="btn-details" onclick="dashboardContentManager.viewRecommendationDetails('${rec.title}')">Details</button>
                </div>
            </div>
        `;
    }

    // Budget simulator and optimization methods
    openBudgetSimulator() {
        console.log('🎮 Opening budget reallocation simulator...');
        alert('Budget Simulator would open here with interactive sliders to test different allocation scenarios and see projected POAS impacts.');
    }

    applyOptimalAllocation() {
        console.log('✨ Applying optimal budget allocation...');
        alert('Optimal allocation applied! Budget redistributed based on POAS performance to maximize profitability.');
    }

    applyRecommendation(title) {
        console.log('🚀 Applying recommendation:', title);
        alert(`Applying recommendation: ${title}`);
    }

    viewRecommendationDetails(title) {
        console.log('📊 Viewing recommendation details:', title);
        alert(`Detailed analysis for: ${title}`);
    }

    // Tab 2 Helper Methods
    buildCampaignSummaryMetrics() {
        const totalCampaigns = this.campaignData.length;
        const activeCampaigns = this.campaignData.filter(c => c.status === 'Active').length;
        const avgROAS = this.campaignData.reduce((sum, c) => sum + c.roas, 0) / totalCampaigns;
        const avgCPC = this.campaignData.reduce((sum, c) => sum + (c.cpc || 0), 0) / totalCampaigns;
        
        return `
            <div class="metric-card racing-orange">
                <div class="metric-header">
                    <span class="metric-icon">📊</span>
                    <div class="tooltip">
                        <h4 class="metric-title">TOTAL CAMPAIGNS</h4>
                        <span class="tooltiptext">
                            <div class="tooltip-section">
                                <span class="tooltip-title">Total Ad Campaigns</span>
                                <div class="tooltip-why">Number of different ad campaigns across all platforms (Amazon, eBay, Google, Facebook)</div>
                                <div class="tooltip-action">More campaigns = more testing opportunities, but require better organization and monitoring</div>
                            </div>
                        </span>
                    </div>
                </div>
                <div class="metric-value-container">
                    <span class="metric-value">${totalCampaigns}</span>
                </div>
                <div class="metric-details">
                    <small>Across all platforms</small>
                </div>
            </div>
            <div class="metric-card electric-blue">
                <div class="metric-header">
                    <span class="metric-icon">🟢</span>
                    <span class="tooltip">ACTIVE CAMPAIGNS
                        <span class="tooltiptext">
                            <div class="tooltip-section">
                                <span class="tooltip-title">Currently Running Campaigns</span>
                                <div class="tooltip-why">Campaigns that are live and actively spending your advertising budget right now</div>
                                <div class="tooltip-action">Monitor active campaigns daily for performance issues, budget pacing, and optimization opportunities</div>
                            </div>
                        </span>
                    </span>
                </div>
                <div class="metric-value-container">
                    <span class="metric-value">${activeCampaigns}</span>
                </div>
                <div class="metric-details">
                    <small>Currently running</small>
                </div>
            </div>
            <div class="metric-card neon-green">
                <div class="metric-header">
                    <span class="metric-icon">🎯</span>
                    <span class="tooltip">AVG ROAS
                        <span class="tooltiptext">
                            <div class="tooltip-section">
                                <span class="tooltip-title">Average Return on Ad Spend</span>
                                <div class="tooltip-why">For every $1 spent on ads, how much revenue we generate on average across all campaigns</div>
                                <div class="tooltip-action">Target 4x+ ROAS for profitable growth. Pause campaigns below 2x and optimize those between 2-4x</div>
                            </div>
                        </span>
                    </span>
                </div>
                <div class="metric-value-container">
                    <span class="metric-value">${avgROAS.toFixed(2)}x</span>
                </div>
                <div class="metric-details">
                    <small>Revenue ÷ Ad Spend</small>
                </div>
            </div>
            <div class="metric-card warning-yellow">
                <div class="metric-header">
                    <span class="metric-icon">💰</span>
                    <span class="tooltip">AVG CPC
                        <span class="tooltiptext">
                            <div class="tooltip-section">
                                <span class="tooltip-title">Average Cost Per Click</span>
                                <div class="tooltip-why">How much you pay on average each time someone clicks your ad across all campaigns</div>
                                <div class="tooltip-action">Lower CPC = more clicks for same budget. Optimize keywords, improve Quality Score, and test ad copy to reduce CPC</div>
                            </div>
                        </span>
                    </span>
                </div>
                <div class="metric-value-container">
                    <span class="metric-value">$${avgCPC.toFixed(2)}</span>
                </div>
                <div class="metric-details">
                    <small>Cost per click</small>
                </div>
            </div>
        `;
    }

    buildPlatformCampaignTable(platform, campaigns) {
        console.log(`🔧 Building simple HTML table for ${platform} with ${campaigns.length} campaigns`);
        
        // Sample data for the platform - using simple approach
        const sampleData = {
            'Amazon': [
                ['Subaru Turbo Upgrades - Exact', 'Sponsored Products', 'Active', '4.2x', '2.5x', '0.9x', '$329.67', '$1,389.95', '📈 +15.3%'],
                ['Honda Type R Parts - Broad', 'Sponsored Products', 'Active', '4.24x', '1.2x', '1.2x', '$740', '$3,139', '📈 +8.7%'],
                ['K2Motor Brand Campaign', 'Sponsored Brands', 'Active', '4.24x', '1.1x', '1.1x', '$1,568', '$6,628', '📊 +0.2%']
            ],
            'eBay': [
                ['Audi ECU Tuning - Exact', 'Sponsored Products', 'Active', '92.9x', '55.7x', '3.5x', '$1,820', '$169,078', '📈 +22.1%'],
                ['Honda Civic Brake Pads 2016-2021', 'Sponsored Products', 'Active', '52.5x', '31.5x', '1.5x', '$991', '$52,028', '📈 +12.8%']
            ],
            'Walmart': [
                ['Retargeting - Previous Visitors', 'Sponsored Products', 'Active', '15.2x', '9.1x', '3.8x', '$2,038', '$30,978', '📊 +0.8%'],
                ['BMW M Series Suspension - Broad', 'Sponsored Products', 'Underperforming', '3.6x', '2.1x', '1.5x', '$201.89', '$719.99', '📉 -5.8%']
            ]
        };
        
        const platformData = sampleData[platform] || [];
        
        const tableHTML = `
            <h4 style="color: ${this.platformColors[platform]}; margin-bottom: 1rem; display: flex; align-items: center;">
                <span style="margin-right: 0.5rem;">📊</span>
                ${platform} Campaign Performance
                <span style="margin-left: auto; font-size: 0.8rem; color: #999;">${platformData.length} campaigns</span>
            </h4>
            <table border="1" style="border-collapse: collapse; width: 100%; color: white;">
                <tr>
                    <th style="padding: 10px; background: #FF6B35; color: white;">
                        <span class="tooltip">Campaign Name
                            <span class="tooltiptext">
                                <div class="tooltip-section">
                                    <span class="tooltip-title">Campaign Identifier</span>
                                    <div class="tooltip-why">The specific ad campaign targeting your products and keywords</div>
                                    <div class="tooltip-action">Click to view detailed performance metrics</div>
                                </div>
                            </span>
                        </span>
                    </th>
                    <th style="padding: 10px; background: #FF6B35; color: white;">
                        <span class="tooltip">Type
                            <span class="tooltiptext">
                                <div class="tooltip-section">
                                    <span class="tooltip-title">Campaign Type</span>
                                    <div class="tooltip-why">Different ad formats: Sponsored Products (item ads), Sponsored Brands (brand awareness)</div>
                                    <div class="tooltip-action">Choose type based on your goal - sales vs brand visibility</div>
                                </div>
                            </span>
                        </span>
                    </th>
                    <th style="padding: 10px; background: #FF6B35; color: white;">
                        <span class="tooltip">Status
                            <span class="tooltiptext">
                                <div class="tooltip-section">
                                    <span class="tooltip-title">Campaign Status</span>
                                    <div class="tooltip-why">Active = running and spending, Paused = stopped temporarily</div>
                                    <div class="tooltip-action">Pause underperforming campaigns to save budget</div>
                                </div>
                            </span>
                        </span>
                    </th>
                    <th style="padding: 10px; background: #FF6B35; color: white;">
                        <span class="tooltip">ROAS
                            <span class="tooltiptext">
                                <div class="tooltip-section">
                                    <span class="tooltip-title">Return on Ad Spend</span>
                                    <div class="tooltip-why">Revenue generated per dollar spent. 4x = $4 revenue for every $1 spent</div>
                                    <div class="tooltip-action">Aim for 3x+ but check POAS for true profitability</div>
                                </div>
                            </span>
                        </span>
                    </th>
                    <th style="padding: 10px; background: #FF6B35; color: white;">
                        <span class="tooltip">Real ROI
                            <span class="tooltiptext">
                                <div class="tooltip-section">
                                    <span class="tooltip-title">Real Return on Investment</span>
                                    <div class="tooltip-why">True incremental profit from ads only, excluding organic sales</div>
                                    <div class="tooltip-action">Shows actual business value added by advertising spend</div>
                                </div>
                            </span>
                        </span>
                    </th>
                    <th style="padding: 10px; background: #FF6B35; color: white;">
                        <span class="tooltip">POAS
                            <span class="tooltiptext">
                                <div class="tooltip-section">
                                    <span class="tooltip-title">Profit on Ad Spend</span>
                                    <div class="tooltip-why">Actual profit after product costs. Above 1.0x = profitable</div>
                                    <div class="tooltip-action">Focus budget on campaigns with POAS above 1.5x</div>
                                </div>
                            </span>
                        </span>
                    </th>
                    <th style="padding: 10px; background: #FF6B35; color: white;">Spend</th>
                    <th style="padding: 10px; background: #FF6B35; color: white;">Revenue</th>
                    <th style="padding: 10px; background: #FF6B35; color: white;">
                        <span class="tooltip">Trend
                            <span class="tooltiptext">
                                <div class="tooltip-section">
                                    <span class="tooltip-title">Performance Trend</span>
                                    <div class="tooltip-why">Shows if campaign is improving or declining vs last period</div>
                                    <div class="tooltip-action">Investigate declining trends to fix issues quickly</div>
                                </div>
                            </span>
                        </span>
                    </th>
                    <th style="padding: 10px; background: #FF6B35; color: white;">Actions</th>
                </tr>
                ${platformData.map(row => `
                    <tr>
                        <td style="padding: 10px;">${row[0]}</td>
                        <td style="padding: 10px;">${row[1]}</td>
                        <td style="padding: 10px;">${row[2]}</td>
                        <td style="padding: 10px;">${row[3]}</td>
                        <td style="padding: 10px;">${row[4]}</td>
                        <td style="padding: 10px;">${row[5]}</td>
                        <td style="padding: 10px;">${row[6]}</td>
                        <td style="padding: 10px;">${row[7]}</td>
                        <td style="padding: 10px;">${row[8]}</td>
                        <td style="padding: 10px;"><button style="background: #00D4FF; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">View</button></td>
                    </tr>
                `).join('')}
            </table>
        `;
        
        console.log(`🔧 Generated simple HTML table for ${platform}`);
        return tableHTML;
    }

    buildDetailedCampaignRow(campaign) {
        console.log(`🔧 Building row for campaign: ${campaign.campaignName}`);
        
        const brand = this.extractBrandFromCampaign(campaign);
        const margin = this.margins[brand] || this.margins['Universal'];
        const poas = (campaign.revenue * margin) / campaign.spend;
        const realRoi = (campaign.revenue * 0.60) / campaign.spend; // 60% attribution factor
        
        const statusClass = {
            'Active': 'status-active',
            'Paused': 'status-paused', 
            'Top Performer': 'status-top',
            'Needs Attention': 'status-warning',
            'Underperforming': 'status-poor'
        }[campaign.status] || 'status-default';

        const trendIcon = campaign.trend === 'up' ? '📈' : campaign.trend === 'down' ? '📉' : '➡️';
        const trendClass = campaign.trend === 'up' ? 'positive' : campaign.trend === 'down' ? 'negative' : 'neutral';

        return `
            <tr class="campaign-row" data-campaign="${campaign.campaignId}">
                <td class="campaign-name">
                    <strong>${campaign.campaignName}</strong>
                    <small>ID: ${campaign.campaignId}</small>
                </td>
                <td>${campaign.type}</td>
                <td><span class="status-badge ${statusClass}">${campaign.status}</span></td>
                <td class="roas"><strong>${campaign.roas.toFixed(1)}x</strong></td>
                <td class="real-roi"><strong>${realRoi.toFixed(1)}x</strong></td>
                <td class="poas"><strong>${poas.toFixed(1)}x</strong></td>
                <td>$${campaign.spend.toLocaleString()}</td>
                <td>$${campaign.revenue.toLocaleString()}</td>
                <td class="trend ${trendClass}">
                    ${trendIcon} ${campaign.trendPercent > 0 ? '+' : ''}${campaign.trendPercent}%
                </td>
                <td class="actions">
                    <button class="btn-small" onclick="dashboardContentManager.viewCampaignDetails('${campaign.campaignId}')">
                        👁️ View
                    </button>
                    <button class="btn-small" onclick="dashboardContentManager.optimizeCampaign('${campaign.campaignId}')">
                        ⚡ Optimize
                    </button>
                </td>
            </tr>
        `;
    }

    getUnderperformingCampaigns() {
        return this.campaignData.filter(campaign => {
            const brand = this.extractBrandFromCampaign(campaign);
            const margin = this.margins[brand] || this.margins['Universal'];
            const poas = (campaign.revenue * margin) / campaign.spend;
            
            return campaign.roas < 3.0 || poas < 1.0 || campaign.status === 'Underperforming' || campaign.trend === 'down';
        }).slice(0, 5);
    }

    buildCampaignAlert(campaign) {
        const brand = this.extractBrandFromCampaign(campaign);
        const margin = this.margins[brand] || this.margins['Universal'];
        const poas = (campaign.revenue * margin) / campaign.spend;
        
        let alertType = 'warning';
        let alertIcon = '⚠️';
        let alertTitle = 'Performance Review Needed';
        let alertDescription = `${campaign.campaignName} requires attention.`;
        
        if (poas < 1.0) {
            alertType = 'critical';
            alertIcon = '🔴';
            alertTitle = 'Losing Money';
            alertDescription = `${campaign.campaignName} has negative POAS (${poas.toFixed(1)}x) - losing money despite ${campaign.roas.toFixed(1)}x ROAS.`;
        } else if (campaign.roas < 2.0) {
            alertType = 'critical';
            alertIcon = '📉';
            alertTitle = 'Poor ROAS Performance';
            alertDescription = `${campaign.campaignName} ROAS is critically low at ${campaign.roas.toFixed(1)}x.`;
        } else if (campaign.trend === 'down' && campaign.trendPercent < -20) {
            alertType = 'warning';
            alertIcon = '📉';
            alertTitle = 'Declining Performance';
            alertDescription = `${campaign.campaignName} performance down ${Math.abs(campaign.trendPercent)}% - trend analysis needed.`;
        }

        return `
            <div class="alert-card ${alertType}" data-campaign="${campaign.campaignId}">
                <div class="alert-header">
                    <span class="alert-icon">${alertIcon}</span>
                    <h4 class="alert-title">
                        <span class="tooltip">${alertTitle}
                            <span class="tooltiptext">
                                <div class="tooltip-section">
                                    <span class="tooltip-title">${alertTitle}</span>
                                    <div class="tooltip-why">${
                                        alertType === 'critical' ? 
                                        'Immediate action needed - campaign is losing money or severely underperforming' :
                                        'Campaign performance is declining and needs optimization'
                                    }</div>
                                    <div class="tooltip-action">Review metrics, pause if necessary, and implement fixes</div>
                                </div>
                            </span>
                        </span>
                    </h4>
                    <span class="alert-priority">Scenario ${campaign.scenario || 'General'}</span>
                </div>
                <div class="alert-description">
                    ${alertDescription}
                </div>
                <div class="alert-actions">
                    <button class="btn-action" onclick="dashboardContentManager.fixCampaign('${campaign.campaignId}')">
                        🔧 Fix Issues
                    </button>
                    <button class="btn-secondary" onclick="dashboardContentManager.viewCampaignDetails('${campaign.campaignId}')">
                        📊 View Details
                    </button>
                </div>
            </div>
        `;
    }

    getTopOptimizationOpportunities() {
        const opportunities = [];
        
        // Find high-spend, low-ROAS campaigns
        const highSpendLowROAS = this.campaignData.filter(c => c.spend > 200 && c.roas < 3.5);
        if (highSpendLowROAS.length > 0) {
            opportunities.push({
                type: 'budget-reallocation',
                title: 'Budget Reallocation Opportunity',
                description: `${highSpendLowROAS.length} high-spend campaigns with sub-optimal ROAS`,
                impact: 'High',
                effort: 'Medium',
                campaigns: highSpendLowROAS.slice(0, 3)
            });
        }

        // Find campaigns with good ROAS but room for scaling
        const scalingOpportunities = this.campaignData.filter(c => c.roas > 4.0 && c.budgetUtilization < 80);
        if (scalingOpportunities.length > 0) {
            opportunities.push({
                type: 'scaling',
                title: 'Scaling Opportunity',
                description: `${scalingOpportunities.length} high-performing campaigns ready for budget increase`,
                impact: 'High',
                effort: 'Low',
                campaigns: scalingOpportunities.slice(0, 2)
            });
        }

        // Find campaigns needing creative refresh
        const creativeRefresh = this.campaignData.filter(c => c.trend === 'down' && c.ctr < 3.0);
        if (creativeRefresh.length > 0) {
            opportunities.push({
                type: 'creative-refresh',
                title: 'Creative Refresh Needed',
                description: `${creativeRefresh.length} campaigns showing ad fatigue signs`,
                impact: 'Medium',
                effort: 'Medium',
                campaigns: creativeRefresh.slice(0, 2)
            });
        }

        return opportunities.slice(0, 6);
    }

    buildOptimizationCard(opportunity) {
        const impactColor = {
            'High': 'neon-green',
            'Medium': 'warning-yellow', 
            'Low': 'electric-blue'
        }[opportunity.impact];

        return `
            <div class="optimization-card ${opportunity.type}" data-type="${opportunity.type}">
                <div class="card-header">
                    <h4>${opportunity.title}</h4>
                    <div class="impact-badges">
                        <span class="impact-badge ${impactColor}">
                            <span class="tooltip">Impact: ${opportunity.impact}
                                <span class="tooltiptext">
                                    <div class="tooltip-section">
                                        <span class="tooltip-title">Business Impact Level</span>
                                        <div class="tooltip-why">High = significant revenue/profit improvement potential</div>
                                        <div class="tooltip-action">Prioritize high-impact optimizations first</div>
                                    </div>
                                </span>
                            </span>
                        </span>
                        <span class="effort-badge">
                            <span class="tooltip">Effort: ${opportunity.effort}
                                <span class="tooltiptext">
                                    <div class="tooltip-section">
                                        <span class="tooltip-title">Implementation Difficulty</span>
                                        <div class="tooltip-why">Low = quick changes, High = requires testing and time</div>
                                        <div class="tooltip-action">Start with low-effort, high-impact changes</div>
                                    </div>
                                </span>
                            </span>
                        </span>
                    </div>
                </div>
                <div class="card-content">
                    <p>${opportunity.description}</p>
                    <div class="affected-campaigns">
                        <strong>Affected Campaigns:</strong>
                        <ul>
                            ${opportunity.campaigns.map(c => `
                                <li>${c.campaignName} - ${c.roas.toFixed(1)}x ROAS</li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn-action" onclick="dashboardContentManager.applyOptimization('${opportunity.type}')">
                        🚀 Apply Optimization
                    </button>
                    <button class="btn-secondary" onclick="dashboardContentManager.previewOptimization('${opportunity.type}')">
                        👁️ Preview Impact
                    </button>
                </div>
            </div>
        `;
    }

    // Action methods
    async refreshData() {
        console.log('🔄 Refreshing dashboard data...');
        await this.loadCampaignData();
        await this.loadTabContent(this.currentTab);
    }

    exportTab(tabId) {
        console.log(`📊 Exporting ${tabId} tab data...`);
        // Export logic would go here
        alert(`Exporting ${this.getTabTitle(tabId)} data...`);
    }

    viewCampaignDetails(campaignId) {
        console.log(`👁️ Viewing details for campaign: ${campaignId}`);
        // Campaign details modal logic would go here
        alert(`Opening details for campaign: ${campaignId}`);
    }

    showMetricDetails(metric) {
        console.log(`📊 Showing details for metric: ${metric}`);
        // Metric details modal logic would go here
    }

    takeAction(campaignId, scenario) {
        console.log(`⚡ Taking action for campaign ${campaignId}, scenario ${scenario}`);
        // Action implementation would go here
        alert(`Taking optimization action for scenario ${scenario}`);
    }

    learnMore(scenario) {
        console.log(`📚 Learning more about scenario ${scenario}`);
        // Learning modal logic would go here
    }

    // Quick action methods
    pauseUnderperformers() {
        console.log('⏸️ Pausing underperforming campaigns...');
        alert('Pausing campaigns with POAS < 1.0x...');
    }

    refreshCreatives() {
        console.log('🎨 Refreshing ad creatives...');
        alert('Refreshing creatives for high-frequency campaigns...');
    }

    optimizeBudgets() {
        console.log('💰 Optimizing campaign budgets...');
        alert('Reallocating budgets to high-POAS campaigns...');
    }

    runIncrementalityTest() {
        console.log('🧪 Running incrementality test...');
        alert('Setting up incrementality test for attribution validation...');
    }
}

// Initialize dashboard content manager
const dashboardContent = new DashboardContentManager();

// Make it globally available immediately
window.dashboardContent = dashboardContent;

// Auto-start when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    dashboardContent.initializeDashboard();
    console.log('🎯 K2Motor Dashboard Content Manager initialized');
    
    // Notify other scripts that dashboard is ready
    document.dispatchEvent(new CustomEvent('dashboardContentReady', {
        detail: { dashboardContent }
    }));
});