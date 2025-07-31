const { chromium } = require('playwright');
const fs = require('fs');

async function exploreBudgetOptimization() {
    console.log('🚀 Starting Budget Optimization Tab exploration...');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 1000 // Slow down interactions for better observation
    });
    
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();
    
    // Enable console logging from the page
    page.on('console', msg => {
        console.log(`PAGE LOG: ${msg.text()}`);
    });
    
    // Enable error logging
    page.on('pageerror', error => {
        console.error(`PAGE ERROR: ${error.message}`);
    });
    
    try {
        console.log('📝 Navigating to K2Motor dashboard...');
        await page.goto('http://localhost:8000');
        
        // Wait for the page to load
        await page.waitForSelector('.dashboard-container', { timeout: 10000 });
        console.log('✅ Dashboard loaded successfully');
        
        // Handle welcome popup if it exists
        console.log('🔍 Checking for welcome popup...');
        const welcomePopup = page.locator('.welcome-overlay, .popup-overlay');
        if (await welcomePopup.isVisible()) {
            console.log('👋 Welcome popup detected, attempting to close...');
            const closeButton = page.locator('.close-btn, .close, [aria-label="Close"]').first();
            if (await closeButton.isVisible()) {
                await closeButton.click();
                await page.waitForTimeout(1000);
                console.log('✅ Welcome popup closed');
            } else {
                // Try clicking outside the popup
                await page.click('body', { position: { x: 100, y: 100 } });
                await page.waitForTimeout(1000);
                console.log('✅ Clicked outside popup to close');
            }
        }
        
        // Take initial screenshot
        await page.screenshot({ 
            path: './dashboard/screenshots/budget_opt_initial.png',
            fullPage: true 
        });
        console.log('📸 Initial screenshot taken');
        
        // Find and click the Budget Optimization tab
        console.log('🎯 Looking for Budget Optimization tab...');
        const budgetTab = await page.locator('[data-tab="budget"]');
        const isTabVisible = await budgetTab.isVisible();
        console.log(`Budget tab visible: ${isTabVisible}`);
        
        if (isTabVisible) {
            console.log('👆 Clicking Budget Optimization tab...');
            await budgetTab.click();
            
            // Wait for tab content to load
            await page.waitForTimeout(2000);
            
            // Take screenshot after tab switch
            await page.screenshot({ 
                path: './dashboard/screenshots/budget_opt_tab_active.png',
                fullPage: true 
            });
            console.log('📸 Budget tab active screenshot taken');
            
            // Check if the tab is now active
            const isTabActive = await budgetTab.evaluate(el => el.classList.contains('active'));
            console.log(`Budget tab is active: ${isTabActive}`);
            
        } else {
            console.log('❌ Budget Optimization tab not found');
            return;
        }
        
        // Wait for content to load
        await page.waitForTimeout(3000);
        
        // Document all visible sections and components
        console.log('🔍 Analyzing Budget Optimization tab content...');
        
        const tabContent = await page.locator('#tab-content').innerHTML();
        console.log('Tab content loaded, analyzing components...');
        
        // Look for main sections/containers
        const sections = await page.locator('#tab-content .section, #tab-content .card, #tab-content .budget-section, #tab-content .optimization-card').all();
        console.log(`Found ${sections.length} main sections/cards`);
        
        const sectionInfo = [];
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const classList = await section.getAttribute('class');
            const textContent = await section.textContent();
            const hasButtons = await section.locator('button').count();
            const hasInputs = await section.locator('input, select, textarea').count();
            
            sectionInfo.push({
                index: i,
                classes: classList,
                textPreview: textContent ? textContent.substring(0, 100) + '...' : 'No text',
                buttonCount: hasButtons,
                inputCount: hasInputs
            });
        }
        
        // Look for specific Budget Optimization elements
        const budgetElements = {
            budgetCards: await page.locator('.budget-card, .optimization-card, .spend-card').count(),
            budgetCharts: await page.locator('.chart, .graph, canvas, svg').count(),
            budgetButtons: await page.locator('button').count(),
            budgetInputs: await page.locator('input, select, textarea').count(),
            budgetTables: await page.locator('table, .table').count(),
            budgetMetrics: await page.locator('.metric, .kpi, .stat').count()
        };
        
        console.log('📊 Budget Optimization Elements Found:');
        console.log(JSON.stringify(budgetElements, null, 2));
        
        // Try to interact with buttons and clickable elements
        console.log('🖱️  Testing interactive elements...');
        const buttons = await page.locator('button:visible').all();
        const interactions = [];
        
        for (let i = 0; i < Math.min(buttons.length, 5); i++) { // Test up to 5 buttons
            const button = buttons[i];
            const buttonText = await button.textContent();
            const isEnabled = await button.isEnabled();
            
            console.log(`Testing button ${i + 1}: "${buttonText}" (enabled: ${isEnabled})`);
            
            if (isEnabled && buttonText && !buttonText.includes('Close')) {
                try {
                    await button.click();
                    await page.waitForTimeout(1000);
                    
                    // Check for any modals, popups, or content changes
                    const hasModal = await page.locator('.modal, .popup, .overlay').count() > 0;
                    const hasAlert = await page.locator('.alert, .notification').count() > 0;
                    
                    interactions.push({
                        buttonText: buttonText.trim(),
                        resulted_in_modal: hasModal,
                        resulted_in_alert: hasAlert,
                        working: true
                    });
                    
                    // Close any modals that opened
                    if (hasModal) {
                        const closeButton = page.locator('.close, .close-btn, [aria-label="Close"]').first();
                        if (await closeButton.isVisible()) {
                            await closeButton.click();
                            await page.waitForTimeout(500);
                        }
                    }
                    
                } catch (error) {
                    interactions.push({
                        buttonText: buttonText.trim(),
                        error: error.message,
                        working: false
                    });
                }
            }
        }
        
        // Look for tooltips
        console.log('💡 Testing tooltips...');
        const elementsWithTooltips = await page.locator('[data-tooltip], [title], .tooltip-trigger').all();
        const tooltipTests = [];
        
        for (let i = 0; i < Math.min(elementsWithTooltips.length, 3); i++) {
            const element = elementsWithTooltips[i];
            const tooltipText = await element.getAttribute('data-tooltip') || await element.getAttribute('title');
            
            try {
                await element.hover();
                await page.waitForTimeout(500);
                
                const tooltipVisible = await page.locator('.tooltip, [role="tooltip"]').isVisible().catch(() => false);
                
                tooltipTests.push({
                    element_index: i,
                    tooltip_text: tooltipText,
                    tooltip_shows: tooltipVisible
                });
                
            } catch (error) {
                tooltipTests.push({
                    element_index: i,
                    tooltip_text: tooltipText,
                    error: error.message
                });
            }
        }
        
        // Look for forms and inputs
        console.log('📝 Testing forms and inputs...');
        const inputs = await page.locator('input:visible, select:visible, textarea:visible').all();
        const formElements = [];
        
        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];
            const type = await input.getAttribute('type') || 'text';
            const placeholder = await input.getAttribute('placeholder');
            const name = await input.getAttribute('name');
            const isEnabled = await input.isEnabled();
            
            formElements.push({
                index: i,
                type: type,
                placeholder: placeholder,
                name: name,
                enabled: isEnabled
            });
        }
        
        // Take final detailed screenshot
        await page.screenshot({ 
            path: './dashboard/screenshots/budget_opt_detailed.png',
            fullPage: true 
        });
        
        // Compile comprehensive report
        const report = {
            timestamp: new Date().toISOString(),
            tab_active: await budgetTab.evaluate(el => el.classList.contains('active')),
            sections_found: sectionInfo,
            element_counts: budgetElements,
            button_interactions: interactions,
            tooltip_tests: tooltipTests,
            form_elements: formElements,
            screenshots_taken: [
                './dashboard/screenshots/budget_opt_initial.png',
                './dashboard/screenshots/budget_opt_tab_active.png',
                './dashboard/screenshots/budget_opt_detailed.png'
            ]
        };
        
        // Save detailed report
        fs.writeFileSync('./budget_optimization_exploration_report.json', JSON.stringify(report, null, 2));
        
        console.log('📋 BUDGET OPTIMIZATION TAB EXPLORATION COMPLETE');
        console.log('=' .repeat(60));
        console.log(`✅ Tab successfully activated: ${report.tab_active}`);
        console.log(`📦 Sections/Cards found: ${report.sections_found.length}`);
        console.log(`🔘 Buttons found: ${report.element_counts.budgetButtons}`);
        console.log(`📊 Charts found: ${report.element_counts.budgetCharts}`);
        console.log(`📝 Form inputs found: ${report.form_elements.length}`);
        console.log(`🏷️  Elements with tooltips: ${report.tooltip_tests.length}`);
        console.log('=' .repeat(60));
        
        // Print section details
        if (report.sections_found.length > 0) {
            console.log('📑 SECTION DETAILS:');
            report.sections_found.forEach((section, index) => {
                console.log(`  ${index + 1}. Classes: ${section.classes}`);
                console.log(`     Buttons: ${section.buttonCount}, Inputs: ${section.inputCount}`);
                console.log(`     Preview: ${section.textPreview}`);
                console.log('');
            });
        }
        
        // Print interaction results
        if (report.button_interactions.length > 0) {
            console.log('🖱️  BUTTON INTERACTION RESULTS:');
            report.button_interactions.forEach((interaction, index) => {
                console.log(`  ${index + 1}. "${interaction.buttonText}"`);
                console.log(`     Working: ${interaction.working}`);
                if (interaction.resulted_in_modal) console.log('     -> Opened modal');
                if (interaction.resulted_in_alert) console.log('     -> Showed alert');
                if (interaction.error) console.log(`     -> Error: ${interaction.error}`);
                console.log('');
            });
        }
        
        console.log('📄 Full report saved to: budget_optimization_exploration_report.json');
        console.log('📸 Screenshots saved to: ./dashboard/screenshots/');
        
    } catch (error) {
        console.error('❌ Error during exploration:', error.message);
        console.error(error.stack);
        
        // Take error screenshot
        try {
            await page.screenshot({ 
                path: './dashboard/screenshots/budget_opt_error.png',
                fullPage: true 
            });
        } catch (screenshotError) {
            console.error('Could not take error screenshot:', screenshotError.message);
        }
    } finally {
        await browser.close();
    }
}

// Run the exploration
exploreBudgetOptimization().catch(console.error);