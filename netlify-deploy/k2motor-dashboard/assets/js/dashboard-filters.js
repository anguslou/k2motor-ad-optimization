// K2Motor Performance Parts - Dashboard Filters System
// Date range, platform, scenario, and vehicle brand filtering functionality

class DashboardFilters {
    constructor() {
        this.currentFilters = {
            dateRange: 'Last 30 days',
            platform: 'All Platforms',
            scenario: 'All Scenarios',
            vehicle: 'All Vehicles'
        };
        
        this.filterState = {
            isFiltering: false,
            activeFilters: [],
            totalResults: 0,
            filteredResults: 0
        };
        
        this.filterData = new Map();
        this.isInitialized = false;
        
        // Define filter options for K2Motor Performance Parts
        this.filterOptions = {
            dateRange: [
                { value: 'Last 7 days', label: 'Last 7 days' },
                { value: 'Last 30 days', label: 'Last 30 days' },
                { value: 'Last 90 days', label: 'Last 90 days' },
                { value: 'Custom range', label: 'Custom range' }
            ],
            platform: [
                { value: 'All Platforms', label: 'All Platforms' },
                { value: 'Amazon', label: 'Amazon' },
                { value: 'eBay', label: 'eBay' },
                { value: 'Google', label: 'Google Ads' },
                { value: 'Facebook', label: 'Facebook' }
            ],
            scenario: [
                { value: 'All Scenarios', label: 'All Scenarios' },
                { value: 'Critical', label: 'Critical Issues' },
                { value: 'Warning', label: 'Warning Alerts' },
                { value: 'Opportunity', label: 'Opportunities' }
            ],
            vehicle: [
                { value: 'All Vehicles', label: 'All Vehicles' },
                { value: 'Honda', label: 'Honda Civic Type R' },
                { value: 'Toyota', label: 'Toyota Camry' },
                { value: 'Subaru', label: 'Subaru WRX/STI' },
                { value: 'BMW', label: 'BMW M3/M4' }
            ]
        };
    }

    // Initialize dashboard filters system
    initializeDashboardFilters() {
        console.log('🎯 Initializing K2Motor Performance Parts dashboard filters...');
        
        // Create filter controls
        this.createFilterControls();
        
        // Bind filter events
        this.bindFilterEvents();
        
        // Set up filter state management
        this.setupFilterStateManagement();
        
        // Load saved filters from localStorage
        this.loadSavedFilters();
        
        this.isInitialized = true;
        console.log('✅ K2Motor Performance Parts dashboard filters ready');
    }

    // Create filter control elements
    createFilterControls() {
        // Find existing filter containers or create them
        let filterContainer = document.querySelector('.filter-controls');
        
        if (!filterContainer) {
            // Create filter container in header
            const headerControls = document.querySelector('.header-controls');
            if (headerControls) {
                filterContainer = document.createElement('div');
                filterContainer.className = 'filter-controls';
                headerControls.insertBefore(filterContainer, headerControls.firstChild);
            }
        }
        
        if (filterContainer) {
            filterContainer.innerHTML = this.generateFilterHTML();
            console.log('🎨 Created filter controls for K2Motor Performance Parts');
        }
    }

