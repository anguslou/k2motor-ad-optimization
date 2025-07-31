/**
 * K2Motor Dashboard - Comprehensive Tooltip Fix System
 * Fixes positioning issues for all tooltips with viewport-aware positioning
 */

class K2MotorTooltipFixer {
    constructor() {
        this.tooltips = [];
        this.init();
    }

    init() {
        console.log('🎯 K2Motor Tooltip Fixer: Initializing comprehensive fix system...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupTooltips());
        } else {
            this.setupTooltips();
        }

        // Watch for dynamic content changes
        this.observeChanges();
    }

    setupTooltips() {
        // Remove existing handlers to prevent conflicts
        this.cleanup();
        
        // Find all tooltips
        const tooltips = document.querySelectorAll('.tooltip');
        console.log(`🔧 Found ${tooltips.length} tooltips to fix`);

        tooltips.forEach((tooltip, index) => {
            const tooltipText = tooltip.querySelector('.tooltiptext');
            if (tooltipText) {
                // Skip tooltips inside specific cards - let them use pure CSS positioning
                const isInsideAlertCard = tooltip.closest('.alert-card');
                const isInsideOptimizationCard = tooltip.closest('.optimization-card');
                const isInsideBudgetCard = tooltip.closest('.summary-metric-card, .budget-performance-summary');
                const isInsidePlatformCard = tooltip.closest('.platform-allocation-card');
                const isInsidePOASCard = tooltip.closest('.poas-analysis-card');
                const isInsideRecommendationCard = tooltip.closest('.recommendation-card');
                const isInsidePOASIntro = tooltip.closest('.poas-analysis-intro');
                const isInsideAttributionCard = tooltip.closest('.metric-card');
                const isInsideAttributionTable = tooltip.closest('.enhanced-attribution-table');
                const isInsideAttributionSection = tooltip.closest('.attribution-tests-section, .roas-comparison-section');
                
                if (isInsideAlertCard || isInsideOptimizationCard || isInsideBudgetCard || 
                    isInsidePlatformCard || isInsidePOASCard || isInsideRecommendationCard || isInsidePOASIntro ||
                    isInsideAttributionCard || isInsideAttributionTable || isInsideAttributionSection) {
                    console.log('⏭️ Skipping card tooltip - using CSS positioning');
                    return;
                }
                
                this.setupTooltipEvents(tooltip, tooltipText, index);
            }
        });

        this.tooltips = Array.from(tooltips).filter(tooltip => 
            !tooltip.closest('.alert-card') && 
            !tooltip.closest('.optimization-card') &&
            !tooltip.closest('.summary-metric-card, .budget-performance-summary') &&
            !tooltip.closest('.platform-allocation-card') &&
            !tooltip.closest('.poas-analysis-card') &&
            !tooltip.closest('.recommendation-card') &&
            !tooltip.closest('.poas-analysis-intro') &&
            !tooltip.closest('.metric-card') &&
            !tooltip.closest('.enhanced-attribution-table') &&
            !tooltip.closest('.attribution-tests-section, .roas-comparison-section')
        );
        console.log('✅ K2Motor Tooltip Fixer: All non-alert tooltips fixed with viewport-aware positioning');
    }

    setupTooltipEvents(tooltip, tooltipText, index) {
        // Create bound handlers
        const showHandler = (e) => this.showTooltip(tooltip, tooltipText, e);
        const hideHandler = () => this.hideTooltip(tooltipText);
        const moveHandler = (e) => {
            if (tooltipText.style.visibility === 'visible') {
                this.updatePositionForElement(tooltip, tooltipText, e);
            }
        };

        // Store handlers for cleanup
        tooltip._k2MotorHandlers = { showHandler, hideHandler, moveHandler };

        // Add event listeners
        tooltip.addEventListener('mouseenter', showHandler);
        tooltip.addEventListener('mouseleave', hideHandler);
        tooltip.addEventListener('mousemove', moveHandler);
    }

    showTooltip(tooltip, tooltipText, event) {
        // Reset any existing styles
        tooltipText.style.position = 'fixed';
        tooltipText.style.visibility = 'visible';
        tooltipText.style.opacity = '0';
        tooltipText.style.zIndex = '99999';
        
        // Calculate and apply position
        this.updatePositionForElement(tooltip, tooltipText, event);
        
        // Fade in
        tooltipText.style.opacity = '1';
        tooltipText.style.transition = 'opacity 0.2s ease';
    }

    hideTooltip(tooltipText) {
        tooltipText.style.visibility = 'hidden';
        tooltipText.style.opacity = '0';
    }

