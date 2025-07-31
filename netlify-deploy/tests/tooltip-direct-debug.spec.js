const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('K2Motor Tooltip Direct Debug', () => {
  test('Debug tooltips by bypassing popup entirely', async ({ page }) => {
    console.log('🔧 Starting direct tooltip debugging...');
    
    // Navigate directly and disable popups via localStorage
    await page.addInitScript(() => {
      // Set localStorage to skip welcome popup before page loads
      localStorage.setItem('k2motor-welcome-shown', 'true');
      
      // Disable guidedTour if it exists
      window.addEventListener('DOMContentLoaded', () => {
        if (window.guidedTour) {
          window.guidedTour.isActive = false;
          window.guidedTour.welcomeShown = true;
        }
      });
    });
    
    await page.goto('http://localhost:8000');
    await page.waitForSelector('.dashboard-container', { timeout: 10000 });
    
    // Aggressively remove any popups that might still appear
    await page.evaluate(() => {
      const removePopups = () => {
        const overlays = document.querySelectorAll('.popup-overlay');
        overlays.forEach(overlay => overlay.remove());
      };
      
      // Remove immediately
      removePopups();
      
      // Remove every 100ms for the first 2 seconds
      const interval = setInterval(removePopups, 100);
      setTimeout(() => clearInterval(interval), 2000);
    });
    
    await page.waitForTimeout(1000);
    console.log('✅ Dashboard loaded without popups');
    
    // Use JavaScript to switch tabs instead of clicking
    await page.evaluate(() => {
      // Find and click campaigns tab via JavaScript
      const campaignsTab = document.querySelector('[data-tab="campaigns"]');
      if (campaignsTab) {
        campaignsTab.click();
      }
      
      // Also trigger the tab switching logic directly if available
      if (window.dashboardContent && window.dashboardContent.switchTab) {
        window.dashboardContent.switchTab('campaigns');
      }
    });
    
    await page.waitForTimeout(2000);
    console.log('✅ Switched to campaigns tab via JavaScript');
    
    // Take screenshot of campaigns tab
    await page.screenshot({ 
      path: path.join(__dirname, '..', 'screenshots', 'direct-campaigns-tab.png') 
    });
    
    // Now analyze tooltip issues
    console.log('\n📊 ANALYZING TOOLTIP ISSUES...');
    
    const analysis = await page.evaluate(() => {
      const results = {
        activeCampaigns: { found: false, hasTooltip: false, html: '' },
        losingMoney: { found: false, hasTooltip: false, html: '' },
        scenarioTags: [],
        tooltipSystem: {
          totalTooltips: 0,
          totalTooltipTexts: 0,
          visibleTooltips: 0,
          tooltipManagerExists: false,
          sampleCSS: null
        }
      };
      
      // Check Active Campaigns metric card
      const metricCards = document.querySelectorAll('.metric-card');
      for (const card of metricCards) {
        if (card.textContent.includes('Active Campaigns')) {
          results.activeCampaigns.found = true;
          results.activeCampaigns.hasTooltip = card.querySelector('.tooltip') !== null;
          results.activeCampaigns.html = card.innerHTML.substring(0, 200);
          break;
        }
      }
      
      // Check Losing Money alert
      const alertCards = document.querySelectorAll('.alert-card');
      for (const alert of alertCards) {
        if (alert.textContent.includes('Losing Money')) {
          results.losingMoney.found = true;
          results.losingMoney.hasTooltip = alert.querySelector('.tooltip') !== null;
          results.losingMoney.html = alert.innerHTML.substring(0, 200);
          break;
        }
      }
      
      // Check scenario tags
      const scenarioTags = document.querySelectorAll('.scenario-tag');
      for (let i = 0; i < Math.min(scenarioTags.length, 3); i++) {
        const tag = scenarioTags[i];
        const parent = tag.parentElement;
        results.scenarioTags.push({
          text: tag.textContent.trim(),
          parentHasTooltip: parent && parent.classList.contains('tooltip'),
          parentClasses: parent ? parent.className : ''
        });
      }
      
      // Check tooltip system
      results.tooltipSystem.totalTooltips = document.querySelectorAll('.tooltip').length;
      results.tooltipSystem.totalTooltipTexts = document.querySelectorAll('.tooltiptext').length;
      
      // Count visible tooltips manually since :visible isn't valid in querySelectorAll
      let visibleCount = 0;
      document.querySelectorAll('.tooltiptext').forEach(tooltip => {
        const computed = window.getComputedStyle(tooltip);
        if (computed.visibility === 'visible' && computed.display !== 'none') {
          visibleCount++;
        }
      });
      results.tooltipSystem.visibleTooltips = visibleCount;
      results.tooltipSystem.tooltipManagerExists = typeof window.tooltipManager !== 'undefined';
      
      // Get sample tooltip CSS
      const sampleTooltip = document.querySelector('.tooltiptext');
      if (sampleTooltip) {
        const computed = window.getComputedStyle(sampleTooltip);
        results.tooltipSystem.sampleCSS = {
          position: computed.position,
          zIndex: computed.zIndex,
          visibility: computed.visibility,
          opacity: computed.opacity,
          top: computed.top,
          left: computed.left,
          transform: computed.transform
        };
      }
      
      return results;
    });
    
    console.log('\n📋 ANALYSIS RESULTS:');
    console.log('Active Campaigns:', analysis.activeCampaigns);
    console.log('Losing Money Alert:', analysis.losingMoney);
    console.log('Scenario Tags:', analysis.scenarioTags);
    console.log('Tooltip System:', analysis.tooltipSystem);
    
    // Test tooltip hover functionality
    console.log('\n🖱️ TESTING TOOLTIP HOVER...');
    
    if (analysis.losingMoney.found && analysis.losingMoney.hasTooltip) {
      const hoverTest = await page.evaluate(() => {
        const alert = document.querySelector('.alert-card');
        const tooltip = alert?.querySelector('.tooltip');
        
        if (tooltip) {
          // Create mouse events
          const mouseEnter = new MouseEvent('mouseenter', { bubbles: true });
          const mouseMove = new MouseEvent('mousemove', { bubbles: true });
          
          // Dispatch events
          tooltip.dispatchEvent(mouseEnter);
          tooltip.dispatchEvent(mouseMove);
          
          // Wait and check visibility
          return new Promise(resolve => {
            setTimeout(() => {
              const tooltipText = document.querySelector('.tooltiptext');
              if (tooltipText) {
                const computed = window.getComputedStyle(tooltipText);
                resolve({
                  tooltipFound: true,
                  visibility: computed.visibility,
                  opacity: computed.opacity,
                  display: computed.display,
                  position: computed.position,
                  top: computed.top,
                  left: computed.left,
                  zIndex: computed.zIndex,
                  isVisible: computed.visibility === 'visible' && computed.opacity !== '0'
                });
              } else {
                resolve({ tooltipFound: false });
              }
            }, 500);
          });
        }
        
        return { error: 'No tooltip element found' };
      });
      
      console.log('Hover test result:', hoverTest);
      
      // Take screenshot during hover
      await page.screenshot({ 
        path: path.join(__dirname, '..', 'screenshots', 'direct-hover-test.png') 
      });
    }
    
    // Apply comprehensive fixes
    console.log('\n🛠️ APPLYING COMPREHENSIVE FIXES...');
    
    const fixResults = await page.evaluate(() => {
      const fixes = [];
      
      // Fix 1: Create better tooltip CSS
      let fixStyle = document.querySelector('#tooltip-fixes');
      if (!fixStyle) {
        fixStyle = document.createElement('style');
        fixStyle.id = 'tooltip-fixes';
        document.head.appendChild(fixStyle);
      }
      
      fixStyle.textContent = `
        /* Enhanced tooltip positioning fixes */
        .tooltiptext {
          position: fixed !important;
          z-index: 99999 !important;
          background: rgba(0, 0, 0, 0.95) !important;
          color: white !important;
          padding: 12px 16px !important;
          border-radius: 8px !important;
          font-size: 14px !important;
          line-height: 1.4 !important;
          max-width: 320px !important;
          white-space: pre-wrap !important;
          word-wrap: break-word !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          backdrop-filter: blur(10px) !important;
          pointer-events: none !important;
          transform: translateZ(0) !important;
        }
        
        .tooltip:hover .tooltiptext {
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        .tooltip.js-positioned .tooltiptext {
          position: fixed !important;
        }
        
        /* Ensure tooltip containers are properly positioned */
        .tooltip {
          position: relative !important;
          display: inline-block !important;
        }
      `;
      fixes.push('Applied enhanced CSS fixes');
      
      // Fix 2: Manually position tooltips
      const tooltips = document.querySelectorAll('.tooltip');
      tooltips.forEach((tooltip, index) => {
        const tooltipText = tooltip.querySelector('.tooltiptext');
        if (tooltipText) {
          // Add enhanced hover handlers
          tooltip.addEventListener('mouseenter', function(e) {
            tooltipText.style.visibility = 'visible';
            tooltipText.style.opacity = '1';
            
            // Calculate position
            const rect = this.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Default position above the element
            let left = rect.left + (rect.width / 2) - 160; // Center tooltip (320px width / 2)
            let top = rect.top - 10; // 10px above element
            
            // Adjust if tooltip would go off-screen
            if (left < 10) left = 10;
            if (left + 320 > viewportWidth - 10) left = viewportWidth - 330;
            if (top < 10) top = rect.bottom + 10; // Position below if no room above
            
            // Apply position
            tooltipText.style.left = left + 'px';
            tooltipText.style.top = top + 'px';
          });
          
          tooltip.addEventListener('mouseleave', function() {
            tooltipText.style.visibility = 'hidden';
            tooltipText.style.opacity = '0';
          });
          
          fixes.push(`Enhanced tooltip ${index + 1} with manual positioning`);
        }
      });
      
      // Fix 3: Refresh tooltip manager if it exists
      if (window.tooltipManager && typeof window.tooltipManager.refreshTooltips === 'function') {
        window.tooltipManager.refreshTooltips();
        fixes.push('Refreshed tooltip manager');
      }
      
      return fixes;
    });
    
    console.log('✅ Applied fixes:', fixResults);
    
    // Re-test tooltips after fixes
    console.log('\n🧪 RE-TESTING AFTER FIXES...');
    
    const retestResults = await page.evaluate(() => {
      const results = [];
      
      // Test each tooltip
      const tooltips = document.querySelectorAll('.tooltip');
      tooltips.forEach((tooltip, index) => {
        const tooltipText = tooltip.querySelector('.tooltiptext');
        if (tooltipText) {
          // Trigger hover
          const mouseEnter = new MouseEvent('mouseenter', { bubbles: true });
          tooltip.dispatchEvent(mouseEnter);
          
          // Check if it becomes visible
          setTimeout(() => {
            const computed = window.getComputedStyle(tooltipText);
            results.push({
              index: index + 1,
              parentText: tooltip.parentElement ? tooltip.parentElement.textContent.substring(0, 30) : 'Unknown',
              isVisible: computed.visibility === 'visible' && computed.opacity !== '0',
              position: computed.position,
              zIndex: computed.zIndex,
              top: computed.top,
              left: computed.left
            });
          }, 100);
        }
      });
      
      return new Promise(resolve => {
        setTimeout(() => resolve(results), 500);
      });
    });
    
    console.log('🧪 Re-test results:', retestResults);
    
    // Take final screenshots
    await page.screenshot({ 
      path: path.join(__dirname, '..', 'screenshots', 'direct-final-fixed.png'),
      fullPage: true 
    });
    
    // Test specific elements mentioned in the issue
    console.log('\n🎯 TESTING SPECIFIC PROBLEM ELEMENTS...');
    
    // Test Active Campaigns metric card
    if (analysis.activeCampaigns.found) {
      console.log('❌ Active Campaigns metric card found but has no tooltip element');
      console.log('   This needs to be added to the HTML structure');
    }
    
    // Test Losing Money alert
    if (analysis.losingMoney.found && analysis.losingMoney.hasTooltip) {
      console.log('✅ Losing Money alert has tooltip element');
      // Try hover one more time
      await page.hover('.alert-card .tooltip');
      await page.waitForTimeout(500);
      await page.screenshot({ 
        path: path.join(__dirname, '..', 'screenshots', 'losing-money-final-test.png') 
      });
    }
    
    // Test scenario tags
    for (let i = 0; i < analysis.scenarioTags.length; i++) {
      const tag = analysis.scenarioTags[i];
      if (tag.parentHasTooltip) {
        console.log(`✅ Scenario tag "${tag.text}" has tooltip parent`);
      } else {
        console.log(`❌ Scenario tag "${tag.text}" missing tooltip parent`);
      }
    }
    
    console.log('\n🎉 Direct tooltip debugging complete!');
    console.log('Check screenshots folder for visual results.');
  });
});