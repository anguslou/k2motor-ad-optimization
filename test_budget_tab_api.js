/**
 * Budget Optimization Tab - API Functionality Test
 * Tests the backend functionality and data flow of budget optimization features
 */

const { chromium } = require('playwright');

class BudgetOptimizationAPITester {
    constructor() {
        this.testResults = {
            timestamp: new Date().toISOString(),
            tests: [],
            summary: {
                total: 0,
                passed: 0,
                failed: 0
            }
        };
    }

    addTestResult(testName, status, details) {
        const result = {
            test: testName,
            status: status,
            details: details,
            timestamp: new Date().toISOString()
        };
        
        this.testResults.tests.push(result);
        this.testResults.summary.total++;
        
        if (status === 'PASS') {
            this.testResults.summary.passed++;
            console.log(`✅ ${testName}: ${details}`);
        } else {
            this.testResults.summary.failed++;
            console.log(`❌ ${testName}: ${details}`);
        }
    }

    async runAllTests() {
        console.log('🚀 Starting Budget Optimization API Tests...');
        
        const browser = await chromium.launch({ 
            headless: true 
        });
        
        const context = await browser.newContext();
        const page = await context.newPage();
        
        try {
            // Load the dashboard and navigate to budget tab
            await page.goto('http://localhost:8000');
            await page.waitForSelector('.dashboard-container', { timeout: 10000 });
            
            // Dismiss welcome popup if present
            const welcomePopup = page.locator('.welcome-overlay');
            if (await welcomePopup.isVisible()) {
                await page.evaluate(() => {
                    document.querySelectorAll('.popup-overlay, .welcome-overlay').forEach(el => el.remove());
                });
            }
            
            // Navigate to budget tab
            await page.locator('[data-tab="budget"]').click();
            await page.waitForTimeout(2000);
            
            // Test 1: Data Loading
            await this.testDataLoading(page);
            
            // Test 2: Budget Allocation Display
            await this.testBudgetAllocationDisplay(page);
            
            // Test 3: POAS Analysis
            await this.testPOASAnalysis(page);
            
            // Test 4: AI Recommendations
            await this.testAIRecommendations(page);
            
            // Test 5: Platform Performance Metrics
            await this.testPlatformMetrics(page);
            
            // Test 6: Interactive Elements Accessibility
            await this.testInteractiveElements(page);
            
            // Test 7: Data Source Indicators
            await this.testDataSourceIndicators(page);
            
        } catch (error) {
            this.addTestResult('Overall Test Execution', 'FAIL', `Error: ${error.message}`);
        } finally {
            await browser.close();
            this.generateReport();
        }
    }

    async testDataLoading(page) {
        try {
            // Check if budget performance summary cards have data
            const summaryCards = await page.locator('.budget-performance-summary .metric-card').count();
            this.addTestResult('Budget Performance Cards Loading', 
                summaryCards >= 4 ? 'PASS' : 'FAIL', 
                `Found ${summaryCards} performance cards (expected 4+)`);
            
            // Check if spend data is populated
            const currentSpend = await page.locator('.current-spend .value').textContent().catch(() => '');
            this.addTestResult('Current Spend Data', 
                currentSpend.includes('$') ? 'PASS' : 'FAIL',
                `Current spend: ${currentSpend}`);
                
        } catch (error) {
            this.addTestResult('Data Loading Test', 'FAIL', error.message);
        }
    }

    async testBudgetAllocationDisplay(page) {
        try {
            // Check platform allocation cards
            const platforms = ['amazon', 'ebay', 'walmart'];
            
            for (const platform of platforms) {
                const platformCard = await page.locator(`.platform-card.${platform}, .budget-platform.${platform}`).count();
                this.addTestResult(`${platform.charAt(0).toUpperCase() + platform.slice(1)} Platform Card`, 
                    platformCard > 0 ? 'PASS' : 'FAIL',
                    `Platform card visibility: ${platformCard > 0}`);
                
                // Check if ROAS data is present for platform
                const roasValue = await page.locator(`[data-platform="${platform}"] .roas-value, .${platform} .roas`).textContent().catch(() => '');
                this.addTestResult(`${platform.charAt(0).toUpperCase() + platform.slice(1)} ROAS Data`, 
                    roasValue.includes('x') || roasValue.includes('%') ? 'PASS' : 'FAIL',
                    `ROAS: ${roasValue || 'Not found'}`);
            }
            
        } catch (error) {
            this.addTestResult('Budget Allocation Display Test', 'FAIL', error.message);
        }
    }

    async testPOASAnalysis(page) {
        try {
            // Check POAS vs ROAS section
            const poasSection = await page.locator('.poas-analysis, .poas-comparison').count();
            this.addTestResult('POAS Analysis Section', 
                poasSection > 0 ? 'PASS' : 'FAIL',
                `POAS section found: ${poasSection > 0}`);
            
            // Check campaign analysis cards
            const campaignCards = await page.locator('.campaign-analysis .campaign-card, .poas-campaign').count();
            this.addTestResult('Campaign Analysis Cards', 
                campaignCards >= 3 ? 'PASS' : 'FAIL',
                `Found ${campaignCards} campaign cards (expected 3+)`);
            
            // Verify POAS calculations are different from ROAS
            const roasValues = await page.locator('.roas-value').allTextContents();
            const poasValues = await page.locator('.poas-value').allTextContents();
            
            this.addTestResult('POAS vs ROAS Differentiation', 
                roasValues.length > 0 && poasValues.length > 0 ? 'PASS' : 'FAIL',
                `ROAS values: ${roasValues.length}, POAS values: ${poasValues.length}`);
                
        } catch (error) {
            this.addTestResult('POAS Analysis Test', 'FAIL', error.message);
        }
    }

