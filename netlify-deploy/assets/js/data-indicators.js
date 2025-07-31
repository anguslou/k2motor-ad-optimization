// K2Motor Performance Parts - Data Source Indicators System
// Color-coded badges showing data origin with tooltips and real-time status

class DataSourceIndicators {
    constructor() {
        this.indicators = new Map();
        this.tooltipElement = null;
        this.tooltipTimeout = null;
        
        // Define data source types and their properties
        this.dataSourceTypes = {
            'API Direct': {
                emoji: '🟢',
                color: '#10b981',
                bgColor: 'rgba(16, 185, 129, 0.1)',
                description: 'Live data from platform APIs (Amazon, eBay, Google, Facebook)',
                reliability: 'Real-time',
                updateFrequency: 'Every 15 minutes',
                latency: '< 2 minutes'
            },
            'Calculated': {
                emoji: '🟡',
                color: '#f59e0b',
                bgColor: 'rgba(245, 158, 11, 0.1)',
                description: 'Derived metrics calculated from API data (ROAS, POAS, Attribution)',
                reliability: 'High accuracy',
                updateFrequency: 'Every 30 minutes',
                latency: '< 5 minutes'
            },
            'CSV Import': {
                emoji: '🔵',
                color: '#3b82f6',
                bgColor: 'rgba(59, 130, 246, 0.1)',
                description: 'Manual data uploads for K2Motor Performance Parts cost structures',
                reliability: 'Manual entry',
                updateFrequency: 'As needed',
                latency: 'Immediate after upload'
            },
            'One-time Setup': {
                emoji: '🔴',
                color: '#ef4444',
                bgColor: 'rgba(239, 68, 68, 0.1)',
                description: 'Initial configuration data for K2Motor Performance Parts campaigns',
                reliability: 'Configuration',
                updateFrequency: 'Manual updates',
                latency: 'Immediate'
            }
        };
        
        // Track API connectivity status
        this.apiStatus = {
            amazon: 'connected',
            ebay: 'connected',
            google: 'connected',
            facebook: 'connected'
        };
    }

    // Initialize data source indicator system
    initializeDataSourceIndicators() {
        console.log('🎯 Initializing K2Motor Performance Parts data source indicators...');
        
        // Find all source indicators in the dashboard
        this.scanForIndicators();
        
        // Set up tooltip system
        this.createTooltipElement();
        
        // Bind event listeners
        this.bindIndicatorEvents();
        
        // Start real-time updates
        this.startRealTimeUpdates();
        
        console.log(`✅ Found ${this.indicators.size} data source indicators for K2Motor Performance Parts dashboard`);
    }

    // Scan dashboard for source indicator elements
    scanForIndicators() {
        const indicatorElements = document.querySelectorAll('.source-indicator');
        
        indicatorElements.forEach((element, index) => {
            // Extract data-source= attribute for indicator processing
            const dataSource = element.getAttribute('data-source');
            const indicatorId = `indicator-${index}`;
            
            if (dataSource && this.dataSourceTypes[dataSource]) {
                this.indicators.set(indicatorId, {
                    element: element,
                    dataSource: dataSource,
                    lastUpdated: new Date(),
                    status: 'active'
                });
                
                // Apply initial styling
                this.updateIndicatorStatus(indicatorId);
            }
        });
    }

    // Update data source badges with current status
    updateDataSourceBadges() {
        console.log('🔄 Updating K2Motor Performance Parts data source badges...');
        
        this.indicators.forEach((indicator, indicatorId) => {
            const sourceType = this.dataSourceTypes[indicator.dataSource];
            const element = indicator.element;
            
            // Update visual appearance
            element.style.color = sourceType.color;
            element.style.backgroundColor = sourceType.bgColor;
            element.style.border = `1px solid ${sourceType.color}`;
            element.style.borderRadius = '4px';
            element.style.padding = '2px 6px';
            element.style.fontSize = '0.8rem';
            element.style.fontWeight = 'bold';
            element.style.cursor = 'help';
            element.style.display = 'inline-flex';
            element.style.alignItems = 'center';
            element.style.gap = '4px';
            
            // Set content with emoji and text
            element.innerHTML = `${sourceType.emoji} ${indicator.dataSource}`;
            
            // Add title attribute for basic tooltip
            element.title = sourceType.description;
        });
    }