    // Generate filter controls HTML
    generateFilterHTML() {
        return `
            <div class="filter-dropdown-container">
                <div class="filter-dropdown">
                    <button class="filter-btn" id="dateRangeFilter">
                        <span class="filter-icon">📅</span>
                        <span class="filter-label">${this.currentFilters.dateRange}</span>
                        <span class="filter-arrow">▼</span>
                    </button>
                    <div class="filter-menu daterange-menu">
                        ${this.filterOptions.dateRange.map(option => 
                            `<div class="filter-option" data-value="${option.value}">${option.label}</div>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="filter-dropdown">
                    <button class="filter-btn" id="platformFilter">
                        <span class="filter-icon">🏢</span>
                        <span class="filter-label">${this.currentFilters.platform}</span>
                        <span class="filter-arrow">▼</span>
                    </button>
                    <div class="filter-menu platform-menu">
                        ${this.filterOptions.platform.map(option => 
                            `<div class="filter-option" data-value="${option.value}">${option.label}</div>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="filter-dropdown">
                    <button class="filter-btn" id="scenarioFilter">
                        <span class="filter-icon">⚡</span>
                        <span class="filter-label">${this.currentFilters.scenario}</span>
                        <span class="filter-arrow">▼</span>
                    </button>
                    <div class="filter-menu scenario-menu">
                        ${this.filterOptions.scenario.map(option => 
                            `<div class="filter-option" data-value="${option.value}">${option.label}</div>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="filter-dropdown">
                    <button class="filter-btn" id="vehicleFilter">
                        <span class="filter-icon">🏎️</span>
                        <span class="filter-label">${this.currentFilters.vehicle}</span>
                        <span class="filter-arrow">▼</span>
                    </button>
                    <div class="filter-menu vehicle-menu">
                        ${this.filterOptions.vehicle.map(option => 
                            `<div class="filter-option" data-value="${option.value}">${option.label}</div>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="active-filters" id="activeFilters"></div>
                
                <button class="clear-filters" id="clearFilters" style="display: none;">
                    <span class="filter-icon">🗑️</span>
                    Clear All
                </button>
            </div>
        `;
    }

    // Bind filter events
    bindFilterEvents() {
        // Filter button clicks
        document.addEventListener('click', (event) => {
            if (event.target.closest('.filter-btn')) {
                const filterBtn = event.target.closest('.filter-btn');
                const dropdown = filterBtn.nextElementSibling;
                this.toggleFilterDropdown(filterBtn, dropdown);
            }
        });
        
        // Filter option selection
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('filter-option')) {
                const option = event.target;
                const menu = option.closest('.filter-menu');
                const filterType = this.getFilterType(menu);
                this.selectFilterOption(filterType, option.dataset.value, option.textContent);
            }
        });
        
        // Clear filters button
        document.addEventListener('click', (event) => {
            if (event.target.closest('#clearFilters')) {
                this.resetFilters();
            }
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.filter-dropdown')) {
                this.closeAllDropdowns();
            }
        });
        
        console.log('🖱️ Bound filter events for K2Motor Performance Parts');
    }

    // Toggle filter dropdown visibility
    toggleFilterDropdown(button, dropdown) {
        // Close other dropdowns
        document.querySelectorAll('.filter-menu').forEach(menu => {
            if (menu !== dropdown) {
                menu.classList.remove('active');
            }
        });
        
        // Toggle current dropdown
        dropdown.classList.toggle('active');
        button.classList.toggle('active');
    }

    // Close all filter dropdowns
    closeAllDropdowns() {
        document.querySelectorAll('.filter-menu').forEach(menu => {
            menu.classList.remove('active');
        });
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    }

    // Get filter type from menu element
    getFilterType(menu) {
        if (menu.classList.contains('daterange-menu')) return 'dateRange';
        if (menu.classList.contains('platform-menu')) return 'platform';
        if (menu.classList.contains('scenario-menu')) return 'scenario';
        if (menu.classList.contains('vehicle-menu')) return 'vehicle';
        return null;
    }

    // Select filter option
    selectFilterOption(filterType, value, label) {
        if (!filterType) return;
        
        // Update current filters
        this.currentFilters[filterType] = value;
        
        // Update button label
        const button = document.getElementById(`${filterType}Filter`);
        if (button) {
            const labelElement = button.querySelector('.filter-label');
            if (labelElement) {
                labelElement.textContent = label;
            }
        }
        
        // Close dropdown
        this.closeAllDropdowns();
        
        // Apply filters
        this.applyFilters();
        
        // Update active filters display
        this.updateActiveFiltersDisplay();
        
        console.log(`🎯 Applied ${filterType} filter: ${value} for K2Motor Performance Parts`);
    }

    // Apply filters to dashboard data
    applyFilters() {
        console.log('🔄 Applying K2Motor Performance Parts filters...');
        
        this.filterState.isFiltering = true;
        
        // Get current dashboard data
        const dashboardData = this.getDashboardData();
        
        // Apply filters
        const filteredData = this.filterData(dashboardData);
        
        // Update dashboard with filtered data
        this.updateDashboard(filteredData);
        
        // Update filter state
        this.filterState.totalResults = dashboardData.length;
        this.filterState.filteredResults = filteredData.length;
        
        // Save filter state
        this.saveFilterState();
        
        console.log(`✅ Filtered K2Motor Performance Parts data: ${filteredData.length}/${dashboardData.length} results`);
    }

