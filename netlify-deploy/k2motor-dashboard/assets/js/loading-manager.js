// K2Motor Performance Parts - Loading State Management System
// Skeleton screens, progressive loading, and racing-themed loading animations

class LoadingManager {
    constructor() {
        this.isInitialized = false;
        this.activeLoadingStates = new Map();
        this.loadingQueue = [];
        this.performanceMetrics = {
            totalLoadTime: 0,
            criticalResourcesLoaded: 0,
            secondaryResourcesLoaded: 0,
            loadingSequenceStartTime: null
        };
        
        // Loading state configuration
        this.loadingConfig = {
            criticalTimeout: 5000,    // 5 seconds for critical content
            secondaryTimeout: 10000,  // 10 seconds for secondary content
            retryAttempts: 3,
            retryDelay: 1000,
            progressiveDelay: 200     // Stagger loading by 200ms
        };
        
        // Racing-themed loading animations
        this.loadingAnimations = {
            turboSpinner: 'turbo-spinner',
            racingLoader: 'racing-loader',
            shimmerAnimation: 'shimmer-animation',
            pulseLoading: 'pulse-loading'
        };
        
        // IntersectionObserver for lazy loading
        this.lazyLoadObserver = null;
    }

    // Initialize loading state management
    initializeLoadingStates() {
        console.log('🎯 Initializing K2Motor Performance Parts loading states...');
        
        // Set up performance monitoring
        this.setupPerformanceMonitoring();
        
        // Initialize skeleton screens
        this.initializeSkeletonScreens();
        
        // Set up progressive loading system
        this.setupProgressiveLoading();
        
        // Initialize lazy loading observer
        this.setupLazyLoadingObserver();
        
        // Set up error state handling
        this.setupErrorStateHandling();
        
        // Start initial loading sequence
        this.startInitialLoadingSequence();
        
        this.isInitialized = true;
        console.log('✅ K2Motor Performance Parts loading states ready');
    }