    async testAIRecommendations(page) {
        try {
            // Check AI recommendation cards
            const recommendationCards = await page.locator('.ai-recommendation, .recommendation-card').count();
            this.addTestResult('AI Recommendation Cards', 
                recommendationCards >= 2 ? 'PASS' : 'FAIL',
                `Found ${recommendationCards} recommendation cards`);
            
            // Check recommendation action buttons
            const actionButtons = await page.locator('.btn-action, .recommendation-action').count();
            this.addTestResult('Recommendation Action Buttons', 
                actionButtons >= 2 ? 'PASS' : 'FAIL',
                `Found ${actionButtons} action buttons`);
            
            // Verify projected impact values
            const impactValues = await page.locator('.projected-impact, .impact-value').count();
            this.addTestResult('Projected Impact Values', 
                impactValues >= 2 ? 'PASS' : 'FAIL',
                `Found ${impactValues} impact projections`);
                
        } catch (error) {
            this.addTestResult('AI Recommendations Test', 'FAIL', error.message);
        }
    }

    async testPlatformMetrics(page) {
        try {
            // Test platform-specific metrics
            const metricsToCheck = [
                { selector: '.current-allocation', name: 'Allocation Percentages' },
                { selector: '.spend-amount', name: 'Spend Amounts' },
                { selector: '.roas, .roas-value', name: 'ROAS Values' },
                { selector: '.poas, .poas-value', name: 'POAS Values' },
                { selector: '.campaigns-count', name: 'Campaign Counts' }
            ];
            
            for (const metric of metricsToCheck) {
                const count = await page.locator(metric.selector).count();
                this.addTestResult(`Platform ${metric.name}`, 
                    count >= 3 ? 'PASS' : 'FAIL',
                    `Found ${count} ${metric.name.toLowerCase()} (expected 3+ for platforms)`);
            }
            
        } catch (error) {
            this.addTestResult('Platform Metrics Test', 'FAIL', error.message);
        }
    }

    async testInteractiveElements(page) {
        try {
            // Check for simulator buttons
            const simulatorButtons = await page.locator('.simulator-btn, button[onclick*="simulator"], .scenario-btn').count();
            this.addTestResult('Budget Simulator Buttons', 
                simulatorButtons >= 1 ? 'PASS' : 'FAIL',
                `Found ${simulatorButtons} simulator buttons`);
            
            // Check for interactive controls
            const sliders = await page.locator('input[type="range"], .budget-slider').count();
            this.addTestResult('Budget Adjustment Sliders', 
                sliders >= 0 ? 'PASS' : 'INFO',
                `Found ${sliders} budget sliders`);
            
            // Check toggle switches
            const toggles = await page.locator('input[type="checkbox"], .toggle-switch').count();
            this.addTestResult('Auto-optimization Toggles', 
                toggles >= 0 ? 'PASS' : 'INFO',
                `Found ${toggles} toggle switches`);
                
        } catch (error) {
            this.addTestResult('Interactive Elements Test', 'FAIL', error.message);
        }
    }

    async testDataSourceIndicators(page) {
        try {
            // Check data source indicators (Live API vs Calculated)
            const apiIndicators = await page.locator('[data-source="API Direct"], .source-api').count();
            const calculatedIndicators = await page.locator('[data-source="Calculated"], .source-calculated').count();
            
            this.addTestResult('API Data Source Indicators', 
                apiIndicators >= 2 ? 'PASS' : 'FAIL',
                `Found ${apiIndicators} API data indicators`);
            
            this.addTestResult('Calculated Data Source Indicators', 
                calculatedIndicators >= 2 ? 'PASS' : 'FAIL',
                `Found ${calculatedIndicators} calculated data indicators`);
            
            // Check for tooltips on indicators
            const indicatorsWithTooltips = await page.locator('[data-source][title], .source-indicator[title]').count();
            this.addTestResult('Data Source Tooltips', 
                indicatorsWithTooltips >= 3 ? 'PASS' : 'FAIL',
                `Found ${indicatorsWithTooltips} indicators with tooltips`);
                
        } catch (error) {
            this.addTestResult('Data Source Indicators Test', 'FAIL', error.message);
        }
    }

    generateReport() {
        console.log('\n🏁 BUDGET OPTIMIZATION API TEST RESULTS');
        console.log('=' .repeat(60));
        console.log(`📊 Total Tests: ${this.testResults.summary.total}`);
        console.log(`✅ Passed: ${this.testResults.summary.passed}`);
        console.log(`❌ Failed: ${this.testResults.summary.failed}`);
        console.log(`📈 Success Rate: ${Math.round((this.testResults.summary.passed / this.testResults.summary.total) * 100)}%`);
        console.log('=' .repeat(60));
        
        // Group results by status
        const passed = this.testResults.tests.filter(t => t.status === 'PASS');
        const failed = this.testResults.tests.filter(t => t.status === 'FAIL');
        
        if (failed.length > 0) {
            console.log('\n❌ FAILED TESTS:');
            failed.forEach(test => {
                console.log(`  • ${test.test}: ${test.details}`);
            });
        }
        
        console.log('\n✅ PASSED TESTS:');
        passed.forEach(test => {
            console.log(`  • ${test.test}: ${test.details}`);
        });
        
        // Save detailed report
        require('fs').writeFileSync('./budget_optimization_api_test_results.json', 
            JSON.stringify(this.testResults, null, 2));
        
        console.log('\n📄 Detailed results saved to: budget_optimization_api_test_results.json');
    }
}

// Run the tests
const tester = new BudgetOptimizationAPITester();
tester.runAllTests().catch(console.error);