    // Filter data based on current filters
    filterData(data) {
        return data.filter(item => {
            // Date range filter
            if (this.currentFilters.dateRange !== 'All Periods' && this.currentFilters.dateRange !== 'Last 30 days') {
                if (!this.matchesDateRange(item.date, this.currentFilters.dateRange)) {
                    return false;
                }
            }
            
            // Platform filter
            if (this.currentFilters.platform !== 'All Platforms') {
                if (item.platform !== this.currentFilters.platform) {
                    return false;
                }
            }
            
            // Scenario filter
            if (this.currentFilters.scenario !== 'All Scenarios') {
                if (!this.matchesScenario(item, this.currentFilters.scenario)) {
                    return false;
                }
            }
            
            // Vehicle filter
            if (this.currentFilters.vehicle !== 'All Vehicles') {
                if (!this.matchesVehicle(item, this.currentFilters.vehicle)) {
                    return false;
                }
            }
            
            return true;
        });
    }

    // Check if item matches date range
    matchesDateRange(itemDate, dateRange) {
        const now = new Date();
        const itemDateTime = new Date(itemDate);
        
        switch (dateRange) {
            case 'Last 7 days':
                return (now - itemDateTime) <= (7 * 24 * 60 * 60 * 1000);
            case 'Last 30 days':
                return (now - itemDateTime) <= (30 * 24 * 60 * 60 * 1000);
            case 'Last 90 days':
                return (now - itemDateTime) <= (90 * 24 * 60 * 60 * 1000);
            default:
                return true;
        }
    }

    // Check if item matches scenario filter
    matchesScenario(item, scenario) {
        switch (scenario) {
            case 'Critical':
                return item.alertLevel === 'critical' || item.poas < 1.0;
            case 'Warning':
                return item.alertLevel === 'warning' || (item.roas < 3.5 && item.roas >= 2.0);
            case 'Opportunity':
                return item.alertLevel === 'opportunity' || item.roas > 4.0;
            default:
                return true;
        }
    }

    // Check if item matches vehicle filter
    matchesVehicle(item, vehicle) {
        const itemText = (item.title || item.name || item.campaign || '').toLowerCase();
        const vehicleLower = vehicle.toLowerCase();
        
        switch (vehicle) {
            case 'Honda':
                return itemText.includes('honda') || itemText.includes('civic') || itemText.includes('type r');
            case 'Toyota':
                return itemText.includes('toyota') || itemText.includes('camry');
            case 'Subaru':
                return itemText.includes('subaru') || itemText.includes('wrx') || itemText.includes('sti');
            case 'BMW':
                return itemText.includes('bmw') || itemText.includes('m3') || itemText.includes('m4');
            default:
                return true;
        }
    }

    // Get current dashboard data
    getDashboardData() {
        // This would integrate with the actual dashboard data
        // For now, return mock filtered data structure
        return [
            {
                id: 1,
                title: 'Subaru Turbo Upgrades',
                platform: 'Amazon',
                vehicle: 'Subaru',
                roas: 4.22,
                poas: 0.8,
                alertLevel: 'critical',
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
            },
            {
                id: 2,
                title: 'Honda Type R Parts',
                platform: 'Amazon', 
                vehicle: 'Honda',
                roas: 4.24,
                poas: 2.1,
                alertLevel: 'opportunity',
                date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
            },
            {
                id: 3,
                title: 'BMW M Series Suspension',
                platform: 'Amazon',
                vehicle: 'BMW',
                roas: 3.56,
                poas: 1.4,
                alertLevel: 'warning',
                date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
            }
        ];
    }

    // Update dashboard with filtered data
    updateDashboard(filteredData) {
        // Update metrics cards
        this.updateMetricsWithFilteredData(filteredData);
        
        // Update scenario alerts
        this.updateScenariosWithFilteredData(filteredData);
        
        // Update campaign cards
        this.updateCampaignsWithFilteredData(filteredData);
        
        // Show filter feedback
        this.showFilterFeedback(filteredData.length);
    }

    // Update metrics with filtered data
    updateMetricsWithFilteredData(data) {
        // Calculate filtered metrics
        const totalSpend = data.reduce((sum, item) => sum + (item.spend || 0), 0);
        const totalRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0);
        const avgROAS = data.length > 0 ? data.reduce((sum, item) => sum + item.roas, 0) / data.length : 0;
        
