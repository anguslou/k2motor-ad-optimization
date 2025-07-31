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
        
        console.log('Waiting for Campaign Performance Summary to load...');
        await page.waitForSelector('.campaign-performance-summary', { timeout: 10000 });
        
        // Wait a bit more for dynamic content
        await page.waitForTimeout(2000);
        
        console.log('\n=== EXTRACTING METRIC CARD HTML ===\n');
        
        // Get all metric cards
        const metricCards = await page.$$('.metric-card');
        console.log(`Found ${metricCards.length} metric cards`);
        
        for (let i = 0; i < metricCards.length; i++) {
            const card = metricCards[i];
            
            // Get the card's HTML
            const cardHTML = await card.innerHTML();
            
            // Get the card's text content to identify which metric it is
            const cardText = await card.textContent();
            const firstLine = cardText.split('\n')[0].trim();
            
            console.log(`\n--- METRIC CARD ${i + 1}: ${firstLine} ---`);
            console.log('HTML Structure:');
            console.log(cardHTML);
            console.log('---');
        }
        
        console.log('\n=== TESTING TOOLTIP HOVER BEHAVIOR ===\n');
        
        // Test hovering over each metric card
        for (let i = 0; i < metricCards.length; i++) {
            const card = metricCards[i];
            const cardText = await card.textContent();
            const firstLine = cardText.split('\n')[0].trim();
            
            console.log(`\nTesting hover on: ${firstLine}`);
            
            // Hover over the card
            await card.hover();
            await page.waitForTimeout(500);
            
            // Check if tooltip is visible
            const tooltipVisible = await page.evaluate((cardElement) => {
                const tooltiptext = cardElement.querySelector('.tooltiptext');
                if (tooltiptext) {
                    const style = window.getComputedStyle(tooltiptext);
                    return style.visibility === 'visible' && style.opacity !== '0';
                }
                return false;
            }, card);
            
            console.log(`Tooltip visible: ${tooltipVisible}`);
            
            // Get tooltip content if it exists
            const tooltipContent = await card.$eval('.tooltiptext', el => el.textContent).catch(() => 'No tooltip found');
            console.log(`Tooltip content: ${tooltipContent}`);
            
            // Move away to hide tooltip
            await page.mouse.move(0, 0);
            await page.waitForTimeout(200);
        }
        
        console.log('\n=== CHECKING CSS CLASSES AND COMPUTED STYLES ===\n');
        
        // Check computed styles for each metric card
        for (let i = 0; i < metricCards.length; i++) {
            const card = metricCards[i];
            const cardText = await card.textContent();
            const firstLine = cardText.split('\n')[0].trim();
            
            console.log(`\nCSS Analysis for: ${firstLine}`);
            
            // Get all classes
            const classes = await card.getAttribute('class');
            console.log(`Classes: ${classes}`);
            
            // Check for tooltip element
            const hasTooltip = await card.$('.tooltiptext') !== null;
            console.log(`Has .tooltiptext element: ${hasTooltip}`);
            
            if (hasTooltip) {
                const tooltipClasses = await card.$eval('.tooltiptext', el => el.className);
                console.log(`Tooltip classes: ${tooltipClasses}`);
                
                const tooltipStyles = await card.$eval('.tooltiptext', el => {
                    const style = window.getComputedStyle(el);
                    return {
                        position: style.position,
                        visibility: style.visibility,
                        opacity: style.opacity,
                        display: style.display,
                        zIndex: style.zIndex
                    };
                });
                console.log(`Tooltip computed styles:`, tooltipStyles);
            }
        }
        
        console.log('\n=== CHECKING FOR JAVASCRIPT ERRORS ===\n');
        
        // Execute some JavaScript to check for errors
        await page.evaluate(() => {
            console.log('Checking tooltip functionality...');
            
            // Check if all tooltip elements have proper event listeners
            const metricCards = document.querySelectorAll('.metric-card');
            metricCards.forEach((card, index) => {
                const tooltip = card.querySelector('.tooltiptext');
                if (tooltip) {
                    console.log(`Card ${index + 1} has tooltip element`);
                } else {
                    console.log(`Card ${index + 1} missing tooltip element`);
                }
            });
        });
        
        console.log('\n=== DETAILED DOM INSPECTION ===\n');
        
        // Get the entire campaign performance summary HTML for detailed analysis
        const summaryHTML = await page.$eval('.campaign-performance-summary', el => el.outerHTML);
        console.log('Complete Campaign Performance Summary HTML:');
        console.log(summaryHTML);
        
    } catch (error) {
        console.error('Error during debugging:', error);
    }
    
    // Keep browser open for manual inspection
    console.log('\nBrowser will remain open for 30 seconds for manual inspection...');
    await page.waitForTimeout(30000);
    
    await browser.close();
}

debugTooltips().catch(console.error);