const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Comprehensive K2Motor Tooltip Fixes Testing', () => {
  test('Complete tooltip positioning and functionality verification', async ({ page }) => {
    console.log('🚀 Starting comprehensive K2Motor tooltip fixes testing...');
    
    // Test setup and navigation
    await page.addInitScript(() => {
      localStorage.setItem('k2motor-welcome-shown', 'true');
    });
    
    await page.goto('http://localhost:8000');
    await page.waitForSelector('.dashboard-container', { timeout: 10000 });
    
    // Step 1: Close any welcome popup
    console.log('📋 Step 1: Closing welcome popup...');
    await page.evaluate(() => {
      document.querySelectorAll('.popup-overlay, .welcome-popup, .modal-overlay').forEach(el => el.remove());
    });
    
    await page.waitForTimeout(2000); // Allow tooltip fixes to initialize
    
    // Step 2: Switch to Campaign Deep Dive tab
    console.log('📋 Step 2: Switching to Campaign Deep Dive tab...');
    await page.evaluate(() => {
      const campaignsTab = document.querySelector('[data-tab="campaigns"]');
      if (campaignsTab) campaignsTab.click();
    });
    
    await page.waitForTimeout(1500);
    await page.screenshot({ 
      path: path.join(__dirname, '..', 'screenshots', 'campaigns-tab-loaded.png'),
      fullPage: true
    });
    
    // Verify K2MotorTooltipFixer system is active
    const tooltipFixerStatus = await page.evaluate(() => {
      return {
        k2MotorTooltipFixerExists: typeof window.k2MotorTooltipFixer !== 'undefined',
        fixerInitialized: window.k2MotorTooltipFixer ? window.k2MotorTooltipFixer.tooltips.length >= 0 : false,
        viewportAwareAlgorithm: window.k2MotorTooltipFixer ? typeof window.k2MotorTooltipFixer.updatePosition === 'function' : false
      };
    });
    
    console.log('🔧 K2MotorTooltipFixer Status:', tooltipFixerStatus);
    expect(tooltipFixerStatus.k2MotorTooltipFixerExists).toBe(true);
    
    // Step 3: Test the three problematic tooltips
    console.log('📋 Step 3: Testing three problematic tooltips...');
    
    // 3A: Active Campaigns metric card tooltip
    console.log('🎯 Testing Active Campaigns metric card tooltip...');
    const activeCampaignsResult = await testTooltipPositioning(page, 'active-campaigns');
    
    // 3B: Campaign alert "Losing Money" tooltip  
    console.log('🎯 Testing Losing Money alert tooltip...');
    const losingMoneyResult = await testTooltipPositioning(page, 'losing-money');
    
    // 3C: Impact/Effort badges tooltips
    console.log('🎯 Testing Impact: High, Effort: Low badges...');
    const badgesResult = await testTooltipPositioning(page, 'badges');
    
    // Step 4: Detailed positioning analysis for each tooltip
    console.log('📏 Step 4: Detailed positioning analysis...');
    
    const detailedResults = await page.evaluate(() => {
      const results = {};
      
      // Get viewport dimensions
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      
      // Test Active Campaigns tooltip
      const activeCampaignsCard = Array.from(document.querySelectorAll('.metric-card'))
        .find(card => card.textContent.includes('Active Campaigns'));
      
      if (activeCampaignsCard) {
        const tooltip = activeCampaignsCard.querySelector('.tooltip');
        const tooltipText = activeCampaignsCard.querySelector('.tooltiptext');
        
        if (tooltip && tooltipText) {
          // Trigger hover
          tooltip.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
          
          // Get positioning after tooltip shows
          setTimeout(() => {
            const rect = tooltipText.getBoundingClientRect();
            const computed = window.getComputedStyle(tooltipText);
            
            results.activeCampaigns = {
              found: true,
              positioning: {
                left: rect.left,
                top: rect.top,
                right: rect.right,
                bottom: rect.bottom,
                width: rect.width,
                height: rect.height
              },
              styles: {
                position: computed.position,
                zIndex: computed.zIndex,
                visibility: computed.visibility,
                opacity: computed.opacity
              },
              withinViewport: {
                left: rect.left >= 0,
                top: rect.top >= 0,
                right: rect.right <= viewport.width,
                bottom: rect.bottom <= viewport.height
              }
            };
          }, 100);
          
          // Clean up
          tooltip.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
        }
      }
      
      // Test Losing Money alert tooltip
      const losingMoneyAlert = Array.from(document.querySelectorAll('.alert-card'))
        .find(alert => alert.textContent.includes('Losing Money'));
      
      if (losingMoneyAlert) {
        const tooltip = losingMoneyAlert.querySelector('.tooltip');
        const tooltipText = losingMoneyAlert.querySelector('.tooltiptext');
        
        if (tooltip && tooltipText) {
          tooltip.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
          
          setTimeout(() => {
            const rect = tooltipText.getBoundingClientRect();
            const computed = window.getComputedStyle(tooltipText);
            
            results.losingMoney = {
              found: true,
              positioning: {
                left: rect.left,
                top: rect.top,
                right: rect.right,
                bottom: rect.bottom,
                width: rect.width,
                height: rect.height
              },
              styles: {
                position: computed.position,
                zIndex: computed.zIndex,
                visibility: computed.visibility,
                opacity: computed.opacity
              },
              withinViewport: {
                left: rect.left >= 0,
                top: rect.top >= 0,
                right: rect.right <= viewport.width,
                bottom: rect.bottom <= viewport.height
              }
            };
          }, 100);
          
          tooltip.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
        }
      }
      
      // Test badge tooltips
      const badges = document.querySelectorAll('.scenario-tag');
      if (badges.length > 0) {
        const badge = badges[0];
        const tooltip = badge.closest('.tooltip');
        const tooltipText = tooltip ? tooltip.querySelector('.tooltiptext') : null;
        
        if (tooltip && tooltipText) {
          tooltip.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
          
          setTimeout(() => {
            const rect = tooltipText.getBoundingClientRect();
            const computed = window.getComputedStyle(tooltipText);
            
            results.badges = {
              found: true,
              positioning: {
                left: rect.left,
                top: rect.top,
                right: rect.right,
                bottom: rect.bottom,
                width: rect.width,
                height: rect.height
              },
              styles: {
                position: computed.position,
                zIndex: computed.zIndex,
                visibility: computed.visibility,
                opacity: computed.opacity
              },
              withinViewport: {
                left: rect.left >= 0,
                top: rect.top >= 0,
                right: rect.right <= viewport.width,
                bottom: rect.bottom <= viewport.height
              }
            };
          }, 100);
          
          tooltip.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
        }
      }
      
      results.viewport = viewport;
      return results;
    });
    
    // Wait for evaluation to complete
    await page.waitForTimeout(500);
    
    console.log('📊 Detailed positioning results:', JSON.stringify(detailedResults, null, 2));
    
    // Step 5: Screenshot verification for each tooltip
    console.log('📸 Step 5: Taking positioning verification screenshots...');
    
    // Active Campaigns tooltip screenshot
    if (activeCampaignsResult.found) {
      await page.hover('.metric-card .tooltip');
      await page.waitForTimeout(300);
      await page.screenshot({ 
        path: path.join(__dirname, '..', 'screenshots', 'active-campaigns-positioning.png') 
      });
      console.log('📸 Active Campaigns tooltip screenshot captured');
    }
    
    // Losing Money tooltip screenshot
    if (losingMoneyResult.found) {
      await page.hover('.alert-card .tooltip');
      await page.waitForTimeout(300);
      await page.screenshot({ 
        path: path.join(__dirname, '..', 'screenshots', 'losing-money-positioning.png') 
      });
      console.log('📸 Losing Money tooltip screenshot captured');
    }
    
    // Badges tooltip screenshot
    if (badgesResult.found) {
      await page.hover('.tooltip .scenario-tag');
      await page.waitForTimeout(300);
      await page.screenshot({ 
        path: path.join(__dirname, '..', 'screenshots', 'badges-positioning.png') 
      });
      console.log('📸 Badges tooltip screenshot captured');
    }
    
    // Step 6: Scroll testing
    console.log('🔄 Step 6: Testing tooltips with different scroll positions...');
    
    const scrollTestResults = await performScrollTests(page);
    
    // Step 7: Edge testing
    console.log('🏁 Step 7: Testing tooltips near screen edges...');
    
    const edgeTestResults = await performEdgeTests(page);
    
    // Step 8: Conflict testing with existing tooltips
    console.log('⚡ Step 8: Testing for conflicts with existing working tooltips...');
    
    const conflictTestResults = await testTooltipConflicts(page);
    
    // Step 9: Generate comprehensive report
    console.log('📋 Step 9: Generating comprehensive test report...');
    
    const finalReport = {
      timestamp: new Date().toISOString(),
      tooltipFixerStatus,
      individualTooltipTests: {
        activeCampaigns: activeCampaignsResult,
        losingMoney: losingMoneyResult,
        badges: badgesResult
      },
      detailedPositioning: detailedResults,
      scrollTests: scrollTestResults,
      edgeTests: edgeTestResults,
      conflictTests: conflictTestResults,
      summary: {
        totalTooltipsTested: 3,
        successfullyFixed: [activeCampaignsResult, losingMoneyResult, badgesResult].filter(r => r.positioningFixed).length,
        allWithinViewport: [activeCampaignsResult, losingMoneyResult, badgesResult].every(r => r.withinViewport),
        k2MotorFixerWorking: tooltipFixerStatus.k2MotorTooltipFixerExists && tooltipFixerStatus.viewportAwareAlgorithm
      }
    };
    
    console.log('\n🎉 COMPREHENSIVE TOOLTIP TEST COMPLETE!');
    console.log('📊 Final Report Summary:');
    console.log(`✅ K2MotorTooltipFixer Active: ${finalReport.summary.k2MotorFixerWorking}`);
    console.log(`✅ Tooltips Successfully Fixed: ${finalReport.summary.successfullyFixed}/3`);
    console.log(`✅ All Tooltips Within Viewport: ${finalReport.summary.allWithinViewport}`);
    console.log(`✅ Scroll Tests Passed: ${scrollTestResults.allPassed}`);
    console.log(`✅ Edge Tests Passed: ${edgeTestResults.allPassed}`);
    console.log(`✅ No Conflicts Detected: ${conflictTestResults.noConflicts}`);
    
    // Take final comprehensive screenshot
    await page.screenshot({ 
      path: path.join(__dirname, '..', 'screenshots', 'comprehensive-test-complete.png'),
      fullPage: true
    });
    
    // Assertions
    expect(finalReport.summary.k2MotorFixerWorking).toBe(true);
    expect(finalReport.summary.successfullyFixed).toBe(3);
    expect(finalReport.summary.allWithinViewport).toBe(true);
    expect(scrollTestResults.allPassed).toBe(true);
    expect(edgeTestResults.allPassed).toBe(true);
    expect(conflictTestResults.noConflicts).toBe(true);
    
    // Save detailed report
    await page.evaluate((report) => {
      console.log('COMPREHENSIVE TOOLTIP TEST REPORT:', JSON.stringify(report, null, 2));
    }, finalReport);
    
    return finalReport;
  });
});

