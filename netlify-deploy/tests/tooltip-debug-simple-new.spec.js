const { test, expect } = require('@playwright/test');

test.describe('Simple Tooltip Debug - K2Motor Dashboard', () => {
  test('Debug tooltip issue by examining HTML structure', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('http://localhost:8000');
    
    // Close any popup if it exists
    try {
      await page.click('.close-btn', { timeout: 2000 });
      console.log('✅ Closed welcome popup');
    } catch (e) {
      console.log('ℹ️ No popup to close or already closed');
    }
    
    await page.waitForTimeout(3000); // Allow time for JavaScript to load

    // Make sure we're on the overview tab
    await page.click('[data-tab="overview"]');
    await page.waitForTimeout(2000);

    console.log('🔍 === TOOLTIP STRUCTURE ANALYSIS ===');

    // Get all metric cards
    const metricCards = await page.locator('.metric-card').all();
    console.log(`📊 Found ${metricCards.length} metric cards`);

    for (let i = 0; i < metricCards.length; i++) {
      const card = metricCards[i];
      const cardText = await card.textContent();
      const cardHTML = await card.innerHTML();
      
      console.log(`\n🎯 === METRIC CARD ${i + 1} ===`);
      console.log(`Text content: ${cardText.replace(/\n/g, ' ').substring(0, 100)}...`);
      
      // Check if this card contains our target metrics
      const isActiveCampaigns = cardText.includes('Active Campaigns');
      const isAvgRoas = cardText.includes('Avg ROAS') || cardText.includes('AVG ROAS');
      const isAvgCpc = cardText.includes('Avg CPC') || cardText.includes('AVG CPC');
      
      if (isActiveCampaigns || isAvgRoas || isAvgCpc) {
        const metricType = isActiveCampaigns ? 'ACTIVE CAMPAIGNS' : 
                          isAvgRoas ? 'AVG ROAS' : 'AVG CPC';
        
        console.log(`🎯 Found target metric: ${metricType}`);
        console.log(`📋 Full HTML structure:`);
        console.log(cardHTML);
        console.log('\n');
        
        // Count tooltip-related elements
        const tooltipElements = await card.locator('.tooltip').count();
        const tooltipTextElements = await card.locator('.tooltiptext').count();
        
        console.log(`🔍 Tooltip elements: .tooltip=${tooltipElements}, .tooltiptext=${tooltipTextElements}`);
        
        // Test hover functionality
        console.log(`🖱️ Testing hover for ${metricType}...`);
        await card.hover();
        await page.waitForTimeout(1000);
        
        // Check for visible tooltips
        const visibleTooltips = await page.locator('.tooltiptext:visible').count();
        console.log(`👁️ Visible tooltips after hover: ${visibleTooltips}`);
        
        if (visibleTooltips > 0) {
          const tooltipContent = await page.locator('.tooltiptext:visible').first().textContent();
          console.log(`📖 Tooltip content: ${tooltipContent}`);
        }
        
        // Reset hover
        await page.mouse.move(0, 0);
        await page.waitForTimeout(500);
      }
    }

    // Additional check: Look for all tooltip elements on the page
    console.log('\n🔍 === PAGE-WIDE TOOLTIP ANALYSIS ===');
    const allTooltips = await page.locator('.tooltip').count();
    const allTooltipTexts = await page.locator('.tooltiptext').count();
    console.log(`📊 Total tooltips on page: .tooltip=${allTooltips}, .tooltiptext=${allTooltipTexts}`);

    // Check if tooltip JavaScript is loaded
    const tooltipJSStatus = await page.evaluate(() => {
      return {
        fixTooltipsExists: typeof window.fixTooltips === 'function',
        tooltipManagerExists: typeof window.tooltipManager === 'object',
        hasTooltipEventListeners: document.querySelectorAll('.tooltip').length > 0
      };
    });
    console.log('🔧 JavaScript tooltip status:', tooltipJSStatus);

    // Take a screenshot
    await page.screenshot({ path: 'tooltip-debug-simple.png', fullPage: true });
    console.log('📸 Screenshot saved as tooltip-debug-simple.png');
  });

  test('Compare specific metric card structures', async ({ page }) => {
    await page.goto('http://localhost:8000');
    
    // Close popup
    try {
      await page.click('.close-btn', { timeout: 2000 });
    } catch (e) {
      // Ignore if no popup
    }
    
    await page.waitForTimeout(3000);
    await page.click('[data-tab="overview"]');
    await page.waitForTimeout(2000);

    console.log('\n🔍 === DIRECT METRIC COMPARISON ===');

    // Try to find each metric directly
    const metricsToFind = [
      'Active Campaigns',
      'Avg ROAS', 
      'Avg CPC'
    ];

    for (const metricName of metricsToFind) {
      console.log(`\n🎯 Searching for: ${metricName}`);
      
      // Try multiple ways to find the element
      const selectors = [
        `text="${metricName}"`,
        `.metric-header:has-text("${metricName}")`,
        `h3:has-text("${metricName}")`,
        `.tooltip:has-text("${metricName}")`
      ];

      let found = false;
      for (const selector of selectors) {
        const count = await page.locator(selector).count();
        if (count > 0) {
          console.log(`✅ Found with selector: ${selector} (${count} elements)`);
          
          const element = page.locator(selector).first();
          const metricCard = element.locator('xpath=ancestor::*[contains(@class, "metric-card")]').first();
          
          if (await metricCard.count() > 0) {
            const html = await metricCard.innerHTML();
            console.log(`📋 Metric card HTML for ${metricName}:`);
            console.log(html);
            console.log('\n');
          }
          
          found = true;
          break;
        }
      }
      
      if (!found) {
        console.log(`❌ Could not find ${metricName}`);
      }
    }
  });
});