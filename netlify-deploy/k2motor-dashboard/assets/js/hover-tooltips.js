// K2Motor Performance Parts - Hover Tooltips System
// Detailed explanations on metric hover for better user understanding

class HoverTooltips {
    constructor() {
        this.tooltipElement = null;
        this.activeTooltip = null;
        this.tooltipTimeout = null;
        this.isInitialized = false;
        
        // Define tooltip content for K2Motor Performance Parts metrics
        this.tooltipDefinitions = {
            'ROAS': {
                title: 'Return on Ad Spend (ROAS)',
                description: 'Total revenue generated divided by total ad spend. Shows the effectiveness of K2Motor Performance Parts advertising campaigns.',
                formula: 'ROAS = Total Revenue / Total Ad Spend',
                example: 'A 4.2x ROAS means every $1 spent on ads generates $4.20 in revenue',
                context: 'K2Motor targets 4.2x+ ROAS for performance parts campaigns',
                icon: '📈'
            },
            'POAS': {
                title: 'Profit on Ad Spend (POAS)',
                description: 'True profitability metric accounting for product costs and margins. Critical for K2Motor Performance Parts financial health.',
                formula: 'POAS = (Revenue - Product Costs) / Ad Spend',
                example: 'A 2.1x POAS means every $1 spent on ads generates $2.10 in profit',
                context: 'POAS reveals if high ROAS campaigns are actually profitable',
                icon: '💰'
            },
            'Attribution': {
                title: 'Advanced Attribution Analysis', 
                description: 'Cross-brand control group methodology comparing Honda vs Toyota to measure true incremental lift from K2Motor ads.',
                formula: 'Incremental Lift = (Test Group Performance - Control Group Performance)',
                example: 'Honda brake pads (with ads) vs Toyota brake pads (without ads)',
                context: 'Removes organic demand to show true advertising effectiveness',
                icon: '🧮'
            },
            'Incremental Lift': {
                title: 'Incremental Lift',
                description: 'Percentage increase in performance directly attributable to advertising, after removing baseline market demand.',
                formula: 'Lift = ((Test - Control) / Control) × 100%',
                example: '52.4% lift means ads drove 52% more sales than organic demand',
                context: 'Key metric for proving K2Motor ad effectiveness',
                icon: '📊'
            },
            'Honda': {
                title: 'Honda Civic Type R Performance Parts',
                description: 'High-performance aftermarket parts for Honda Civic Type R (FK8) including intakes, brakes, and aerodynamic components.',
                performance: 'Excellent ROAS: 4.24x | Strong POAS: 2.1x',
                market: 'Enthusiast community with strong conversion rates',
                context: 'Premium market segment with high-value customers',
                icon: '🏎️'
            },
            'Toyota': {
                title: 'Toyota Camry Performance Parts',
                description: 'Control group for attribution analysis. Represents baseline market performance without advertising spend.',
                performance: 'Organic Revenue: $8,450 | No Ad Spend',
                market: 'Broader market appeal with consistent demand',
                context: 'Used as control to measure true advertising incrementality',
                icon: '🚗'
            },
            'Subaru': {
                title: 'Subaru WRX/STI Performance Parts',
                description: 'High-performance turbo systems, intercoolers, and racing components for Subaru WRX and STI models.',
                performance: 'High ROAS: 4.22x | Low POAS: 0.8x (needs optimization)',
                market: 'Rally and track enthusiasts with high engagement',
                context: 'Profitable audience but high manufacturing costs impact POAS',
                icon: '🏁'
            },
            'BMW': {
                title: 'BMW M3/M4 Performance Parts',
                description: 'Premium suspension, braking, and aerodynamic upgrades for BMW M3/M4 vehicles.',
                performance: 'Moderate ROAS: 3.56x | POAS: 1.4x',
                market: 'Luxury performance segment with price sensitivity',
                context: 'Premium positioning required to justify higher costs',
                icon: '🏆'
            }
        };
    }

    // Initialize hover tooltip system
    initializeHoverTooltips() {
        console.log('🎯 Initializing K2Motor Performance Parts hover tooltips...');
        
        // Create tooltip elements
        this.createTooltipElements();
        
        // Bind tooltip events to existing elements
        this.bindTooltipEvents();
        
        // Set up dynamic tooltip scanning
        this.setupDynamicScanning();
        
        this.isInitialized = true;
        console.log('✅ K2Motor Performance Parts hover tooltips ready');
    }

    // Create tooltip DOM elements
    createTooltipElements() {
        if (this.tooltipElement) return;
        
        this.tooltipElement = document.createElement('div');
        this.tooltipElement.className = 'hover-tooltip';
        this.tooltipElement.style.cssText = `
            position: absolute;
            background: var(--carbon-fiber);
            border: 1px solid var(--racing-orange);
            border-radius: 8px;
            padding: 15px;
            max-width: 350px;
            z-index: 1000;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease, transform 0.3s ease;
            transform: translateY(10px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
            font-size: 0.9rem;
            line-height: 1.5;
        `;
        
        document.body.appendChild(this.tooltipElement);
        console.log('🎨 Created tooltip container for K2Motor Performance Parts');
    }

