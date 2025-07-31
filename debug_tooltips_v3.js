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
        
        console.log('\n=== ANALYZING METRIC CARDS ===\n');
        
        // Find all metric cards
        const metricCards = await page.$$('.metric-card');
        console.log(`Found ${metricCards.length} metric cards`);
        
        for (let i = 0; i < metricCards.length; i++) {
            const card = metricCards[i];
            
            // Get the metric title to identify the card
            const title = await card.$eval('.metric-title', el => el.textContent).catch(() => 'Unknown');
            
            console.log(`\n--- METRIC CARD ${i + 1}: ${title} ---`);
            
            // Get the complete HTML structure
            const cardHTML = await card.innerHTML();
            console.log('Complete HTML structure:');
            console.log(cardHTML);
            
            // Check for tooltip elements specifically
            const hasTooltip = await card.$('.tooltip') !== null;
            const hasTooltipText = await card.$('.tooltiptext') !== null;
            
            console.log(`Has .tooltip element: ${hasTooltip}`);
            console.log(`Has .tooltiptext element: ${hasTooltipText}`);
            
            if (hasTooltip) {
                const tooltipHTML = await card.$eval('.tooltip', el => el.outerHTML);
                console.log('Tooltip HTML:');
                console.log(tooltipHTML);
            }
            
            // Test hovering
            console.log('\nTesting hover behavior...');
            await card.hover();
            await page.waitForTimeout(500);
            
            // Check if tooltip is visible after hover
            const tooltipVisible = await page.evaluate((cardElement) => {
                const tooltiptext = cardElement.querySelector('.tooltiptext');
                if (tooltiptext) {
                    const style = window.getComputedStyle(tooltiptext);
                    return {
                        visibility: style.visibility,
                        opacity: style.opacity,
                        display: style.display,
                        position: style.position,
                        zIndex: style.zIndex
                    };
                }
                return null;
            }, card);
            
            console.log('Tooltip visibility after hover:');
            console.log(tooltipVisible);
            
            // Move mouse away
            await page.mouse.move(0, 0);
            await page.waitForTimeout(200);
            
            console.log('---');
        }
        
        console.log('\n=== CHECKING CSS STYLES ===\n');
        
        // Get the current CSS styles for tooltips
        const tooltipStyles = await page.evaluate(() => {
            const styles = [];
            const styleSheets = Array.from(document.styleSheets);
            
            styleSheets.forEach((sheet, sheetIndex) => {
                try {
                    const rules = Array.from(sheet.cssRules || sheet.rules || []);
                    rules.forEach((rule, ruleIndex) => {
                        if (rule.selectorText && (
                            rule.selectorText.includes('.tooltip') ||
                            rule.selectorText.includes('.metric-card')
                        )) {
                            styles.push({
                                sheet: sheetIndex,
                                rule: ruleIndex,
                                selector: rule.selectorText,
                                css: rule.cssText
                            });
                        }
                    });
                } catch (e) {
                    console.log(`Could not access stylesheet ${sheetIndex}: ${e.message}`);
                }
            });
            
            return styles;
        });
        
        console.log('Relevant CSS styles:');
        tooltipStyles.forEach(style => {
            console.log(`${style.selector}: ${style.css}`);
        });
        
        console.log('\n=== COMPARING WORKING VS NON-WORKING ===\n');
        
        // Compare the structure of different metric cards
        const metricTitles = [];
        for (let i = 0; i < metricCards.length; i++) {
            const card = metricCards[i];
            const title = await card.$eval('.metric-title', el => el.textContent).catch(() => 'Unknown');
            metricTitles.push(title);
        }
        
        console.log('All metric titles found:', metricTitles);
        
        // Try to find the specific ones mentioned in the issue
        const targetMetrics = ['TOTAL CAMPAIGNS', 'ACTIVE CAMPAIGNS', 'AVG ROAS', 'AVG CPC'];
        
        for (const targetMetric of targetMetrics) {
            console.log(`\nLooking for metric: ${targetMetric}`);
            
            const matchingCard = await page.locator('.metric-card').filter({ 
                has: page.locator('.metric-title', { hasText: targetMetric })
            }).first();
            
            const isVisible = await matchingCard.isVisible().catch(() => false);
            
            if (isVisible) {
                console.log(`Found ${targetMetric} card`);
                
                const cardHTML = await matchingCard.innerHTML();
                console.log('HTML structure:');
                console.log(cardHTML.substring(0, 500) + '...');
                
                // Test hover specifically
                await matchingCard.hover();
                await page.waitForTimeout(500);
                
                const tooltipAfterHover = await matchingCard.locator('.tooltiptext').isVisible().catch(() => false);
                console.log(`Tooltip visible after hover: ${tooltipAfterHover}`);
                
                await page.mouse.move(0, 0);
                await page.waitForTimeout(200);
            } else {
                console.log(`Could not find ${targetMetric} card`);
            }
        }
        
    } catch (error) {
        console.error('Error during debugging:', error);
    }
    
    // Keep browser open for manual inspection
    console.log('\nBrowser will remain open for 30 seconds for manual inspection...');
    await page.waitForTimeout(30000);
    
    await browser.close();
}

debugTooltips().catch(console.error);