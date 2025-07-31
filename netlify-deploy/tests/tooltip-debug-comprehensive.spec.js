const { test, expect } = require('@playwright/test');

test.describe('Comprehensive Tooltip Debug - K2Motor Dashboard', () => {
  test('Debug tooltip structure and functionality differences', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('http://localhost:8000');
    await page.waitForTimeout(2000); // Allow time for JavaScript to load
    
    // Switch to Campaign Deep Dive tab first to see if tooltips are there
    console.log('🔄 Switching to Campaign Deep Dive tab...');
    await page.click('[data-tab="campaigns"]');
    await page.waitForTimeout(1000);

    // Check if we can find AVG ROAS and AVG CPC in Campaign Deep Dive tab
    const avgRoasInCampaigns = await page.locator('text="Avg ROAS"').count();
    const avgCpcInCampaigns = await page.locator('text="Avg CPC"').count();
    console.log(`📊 In Campaign Deep Dive - AVG ROAS elements: ${avgRoasInCampaigns}, AVG CPC elements: ${avgCpcInCampaigns}`);

    // Switch back to Overview tab where the issue was reported
    console.log('🔄 Switching to Overview tab...');
    await page.click('[data-tab="overview"]');
    await page.waitForTimeout(2000); // Allow time for tab content to load

    // Wait for metric cards to be visible
    await page.waitForSelector('.metric-card', { timeout: 10000 });

    console.log('🔍 === COMPREHENSIVE TOOLTIP DEBUG ANALYSIS ===');

    // Find all three metrics we're interested in
    const metricsToDebug = [
      { name: 'ACTIVE CAMPAIGNS', working: false },
      { name: 'AVG ROAS', working: true },
      { name: 'AVG CPC', working: false }
    ];

    for (const metric of metricsToDebug) {
      console.log(`\n🎯 === ANALYZING ${metric.name} (Expected: ${metric.working ? 'WORKING' : 'NOT WORKING'}) ===`);

      // Try different selectors to find the metric
      const selectors = [
        `text="${metric.name}"`,
        `[aria-label*="${metric.name}"]`,
        `.metric-header:has-text("${metric.name}")`,
        `.metric-card:has-text("${metric.name}")`,
        `.tooltip:has-text("${metric.name}")`,
        `h3:has-text("${metric.name}")`,
        `.metric-title:has-text("${metric.name}")`
      ];

      let foundElement = null;
      let workingSelector = null;

      for (const selector of selectors) {
        const elements = await page.locator(selector);
        const count = await elements.count();
        console.log(`   Selector "${selector}": ${count} elements found`);
        
        if (count > 0 && !foundElement) {
          foundElement = elements.first();
          workingSelector = selector;
        }
      }

      if (foundElement) {
        console.log(`✅ Found ${metric.name} using selector: ${workingSelector}`);

        // Get the full HTML structure
        const fullHTML = await foundElement.evaluate(el => {
          // Find the metric card container
          let container = el;
          while (container && !container.classList.contains('metric-card')) {
            container = container.parentElement;
          }
          return container ? container.outerHTML : el.outerHTML;
        });

        console.log(`📋 ${metric.name} HTML Structure:`);
        console.log(fullHTML.substring(0, 1000) + (fullHTML.length > 1000 ? '...' : ''));

        // Check for tooltip elements
        const tooltipContainer = await foundElement.locator('..').locator('.tooltip');
        const tooltipCount = await tooltipContainer.count();
        console.log(`🔍 ${metric.name} - Tooltip container elements: ${tooltipCount}`);

        if (tooltipCount > 0) {
          const tooltipHTML = await tooltipContainer.first().innerHTML();
          console.log(`📝 ${metric.name} - Tooltip HTML: ${tooltipHTML}`);

          // Check for tooltiptext
          const tooltipTextCount = await tooltipContainer.locator('.tooltiptext').count();
          console.log(`📄 ${metric.name} - Tooltiptext elements: ${tooltipTextCount}`);

          if (tooltipTextCount > 0) {
            const tooltipTextHTML = await tooltipContainer.locator('.tooltiptext').first().innerHTML();
            console.log(`📃 ${metric.name} - Tooltiptext content: ${tooltipTextHTML}`);
          }
        }

        // Check CSS properties
        const computedStyles = await foundElement.evaluate(el => {
          const container = el.closest('.metric-card') || el;
          const tooltip = container.querySelector('.tooltip');
          const tooltiptext = container.querySelector('.tooltiptext');
          
          return {
            container: tooltip ? {
              position: getComputedStyle(tooltip).position,
              display: getComputedStyle(tooltip).display,
              cursor: getComputedStyle(tooltip).cursor
            } : null,
            tooltiptext: tooltiptext ? {
              visibility: getComputedStyle(tooltiptext).visibility,
              opacity: getComputedStyle(tooltiptext).opacity,
              position: getComputedStyle(tooltiptext).position,
              zIndex: getComputedStyle(tooltiptext).zIndex
            } : null
          };
        });

        console.log(`🎨 ${metric.name} - CSS Properties:`, JSON.stringify(computedStyles, null, 2));

        // Test hover functionality
        console.log(`🖱️ Testing hover functionality for ${metric.name}...`);
        
        try {
          await foundElement.hover();
          await page.waitForTimeout(500); // Wait for tooltip to appear

          // Check if tooltip is visible after hover
          const tooltipVisible = await page.locator('.tooltiptext').isVisible();
          console.log(`👁️ ${metric.name} - Tooltip visible after hover: ${tooltipVisible}`);

          // Get all visible tooltips
          const visibleTooltips = await page.locator('.tooltiptext:visible').count();
          console.log(`👁️ ${metric.name} - Total visible tooltips: ${visibleTooltips}`);

          if (visibleTooltips > 0) {
            const tooltipContent = await page.locator('.tooltiptext:visible').first().textContent();
            console.log(`📖 ${metric.name} - Visible tooltip content: ${tooltipContent}`);
          }

        } catch (error) {
          console.log(`❌ ${metric.name} - Hover test failed: ${error.message}`);
        }

        // Move mouse away to reset
        await page.mouse.move(0, 0);
        await page.waitForTimeout(300);

      } else {
        console.log(`❌ Could not find ${metric.name} element on the page`);
        
        // List all metric cards for debugging
        const allMetricCards = await page.locator('.metric-card').count();
        console.log(`📊 Total metric cards found: ${allMetricCards}`);
        
        for (let i = 0; i < allMetricCards; i++) {
          const cardText = await page.locator('.metric-card').nth(i).textContent();
          console.log(`   Card ${i + 1}: ${cardText.substring(0, 50)}...`);
        }
      }
    }

    // Additional debugging: Check for JavaScript errors
    const jsErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        jsErrors.push(msg.text());
      }
    });

    // Check if tooltip manager is loaded
    const tooltipManagerLoaded = await page.evaluate(() => {
      return typeof window.fixTooltips === 'function';
    });
    console.log(`🔧 Tooltip manager loaded: ${tooltipManagerLoaded}`);

    // Check for any tooltip-related JavaScript functions
    const tooltipFunctions = await page.evaluate(() => {
      const funcs = [];
      if (typeof window.fixTooltips === 'function') funcs.push('fixTooltips');
      if (typeof window.initializeTooltips === 'function') funcs.push('initializeTooltips');
      if (typeof window.handleTooltipHover === 'function') funcs.push('handleTooltipHover');
      return funcs;
    });
    console.log(`🔧 Available tooltip functions: ${tooltipFunctions.join(', ')}`);

    console.log('\n🔍 === DEBUGGING COMPLETE ===');
    
    if (jsErrors.length > 0) {
      console.log('❌ JavaScript errors detected:');
      jsErrors.forEach(error => console.log(`   ${error}`));
    }

    // Take screenshot for visual debugging
    await page.screenshot({ path: 'tooltip-debug-screenshot.png', fullPage: true });
    console.log('📸 Screenshot saved as tooltip-debug-screenshot.png');
  });

  test('Compare working vs non-working tooltip HTML structures', async ({ page }) => {
    await page.goto('http://localhost:8000');
    await page.waitForTimeout(2000);

    // Switch to overview tab
    await page.click('[data-tab="overview"]');
    await page.waitForTimeout(2000);

    console.log('\n🔍 === COMPARING TOOLTIP STRUCTURES ===');

    // Find Active Campaigns (working) and AVG ROAS/CPC (not working)
    const activeCampaigns = await page.locator('text="Active Campaigns"').first();
    const avgRoas = await page.locator('text="Avg ROAS"').first();
    const avgCpc = await page.locator('text="Avg CPC"').first();

    const elements = [
      { name: 'Active Campaigns (working)', element: activeCampaigns },
      { name: 'AVG ROAS (broken)', element: avgRoas },
      { name: 'AVG CPC (broken)', element: avgCpc }
    ];

    for (const item of elements) {
      if (await item.element.count() > 0) {
        console.log(`\n📊 === ${item.name} ===`);
        
        // Get the metric card HTML
        const metricCard = await item.element.locator('..').locator('..'); // Go up to metric-card
        const cardHTML = await metricCard.innerHTML();
        
        console.log(`HTML Structure (first 500 chars):`);
        console.log(cardHTML.substring(0, 500) + '...');

        // Check specific tooltip elements
        const hasTooltipClass = await metricCard.locator('.tooltip').count();
        const hasTooltipText = await metricCard.locator('.tooltiptext').count();
        
        console.log(`Tooltip elements: .tooltip=${hasTooltipClass}, .tooltiptext=${hasTooltipText}`);

        // Test hover specifically
        await item.element.hover();
        await page.waitForTimeout(500);
        
        const tooltipVisible = await page.locator('.tooltiptext:visible').count();
        console.log(`Tooltip appears on hover: ${tooltipVisible > 0}`);
        
        await page.mouse.move(0, 0); // Reset
        await page.waitForTimeout(300);
      } else {
        console.log(`❌ ${item.name} not found`);
      }
    }
  });
});