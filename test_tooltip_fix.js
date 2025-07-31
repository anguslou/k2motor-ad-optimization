const { chromium } = require('playwright');

async function testTooltipFix() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        console.log('🔧 Testing Tooltip Fix...');
        console.log('1. Navigating to localhost:8000...');
        await page.goto('http://localhost:8000');
        
        console.log('2. Clicking Campaign Deep Dive tab...');
        await page.click('text="Campaign Deep Dive"');
        
        // Wait for content to load
        await page.waitForTimeout(3000);
        
        // Close welcome popup if it exists
        try {
            await page.click('.popup-close, .welcome-close, button:has-text("Close"), button:has-text("×")');
            await page.waitForTimeout(1000);
        } catch (e) {
            console.log('No popup to close');
        }
        
        console.log('3. Looking for Campaign Performance Summary section...');
        
        // Wait for metrics section
        await page.waitForSelector('.metrics-section', { timeout: 10000 });
        console.log('✅ Found metrics section');
        
        // Find all metric cards
        const metricCards = await page.$$('.metric-card');
        console.log(`✅ Found ${metricCards.length} metric cards`);
        
        // Test each expected metric
        const expectedMetrics = ['TOTAL CAMPAIGNS', 'ACTIVE CAMPAIGNS', 'AVG ROAS', 'AVG CPC'];
        
        for (const expectedMetric of expectedMetrics) {
            console.log(`\\n🔍 Testing ${expectedMetric}...`);
            
            try {
                // Find the metric card
                const metricElement = await page.locator('.metric-title', { hasText: expectedMetric }).first();
                const isVisible = await metricElement.isVisible();
                
                if (isVisible) {
                    console.log(`✅ Found ${expectedMetric} metric card`);
                    
                    // Find the parent tooltip container
                    const tooltipContainer = metricElement.locator('xpath=ancestor::div[contains(@class, "tooltip")]').first();
                    
                    // Hover over the metric title
                    await metricElement.hover();
                    await page.waitForTimeout(1000);
                    
                    // Check if tooltip is visible
                    const tooltipVisible = await page.evaluate(() => {
                        const tooltips = document.querySelectorAll('.tooltiptext');
                        for (let tooltip of tooltips) {
                            const style = window.getComputedStyle(tooltip);
                            if (style.visibility === 'visible' && style.opacity !== '0') {
                                return true;
                            }
                        }
                        return false;
                    });
                    
                    if (tooltipVisible) {
                        console.log(`✅ ${expectedMetric} tooltip is working!`);
                        
                        // Get tooltip content
                        const tooltipContent = await page.$eval('.tooltiptext[style*="visible"]', el => el.textContent).catch(() => 'Could not get content');
                        console.log(`📝 Tooltip content preview: ${tooltipContent.substring(0, 100)}...`);
                    } else {
                        console.log(`❌ ${expectedMetric} tooltip is NOT visible`);
                    }
                    
                    // Move mouse away
                    await page.mouse.move(0, 0);
                    await page.waitForTimeout(500);
                    
                } else {
                    console.log(`❌ Could not find ${expectedMetric} metric card`);
                }
            } catch (error) {
                console.log(`❌ Error testing ${expectedMetric}: ${error.message}`);
            }
        }
        
        console.log('\\n🔍 Getting complete HTML structure for analysis...');
        
        // Get the metrics section HTML
        const metricsHTML = await page.$eval('.metrics-section', el => el.innerHTML).catch(() => 'Could not get metrics HTML');
        console.log('📋 Campaign Performance Summary HTML:');
        console.log(metricsHTML.substring(0, 1000) + '...');
        
        console.log('\\n✅ Test completed! Check results above.');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
    
    // Keep browser open for manual inspection
    console.log('\\n🔍 Browser will remain open for 60 seconds for manual inspection...');
    await page.waitForTimeout(60000);
    
    await browser.close();
}

testTooltipFix().catch(console.error);