    // Bind tooltip events to dashboard elements
    bindTooltipEvents() {
        // Target common tooltip triggers
        const tooltipSelectors = [
            '.metric-value',
            '.metric-label', 
            '.campaign-card h4',
            '.platform',
            '[data-tooltip]',
            '.tooltip-trigger'
        ];
        
        tooltipSelectors.forEach(selector => {
            document.addEventListener('mouseenter', (event) => {
                // Use matches with polyfill support
                const target = event.target;
                if (target && target.matches && target.matches(selector)) {
                    this.handleMouseEnter(event);
                }
            }, true);
            
            document.addEventListener('mouseleave', (event) => {
                // Use matches with polyfill support
                const target = event.target;
                if (target && target.matches && target.matches(selector)) {
                    this.handleMouseLeave(event);
                }
            }, true);
        });
        
        console.log('🖱️ Bound hover events for K2Motor Performance Parts tooltips');
    }

    // Handle mouse enter events
    handleMouseEnter(event) {
        const element = event.target;
        const tooltipContent = this.determineTooltipContent(element);
        
        if (tooltipContent) {
            this.showTooltip(tooltipContent, event);
        }
    }

    // Handle mouse leave events
    handleMouseLeave(event) {
        this.hideTooltip();
    }

    // Determine tooltip content based on element
    determineTooltipContent(element) {
        // Check for explicit data-tooltip attribute
        const explicitTooltip = element.getAttribute('data-tooltip');
        if (explicitTooltip && this.tooltipDefinitions[explicitTooltip]) {
            return this.tooltipDefinitions[explicitTooltip];
        }
        
        // Analyze element content and context
        const textContent = element.textContent.trim();
        const classList = Array.from(element.classList);
        const parentContext = element.closest('.tab-panel')?.getAttribute('data-tab') || 'overview';
        
        // Match based on text content
        if (textContent.includes('ROAS') || classList.includes('roas')) {
            return this.tooltipDefinitions['ROAS'];
        } else if (textContent.includes('POAS') || classList.includes('poas')) {
            return this.tooltipDefinitions['POAS'];
        } else if (textContent.includes('Attribution') || textContent.includes('Incremental')) {
            return this.tooltipDefinitions['Attribution'];
        } else if (textContent.includes('Lift')) {
            return this.tooltipDefinitions['Incremental Lift'];
        }
        
        // Match vehicle brands
        if (textContent.includes('Honda') || classList.includes('honda')) {
            return this.tooltipDefinitions['Honda'];
        } else if (textContent.includes('Toyota') || classList.includes('toyota')) {
            return this.tooltipDefinitions['Toyota'];
        } else if (textContent.includes('Subaru') || classList.includes('subaru')) {
            return this.tooltipDefinitions['Subaru'];
        } else if (textContent.includes('BMW') || classList.includes('bmw')) {
            return this.tooltipDefinitions['BMW'];
        }
        
        // Generic K2Motor Performance Parts context
        if (textContent.includes('Performance Parts') || parentContext === 'campaigns') {
            return {
                title: 'K2Motor Performance Parts',
                description: 'High-performance aftermarket automotive parts for sports cars and enthusiast vehicles.',
                context: 'Specialized in turbo systems, brakes, suspension, and aerodynamic components',
                icon: '🏎️'
            };
        }
        
        return null;
    }

    // Show tooltip with content
    showTooltip(content, event) {
        if (!this.tooltipElement || !content) return;
        
        // Clear any existing timeout
        if (this.tooltipTimeout) {
            clearTimeout(this.tooltipTimeout);
        }
        
        // Update tooltip content
        this.updateTooltipContent(content);
        
        // Position tooltip
        this.positionTooltip(event);
        
        // Show with animation
        this.tooltipElement.style.opacity = '1';
        this.tooltipElement.style.transform = 'translateY(0)';
        
        this.activeTooltip = content;
        console.log(`📋 Showing tooltip: ${content.title}`);
    }

    // Hide tooltip with delay
    hideTooltip() {
        if (!this.tooltipElement) return;
        
        this.tooltipTimeout = setTimeout(() => {
            if (this.tooltipElement) {
                this.tooltipElement.style.opacity = '0';
                this.tooltipElement.style.transform = 'translateY(10px)';
            }
            this.activeTooltip = null;
        }, 200);
        
        console.log('👁️ Hiding K2Motor Performance Parts tooltip');
    }

    // Update tooltip content
    updateTooltipContent(content) {
        if (!this.tooltipElement) return;
        
        const tooltipHTML = `
            <div class="tooltip-container">
                <div class="tooltip-header">
                    <span class="tooltip-icon">${content.icon || '📊'}</span>
                    <strong>${content.title}</strong>
                </div>
                <div class="tooltip-body">
                    <p class="tooltip-description">${content.description}</p>
                    ${content.formula ? `<div class="tooltip-formula"><strong>Formula:</strong> ${content.formula}</div>` : ''}
                    ${content.example ? `<div class="tooltip-example"><strong>Example:</strong> ${content.example}</div>` : ''}
                    ${content.performance ? `<div class="tooltip-performance"><strong>Performance:</strong> ${content.performance}</div>` : ''}
                    ${content.market ? `<div class="tooltip-market"><strong>Market:</strong> ${content.market}</div>` : ''}
                    ${content.context ? `<div class="tooltip-context"><strong>Context:</strong> ${content.context}</div>` : ''}
                </div>
                <div class="tooltip-arrow"></div>
            </div>
        `;
        
        this.tooltipElement.innerHTML = tooltipHTML;
    }

