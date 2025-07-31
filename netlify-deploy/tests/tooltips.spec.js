const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('K2Motor Dashboard Tooltip Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard
    await page.goto('http://localhost:8000');
    
    // Wait for dashboard to load
    await page.waitForSelector('.dashboard-container', { timeout: 10000 });
    
    // Close any welcome popup/modal if it exists
    try {
      const closeButton = page.locator('.close-btn, .modal-close, [data-dismiss="modal"]');
      if (await closeButton.isVisible({ timeout: 2000 })) {
        await closeButton.click();
        await page.waitForTimeout(500);
      }
    } catch (error) {
      console.log('No welcome popup found or already closed');
    }
    
    // Switch to Campaign Deep Dive tab
    await page.click('[data-tab="campaigns"]');
    await page.waitForSelector('.campaigns-tab', { timeout: 5000 });
    await page.waitForTimeout(1000); // Allow tab content to fully load
  });

  test('should identify tooltip positioning issues', async ({ page }) => {
    console.log('🔍 Starting tooltip positioning tests...');
    
    // Test 1: Active Campaigns metric card tooltip (Overview tab)
    console.log('📊 Testing Overview tab metric tooltips...');
    await page.click('[data-tab="overview"]');
    await page.waitForSelector('.overview-tab', { timeout: 5000 });
    
    // Look for Active Campaigns metric card tooltip
    const activeCampaignsTooltip = page.locator('.metric-card').filter({ hasText: 'Active Campaigns' }).locator('.source-indicator');
    if (await activeCampaignsTooltip.count() > 0) {
      console.log('Found Active Campaigns metric tooltip');
      
      // Test hover behavior
      await activeCampaignsTooltip.hover();
      await page.waitForTimeout(500);
      
      // Check if tooltip appears
      const tooltipText = page.locator('.tooltiptext:visible');
      const tooltipVisible = await tooltipText.count() > 0;
      console.log(`Active Campaigns tooltip visible: ${tooltipVisible}`);
      
      if (tooltipVisible) {
        const tooltipBox = await tooltipText.boundingBox();
        console.log('Active Campaigns tooltip position:', tooltipBox);
      }
    }
    
    // Switch back to Campaign Deep Dive tab for remaining tests
    console.log('🎯 Switching to Campaign Deep Dive tab...');
    await page.click('[data-tab="campaigns"]');
    await page.waitForSelector('.campaigns-tab', { timeout: 5000 });
    await page.waitForTimeout(1000);
    
    // Test 2: Campaign alert "Losing Money" tooltip
    console.log('🚨 Testing campaign alert tooltips...');
    const losingMoneyAlert = page.locator('.alert-card').filter({ hasText: 'Losing Money' });
    if (await losingMoneyAlert.count() > 0) {
      console.log('Found "Losing Money" alert');
      
      // Look for tooltip elements in the alert
      const alertTooltips = losingMoneyAlert.locator('.tooltip, [title], [data-tooltip]');
      const alertTooltipCount = await alertTooltips.count();
      console.log(`Found ${alertTooltipCount} potential tooltips in Losing Money alert`);
      
      // Test each tooltip
      for (let i = 0; i < alertTooltipCount; i++) {
        const tooltip = alertTooltips.nth(i);
        await tooltip.hover();
        await page.waitForTimeout(500);
        
        const tooltipText = page.locator('.tooltiptext:visible');
        if (await tooltipText.count() > 0) {
          const tooltipBox = await tooltipText.boundingBox();
          console.log(`Alert tooltip ${i} position:`, tooltipBox);
          
          // Check if tooltip is off-screen (below viewport)
          const viewportHeight = await page.evaluate(() => window.innerHeight);
          if (tooltipBox && tooltipBox.y + tooltipBox.height > viewportHeight) {
            console.log('❌ Alert tooltip appears off-screen (below viewport)');
          }
        }
      }
    }
    
    // Test 3: Impact/Effort badges in Top Optimization Opportunities
    console.log('💡 Testing optimization opportunity tooltips...');
    const optimizationSection = page.locator('.insights-grid, .optimization-opportunities-section');
    if (await optimizationSection.count() > 0) {
      console.log('Found optimization opportunities section');
      
      // Look for Impact/Effort badges
      const badges = optimizationSection.locator('.badge, .priority-high, .priority-medium, .priority-low, .rec-priority');
      const badgeCount = await badges.count();
      console.log(`Found ${badgeCount} potential badge tooltips`);
      
      // Test badge tooltips
      for (let i = 0; i < Math.min(badgeCount, 5); i++) { // Test first 5 badges
        const badge = badges.nth(i);
        const badgeText = await badge.textContent();
        console.log(`Testing badge: "${badgeText}"`);
        
        await badge.hover();
        await page.waitForTimeout(500);
        
        const tooltipText = page.locator('.tooltiptext:visible');
        if (await tooltipText.count() > 0) {
          const tooltipBox = await tooltipText.boundingBox();
          console.log(`Badge tooltip position:`, tooltipBox);
          
          // Check if tooltip is off-screen
          const viewportHeight = await page.evaluate(() => window.innerHeight);
          if (tooltipBox && tooltipBox.y + tooltipBox.height > viewportHeight) {
            console.log('❌ Badge tooltip appears off-screen (below viewport)');
          }
        }
      }
    }
    
    // Test 4: Compare with working table tooltips (Platform Campaign Breakdown)
    console.log('📈 Testing working table header tooltips...');
    const campaignTable = page.locator('.campaigns-table, .enhanced-campaign-table');
    if (await campaignTable.count() > 0) {
      console.log('Found campaign table');
      
      // Test table header tooltips
      const tableHeaders = campaignTable.locator('th .source-indicator, th .tooltip');
      const headerCount = await tableHeaders.count();
      console.log(`Found ${headerCount} table header tooltips`);
      
      for (let i = 0; i < Math.min(headerCount, 3); i++) { // Test first 3 headers
        const header = tableHeaders.nth(i);
        await header.hover();
        await page.waitForTimeout(500);
        
        const tooltipText = page.locator('.tooltiptext:visible');
        if (await tooltipText.count() > 0) {
          const tooltipBox = await tooltipText.boundingBox();
          console.log(`✅ Working table header tooltip position:`, tooltipBox);
        }
      }
    }
    
    // Take screenshots showing the issues
    console.log('📸 Taking screenshots...');
    await page.screenshot({ 
      path: path.join(__dirname, 'screenshots', 'tooltip-issues.png'),
      fullPage: true 
    });
  });

  test('should test tooltip positioning after CSS fixes', async ({ page }) => {
    console.log('🔧 Testing tooltip positioning after fixes...');
    
    // This test will be run after we implement the CSS fixes
    // We'll test the same tooltips to ensure they now appear correctly
    
    // Switch to Campaign Deep Dive tab
    await page.click('[data-tab="campaigns"]');
    await page.waitForSelector('.campaigns-tab', { timeout: 5000 });
    
    // Test fixed tooltips
    const tooltipElements = page.locator('.tooltip');
    const tooltipCount = await tooltipElements.count();
    console.log(`Testing ${tooltipCount} tooltips after fixes`);
    
    for (let i = 0; i < Math.min(tooltipCount, 10); i++) {
      const tooltip = tooltipElements.nth(i);
      await tooltip.hover();
      await page.waitForTimeout(300);
      
      const tooltipText = page.locator('.tooltiptext:visible');
      if (await tooltipText.count() > 0) {
        const tooltipBox = await tooltipText.boundingBox();
        const viewportHeight = await page.evaluate(() => window.innerHeight);
        
        // Verify tooltip is within viewport
        const isInViewport = tooltipBox && 
          tooltipBox.y >= 0 && 
          tooltipBox.y + tooltipBox.height <= viewportHeight;
        
        console.log(`Tooltip ${i}: ${isInViewport ? '✅ In viewport' : '❌ Off-screen'}`);
      }
      
      // Move mouse away to hide tooltip
      await page.mouse.move(0, 0);
      await page.waitForTimeout(100);
    }
    
    // Take final screenshot
    await page.screenshot({ 
      path: path.join(__dirname, 'screenshots', 'tooltip-fixes-verified.png'),
      fullPage: true 
    });
  });
});