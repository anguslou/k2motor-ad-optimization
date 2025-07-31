// K2Motor Dashboard - Browser Console Tooltip Fixes
// Copy and paste this code directly into the browser console to test tooltip fixes

console.log('🛠️ Applying K2Motor tooltip fixes via browser console...');

// Function to fix tooltip positioning immediately
function fixTooltipPositioning() {
    console.log('🎯 Fixing tooltip positioning...');
    
    // Enhanced CSS fixes
    let style = document.getElementById('console-tooltip-fixes');
    if (!style) {
        style = document.createElement('style');
        style.id = 'console-tooltip-fixes';
        document.head.appendChild(style);
    }
    
    style.textContent = `
        /* Console Applied Tooltip Fixes */
        .tooltiptext {
            position: fixed !important;
            z-index: 99999 !important;
            background: rgba(15, 15, 35, 0.98) !important;
            color: #ffffff !important;
            padding: 16px 20px !important;
            border-radius: 12px !important;
            font-size: 14px !important;
            line-height: 1.5 !important;
            max-width: 300px !important;
            min-width: 200px !important;
            white-space: pre-wrap !important;
            word-wrap: break-word !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6) !important;
            border: 1px solid rgba(255, 107, 53, 0.3) !important;
            backdrop-filter: blur(20px) !important;
            pointer-events: none !important;
            transform: translateZ(0) !important;
            opacity: 0 !important;
            visibility: hidden !important;
        }
        
        .tooltip:hover .tooltiptext {
            opacity: 1 !important;
            visibility: visible !important;
        }
    `;
    
    // Smart positioning function
    function positionTooltipSmart(trigger, tooltipText) {
        const triggerRect = trigger.getBoundingClientRect();
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        
        // Get tooltip dimensions
        tooltipText.style.left = '-9999px';
        tooltipText.style.top = '-9999px';
        tooltipText.style.visibility = 'visible';
        tooltipText.style.opacity = '1';
        tooltipText.offsetHeight; // Force reflow
        
        const tooltipRect = tooltipText.getBoundingClientRect();
        const tooltipWidth = Math.min(tooltipRect.width, 300);
        const tooltipHeight = tooltipRect.height;
        
        // Calculate position
        let left = triggerRect.left + (triggerRect.width / 2) - (tooltipWidth / 2);
        let top = triggerRect.top - tooltipHeight - 15;
        
        const padding = 15;
        
        // Horizontal boundary
        left = Math.max(padding, Math.min(left, viewport.width - tooltipWidth - padding));
        
        // Vertical boundary - CRITICAL FIX
        if (top < padding) {
            // Try below
            const belowTop = triggerRect.bottom + 15;
            if (belowTop + tooltipHeight <= viewport.height - padding) {
                top = belowTop;
            } else {
                // Force into safe area (top 20% of viewport)
                top = Math.max(padding, viewport.height * 0.1);
            }
        }
        
        // Final safety check
        const maxAllowedTop = viewport.height - tooltipHeight - padding;
        if (top > maxAllowedTop) {
            top = Math.max(padding, maxAllowedTop);
        }
        
        // Apply position
        tooltipText.style.left = `${left}px`;
        tooltipText.style.top = `${top}px`;
        tooltipText.style.visibility = 'visible';
        tooltipText.style.opacity = '1';
        
        console.log(`📍 Positioned tooltip at (${left}, ${top}) - Viewport: ${viewport.width}x${viewport.height}`);
        return { left, top, inViewport: top >= padding && top + tooltipHeight <= viewport.height - padding };
    }
    
    // Apply to all tooltips
    const tooltips = document.querySelectorAll('.tooltip');
    let fixedCount = 0;
    
    tooltips.forEach((tooltip, index) => {
        const tooltipText = tooltip.querySelector('.tooltiptext');
        if (tooltipText) {
            // Remove existing handlers
            tooltip.removeEventListener('mouseenter', tooltip._consoleHandler);
            tooltip.removeEventListener('mouseleave', tooltip._consoleHideHandler);
            
            // Add new handlers
            const showHandler = () => {
                const result = positionTooltipSmart(tooltip, tooltipText);
                console.log(`Tooltip ${index + 1} positioned:`, result);
            };
            
            const hideHandler = () => {
                tooltipText.style.opacity = '0';
                setTimeout(() => {
                    tooltipText.style.visibility = 'hidden';
                }, 300);
            };
            
            tooltip._consoleHandler = showHandler;
            tooltip._consoleHideHandler = hideHandler;
            
            tooltip.addEventListener('mouseenter', showHandler);
            tooltip.addEventListener('mouseleave', hideHandler);
            
            fixedCount++;
        }
    });
    
    console.log(`✅ Applied console fixes to ${fixedCount} tooltips`);
    return fixedCount;
}