    // Position tooltip relative to cursor
    positionTooltip(event) {
        if (!this.tooltipElement) return;
        
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        const scrollX = window.pageXOffset;
        const scrollY = window.pageYOffset;
        
        // Get tooltip dimensions
        this.tooltipElement.style.opacity = '1';
        this.tooltipElement.style.visibility = 'hidden';
        const rect = this.tooltipElement.getBoundingClientRect();
        this.tooltipElement.style.visibility = 'visible';
        this.tooltipElement.style.opacity = '0';
        
        // Calculate position
        let left = mouseX + 15;
        let top = mouseY + 15;
        
        // Prevent tooltip from going off-screen
        if (left + rect.width > window.innerWidth) {
            left = mouseX - rect.width - 15;
        }
        
        if (top + rect.height > window.innerHeight) {
            top = mouseY - rect.height - 15;
        }
        
        // Ensure tooltip stays within viewport
        left = Math.max(10, Math.min(left, window.innerWidth - rect.width - 10));
        top = Math.max(10, Math.min(top, window.innerHeight - rect.height - 10));
        
        // Apply position
        this.tooltipElement.style.left = `${left + scrollX}px`;
        this.tooltipElement.style.top = `${top + scrollY}px`;
    }

    // Setup dynamic scanning for new elements
    setupDynamicScanning() {
        // Use MutationObserver to watch for new elements
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.scanNewElements(node);
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('🔍 Set up dynamic scanning for K2Motor Performance Parts tooltips');
    }

    // Scan new elements for tooltip triggers
    scanNewElements(element) {
        const tooltipTriggers = element.querySelectorAll('.metric-value, .metric-label, .campaign-card, .platform, [data-tooltip]');
        
        if (tooltipTriggers.length > 0) {
            console.log(`🆕 Found ${tooltipTriggers.length} new tooltip triggers for K2Motor Performance Parts`);
        }
    }

    // Add tooltip to specific element
    addTooltipToElement(element, tooltipKey) {
        if (this.tooltipDefinitions[tooltipKey]) {
            element.setAttribute('data-tooltip', tooltipKey);
            element.classList.add('tooltip-trigger');
            console.log(`✅ Added ${tooltipKey} tooltip to K2Motor Performance Parts element`);
        }
    }

    // Get tooltip statistics
    getTooltipStats() {
        const triggers = document.querySelectorAll('.tooltip-trigger, [data-tooltip]');
        return {
            availableTooltips: Object.keys(this.tooltipDefinitions).length,
            activeTriggers: triggers.length,
            currentTooltip: this.activeTooltip?.title || null,
            initialized: this.isInitialized
        };
    }
}

// Initialize hover tooltips system
const hoverTooltips = new HoverTooltips();

// Auto-start when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    hoverTooltips.initializeHoverTooltips();
    console.log('🎯 K2Motor Performance Parts hover tooltips system ready');
});

// Add tooltip styles
const tooltipStyles = `
<style>
.hover-tooltip {
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.tooltip-container {
    position: relative;
}

.tooltip-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(255, 107, 53, 0.3);
    color: var(--racing-orange);
}

.tooltip-icon {
    font-size: 1.2rem;
}

.tooltip-body {
    color: #ccc;
}

.tooltip-description {
    margin: 0 0 10px 0;
    line-height: 1.6;
}

.tooltip-formula,
.tooltip-example,
.tooltip-performance,
.tooltip-market,
.tooltip-context {
    margin: 8px 0;
    padding: 6px 0;
    font-size: 0.85rem;
    border-top: 1px solid #333;
}

.tooltip-formula strong,
.tooltip-example strong,
.tooltip-performance strong,
.tooltip-market strong,
.tooltip-context strong {
    color: var(--electric-blue);
}

.tooltip-arrow {
    position: absolute;
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-bottom-color: var(--racing-orange);
    top: -12px;
    left: 20px;
}

.tooltip-trigger {
    cursor: help;
    position: relative;
}

.tooltip-trigger:hover {
    text-decoration: underline;
    text-decoration-color: var(--racing-orange);
    text-decoration-style: dotted;
}

/* Racing theme integration */
.hover-tooltip {
    background: linear-gradient(135deg, var(--carbon-fiber) 0%, rgba(26, 26, 46, 0.95) 100%);
    backdrop-filter: blur(10px);
}

.hover-tooltip::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--racing-orange), var(--electric-blue));
    border-radius: 8px 8px 0 0;
}
</style>
`;

// Inject tooltip styles
document.head.insertAdjacentHTML('beforeend', tooltipStyles);

// Make globally available
window.hoverTooltips = hoverTooltips;