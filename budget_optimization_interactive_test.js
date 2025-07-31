const { chromium } = require('playwright');

async function testBudgetOptimizationInteractively() {
    console.log('🎯 Starting interactive Budget Optimization testing...');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 500
    });
    
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();
    
    try {
        await page.goto('http://localhost:8000');
        
        // Wait for dashboard and close welcome popup
        await page.waitForSelector('.dashboard-container', { timeout: 10000 });
        
        const welcomePopup = page.locator('.welcome-overlay, .popup-overlay');
        if (await welcomePopup.isVisible()) {
            const closeButton = page.locator('.close-btn, .close, [aria-label="Close"]').first();
            if (await closeButton.isVisible()) {
                await closeButton.click();
                await page.waitForTimeout(1000);
            }
        }
        
        // Click Budget Optimization tab
        await page.locator('[data-tab="budget"]').click();
        await page.waitForTimeout(2000);
        
        console.log('✅ Budget Optimization tab activated');
        
        // Test 1: Interactive Budget Sliders (if they exist in the future implementation)
        console.log('🔧 Testing budget sliders...');
        const sliders = await page.locator('input[type="range"], .budget-slider').count();
        console.log(`Found ${sliders} budget sliders`);
        
        // Test 2: Click recommendation buttons
        console.log('🔘 Testing recommendation buttons...');
        const recButtons = await page.locator('.rec-btn, button[class*="rec"], .btn-action').all();
        
        for (let i = 0; i < Math.min(recButtons.length, 3); i++) {
            const button = recButtons[i];
            const buttonText = await button.textContent();
            const isVisible = await button.isVisible();
            
            if (isVisible && buttonText) {
                console.log(`Testing button: "${buttonText.trim()}"`);
                try {
                    await button.click();
                    await page.waitForTimeout(1000);
                    
                    // Check for any alerts or modals
                    const alertCount = await page.locator('.alert, .notification, .popup').count();
                    console.log(`  -> Generated ${alertCount} alerts/notifications`);
                    
                } catch (error) {
                    console.log(`  -> Error clicking: ${error.message}`);
                }
            }
        }
        
        // Test 3: Scenario buttons
        console.log('🎮 Testing scenario buttons...');
        const scenarioButtons = await page.locator('.scenario-btn, button[onclick*="Scenario"], button[onclick*="scenario"]').all();
        
        for (let i = 0; i < scenarioButtons.length; i++) {
            const button = scenarioButtons[i]; 
            const buttonText = await button.textContent();
            
            if (buttonText) {
                console.log(`Testing scenario: "${buttonText.trim()}"`);
                try {
                    await button.click();
                    await page.waitForTimeout(1500);
                    
                    // Check if simulator results updated
                    const resultsContent = await page.locator('#simulator-results, .simulator-results').textContent().catch(() => '');
                    console.log(`  -> Results preview: ${resultsContent.substring(0, 100)}...`);
                    
                } catch (error) {
                    console.log(`  -> Error: ${error.message}`);
                }
            }
        }
        
        // Test 4: Toggle switches for auto-optimization
        console.log('🔄 Testing toggle switches...');
        const toggles = await page.locator('input[type="checkbox"].auto-optimization, .toggle-switch input').count();
        console.log(`Found ${toggles} auto-optimization toggles`);
        
        // Test 5: Check data indicators and tooltips
        console.log('💡 Testing data source indicators...');
        const dataIndicators = await page.locator('.source-indicator, [data-source]').all();
        
        for (let i = 0; i < Math.min(dataIndicators.length, 5); i++) {
            const indicator = dataIndicators[i];
            const dataSource = await indicator.getAttribute('data-source');
            const title = await indicator.getAttribute('title');
            
            console.log(`Data indicator ${i + 1}: Source="${dataSource}", Title="${title}"`);
            
            // Try hovering to see tooltip
            try {
                await indicator.hover();
                await page.waitForTimeout(500);
                
                const tooltipVisible = await page.locator('.tooltip, [role="tooltip"]').isVisible().catch(() => false);
                console.log(`  -> Tooltip visible: ${tooltipVisible}`);
                
            } catch (error) {
                console.log(`  -> Hover error: ${error.message}`);
            }
        }
        
        // Test 6: Check POAS vs ROAS table interaction
        console.log('📊 Testing POAS analysis table...');
        const poasTable = await page.locator('.poas-table, table').first();
        if (await poasTable.isVisible()) {
            const rows = await poasTable.locator('tr').count();
            console.log(`POAS table has ${rows} rows`);
            
            // Try clicking on table rows
            const dataRows = await poasTable.locator('tbody tr, tr[class*="campaign"]').all();
            for (let i = 0; i < Math.min(dataRows.length, 2); i++) {
                const row = dataRows[i];
                const campaignName = await row.locator('td').first().textContent();
                
                console.log(`Testing table row: "${campaignName}"`);
                try {
                    await row.click();
                    await page.waitForTimeout(500);
                } catch (error) {
                    console.log(`  -> Row click error: ${error.message}`);
                }
            }
        }
        
        // Test 7: Budget allocation cards
        console.log('💳 Testing budget allocation cards...');
        const allocationCards = await page.locator('.allocation-card, .budget-card').count();
        console.log(`Found ${allocationCards} allocation cards`);
        
        // Final screenshot
        await page.screenshot({ 
            path: './dashboard/screenshots/budget_interactive_test_final.png',
            fullPage: true 
        });
        
        console.log('📋 BUDGET OPTIMIZATION INTERACTIVE TEST SUMMARY');
        console.log('=' .repeat(60));
        console.log(`✅ Tab successfully activated and tested`);
        console.log(`🔘 Recommendation buttons tested`);
        console.log(`🎮 Scenario buttons tested`);
        console.log(`💡 Data indicators checked`);  
        console.log(`📊 POAS table interaction tested`);
        console.log(`💳 Budget allocation cards found: ${allocationCards}`);
        console.log(`🔄 Auto-optimization toggles: ${toggles}`);
        console.log('📸 Final screenshot saved: budget_interactive_test_final.png');
        console.log('=' .repeat(60));
        
        // Keep browser open for manual inspection
        console.log('🔍 Browser left open for manual inspection. Press Ctrl+C to close.');
        await page.waitForTimeout(30000); // Wait 30 seconds for manual inspection
        
    } catch (error) {
        console.error('❌ Error during interactive testing:', error.message);
        await page.screenshot({ 
            path: './dashboard/screenshots/budget_interactive_error.png',
            fullPage: true 
        });
    } finally {
        await browser.close();
    }
}

testBudgetOptimizationInteractively().catch(console.error);