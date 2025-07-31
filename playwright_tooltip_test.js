const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

class K2MotorTooltipTester {
    constructor() {
        this.browser = null;
        this.page = null;
        this.testResults = {
            overview: {},
            campaigns: {},
            screenshots: [],
            summary: {
                totalTests: 0,
                passedTests: 0,
                failedTests: 0
            }
        };
    }

    async initialize() {
        console.log('🚀 Initializing K2Motor Dashboard Tooltip Testing...');
        this.browser = await chromium.launch({ 
            headless: false, 
            slowMo: 100 // Slow down actions for better observation
        });
        this.page = await this.browser.newPage();
        
        // Set viewport for consistent screenshots
        await this.page.setViewportSize({ width: 1920, height: 1080 });
        
        console.log('✅ Browser initialized with non-headless mode');
    }

    async navigateToK2Motor() {
        console.log('🎯 Navigating to K2Motor Dashboard at http://localhost:8000');
        
        try {
            await this.page.goto('http://localhost:8000', { 
                waitUntil: 'networkidle',
                timeout: 10000
            });
            
            // Wait for initial load
            await this.page.waitForTimeout(2000);
            
            // Handle welcome popup if it exists
            await this.handleWelcomePopup();
            
            // Take initial screenshot
            const screenshotPath = await this.takeScreenshot('01-initial-load');
            console.log(`📸 Initial screenshot saved: ${screenshotPath}`);
            
            return true;
        } catch (error) {
            console.error('❌ Failed to navigate to K2Motor dashboard:', error.message);
            return false;
        }
    }

    async handleWelcomePopup() {
        try {
            const popupSelectors = [
                '.popup-close',
                '.welcome-close', 
                'button:has-text("Close")',
                'button:has-text("×")',
                '.modal-close',
                '[data-dismiss="modal"]'
            ];
            
            for (const selector of popupSelectors) {
                try {
                    const element = await this.page.locator(selector).first();
                    if (await element.isVisible({ timeout: 1000 })) {
                        await element.click();
                        await this.page.waitForTimeout(1000);
                        console.log('✅ Closed welcome popup');
                        return;
                    }
                } catch (e) {
                    // Continue to next selector
                }
            }
            console.log('ℹ️ No welcome popup found or already closed');
        } catch (error) {
            console.log('ℹ️ No welcome popup to handle');
        }
    }

    async testOverviewTabTooltips() {
        console.log('\\n🔍 Testing Overview Tab Tooltips...');
        
        // Ensure we're on the overview tab
        try {
            const overviewTab = this.page.locator('[data-tab="overview"]');
            if (await overviewTab.isVisible()) {
                await overviewTab.click();
                await this.page.waitForTimeout(2000);
                console.log('✅ Switched to Overview tab');
            }
        } catch (e) {
            console.log('ℹ️ Already on Overview tab or tab not found');
        }

        const overviewMetrics = [
            'ROAS',
            'Real ROI', 
            'POAS',
            'Total Revenue',
            'Total Spend',
            'Active Campaigns'
        ];

        await this.takeScreenshot('02-overview-tab-loaded');

        for (const metric of overviewMetrics) {
            console.log(`\\n  🔍 Testing ${metric} tooltip...`);
            const result = await this.testSingleTooltip(metric, 'overview');
            this.testResults.overview[metric] = result;
            this.testResults.summary.totalTests++;
            
            if (result.success) {
                this.testResults.summary.passedTests++;
                console.log(`    ✅ ${metric}: ${result.message}`);
            } else {
                this.testResults.summary.failedTests++;
                console.log(`    ❌ ${metric}: ${result.message}`);
            }
        }
        
        await this.takeScreenshot('03-overview-tooltips-tested');
    }

    async testCampaignDeepDiveTooltips() {
        console.log('\\n🔍 Testing Campaign Deep Dive Tab Tooltips...');
        
        // Switch to Campaign Deep Dive tab
        try {
            const campaignTab = this.page.locator('[data-tab="campaigns"]');
            await campaignTab.click();
            await this.page.waitForTimeout(3000); // More time for campaign data to load
            console.log('✅ Switched to Campaign Deep Dive tab');
        } catch (error) {
            console.error('❌ Failed to switch to Campaign Deep Dive tab:', error.message);
            return;
        }

        const campaignMetrics = [
            'ACTIVE CAMPAIGNS',
            'AVG ROAS',
            'AVG CPC'
        ];

        await this.takeScreenshot('04-campaigns-tab-loaded');

        for (const metric of campaignMetrics) {
            console.log(`\\n  🔍 Testing ${metric} tooltip...`);
            const result = await this.testSingleTooltip(metric, 'campaigns');
            this.testResults.campaigns[metric] = result;
            this.testResults.summary.totalTests++;
            
            if (result.success) {
                this.testResults.summary.passedTests++;
                console.log(`    ✅ ${metric}: ${result.message}`);
            } else {
                this.testResults.summary.failedTests++;
                console.log(`    ❌ ${metric}: ${result.message}`);
            }
        }
        
        await this.takeScreenshot('05-campaigns-tooltips-tested');
    }

