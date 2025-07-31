const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

test.describe('K2Motor Dashboard Tooltip Debugging', () => {
  test('Debug specific tooltip positioning issues', async ({ page }) => {
    const debugLog = [];
    const screenshots = [];
    
    // Helper function to log debug info
    const log = (message) => {
      console.log(message);
      debugLog.push(message);
    };
    
    // Helper function to take screenshot with context
    const takeScreenshot = async (name, description) => {
      const filename = `debug-${name}-${Date.now()}.png`;
      const filepath = path.join(__dirname, '..', 'screenshots', filename);
      await page.screenshot({ path: filepath, fullPage: false });
      screenshots.push({ name, filename, description });
      log(`📸 Screenshot saved: ${filename} - ${description}`);
      return filepath;
    };
    
    log('🔧 Starting comprehensive tooltip debugging...');
    
    // Navigate to dashboard
    await page.goto('http://localhost:8000');
    await page.waitForSelector('.dashboard-container', { timeout: 10000 });
    
    // Take initial screenshot
    await takeScreenshot('initial', 'Dashboard initial load');
    
    // Handle welcome popup if present - try multiple approaches
    try {
      const popup = page.locator('.popup-overlay.active');
      if (await popup.isVisible({ timeout: 2000 })) {
        log('Welcome popup detected, attempting to close...');
        
        // Try clicking the close button
        const closeBtn = page.locator('.close-btn');
        if (await closeBtn.isVisible({ timeout: 1000 })) {
          await closeBtn.click();
          log('Clicked close button');
        } else {
          // Try clicking the skip button
          const skipBtn = page.locator('.skip-btn');
          if (await skipBtn.isVisible({ timeout: 1000 })) {
            await skipBtn.click();
            log('Clicked skip button');
          } else {
            // Try clicking the overlay itself
            await page.click('.popup-overlay', { force: true });
            log('Clicked overlay to close');
          }
        }
        
        // Wait for popup to close
        await page.waitForTimeout(1000);
        
        // Verify popup is gone
        const stillVisible = await popup.isVisible({ timeout: 1000 });
        if (stillVisible) {
          log('Popup still visible, trying JavaScript removal...');
          await page.evaluate(() => {
            const overlays = document.querySelectorAll('.popup-overlay');
            overlays.forEach(overlay => overlay.remove());
          });
        }
        
        await takeScreenshot('popup-closed', 'After closing welcome popup');
      }
    } catch (error) {
      log(`Popup handling error: ${error.message}`);
      // Force remove any popups via JavaScript
      await page.evaluate(() => {
        const overlays = document.querySelectorAll('.popup-overlay');
        overlays.forEach(overlay => overlay.remove());
      });
    }
    
    log('✅ Dashboard loaded');
    
    // Step 3: Switch to Campaign Deep Dive tab
    log('\n🎯 Step 3: Switching to Campaign Deep Dive tab...');
    await page.click('[data-tab="campaigns"]');
    await page.waitForTimeout(2000);
    await takeScreenshot('campaigns-tab', 'Campaign Deep Dive tab loaded');
    
    // Debug Test 1: Active Campaigns metric card tooltip
    log('\n📊 DEBUG TEST 1: Active Campaigns metric card tooltip');
    const activeCampaignCards = page.locator('.metric-card').filter({ hasText: 'Active Campaigns' });
    const activeCampaignCount = await activeCampaignCards.count();
    log(`Found ${activeCampaignCount} Active Campaigns metric cards`);
    
    if (activeCampaignCount > 0) {
      const card = activeCampaignCards.first();
      
      // Check if tooltip exists
      const tooltip = card.locator('.tooltip');
      const tooltipExists = await tooltip.count() > 0;
      log(`Tooltip element exists: ${tooltipExists}`);
      
      if (tooltipExists) {
        // Get element structure
        const cardHTML = await card.innerHTML();
        log(`Card HTML structure: ${cardHTML.substring(0, 200)}...`);
        
        // Check CSS classes
        const cardClasses = await card.getAttribute('class');
        const tooltipClasses = await tooltip.getAttribute('class');
        log(`Card classes: ${cardClasses}`);
        log(`Tooltip classes: ${tooltipClasses}`);
        
        // Get positioning info before hover
        const cardBox = await card.boundingBox();
        log(`Card position: x=${cardBox.x}, y=${cardBox.y}, w=${cardBox.width}, h=${cardBox.height}`);
        
        // Hover and test tooltip
        await tooltip.hover();
        await page.waitForTimeout(1000);
        await takeScreenshot('active-campaigns-hover', 'Active Campaigns tooltip on hover');
        
        // Check if tooltip text is visible
        const tooltipText = page.locator('.tooltiptext:visible');
        const tooltipVisible = await tooltipText.count() > 0;
        log(`Tooltip visible: ${tooltipVisible}`);
        
        if (tooltipVisible) {
          const tooltipBox = await tooltipText.first().boundingBox();
          const viewportHeight = await page.evaluate(() => window.innerHeight);
          const viewportWidth = await page.evaluate(() => window.innerWidth);
          
          log(`Tooltip position: x=${tooltipBox.x}, y=${tooltipBox.y}, w=${tooltipBox.width}, h=${tooltipBox.height}`);
          log(`Viewport: ${viewportWidth}x${viewportHeight}`);
          
          const inViewportX = tooltipBox.x >= 0 && tooltipBox.x + tooltipBox.width <= viewportWidth;
          const inViewportY = tooltipBox.y >= 0 && tooltipBox.y + tooltipBox.height <= viewportHeight;
          
          log(`Tooltip in viewport: X=${inViewportX}, Y=${inViewportY}`);
          
          // Get computed styles
          const styles = await tooltipText.first().evaluate(el => {
            const computed = window.getComputedStyle(el);
            return {
              position: computed.position,
              top: computed.top,
              left: computed.left,
              transform: computed.transform,
              zIndex: computed.zIndex,
              visibility: computed.visibility,
              opacity: computed.opacity
            };
          });
          log(`Tooltip computed styles: ${JSON.stringify(styles, null, 2)}`);
        }
        
        // Move mouse away
        await page.mouse.move(10, 10);
        await page.waitForTimeout(500);
      }
    }
    
    // Debug Test 2: Campaign alert "Losing Money" tooltip
    log('\n🚨 DEBUG TEST 2: Campaign alert "Losing Money" tooltip');
    const losingMoneyAlerts = page.locator('.alert-card').filter({ hasText: 'Losing Money' });
    const alertCount = await losingMoneyAlerts.count();
    log(`Found ${alertCount} "Losing Money" alert cards`);
    
    if (alertCount > 0) {
      const alert = losingMoneyAlerts.first();
      
      // Check if tooltip exists
      const tooltip = alert.locator('.tooltip');
      const tooltipExists = await tooltip.count() > 0;
      log(`Tooltip element exists: ${tooltipExists}`);
      
      if (tooltipExists) {
        // Get element structure
        const alertHTML = await alert.innerHTML();
        log(`Alert HTML structure: ${alertHTML.substring(0, 200)}...`);
        
        // Get positioning info before hover
        const alertBox = await alert.boundingBox();
        log(`Alert position: x=${alertBox.x}, y=${alertBox.y}, w=${alertBox.width}, h=${alertBox.height}`);
        
        // Hover and test tooltip
        await tooltip.hover();
        await page.waitForTimeout(1000);
        await takeScreenshot('losing-money-hover', 'Losing Money alert tooltip on hover');
        
        // Check if tooltip text is visible
        const tooltipText = page.locator('.tooltiptext:visible');
        const tooltipVisible = await tooltipText.count() > 0;
        log(`Tooltip visible: ${tooltipVisible}`);
        
        if (tooltipVisible) {
          const tooltipBox = await tooltipText.first().boundingBox();
          const viewportHeight = await page.evaluate(() => window.innerHeight);
          const viewportWidth = await page.evaluate(() => window.innerWidth);
          
          log(`Tooltip position: x=${tooltipBox.x}, y=${tooltipBox.y}, w=${tooltipBox.width}, h=${tooltipBox.height}`);
          
          const inViewportX = tooltipBox.x >= 0 && tooltipBox.x + tooltipBox.width <= viewportWidth;
          const inViewportY = tooltipBox.y >= 0 && tooltipBox.y + tooltipBox.height <= viewportHeight;
          
          log(`Tooltip in viewport: X=${inViewportX}, Y=${inViewportY}`);
        }
        
        // Move mouse away
        await page.mouse.move(10, 10);
        await page.waitForTimeout(500);
      }
    }
    
    // Debug Test 3: Impact/Effort badges in Top Optimization Opportunities
    log('\n💡 DEBUG TEST 3: Impact/Effort badges tooltips');
    const scenarioTags = page.locator('.scenario-tag');
    const tagCount = await scenarioTags.count();
    log(`Found ${tagCount} scenario tags`);
    
    if (tagCount > 0) {
      // Test first few tags
      for (let i = 0; i < Math.min(tagCount, 3); i++) {
        const tag = scenarioTags.nth(i);
        const tagText = await tag.textContent();
        log(`\nTesting tag ${i + 1}: "${tagText}"`);
        
        // Check parent tooltip element
        const tooltipParent = tag.locator('..');
        const isTooltip = await tooltipParent.evaluate(el => el.classList.contains('tooltip'));
        log(`Parent has tooltip class: ${isTooltip}`);
        
        if (isTooltip) {
          // Get positioning info before hover
          const tagBox = await tag.boundingBox();
          log(`Tag position: x=${tagBox.x}, y=${tagBox.y}, w=${tagBox.width}, h=${tagBox.height}`);
          
          // Hover and test tooltip
          await tooltipParent.hover();
          await page.waitForTimeout(1000);
          await takeScreenshot(`scenario-tag-${i + 1}`, `Scenario tag ${i + 1} tooltip on hover`);
          
          // Check if tooltip text is visible
          const tooltipText = page.locator('.tooltiptext:visible');
          const tooltipVisible = await tooltipText.count() > 0;
          log(`Tooltip visible: ${tooltipVisible}`);
          
          if (tooltipVisible) {
            const tooltipBox = await tooltipText.first().boundingBox();
            const viewportHeight = await page.evaluate(() => window.innerHeight);
            const viewportWidth = await page.evaluate(() => window.innerWidth);
            
            log(`Tooltip position: x=${tooltipBox.x}, y=${tooltipBox.y}, w=${tooltipBox.width}, h=${tooltipBox.height}`);
            
            const inViewportX = tooltipBox.x >= 0 && tooltipBox.x + tooltipBox.width <= viewportWidth;
            const inViewportY = tooltipBox.y >= 0 && tooltipBox.y + tooltipBox.height <= viewportHeight;
            
            log(`Tooltip in viewport: X=${inViewportX}, Y=${inViewportY}`);
          }
          
          // Move mouse away
          await page.mouse.move(10, 10);
          await page.waitForTimeout(500);
        }
      }
    }
    
    // Debug Test 4: Compare with working tooltips in Platform Campaign Breakdown table
    log('\n📈 DEBUG TEST 4: Working tooltips in Platform Campaign Breakdown table');
    const tableHeaders = page.locator('th .source-indicator');
    const headerCount = await tableHeaders.count();
    log(`Found ${headerCount} table header source indicators`);
    
    if (headerCount > 0) {
      const firstHeader = tableHeaders.first();
      const headerText = await firstHeader.textContent();
      log(`Testing header: "${headerText}"`);
      
      // Get title attribute (these use native tooltips)
      const title = await firstHeader.getAttribute('title');
      log(`Native tooltip title: "${title}"`);
      
      // Test hover
      await firstHeader.hover();
      await page.waitForTimeout(1000);
      await takeScreenshot('table-header-tooltip', 'Table header native tooltip');
      
      log('ℹ️ Table headers use native browser tooltips (title attribute)');
    }
    
    // JavaScript diagnostics in browser
    log('\n🔍 Running JavaScript diagnostics in browser...');
    const diagnostics = await page.evaluate(() => {
      const results = {
        tooltipElements: document.querySelectorAll('.tooltip').length,
        tooltipTextElements: document.querySelectorAll('.tooltiptext').length,
        visibleTooltips: document.querySelectorAll('.tooltiptext:visible').length,
        tooltipManagerExists: typeof window.tooltipManager !== 'undefined',
        jsPositionedTooltips: document.querySelectorAll('.tooltip.js-positioned').length
      };
      
      // Check if tooltip manager is working
      if (window.tooltipManager) {
        results.tooltipManagerMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(window.tooltipManager));
      }
      
      // Get sample tooltip CSS
      const sampleTooltip = document.querySelector('.tooltiptext');
      if (sampleTooltip) {
        const computed = window.getComputedStyle(sampleTooltip);
        results.sampleTooltipCSS = {
          position: computed.position,
          zIndex: computed.zIndex,
          display: computed.display,
          visibility: computed.visibility
        };
      }
      
      return results;
    });
    
    log(`Browser diagnostics: ${JSON.stringify(diagnostics, null, 2)}`);
    
    // Test JavaScript fixes in browser
    log('\n🛠️ Testing JavaScript fixes in browser...');
    const fixResults = await page.evaluate(() => {
      const fixes = [];
      
      // Fix 1: Ensure tooltips have higher z-index
      const tooltipTexts = document.querySelectorAll('.tooltiptext');
      tooltipTexts.forEach((tooltip, index) => {
        const currentZIndex = window.getComputedStyle(tooltip).zIndex;
        if (currentZIndex === 'auto' || parseInt(currentZIndex) < 10000) {
          tooltip.style.zIndex = '10000';
          fixes.push(`Fixed z-index for tooltip ${index + 1}: ${currentZIndex} -> 10000`);
        }
      });
      
      // Fix 2: Ensure tooltips use fixed positioning
      tooltipTexts.forEach((tooltip, index) => {
        const currentPosition = window.getComputedStyle(tooltip).position;
        if (currentPosition !== 'fixed') {
          tooltip.style.position = 'fixed';
          fixes.push(`Fixed position for tooltip ${index + 1}: ${currentPosition} -> fixed`);
        }
      });
      
      // Fix 3: Force tooltip manager refresh
      if (window.tooltipManager && typeof window.tooltipManager.refreshTooltips === 'function') {
        window.tooltipManager.refreshTooltips();
        fixes.push('Refreshed tooltip manager');
      }
      
      return fixes;
    });
    
    log(`Applied fixes: ${JSON.stringify(fixResults, null, 2)}`);
    
    // Test fixes by re-testing tooltips
    log('\n🧪 Re-testing tooltips after fixes...');
    
    // Re-test Active Campaigns tooltip
    if (activeCampaignCount > 0) {
      const tooltip = activeCampaignCards.first().locator('.tooltip');
      if (await tooltip.count() > 0) {
        await tooltip.hover();
        await page.waitForTimeout(1000);
        await takeScreenshot('fixed-active-campaigns', 'Active Campaigns tooltip after fixes');
        
        const tooltipText = page.locator('.tooltiptext:visible');
        const tooltipVisible = await tooltipText.count() > 0;
        log(`Active Campaigns tooltip after fixes: ${tooltipVisible ? 'WORKING' : 'NOT WORKING'}`);
        
        await page.mouse.move(10, 10);
        await page.waitForTimeout(500);
      }
    }
    
    // Final comprehensive screenshot
    await takeScreenshot('final-state', 'Final dashboard state after all tests and fixes');
    
    // Generate debug report
    const reportPath = path.join(__dirname, '..', 'debug-report.md');
    const report = `# Tooltip Debug Report
Generated: ${new Date().toISOString()}

## Debug Log
${debugLog.map(line => `- ${line}`).join('\n')}

## Screenshots Taken
${screenshots.map(s => `- **${s.name}**: ${s.filename} - ${s.description}`).join('\n')}

## Browser Diagnostics
\`\`\`json
${JSON.stringify(diagnostics, null, 2)}
\`\`\`

## Applied Fixes
${fixResults.map(fix => `- ${fix}`).join('\n')}

## Recommendations
1. Ensure all tooltips have z-index >= 10000
2. Use position: fixed for all tooltips
3. Verify tooltip manager is properly initialized
4. Check CSS specificity conflicts
5. Test viewport boundary calculations
`;
    
    fs.writeFileSync(reportPath, report);
    log(`\n📄 Debug report saved to: ${reportPath}`);
    
    log('\n🎉 Tooltip debugging complete!');
    log(`Generated ${screenshots.length} screenshots and comprehensive debug report.`);
  });
});