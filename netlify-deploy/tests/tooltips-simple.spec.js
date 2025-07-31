const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('K2Motor Dashboard Tooltip Issues', () => {
  test('should identify and document tooltip positioning issues', async ({ page }) => {
    console.log('🔍 Starting tooltip analysis...');
    
    // Navigate to the dashboard
    await page.goto('http://localhost:8000');
    
    // Wait for dashboard to load
    await page.waitForSelector('.dashboard-container', { timeout: 10000 });
    console.log('✅ Dashboard loaded');
    
    // Close any welcome popup if present
    try {
      const closeButton = page.locator('.close-btn, .popup-overlay .close-btn');
      if (await closeButton.isVisible({ timeout: 2000 })) {
        await closeButton.click();
        await page.waitForTimeout(500);
        console.log('✅ Closed welcome popup');
      }
    } catch (error) {
      console.log('ℹ️ No welcome popup to close');
    }
    
    // Take initial screenshot
    await page.screenshot({ 
      path: path.join(__dirname, '..', 'screenshots', '1-initial-dashboard.png'),
      fullPage: true 
    });
    console.log('📸 Took initial screenshot');
    
    // Test 1: Active Campaigns metric card tooltip (Overview tab)
    console.log('\n📊 Testing Overview tab - Active Campaigns tooltip...');
    
    // Make sure we're on overview tab
    await page.click('[data-tab="overview"]');
    await page.waitForTimeout(1000);
    
    // Look for Active Campaigns metric
    const activeCampaignsCard = page.locator('.metric-card').filter({ hasText: 'Active Campaigns' });
    if (await activeCampaignsCard.count() > 0) {
      console.log('Found Active Campaigns metric card');
      
      // Look for source indicator tooltip
      const sourceIndicator = activeCampaignsCard.locator('.source-indicator');
      if (await sourceIndicator.count() > 0) {
        console.log('Found source indicator - testing hover...');
        
        // Hover and test
        await sourceIndicator.hover();
        await page.waitForTimeout(1000);
        
        // Check for visible tooltip
        const tooltip = page.locator('.tooltiptext:visible');
        const tooltipCount = await tooltip.count();
        console.log(`Tooltip visible count: ${tooltipCount}`);
        
        if (tooltipCount === 0) {
          console.log('❌ ISSUE: Active Campaigns tooltip not responding to hover');
        }
        
        // Take screenshot showing the issue
        await page.screenshot({ 
          path: path.join(__dirname, '..', 'screenshots', '2-active-campaigns-tooltip-issue.png'),
          fullPage: false 
        });
      }
    }
    
    // Test 2: Switch to Campaign Deep Dive tab
    console.log('\n🎯 Switching to Campaign Deep Dive tab...');
    await page.click('[data-tab="campaigns"]');
    await page.waitForTimeout(2000); // Give more time for tab to load
    
    // Take screenshot of campaigns tab
    await page.screenshot({ 
      path: path.join(__dirname, '..', 'screenshots', '3-campaigns-tab.png'),
      fullPage: true 
    });
    console.log('📸 Took campaigns tab screenshot');
    
    // Test 3: Look for "Losing Money" alert tooltip
    console.log('\n🚨 Testing "Losing Money" alert tooltip...');
    const losingMoneyText = page.locator('text=Losing Money');
    if (await losingMoneyText.count() > 0) {
      console.log('Found "Losing Money" text');
      
      // Find the alert card containing this text
      const alertCard = page.locator('.alert-card, .insight-card').filter({ hasText: 'Losing Money' });
      if (await alertCard.count() > 0) {
        console.log('Found alert card with "Losing Money"');
        
        // Look for any tooltip elements in this card
        const tooltipElements = alertCard.locator('.tooltip, [title], [data-tooltip]');
        const tooltipCount = await tooltipElements.count();
        console.log(`Found ${tooltipCount} potential tooltips in alert`);
        
        if (tooltipCount > 0) {
          const firstTooltip = tooltipElements.first();
          await firstTooltip.hover();
          await page.waitForTimeout(1000);
          
          // Check tooltip position
          const visibleTooltips = page.locator('.tooltiptext:visible');
          if (await visibleTooltips.count() > 0) {
            const tooltipBox = await visibleTooltips.first().boundingBox();
            const viewportHeight = await page.evaluate(() => window.innerHeight);
            
            console.log(`Tooltip position: y=${tooltipBox?.y}, height=${tooltipBox?.height}`);
            console.log(`Viewport height: ${viewportHeight}`);
            
            if (tooltipBox && tooltipBox.y + tooltipBox.height > viewportHeight) {
              console.log('❌ ISSUE: Alert tooltip appears off-screen (below viewport)');
            }
          }
        }
        
        // Take screenshot
        await page.screenshot({ 
          path: path.join(__dirname, '..', 'screenshots', '4-losing-money-alert-tooltip.png'),
          fullPage: false 
        });
      }
    }
    
    // Test 4: Look for Impact/Effort badges
    console.log('\n💡 Testing Impact/Effort badges...');
    const badges = page.locator('.priority-high, .priority-medium, .priority-low, .rec-priority, .badge');
    const badgeCount = await badges.count();
    console.log(`Found ${badgeCount} potential badges`);
    
    if (badgeCount > 0) {
      // Test first few badges
      for (let i = 0; i < Math.min(badgeCount, 3); i++) {
        const badge = badges.nth(i);
        const badgeText = await badge.textContent();
        console.log(`Testing badge ${i}: "${badgeText}"`);
        
        await badge.hover();
        await page.waitForTimeout(500);
        
        const visibleTooltips = page.locator('.tooltiptext:visible');
        if (await visibleTooltips.count() > 0) {
          const tooltipBox = await visibleTooltips.first().boundingBox();
          const viewportHeight = await page.evaluate(() => window.innerHeight);
          
          if (tooltipBox && tooltipBox.y + tooltipBox.height > viewportHeight) {
            console.log('❌ ISSUE: Badge tooltip appears off-screen (below viewport)');
          }
        }
        
        // Move away to clear tooltip
        await page.mouse.move(0, 0);
        await page.waitForTimeout(300);
      }
      
      // Take screenshot
      await page.screenshot({ 
        path: path.join(__dirname, '..', 'screenshots', '5-badges-tooltip-issues.png'),
        fullPage: false 
      });
    }
    
    // Test 5: Test working table header tooltips for comparison
    console.log('\n📈 Testing working table header tooltips...');
    const tableHeaders = page.locator('th .source-indicator, th .tooltip');
    const headerCount = await tableHeaders.count();
    console.log(`Found ${headerCount} table header tooltips`);
    
    if (headerCount > 0) {
      const firstHeader = tableHeaders.first();
      await firstHeader.hover();
      await page.waitForTimeout(500);
      
      const visibleTooltips = page.locator('.tooltiptext:visible');
      if (await visibleTooltips.count() > 0) {
        const tooltipBox = await visibleTooltips.first().boundingBox();
        console.log(`✅ Working table tooltip position: y=${tooltipBox?.y}, height=${tooltipBox?.height}`);
      }
      
      // Take screenshot of working tooltip
      await page.screenshot({ 
        path: path.join(__dirname, '..', 'screenshots', '6-working-table-tooltip.png'),
        fullPage: false 
      });
    }
    
    console.log('\n✅ Tooltip analysis complete! Check screenshots for visual evidence.');
  });
});