    // Update individual indicator status
    updateIndicatorStatus(indicatorId) {
        const indicator = this.indicators.get(indicatorId);
        if (!indicator) return;
        
        const sourceType = this.dataSourceTypes[indicator.dataSource];
        const element = indicator.element;
        
        // Apply styling based on source type
        element.style.color = sourceType.color;
        element.style.backgroundColor = sourceType.bgColor;
        element.style.border = `1px solid ${sourceType.color}`;
        element.style.borderRadius = '4px';
        element.style.padding = '2px 6px';
        element.style.fontSize = '0.8rem';
        element.style.fontWeight = 'bold';
        element.style.cursor = 'help';
        element.style.display = 'inline-flex';
        element.style.alignItems = 'center';
        element.style.gap = '4px';
        
        // Update content
        element.innerHTML = `${sourceType.emoji} ${indicator.dataSource}`;
        element.title = sourceType.description;
        
        // Update last updated timestamp
        indicator.lastUpdated = new Date();
        
        console.log(`✅ Updated ${indicator.dataSource} indicator for K2Motor Performance Parts`);
    }

    // Create tooltip element for detailed information
    createTooltipElement() {
        if (this.tooltipElement) return;
        
        this.tooltipElement = document.createElement('div');
        this.tooltipElement.className = 'data-source-tooltip';
        this.tooltipElement.style.cssText = `
            position: absolute;
            background: var(--carbon-fiber);
            border: 1px solid var(--racing-orange);
            border-radius: 8px;
            padding: 12px;
            z-index: 1000;
            max-width: 300px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
            font-size: 0.9rem;
            line-height: 1.4;
        `;
        
        document.body.appendChild(this.tooltipElement);
    }

    // Show detailed tooltip on hover
    showDataSourceTooltip(indicatorId, event) {
        const indicator = this.indicators.get(indicatorId);
        if (!indicator || !this.tooltipElement) return;
        
        const sourceType = this.dataSourceTypes[indicator.dataSource];
        const lastUpdated = indicator.lastUpdated.toLocaleTimeString();
        
        // Build tooltip-content HTML structure
        const tooltipContent = `
            <div class="data-source-explanation">
                <div class="tooltip-header">
                    <span class="tooltip-emoji">${sourceType.emoji}</span>
                    <strong>${indicator.dataSource}</strong>
                </div>
                <div class="tooltip-body">
                    <p>${sourceType.description}</p>
                    <div class="tooltip-details">
                        <div><strong>Reliability:</strong> ${sourceType.reliability}</div>
                        <div><strong>Update Frequency:</strong> ${sourceType.updateFrequency}</div>
                        <div><strong>Latency:</strong> ${sourceType.latency}</div>
                        <div><strong>Last Updated:</strong> ${lastUpdated}</div>
                    </div>
                    ${this.getApiStatusInfo(indicator.dataSource)}
                </div>
            </div>
        `;
        
        this.tooltipElement.innerHTML = tooltipContent;
        
        // Position tooltip
        const rect = event.target.getBoundingClientRect();
        this.tooltipElement.style.left = `${rect.left}px`;
        this.tooltipElement.style.top = `${rect.bottom + 8}px`;
        
        // Show tooltip
        this.showTooltip();
    }

    // Get API status information for tooltip
    getApiStatusInfo(dataSource) {
        if (dataSource !== 'API Direct') return '';
        
        const statusInfo = Object.entries(this.apiStatus)
            .map(([platform, status]) => {
                const statusEmoji = status === 'connected' ? '🟢' : '🔴';
                const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
                return `<span class="api-status">${statusEmoji} ${platformName}</span>`;
            })
            .join(' ');
        
        return `
            <div class="api-status-section">
                <strong>K2Motor Performance Parts API Status:</strong>
                <div class="api-status-grid">${statusInfo}</div>
            </div>
        `;
    }

    // Show tooltip with animation
    showTooltip() {
        if (this.tooltipTimeout) {
            clearTimeout(this.tooltipTimeout);
        }
        
        this.tooltipElement.style.opacity = '1';
        
        console.log('👁️ Showing K2Motor Performance Parts data source tooltip');
    }

    // Hide tooltip with delay
    hideTooltip() {
        this.tooltipTimeout = setTimeout(() => {
            if (this.tooltipElement) {
                this.tooltipElement.style.opacity = '0';
            }
        }, 300);
        
        console.log('👁️ Hiding K2Motor Performance Parts data source tooltip');
    }

    // Bind event listeners to indicators
    bindIndicatorEvents() {
        this.indicators.forEach((indicator, indicatorId) => {
            const element = indicator.element;
            
            element.addEventListener('mouseenter', (event) => {
                this.showDataSourceTooltip(indicatorId, event);
            });
            
            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
            
            element.addEventListener('click', (event) => {
                event.preventDefault();
                this.showDetailedInfo(indicatorId);
            });
        });
    }

