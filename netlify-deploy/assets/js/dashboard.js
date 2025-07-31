/**
 * K2Motor Dashboard - Main Dashboard Logic
 * Handles tab switching, data loading, and UI interactions
 */

class K2MotorDashboard {
    constructor() {
        this.currentTab = 'overview';
        this.data = {};
        this.calculations = {};
        
        this.init();
    }
    
    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.setupTabSwitching();
        this.renderCurrentTab();
    }
    
    async loadData() {
        try {
            // Load all mock data files
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
            
            // Calculate derived metrics
            this.calculations = this.calculateMetrics();
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }
    
    calculateMetrics() {
        if (typeof calculateDashboardKPIs === 'function') {
            return calculateDashboardKPIs(
                this.data.campaign_data || [],
                this.data.attribution_data || [],
                this.data.sports_car_products || []
            );
        }
        return {};
    }
    
    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.closest('.nav-tab').dataset.tab;
                this.switchTab(tabName);
            });
        });
        
        // Guided tour button
        const tourBtn = document.querySelector('.guided-tour-btn');
        if (tourBtn) {
            tourBtn.addEventListener('click', () => this.startGuidedTour());
        }
    }
    
    setupTabSwitching() {
        // Set up tab switching functionality
        const tabs = document.querySelectorAll('.nav-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                // Add active class to clicked tab
                tab.classList.add('active');
            });
        });
    }
    
    switchTab(tabName) {
        this.currentTab = tabName;
        this.renderCurrentTab();
    }
    
    renderCurrentTab() {
        const content = document.getElementById('tab-content');
        if (!content) return;
        
        // Show loading while rendering
        content.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Loading tab content...</p></div>';
        
        // Simulate async loading
        setTimeout(() => {
            switch (this.currentTab) {
                case 'overview':
                    content.innerHTML = this.renderOverviewTab();
                    break;
                case 'campaigns':
                    content.innerHTML = this.renderCampaignsTab();
                    break;
                case 'budget':
                    content.innerHTML = this.renderBudgetTab();
                    break;
                case 'attribution':
                    content.innerHTML = this.renderAttributionTab();
                    break;
                default:
                    content.innerHTML = '<div class="error">Tab not found</div>';
            }
        }, 500);
    }
    
    renderOverviewTab() {
        return `
            <div class="tab-panel" data-tab="overview">
                <h2>Ad Performance Overview</h2>
                <div class="metrics-grid">
                    <div class="metric-card">
                        <h3>Total Ad Spend</h3>
                        <div class="metric-value">$${(this.calculations.totalSpend || 0).toLocaleString()}</div>
                    </div>
                    <div class="metric-card">
                        <h3>Total Revenue</h3>
                        <div class="metric-value">$${(this.calculations.totalRevenue || 0).toLocaleString()}</div>
                    </div>
                    <div class="metric-card">
                        <h3>Overall ROAS</h3>
                        <div class="metric-value">${(this.calculations.overallROAS || 0).toFixed(2)}x</div>
                    </div>
                    <div class="metric-card">
                        <h3>True ROAS</h3>
                        <div class="metric-value">${(this.calculations.trueROAS || 0).toFixed(2)}x</div>
                    </div>
                </div>
                <div class="charts-section">
                    <div class="chart-placeholder">Performance Charts Coming Soon</div>
                </div>
            </div>
        `;
    }
    
    renderCampaignsTab() {
        return `
            <div class="tab-panel" data-tab="campaigns">
                <h2>Campaign Deep Dive</h2>
                <div class="campaigns-table">
                    <p>Campaign analysis with cross-brand attribution...</p>
                </div>
            </div>
        `;
    }
    
    renderBudgetTab() {
        return `
            <div class="tab-panel" data-tab="budget">
                <h2>Budget Optimization</h2>
                <div class="budget-tools">
                    <p>POAS-based budget reallocation tools...</p>
                </div>
            </div>
        `;
    }
    
    renderAttributionTab() {
        return `
            <div class="tab-panel" data-tab="attribution">
                <h2>Advanced Attribution</h2>
                <div class="attribution-analysis">
                    <p>Honda vs Toyota cross-brand control group analysis...</p>
                </div>
            </div>
        `;
    }
    
    startGuidedTour() {
        if (typeof GuidedTour !== 'undefined') {
            new GuidedTour().start();
        } else {
            alert('Welcome to K2Motor Ad Optimization Dashboard! This is a demo showcasing advanced ad spend optimization for high-performance sports car parts.');
        }
    }
}

// Dashboard initialization is handled by dashboard-content.js to prevent conflicts
// This legacy system is disabled to avoid duplicate tab handling
console.log('📋 Dashboard.js: Disabled - using dashboard-content.js system instead');

// Uncomment below only if dashboard-content.js is not available
// document.addEventListener('DOMContentLoaded', () => {
//     new K2MotorDashboard();
// });