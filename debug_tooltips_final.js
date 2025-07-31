const { chromium } = require('playwright');

async function debugTooltips() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Listen for console messages and errors
    page.on('console', msg => {
        console.log(`CONSOLE ${msg.type()}: ${msg.text()}`);
    });

    page.on('pageerror', error => {
        console.log(`PAGE ERROR: ${error.message}`);
    });

    try {
        console.log('Navigating to localhost:8000...');
        await page.goto('http://localhost:8000');
        
        console.log('Clicking Campaign Deep Dive tab...');
        await page.click('text="Campaign Deep Dive"');
        
        // Wait for page to load and settle
        await page.waitForTimeout(3000);
        
        // Close the welcome popup if it exists
        console.log('Dismissing welcome popup...');
        try {
            await page.click('.popup-close, .welcome-close, button:has-text("Close"), button:has-text("×")');
            await page.waitForTimeout(1000);
        } catch (e) {
            console.log('No welcome popup to close or failed to close');
        }
        
        // Try clicking outside the popup to dismiss it
        try {
            await page.click('body', { position: { x: 10, y: 10 } });
            await page.waitForTimeout(1000);
        } catch (e) {
            console.log('Could not click outside popup');
        }
        
        console.log('\n=== ANALYZING METRIC CARDS FOR TOOLTIP STRUCTURE ===\n');
        
        // Find all metric cards
        const metricCards = await page.$$('.metric-card');
        console.log(`Found ${metricCards.length} metric cards`);
        
        for (let i = 0; i < metricCards.length; i++) {
            const card = metricCards[i];
            
            // Get the metric title to identify the card
            const title = await card.$eval('.metric-title', el => el.textContent).catch(() => 'Unknown');
            
            console.log(`\n--- METRIC CARD ${i + 1}: "${title}" ---`);
            
            // Get the complete HTML structure
            const cardHTML = await card.innerHTML();
            console.log('Complete HTML structure:');
            console.log(cardHTML);
            
            // Check for tooltip elements specifically
            const hasTooltipClass = await card.$('.tooltip') !== null;
            const hasTooltipTextClass = await card.$('.tooltiptext') !== null;
            const hasDataTooltip = await card.getAttribute('data-tooltip') !== null;
            const hasTitle = await card.getAttribute('title') !== null;
            
            console.log(`Has .tooltip element: ${hasTooltipClass}`);
            console.log(`Has .tooltiptext element: ${hasTooltipTextClass}`);
            console.log(`Has data-tooltip attribute: ${hasDataTooltip}`);
            console.log(`Has title attribute: ${hasTitle}`);
            
            // Check if the card itself has tooltip-related classes
            const cardClasses = await card.getAttribute('class');
            console.log(`Card classes: ${cardClasses}`);
            
            // Look for any nested elements with tooltip functionality
            const nestedTooltips = await card.$$('[class*="tooltip"], [data-tooltip], [title]');
            console.log(`Nested tooltip elements found: ${nestedTooltips.length}`);
            
            for (let j = 0; j < nestedTooltips.length; j++) {
                const nestedElement = nestedTooltips[j];
                const nestedClasses = await nestedElement.getAttribute('class');
                const nestedDataTooltip = await nestedElement.getAttribute('data-tooltip');
                const nestedTitle = await nestedElement.getAttribute('title');
                const nestedHTML = await nestedElement.outerHTML();
                
                console.log(`  Nested tooltip ${j + 1}:`);
                console.log(`    Classes: ${nestedClasses}`);
                console.log(`    Data-tooltip: ${nestedDataTooltip}`);
                console.log(`    Title: ${nestedTitle}`);
                console.log(`    HTML: ${nestedHTML.substring(0, 200)}...`);
            }
            
            console.log('---');
        }
        
        console.log('\n=== TESTING HOVER BEHAVIOR (with popup dismissed) ===\n');
        
        // Now test hovering on each card
        for (let i = 0; i < Math.min(4, metricCards.length); i++) {
            const card = metricCards[i];
            const title = await card.$eval('.metric-title', el => el.textContent).catch(() => 'Unknown');
            
            console.log(`\nTesting hover on: "${title}"`);
            
            try {
                // Try hovering on the card
                await card.scrollIntoViewIfNeeded();
                await card.hover({ timeout: 5000 });
                await page.waitForTimeout(1000);
                
                // Check if any tooltip became visible anywhere on the page
                const visibleTooltips = await page.$$eval('.tooltiptext, [data-tooltip], .tooltip-content', elements => {
                    return elements.map(el => {
                        const style = window.getComputedStyle(el);
                        return {
                            text: el.textContent?.substring(0, 50) || 'No text',
                            visible: style.visibility === 'visible' && style.opacity !== '0' && style.display !== 'none',
                            styles: {
                                visibility: style.visibility,
                                opacity: style.opacity,
                                display: style.display,
                                position: style.position
                            }
                        };
                    });
                });
                
                console.log(`Tooltips on page after hover:`, visibleTooltips);
                
                // Move mouse away
                await page.mouse.move(0, 0);
                await page.waitForTimeout(500);
                
            } catch (e) {
                console.log(`Could not hover on ${title}: ${e.message}`);
            }
        }
        
        console.log('\n=== CHECKING FOR EXPECTED METRICS ===\n');
        
        // Look for the specific metrics mentioned in the issue
        const expectedMetrics = ['TOTAL CAMPAIGNS', 'ACTIVE CAMPAIGNS', 'AVG ROAS', 'AVG CPC'];
        
        for (const expectedMetric of expectedMetrics) {
            console.log(`\nSearching for metric: "${expectedMetric}"`);
            
            // Try different ways to find the metric
            const byExactText = await page.locator(`text="${expectedMetric}"`).first().isVisible().catch(() => false);
            const byPartialText = await page.locator(`text="${expectedMetric.replace('AVG ', '')}"i`).first().isVisible().catch(() => false);
            
            console.log(`  Found by exact text: ${byExactText}`);
            console.log(`  Found by partial text: ${byPartialText}`);
            
            if (byExactText || byPartialText) {
                try {
                    const element = byExactText ? 
                        page.locator(`text="${expectedMetric}"`).first() : 
                        page.locator(`text="${expectedMetric.replace('AVG ', '')}"i`).first();
                    
                    const parentCard = element.locator('xpath=ancestor::div[contains(@class, "metric-card")]').first();
                    const cardHTML = await parentCard.innerHTML().catch(() => 'Could not get HTML');
                    
                    console.log(`  Parent card HTML (first 300 chars):`);
                    console.log(cardHTML.substring(0, 300) + '...');
                } catch (e) {
                    console.log(`  Could not analyze parent card: ${e.message}`);
                }
            }
        }
        
        console.log('\n=== FINAL ANALYSIS ===\n');
        
        // Get all metric titles for comparison
        const allTitles = [];
        for (let i = 0; i < metricCards.length; i++) {
            const card = metricCards[i];
            const title = await card.$eval('.metric-title', el => el.textContent).catch(() => 'Unknown');
            allTitles.push(title);
        }
        
        console.log('All metric card titles found:', allTitles);
        
        // Check if there are any tooltip systems active on the page
        const tooltipSystems = await page.evaluate(() => {
            const systems = [];
            
            // Check for various tooltip libraries/systems
            if (window.tippy) systems.push('Tippy.js');
            if (window.Popper) systems.push('Popper.js');
            if (window.bootstrap && window.bootstrap.Tooltip) systems.push('Bootstrap Tooltips');
            if (document.querySelector('[data-bs-toggle="tooltip"]')) systems.push('Bootstrap data-bs-toggle');
            if (document.querySelector('[data-toggle="tooltip"]')) systems.push('Bootstrap data-toggle');
            if (document.querySelector('.tooltip')) systems.push('CSS .tooltip classes');
            
            return systems;
        });
        
        console.log('Tooltip systems detected:', tooltipSystems);
        
    } catch (error) {
        console.error('Error during debugging:', error);
    }
    
    // Keep browser open for manual inspection
    console.log('\nBrowser will remain open for 60 seconds for manual inspection...');
    console.log('You can manually hover over the metric cards to see which tooltips work...');
    await page.waitForTimeout(60000);
    
    await browser.close();
}

debugTooltips().catch(console.error);