    // Set up performance monitoring
    setupPerformanceMonitoring() {
        // Mark loading sequence start
        if (performance && performance.mark) {
            performance.mark('k2motor-loading-start');
            this.performanceMetrics.loadingSequenceStartTime = performance.now();
        }
        
        // Monitor page load events
        window.addEventListener('load', () => {
            this.measureLoadTime();
        });
        
        // Monitor visibility changes for progressive loading
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.resumeProgressiveLoading();
            }
        });
        
        console.log('📊 Set up K2Motor Performance Parts loading performance monitoring');
    }

    // Measure total load time
    measureLoadTime() {
        if (performance && performance.measure) {
            try {
                performance.mark('k2motor-loading-end');
                performance.measure('k2motor-total-load', 'k2motor-loading-start', 'k2motor-loading-end');
                
                const loadMeasure = performance.getEntriesByName('k2motor-total-load')[0];
                this.performanceMetrics.totalLoadTime = loadMeasure.duration;
                
                console.log(`⏱️ K2Motor dashboard loaded in ${loadMeasure.duration.toFixed(2)}ms`);
            } catch (error) {
                console.warn('⚠️ Performance measurement failed:', error);
            }
        }
    }

    // Initialize skeleton screens for different components
    initializeSkeletonScreens() {
        // Create skeleton templates
        this.createSkeletonTemplates();
        
        // Show skeletons for initial content
        this.showInitialSkeletons();
        
        console.log('💀 Initialized K2Motor Performance Parts skeleton screens');
    }

    // Create skeleton screen for specific element type
    createSkeletonScreen(elementType, container) {
        if (!container) return null;
        
        const skeleton = document.createElement('div');
        skeleton.className = `skeleton-${elementType} loading-skeleton`;
        skeleton.setAttribute('aria-label', 'Loading content...');
        skeleton.setAttribute('role', 'status');
        
        // Add specific skeleton structure based on type
        switch (elementType) {
            case 'metric-card':
                skeleton.innerHTML = `
                    <div class="skeleton-label"></div>
                    <div class="skeleton-value"></div>
                    <div class="skeleton-change"></div>
                `;
                break;
            case 'chart':
                skeleton.innerHTML = `
                    <div class="skeleton-chart-title"></div>
                    <div class="skeleton-chart-area">
                        <div class="skeleton-chart-line"></div>
                    </div>
                `;
                break;
            case 'table-row':
                skeleton.innerHTML = `
                    <div class="skeleton-cell"></div>
                    <div class="skeleton-cell"></div>
                    <div class="skeleton-cell"></div>
                    <div class="skeleton-cell"></div>
                    <div class="skeleton-cell"></div>
                `;
                break;
            case 'campaign-card':
                skeleton.innerHTML = `
                    <div class="skeleton-header">
                        <div class="skeleton-title"></div>
                        <div class="skeleton-status"></div>
                    </div>
                    <div class="skeleton-metrics">
                        <div class="skeleton-metric"></div>
                        <div class="skeleton-metric"></div>
                        <div class="skeleton-metric"></div>
                    </div>
                `;
                break;
            default:
                skeleton.innerHTML = `<div class="skeleton-generic"></div>`;
        }
        
        container.appendChild(skeleton);
        return skeleton;
    }

    // Create skeleton screen templates
    createSkeletonTemplates() {
        const skeletonTemplates = {
            'skeleton-metric-card': this.createMetricCardSkeleton(),
            'skeleton-chart': this.createChartSkeleton(),
            'skeleton-table-row': this.createTableRowSkeleton(),
            'skeleton-campaign-card': this.createCampaignCardSkeleton()
        };
        
        // Inject skeleton templates into page
        Object.entries(skeletonTemplates).forEach(([className, template]) => {
            const style = document.createElement('style');
            style.textContent = template;
            document.head.appendChild(style);
        });
    }

    // Create metric card skeleton
    createMetricCardSkeleton() {
        return `
            .skeleton-metric-card {
                background: var(--carbon-fiber);
                border: 1px solid #333;
                border-radius: 12px;
                padding: 20px;
                height: 140px;
                position: relative;
                overflow: hidden;
                animation: skeleton-pulse 1.5s ease-in-out infinite alternate;
            }
            
            .skeleton-metric-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(
                    90deg,
                    transparent,
                    rgba(255, 107, 53, 0.1),
                    transparent
                );
                animation: shimmer-animation 2s infinite;
            }
            
            .skeleton-metric-card .skeleton-label {
                width: 60%;
                height: 14px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
                margin-bottom: 10px;
            }
            
            .skeleton-metric-card .skeleton-value {
                width: 80%;
                height: 24px;
                background: rgba(0, 212, 255, 0.2);
                border-radius: 4px;
                margin-bottom: 15px;
            }
            
            .skeleton-metric-card .skeleton-change {
                width: 40%;
                height: 12px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
            }
        `;
    }

    // Create chart skeleton
    createChartSkeleton() {
        return `
            .skeleton-chart {
                background: var(--carbon-fiber);
                border: 1px solid #333;
                border-radius: 10px;
                padding: 20px;
                height: 300px;
                position: relative;
                overflow: hidden;
                animation: skeleton-pulse 1.5s ease-in-out infinite alternate;
            }
            
            .skeleton-chart::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(
                    90deg,
                    transparent,
                    rgba(0, 212, 255, 0.1),
                    transparent
                );
                animation: shimmer-animation 2.5s infinite;
            }
            
            .skeleton-chart .skeleton-chart-title {
                width: 50%;
                height: 18px;
                background: rgba(255, 107, 53, 0.2);
                border-radius: 4px;
                margin-bottom: 20px;
            }
            
            .skeleton-chart .skeleton-chart-area {
                width: 100%;
                height: 200px;
                background: linear-gradient(
                    135deg,
                    rgba(255, 107, 53, 0.05) 0%,
                    rgba(0, 212, 255, 0.05) 100%
                );
                border-radius: 8px;
                position: relative;
            }
            
            .skeleton-chart .skeleton-chart-line {
                position: absolute;
                bottom: 20%;
                left: 10%;
                right: 10%;
                height: 3px;
                background: linear-gradient(90deg, var(--racing-orange), var(--electric-blue));
                border-radius: 2px;
                opacity: 0.3;
            }
        `;
    }

    // Create table row skeleton
    createTableRowSkeleton() {
        return `
            .skeleton-table-row {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 15px;
                border-bottom: 1px solid #333;
                animation: skeleton-pulse 1.5s ease-in-out infinite alternate;
            }
            
            .skeleton-table-row .skeleton-cell {
                height: 16px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
            }
            
            .skeleton-table-row .skeleton-cell:nth-child(1) { width: 30%; }
            .skeleton-table-row .skeleton-cell:nth-child(2) { width: 20%; }
            .skeleton-table-row .skeleton-cell:nth-child(3) { width: 15%; }
            .skeleton-table-row .skeleton-cell:nth-child(4) { width: 25%; }
            .skeleton-table-row .skeleton-cell:nth-child(5) { width: 10%; }
        `;
    }

    // Create campaign card skeleton
    createCampaignCardSkeleton() {
        return `
            .skeleton-campaign-card {
                background: var(--carbon-fiber);
                border: 1px solid #333;
                border-radius: 10px;
                padding: 20px;
                height: 200px;
                position: relative;
                overflow: hidden;
                animation: skeleton-pulse 1.5s ease-in-out infinite alternate;
            }
            
            .skeleton-campaign-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(
                    90deg,
                    transparent,
                    rgba(255, 107, 53, 0.1),
                    transparent
                );
                animation: shimmer-animation 2s infinite;
            }
            
            .skeleton-campaign-card .skeleton-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }
            
            .skeleton-campaign-card .skeleton-title {
                width: 60%;
                height: 18px;
                background: rgba(255, 107, 53, 0.2);
                border-radius: 4px;
            }
            
            .skeleton-campaign-card .skeleton-status {
                width: 20%;
                height: 14px;
                background: rgba(57, 255, 20, 0.2);
                border-radius: 4px;
            }
            
            .skeleton-campaign-card .skeleton-metrics {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .skeleton-campaign-card .skeleton-metric {
                width: 80%;
                height: 14px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
            }
        `;
    }

    // Show initial skeleton screens
    showInitialSkeletons() {
        // Show skeleton for metrics grid
        this.showSkeletonForElement('.metrics-grid', 'skeleton-metric-card', 4);
        
        // Show skeleton for charts
        this.showSkeletonForElement('.performance-charts', 'skeleton-chart', 2);
        
        // Show skeleton for campaign cards
        this.showSkeletonForElement('.campaign-grid', 'skeleton-campaign-card', 3);
        
        console.log('👻 Displayed initial K2Motor Performance Parts skeletons');
    }

    // Show skeleton for specific element
    showSkeletonForElement(selector, skeletonClass, count = 1) {
        const container = document.querySelector(selector);
        if (!container) return;
        
        // Clear existing content
        container.innerHTML = '';
        
        // Add skeleton elements
        for (let i = 0; i < count; i++) {
            const skeleton = document.createElement('div');
            skeleton.className = `${skeletonClass} loading-skeleton`;
            skeleton.setAttribute('aria-label', 'Loading content...');
            skeleton.setAttribute('role', 'status');
            
            // Add internal skeleton structure based on type
            if (skeletonClass === 'skeleton-metric-card') {
                skeleton.innerHTML = `
                    <div class="skeleton-label"></div>
                    <div class="skeleton-value"></div>
                    <div class="skeleton-change"></div>
                `;
            } else if (skeletonClass === 'skeleton-chart') {
                skeleton.innerHTML = `
                    <div class="skeleton-chart-title"></div>
                    <div class="skeleton-chart-area">
                        <div class="skeleton-chart-line"></div>
                    </div>
                `;
            } else if (skeletonClass === 'skeleton-campaign-card') {
                skeleton.innerHTML = `
                    <div class="skeleton-header">
                        <div class="skeleton-title"></div>
                        <div class="skeleton-status"></div>
                    </div>
                    <div class="skeleton-metrics">
                        <div class="skeleton-metric"></div>
                        <div class="skeleton-metric"></div>
                        <div class="skeleton-metric"></div>
                    </div>
                `;
            }
            
            container.appendChild(skeleton);
        }
        
        // Track active loading state
        this.activeLoadingStates.set(selector, {
            type: skeletonClass,
            count: count,
            startTime: performance.now()
        });
    }

    // Show loading state for specific element
    showLoadingState(elementId, options = {}) {
        const element = document.getElementById(elementId) || document.querySelector(elementId);
        if (!element) return;
        
        const config = {
            type: options.type || 'turbo-spinner',
            message: options.message || 'Loading K2Motor data...',
            timeout: options.timeout || this.loadingConfig.criticalTimeout,
            overlay: options.overlay !== false
        };
        
        // Create loading overlay
        const loadingOverlay = this.createLoadingOverlay(config);
        
        // Position overlay
        if (config.overlay) {
            element.style.position = 'relative';
            element.appendChild(loadingOverlay);
        }
        
        // Track loading state
        this.activeLoadingStates.set(elementId, {
            overlay: loadingOverlay,
            startTime: performance.now(),
            config: config
        });
        
        // Set timeout for loading state
        setTimeout(() => {
            if (this.activeLoadingStates.has(elementId)) {
                this.showErrorState(elementId, 'Loading timeout');
            }
        }, config.timeout);
        
        console.log(`⏳ Showing loading state for ${elementId}`);
    }

    // Create loading overlay
    createLoadingOverlay(config) {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        
        // Create spinner based on type
        let spinnerHTML = '';
        switch (config.type) {
            case 'turbo-spinner':
                spinnerHTML = this.createTurboSpinner();
                break;
            case 'racing-loader':
                spinnerHTML = this.createRacingLoader();
                break;
            case 'pulse-loading':
                spinnerHTML = this.createPulseLoader();
                break;
            default:
                spinnerHTML = this.createTurboSpinner();
        }
        
        overlay.innerHTML = `
            <div class="loading-content">
                ${spinnerHTML}
                <div class="loading-message">${config.message}</div>
            </div>
        `;
        
        // Apply overlay styles
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(15, 15, 35, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            border-radius: inherit;
        `;
        
        return overlay;
    }

    // Create turbo spinner animation
    createTurboSpinner() {
        return `
            <div class="turbo-spinner">
                <div class="turbo-ring">
                    <div class="turbo-blade"></div>
                    <div class="turbo-blade"></div>
                    <div class="turbo-blade"></div>
                    <div class="turbo-blade"></div>
                </div>
                <div class="turbo-center"></div>
            </div>
        `;
    }

    // Create racing loader animation
    createRacingLoader() {
        return `
            <div class="racing-loader">
                <div class="racing-track">
                    <div class="racing-car">🏎️</div>
                </div>
                <div class="racing-stripes">
                    <div class="racing-stripe"></div>
                    <div class="racing-stripe"></div>
                    <div class="racing-stripe"></div>
                </div>
            </div>
        `;
    }

    // Create pulse loader animation
    createPulseLoader() {
        return `
            <div class="pulse-loading">
                <div class="pulse-ring pulse-ring-1"></div>
                <div class="pulse-ring pulse-ring-2"></div>
                <div class="pulse-ring pulse-ring-3"></div>
                <div class="pulse-center">K2</div>
            </div>
        `;
    }

    // Hide loading state
    hideLoadingState(elementId) {
        const loadingState = this.activeLoadingStates.get(elementId);
        if (!loadingState) return;
        
        const element = document.getElementById(elementId) || document.querySelector(elementId);
        if (element && loadingState.overlay) {
            // Fade out animation
            loadingState.overlay.style.transition = 'opacity 0.3s ease';
            loadingState.overlay.style.opacity = '0';
            
            setTimeout(() => {
                if (loadingState.overlay.parentNode) {
                    loadingState.overlay.parentNode.removeChild(loadingState.overlay);
                }
            }, 300);
        }
        
        // Calculate loading time
        const loadTime = performance.now() - loadingState.startTime;
        console.log(`✅ Hidden loading state for ${elementId} (${loadTime.toFixed(2)}ms)`);
        
        // Remove from active states
        this.activeLoadingStates.delete(elementId);
    }

    // Set up progressive loading system
    setupProgressiveLoading() {
        // Load critical content first
        setTimeout(() => {
            this.loadCriticalContent();
        }, 100);
        
        // Load secondary content after delay
        setTimeout(() => {
            this.lazyLoadSecondary();
        }, 500);
        
        console.log('🚀 Set up K2Motor Performance Parts progressive loading');
    }

    // Load critical content first
    loadCriticalContent() {
        console.log('🎯 Loading critical K2Motor content...');
        
        // Mark critical resources as loading
        performance.mark('k2motor-critical-start');
        
        // Simulate critical data loading
        const criticalElements = [
            '.metrics-grid',
            '.tab-navigation',
            '.dashboard-header'
        ];
        
        criticalElements.forEach((selector, index) => {
            setTimeout(() => {
                this.progressiveDataLoad(selector, 'critical');
            }, index * this.loadingConfig.progressiveDelay);
        });
        
        // Mark critical resources loaded after delay
        setTimeout(() => {
            performance.mark('k2motor-critical-end');
            this.performanceMetrics.criticalResourcesLoaded++;
            console.log('✅ K2Motor critical content loaded');
        }, 1000);
    }

    // Lazy load secondary content
    lazyLoadSecondary() {
        console.log('🔄 Lazy loading K2Motor secondary content...');
        
        const secondaryElements = [
            '.performance-charts',
            '.campaign-grid',
            '.scenario-alerts'
        ];
        
        secondaryElements.forEach((selector, index) => {
            setTimeout(() => {
                this.progressiveDataLoad(selector, 'secondary');
            }, index * this.loadingConfig.progressiveDelay);
        });
    }

    // Progressive data loading for elements
    progressiveDataLoad(selector, priority = 'secondary') {
        const container = document.querySelector(selector);
        if (!container) return;
        
        // Remove skeletons if present
        const skeletons = container.querySelectorAll('.loading-skeleton');
        skeletons.forEach(skeleton => {
            skeleton.style.opacity = '0';
            skeleton.style.transform = 'scale(0.9)';
            setTimeout(() => {
                if (skeleton.parentNode) {
                    skeleton.parentNode.removeChild(skeleton);
                }
            }, 300);
        });
        
        // Load actual content with staggered animation
        setTimeout(() => {
            this.loadActualContent(selector, priority);
        }, 300);
    }

    // Load actual content for element
    loadActualContent(selector, priority) {
        const container = document.querySelector(selector);
        if (!container) return;
        
        // Simulate content loading based on selector
        if (selector === '.metrics-grid') {
            this.loadMetricsContent(container);
        } else if (selector === '.performance-charts') {
            this.loadChartsContent(container);
        } else if (selector === '.campaign-grid') {
            this.loadCampaignContent(container);
        } else {
            this.loadGenericContent(container, priority);
        }
        
        // Update performance metrics
        if (priority === 'critical') {
            this.performanceMetrics.criticalResourcesLoaded++;
        } else {
            this.performanceMetrics.secondaryResourcesLoaded++;
        }
    }

    // Load metrics content
    loadMetricsContent(container) {
        const metricsHTML = `
            <div class="metric-card" style="opacity: 0; transform: translateY(20px);">
                <div class="metric-label">Total Ad Spend</div>
                <div class="metric-value">$24,750</div>
                <div class="metric-change positive">+12.5%</div>
            </div>
            <div class="metric-card" style="opacity: 0; transform: translateY(20px);">
                <div class="metric-label">ROAS</div>
                <div class="metric-value">4.24x</div>
                <div class="metric-change positive">+8.3%</div>
            </div>
            <div class="metric-card" style="opacity: 0; transform: translateY(20px);">
                <div class="metric-label">POAS</div>
                <div class="metric-value">2.1x</div>
                <div class="metric-change positive">+15.2%</div>
            </div>
        `;
        
        container.innerHTML = metricsHTML;
        
        // Animate in the cards
        const cards = container.querySelectorAll('.metric-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Load charts content
    loadChartsContent(container) {
        const chartsHTML = `
            <div class="chart-container" style="opacity: 0; transform: scale(0.9);">
                <h4>ROAS Trend</h4>
                <div class="mock-chart">
                    <div class="chart-line"></div>
                    <p>Last 30 days performance</p>
                </div>
            </div>
        `;
        
        container.innerHTML = chartsHTML;
        
        // Animate in the chart
        const chart = container.querySelector('.chart-container');
        setTimeout(() => {
            chart.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            chart.style.opacity = '1';
            chart.style.transform = 'scale(1)';
        }, 200);
    }

    // Load campaign content
    loadCampaignContent(container) {
        const campaignsHTML = `
            <div class="campaign-card" style="opacity: 0; transform: translateX(-30px);">
                <h4>Honda Type R Campaign</h4>
                <div class="campaign-metrics">
                    <div class="metric">
                        <span class="label">Spend:</span>
                        <span class="value">$2,450</span>
                    </div>
                    <div class="metric">
                        <span class="label">ROAS:</span>
                        <span class="value">4.24x</span>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = campaignsHTML;
        
        // Animate in the campaign card
        const card = container.querySelector('.campaign-card');
        setTimeout(() => {
            card.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            card.style.opacity = '1';
            card.style.transform = 'translateX(0)';
        }, 150);
    }

    // Load generic content
    loadGenericContent(container, priority) {
        const content = document.createElement('div');
        content.textContent = `K2Motor ${priority} content loaded`;
        content.style.opacity = '0';
        content.style.transform = 'translateY(10px)';
        
        container.appendChild(content);
        
        setTimeout(() => {
            content.style.transition = 'all 0.4s ease';
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
        }, 100);
    }

    // Set up lazy loading observer
    setupLazyLoadingObserver() {
        if (!window.IntersectionObserver) {
            console.warn('⚠️ IntersectionObserver not supported');
            return;
        }
        
        this.lazyLoadObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadLazyElement(entry.target);
                        this.lazyLoadObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '50px'
            }
        );
        
        // Observe lazy load elements
        document.querySelectorAll('[data-lazy-load]').forEach(element => {
            this.lazyLoadObserver.observe(element);
        });
        
        console.log('👁️ Set up K2Motor Performance Parts lazy loading observer');
    }

    // Load lazy element when it comes into view
    loadLazyElement(element) {
        const lazyType = element.dataset.lazyLoad;
        
        // Show loading state
        this.showLoadingState(element.id || element.className, {
            type: 'pulse-loading',
            message: `Loading ${lazyType}...`
        });
        
        // Simulate loading delay
        setTimeout(() => {
            this.hideLoadingState(element.id || element.className);
            element.innerHTML = `<p>K2Motor ${lazyType} content loaded on demand</p>`;
            element.classList.add('lazy-loaded');
        }, 1000);
    }

    // Set up error state handling
    setupErrorStateHandling() {
        // Global error handler for failed requests
        window.addEventListener('error', (event) => {
            console.error('🚨 Loading error:', event.error);
            this.handleLoadingError(event);
        });
        
        // Promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            console.error('🚨 Promise rejection:', event.reason);
            this.handleLoadingError(event);
        });
        
        console.log('🛡️ Set up K2Motor Performance Parts error state handling');
    }

    // Handle loading errors
    handleLoadingError(event) {
        // Find elements that might be affected
        this.activeLoadingStates.forEach((state, elementId) => {
            if (state.config && Date.now() - state.startTime > state.config.timeout) {
                this.showErrorState(elementId, 'Loading failed');
            }
        });
    }

    // Show error state
    showErrorState(elementId, errorMessage = 'Loading failed') {
        const element = document.getElementById(elementId) || document.querySelector(elementId);
        if (!element) return;
        
        // Remove existing loading state
        this.hideLoadingState(elementId);
        
        // Create error state
        const errorElement = document.createElement('div');
        errorElement.className = 'error-state';
        errorElement.innerHTML = `
            <div class="error-content">
                <div class="error-icon">⚠️</div>
                <div class="error-message">${errorMessage}</div>
                <button class="error-retry" onclick="loadingManager.retryLoadingSequence('${elementId}')">
                    Retry Loading
                </button>
            </div>
        `;
        
        // Style error element
        errorElement.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100px;
            background: rgba(255, 7, 58, 0.1);
            border: 1px solid var(--danger-red);
            border-radius: 8px;
            color: var(--danger-red);
            text-align: center;
            padding: 20px;
        `;
        
        element.innerHTML = '';
        element.appendChild(errorElement);
        
        console.log(`❌ Showing error state for ${elementId}: ${errorMessage}`);
    }

    // Retry loading sequence
    retryLoadingSequence(elementId) {
        console.log(`🔄 Retrying loading for ${elementId}`);
        
        // Clear error state
        const element = document.getElementById(elementId) || document.querySelector(elementId);
        if (element) {
            element.innerHTML = '';
        }
        
        // Show loading state again
        this.showLoadingState(elementId, {
            message: 'Retrying K2Motor data load...'
        });
        
        // Attempt to load content again
        setTimeout(() => {
            this.progressiveDataLoad(elementId.replace('#', '').replace('.', ''), 'retry');
        }, 1000);
    }

    // Resume progressive loading (e.g., when tab becomes visible again)
    resumeProgressiveLoading() {
        console.log('🔄 Resuming K2Motor Performance Parts progressive loading');
        
        // Check for unloaded lazy elements
        document.querySelectorAll('[data-lazy-load]:not(.lazy-loaded)').forEach(element => {
            if (this.lazyLoadObserver) {
                this.lazyLoadObserver.observe(element);
            }
        });
    }

    // Start initial loading sequence
    startInitialLoadingSequence() {
        // Add loading class to body
        document.body.classList.add('loading-sequence');
        
        // Remove loading class after all critical content is loaded
        setTimeout(() => {
            document.body.classList.remove('loading-sequence');
            document.body.classList.add('loading-complete');
            
            console.log('🏁 K2Motor Performance Parts initial loading sequence complete');
        }, 2000);
    }

    // Get loading manager statistics
    getLoadingStats() {
        return {
            initialized: this.isInitialized,
            activeLoadingStates: this.activeLoadingStates.size,
            performanceMetrics: this.performanceMetrics,
            lazyLoadObserverActive: !!this.lazyLoadObserver,
            loadingQueueLength: this.loadingQueue.length
        };
    }

    // Show fallback content when loading fails completely
    showFallbackContent(container, message = 'Unable to load K2Motor data') {
        if (!container) return;
        
        const fallbackHTML = `
            <div class="fallback-content">
                <div class="fallback-icon">🏎️</div>
                <h3>K2Motor Performance Parts</h3>
                <p>${message}</p>
                <p>Please check your connection and try again.</p>
                <button onclick="location.reload()" class="btn-reload">
                    Reload Dashboard
                </button>
            </div>
        `;
        
        container.innerHTML = fallbackHTML;
        console.log(`🛟 Showing K2Motor fallback content: ${message}`);
    }

    // Alias for fallbackContent (test compatibility)
    fallbackContent(container, message) {
        return this.showFallbackContent(container, message);
    }
}

// Initialize loading manager
const loadingManager = new LoadingManager();

// Auto-start when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadingManager.initializeLoadingStates();
    console.log('🎯 K2Motor Performance Parts loading manager ready');
});

// Add loading animation styles
const loadingStyles = `
<style>
/* K2Motor Racing Loading Animations */

@keyframes skeleton-pulse {
    0% { opacity: 0.6; }
    100% { opacity: 1; }
}

@keyframes shimmer-animation {
    0% { left: -100%; }
    100% { left: 100%; }
}

/* Turbo Spinner Animation */
.turbo-spinner {
    width: 60px;
    height: 60px;
    position: relative;
    margin: 20px auto;
}

.turbo-ring {
    width: 100%;
    height: 100%;
    border: 3px solid rgba(255, 107, 53, 0.2);
    border-radius: 50%;
    position: relative;
    animation: spin 1s linear infinite;
}

.turbo-blade {
    position: absolute;
    width: 8px;
    height: 3px;
    background: var(--racing-orange);
    border-radius: 2px;
    transform-origin: center;
}

.turbo-blade:nth-child(1) { top: 5px; left: 50%; transform: translateX(-50%) rotate(0deg); }
.turbo-blade:nth-child(2) { top: 50%; right: 5px; transform: translateY(-50%) rotate(90deg); }
.turbo-blade:nth-child(3) { bottom: 5px; left: 50%; transform: translateX(-50%) rotate(180deg); }
.turbo-blade:nth-child(4) { top: 50%; left: 5px; transform: translateY(-50%) rotate(270deg); }

.turbo-center {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 12px;
    height: 12px;
    background: var(--electric-blue);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px var(--electric-blue);
}

/* Racing Loader Animation */
.racing-loader {
    width: 120px;
    height: 40px;
    position: relative;
    margin: 20px auto;
}

.racing-track {
    width: 100%;
    height: 4px;
    background: #333;
    border-radius: 2px;
    position: relative;
    overflow: hidden;
}

.racing-car {
    position: absolute;
    top: -15px;
    left: -30px;
    font-size: 20px;
    animation: race-car 2s linear infinite;
}

.racing-stripes {
    position: absolute;
    top: 10px;
    width: 100%;
    height: 20px;
    display: flex;
    gap: 10px;
    justify-content: center;
}

.racing-stripe {
    width: 20px;
    height: 3px;
    background: var(--racing-orange);
    border-radius: 2px;
    opacity: 0;
    animation: racing-stripe-flash 0.5s infinite;
}

.racing-stripe:nth-child(2) { animation-delay: 0.1s; }
.racing-stripe:nth-child(3) { animation-delay: 0.2s; }

/* Pulse Loading Animation */
.pulse-loading {
    width: 80px;
    height: 80px;
    position: relative;
    margin: 20px auto;
}

.pulse-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 2px solid var(--electric-blue);
    border-radius: 50%;
    opacity: 0;
    animation: pulse-ring 2s linear infinite;
}

