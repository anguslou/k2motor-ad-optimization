// K2Motor Tooltip Manager - Dynamic positioning for educational tooltips
// Ensures tooltips appear above all elements and are properly positioned

class TooltipManager {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupTooltips());
        } else {
            this.setupTooltips();
        }
    }

    setupTooltips() {
        // Remove existing event listeners first to avoid duplicates
        const existingTooltips = document.querySelectorAll('.tooltip');
        existingTooltips.forEach(tooltip => {
            tooltip.removeEventListener('mouseenter', this.boundShowTooltip);
            tooltip.removeEventListener('mouseleave', this.boundHideTooltip);
            tooltip.removeEventListener('mousemove', this.boundUpdatePosition);
        });

        // Find all tooltip elements
        const tooltips = document.querySelectorAll('.tooltip');
        
        tooltips.forEach(tooltip => {
            const tooltipText = tooltip.querySelector('.tooltiptext');
            if (!tooltipText) return;

            // Create bound functions for proper event handling
            const showHandler = (e) => this.showTooltip(tooltip, tooltipText, e);
            const hideHandler = () => this.hideTooltip(tooltipText);
            const moveHandler = (e) => {
                if (tooltipText.style.visibility === 'visible') {
                    this.updateTooltipPosition(tooltipText, e);
                }
            };

            // Store handlers for cleanup
            tooltip._showHandler = showHandler;
            tooltip._hideHandler = hideHandler;
            tooltip._moveHandler = moveHandler;

            // Add event listeners
            tooltip.addEventListener('mouseenter', showHandler);
            tooltip.addEventListener('mouseleave', hideHandler);
            tooltip.addEventListener('mousemove', moveHandler);
        });

        console.log(`🎯 Tooltip Manager: Initialized ${tooltips.length} tooltips`);
    }

    showTooltip(tooltip, tooltipText, event) {
        // Mark as JavaScript-positioned to override CSS positioning
        tooltip.classList.add('js-positioned');
        
        // First make tooltip visible (but transparent) to calculate dimensions
        tooltipText.style.visibility = 'visible';
        tooltipText.style.opacity = '0';
        
        // Calculate position
        this.updateTooltipPosition(tooltipText, event);
        
        // Now make it fully visible
        tooltipText.style.opacity = '1';
    }

    hideTooltip(tooltipText) {
        tooltipText.style.visibility = 'hidden';
        tooltipText.style.opacity = '0';
        // Remove js-positioned class to allow CSS fallback
        const tooltip = tooltipText.closest('.tooltip');
        if (tooltip) {
            tooltip.classList.remove('js-positioned');
        }
    }

    updateTooltipPosition(tooltipText, event) {
        const tooltipWidth = 320;
        const offset = 15; // Distance from trigger element
        
        // Get trigger element position
        const trigger = event.target.closest('.tooltip');
        if (!trigger) return;
        
        const triggerRect = trigger.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Make tooltip temporarily visible to measure it
        const originalVisibility = tooltipText.style.visibility;
        const originalOpacity = tooltipText.style.opacity;
        tooltipText.style.visibility = 'hidden';
        tooltipText.style.opacity = '1';
        tooltipText.style.position = 'fixed';
        tooltipText.style.left = '0px';
        tooltipText.style.top = '0px';
        
        // Force layout and get dimensions
        tooltipText.offsetHeight; // Force reflow
        const tooltipRect = tooltipText.getBoundingClientRect();
        const tooltipHeight = tooltipRect.height;
        
        // Calculate preferred position (above trigger, centered)
        let left = triggerRect.left + (triggerRect.width / 2) - (tooltipWidth / 2);
        let top = triggerRect.top - tooltipHeight - offset;
        
        // Horizontal boundary adjustments
        if (left < 10) {
            left = 10;
        } else if (left + tooltipWidth > viewportWidth - 10) {
            left = viewportWidth - tooltipWidth - 10;
        }
        
        // Vertical boundary adjustments
        if (top < 10) {
            // Not enough space above, position below instead
            top = triggerRect.bottom + offset;
            
            // If still not enough space below, position in viewport center
            if (top + tooltipHeight > viewportHeight - 10) {
                top = Math.max(10, (viewportHeight - tooltipHeight) / 2);
            }
        }
        
        // Final check to ensure tooltip stays in viewport
        top = Math.max(10, Math.min(top, viewportHeight - tooltipHeight - 10));
        left = Math.max(10, Math.min(left, viewportWidth - tooltipWidth - 10));
        
        // Apply final position
        tooltipText.style.left = left + 'px';
        tooltipText.style.top = top + 'px';
        
        // Restore original visibility states
        tooltipText.style.visibility = originalVisibility;
        tooltipText.style.opacity = originalOpacity;
        
        console.log(`📍 Positioned tooltip at (${left}, ${top}) for trigger at (${triggerRect.left}, ${triggerRect.top})`);
    }

    // Method to refresh tooltips if new content is added dynamically
    refreshTooltips() {
        this.setupTooltips();
    }
}

// Enable TooltipManager with improved positioning
const tooltipManager = new TooltipManager();
window.tooltipManager = tooltipManager;

// Enhanced tooltip initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 Initializing enhanced tooltip positioning system');
    tooltipManager.refreshTooltips();
});