// Helper function to test individual tooltip positioning
async function testTooltipPositioning(page, tooltipType) {
  return await page.evaluate((type) => {
    let element, tooltip, tooltipText;
    
    switch (type) {
      case 'active-campaigns':
        element = Array.from(document.querySelectorAll('.metric-card'))
          .find(card => card.textContent.includes('Active Campaigns'));
        if (element) {
          tooltip = element.querySelector('.tooltip');
          tooltipText = element.querySelector('.tooltiptext');
        }
        break;
        
      case 'losing-money':
        element = Array.from(document.querySelectorAll('.alert-card'))
          .find(alert => alert.textContent.includes('Losing Money'));
        if (element) {
          tooltip = element.querySelector('.tooltip');
          tooltipText = element.querySelector('.tooltiptext');
        }
        break;
        
      case 'badges':
        const badge = document.querySelector('.scenario-tag');
        if (badge) {
          tooltip = badge.closest('.tooltip');
          tooltipText = tooltip ? tooltip.querySelector('.tooltiptext') : null;
        }
        break;
    }
    
    if (!tooltip || !tooltipText) {
      return { found: false, type };
    }
    
    // Trigger hover
    tooltip.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    
    // Wait a moment for positioning
    return new Promise(resolve => {
      setTimeout(() => {
        const rect = tooltipText.getBoundingClientRect();
        const computed = window.getComputedStyle(tooltipText);
        const viewport = { width: window.innerWidth, height: window.innerHeight };
        
        const result = {
          found: true,
          type,
          coordinates: {
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom
          },
          withinViewport: rect.left >= 0 && rect.top >= 0 && 
                          rect.right <= viewport.width && rect.bottom <= viewport.height,
          positioningFixed: computed.position === 'fixed' && computed.zIndex === '99999',
          visible: computed.visibility === 'visible' && computed.opacity !== '0',
          content: tooltipText.textContent.trim()
        };
        
        // Clean up
        tooltip.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
        
        resolve(result);
      }, 200);
    });
  }, tooltipType);
}