        // Update metric displays
        const spendElement = document.querySelector('.metric-value');
        if (spendElement) {
            // This would update actual metric displays
            console.log(`📊 Updated metrics: Spend: $${totalSpend}, Revenue: $${totalRevenue}, ROAS: ${avgROAS.toFixed(2)}x`);
        }
    }

    // Update scenarios with filtered data
    updateScenariosWithFilteredData(data) {
        const criticalScenarios = data.filter(item => item.alertLevel === 'critical');
        const warningScenarios = data.filter(item => item.alertLevel === 'warning');
        const opportunityScenarios = data.filter(item => item.alertLevel === 'opportunity');
        
        console.log(`⚡ Filtered scenarios: ${criticalScenarios.length} critical, ${warningScenarios.length} warnings, ${opportunityScenarios.length} opportunities`);
    }

    // Update campaigns with filtered data
    updateCampaignsWithFilteredData(data) {
        const campaignElements = document.querySelectorAll('.campaign-card');
        
        campaignElements.forEach(card => {
            const cardTitle = card.querySelector('h4')?.textContent || '';
            const shouldShow = data.some(item => 
                cardTitle.toLowerCase().includes(item.title.toLowerCase()) ||
                this.matchesVehicle({ title: cardTitle }, this.currentFilters.vehicle)
            );
            
            card.style.display = shouldShow ? 'block' : 'none';
        });
        
        console.log(`🎯 Updated K2Motor Performance Parts campaign visibility`);
    }

    // Show filter feedback to user
    showFilterFeedback(resultCount) {
        // Create or update filter feedback
        let feedbackElement = document.querySelector('.filter-feedback');
        
        if (!feedbackElement) {
            feedbackElement = document.createElement('div');
            feedbackElement.className = 'filter-feedback';
            const tabContent = document.querySelector('.tab-content');
            if (tabContent) {
                tabContent.insertBefore(feedbackElement, tabContent.firstChild);
            }
        }
        
        if (this.hasActiveFilters()) {
            feedbackElement.innerHTML = `
                <div class="filter-results">
                    <span class="filter-icon">🔍</span>
                    Showing ${resultCount} results for K2Motor Performance Parts
                    <button class="btn-clear-filters" onclick="dashboardFilters.resetFilters()">Clear Filters</button>
                </div>
            `;
            feedbackElement.style.display = 'block';
        } else {
            feedbackElement.style.display = 'none';
        }
    }

    // Check if any filters are active
    hasActiveFilters() {
        return Object.values(this.currentFilters).some(filter => 
            !filter.startsWith('All') && filter !== 'Last 30 days'
        );
    }

    // Update active filters display
    updateActiveFiltersDisplay() {
        const activeFiltersContainer = document.getElementById('activeFilters');
        const clearButton = document.getElementById('clearFilters');
        
        if (!activeFiltersContainer || !clearButton) return;
        
        const activeFilters = [];
        
        Object.entries(this.currentFilters).forEach(([key, value]) => {
            if (!value.startsWith('All') && value !== 'Last 30 days') {
                activeFilters.push({ type: key, value: value });
            }
        });
        
        if (activeFilters.length > 0) {
            activeFiltersContainer.innerHTML = activeFilters.map(filter => 
                `<span class="active-filter" data-type="${filter.type}">
                    ${filter.value}
                    <button class="remove-filter" data-type="${filter.type}">×</button>
                </span>`
            ).join('');
            clearButton.style.display = 'block';
        } else {
            activeFiltersContainer.innerHTML = '';
            clearButton.style.display = 'none';
        }
        
        // Bind remove filter events
        activeFiltersContainer.querySelectorAll('.remove-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeFilter(btn.dataset.type);
            });
        });
    }

    // Remove individual filter
    removeFilter(filterType) {
        // Reset filter to default
        const defaultValues = {
            dateRange: 'Last 30 days',
            platform: 'All Platforms',
            scenario: 'All Scenarios',
            vehicle: 'All Vehicles'
        };
        
        this.currentFilters[filterType] = defaultValues[filterType];
        
        // Update UI and apply filters
        this.createFilterControls();
        this.bindFilterEvents();
        this.applyFilters();
        this.updateActiveFiltersDisplay();
        
        console.log(`🗑️ Removed ${filterType} filter for K2Motor Performance Parts`);
    }

    // Reset all filters
    resetFilters() {
        console.log('🔄 Resetting K2Motor Performance Parts filters...');
        
        this.currentFilters = {
            dateRange: 'Last 30 days',
            platform: 'All Platforms',
            scenario: 'All Scenarios',
            vehicle: 'All Vehicles'
        };
        
        // Update UI
        this.createFilterControls();
        this.bindFilterEvents();
        
        // Clear filter state
        this.filterState.isFiltering = false;
        this.filterState.activeFilters = [];
        
        // Refresh dashboard
        this.applyFilters();
        this.updateActiveFiltersDisplay();
        
        // Remove filter feedback
        const feedbackElement = document.querySelector('.filter-feedback');
        if (feedbackElement) {
            feedbackElement.style.display = 'none';
        }
        
        console.log('✅ K2Motor Performance Parts filters reset');
    }

    // Setup filter state management
    setupFilterStateManagement() {
        // Save filters when page unloads
        window.addEventListener('beforeunload', () => {
            this.saveFilterState();
        });
        
        console.log('💾 Set up K2Motor Performance Parts filter state management');
    }

    // Save current filter state
    saveFilterState() {
        const filterState = {
            filters: this.currentFilters,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('k2motor-filters', JSON.stringify(filterState));
        console.log('💾 Saved K2Motor Performance Parts filter state');
    }

    // Load saved filters
    loadSavedFilters() {
        try {
            const savedState = localStorage.getItem('k2motor-filters');
            if (savedState) {
                const filterState = JSON.parse(savedState);
                this.currentFilters = { ...this.currentFilters, ...filterState.filters };
                console.log('📂 Loaded saved K2Motor Performance Parts filters');
            }
        } catch (error) {
            console.warn('⚠️ Failed to load saved filters:', error);
        }
    }

    // Get filter statistics
    getFilterStats() {
        return {
            currentFilters: this.currentFilters,
            activeFilterCount: Object.values(this.currentFilters).filter(f => !f.startsWith('All')).length,
            isFiltering: this.filterState.isFiltering,
            totalResults: this.filterState.totalResults,
            filteredResults: this.filterState.filteredResults,
            initialized: this.isInitialized
        };
    }
}

