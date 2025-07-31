const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('K2Motor Dashboard Tooltip Debugging - Simplified', () => {
  test('Debug tooltip issues without popups interfering', async ({ page }) => {
    console.log('🔧 Starting simplified tooltip debugging...');
    
    // Navigate to dashboard
    await page.goto('http://localhost:8000');
    await page.waitForSelector('.dashboard-container', { timeout: 10000 });
    
    // Force remove any popups immediately via JavaScript
    console.log('🗑️ Force removing all popups...');
    await page.evaluate(() => {
      // Remove all popup overlays
      const overlays = document.querySelectorAll('.popup-overlay');
      overlays.forEach(overlay => {
        overlay.remove();
        console.log('Removed popup overlay');
      });
      
      // Mark welcome as seen to prevent it from showing again
      localStorage.setItem('k2motor-welcome-shown', 'true');
      
      // Remove any event listeners that might recreate popups
      if (window.guidedTour) {
        window.guidedTour.isActive = false;
        window.guidedTour.welcomeShown = true;
      }
    });
    
    await page.waitForTimeout(1000);
    console.log('✅ Popups removed, dashboard ready');
    
    // Take initial screenshot
    await page.screenshot({ 
      path: path.join(__dirname, '..', 'screenshots', 'debug-clean-start.png') 
    });
    
    // Switch to Campaign Deep Dive tab
    console.log('\n🎯 Switching to Campaign Deep Dive tab...');
    await page.click('[data-tab="campaigns"]');
    await page.waitForTimeout(2000);
    
    // Screenshot after tab switch
    await page.screenshot({ 
      path: path.join(__dirname, '..', 'screenshots', 'debug-campaigns-tab.png') 
    });
    
    // Debug Test 1: Check Active Campaigns metric card structure
    console.log('\n📊 CHECKING: Active Campaigns metric card structure');
    const activeCampaignCards = await page.$$('.metric-card');
    console.log(`Found ${activeCampaignCards.length} metric cards total`);
    
    for (let i = 0; i < activeCampaignCards.length; i++) {
      const card = activeCampaignCards[i];
      const cardText = await card.textContent();
      console.log(`Card ${i + 1}: ${cardText.substring(0, 50)}...`);
      
      if (cardText.includes('Active Campaigns')) {
        console.log('✅ Found Active Campaigns card');
        const cardHTML = await card.innerHTML();
        console.log(`HTML: ${cardHTML}`);
        
        const tooltipElements = await card.$$('.tooltip');
        console.log(`Tooltip elements in card: ${tooltipElements.length}`);
        
        if (tooltipElements.length === 0) {
          console.log('❌ ISSUE: No tooltip element found in Active Campaigns card');
        }
      }
    }
    
    // Debug Test 2: Check "Losing Money" alert structure
    console.log('\n🚨 CHECKING: "Losing Money" alert structure');
    const alertCards = await page.$$('.alert-card');
    console.log(`Found ${alertCards.length} alert cards total`);
    
    for (let i = 0; i < alertCards.length; i++) {
      const alert = alertCards[i];
      const alertText = await alert.textContent();
      console.log(`Alert ${i + 1}: ${alertText.substring(0, 50)}...`);
      
      if (alertText.includes('Losing Money')) {
        console.log('✅ Found Losing Money alert');
        const alertHTML = await alert.innerHTML();
        console.log(`HTML excerpt: ${alertHTML.substring(0, 300)}...`);
        
        const tooltipElements = await alert.$$('.tooltip');
        console.log(`Tooltip elements in alert: ${tooltipElements.length}`);
        
        if (tooltipElements.length > 0) {
          console.log('✅ Tooltip element found - testing hover...');
          
          // Use JavaScript to trigger hover to avoid Playwright hover issues
          const hoverResult = await page.evaluate(() => {
            const losingMoneyAlert = document.querySelector('.alert-card');
            const tooltipInAlert = losingMoneyAlert?.querySelector('.tooltip');
            
            if (tooltipInAlert) {
              // Create and dispatch mouse events
              const mouseEnterEvent = new MouseEvent('mouseenter', {
                view: window,
                bubbles: true,
                cancelable: true
              });
              
              tooltipInAlert.dispatchEvent(mouseEnterEvent);
              
              // Check if tooltip becomes visible
              setTimeout(() => {
                const tooltipText = document.querySelector('.tooltiptext');
                const isVisible = tooltipText && window.getComputedStyle(tooltipText).visibility === 'visible';
                
                return {
                  tooltipFound: !!tooltipText,
                  isVisible: isVisible,
                  styles: tooltipText ? {
                    visibility: window.getComputedStyle(tooltipText).visibility,
                    opacity: window.getComputedStyle(tooltipText).opacity,
                    position: window.getComputedStyle(tooltipText).position,
                    top: window.getComputedStyle(tooltipText).top,
                    left: window.getComputedStyle(tooltipText).left,
                    zIndex: window.getComputedStyle(tooltipText).zIndex
                  } : null
                };
              }, 500);
            }
            
            return { error: 'No tooltip element found' };
          });
          
          await page.waitForTimeout(1000);
          console.log('Hover test result:', hoverResult);
          
          // Take screenshot during hover
          await page.screenshot({ 
            path: path.join(__dirname, '..', 'screenshots', 'debug-losing-money-hover.png') 
          });
        }
      }
    }
    
    // Debug Test 3: Check scenario tags structure
    console.log('\n💡 CHECKING: Scenario tags structure');
    const scenarioTags = await page.$$('.scenario-tag');
    console.log(`Found ${scenarioTags.length} scenario tags`);
    
    for (let i = 0; i < Math.min(scenarioTags.length, 3); i++) {
      const tag = scenarioTags[i];
      const tagText = await tag.textContent();
      console.log(`Tag ${i + 1}: "${tagText}"`);
      
      // Check if parent has tooltip class
      const parentElement = await tag.evaluateHandle(el => el.parentElement);
      const parentClasses = await parentElement.evaluate(el => el.className);
      console.log(`Parent classes: ${parentClasses}`);
      
      const hasTooltipParent = parentClasses.includes('tooltip');
      console.log(`Has tooltip parent: ${hasTooltipParent}`);
      
      if (hasTooltipParent) {
        // Test hover on parent
        const tooltipParent = await parentElement;
        const boundingBox = await tooltipParent.boundingBox();
        console.log(`Tag position: x=${boundingBox.x}, y=${boundingBox.y}`);
        
        // Use JavaScript hover
        await tooltipParent.evaluate(el => {
          const mouseEnterEvent = new MouseEvent('mouseenter', {
            view: window,
            bubbles: true,
            cancelable: true
          });
          el.dispatchEvent(mouseEnterEvent);
        });
        
        await page.waitForTimeout(500);
        
        // Check for visible tooltip
        const visibleTooltips = await page.$$('.tooltiptext:visible');
        console.log(`Visible tooltips after hover: ${visibleTooltips.length}`);
        
        // Take screenshot
        await page.screenshot({ 
          path: path.join(__dirname, '..', 'screenshots', `debug-scenario-tag-${i + 1}.png`) 
        });
      }
    }
    
    // Debug Test 4: Compare with working table tooltips
    console.log('\n📈 CHECKING: Table header tooltips (working ones)');
    const tableHeaders = await page.$$('th .source-indicator');
    console.log(`Found ${tableHeaders.length} table header indicators`);
    
    if (tableHeaders.length > 0) {
      const firstHeader = tableHeaders[0];
      const title = await firstHeader.getAttribute('title');
      console.log(`Table header title attribute: "${title}"`);
      console.log('ℹ️ Table headers use native browser tooltips (title attribute) - these should work');
    }
    
    // Global JavaScript diagnostics
    console.log('\n🔍 GLOBAL DIAGNOSTICS');
    const diagnostics = await page.evaluate(() => {
      const results = {
        totalTooltipElements: document.querySelectorAll('.tooltip').length,
        totalTooltipTextElements: document.querySelectorAll('.tooltiptext').length,
        visibleTooltips: document.querySelectorAll('.tooltiptext:visible').length,
        tooltipManagerExists: typeof window.tooltipManager !== 'undefined',
        jsPositionedTooltips: document.querySelectorAll('.tooltip.js-positioned').length,
      };
      
      // Sample tooltip CSS analysis
      const sampleTooltip = document.querySelector('.tooltiptext');
      if (sampleTooltip) {
        const computed = window.getComputedStyle(sampleTooltip);
        results.sampleTooltipCSS = {
          position: computed.position,
          zIndex: computed.zIndex,
          visibility: computed.visibility,
          opacity: computed.opacity,
          display: computed.display,
          top: computed.top,
          left: computed.left
        };
      }
      
      return results;
    });
    
    console.log('📊 Diagnostics:', JSON.stringify(diagnostics, null, 2));
    
    // Apply fixes and test them
    console.log('\n🛠️ APPLYING FIXES');
    const fixResults = await page.evaluate(() => {
      const fixes = [];
      
      // Fix 1: Ensure all tooltips have proper z-index
      const tooltipTexts = document.querySelectorAll('.tooltiptext');
      tooltipTexts.forEach((tooltip, index) => {
        tooltip.style.zIndex = '10000';
        tooltip.style.position = 'fixed';
        fixes.push(`Fixed z-index and position for tooltip ${index + 1}`);
      });
      
      // Fix 2: Reinitialize tooltip manager if it exists
      if (window.tooltipManager && typeof window.tooltipManager.refreshTooltips === 'function') {
        window.tooltipManager.refreshTooltips();
        fixes.push('Refreshed tooltip manager');
      }
      
      // Fix 3: Force CSS override for all tooltips
      const style = document.createElement('style');
      style.textContent = `
        .tooltiptext {
          position: fixed !important;
          z-index: 10000 !important;
          pointer-events: none !important;
          white-space: nowrap !important;
          max-width: 320px !important;
          background-color: rgba(0, 0, 0, 0.9) !important;
          color: white !important;
          padding: 8px 12px !important;
          border-radius: 6px !important;
          font-size: 14px !important;
          line-height: 1.4 !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
        }
        
        .tooltip.js-positioned .tooltiptext {
          position: fixed !important;
        }
      `;
      document.head.appendChild(style);
      fixes.push('Applied CSS override styles');
      
      return fixes;
    });
    
    console.log('✅ Applied fixes:', fixResults);
    
    // Re-test after fixes
    console.log('\n🧪 RE-TESTING AFTER FIXES');
    
    // Test Losing Money alert again
    const losingMoneyTest = await page.evaluate(() => {
      const alert = document.querySelector('.alert-card');
      const tooltip = alert?.querySelector('.tooltip');
      
      if (tooltip) {
        // Trigger hover
        const mouseEnterEvent = new MouseEvent('mouseenter', {
          view: window,
          bubbles: true,
          cancelable: true
        });
        tooltip.dispatchEvent(mouseEnterEvent);
        
        // Check visibility after a short delay
        return new Promise(resolve => {
          setTimeout(() => {
            const tooltipText = document.querySelector('.tooltiptext');
            const isVisible = tooltipText && window.getComputedStyle(tooltipText).visibility === 'visible';
            
            resolve({
              tooltipFound: !!tooltipText,
              isVisible: isVisible,
              computedStyles: tooltipText ? {
                visibility: window.getComputedStyle(tooltipText).visibility,
                opacity: window.getComputedStyle(tooltipText).opacity,
                zIndex: window.getComputedStyle(tooltipText).zIndex,
                position: window.getComputedStyle(tooltipText).position
              } : null
            });
          }, 1000);
        });
      }
      
      return { error: 'No tooltip found in alert' };
    });
    
    console.log('🧪 Losing Money tooltip re-test:', losingMoneyTest);
    
    // Final screenshot
    await page.screenshot({ 
      path: path.join(__dirname, '..', 'screenshots', 'debug-final-state.png'),
      fullPage: true 
    });
    
    console.log('\n🎉 Simplified tooltip debugging complete!');
    console.log('Check screenshots folder for visual evidence of issues.');
  });
});