.pulse-ring-2 { animation-delay: 0.7s; }
.pulse-ring-3 { animation-delay: 1.4s; }

.pulse-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-weight: bold;
    color: var(--racing-orange);
    font-size: 1.2rem;
    text-shadow: 0 0 10px var(--racing-orange);
}

/* Loading Content Styles */
.loading-content {
    text-align: center;
    color: white;
}

.loading-message {
    margin-top: 15px;
    font-size: 0.9rem;
    color: #ccc;
}

/* Error State Styles */
.error-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.error-icon {
    font-size: 2rem;
}

.error-retry {
    background: var(--racing-orange);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    margin-top: 10px;
}

.error-retry:hover {
    background: #ff8555;
}

/* Fallback Content Styles */
.fallback-content {
    text-align: center;
    padding: 40px 20px;
    color: #ccc;
}

.fallback-icon {
    font-size: 3rem;
    margin-bottom: 20px;
}

.fallback-content h3 {
    color: var(--racing-orange);
    margin-bottom: 15px;
}

.btn-reload {
    background: var(--electric-blue);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    margin-top: 20px;
}

.btn-reload:hover {
    background: #00b8e6;
}

/* Loading Sequence Body States */
.loading-sequence {
    cursor: wait;
}

.loading-sequence * {
    pointer-events: none;
}