// Helper function to perform scroll tests
async function performScrollTests(page) {
  const results = [];
  
  // Test at different scroll positions
  const scrollPositions = [0, 200, 400, 600];
  
  for (const scrollY of scrollPositions) {
    await page.evaluate((y) => window.scrollTo(0, y), scrollY);
    await page.waitForTimeout(300);
    
    const testResult = await testTooltipPositioning(page, 'active-campaigns');
    results.push({
      scrollPosition: scrollY,
      tooltipWorking: testResult.found && testResult.positioningFixed,
      withinViewport: testResult.withinViewport
    });
  }
  
  // Reset scroll
  await page.evaluate(() => window.scrollTo(0, 0));
  
  return {
    results,
    allPassed: results.every(r => r.tooltipWorking && r.withinViewport)
  };
}

// Helper function to perform edge tests
async function performEdgeTests(page) {
  const results = [];
  
  // Resize window to test edge cases
  const viewportSizes = [
    { width: 1920, height: 1080 },
    { width: 1366, height: 768 },
    { width: 1024, height: 768 },
    { width: 800, height: 600 }
  ];
  
  for (const size of viewportSizes) {
    await page.setViewportSize(size);
    await page.waitForTimeout(300);
    
    const testResult = await testTooltipPositioning(page, 'losing-money');
    results.push({
      viewport: size,
      tooltipWorking: testResult.found && testResult.positioningFixed,
      withinViewport: testResult.withinViewport
    });
  }
  
  // Reset to default size
  await page.setViewportSize({ width: 1280, height: 720 });
  
  return {
    results,
    allPassed: results.every(r => r.tooltipWorking && r.withinViewport)
  };
}

// Helper function to test tooltip conflicts
async function testTooltipConflicts(page) {
  return await page.evaluate(() => {
    const allTooltips = document.querySelectorAll('.tooltip');
    const conflicts = [];
    
    // Test that all tooltips use consistent z-index and positioning
    allTooltips.forEach((tooltip, index) => {
      const tooltipText = tooltip.querySelector('.tooltiptext');
      if (tooltipText) {
        const computed = window.getComputedStyle(tooltipText);
        
        // Check for inconsistent styling that might indicate conflicts
        if (computed.position !== 'fixed' && computed.position !== 'absolute') {
          conflicts.push(`Tooltip ${index}: Unexpected position ${computed.position}`);
        }
        
        if (computed.zIndex !== '99999' && computed.zIndex !== '1000') {
          conflicts.push(`Tooltip ${index}: Unexpected z-index ${computed.zIndex}`);
        }
      }
    });
    
    return {
      totalTooltips: allTooltips.length,
      conflicts,
      noConflicts: conflicts.length === 0
    };
  });
}