    // Show detailed information modal
    showDetailedInfo(indicatorId) {
        const indicator = this.indicators.get(indicatorId);
        if (!indicator) return;
        
        console.log(`📊 Showing detailed info for ${indicator.dataSource} in K2Motor Performance Parts dashboard`);
        
        // This could trigger a detailed modal or expand section
        alert(`Data Source Details:\n\n${indicator.dataSource}\n\n${this.dataSourceTypes[indicator.dataSource].description}`);
    }

    // Refresh data sources and update indicators
    refreshDataSources() {
        console.log('🔄 Refreshing K2Motor Performance Parts data sources...');
        
        // Simulate API connectivity check
        this.checkApiConnectivity();
        
        // Update all badges
        this.updateDataSourceBadges();
        
        // Update status indicators
        this.indicators.forEach((indicator, indicatorId) => {
            this.updateIndicatorStatus(indicatorId);
        });
        
        console.log('✅ K2Motor Performance Parts data sources refreshed');
    }

    // Check API connectivity status
    checkApiConnectivity() {
        // Simulate API status checks for K2Motor Performance Parts integrations
        const platforms = ['amazon', 'ebay', 'google', 'facebook'];
        
        platforms.forEach(platform => {
            // Simulate random connectivity (in production, this would be real API calls)
            const isConnected = Math.random() > 0.1; // 90% uptime simulation
            this.apiStatus[platform] = isConnected ? 'connected' : 'disconnected';
            
            if (!isConnected) {
                console.warn(`⚠️ K2Motor Performance Parts ${platform} API connection issue detected`);
            }
        });
        
        // Update indicators based on connectivity
        this.updateConnectivityStatus();
    }

    // Update connectivity status for API Direct indicators
    updateConnectivityStatus() {
        this.indicators.forEach((indicator, indicatorId) => {
            if (indicator.dataSource === 'API Direct') {
                const hasConnectionIssues = Object.values(this.apiStatus).includes('disconnected');
                
                if (hasConnectionIssues) {
                    indicator.element.style.borderColor = '#f59e0b'; // Warning color
                    indicator.element.title += ' (Some API connections have issues)';
                } else {
                    indicator.element.style.borderColor = this.dataSourceTypes['API Direct'].color;
                }
            }
        });
    }

    // Start real-time updates for data source indicators
    startRealTimeUpdates() {
        // Refresh indicators every 5 minutes
        setInterval(() => {
            this.refreshDataSources();
        }, 5 * 60 * 1000);
        
        // Check API connectivity every 2 minutes
        setInterval(() => {
            this.checkApiConnectivity();
        }, 2 * 60 * 1000);
        
        console.log('⏰ Started real-time updates for K2Motor Performance Parts data source indicators');
    }

    // Get indicator statistics
    getIndicatorStats() {
        const stats = {
            total: this.indicators.size,
            byType: {},
            apiStatus: this.apiStatus
        };
        
        this.indicators.forEach(indicator => {
            const type = indicator.dataSource;
            stats.byType[type] = (stats.byType[type] || 0) + 1;
        });
        
        return stats;
    }
}

// Initialize data source indicators system
const dataSourceIndicators = new DataSourceIndicators();

// Auto-start when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    dataSourceIndicators.initializeDataSourceIndicators();
    console.log('🎯 K2Motor Performance Parts data source indicators system ready');
});

// Add custom CSS for tooltips
const indicatorStyles = `
<style>
.data-source-tooltip {
    color: white;
    font-family: Arial, sans-serif;
}

.tooltip-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid #333;
    color: var(--racing-orange);
}

.tooltip-emoji {
    font-size: 1.2rem;
}

.tooltip-body p {
    margin: 0 0 10px 0;
    color: #ccc;
}

.tooltip-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 0.8rem;
    color: #aaa;
}

.tooltip-details div {
    display: flex;
    justify-content: space-between;
}

.tooltip-details strong {
    color: #ddd;
}

.api-status-section {
    margin-top: 10px;
    padding-top: 8px;
    border-top: 1px solid #333;
}

.api-status-grid {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 4px;
}

.api-status {
    font-size: 0.75rem;
    padding: 2px 4px;
    background: rgba(255, 107, 53, 0.1);
    border-radius: 3px;
}

.source-indicator {
    transition: all 0.2s ease;
}

.source-indicator:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
}
</style>
`;

// Inject indicator styles
document.head.insertAdjacentHTML('beforeend', indicatorStyles);