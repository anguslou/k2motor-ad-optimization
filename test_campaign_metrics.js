const { chromium } = require('playwright');

async function testCampaignMetrics() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        console.log('🔧 Testing Campaign Metrics...');
        console.log('1. Navigating to localhost:8000...');
        await page.goto('http://localhost:8000');
        
        // Wait for page to load
        await page.waitForTimeout(3000);
        
        // Close welcome popup if it exists
        try {
            await page.click('.popup-close, .welcome-close, button:has-text("Close"), button:has-text("×")');
            await page.waitForTimeout(1000);
        } catch (e) {
            console.log('No popup to close');
        }
        
        console.log('2. Clicking Campaign Deep Dive tab...');
        await page.click('[data-tab=\"campaigns\"]');
        
        // Wait for content to load
        await page.waitForTimeout(3000);
        console.log('✅ Campaign tab loaded');
        
        console.log('\\n3. Looking for Campaign Performance Summary...');
        
        // Wait for metrics section
        try {
            await page.waitForSelector('.metrics-section', { timeout: 5000 });
            console.log('✅ Found .metrics-section');
        } catch (e) {
            console.log('❌ Could not find .metrics-section');
            return;
        }
        
        // Get the metrics section HTML
        const metricsHTML = await page.$eval('.metrics-section', el => el.outerHTML);
        console.log('\\n📋 Complete Metrics Section HTML:');
        console.log(metricsHTML);
        
        // Check for the specific heading
        const hasCorrectHeading = metricsHTML.includes('📈 Campaign Performance Summary');
        const hasWrongHeading = metricsHTML.includes('🏁 Key Optimization Metrics');
        
        console.log(`\\n📊 Analysis:`);
        console.log(`  Campaign Performance Summary heading: ${hasCorrectHeading ? '✅' : '❌'}`);
        console.log(`  Wrong Overview heading: ${hasWrongHeading ? '❌ PROBLEM' : '✅'}`);
        
        if (hasCorrectHeading) {
            console.log('\\n4. Testing individual metric tooltips...');
            
            // Look for the expected metrics
            const expectedMetrics = ['TOTAL CAMPAIGNS', 'ACTIVE CAMPAIGNS', 'AVG ROAS', 'AVG CPC'];
            
            for (const metric of expectedMetrics) {
                console.log(`\\n🔍 Testing ${metric}...`);
                
                // Look for metric title
                const metricElement = await page.locator(`.metric-title:has-text(\"${metric}\")`).first();
                const isVisible = await metricElement.isVisible().catch(() => false);
                
                if (isVisible) {
                    console.log(`  ✅ Found ${metric} metric card`);
                    
                    // Find parent tooltip container
                    const tooltipContainer = metricElement.locator('xpath=..').locator('.tooltip').first();
                    const hasTooltip = await tooltipContainer.isVisible().catch(() => false);
                    
                    if (hasTooltip) {
                        console.log(`  ✅ ${metric} has tooltip container`);
                        
                        // Test hover
                        await metricElement.hover();
                        await page.waitForTimeout(1000);
                        
                        // Check if tooltip becomes visible
                        const tooltipVisible = await page.evaluate(() => {
                            const tooltips = document.querySelectorAll('.tooltiptext');
                            for (let tooltip of tooltips) {
                                const style = window.getComputedStyle(tooltip);
                                if (style.visibility === 'visible' && style.opacity !== '0') {
                                    return { visible: true, text: tooltip.textContent?.substring(0, 100) };
                                }
                            }
                            return { visible: false };
                        });
                        
                        if (tooltipVisible.visible) {
                            console.log(`  ✅ ${metric} tooltip works! Content: ${tooltipVisible.text}...`);
                        } else {
                            console.log(`  ❌ ${metric} tooltip not visible on hover`);
                        }
                        
                        // Move mouse away
                        await page.mouse.move(0, 0);
                        await page.waitForTimeout(500);
                        
                    } else {
                        console.log(`  ❌ ${metric} missing tooltip container`);
                    }
                } else {
                    console.log(`  ❌ Could not find ${metric} metric card`);
                }
            }
        } else {
            console.log('\\n❌ Wrong content loaded - this is the Overview tab content, not Campaign tab');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
    
    // Keep browser open for manual inspection
    console.log('\\n🔍 Browser will remain open for manual inspection...');
    await page.waitForTimeout(60000);
    
    await browser.close();
}

testCampaignMetrics().catch(console.error);