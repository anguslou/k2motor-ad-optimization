// K2Motor Performance Parts - Performance Optimizer
// Advanced performance optimizations for automotive-performance-dashboard

class PerformanceOptimizer {
    constructor() {
        this.isInitialized = false;
        this.observers = new Map();
        this.cache = new WeakMap();
        this.lazyLoadQueue = [];
        this.renderingOptimizations = new Map();
        this.performanceMetrics = new Map();
        this.codeChunks = new Map();
        
        // Performance thresholds for K2Motor dashboard
        this.thresholds = {
            fcp: 1500,      // First Contentful Paint
            lcp: 2500,      // Largest Contentful Paint
            cls: 0.1,       // Cumulative Layout Shift
            fid: 100,       // First Input Delay
            ttfb: 600       // Time to First Byte
        };
        
        // Memory management
        this.eventListeners = new WeakMap();
        this.timeouts = new Set();
        this.intervals = new Set();
        this.requestAnimationFrames = new Set();
        
        // Racing theme assets optimization
        this.racingThemeAssets = {
            critical: [],
            nonCritical: [],
            preloaded: new Set()
        };
        
        // Cache manager for K2Motor data
        this.cacheManager = new CacheManager();
    }

    // Initialize comprehensive performance tracking
    initializePerformanceTracking() {
        console.log('🚀 Initializing K2Motor Performance Parts automotive-performance-dashboard optimizations...');
        
        // Set up Core Web Vitals monitoring
        this.setupCoreWebVitalsTracking();
        
        // Initialize rendering pipeline optimization
        this.optimizeRenderingPipeline();
        
        // Enable code splitting for dashboard modules
        this.enableCodeSplitting();
        
        // Set up lazy loading system
        this.setupLazyLoading();
        
        // Initialize performance monitoring
        this.setupPerformanceMonitoring();
        
        // Optimize racing theme assets
        this.optimizeRacingThemeAssets();
        
        // Set up memory management
        this.setupMemoryManagement();
        
        // Initialize caching strategies
        this.initializeCaching();
        
        this.isInitialized = true;
        console.log('✅ K2Motor Performance Parts performance optimizer ready');
    }

    // Set up Core Web Vitals tracking for automotive dashboard
    setupCoreWebVitalsTracking() {
        // Measure First Contentful Paint (FCP)
        this.measureFCP();
        
        // Measure Largest Contentful Paint (LCP)
        this.measureLCP();
        
        // Measure Cumulative Layout Shift (CLS)
        this.measureCLS();
        
        // Measure First Input Delay (FID)
        this.measureFID();
        
        // Set up PerformanceObserver for comprehensive metrics
        this.setupPerformanceObserver();
        
        console.log('📊 Set up K2Motor Performance Parts Core Web Vitals tracking');
    }

