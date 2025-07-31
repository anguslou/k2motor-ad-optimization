const { chromium } = require('playwright');

async function testTooltipsFinal() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        console.log('🎯 FINAL TOOLTIP TEST - Campaign Deep Dive');
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
        
        console.log('3. Testing tooltips on metric cards...');
        
        // Test each expected metric
        const expectedMetrics = ['TOTAL CAMPAIGNS', 'ACTIVE CAMPAIGNS', 'AVG ROAS', 'AVG CPC'];
        let workingTooltips = 0;
        let totalTooltips = 0;
        
        for (const metric of expectedMetrics) {
            console.log(`\\n🔍 Testing ${metric}...`);
            totalTooltips++;
            
            try {
                // Find the tooltip container that contains this metric title
                const tooltipContainer = await page.locator('.tooltip').filter({ 
                    has: page.locator('.metric-title', { hasText: metric })
                }).first();
                
                const isVisible = await tooltipContainer.isVisible();
                
                if (isVisible) {
                    console.log(`  ✅ Found ${metric} tooltip container`);
                    
                    // Hover over the tooltip container to trigger tooltip
                    await tooltipContainer.hover();
                    await page.waitForTimeout(1000);
                    
                    // Check if tooltiptext becomes visible
                    const tooltipVisible = await page.evaluate(() => {
                        const tooltips = document.querySelectorAll('.tooltiptext');
                        for (let tooltip of tooltips) {
                            const style = window.getComputedStyle(tooltip);
                            if (style.visibility === 'visible' && style.opacity !== '0') {
                                return { 
                                    visible: true, 
                                    text: tooltip.textContent?.trim().substring(0, 150),
                                    styles: {
                                        visibility: style.visibility,
                                        opacity: style.opacity,
                                        display: style.display
                                    }
                                };
                            }
                        }
                        return { visible: false };
                    });
                    
                    if (tooltipVisible.visible) {
                        console.log(`  ✅ ${metric} tooltip WORKS!`);
                        console.log(`  📝 Content: ${tooltipVisible.text}...`);
                        console.log(`  🎨 Styles:`, tooltipVisible.styles);
                        workingTooltips++;
                    } else {
                        console.log(`  ❌ ${metric} tooltip not visible on hover`);
                        
                        // Debug why it's not visible
                        const debugInfo = await tooltipContainer.evaluate(el => {
                            const tooltiptext = el.querySelector('.tooltiptext');
                            if (tooltiptext) {
                                const style = window.getComputedStyle(tooltiptext);
                                return {
                                    hasTooltiptext: true,
                                    styles: {
                                        visibility: style.visibility,
                                        opacity: style.opacity,
                                        display: style.display,
                                        position: style.position,
                                        zIndex: style.zIndex
                                    }
                                };
                            }
                            return { hasTooltiptext: false };
                        });
                        console.log(`  🔧 Debug:`, debugInfo);
                    }
                    
                    // Move mouse away
                    await page.mouse.move(0, 0);
                    await page.waitForTimeout(500);
                    
                } else {
                    console.log(`  ❌ Could not find ${metric} tooltip container`);
                }
                
            } catch (error) {
                console.log(`  ❌ Error testing ${metric}: ${error.message}`);
            }
        }
        
        console.log(`\\n📊 FINAL RESULTS:`);
        console.log(`  Working tooltips: ${workingTooltips}/${totalTooltips}`);
        console.log(`  Success rate: ${((workingTooltips/totalTooltips)*100).toFixed(1)}%`);
        
        if (workingTooltips === totalTooltips) {
            console.log(`\\n🎉 SUCCESS! All Campaign Deep Dive metric tooltips are working!`);
        } else if (workingTooltips > 0) {
            console.log(`\\n⚠️ PARTIAL SUCCESS: Some tooltips work, others need fixing`);
        } else {
            console.log(`\\n❌ FAILURE: No tooltips are working`);
        }
        
        // Test specifically the user's reported issue: AVG ROAS should work
        console.log(`\\n🎯 SPECIFIC TEST: User reported AVG ROAS tooltip works...`);
        const avgRoasTest = await page.evaluate(() => {
            const avgRoasElement = Array.from(document.querySelectorAll('.metric-title'))
                .find(el => el.textContent.includes('AVG ROAS'));
            if (avgRoasElement) {
                const tooltipContainer = avgRoasElement.closest('.tooltip');
                return {
                    found: true,
                    hasTooltip: !!tooltipContainer,
                    hasTooltiptext: !!tooltipContainer?.querySelector('.tooltiptext')
                };
            }
            return { found: false };
        });
        
        console.log(`  AVG ROAS analysis:`, avgRoasTest);
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
    
    // Keep browser open for final verification
    console.log('\\n🔍 Browser will remain open for 30 seconds for manual verification...');
    console.log('Please manually hover over the metric cards to verify tooltips work!');
    await page.waitForTimeout(30000);
    
    await browser.close();
}

testTooltipsFinal().catch(console.error);