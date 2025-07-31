const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('K2Motor Tooltip Fixes Verification', () => {
  test('Verify all tooltip fixes work correctly', async ({ page }) => {
    console.log('✅ Testing tooltip fixes implementation...');
    
    // Navigate with popup prevention
    await page.addInitScript(() => {
      localStorage.setItem('k2motor-welcome-shown', 'true');
    });
    
    await page.goto('http://localhost:8000');
    await page.waitForSelector('.dashboard-container', { timeout: 10000 });
    
    // Force remove any popups
    await page.evaluate(() => {
      document.querySelectorAll('.popup-overlay').forEach(el => el.remove());
    });
    
    await page.waitForTimeout(2000); // Wait for tooltip fixes to load
    
    console.log('✅ Dashboard loaded, testing fixes...');
    
    // Test 1: Check that tooltip fixes were applied
    const fixesApplied = await page.evaluate(() => {
      return {
        tooltipFixesExists: typeof window.tooltipFixes !== 'undefined',
        fixesAppliedStatus: window.tooltipFixes ? window.tooltipFixes.fixesApplied : false,
        customStylesExists: document.querySelector('#tooltip-fixes-styles') !== null
      };
    });
    
    console.log('Fixes status:', fixesApplied);
    expect(fixesApplied.tooltipFixesExists).toBe(true);
    
    // Test 2: Switch to campaigns tab and check metric cards
    await page.evaluate(() => {
      const campaignsTab = document.querySelector('[data-tab="campaigns"]');
      if (campaignsTab) campaignsTab.click();
    });
    
    await page.waitForTimeout(1000);
    
    // Take screenshot of campaigns tab
    await page.screenshot({ 
      path: path.join(__dirname, '..', 'screenshots', 'fixed-campaigns-tab.png') 
    });
    
    // Test 3: Check if campaign metric cards were added
    const campaignMetrics = await page.evaluate(() => {
      const campaignsTab = document.querySelector('[data-tab="campaigns"]');
      const metricsGrid = campaignsTab ? campaignsTab.querySelector('.metrics-grid') : null;
      const metricCards = metricsGrid ? metricsGrid.querySelectorAll('.metric-card') : [];
      
      return {
        metricsGridExists: !!metricsGrid,
        metricCardsCount: metricCards.length,
        activeCampaignsCardExists: Array.from(metricCards).some(card => 
          card.textContent.includes('Active Campaigns')
        )
      };
    });
    
    console.log('Campaign metrics:', campaignMetrics);
    
    // Test 4: Test Active Campaigns tooltip hover
    const activeCampaignsTest = await page.evaluate(() => {
      const campaignsTab = document.querySelector('[data-tab="campaigns"]');
      const activeCampaignsCard = Array.from(campaignsTab.querySelectorAll('.metric-card'))
        .find(card => card.textContent.includes('Active Campaigns'));
      
      if (activeCampaignsCard) {
        const tooltip = activeCampaignsCard.querySelector('.tooltip');
        const tooltipText = activeCampaignsCard.querySelector('.tooltiptext');
        
        if (tooltip && tooltipText) {
          // Trigger hover
          const mouseEnter = new MouseEvent('mouseenter', { bubbles: true });
          tooltip.dispatchEvent(mouseEnter);
          
          // Check visibility after delay
          return new Promise(resolve => {
            setTimeout(() => {
              const computed = window.getComputedStyle(tooltipText);
              resolve({
                tooltipExists: true,
                isVisible: computed.visibility === 'visible' && computed.opacity !== '0',
                position: computed.position,
                zIndex: computed.zIndex
              });
            }, 500);
          });
        }
      }
      
      return { tooltipExists: false };
    });
    
    console.log('Active Campaigns tooltip test:', activeCampaignsTest);
    
    // Test 5: Test Losing Money alert tooltip
    const losingMoneyTest = await page.evaluate(() => {
      const alerts = document.querySelectorAll('.alert-card');
      const losingMoneyAlert = Array.from(alerts).find(alert => 
        alert.textContent.includes('Losing Money') || alert.textContent.includes('High ROAS but Losing Money')
      );
      
      if (losingMoneyAlert) {
        const tooltip = losingMoneyAlert.querySelector('.tooltip');
        const tooltipText = losingMoneyAlert.querySelector('.tooltiptext');
        
        if (tooltip && tooltipText) {
          // Trigger hover
          const mouseEnter = new MouseEvent('mouseenter', { bubbles: true });
          tooltip.dispatchEvent(mouseEnter);
          
          // Check visibility after delay
          return new Promise(resolve => {
            setTimeout(() => {
              const computed = window.getComputedStyle(tooltipText);
              resolve({
                tooltipExists: true,
                isVisible: computed.visibility === 'visible' && computed.opacity !== '0',
                position: computed.position,
                zIndex: computed.zIndex
              });
            }, 500);
          });
        }
      }
      
      return { tooltipExists: false };
    });
    
    console.log('Losing Money tooltip test:', losingMoneyTest);
    
    // Test 6: Test scenario tags tooltips
    const scenarioTagsTest = await page.evaluate(() => {
      const scenarioTags = document.querySelectorAll('.scenario-tag');
      const results = [];
      
      scenarioTags.forEach((tag, index) => {
        const parent = tag.parentElement;
        const isTooltip = parent && parent.classList.contains('tooltip');
        results.push({
          index: index + 1,
          text: tag.textContent.trim(),
          hasTooltipParent: isTooltip
        });
      });
      
      return results;
    });
    
    console.log('Scenario tags test:', scenarioTagsTest);
    
    // Test 7: Overall tooltip system health check
    const systemHealthCheck = await page.evaluate(() => {
      const allTooltips = document.querySelectorAll('.tooltip');
      const allTooltipTexts = document.querySelectorAll('.tooltiptext');
      let workingTooltips = 0;
      
      allTooltips.forEach(tooltip => {
        const tooltipText = tooltip.querySelector('.tooltiptext');
        if (tooltipText) {
          // Quick hover test
          const mouseEnter = new MouseEvent('mouseenter', { bubbles: true });
          tooltip.dispatchEvent(mouseEnter);
          
          // Check if it shows (even briefly)
          const computed = window.getComputedStyle(tooltipText);
          if (computed.zIndex === '99999' && computed.position === 'fixed') {
            workingTooltips++;
          }
          
          // Hide it
          const mouseLeave = new MouseEvent('mouseleave', { bubbles: true });
          tooltip.dispatchEvent(mouseLeave);
        }
      });
      
      return {
        totalTooltips: allTooltips.length,
        totalTooltipTexts: allTooltipTexts.length,
        workingTooltips: workingTooltips,
        healthPercentage: Math.round((workingTooltips / allTooltips.length) * 100)
      };
    });
    
    console.log('System health check:', systemHealthCheck);
    
    // Test 8: Visual hover test with screenshots
    console.log('📸 Taking visual hover test screenshots...');
    
    // Test Active Campaigns hover
    if (campaignMetrics.activeCampaignsCardExists) {
      await page.hover('.metric-card .tooltip');
      await page.waitForTimeout(500);
      await page.screenshot({ 
        path: path.join(__dirname, '..', 'screenshots', 'active-campaigns-hover-fixed.png') 
      });
    }
    
    // Test Losing Money alert hover
    const losingMoneyExists = await page.locator('.alert-card').filter({ hasText: 'Losing Money' }).count();
    if (losingMoneyExists > 0) {
      await page.hover('.alert-card .tooltip');
      await page.waitForTimeout(500);
      await page.screenshot({ 
        path: path.join(__dirname, '..', 'screenshots', 'losing-money-hover-fixed.png') 
      });
    }
    
    // Test scenario tag hover
    const scenarioTagExists = await page.locator('.tooltip .scenario-tag').count();
    if (scenarioTagExists > 0) {
      await page.hover('.tooltip .scenario-tag');
      await page.waitForTimeout(500);
      await page.screenshot({ 
        path: path.join(__dirname, '..', 'screenshots', 'scenario-tag-hover-fixed.png') 
      });
    }
    
    // Final comprehensive screenshot
    await page.screenshot({ 
      path: path.join(__dirname, '..', 'screenshots', 'all-fixes-applied.png'),
      fullPage: true 
    });
    
    // Test 9: Compare with working table tooltips
    const tableTooltipTest = await page.evaluate(() => {
      const sourceIndicators = document.querySelectorAll('th .source-indicator');
      return {
        tableTooltipsCount: sourceIndicators.length,
        sampleTitle: sourceIndicators[0] ? sourceIndicators[0].getAttribute('title') : null
      };
    });
    
    console.log('Table tooltips (for comparison):', tableTooltipTest);
    
    // Final assertions
    expect(systemHealthCheck.totalTooltips).toBeGreaterThan(0);
    expect(systemHealthCheck.healthPercentage).toBeGreaterThan(80); // At least 80% working
    
    console.log('\n🎉 TOOLTIP FIXES VERIFICATION COMPLETE!');
    console.log(`✅ Total tooltips: ${systemHealthCheck.totalTooltips}`);
    console.log(`✅ Working tooltips: ${systemHealthCheck.workingTooltips}`);
    console.log(`✅ Health percentage: ${systemHealthCheck.healthPercentage}%`);
    console.log(`✅ Campaign metrics added: ${campaignMetrics.activeCampaignsCardExists}`);
    console.log('📸 Screenshots saved to verify visual fixes');
  });
});