    // Measure First Contentful Paint for K2Motor dashboard
    measureFCP() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.name === 'first-contentful-paint') {
                        const fcp = entry.startTime;
                        this.recordMetric('FCP', fcp);
                        
                        if (fcp > this.thresholds.fcp) {
                            console.warn(`K2Motor FCP slow: ${fcp}ms (threshold: ${this.thresholds.fcp}ms)`);
                            this.optimizeContentPainting();
                        }
                        
                        // Send to analytics if available
                        this.sendMetricToAnalytics('fcp', fcp);
                    }
                });
            });
            
            observer.observe({ entryTypes: ['paint'] });
            this.observers.set('fcp', observer);
        }
    }

    // Measure Largest Contentful Paint for automotive performance dashboard
    measureLCP() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                
                if (lastEntry) {
                    const lcp = lastEntry.startTime;
                    this.recordMetric('LCP', lcp);
                    
                    if (lcp > this.thresholds.lcp) {
                        console.warn(`K2Motor LCP slow: ${lcp}ms (threshold: ${this.thresholds.lcp}ms)`);
                        this.optimizeLargestContentfulPaint();
                    }
                    
                    this.sendMetricToAnalytics('lcp', lcp);
                }
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
            this.observers.set('lcp', observer);
        }
    }

    // Measure Cumulative Layout Shift for K2Motor dashboard stability
    measureCLS() {
        if ('PerformanceObserver' in window) {
            let clsValue = 0;
            
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                
                this.recordMetric('CLS', clsValue);
                
                if (clsValue > this.thresholds.cls) {
                    console.warn(`K2Motor CLS high: ${clsValue} (threshold: ${this.thresholds.cls})`);
                    this.optimizeLayoutStability();
                }
                
                this.sendMetricToAnalytics('cls', clsValue);
            });
            
            observer.observe({ entryTypes: ['layout-shift'] });
            this.observers.set('cls', observer);
        }
    }

    // Measure First Input Delay for K2Motor dashboard interactivity
    measureFID() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    const fid = entry.processingStart - entry.startTime;
                    this.recordMetric('FID', fid);
                    
                    if (fid > this.thresholds.fid) {
                        console.warn(`K2Motor FID slow: ${fid}ms (threshold: ${this.thresholds.fid}ms)`);
                        this.optimizeInputResponsiveness();
                    }
                    
                    this.sendMetricToAnalytics('fid', fid);
                });
            });
            
            observer.observe({ entryTypes: ['first-input'] });
            this.observers.set('fid', observer);
        }
    }

    // Set up comprehensive PerformanceObserver
    setupPerformanceObserver() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    // Track navigation timing
                    if (entry.entryType === 'navigation') {
                        this.analyzeNavigationTiming(entry);
                    }
                    
                    // Track resource loading
                    if (entry.entryType === 'resource') {
                        this.analyzeResourceTiming(entry);
                    }
                    
                    // Track long tasks
                    if (entry.entryType === 'longtask') {
                        this.analyzeLongTask(entry);
                    }
                });
            });
            
            observer.observe({ entryTypes: ['navigation', 'resource', 'longtask'] });
            this.observers.set('general', observer);
        }
    }

    // Optimize rendering pipeline for K2Motor dashboard
    optimizeRenderingPipeline() {
        // Implement virtual scrolling for large data sets
        this.implementVirtualScrolling();
        
        // Optimize DOM manipulation
        this.optimizeDOMManipulation();
        
        // Set up efficient re-rendering
        this.setupEfficientRerendering();
        
        // Optimize CSS and animations
        this.optimizeCSSAnimations();
        
        // Implement frame budgeting
        this.implementFrameBudgeting();
        
        console.log('🎨 Optimized K2Motor Performance Parts rendering pipeline');
    }

    // Implement virtual scrolling for automotive performance data
    implementVirtualScrolling() {
        const scrollContainers = document.querySelectorAll('.data-table, .campaign-list, .metrics-list');
        
        scrollContainers.forEach(container => {
            if (container.children.length > 100) {
                this.setupVirtualScrolling(container);
            }
        });
    }

    // Set up virtual scrolling for container
    setupVirtualScrolling(container) {
        const items = Array.from(container.children);
        const itemHeight = 50; // Estimated item height
        const visibleItems = Math.ceil(container.clientHeight / itemHeight) + 5;
        
        let startIndex = 0;
        let endIndex = Math.min(visibleItems, items.length);
        
        const renderVisibleItems = this.throttle(() => {
            const scrollTop = container.scrollTop;
            startIndex = Math.floor(scrollTop / itemHeight);
            endIndex = Math.min(startIndex + visibleItems, items.length);
            
            // Hide all items
            items.forEach(item => item.style.display = 'none');
            
            // Show only visible items
            for (let i = startIndex; i < endIndex; i++) {
                if (items[i]) {
                    items[i].style.display = 'block';
                    items[i].style.transform = `translateY(${i * itemHeight}px)`;
                }
            }
        }, 16); // 60fps throttling
        
        container.addEventListener('scroll', renderVisibleItems);
        renderVisibleItems(); // Initial render
    }

    // Optimize DOM manipulation for automotive dashboard
    optimizeDOMManipulation() {
        // Use DocumentFragment for batch DOM operations
        this.batchDOMOperations = (operations) => {
            const fragment = document.createDocumentFragment();
            operations.forEach(op => op(fragment));
            return fragment;
        };
        
        // Debounce DOM updates
        this.debouncedDOMUpdate = this.debounce((updateFn) => {
            requestAnimationFrame(updateFn);
        }, 16);
        
        // Cache DOM queries
        this.cachedQueries = new Map();
        this.querySelector = (selector) => {
            if (!this.cachedQueries.has(selector)) {
                this.cachedQueries.set(selector, document.querySelector(selector));
            }
            return this.cachedQueries.get(selector);
        };
    }

    // Set up efficient re-rendering for K2Motor components
    setupEfficientRerendering() {
        // Implement component-level change detection
        this.changeDetection = new Map();
        
        // Use RAF for smooth updates
        this.scheduleUpdate = (component, updateFn) => {
            if (!this.changeDetection.has(component)) {
                this.changeDetection.set(component, true);
                
                requestAnimationFrame(() => {
                    if (this.changeDetection.get(component)) {
                        updateFn();
                        this.changeDetection.delete(component);
                    }
                });
            }
        };
    }

    // Optimize CSS animations for racing theme
    optimizeCSSAnimations() {
        // Use transform and opacity for better performance
        const animatedElements = document.querySelectorAll('.animated, .racing-animation');
        
        animatedElements.forEach(element => {
            element.style.willChange = 'transform, opacity';
            element.style.transform = 'translateZ(0)'; // Force GPU acceleration
        });
        
        // Clean up will-change after animations
        document.addEventListener('animationend', (e) => {
            e.target.style.willChange = 'auto';
        });
    }

    // Implement frame budgeting for smooth performance
    implementFrameBudgeting() {
        const FRAME_BUDGET = 16.67; // 60fps = 16.67ms per frame
        
        this.frameScheduler = {
            tasks: [],
            isRunning: false,
            
            addTask: (task, priority = 'normal') => {
                this.frameScheduler.tasks.push({ task, priority, timestamp: performance.now() });
                if (!this.frameScheduler.isRunning) {
                    this.frameScheduler.processFrame();
                }
            },
            
            processFrame: () => {
                this.frameScheduler.isRunning = true;
                const frameStart = performance.now();
                
                while (this.frameScheduler.tasks.length > 0 && 
                       (performance.now() - frameStart) < FRAME_BUDGET) {
                    const { task } = this.frameScheduler.tasks.shift();
                    task();
                }
                
                if (this.frameScheduler.tasks.length > 0) {
                    requestAnimationFrame(() => this.frameScheduler.processFrame());
                } else {
                    this.frameScheduler.isRunning = false;
                }
            }
        };
    }

    // Enable code splitting for K2Motor dashboard modules
    enableCodeSplitting() {
        // Define code chunks for different dashboard sections
        this.defineCodeChunks();
        
        // Set up dynamic import system
        this.setupDynamicImports();
        
        // Implement module prefetching
        this.setupModulePrefetching();
        
        console.log('📦 Enabled K2Motor Performance Parts code splitting');
    }

    // Define code chunks for automotive performance dashboard
    defineCodeChunks() {
        this.codeChunks.set('metrics', {
            path: './modules/metrics-module.js',
            priority: 'high',
            preload: true
        });
        
        this.codeChunks.set('campaigns', {
            path: './modules/campaigns-module.js',
            priority: 'high',
            preload: true
        });
        
        this.codeChunks.set('attribution', {
            path: './modules/attribution-module.js',
            priority: 'medium',
            preload: false
        });
        
        this.codeChunks.set('scenarios', {
            path: './modules/scenarios-module.js',
            priority: 'low',
            preload: false
        });
        
        this.codeChunks.set('racing-theme-assets', {
            path: './themes/racing-theme.js',
            priority: 'medium',
            preload: false
        });
    }

    // Set up dynamic import system
    setupDynamicImports() {
        this.loadModule = async (moduleName) => {
            const moduleConfig = this.codeChunks.get(moduleName);
            if (!moduleConfig) {
                throw new Error(`K2Motor module not found: ${moduleName}`);
            }
            
            try {
                console.log(`🚀 Loading K2Motor module: ${moduleName}`);
                const startTime = performance.now();
                
                // Use dynamic import for code splitting
                const module = await import(moduleConfig.path);
                
                const loadTime = performance.now() - startTime;
                this.recordMetric(`module-load-${moduleName}`, loadTime);
                
                console.log(`✅ K2Motor module loaded: ${moduleName} (${loadTime.toFixed(2)}ms)`);
                return module;
                
            } catch (error) {
                console.error(`❌ Failed to load K2Motor module: ${moduleName}`, error);
                throw error;
            }
        };
        
        // Load modules on demand
        this.loadModuleOnDemand = (moduleName, trigger) => {
            if (trigger) {
                trigger.addEventListener('click', () => {
                    this.loadModule(moduleName);
                }, { once: true });
            }
        };
    }

    // Set up module prefetching for better UX
    setupModulePrefetching() {
        // Prefetch high-priority modules
        this.codeChunks.forEach((config, moduleName) => {
            if (config.preload) {
                this.prefetchModule(moduleName);
            }
        });
        
        // Prefetch on hover for interactive elements
        document.addEventListener('mouseenter', (e) => {
            const moduleHint = e.target.dataset.module;
            if (moduleHint && this.codeChunks.has(moduleHint)) {
                this.prefetchModule(moduleHint);
            }
        }, true);
    }

    // Prefetch module for faster loading
    prefetchModule(moduleName) {
        const moduleConfig = this.codeChunks.get(moduleName);
        if (moduleConfig) {
            const link = document.createElement('link');
            link.rel = 'modulepreload';
            link.href = moduleConfig.path;
            document.head.appendChild(link);
        }
    }

    // Set up lazy loading system for K2Motor components
    setupLazyLoading() {
        // Lazy load components using IntersectionObserver
        this.lazyLoadComponents();
        
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Set up progressive image loading
        this.setupProgressiveImageLoading();
        
        console.log('⚡ Set up K2Motor Performance Parts lazy loading');
    }

    // Lazy load components using IntersectionObserver for automotive dashboard
    lazyLoadComponents() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadComponent(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px',
            threshold: 0.1
        });
        
        // Observe lazy-loadable components
        document.querySelectorAll('[data-lazy-load]').forEach(element => {
            observer.observe(element);
        });
        
        this.observers.set('lazy-load', observer);
    }

    // Load component with performance tracking
    loadComponent(element) {
        const componentName = element.dataset.lazyLoad;
        const startTime = performance.now();
        
        // Simulate component loading (replace with actual loading logic)
        return new Promise((resolve) => {
            // Use dynamic import or fetch component data
            const loadPromise = this.loadModule(componentName).catch(() => {
                // Fallback loading
                return this.loadComponentFallback(componentName);
            });
            
            loadPromise.then(() => {
                const loadTime = performance.now() - startTime;
                this.recordMetric(`component-load-${componentName}`, loadTime);
                
                element.classList.add('loaded');
                element.removeAttribute('data-lazy-load');
                
                resolve();
            });
        });
    }

    // Preload critical resources for K2Motor dashboard
    preloadCriticalResources() {
        const criticalResources = [
            '/dashboard/assets/css/dashboard.css',
            '/dashboard/assets/js/dashboard-core.js',
            '/dashboard/assets/fonts/racing-font.woff2',
            '/dashboard/assets/images/k2motor-logo.svg'
        ];
        
        criticalResources.forEach(resource => {
            this.preloadResource(resource);
        });
        
        // Preload racing-theme-assets
        this.preloadRacingThemeAssets();
    }

    // Preload individual resource
    preloadResource(url) {
        const link = document.createElement('link');
        link.rel = 'preload';
        
        if (url.endsWith('.css')) {
            link.as = 'style';
        } else if (url.endsWith('.js')) {
            link.as = 'script';
        } else if (url.endsWith('.woff2') || url.endsWith('.woff')) {
            link.as = 'font';
            link.crossOrigin = 'anonymous';
        } else if (url.match(/\.(jpg|jpeg|png|svg|webp)$/)) {
            link.as = 'image';
        }
        
        link.href = url;
        document.head.appendChild(link);
    }

    // Preload racing theme assets
    preloadRacingThemeAssets() {
        this.racingThemeAssets.critical = [
            '/dashboard/assets/images/racing-stripes.svg',
            '/dashboard/assets/images/carbon-fiber-texture.jpg',
            '/dashboard/assets/css/racing-theme.css'
        ];
        
        this.racingThemeAssets.critical.forEach(asset => {
            if (!this.racingThemeAssets.preloaded.has(asset)) {
                this.preloadResource(asset);
                this.racingThemeAssets.preloaded.add(asset);
            }
        });
    }

    // Set up progressive image loading
    setupProgressiveImageLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    imageObserver.unobserve(entry.target);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
        this.observers.set('images', imageObserver);
    }

    // Load image with progressive enhancement
    loadImage(img) {
        const src = img.dataset.src;
        const placeholder = img.src;
        
        const imageLoader = new Image();
        imageLoader.onload = () => {
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
        };
        
        imageLoader.onerror = () => {
            img.classList.add('error');
        };
        
        imageLoader.src = src;
    }

    // Set up comprehensive performance monitoring
    setupPerformanceMonitoring() {
        // Monitor JavaScript execution time
        this.monitorJSPerformance();
        
        // Track memory usage
        this.monitorMemoryUsage();
        
        // Monitor network performance
        this.monitorNetworkPerformance();
        
        // Set up custom performance markers
        this.setupCustomMarkers();
        
        console.log('🔍 Set up K2Motor Performance Parts monitoring');
    }

    // Monitor JavaScript execution performance
    monitorJSPerformance() {
        // Wrap performance-critical functions
        this.wrapFunction = (obj, methodName, context = 'K2Motor') => {
            const originalMethod = obj[methodName];
            
            obj[methodName] = function(...args) {
                const startTime = performance.now();
                const markStart = `${context}-${methodName}-start`;
                const markEnd = `${context}-${methodName}-end`;
                const measureName = `${context}-${methodName}`;
                
                performance.mark(markStart);
                const result = originalMethod.apply(this, args);
                performance.mark(markEnd);
                
                performance.measure(measureName, markStart, markEnd);
                
                const endTime = performance.now();
                const duration = endTime - startTime;
                
                if (duration > 16) { // Longer than one frame
                    console.warn(`K2Motor slow function: ${methodName} took ${duration.toFixed(2)}ms`);
                }
                
                return result;
            };
        };
    }

    // Monitor memory usage for automotive dashboard
    monitorMemoryUsage() {
        if ('memory' in performance) {
            const logMemoryUsage = () => {
                const memory = performance.memory;
                const memoryInfo = {
                    used: Math.round(memory.usedJSHeapSize / 1048576), // MB
                    total: Math.round(memory.totalJSHeapSize / 1048576), // MB
                    limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
                };
                
                this.recordMetric('memory-usage', memoryInfo);
                
                // Warn if memory usage is high
                if (memoryInfo.used > memoryInfo.limit * 0.8) {
                    console.warn('K2Motor high memory usage:', memoryInfo);
                    this.triggerMemoryCleanup();
                }
            };
            
            // Log memory usage every 30 seconds
            setInterval(logMemoryUsage, 30000);
            this.intervals.add(setInterval(logMemoryUsage, 30000));
        }
    }

    // Monitor network performance
    monitorNetworkPerformance() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            const logConnectionInfo = () => {
                const connectionInfo = {
                    effectiveType: connection.effectiveType,
                    downlink: connection.downlink,
                    rtt: connection.rtt,
                    saveData: connection.saveData
                };
                
                this.recordMetric('connection', connectionInfo);
                
                // Adjust performance optimizations based on connection
                this.adaptToNetworkConditions(connectionInfo);
            };
            
            connection.addEventListener('change', logConnectionInfo);
            logConnectionInfo(); // Initial check
        }
    }

    // Set up custom performance markers for K2Motor
    setupCustomMarkers() {
        // Mark dashboard ready
        this.markDashboardReady = () => {
            performance.mark('k2motor-dashboard-ready');
            this.recordMetric('dashboard-ready', performance.now());
        };
        
        // Mark data loaded
        this.markDataLoaded = (dataType) => {
            performance.mark(`k2motor-${dataType}-loaded`);
            this.recordMetric(`${dataType}-loaded`, performance.now());
        };
        
        // Measure user interactions
        this.measureUserInteraction = (interactionType) => {
            const markName = `k2motor-interaction-${interactionType}`;
            performance.mark(markName);
            
            // Measure from page load to interaction
            performance.measure(
                `time-to-${interactionType}`, 
                'navigationStart', 
                markName
            );
        };
    }

    // Optimize racing theme assets loading
    optimizeRacingThemeAssets() {
        // Optimize CSS delivery
        this.optimizeCSSDelivery();
        
        // Optimize font loading
        this.optimizeFontLoading();
        
        // Optimize images
        this.optimizeImageDelivery();
        
        console.log('🏎️ Optimized K2Motor racing-theme-assets loading');
    }

    // Optimize CSS delivery for racing theme
    optimizeCSSDelivery() {
        // Inline critical CSS
        this.inlineCriticalCSS();
        
        // Lazy load non-critical CSS
        this.lazyLoadCSS();
        
        // Remove unused CSS
        this.removeUnusedCSS();
    }

    // Inline critical CSS for automotive dashboard
    inlineCriticalCSS() {
        const criticalCSS = `
            .dashboard-container { display: block; }
            .metrics-card { background: var(--carbon-fiber); }
            .racing-orange { color: #FF6B35; }
            .electric-blue { color: #00D4FF; }
        `;
        
        const style = document.createElement('style');
        style.textContent = criticalCSS;
        document.head.insertBefore(style, document.head.firstChild);
    }

    // Lazy load non-critical CSS
    lazyLoadCSS() {
        const loadCSS = (href) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.media = 'print';
            link.onload = () => { link.media = 'all'; };
            document.head.appendChild(link);
        };
        
        // Load non-critical stylesheets
        setTimeout(() => {
            loadCSS('/dashboard/assets/css/racing-animations.css');
            loadCSS('/dashboard/assets/css/racing-themes.css');
        }, 100);
    }

    // Remove unused CSS (simplified implementation)
    removeUnusedCSS() {
        // This would typically be done at build time
        // Here we just add a marker for the build process
        if (document.documentElement.dataset.environment === 'production') {
            console.log('K2Motor: Unused CSS removal should be handled at build time');
        }
    }

    // Optimize font loading for racing theme
    optimizeFontLoading() {
        // Use font-display: swap for better loading experience
        const fontCSS = `
            @font-face {
                font-family: 'Racing';
                src: url('/dashboard/assets/fonts/racing.woff2') format('woff2');
                font-display: swap;
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = fontCSS;
        document.head.appendChild(style);
    }

    // Optimize image delivery
    optimizeImageDelivery() {
        // Convert images to WebP if supported
        this.useWebPImages();
        
        // Implement responsive images
        this.implementResponsiveImages();
        
        // Add image compression
        this.compressImages();
    }

    // Use WebP images if supported
    useWebPImages() {
        const supportsWebP = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            return canvas.toDataURL('image/webp').indexOf('webp') > -1;
        };
        
        if (supportsWebP()) {
            document.querySelectorAll('img[data-webp]').forEach(img => {
                img.src = img.dataset.webp;
            });
        }
    }

    // Implement responsive images
    implementResponsiveImages() {
        const images = document.querySelectorAll('img[data-srcset]');
        images.forEach(img => {
            img.srcset = img.dataset.srcset;
            img.sizes = img.dataset.sizes || '(max-width: 768px) 100vw, 50vw';
        });
    }

    // Compress images (client-side optimization)
    compressImages() {
        // This would typically be done at build time
        console.log('K2Motor: Image compression should be handled at build time');
    }

    // Set up memory management for automotive dashboard
    setupMemoryManagement() {
        // Clean up event listeners
        this.setupEventListenerCleanup();
        
        // Implement debounce and throttle utilities
        this.setupDebounceThrottle();
        
        // Set up automatic cleanup
        this.setupAutomaticCleanup();
        
        console.log('🧹 Set up K2Motor Performance Parts memory management');
    }

    // Set up event listener cleanup system
    setupEventListenerCleanup() {
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        const originalRemoveEventListener = EventTarget.prototype.removeEventListener;
        
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            // Track event listeners
            if (!this._k2motorListeners) {
                this._k2motorListeners = new Map();
            }
            
            if (!this._k2motorListeners.has(type)) {
                this._k2motorListeners.set(type, new Set());
            }
            
            this._k2motorListeners.get(type).add(listener);
            
            return originalAddEventListener.call(this, type, listener, options);
        };
        
        // Add cleanup method
        this.cleanupEventListeners = (element) => {
            if (element._k2motorListeners) {
                element._k2motorListeners.forEach((listeners, type) => {
                    listeners.forEach(listener => {
                        element.removeEventListener(type, listener);
                    });
                });
                element._k2motorListeners.clear();
            }
        };
    }

    // Set up debounce and throttle utilities
    setupDebounceThrottle() {
        // Debounce implementation
        this.debounce = (func, wait, immediate = false) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    timeout = null;
                    if (!immediate) func.apply(this, args);
                };
                
                const callNow = immediate && !timeout;
                
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                
                if (callNow) func.apply(this, args);
            };
        };
        
        // Throttle implementation  
        this.throttle = (func, limit) => {
            let inThrottle;
            return function executedFunction(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        };
    }

    // Set up automatic cleanup
    setupAutomaticCleanup() {
        // Clean up on page unload
        window.addEventListener('beforeunload', () => {
            this.performCleanup();
        });
        
        // Periodic cleanup
        const cleanupInterval = setInterval(() => {
            this.performPeriodicCleanup();
        }, 60000); // Every minute
        
        this.intervals.add(cleanupInterval);
    }

    // Perform comprehensive cleanup
    performCleanup() {
        // Clear timers
        this.timeouts.forEach(clearTimeout);
        this.intervals.forEach(clearInterval);
        this.requestAnimationFrames.forEach(cancelAnimationFrame);
        
        // Disconnect observers
        this.observers.forEach(observer => observer.disconnect());
        
        // Clear caches
        this.cache.clear?.();
        this.cachedQueries.clear();
        
        console.log('🧹 K2Motor Performance Parts cleanup completed');
    }

    // Perform periodic cleanup
    performPeriodicCleanup() {
        // Garbage collect old metrics
        const now = Date.now();
        const oldMetrics = [];
        
        this.performanceMetrics.forEach((metric, key) => {
            if (now - metric.timestamp > 300000) { // 5 minutes old
                oldMetrics.push(key);
            }
        });
        
        oldMetrics.forEach(key => this.performanceMetrics.delete(key));
    }

    // Initialize caching strategies
    initializeCaching() {
        // Initialize localStorage caching
        this.setupLocalStorageCaching();
        
        // Initialize sessionStorage caching
        this.setupSessionStorageCaching();
        
        // Initialize IndexedDB caching
        this.setupIndexedDBCaching();
        
        console.log('💾 Initialized K2Motor Performance Parts caching');
    }

    // Set up localStorage caching
    setupLocalStorageCaching() {
        this.localStorageCache = {
            set: (key, value, ttl = 3600000) => { // 1 hour default
                const item = {
                    value,
                    timestamp: Date.now(),
                    ttl
                };
                
                try {
                    localStorage.setItem(`k2motor-${key}`, JSON.stringify(item));
                } catch (e) {
                    console.warn('K2Motor localStorage quota exceeded');
                    this.clearExpiredLocalStorage();
                }
            },
            
            get: (key) => {
                try {
                    const item = JSON.parse(localStorage.getItem(`k2motor-${key}`));
                    if (!item) return null;
                    
                    if (Date.now() - item.timestamp > item.ttl) {
                        localStorage.removeItem(`k2motor-${key}`);
                        return null;
                    }
                    
                    return item.value;
                } catch (e) {
                    return null;
                }
            }
        };
    }

    // Set up sessionStorage caching
    setupSessionStorageCaching() {
        this.sessionStorageCache = {
            set: (key, value) => {
                try {
                    sessionStorage.setItem(`k2motor-${key}`, JSON.stringify(value));
                } catch (e) {
                    console.warn('K2Motor sessionStorage quota exceeded');
                }
            },
            
            get: (key) => {
                try {
                    return JSON.parse(sessionStorage.getItem(`k2motor-${key}`));
                } catch (e) {
                    return null;
                }
            }
        };
    }

    // Set up IndexedDB caching for large data
    setupIndexedDBCaching() {
        if ('indexedDB' in window) {
            const dbName = 'K2MotorPerformanceCache';
            const dbVersion = 1;
            
            const request = indexedDB.open(dbName, dbVersion);
            
            request.onerror = () => {
                console.warn('K2Motor IndexedDB not available');
            };
            
            request.onsuccess = (event) => {
                this.indexedDB = event.target.result;
                console.log('K2Motor IndexedDB initialized');
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                const objectStore = db.createObjectStore('cache', { keyPath: 'key' });
                objectStore.createIndex('timestamp', 'timestamp', { unique: false });
            };
        }
    }

    // Clear expired localStorage items
    clearExpiredLocalStorage() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('k2motor-')) {
                try {
                    const item = JSON.parse(localStorage.getItem(key));
                    if (item && Date.now() - item.timestamp > item.ttl) {
                        localStorage.removeItem(key);
                    }
                } catch (e) {
                    localStorage.removeItem(key);
                }
            }
        });
    }

    // Utility methods
    recordMetric(name, value) {
        this.performanceMetrics.set(name, {
            value,
            timestamp: Date.now()
        });
    }

    sendMetricToAnalytics(name, value) {
        // Send to analytics service (implement based on your analytics provider)
        if (window.gtag) {
            window.gtag('event', 'k2motor_performance', {
                metric_name: name,
                metric_value: value
            });
        }
    }

    // Adaptation methods
    adaptToNetworkConditions(connectionInfo) {
        if (connectionInfo.effectiveType === '2g' || connectionInfo.saveData) {
            // Reduce resource loading for slow connections
            this.enableDataSaver();
        } else if (connectionInfo.effectiveType === '4g') {
            // Enable prefetching for fast connections
            this.enableAggressivePrefetching();
        }
    }

    enableDataSaver() {
        // Disable non-essential animations
        document.body.classList.add('data-saver-mode');
        
        // Reduce image quality
        document.querySelectorAll('img').forEach(img => {
            if (img.dataset.lowQuality) {
                img.src = img.dataset.lowQuality;
            }
        });
    }

    enableAggressivePrefetching() {
        // Prefetch all code chunks
        this.codeChunks.forEach((_, moduleName) => {
            this.prefetchModule(moduleName);
        });
    }

    // Optimization trigger methods
    optimizeContentPainting() {
        // Optimize FCP by inlining critical CSS
        this.inlineCriticalCSS();
    }

    optimizeLargestContentfulPaint() {
        // Optimize LCP by preloading hero images
        const heroImages = document.querySelectorAll('.hero-image, .dashboard-hero');
        heroImages.forEach(img => {
            if (img.dataset.src) {
                this.preloadResource(img.dataset.src);
            }
        });
    }

    optimizeLayoutStability() {
        // Reduce CLS by setting image dimensions
        document.querySelectorAll('img:not([width]):not([height])').forEach(img => {
            img.style.aspectRatio = '16/9'; // Default aspect ratio
        });
    }

    optimizeInputResponsiveness() {
        // Optimize FID by breaking up long tasks
        this.implementFrameBudgeting();
    }

    triggerMemoryCleanup() {
        // Force garbage collection (if available)
        if (window.gc) {
            window.gc();
        }
        
        // Clear caches
        this.performPeriodicCleanup();
    }

    // Analysis methods
    analyzeNavigationTiming(entry) {
        const metrics = {
            ttfb: entry.responseStart - entry.requestStart,
            domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
            load: entry.loadEventEnd - entry.loadEventStart
        };
        
        Object.entries(metrics).forEach(([name, value]) => {
            this.recordMetric(`navigation-${name}`, value);
        });
    }

    analyzeResourceTiming(entry) {
        if (entry.name.includes('k2motor') || entry.name.includes('dashboard')) {
            const loadTime = entry.responseEnd - entry.startTime;
            this.recordMetric(`resource-${entry.name}`, loadTime);
            
            if (loadTime > 1000) {
                console.warn(`K2Motor slow resource: ${entry.name} (${loadTime}ms)`);
            }
        }
    }

    analyzeLongTask(entry) {
        console.warn(`K2Motor long task detected: ${entry.duration}ms`);
        this.recordMetric('longtask', entry.duration);
    }

    loadComponentFallback(componentName) {
        // Fallback loading mechanism
        return Promise.resolve({
            name: componentName,
            fallback: true
        });
    }

    // Get performance statistics
    getPerformanceStats() {
        return {
            initialized: this.isInitialized,
            metrics: Object.fromEntries(this.performanceMetrics),
            cacheSize: this.cache.size || 0,
            observersActive: this.observers.size,
            timersActive: this.timeouts.size + this.intervals.size,
            racingAssetsPreloaded: this.racingThemeAssets.preloaded.size
        };
    }
}

// Cache Manager class for structured caching
class CacheManager {
    constructor() {
        this.cache = new Map();
        this.maxSize = 100;
        this.ttl = 3600000; // 1 hour
    }

    set(key, value, customTTL = null) {
        if (this.cache.size >= this.maxSize) {
            // Remove oldest entry
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        
        this.cache.set(key, {
            value,
            timestamp: Date.now(),
            ttl: customTTL || this.ttl
        });
    }

    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;
        
        if (Date.now() - item.timestamp > item.ttl) {
            this.cache.delete(key);
            return null;
        }
        
        return item.value;
    }

    clear() {
        this.cache.clear();
    }

    size() {
        return this.cache.size;
    }
}

// Initialize performance optimizer
const performanceOptimizer = new PerformanceOptimizer();

// Auto-start when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    performanceOptimizer.initializePerformanceTracking();
    console.log('🚀 K2Motor Performance Parts automotive-performance-dashboard optimizer ready');
});

// Make globally available
window.performanceOptimizer = performanceOptimizer;