    updatePositionForElement(tooltip, tooltipText, event) {
        const tooltipWidth = 320;
        const offset = 15;
        
        // Get the element's position (the "Losing Money" text)
        const elementRect = tooltip.getBoundingClientRect();
        
        // Force reflow to get accurate tooltip height
        tooltipText.style.height = 'auto';
        const tooltipHeight = Math.max(tooltipText.offsetHeight, tooltipText.scrollHeight, 120);
        
        // Get viewport dimensions
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        // Position to the right of the "Losing Money" element
        let left = elementRect.right + offset;
        let top = elementRect.top; // Align with top of element

        // Horizontal boundary check - if goes off right edge, position to the left
        if (left + tooltipWidth > viewport.width - offset) {
            left = elementRect.left - tooltipWidth - offset;
        }

        // Vertical boundary checks - keep tooltip in viewport
        if (top < offset) {
            top = offset;
        } else if (top + tooltipHeight > viewport.height - offset) {
            top = viewport.height - tooltipHeight - offset;
        }

        // Final boundary enforcement
        top = Math.max(offset, Math.min(top, viewport.height - tooltipHeight - offset));
        left = Math.max(offset, Math.min(left, viewport.width - tooltipWidth - offset));

        // Apply position
        tooltipText.style.left = left + 'px';
        tooltipText.style.top = top + 'px';
    }

    updatePosition(tooltipText, event) {
        const tooltipWidth = 320;
        const offset = 15;
        
        // Force reflow to get accurate height
        tooltipText.style.height = 'auto';
        const tooltipHeight = Math.max(tooltipText.offsetHeight, tooltipText.scrollHeight, 120);
        
        // Get viewport dimensions
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        // Calculate initial position (centered above cursor)
        let left = event.clientX - (tooltipWidth / 2);
        let top = event.clientY - tooltipHeight - offset;

        // Horizontal boundary checks - ensure tooltip stays within viewport
        if (left < offset) {
            left = offset;
        } else if (left + tooltipWidth > viewport.width - offset) {
            left = viewport.width - tooltipWidth - offset;
        }

        // Vertical boundary checks - prioritize keeping tooltip visible
        if (top < offset || top + tooltipHeight > viewport.height - offset) {
            // Try positioning below cursor
            const bottomPosition = event.clientY + offset;
            
            if (bottomPosition + tooltipHeight <= viewport.height - offset) {
                top = bottomPosition;
            } else {
                // If both above and below don't work, position in center-left or center-right
                top = Math.max(offset, Math.min(viewport.height / 2 - tooltipHeight / 2, viewport.height - tooltipHeight - offset));
                
                // Adjust horizontal position if needed
                if (event.clientX > viewport.width / 2) {
                    left = Math.max(offset, event.clientX - tooltipWidth - offset);
                } else {
                    left = Math.min(event.clientX + offset, viewport.width - tooltipWidth - offset);
                }
            }
        }

        // Final boundary enforcement to guarantee viewport containment
        top = Math.max(offset, Math.min(top, viewport.height - tooltipHeight - offset));
        left = Math.max(offset, Math.min(left, viewport.width - tooltipWidth - offset));

        // Apply position with smooth transition
        tooltipText.style.left = left + 'px';
        tooltipText.style.top = top + 'px';
        
        // Debug logging for problematic tooltips
        if (top > viewport.height - tooltipHeight) {
            console.warn('⚠️ Tooltip positioning issue detected:', {
                calculatedTop: top,
                viewportHeight: viewport.height,
                tooltipHeight: tooltipHeight,
                finalTop: Math.min(top, viewport.height - tooltipHeight - offset)
            });
        }
    }

    cleanup() {
        // Remove existing handlers
        this.tooltips.forEach(tooltip => {
            if (tooltip._k2MotorHandlers) {
                tooltip.removeEventListener('mouseenter', tooltip._k2MotorHandlers.showHandler);
                tooltip.removeEventListener('mouseleave', tooltip._k2MotorHandlers.hideHandler);
                tooltip.removeEventListener('mousemove', tooltip._k2MotorHandlers.moveHandler);
                delete tooltip._k2MotorHandlers;
            }
        });
        this.tooltips = [];
    }

    observeChanges() {
        // Watch for new content being added
        const observer = new MutationObserver((mutations) => {
            let needsRefresh = false;
            
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            if (node.classList?.contains('tooltip') || node.querySelector?.('.tooltip')) {
                                needsRefresh = true;
                            }
                        }
                    });
                }
            });

            if (needsRefresh) {
                console.log('🔄 Dynamic content detected, refreshing tooltips...');
                setTimeout(() => this.setupTooltips(), 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Public method to manually refresh tooltips
    refresh() {
        this.setupTooltips();
    }
}

// Initialize the tooltip fixer
const k2MotorTooltipFixer = new K2MotorTooltipFixer();

// Make it globally available
window.k2MotorTooltipFixer = k2MotorTooltipFixer;

// Disable any existing tooltip managers that might conflict
if (window.tooltipManager) {
    console.log('🛑 Disabling conflicting tooltip manager');
    window.tooltipManager = null;
}