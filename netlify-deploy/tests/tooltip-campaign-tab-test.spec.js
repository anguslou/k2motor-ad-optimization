const { test, expect } = require('@playwright/test');

test.describe('Campaign Deep Dive Tab - Tooltip Test', () => {
  test('Test tooltips in Campaign Deep Dive tab', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('http://localhost:8000');
    
    // Close any popup if it exists
    try {
      await page.click('.close-btn', { timeout: 2000 });
      console.log('✅ Closed welcome popup');
    } catch (e) {
      console.log('ℹ️ No popup to close');
    }
    
    await page.waitForTimeout(2000);

    // Switch to Campaign Deep Dive tab
    console.log('🔄 Switching to Campaign Deep Dive tab...');
    await page.click('[data-tab="campaigns"]');
    await page.waitForTimeout(3000); // Allow time for content to load

    console.log('🔍 === CAMPAIGN DEEP DIVE TAB TOOLTIP ANALYSIS ===');

    // Look for the three specific metrics
    const metricsToTest = [
      'Active Campaigns',
      'Avg ROAS', 
      'Avg CPC'
    ];

    for (const metricName of metricsToTest) {
      console.log(`\n🎯 === TESTING ${metricName} ===`);
      
      // Find the metric element
      const metricElement = page.locator(`text="${metricName}"`).first();
      const count = await metricElement.count();
      
      if (count > 0) {
        console.log(`✅ Found ${metricName} element`);
        
        // Get the parent metric card
        const metricCard = metricElement.locator('xpath=ancestor::*[contains(@class, "metric-card")]').first();
        
        if (await metricCard.count() > 0) {
          // Get HTML structure
          const html = await metricCard.innerHTML();
          console.log(`📋 ${metricName} HTML structure:`);
          console.log(html.substring(0, 400) + '...');
          
          // Count tooltip elements
          const tooltipCount = await metricCard.locator('.tooltip').count();
          const tooltipTextCount = await metricCard.locator('.tooltiptext').count();
          console.log(`🔍 Tooltip elements: .tooltip=${tooltipCount}, .tooltiptext=${tooltipTextCount}`);
          
          // Test hover functionality
          console.log(`🖱️ Testing hover for ${metricName}...`);
          await metricElement.hover();
          await page.waitForTimeout(1000);
          
          // Check for visible tooltips
          const visibleTooltips = await page.locator('.tooltiptext:visible').count();
          console.log(`👁️ Visible tooltips after hover: ${visibleTooltips}`);
          
          if (visibleTooltips > 0) {
            const tooltipContent = await page.locator('.tooltiptext:visible').first().textContent();
            console.log(`📖 Tooltip content: ${tooltipContent.substring(0, 200)}...`);
          } else {
            console.log(`❌ No tooltip appeared on hover for ${metricName}`);
          }
          
          // Reset hover
          await page.mouse.move(0, 0);
          await page.waitForTimeout(500);
          
        } else {
          console.log(`❌ Could not find metric card for ${metricName}`);
        }
      } else {
        console.log(`❌ Could not find ${metricName} element`);
      }
    }

    // Take screenshot
    await page.screenshot({ path: 'campaign-tab-tooltips.png', fullPage: true });
    console.log('📸 Screenshot saved as campaign-tab-tooltips.png');
    
    console.log('\n✅ Campaign Deep Dive tab tooltip test complete');
  });
});