// Function to test specific tooltips
function testSpecificTooltips() {
    console.log('🧪 Testing specific tooltips...');
    
    const tests = [];
    
    // Test Active Campaigns tooltip
    const activeCampaignsCard = Array.from(document.querySelectorAll('.metric-card'))
        .find(card => card.textContent.includes('Active Campaigns'));
    
    if (activeCampaignsCard) {
        const tooltip = activeCampaignsCard.querySelector('.tooltip');
        if (tooltip) {
            tests.push({
                name: 'Active Campaigns',
                element: tooltip,
                found: true
            });
        }
    }
    
    // Test Losing Money alert
    const losingMoneyAlert = Array.from(document.querySelectorAll('.alert-card'))
        .find(alert => alert.textContent.toLowerCase().includes('losing money'));
    
    if (losingMoneyAlert) {
        const tooltip = losingMoneyAlert.querySelector('.tooltip');
        if (tooltip) {
            tests.push({
                name: 'Losing Money Alert',
                element: tooltip,
                found: true
            });
        }
    }
    
    // Test scenario tags
    const scenarioTags = document.querySelectorAll('.scenario-tag');
    scenarioTags.forEach((tag, index) => {
        const parent = tag.parentElement;
        if (parent && parent.classList.contains('tooltip')) {
            tests.push({
                name: `Scenario Tag ${index + 1}`,
                element: parent,
                found: true
            });
        }
    });
    
    console.log(`Found ${tests.length} specific tooltips to test`);
    
    // Test each one
    tests.forEach((test, index) => {
        setTimeout(() => {
            console.log(`Testing ${test.name}...`);
            
            // Trigger hover
            const mouseEnter = new MouseEvent('mouseenter', { bubbles: true });
            test.element.dispatchEvent(mouseEnter);
            
            setTimeout(() => {
                const tooltipText = test.element.querySelector('.tooltiptext');
                if (tooltipText) {
                    const computed = window.getComputedStyle(tooltipText);
                    const rect = tooltipText.getBoundingClientRect();
                    const viewport = { width: window.innerWidth, height: window.innerHeight };
                    
                    const result = {
                        name: test.name,
                        visible: computed.visibility === 'visible' && computed.opacity !== '0',
                        position: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
                        inViewport: rect.top >= 0 && rect.left >= 0 && 
                                   rect.bottom <= viewport.height && rect.right <= viewport.width,
                        zIndex: computed.zIndex
                    };
                    
                    console.log(`${test.name} result:`, result);
                }
                
                // Hide tooltip
                const mouseLeave = new MouseEvent('mouseleave', { bubbles: true });
                test.element.dispatchEvent(mouseLeave);
            }, 200);
        }, index * 1000);
    });
    
    return tests.length;
}

// Function to add missing elements
function addMissingElements() {
    console.log('🔧 Adding missing tooltip elements...');
    
    let addedCount = 0;
    
    // Add campaign metrics if missing
    const campaignsTab = document.querySelector('[data-tab="campaigns"]');
    if (campaignsTab && !campaignsTab.querySelector('.metrics-grid')) {
        const tabHeader = campaignsTab.querySelector('.tab-header');
        if (tabHeader) {
            const metricsGrid = document.createElement('div');
            metricsGrid.className = 'metrics-grid campaign-metrics';
            metricsGrid.innerHTML = `
                <div class="metric-card">
                    <div class="metric-header">
                        <h3>Active Campaigns</h3>
                        <div class="tooltip">
                            <span class="source-indicator" data-source="API Direct">🟢</span>
                            <div class="tooltiptext">
                                <div class="tooltip-section">
                                    <span class="tooltip-title">Active Campaigns Count</span>
                                    <div class="tooltip-why">Why: Shows currently running K2Motor campaigns driving traffic and sales</div>
                                    <div class="tooltip-action">Action: Monitor for campaigns needing optimization or attention</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="metric-value">5</div>
                    <div class="metric-change">Across 4 platforms</div>
                </div>
            `;
            tabHeader.insertAdjacentElement('afterend', metricsGrid);
            addedCount++;
            console.log('✅ Added campaign metrics grid');
        }
    }
    
    return addedCount;
}

// Main execution
console.log('🚀 Starting console tooltip fixes...');

// Apply fixes
const fixedTooltips = fixTooltipPositioning();
const addedElements = addMissingElements();

// Wait a bit then test
setTimeout(() => {
    const testedTooltips = testSpecificTooltips();
    
    console.log('\n🎉 CONSOLE FIXES SUMMARY:');
    console.log('========================');
    console.log(`✅ Fixed tooltips: ${fixedTooltips}`);
    console.log(`➕ Added elements: ${addedElements}`);
    console.log(`🧪 Tested tooltips: ${testedTooltips}`);
    console.log('\n💡 Try hovering over tooltips now to see the fixes in action!');
    console.log('🎯 Focus on Active Campaigns and Losing Money tooltips');
}, 1000);

// Export functions for manual use
window.tooltipConsoleFixes = {
    fixPositioning: fixTooltipPositioning,
    testTooltips: testSpecificTooltips,
    addElements: addMissingElements
};

console.log('✅ Console tooltip fixes loaded! Functions available in window.tooltipConsoleFixes');