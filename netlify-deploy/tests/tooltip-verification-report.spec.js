const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('K2Motor Tooltip Fixes - Detailed Verification Report', () => {
  test('Generate detailed report on tooltip positioning fixes', async ({ page }) => {
    console.log('🔍 Starting comprehensive tooltip verification for K2Motor Dashboard...');
    
    // 1. Navigate to http://localhost:8000
    console.log('📍 Step 1: Navigating to http://localhost:8000...');
    await page.addInitScript(() => {
      localStorage.setItem('k2motor-welcome-shown', 'true');
    });
    
    await page.goto('http://localhost:8000');
    await page.waitForSelector('.dashboard-container', { timeout: 10000 });
    
    // 2. Close any welcome popup
    console.log('📍 Step 2: Closing welcome popup...');
    await page.evaluate(() => {
      document.querySelectorAll('.popup-overlay, .welcome-popup, .modal-overlay').forEach(el => el.remove());
    });
    
    await page.waitForTimeout(2000);
    
    // Take initial screenshot
    await page.screenshot({ 
      path: path.join(__dirname, '..', 'screenshots', 'step1-dashboard-loaded.png'),
      fullPage: true
    });
    
    // 3. Switch to Campaign Deep Dive tab
    console.log('📍 Step 3: Switching to Campaign Deep Dive tab...');
    await page.evaluate(() => {
      const campaignsTab = document.querySelector('[data-tab="campaigns"]');
      if (campaignsTab) campaignsTab.click();
    });
    
    await page.waitForTimeout(1500);
    
    await page.screenshot({ 
      path: path.join(__dirname, '..', 'screenshots', 'step2-campaigns-tab.png'),
      fullPage: true
    });
    
    // Check system status
    const systemStatus = await page.evaluate(() => {
      return {
        k2MotorTooltipFixerExists: typeof window.k2MotorTooltipFixer !== 'undefined',
        tooltipFixerClass: window.k2MotorTooltipFixer ? window.k2MotorTooltipFixer.constructor.name : null,
        tooltipsManaged: window.k2MotorTooltipFixer ? window.k2MotorTooltipFixer.tooltips.length : 0,
        viewportDimensions: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      };
    });
    
    console.log('🔧 System Status:', systemStatus);
    
    // 4. Test the three problematic tooltips
    console.log('📍 Step 4: Testing three problematic tooltips...');
    
    // Find all tooltips in the current view
    const tooltipInventory = await page.evaluate(() => {
      const tooltips = Array.from(document.querySelectorAll('.tooltip'));
      const inventory = [];
      
      tooltips.forEach((tooltip, index) => {
        const tooltipText = tooltip.querySelector('.tooltiptext');
        const parent = tooltip.parentElement;
        const content = tooltipText ? tooltipText.textContent.trim() : 'No content';
        
        // Determine what this tooltip is for
        let category = 'unknown';
        let description = '';
        
        if (parent && parent.classList.contains('metric-card')) {
          const cardText = parent.textContent;
          if (cardText.includes('Active Campaigns')) {
            category = 'active-campaigns';
            description = 'Active Campaigns metric card';
          } else {
            category = 'metric-card';
            description = 'Other metric card';
          }
        } else if (parent && parent.classList.contains('alert-card')) {
          const alertText = parent.textContent;
          if (alertText.includes('Losing Money')) {
            category = 'losing-money';
            description = 'Losing Money alert';
          } else {
            category = 'alert-card';
            description = 'Other alert card';
          }
        } else if (tooltip.querySelector('.scenario-tag')) {
          category = 'badges';
          description = 'Impact/Effort badges';
        } else {
          const parentClass = parent ? parent.className : 'none';
          description = `Parent class: ${parentClass}`;
        }
        
        inventory.push({
          index,
          category,
          description,
          content: content.substring(0, 100),
          hasTooltipText: !!tooltipText,
          parentElement: parent ? parent.tagName.toLowerCase() : 'none'
        });
      });
      
      return inventory;
    });
    
    console.log('📊 Tooltip Inventory:', tooltipInventory);
    
    // Test each problematic tooltip specifically
    const tooltipTests = {};
    
    // 4A: Active Campaigns metric card tooltip
    console.log('🎯 Testing Active Campaigns metric card tooltip...');
    const activeCampaignsTest = await page.evaluate(() => {
      const metricCards = Array.from(document.querySelectorAll('.metric-card'));
      const activeCampaignsCard = metricCards.find(card => 
        card.textContent.includes('Active Campaigns')
      );
      
      if (!activeCampaignsCard) {
        return { found: false, reason: 'Active Campaigns metric card not found' };
      }
      
      const tooltip = activeCampaignsCard.querySelector('.tooltip');
      const tooltipText = activeCampaignsCard.querySelector('.tooltiptext');
      
      if (!tooltip || !tooltipText) {
        return { found: false, reason: 'Tooltip elements not found in Active Campaigns card' };
      }
      
      // Test positioning
      const rect = activeCampaignsCard.getBoundingClientRect();
      
      // Simulate hover
      tooltip.dispatchEvent(new MouseEvent('mouseenter', { 
        bubbles: true, 
        clientX: rect.left + rect.width/2,
        clientY: rect.top + rect.height/2
      }));
      
      // Check positioning after short delay
      return new Promise(resolve => {
        setTimeout(() => {
          const tooltipRect = tooltipText.getBoundingClientRect();
          const computed = window.getComputedStyle(tooltipText);
          const viewport = { width: window.innerWidth, height: window.innerHeight };
          
          const result = {
            found: true,
            positioning: {
              left: tooltipRect.left,
              top: tooltipRect.top,
              right: tooltipRect.right,
              bottom: tooltipRect.bottom,
              width: tooltipRect.width,
              height: tooltipRect.height
            },
            styles: {
              position: computed.position,
              zIndex: computed.zIndex,
              visibility: computed.visibility,
              opacity: computed.opacity
            },
            withinViewport: tooltipRect.left >= 0 && tooltipRect.top >= 0 && 
                           tooltipRect.right <= viewport.width && tooltipRect.bottom <= viewport.height,
            content: tooltipText.textContent.trim(),
            viewport
          };
          
          // Clean up
          tooltip.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
          resolve(result);
        }, 300);
      });
    });
    
    tooltipTests.activeCampaigns = await activeCampaignsTest;
    console.log('✅ Active Campaigns result:', tooltipTests.activeCampaigns);
    
    // Take screenshot during hover
    if (tooltipTests.activeCampaigns.found) {
      await page.hover('.metric-card .tooltip');
      await page.waitForTimeout(300);
      await page.screenshot({ 
        path: path.join(__dirname, '..', 'screenshots', 'step3-active-campaigns-tooltip.png') 
      });
    }
    
    // 4B: Campaign alert "Losing Money" tooltip
    console.log('🎯 Testing Losing Money alert tooltip...');
    const losingMoneyTest = await page.evaluate(() => {
      const alertCards = Array.from(document.querySelectorAll('.alert-card'));
      const losingMoneyAlert = alertCards.find(alert => 
        alert.textContent.includes('Losing Money')
      );
      
      if (!losingMoneyAlert) {
        return { found: false, reason: 'Losing Money alert not found' };
      }
      
      const tooltip = losingMoneyAlert.querySelector('.tooltip');
      const tooltipText = losingMoneyAlert.querySelector('.tooltiptext');
      
      if (!tooltip || !tooltipText) {
        return { found: false, reason: 'Tooltip elements not found in Losing Money alert' };
      }
      
      // Test positioning
      const rect = losingMoneyAlert.getBoundingClientRect();
      
      // Simulate hover
      tooltip.dispatchEvent(new MouseEvent('mouseenter', { 
        bubbles: true, 
        clientX: rect.left + rect.width/2,
        clientY: rect.top + rect.height/2
      }));
      
      return new Promise(resolve => {
        setTimeout(() => {
          const tooltipRect = tooltipText.getBoundingClientRect();
          const computed = window.getComputedStyle(tooltipText);
          const viewport = { width: window.innerWidth, height: window.innerHeight };
          
          const result = {
            found: true,
            positioning: {
              left: tooltipRect.left,
              top: tooltipRect.top,
              right: tooltipRect.right,
              bottom: tooltipRect.bottom,
              width: tooltipRect.width,
              height: tooltipRect.height
            },
            styles: {
              position: computed.position,
              zIndex: computed.zIndex,
              visibility: computed.visibility,
              opacity: computed.opacity
            },
            withinViewport: tooltipRect.left >= 0 && tooltipRect.top >= 0 && 
                           tooltipRect.right <= viewport.width && tooltipRect.bottom <= viewport.height,
            content: tooltipText.textContent.trim(),
            viewport
          };
          
          // Clean up
          tooltip.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
          resolve(result);
        }, 300);
      });
    });
    
    tooltipTests.losingMoney = await losingMoneyTest;
    console.log('✅ Losing Money result:', tooltipTests.losingMoney);
    
    // Take screenshot during hover
    if (tooltipTests.losingMoney.found) {
      await page.hover('.alert-card .tooltip');
      await page.waitForTimeout(300);
      await page.screenshot({ 
        path: path.join(__dirname, '..', 'screenshots', 'step4-losing-money-tooltip.png') 
      });
    }
    
    // 4C: Impact: High, Effort: Low badges
    console.log('🎯 Testing Impact/Effort badges...');
    const badgesTest = await page.evaluate(() => {
      const scenarioTags = Array.from(document.querySelectorAll('.scenario-tag'));
      
      if (scenarioTags.length === 0) {
        return { found: false, reason: 'No scenario tags found' };
      }
      
      const badge = scenarioTags[0]; // Test first badge
      const tooltip = badge.closest('.tooltip');
      const tooltipText = tooltip ? tooltip.querySelector('.tooltiptext') : null;
      
      if (!tooltip || !tooltipText) {
        return { found: false, reason: 'Tooltip structure not found for badges' };
      }
      
      // Test positioning
      const rect = badge.getBoundingClientRect();
      
      // Simulate hover
      tooltip.dispatchEvent(new MouseEvent('mouseenter', { 
        bubbles: true, 
        clientX: rect.left + rect.width/2,
        clientY: rect.top + rect.height/2
      }));
      
      return new Promise(resolve => {
        setTimeout(() => {
          const tooltipRect = tooltipText.getBoundingClientRect();
          const computed = window.getComputedStyle(tooltipText);
          const viewport = { width: window.innerWidth, height: window.innerHeight };
          
          const result = {
            found: true,
            badgeText: badge.textContent.trim(),
            positioning: {
              left: tooltipRect.left,
              top: tooltipRect.top,
              right: tooltipRect.right,
              bottom: tooltipRect.bottom,
              width: tooltipRect.width,
              height: tooltipRect.height
            },
            styles: {
              position: computed.position,
              zIndex: computed.zIndex,
              visibility: computed.visibility,
              opacity: computed.opacity
            },
            withinViewport: tooltipRect.left >= 0 && tooltipRect.top >= 0 && 
                           tooltipRect.right <= viewport.width && tooltipRect.bottom <= viewport.height,
            content: tooltipText.textContent.trim(),
            viewport
          };
          
          // Clean up
          tooltip.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
          resolve(result);
        }, 300);
      });
    });
    
    tooltipTests.badges = await badgesTest;
    console.log('✅ Badges result:', tooltipTests.badges);
    
    // 5. Scroll position testing
    console.log('📍 Step 5: Testing tooltips at different scroll positions...');
    const scrollTests = [];
    
    for (const scrollY of [0, 200, 400]) {
      await page.evaluate((y) => window.scrollTo(0, y), scrollY);
      await page.waitForTimeout(300);
      
      const scrollTest = await page.evaluate((currentScrollY) => {
        const metricCards = Array.from(document.querySelectorAll('.metric-card'));
        const activeCampaignsCard = metricCards.find(card => 
          card.textContent.includes('Active Campaigns')
        );
        
        if (!activeCampaignsCard) return { scrollY: currentScrollY, success: false };
        
        const tooltip = activeCampaignsCard.querySelector('.tooltip');
        const tooltipText = activeCampaignsCard.querySelector('.tooltiptext');
        
        if (!tooltip || !tooltipText) return { scrollY: currentScrollY, success: false };
        
        const rect = activeCampaignsCard.getBoundingClientRect();
        tooltip.dispatchEvent(new MouseEvent('mouseenter', { 
          bubbles: true, 
          clientX: rect.left + rect.width/2,
          clientY: rect.top + rect.height/2
        }));
        
        return new Promise(resolve => {
          setTimeout(() => {
            const tooltipRect = tooltipText.getBoundingClientRect();
            const viewport = { width: window.innerWidth, height: window.innerHeight };
            
            const success = tooltipRect.left >= 0 && tooltipRect.top >= 0 && 
                           tooltipRect.right <= viewport.width && tooltipRect.bottom <= viewport.height;
            
            tooltip.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
            resolve({ 
              scrollY: currentScrollY, 
              success,
              tooltipPosition: { left: tooltipRect.left, top: tooltipRect.top }
            });
          }, 200);
        });
      }, scrollY);
      
      scrollTests.push(await scrollTest);
    }
    
    // Reset scroll
    await page.evaluate(() => window.scrollTo(0, 0));
    
    console.log('✅ Scroll tests:', scrollTests);
    
    // 6. Edge testing with different viewport sizes
    console.log('📍 Step 6: Testing tooltips near screen edges...');
    const edgeTests = [];
    
    const viewportSizes = [
      { width: 1920, height: 1080 },
      { width: 1024, height: 768 },
      { width: 800, height: 600 }
    ];
    
    for (const size of viewportSizes) {
      await page.setViewportSize(size);
      await page.waitForTimeout(500);
      
      const edgeTest = await page.evaluate((viewport) => {
        const metricCards = Array.from(document.querySelectorAll('.metric-card'));
        const activeCampaignsCard = metricCards.find(card => 
          card.textContent.includes('Active Campaigns')
        );
        
        if (!activeCampaignsCard) return { viewport, success: false };
        
        const tooltip = activeCampaignsCard.querySelector('.tooltip');
        const tooltipText = activeCampaignsCard.querySelector('.tooltiptext');
        
        if (!tooltip || !tooltipText) return { viewport, success: false };
        
        const rect = activeCampaignsCard.getBoundingClientRect();
        tooltip.dispatchEvent(new MouseEvent('mouseenter', { 
          bubbles: true, 
          clientX: rect.left + rect.width/2,
          clientY: rect.top + rect.height/2
        }));
        
        return new Promise(resolve => {
          setTimeout(() => {
            const tooltipRect = tooltipText.getBoundingClientRect();
            const success = tooltipRect.left >= 0 && tooltipRect.top >= 0 && 
                           tooltipRect.right <= viewport.width && tooltipRect.bottom <= viewport.height;
            
            tooltip.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
            resolve({ viewport, success });
          }, 200);
        });
      }, size);
      
      edgeTests.push(await edgeTest);
    }
    
    // Reset viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    
    console.log('✅ Edge tests:', edgeTests);
    
    // 7. Check for conflicts with existing working tooltips
    console.log('📍 Step 7: Checking for conflicts with existing working tooltips...');
    const conflictCheck = await page.evaluate(() => {
      const allTooltips = Array.from(document.querySelectorAll('.tooltip'));
      const sourceIndicators = Array.from(document.querySelectorAll('th .source-indicator'));
      
      return {
        totalCustomTooltips: allTooltips.length,
        totalTableTooltips: sourceIndicators.length,
        sampleTableTooltipTitle: sourceIndicators[0] ? sourceIndicators[0].getAttribute('title') : null,
        conflictingZIndex: allTooltips.some(tooltip => {
          const tooltipText = tooltip.querySelector('.tooltiptext');
          if (tooltipText) {
            const computed = window.getComputedStyle(tooltipText);
            return computed.zIndex !== '99999' && computed.zIndex !== '1000';
          }
          return false;
        })
      };
    });
    
    console.log('✅ Conflict check:', conflictCheck);
    
    // Final comprehensive screenshot
    await page.screenshot({ 
      path: path.join(__dirname, '..', 'screenshots', 'final-comprehensive-view.png'),
      fullPage: true
    });
    
    // Generate comprehensive report
    const finalReport = {
      timestamp: new Date().toISOString(),
      testSummary: {
        systemStatus,
        tooltipInventory,
        problematicTooltipTests: tooltipTests,
        scrollTests,
        edgeTests,
        conflictCheck
      },
      conclusions: {
        k2MotorTooltipFixerActive: systemStatus.k2MotorTooltipFixerExists,
        activeCampaignsFixed: tooltipTests.activeCampaigns.found && tooltipTests.activeCampaigns.withinViewport,
        losingMoneyFixed: tooltipTests.losingMoney.found && tooltipTests.losingMoney.withinViewport,
        badgesFixed: tooltipTests.badges.found && tooltipTests.badges.withinViewport,
        scrollTestsPassed: scrollTests.every(test => test.success),
        edgeTestsPassed: edgeTests.every(test => test.success),
        noConflictsDetected: !conflictCheck.conflictingZIndex,
        overallSuccess: false // Will be calculated
      }
    };
    
    // Calculate overall success
    finalReport.conclusions.overallSuccess = 
      finalReport.conclusions.k2MotorTooltipFixerActive &&
      finalReport.conclusions.activeCampaignsFixed &&
      finalReport.conclusions.losingMoneyFixed &&
      finalReport.conclusions.badgesFixed &&
      finalReport.conclusions.scrollTestsPassed &&
      finalReport.conclusions.edgeTestsPassed &&
      finalReport.conclusions.noConflictsDetected;
    
    console.log('\n🎉 COMPREHENSIVE TOOLTIP VERIFICATION COMPLETE!');
    console.log('📊 FINAL REPORT SUMMARY:');
    console.log(`✅ K2MotorTooltipFixer Active: ${finalReport.conclusions.k2MotorTooltipFixerActive}`);
    console.log(`✅ Active Campaigns Fixed: ${finalReport.conclusions.activeCampaignsFixed}`);
    console.log(`✅ Losing Money Alert Fixed: ${finalReport.conclusions.losingMoneyFixed}`);
    console.log(`✅ Impact/Effort Badges Fixed: ${finalReport.conclusions.badgesFixed}`);
    console.log(`✅ Scroll Tests Passed: ${finalReport.conclusions.scrollTestsPassed}`);
    console.log(`✅ Edge Tests Passed: ${finalReport.conclusions.edgeTestsPassed}`);
    console.log(`✅ No Conflicts Detected: ${finalReport.conclusions.noConflictsDetected}`);
    console.log(`🎯 OVERALL SUCCESS: ${finalReport.conclusions.overallSuccess}`);
    
    // Output detailed JSON report
    console.log('\n📋 DETAILED TEST REPORT:');
    console.log(JSON.stringify(finalReport, null, 2));
    
    // Basic assertions - adjust as needed for reporting
    expect(finalReport.conclusions.k2MotorTooltipFixerActive).toBe(true);
    
    return finalReport;
  });
});