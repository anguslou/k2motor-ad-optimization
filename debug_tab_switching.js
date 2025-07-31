const { chromium } = require('playwright');

async function debugTabSwitching() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        console.log('🔧 Debugging Tab Switching...');
        console.log('1. Navigating to localhost:8000...');
        await page.goto('http://localhost:8000');
        
        // Wait for page to load
        await page.waitForTimeout(3000);
        
        // Close welcome popup if it exists
        try {
            await page.click('.popup-close, .welcome-close, button:has-text("Close"), button:has-text("×")');
            await page.waitForTimeout(1000);
        } catch (e) {
            console.log('No popup to close');
        }
        
        console.log('2. Analyzing initial state...');
        
        // Check what tab is currently active
        const activeTab = await page.$eval('.nav-tab.active', el => el.getAttribute('data-tab')).catch(() => 'none');
        console.log(`📋 Active tab: ${activeTab}`);
        
        // Check current content
        const currentContent = await page.$eval('#tab-content', el => el.innerHTML.substring(0, 200)).catch(() => 'No content');
        console.log(`📄 Current content preview: ${currentContent}...`);
        
        console.log('\\n3. Testing tab click behavior...');
        
        // Get the Campaign Deep Dive tab element
        const campaignTab = await page.$('[data-tab="campaigns"]');
        if (campaignTab) {
            console.log('✅ Found Campaign Deep Dive tab element');
            
            // Check what event listeners are attached
            const tabEventInfo = await page.evaluate((tabElement) => {
                const listeners = [];
                // Can't directly access event listeners, but we can check the handlers
                const clickHandler = tabElement.onclick;
                const hasClickHandler = !!clickHandler;
                
                return {
                    hasClickHandler,
                    hasDataTab: !!tabElement.getAttribute('data-tab'),
                    dataTabValue: tabElement.getAttribute('data-tab'),
                    classList: Array.from(tabElement.classList),
                    textContent: tabElement.textContent?.trim()
                };
            }, campaignTab);
            
            console.log('📊 Tab element info:', tabEventInfo);
            
            // Try clicking the tab
            console.log('\\n🖱️ Clicking Campaign Deep Dive tab...');
            await campaignTab.click();
            
            // Wait for tab switch
            await page.waitForTimeout(2000);
            
            // Check if tab became active
            const newActiveTab = await page.$eval('.nav-tab.active', el => el.getAttribute('data-tab')).catch(() => 'none');
            console.log(`📋 New active tab: ${newActiveTab}`);
            
            // Check if content changed
            const newContent = await page.$eval('#tab-content', el => el.innerHTML.substring(0, 200)).catch(() => 'No content');
            console.log(`📄 New content preview: ${newContent}...`);
            
            // Check for specific Campaign tab indicators
            const hasCampaignContent = newContent.includes('Campaign Deep Dive') || newContent.includes('buildCampaignSummaryMetrics');
            const hasOverviewContent = newContent.includes('🏁 Key Optimization Metrics');
            
            console.log(`🎯 Has Campaign content: ${hasCampaignContent}`);
            console.log(`📊 Has Overview content: ${hasOverviewContent}`);
            
            if (hasOverviewContent) {
                console.log('❌ ISSUE: Still showing Overview content after clicking Campaign tab');
            } else if (hasCampaignContent) {
                console.log('✅ SUCCESS: Showing Campaign content');
            } else {
                console.log('❓ UNKNOWN: Content does not match expected patterns');
            }
            
        } else {
            console.log('❌ Could not find Campaign Deep Dive tab element');
        }
        
        console.log('\\n4. Checking JavaScript console for errors...');
        
        // Execute JavaScript to check for errors and debug info
        const debugInfo = await page.evaluate(() => {
            const errors = [];
            const debugInfo = {};
            
            // Check if dashboard systems are loaded
            debugInfo.hasDashboardContent = !!window.dashboardContent;
            debugInfo.hasDashboardContentManager = !!window.dashboardContentManager;
            debugInfo.hasK2MotorDashboard = !!window.k2MotorDashboard;
            
            // Check if dashboard content manager is working
            if (window.dashboardContent) {
                debugInfo.currentTab = window.dashboardContent.currentTab;
                debugInfo.isLoading = window.dashboardContent.isLoading;
            }
            
            return { errors, debugInfo };
        });
        
        console.log('🔍 Debug info:', debugInfo);
        
    } catch (error) {
        console.error('❌ Debug failed:', error);
    }
    
    // Keep browser open for manual inspection
    console.log('\\n🔍 Browser will remain open for manual inspection...');
    await page.waitForTimeout(60000);
    
    await browser.close();
}

debugTabSwitching().catch(console.error);