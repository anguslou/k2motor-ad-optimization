/**
 * K2Motor Dashboard - Metrics Calculations
 * Handles real-time metric calculations and display updates
 */

class MetricsCalculator {
    constructor() {
        this.data = {};
        this.updateInterval = null;
        this.init();
    }

    async init() {
        await this.loadRealTimeData();
        this.calculateOverviewMetrics();
        this.updateMetricsDisplay();
        this.startRealTimeUpdates();
    }

    async loadRealTimeData() {
        try {
            // Load all data sources
            const dataFiles = [
                'amazon-performance.json',
                'ebay-listings.json',
                'campaign-data.json',
                'attribution-data.json',
                'sports-car-products.json'
            ];

            for (const file of dataFiles) {
                const response = await fetch(`assets/data/${file}`);
                const data = await response.json();
                const key = file.replace('.json', '').replace(/-/g, '_');
                this.data[key] = data;
            }

            console.log('✅ Real-time data loaded successfully');
        } catch (error) {
            console.error('❌ Error loading real-time data:', error);
            // Use fallback data for demo
            this.loadFallbackData();
        }
    }

    loadFallbackData() {
        // Fallback data for demo purposes
        this.data = {
            amazon_performance: [],
            ebay_listings: [],
            campaign_data: [],
            attribution_data: [],
            sports_car_products: []
        };
    }

    calculateOverviewMetrics() {
        const campaigns = this.data.campaign_data || [];
        const amazonData = this.data.amazon_performance || [];
        const ebayData = this.data.ebay_listings || [];
        const attributionData = this.data.attribution_data || [];
        const products = this.data.sports_car_products || [];

        // Calculate totals from campaign data
        const totalSpend = campaigns.reduce((sum, campaign) => sum + (campaign.spend || 0), 0);
        const totalRevenue = campaigns.reduce((sum, campaign) => sum + (campaign.revenue || 0), 0);
        const totalOrders = campaigns.reduce((sum, campaign) => sum + (campaign.orders || 0), 0);
        const totalClicks = campaigns.reduce((sum, campaign) => sum + (campaign.clicks || 0), 0);
        const totalImpressions = campaigns.reduce((sum, campaign) => sum + (campaign.impressions || 0), 0);

        // Calculate core metrics
        const overallROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;
        const overallACoS = totalRevenue > 0 ? (totalSpend / totalRevenue) * 100 : 0;
        const overallCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

        // Calculate True ROAS using attribution data
        let trueRevenue = 0;
        let attributionSpend = 0;
        
        attributionData.forEach(attr => {
            if (attr.attributionResults) {
                trueRevenue += attr.attributionResults.trueAdRevenue || 0;
                attributionSpend += attr.testProduct.adSpend || 0;
            }
        });
        
        const trueROAS = attributionSpend > 0 ? trueRevenue / attributionSpend : 0;

        // Calculate POAS (Profit on Ad Spend)
        let totalPOAS = 0;
        let poasWeight = 0;

        campaigns.forEach(campaign => {
            const product = products.find(p => {
                return p.sku.includes(campaign.campaignId.split('-')[1]) || 
                       campaign.campaignName.toLowerCase().includes(p.vehicle_brand.toLowerCase().split(' ')[0]);
            });
            
            if (product && campaign.spend > 0 && campaign.orders > 0) {
                const productCost = product.cost * campaign.orders;
                if (typeof calculatePOAS === 'function') {
                    const campaignPOAS = calculatePOAS(campaign.revenue, campaign.spend, productCost);
                    totalPOAS += campaignPOAS * campaign.spend;
                    poasWeight += campaign.spend;
                }
            }
        });

        const overallPOAS = poasWeight > 0 ? totalPOAS / poasWeight : 0;

        // Calculate platform-specific metrics
        const platformMetrics = this.calculatePlatformMetrics();

        // Store calculated metrics
        this.metrics = {
            totalSpend: totalSpend,
            totalRevenue: totalRevenue,
            totalOrders: totalOrders,
            overallROAS: overallROAS,
            trueROAS: trueROAS,
            overallPOAS: overallPOAS,
            overallACoS: overallACoS,
            overallCTR: overallCTR,
            activeCampaigns: campaigns.filter(c => c.status === 'Active').length,
            platformMetrics: platformMetrics,
            lastUpdated: new Date().toLocaleTimeString()
        };

        return this.metrics;
    }

