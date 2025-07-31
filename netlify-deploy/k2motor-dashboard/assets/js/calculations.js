/**
 * K2Motor Ad Optimization Dashboard - Calculation Engine
 * Handles derived metrics and advanced calculations for ad performance analysis
 */

/**
 * Calculate Profit on Ad Spend (POAS)
 * POAS = (Revenue - Product Cost) / Ad Spend
 * More accurate than ROAS as it accounts for actual profit margins
 */
function calculatePOAS(revenue, adSpend, productCost) {
    if (adSpend === 0) return 0;
    return (revenue - productCost) / adSpend;
}

/**
 * Calculate Incremental Lift from Attribution Analysis
 * Based on cross-brand control group methodology
 */
function calculateIncrementalLift(testProductData, controlProductData) {
    const testPerformance = testProductData.revenue / testProductData.salesVolume;
    const controlPerformance = controlProductData.revenue / controlProductData.salesVolume;
    
    if (controlPerformance === 0) return 0;
    
    const liftPercentage = (testPerformance - controlPerformance) / controlPerformance;
    return Math.max(0, liftPercentage); // Ensure non-negative lift
}

/**
 * Calculate True ROAS using attribution data
 * Removes organic boost to show real ad impact
 */
function calculateTrueROAS(apparentRevenue, adSpend, organicRevenue) {
    if (adSpend === 0) return 0;
    
    const trueAdRevenue = apparentRevenue - organicRevenue;
    return Math.max(0, trueAdRevenue) / adSpend;
}

/**
 * Calculate comprehensive attribution metrics
 * Uses cross-brand control group analysis
 */
function calculateAttributionMetrics(testProduct, controlProduct) {
    const lift = calculateIncrementalLift(testProduct, controlProduct);
    const trueAdRevenue = testProduct.revenue * lift;
    const organicBoost = testProduct.revenue - trueAdRevenue;
    const trueROAS = calculateTrueROAS(testProduct.revenue, testProduct.adSpend, organicBoost);
    
    return {
        incrementalLift: lift,
        liftPercentage: lift,
        trueAdRevenue: trueAdRevenue,
        organicBoost: organicBoost,
        trueROAS: trueROAS,
        apparentROAS: testProduct.revenue / testProduct.adSpend,
        attributionAccuracy: Math.min(0.95, 0.7 + (lift * 0.5)) // Higher lift = higher confidence
    };
}

/**
 * Calculate scenario-based performance alerts
 * Identifies optimization opportunities from the 10 scenarios
 */
function calculateScenarioAlerts(campaignData, attributionData, products) {
    const alerts = [];
    
    campaignData.forEach(campaign => {
        // Scenario 1: High ROAS but losing money (POAS check)
        if (campaign.roas > 3.5 && campaign.scenario === 1) {
            const product = products.find(p => p.sku === campaign.campaignId.replace(/[^A-Z0-9]/g, ''));
            if (product) {
                const poas = calculatePOAS(campaign.revenue, campaign.spend, product.cost * campaign.orders);
                if (poas < 1.0) {
                    alerts.push({
                        type: 'critical',
                        scenario: 1,
                        campaign: campaign.campaignName,
                        message: `High ROAS (${campaign.roas}x) but POAS only ${poas.toFixed(2)}x - losing money despite good performance`,
                        recommendation: 'Review product costs and pricing strategy'
                    });
                }
            }
        }
        
        // Scenario 2: Ad fatigue detection
        if (campaign.adFrequency && campaign.adFrequency > 6 && campaign.trend === 'down') {
            alerts.push({
                type: 'warning',
                scenario: 2,
                campaign: campaign.campaignName,
                message: `Ad fatigue detected - frequency ${campaign.adFrequency}, CTR down ${Math.abs(campaign.trendPercent)}%`,
                recommendation: 'Refresh ad creative or adjust audience targeting'
            });
        }
        
        // Scenario 3: Message mismatch (high bounce rate)
        if (campaign.bounceRate && campaign.bounceRate > 70) {
            alerts.push({
                type: 'warning',
                scenario: 3,
                campaign: campaign.campaignName,
                message: `High bounce rate ${campaign.bounceRate}% indicates message mismatch`,
                recommendation: 'Align ad copy with landing page content'
            });
        }
        
        // Scenario 4: Attribution discrepancies
        const attribution = attributionData.find(a => 
            a.testProduct.sku.includes(campaign.campaignId.split('-')[1])
        );
        if (attribution && attribution.trueROAS < attribution.apparentROAS * 0.7) {
            alerts.push({
                type: 'opportunity',
                scenario: 4,
                campaign: campaign.campaignName,
                message: `Attribution shows ${attribution.apparentROAS.toFixed(2)}x apparent vs ${attribution.trueROAS.toFixed(2)}x true ROAS`,
                recommendation: 'Investigate organic boost and adjust attribution model'
            });
        }
    });
    
    return alerts;
}

/**
 * Calculate overall dashboard KPIs
 * Aggregates performance across all campaigns and platforms
 */
function calculateDashboardKPIs(campaigns, attribution, products) {
    const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
    const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
    const totalOrders = campaigns.reduce((sum, c) => sum + c.orders, 0);
    
    // Calculate weighted average POAS
    let totalPOAS = 0;
    let poasWeight = 0;
    
    campaigns.forEach(campaign => {
        const product = products.find(p => p.asin === campaign.campaignId || 
                                           p.sku.split('-')[2] === campaign.campaignId.split('-')[1]);
        if (product && campaign.spend > 0) {
            const poas = calculatePOAS(campaign.revenue, campaign.spend, product.cost * campaign.orders);
            totalPOAS += poas * campaign.spend;
            poasWeight += campaign.spend;
        }
    });
    
    const avgPOAS = poasWeight > 0 ? totalPOAS / poasWeight : 0;
    
    // Calculate true ROAS from attribution data
    const totalTrueRevenue = attribution.reduce((sum, a) => sum + a.attributionResults.trueAdRevenue, 0);
    const attributionSpend = attribution.reduce((sum, a) => sum + a.testProduct.adSpend, 0);
    const trueROAS = attributionSpend > 0 ? totalTrueRevenue / attributionSpend : 0;
    
    return {
        totalSpend: totalSpend,
        totalRevenue: totalRevenue,
        totalOrders: totalOrders,
        overallROAS: totalSpend > 0 ? totalRevenue / totalSpend : 0,
        overallPOAS: avgPOAS,
        trueROAS: trueROAS,
        avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        activeCampaigns: campaigns.filter(c => c.status === 'Active').length,
        profitableCampaigns: campaigns.filter(c => {
            const product = products.find(p => p.asin === c.campaignId || 
                                               p.sku.split('-')[2] === c.campaignId.split('-')[1]);
            if (!product) return false;
            const poas = calculatePOAS(c.revenue, c.spend, product.cost * c.orders);
            return poas > 1.0;
        }).length
    };
}

// Export functions for use in dashboard
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculatePOAS,
        calculateIncrementalLift,
        calculateTrueROAS,
        calculateAttributionMetrics,
        calculateScenarioAlerts,
        calculateDashboardKPIs
    };
}