    async testSingleTooltip(metricName, tabName) {
        try {
            // Find the metric by text content
            const metricElement = this.page.locator('.metric-title').filter({ hasText: metricName });
            
            if (!(await metricElement.isVisible())) {
                return {
                    success: false,
                    message: `Metric element '${metricName}' not found or not visible`,
                    details: null
                };
            }

            // Find the tooltip container
            const tooltipContainer = metricElement.locator('..').filter('.tooltip');
            
            if (!(await tooltipContainer.isVisible())) {
                return {
                    success: false,
                    message: `Tooltip container not found for '${metricName}'`,
                    details: null
                };
            }

            // Hover over the tooltip container
            await tooltipContainer.hover();
            await this.page.waitForTimeout(1500); // Wait for tooltip animation

            // Check if tooltip is visible
            const tooltipStatus = await this.page.evaluate((metric) => {
                const tooltips = document.querySelectorAll('.tooltiptext');
                let visibleTooltip = null;
                
                for (let tooltip of tooltips) {
                    const style = window.getComputedStyle(tooltip);
                    if (style.visibility === 'visible' && style.opacity !== '0') {
                        visibleTooltip = {
                            text: tooltip.textContent?.trim(),
                            styles: {
                                visibility: style.visibility,
                                opacity: style.opacity,
                                display: style.display,
                                position: style.position
                            }
                        };
                        break;
                    }
                }
                
                return {
                    hasVisibleTooltip: !!visibleTooltip,
                    tooltip: visibleTooltip,
                    totalTooltips: tooltips.length
                };
            }, metricName);

            // Take screenshot if tooltip is visible
            if (tooltipStatus.hasVisibleTooltip) {
                await this.takeScreenshot(`tooltip-${tabName}-${metricName.toLowerCase().replace(/\s+/g, '-')}`);
            }

            // Move mouse away to hide tooltip
            await this.page.mouse.move(0, 0);
            await this.page.waitForTimeout(500);

            if (tooltipStatus.hasVisibleTooltip) {
                return {
                    success: true,
                    message: `Tooltip working correctly`,
                    details: {
                        content: tooltipStatus.tooltip.text.substring(0, 100) + '...',
                        styles: tooltipStatus.tooltip.styles
                    }
                };
            } else {
                return {
                    success: false,
                    message: `Tooltip not visible on hover (found ${tooltipStatus.totalTooltips} tooltip elements total)`,
                    details: tooltipStatus
                };
            }

        } catch (error) {
            return {
                success: false,
                message: `Error testing tooltip: ${error.message}`,
                details: { error: error.message }
            };
        }
    }

    async takeScreenshot(name) {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `${timestamp}-${name}.png`;
            const screenshotPath = path.join(__dirname, 'dashboard', 'screenshots', filename);
            
            // Ensure screenshots directory exists
            await fs.mkdir(path.dirname(screenshotPath), { recursive: true });
            
            await this.page.screenshot({ 
                path: screenshotPath,
                fullPage: true 
            });
            
            this.testResults.screenshots.push(screenshotPath);
            return screenshotPath;
        } catch (error) {
            console.error('Failed to take screenshot:', error.message);
            return null;
        }
    }

    async generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            testResults: this.testResults,
            summary: {
                ...this.testResults.summary,
                successRate: (this.testResults.summary.passedTests / this.testResults.summary.totalTests * 100).toFixed(1)
            }
        };

        // Save detailed JSON report
        const reportPath = path.join(__dirname, 'tooltip-test-report.json');
        await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

        // Print summary to console
        console.log('\\n📊 TOOLTIP TEST SUMMARY');
        console.log('═'.repeat(50));
        console.log(`Total Tests: ${report.summary.totalTests}`);
        console.log(`Passed: ${report.summary.passedTests}`);
        console.log(`Failed: ${report.summary.failedTests}`);
        console.log(`Success Rate: ${report.summary.successRate}%`);
        console.log('\\n📁 Screenshots saved to: dashboard/screenshots/');
        console.log(`📄 Detailed report saved to: ${reportPath}`);

        // Show specific results
        console.log('\\n🔍 OVERVIEW TAB RESULTS:');
        Object.entries(this.testResults.overview).forEach(([metric, result]) => {
            const status = result.success ? '✅' : '❌';
            console.log(`  ${status} ${metric}: ${result.message}`);
        });

        console.log('\\n🔍 CAMPAIGNS TAB RESULTS:');
        Object.entries(this.testResults.campaigns).forEach(([metric, result]) => {
            const status = result.success ? '✅' : '❌';
            console.log(`  ${status} ${metric}: ${result.message}`);
        });

        return report;
    }

    async runFullTest() {
        try {
            await this.initialize();
            
            const navigationSuccess = await this.navigateToK2Motor();
            if (!navigationSuccess) {
                throw new Error('Failed to navigate to K2Motor dashboard');
            }

            await this.testOverviewTabTooltips();
            await this.testCampaignDeepDiveTooltips();
            
            const report = await this.generateReport();
            
            console.log('\\n🎉 Testing complete! Browser will remain open for manual verification...');
            console.log('\\n👁️ Please manually verify tooltips by hovering over metric titles');
            console.log('Press Ctrl+C when done to close the browser');
            
            // Keep browser open for manual testing
            return new Promise((resolve) => {
                process.on('SIGINT', async () => {
                    console.log('\\n🔚 Closing browser...');
                    await this.browser.close();
                    resolve(report);
                    process.exit(0);
                });
            });
            
        } catch (error) {
            console.error('❌ Test execution failed:', error);
            if (this.browser) {
                await this.browser.close();
            }
            throw error;
        }
    }
}

// Run the test if script is executed directly
if (require.main === module) {
    const tester = new K2MotorTooltipTester();
    tester.runFullTest().catch(console.error);
}

module.exports = K2MotorTooltipTester;