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
        
        console.log('\n=== CHECKING AVAILABLE ELEMENTS ===\n');
        
        // Check what elements are available
        const availableClasses = await page.evaluate(() => {
            const elements = document.querySelectorAll('*[class]');
            const classes = new Set();
            elements.forEach(el => {
                el.classList.forEach(cls => classes.add(cls));
            });
            return Array.from(classes).sort();
        });
        
        console.log('Available CSS classes:', availableClasses.filter(cls => 
            cls.includes('campaign') || 
            cls.includes('metric') || 
            cls.includes('summary') || 
            cls.includes('tooltip') ||
            cls.includes('performance')
        ));
        
        // Look for metric cards or similar elements
        const metricSelectors = [
            '.metric-card',
            '.metric',
            '.performance-metric',
            '.campaign-metric',
            '[class*="metric"]',
            '[class*="campaign"]',
            '.tooltip',
            '[data-tooltip]'
        ];
        
        for (const selector of metricSelectors) {
            const elements = await page.$$(selector);
            if (elements.length > 0) {
                console.log(`Found ${elements.length} elements with selector: ${selector}`);
            }
        }
        
        console.log('\n=== SEARCHING FOR TOOLTIP ELEMENTS ===\n');
        
        // Look for any tooltip-related elements
        const tooltipElements = await page.$$('[class*="tooltip"], .tooltiptext, [data-tooltip]');
        console.log(`Found ${tooltipElements.length} tooltip-related elements`);
        
        for (let i = 0; i < tooltipElements.length; i++) {
            const element = tooltipElements[i];
            const tagName = await element.evaluate(el => el.tagName);
            const className = await element.getAttribute('class');
            const textContent = await element.textContent();
            const parentHTML = await element.evaluate(el => el.parentElement?.outerHTML || 'No parent');
            
            console.log(`\nTooltip Element ${i + 1}:`);
            console.log(`Tag: ${tagName}`);
            console.log(`Class: ${className}`);
            console.log(`Text: ${textContent?.substring(0, 100)}`);
            console.log(`Parent HTML: ${parentHTML.substring(0, 200)}...`);
        }
        
        console.log('\n=== LOOKING FOR METRICS SPECIFICALLY ===\n');
        
        // Search for text content that might indicate metrics
        const metricsText = ['TOTAL CAMPAIGNS', 'ACTIVE CAMPAIGNS', 'AVG ROAS', 'AVG CPC', 'ROAS', 'CPC'];
        
        for (const text of metricsText) {
            try {
                const element = await page.locator(`text="${text}"`).first();
                const isVisible = await element.isVisible().catch(() => false);
                
                if (isVisible) {
                    console.log(`\nFound metric: ${text}`);
                    const parentElement = await element.locator('..').first();
                    const parentHTML = await parentElement.innerHTML().catch(() => 'Could not get parent HTML');
                    console.log('Parent HTML:', parentHTML.substring(0, 300) + '...');
                }
            } catch (e) {
                console.log(`Could not find element with text: ${text}`);
            }
        }
        
        console.log('\n=== CHECKING ENTIRE PAGE STRUCTURE ===\n');
        
        // Get the main content area
        const mainContent = await page.$('#campaign-deep-dive, .tab-content, .campaign-content, main');
        if (mainContent) {
            const contentHTML = await mainContent.innerHTML();
            console.log('Main content HTML (first 1000 chars):');
            console.log(contentHTML.substring(0, 1000));
            
            // Look for any elements that might contain metrics
            const possibleMetrics = await mainContent.$$('div, span, p');
            console.log(`Found ${possibleMetrics.length} potential metric containers`);
            
            // Check first few for metrics-like content
            for (let i = 0; i < Math.min(10, possibleMetrics.length); i++) {
                const element = possibleMetrics[i];
                const text = await element.textContent();
                if (text && (text.includes('CAMPAIGNS') || text.includes('ROAS') || text.includes('CPC'))) {
                    console.log(`\nPotential metric found: ${text.substring(0, 100)}`);
                    const elementHTML = await element.innerHTML();
                    console.log('Element HTML:', elementHTML.substring(0, 200));
                }
            }
        }
        
        console.log('\n=== TESTING DIRECT TOOLTIP HOVER ===\n');
        
        // Try to find and hover over any tooltip elements
        const allElements = await page.$$('*');
        let tooltipTested = false;
        
        for (let i = 0; i < Math.min(50, allElements.length); i++) {
            const element = allElements[i];
            const className = await element.getAttribute('class') || '';
            const textContent = await element.textContent() || '';
            
            if (className.includes('tooltip') || textContent.includes('ROAS') || textContent.includes('CAMPAIGNS')) {
                console.log(`\nTesting hover on element with class: ${className}, text: ${textContent.substring(0, 50)}`);
                
                try {
                    await element.hover();
                    await page.waitForTimeout(500);
                    
                    // Check if any tooltip became visible
                    const visibleTooltips = await page.$$eval('[class*="tooltip"]', elements => {
                        return elements.filter(el => {
                            const style = window.getComputedStyle(el);
                            return style.visibility === 'visible' && style.opacity !== '0';
                        }).length;
                    });
                    
                    console.log(`Visible tooltips after hover: ${visibleTooltips}`);
                    tooltipTested = true;
                    
                    if (tooltipTested && i > 5) break; // Don't test too many
                } catch (e) {
                    console.log('Could not hover on element');
                }
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