// Initialize dashboard filters
const dashboardFilters = new DashboardFilters();

// Auto-start when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    dashboardFilters.initializeDashboardFilters();
    console.log('🎯 K2Motor Performance Parts dashboard filters system ready');
});

// Add filter styles
const filterStyles = `
<style>
.filter-controls {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
}

.filter-dropdown-container {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
}

.filter-dropdown {
    position: relative;
}

.filter-btn {
    background: var(--carbon-fiber);
    border: 1px solid #333;
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

.filter-btn:hover {
    border-color: var(--racing-orange);
    background: rgba(255, 107, 53, 0.1);
}

.filter-btn.active {
    border-color: var(--racing-orange);
    background: rgba(255, 107, 53, 0.2);
}

.filter-icon {
    font-size: 0.9rem;
}

.filter-arrow {
    font-size: 0.7rem;
    transition: transform 0.3s ease;
}

.filter-btn.active .filter-arrow {
    transform: rotate(180deg);
}

.filter-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background: var(--carbon-fiber);
    border: 1px solid var(--racing-orange);
    border-radius: 6px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
    z-index: 1000;
    min-width: 180px;
    max-height: 300px;
    overflow-y: auto;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
}

.filter-menu.active {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.filter-option {
    padding: 10px 15px;
    cursor: pointer;
    color: white;
    font-size: 0.9rem;
    transition: background 0.2s ease;
}

.filter-option:hover {
    background: rgba(255, 107, 53, 0.2);
}

.filter-option:first-child {
    border-radius: 6px 6px 0 0;
}

.filter-option:last-child {
    border-radius: 0 0 6px 6px;
}

.active-filters {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.active-filter {
    background: var(--electric-blue);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 4px;
}

.remove-filter {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;
    padding: 0;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.remove-filter:hover {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
}

.clear-filters {
    background: #6b7280;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: background 0.3s ease;
}

.clear-filters:hover {
    background: #9ca3af;
}

.filter-feedback {
    background: rgba(0, 212, 255, 0.1);
    border: 1px solid var(--electric-blue);
    border-radius: 6px;
    padding: 10px 15px;
    margin-bottom: 20px;
    display: none;
}

.filter-results {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--electric-blue);
    font-size: 0.9rem;
}

.btn-clear-filters {
    background: var(--racing-orange);
    color: white;
    border: none;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
}

/* Responsive design */
@media (max-width: 768px) {
    .filter-controls {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
    }
    
    .filter-dropdown-container {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
    }
    
    .filter-btn {
        justify-content: space-between;
    }
}
</style>
`;

// Inject filter styles
document.head.insertAdjacentHTML('beforeend', filterStyles);

// Make globally available
window.dashboardFilters = dashboardFilters;