    calculatePlatformMetrics() {
        const campaigns = this.data.campaign_data || [];
        const platforms = ['Amazon', 'eBay', 'Google Ads', 'Facebook'];
        const platformMetrics = {};

        platforms.forEach(platform => {
            const platformCampaigns = campaigns.filter(c => 
                c.platform === platform || 
                (platform === 'Google Ads' && c.platform === 'Google')
            );

            const spend = platformCampaigns.reduce((sum, c) => sum + (c.spend || 0), 0);
            const revenue = platformCampaigns.reduce((sum, c) => sum + (c.revenue || 0), 0);
            const orders = platformCampaigns.reduce((sum, c) => sum + (c.orders || 0), 0);
            const roas = spend > 0 ? revenue / spend : 0;

            platformMetrics[platform.toLowerCase().replace(' ', '')] = {
                spend: spend,
                revenue: revenue,
                orders: orders,
                roas: roas,
                campaigns: platformCampaigns.length
            };
        });

        return platformMetrics;
    }

    updateMetricsDisplay() {
        if (!this.metrics) return;

        // Update main metric cards
        this.updateElement('total-spend', `$${this.formatNumber(this.metrics.totalSpend)}`);
        this.updateElement('total-revenue', `$${this.formatNumber(this.metrics.totalRevenue)}`);
        this.updateElement('overall-roas', `${this.metrics.overallROAS.toFixed(2)}x`);
        this.updateElement('true-roas', `${this.metrics.trueROAS.toFixed(2)}x`);
        this.updateElement('poas', `${this.metrics.overallPOAS.toFixed(2)}x`);
        this.updateElement('active-campaigns', this.metrics.activeCampaigns.toString());
        this.updateElement('last-update-time', this.metrics.lastUpdated);

        // Update platform metrics
        this.updatePlatformMetrics();

        // Add visual indicators for performance
        this.updatePerformanceIndicators();

        console.log('📊 Metrics display updated', this.metrics);
    }

    updatePlatformMetrics() {
        const platforms = ['amazon', 'ebay', 'google', 'facebook'];
        
        platforms.forEach(platform => {
            const metrics = this.metrics.platformMetrics[platform];
            if (metrics) {
                const card = document.querySelector(`.platform-card.${platform}`);
                if (card) {
                    const roasElement = card.querySelector('.metric .value');
                    const spendElements = card.querySelectorAll('.metric .value');
                    const revenueElements = card.querySelectorAll('.metric .value');

                    if (roasElement) roasElement.textContent = `${metrics.roas.toFixed(2)}x`;
                    if (spendElements[1]) spendElements[1].textContent = `$${this.formatNumber(metrics.spend, true)}`;
                    if (revenueElements[2]) revenueElements[2].textContent = `$${this.formatNumber(metrics.revenue, true)}`;
                }
            }
        });
    }

    updatePerformanceIndicators() {
        // Add performance indicators based on targets
        const roasTarget = DASHBOARD_CONFIG?.company_info?.target_roas || 4.2;
        const roasElement = document.getElementById('overall-roas');
        
        if (roasElement && this.metrics.overallROAS) {
            const parent = roasElement.parentElement;
            const changeElement = parent.querySelector('.metric-change');
            
            if (changeElement) {
                const performance = this.metrics.overallROAS >= roasTarget ? 'positive' : 'negative';
                const difference = (this.metrics.overallROAS - roasTarget).toFixed(2);
                
                changeElement.className = `metric-change ${performance}`;
                changeElement.textContent = `${difference > 0 ? '+' : ''}${difference}x vs target (${roasTarget}x)`;
            }
        }

        // Update POAS indicator
        const poasElement = document.getElementById('poas');
        if (poasElement && this.metrics.overallPOAS) {
            const parent = poasElement.parentElement;
            const changeElement = parent.querySelector('.metric-change');
            
            if (changeElement) {
                const status = this.metrics.overallPOAS > 1.0 ? 'Profitable' : 'Review needed';
                const color = this.metrics.overallPOAS > 1.0 ? '#10b981' : '#f59e0b';
                changeElement.textContent = `${status} - True profit consideration`;
                changeElement.style.color = color;
            }
        }
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    formatNumber(num, abbreviated = false) {
        if (abbreviated && num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toLocaleString();
    }

    refreshMetrics() {
        console.log('🔄 Refreshing metrics...');
        this.loadRealTimeData().then(() => {
            this.calculateOverviewMetrics();
            this.updateMetricsDisplay();
        });
    }

    startRealTimeUpdates() {
        // Update metrics every 5 minutes in demo mode
        this.updateInterval = setInterval(() => {
            this.refreshMetrics();
        }, 300000); // 5 minutes

        console.log('⏰ Real-time updates started (5min interval)');
    }

    stopRealTimeUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
            console.log('⏹️ Real-time updates stopped');
        }
    }
}

// Global function to refresh data (called by refresh button)
function refreshData() {
    if (window.metricsCalculator) {
        window.metricsCalculator.refreshMetrics();
    }
}

// Initialize metrics calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for dashboard to load first
    setTimeout(() => {
        window.metricsCalculator = new MetricsCalculator();
    }, 1000);
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MetricsCalculator,
        refreshData
    };
}