/**
 * K2Motor Dashboard - Scenario-Based Alert System
 * Handles the 10 advanced ad optimization scenarios with interactive popups
 */

class ScenarioAlertSystem {
    constructor() {
        this.alerts = [];
        this.activePopup = null;
        this.init();
    }

    init() {
        this.setupEventHandlers();
        this.generateScenarioAlerts();
    }

    setupEventHandlers() {
        // Close popup when clicking overlay
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('popup-overlay')) {
                this.closePopup();
            }
        });

        // Close popup with escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closePopup();
            }
        });
    }

    generateScenarioAlerts() {
        // Get data from global metrics calculator
        const campaigns = window.dashboardData?.campaign_data || [];
        const attribution = window.dashboardData?.attribution_data || [];
        const products = window.dashboardData?.sports_car_products || [];

        this.alerts = [];

        campaigns.forEach(campaign => {
            const alerts = this.detectScenarios(campaign, attribution, products);
            this.alerts.push(...alerts);
        });

        // Display alerts in the dashboard
        this.displayAlerts();
        
        console.log(`🚨 Generated ${this.alerts.length} scenario alerts`);
    }

    detectScenarios(campaign, attributionData, products) {
        const alerts = [];

        // Scenario 1: High ROAS but losing money (POAS check)
        if (campaign.roas > 3.5 && campaign.scenario === 1) {
            const product = products.find(p => 
                campaign.campaignName.toLowerCase().includes(p.vehicle_brand.toLowerCase().split(' ')[0])
            );
            
            if (product && campaign.orders > 0) {
                const productCost = product.cost * campaign.orders;
                const poas = (campaign.revenue - productCost) / campaign.spend;
                
                if (poas < 1.0) {
                    alerts.push({
                        type: 'alert-critical',
                        scenario: 1,
                        title: 'High ROAS but Losing Money',
                        message: `Campaign "${campaign.campaignName}" shows ${campaign.roas.toFixed(2)}x ROAS but POAS is only ${poas.toFixed(2)}x`,
                        details: `K2Motor Performance Parts: Despite good apparent performance, actual profit margins are negative. Product cost: $${productCost.toLocaleString()}, Revenue: $${campaign.revenue.toLocaleString()}, Spend: $${campaign.spend.toLocaleString()}`,
                        actions: ['Review Costs', 'Adjust Pricing', 'Optimize Targeting'],
                        priority: 'critical'
                    });
                }
            }
        }

        // Scenario 2: Ad fatigue detection
        if (campaign.adFrequency && campaign.adFrequency > 6 && campaign.trend === 'down' && campaign.scenario === 2) {
            alerts.push({
                type: 'alert-warning',
                scenario: 2,
                title: 'Ad Fatigue Crisis',
                message: `${campaign.platform} campaign frequency at ${campaign.adFrequency.toFixed(1)}x, CTR dropped ${Math.abs(campaign.trendPercent)}%`,
                details: `Sports car enthusiasts have seen your Performance Parts ads too many times. Current frequency of ${campaign.adFrequency.toFixed(1)}x is well above the recommended 3-4x threshold. CTR decline indicates audience fatigue.`,
                actions: ['Refresh Creative', 'Adjust Audience', 'Reduce Frequency'],
                priority: 'warning'
            });
        }

        // Scenario 3: Message mismatch (high bounce rate)
        if (campaign.bounceRate && campaign.bounceRate > 70 && campaign.scenario === 3) {
            alerts.push({
                type: 'alert-warning',
                scenario: 3,
                title: 'Message Mismatch Detected',
                message: `High bounce rate ${campaign.bounceRate}% indicates ad-to-landing disconnect`,
                details: `Users clicking on Performance Parts ads are not finding what they expect on the landing page. This suggests a mismatch between ad creative/copy and the actual product page content.`,
                actions: ['Review Landing Page', 'Align Ad Copy', 'Test New Creative'],
                priority: 'warning'
            });
        }

        // Scenario 4: Attribution discrepancies
        const attribution = attributionData.find(a => 
            campaign.campaignName.toLowerCase().includes(a.testProduct.brand?.toLowerCase().split(' ')[0])
        );
        
        if (attribution && attribution.attributionResults && campaign.scenario === 4) {
            const apparentROAS = attribution.attributionResults.apparentROAS || campaign.roas;
            const trueROAS = attribution.attributionResults.trueROAS;
            
            if (trueROAS < apparentROAS * 0.7) {
                alerts.push({
                    type: 'alert-opportunity',
                    scenario: 4,
                    title: 'Attribution Mystery',
                    message: `Shows ${apparentROAS.toFixed(2)}x apparent vs ${trueROAS.toFixed(2)}x true ROAS`,
                    details: `Honda vs Toyota cross-brand analysis reveals significant organic boost. True ad impact is lower than apparent performance suggests. This is common in Performance Parts where brand searches increase after exposure.`,
                    actions: ['Run Attribution', 'Honda vs Toyota Analysis', 'Adjust Attribution Model'],
                    priority: 'opportunity'
                });
            }
        }

        // Scenario 7: Video ad opportunity (strong performers)
        if (campaign.roas > 4.0 && campaign.trend === 'up' && campaign.scenario === 7) {
            alerts.push({
                type: 'alert-opportunity',
                scenario: 7,
                title: 'Video Ad Opportunity',
                message: `Strong performer - test video ads for even better results`,
                details: `Campaign "${campaign.campaignName}" is performing exceptionally well with ${campaign.roas.toFixed(2)}x ROAS. Performance Parts benefit greatly from video demonstrations showing installation and performance gains.`,
                actions: ['Create Video Ads', 'Test Video Creative', 'Expand Budget'],
                priority: 'opportunity'
            });
        }

        return alerts;
    }

    displayAlerts() {
        const alertsContainer = document.querySelector('.alerts-container');
        if (!alertsContainer) return;

        // Clear existing alerts
        alertsContainer.innerHTML = '';

        // Sort alerts by priority
        const sortedAlerts = this.alerts.sort((a, b) => {
            const priorityOrder = { critical: 3, warning: 2, opportunity: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });

        // Display up to 6 alerts
        sortedAlerts.slice(0, 6).forEach(alert => {
            const alertElement = this.createAlertElement(alert);
            alertsContainer.appendChild(alertElement);
        });

        // Update alert count
        const alertCount = document.querySelector('.alert-count');
        if (alertCount) {
            alertCount.textContent = `${this.alerts.length} active alerts detected`;
        }
    }

    createAlertElement(alert) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert-card ${alert.type}`;
        alertDiv.dataset.scenario = alert.scenario;

        alertDiv.innerHTML = `
            <div class="alert-icon">${this.getAlertIcon(alert.type)}</div>
            <div class="alert-content">
                <h4>${alert.title}</h4>
                <p>${alert.message}</p>
                <div class="alert-actions">
                    ${alert.actions.map(action => 
                        `<button class="btn-primary" onclick="scenarioAlerts.handleAction('${action}', ${alert.scenario})">${action}</button>`
                    ).join('')}
                    <button class="btn-secondary" onclick="scenarioAlerts.showAlertPopup(${alert.scenario})">View Details</button>
                </div>
            </div>
        `;

        return alertDiv;
    }

    getAlertIcon(type) {
        const icons = {
            'alert-critical': '🔴',
            'alert-warning': '🟡', 
            'alert-opportunity': '🟢'
        };
        return icons[type] || '⚠️';
    }

    showAlertPopup(scenarioId) {
        const alert = this.alerts.find(a => a.scenario === scenarioId);
        if (!alert) return;

        // Create popup overlay
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';
        
        overlay.innerHTML = `
            <div class="popup-content scenario-popup">
                <div class="popup-header">
                    <h3>${alert.title} - Scenario ${alert.scenario}</h3>
                    <button class="close-btn" onclick="scenarioAlerts.closePopup()">×</button>
                </div>
                <div class="popup-body">
                    <div class="scenario-details">
                        <h4>What's Happening:</h4>
                        <p>${alert.message}</p>
                        
                        <h4>K2Motor Performance Parts Analysis:</h4>
                        <p>${alert.details}</p>
                        
                        <h4>Recommended Actions:</h4>
                        <div class="action-buttons">
                            ${alert.actions.map(action => 
                                `<button class="btn-action" onclick="scenarioAlerts.handleAction('${action}', ${alert.scenario})">${action}</button>`
                            ).join('')}
                        </div>
                        
                        <div class="scenario-learning">
                            <h4>Why This Matters for Sports Car Parts:</h4>
                            <p>${this.getScenarioExplanation(alert.scenario)}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        this.activePopup = overlay;

        // Fade in animation
        setTimeout(() => overlay.classList.add('active'), 10);
    }

    getScenarioExplanation(scenarioId) {
        const explanations = {
            1: "Performance Parts have complex profit margins. A turbo kit might have high revenue but significant manufacturing and shipping costs. Always verify true profitability beyond surface ROAS metrics.",
            2: "Car enthusiasts are sophisticated audiences who quickly notice repetitive ads. Fresh creative showcasing different vehicles or installation scenarios keeps engagement high.",
            3: "Performance Parts buyers need detailed specifications and compatibility info. If your ad promises 'bolt-on performance' but the landing page lacks technical details, expect high bounce rates.",
            4: "Honda vs Toyota comparison reveals organic search lift. When someone sees your Civic Type R brake ad, they might also search for general 'performance brakes' organically, inflating apparent ROAS.",
            7: "Video content showing dyno results, installation process, or before/after sound clips dramatically increase conversion rates for Performance Parts. Visual proof is crucial for high-ticket modifications."
        };
        return explanations[scenarioId] || "This scenario requires careful analysis of Performance Parts market dynamics.";
    }

    handleAction(action, scenarioId) {
        console.log(`🎯 Action triggered: ${action} for scenario ${scenarioId}`);
        
        // Simulate action handling
        const actionMessages = {
            'Review Costs': 'Opening cost analysis dashboard...',
            'Refresh Creative': 'Launching creative testing interface...',
            'Run Attribution': 'Starting Honda vs Toyota attribution analysis...',
            'Honda vs Toyota Analysis': 'Initializing cross-brand control group study...',
            'Adjust Pricing': 'Opening pricing optimization tools...',
            'Create Video Ads': 'Launching video ad creation wizard...'
        };

        const message = actionMessages[action] || `Executing ${action}...`;
        
        // Show action feedback
        this.showActionFeedback(message);
        
        // Close popup after action
        setTimeout(() => this.closePopup(), 1500);
    }

    showActionFeedback(message) {
        const feedback = document.createElement('div');
        feedback.className = 'action-feedback';
        feedback.textContent = message;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.classList.add('fade-out');
            setTimeout(() => feedback.remove(), 300);
        }, 2000);
    }

    closePopup() {
        if (this.activePopup) {
            this.activePopup.classList.add('fade-out');
            setTimeout(() => {
                if (this.activePopup) {
                    this.activePopup.remove();
                    this.activePopup = null;
                }
            }, 300);
        }
    }

    refreshAlerts() {
        console.log('🔄 Refreshing scenario alerts...');
        this.generateScenarioAlerts();
    }
}

// Global functions for button handlers
function displayAlert(alert) {
    if (window.scenarioAlerts) {
        window.scenarioAlerts.displayAlert(alert);
    }
}

function showAlertPopup(scenarioId) {
    if (window.scenarioAlerts) {
        window.scenarioAlerts.showAlertPopup(scenarioId);
    }
}

// Initialize scenario alerts system
// Temporarily disabled to avoid conflict with dashboard-content.js optimization alerts
// document.addEventListener('DOMContentLoaded', () => {
//     setTimeout(() => {
//         window.scenarioAlerts = new ScenarioAlertSystem();
//     }, 1500); // Wait for data to load
// });

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ScenarioAlertSystem,
        displayAlert,
        showAlertPopup
    };
}