.loading-complete .loading-skeleton {
    display: none;
}

/* Animation Keyframes */
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes race-car {
    0% { left: -30px; }
    100% { left: 120px; }
}

@keyframes racing-stripe-flash {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
}

@keyframes pulse-ring {
    0% {
        opacity: 0;
        transform: scale(0.5);
    }
    50% {
        opacity: 1;
    }
    100% {
        opacity: 0;
        transform: scale(1.2);
    }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
    .turbo-ring,
    .racing-car,
    .pulse-ring {
        animation: none !important;
    }
    
    .loading-skeleton {
        animation: none !important;
    }
    
    .racing-stripe {
        animation: none !important;
        opacity: 0.5 !important;
    }
}

/* High contrast mode */
@media (prefers-contrast: high) {
    .turbo-center,
    .turbo-blade,
    .racing-stripe {
        background: currentColor !important;
        box-shadow: none !important;
    }
    
    .pulse-ring {
        border-color: currentColor !important;
    }
}

/* Mobile optimizations */
@media (max-width: 768px) {
    .turbo-spinner {
        width: 40px;
        height: 40px;
    }
    
    .racing-loader {
        width: 80px;
        height: 30px;
    }
    
    .pulse-loading {
        width: 60px;
        height: 60px;
    }
}
</style>
`;

// Inject loading styles
document.head.insertAdjacentHTML('beforeend', loadingStyles);

// Make globally available
window.loadingManager = loadingManager;