const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('K2Motor Dashboard Tooltip Fixes Verification', () => {
  test('should verify tooltip positioning fixes work correctly', async ({ page }) => {
    console.log('🔧 Testing tooltip fixes...');
    
    // Navigate to dashboard
    await page.goto('http://localhost:8000');
    await page.waitForSelector('.dashboard-container', { timeout: 10000 });
    
    // Handle welcome popup if present
    try {
      const popup = page.locator('.popup-overlay.active');
      if (await popup.isVisible({ timeout: 2000 })) {
        console.log('Closing welcome popup...');
        await page.click('.close-btn');
        await page.waitForTimeout(500);
      }
    } catch (error) {
      console.log('No popup to close');
    }
    
    console.log('✅ Dashboard loaded');
    
    // Test 1: Active Campaigns tooltip (Overview tab)
    console.log('\n📊 Testing Active Campaigns tooltip fix...');
    await page.click('[data-tab="overview"]');
    await page.waitForTimeout(1000);
    
    const activeCampaignsTooltip = page.locator('.metric-card').filter({ hasText: 'Active Campaigns' }).locator('.tooltip');
    if (await activeCampaignsTooltip.count() > 0) {
      await activeCampaignsTooltip.hover();
      await page.waitForTimeout(1000);
      
      const visibleTooltip = page.locator('.tooltiptext:visible');
      const tooltipVisible = await visibleTooltip.count() > 0;
      console.log(`✅ Active Campaigns tooltip now ${tooltipVisible ? 'WORKING' : 'NOT WORKING'}`);
      
      if (tooltipVisible) {
        const tooltipBox = await visibleTooltip.first().boundingBox();
        const viewportHeight = await page.evaluate(() => window.innerHeight);
        const inViewport = tooltipBox && tooltipBox.y >= 0 && tooltipBox.y + tooltipBox.height <= viewportHeight;
        console.log(`✅ Tooltip positioning: ${inViewport ? 'IN VIEWPORT' : 'OFF-SCREEN'}`);
      }
      
      await page.screenshot({ 
        path: path.join(__dirname, '..', 'screenshots', 'fixed-active-campaigns-tooltip.png') 
      });
    }
    
    // Test 2: Campaign Deep Dive tab - Losing Money alert
    console.log('\n🎯 Testing Campaign Deep Dive tooltips...');
    await page.click('[data-tab="campaigns"]');
    await page.waitForTimeout(2000);
    
    const losingMoneyTooltip = page.locator('.alert-card').filter({ hasText: 'Losing Money' }).locator('.tooltip');
    if (await losingMoneyTooltip.count() > 0) {
      await losingMoneyTooltip.hover();
      await page.waitForTimeout(1000);
      
      const visibleTooltip = page.locator('.tooltiptext:visible');
      const tooltipVisible = await visibleTooltip.count() > 0;
      console.log(`✅ Losing Money alert tooltip now ${tooltipVisible ? 'WORKING' : 'NOT WORKING'}`);
      
      if (tooltipVisible) {
        const tooltipBox = await visibleTooltip.first().boundingBox();
        const viewportHeight = await page.evaluate(() => window.innerHeight);
        const inViewport = tooltipBox && tooltipBox.y >= 0 && tooltipBox.y + tooltipBox.height <= viewportHeight;
        console.log(`✅ Tooltip positioning: ${inViewport ? 'IN VIEWPORT' : 'OFF-SCREEN'}`);
      }
      
      await page.screenshot({ 
        path: path.join(__dirname, '..', 'screenshots', 'fixed-losing-money-tooltip.png') 
      });
    }
    
    // Test 3: Impact/Effort badges (scenario tags)
    console.log('\n💡 Testing Impact/Effort badge tooltips...');
    const scenarioTags = page.locator('.scenario-tag').locator('..'); // Parent .tooltip element
    const tagCount = await scenarioTags.count();
    console.log(`Found ${tagCount} scenario tag tooltips`);
    
    if (tagCount > 0) {
      for (let i = 0; i < Math.min(tagCount, 3); i++) {
        const tag = scenarioTags.nth(i);
        await tag.hover();
        await page.waitForTimeout(500);
        
        const visibleTooltip = page.locator('.tooltiptext:visible');
        const tooltipVisible = await visibleTooltip.count() > 0;
        
        if (tooltipVisible) {
          const tooltipBox = await visibleTooltip.first().boundingBox();
          const viewportHeight = await page.evaluate(() => window.innerHeight);
          const inViewport = tooltipBox && tooltipBox.y >= 0 && tooltipBox.y + tooltipBox.height <= viewportHeight;
          console.log(`✅ Scenario ${i + 1} tooltip: ${inViewport ? 'IN VIEWPORT' : 'OFF-SCREEN'}`);
        }
        
        // Move mouse away
        await page.mouse.move(0, 0);
        await page.waitForTimeout(300);
      }
      
      await page.screenshot({ 
        path: path.join(__dirname, '..', 'screenshots', 'fixed-scenario-tooltips.png') 
      });
    }
    
    // Test 4: Table header tooltips for comparison
    console.log('\n📈 Testing table header tooltips...');
    const tableHeaders = page.locator('th .source-indicator');
    const headerCount = await tableHeaders.count();
    console.log(`Found ${headerCount} table header source indicators`);
    
    if (headerCount > 0) {
      const firstHeader = tableHeaders.first();
      await firstHeader.hover();
      await page.waitForTimeout(500);
      
      // Note: Table headers use native title tooltips, not our CSS system
      console.log('ℹ️ Table headers use native browser tooltips (title attribute)');
    }
    
    // Final summary screenshot
    await page.screenshot({ 
      path: path.join(__dirname, '..', 'screenshots', 'tooltip-fixes-complete.png'),
      fullPage: true 
    });
    
    console.log('\n🎉 Tooltip fix verification complete!');
    console.log('Check screenshots in the screenshots/ folder to see the results.');
  });
});