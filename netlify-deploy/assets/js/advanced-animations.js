// K2Motor Performance Parts - Advanced Animations System
// Smooth transitions and micro-interactions for premium racing dashboard feel

class AnimationController {
    constructor() {
        this.isInitialized = false;
        this.activeAnimations = new Map();
        this.animationQueue = [];
        this.performanceMode = 'auto'; // auto, performance, quality
        this.reducedMotion = false;
        
        // Animation timing configurations
        this.timings = {
            fast: 200,
            normal: 400,
            slow: 600,
            turbo: 150,
            drift: 800
        };
        
        // Racing-themed easing functions
        this.easings = {
            turboBoost: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            raceStart: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            brakeDecel: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            driftCurve: 'cubic-bezier(0.17, 0.67, 0.83, 0.67)',
            pitStop: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)'
        };
        
        // Performance monitoring
        this.performanceMetrics = {
            frameDrops: 0,
            averageFPS: 60,
            animationCount: 0,
            lastFrameTime: performance.now()
        };
    }

    // Initialize advanced animations system
    initializeAdvancedAnimations() {
        console.log('🎯 Initializing K2Motor Performance Parts advanced animations...');
        
        // Check for reduced motion preference
        this.detectReducedMotionPreference();
        
        // Set up micro-interactions
        this.setupMicroInteractions();
        
        // Initialize racing-themed animations
        this.initializeRacingAnimations();
        
        // Set up performance monitoring
        this.setupPerformanceMonitoring();
        
        // Initialize dashboard ready sequence
        this.triggerDashboardReadySequence();
        
        this.isInitialized = true;
        console.log('✅ K2Motor Performance Parts advanced animations ready');
    }

    // Detect user's reduced motion preference
    detectReducedMotionPreference() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.reducedMotion = mediaQuery.matches;
        
        mediaQuery.addEventListener('change', (e) => {
            this.reducedMotion = e.matches;
            this.adjustAnimationsForMotionPreference();
        });
        
        if (this.reducedMotion) {
            console.log('🚫 Reduced motion detected - adjusting K2Motor animations');
            this.performanceMode = 'performance';
        }
    }

    // Adjust animations based on motion preference
    adjustAnimationsForMotionPreference() {
        const dashboardElement = document.querySelector('.dashboard-container');
        if (dashboardElement) {
            dashboardElement.classList.toggle('reduced-motion', this.reducedMotion);
        }
        
        // Update timing for reduced motion
        if (this.reducedMotion) {
            Object.keys(this.timings).forEach(key => {
                this.timings[key] = Math.min(this.timings[key], 200);
            });
        }
    }

    // Set up micro-interactions for enhanced UX
    setupMicroInteractions() {
        // Metric card hover animations
        this.setupMetricCardAnimations();
        
        // Button interaction animations
        this.setupButtonAnimations();
        
        // Tab switching animations
        this.setupTabAnimations();
        
        // Scroll-triggered animations
        this.setupScrollAnimations();
        
        console.log('🖱️ Set up K2Motor Performance Parts micro-interactions');
    }

    // Set up metric card hover and interaction animations
    setupMetricCardAnimations() {
        document.addEventListener('mouseenter', (e) => {
            if (e.target.closest('.metrics-card, .metric-card')) {
                this.animateMetricCardHover(e.target.closest('.metrics-card, .metric-card'), true);
            }
        }, true);
        
        document.addEventListener('mouseleave', (e) => {
            if (e.target.closest('.metrics-card, .metric-card')) {
                this.animateMetricCardHover(e.target.closest('.metrics-card, .metric-card'), false);
            }
        }, true);
        
        // Click ripple effect
        document.addEventListener('click', (e) => {
            if (e.target.closest('.metrics-card, .metric-card')) {
                this.createRippleEffect(e);
            }
        });
    }

    // Animate metric card hover states
    animateMetricCardHover(card, isHovering) {
        if (!card || this.reducedMotion) return;
        
        const animationId = `metric-hover-${card.dataset.id || Math.random()}`;
        
        if (isHovering) {
            // Hover in animation with transform3d for GPU acceleration
            card.style.transform = 'translate3d(0, -4px, 0) scale(1.02)';
            card.style.boxShadow = '0 8px 30px rgba(255, 107, 53, 0.2), 0 0 20px rgba(0, 212, 255, 0.1)';
            card.style.borderColor = 'var(--racing-orange)';
            card.style.transition = `all ${this.timings.fast}ms ${this.easings.turboBoost}`;
            
            // Animate metric values with turbo boost effect
            this.animateMetricCountUp(card);
            
        } else {
            // Hover out animation with transform3d for GPU acceleration
            card.style.transform = 'translate3d(0, 0, 0) scale(1)';
            card.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
            card.style.borderColor = '#333';
            card.style.transition = `all ${this.timings.normal}ms ${this.easings.brakeDecel}`;
        }
        
        this.activeAnimations.set(animationId, card);
    }

    // Create ripple effect on card click
    createRippleEffect(event) {
        if (this.reducedMotion) return;
        
        const card = event.target.closest('.metrics-card, .metric-card');
        const rect = card.getBoundingClientRect();
        const ripple = document.createElement('div');
        
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255, 107, 53, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-expand ${this.timings.normal}ms ${this.easings.turboBoost} forwards;
            pointer-events: none;
            z-index: 10;
        `;
        
        card.style.position = 'relative';
        card.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, this.timings.normal);
    }

    // Animate metric value count-up with racing style
    animateMetricCountUp(card) {
        const valueElements = card.querySelectorAll('.metric-value');
        
        valueElements.forEach(element => {
            const originalValue = element.textContent;
            const numericValue = parseFloat(originalValue.replace(/[^\d.-]/g, ''));
            
            if (!isNaN(numericValue)) {
                this.countUpAnimation(element, 0, numericValue, originalValue);
            }
        });
    }

    // Count-up animation for numeric values
    countUpAnimation(element, start, end, originalText) {
        if (this.reducedMotion) return;
        
        const duration = this.timings.normal;
        const startTime = performance.now();
        const prefix = originalText.replace(/[\d.-]/g, '').substring(0, 1);
        const suffix = originalText.replace(/[\d.-]/g, '').substring(1);
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Use easing function for smooth animation
            const easedProgress = this.easeOutQuart(progress);
            const currentValue = start + (end - start) * easedProgress;
            
            // Format based on original text
            let displayValue;
            if (originalText.includes('x')) {
                displayValue = `${currentValue.toFixed(2)}x`;
            } else if (originalText.includes('$')) {
                displayValue = `$${Math.round(currentValue).toLocaleString()}`;
            } else if (originalText.includes('%')) {
                displayValue = `${currentValue.toFixed(1)}%`;
            } else {
                displayValue = Math.round(currentValue).toString();
            }
            
            element.textContent = displayValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    // Racing-style easing function
    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    // Set up button interaction animations
    setupButtonAnimations() {
        document.addEventListener('mousedown', (e) => {
            if (e.target.matches('button, .btn')) {
                this.animateButtonPress(e.target, true);
            }
        });
        
        document.addEventListener('mouseup', (e) => {
            if (e.target.matches('button, .btn')) {
                this.animateButtonPress(e.target, false);
            }
        });
        
        document.addEventListener('mouseleave', (e) => {
            if (e.target.matches('button, .btn')) {
                this.animateButtonPress(e.target, false);
            }
        });
    }

    // Animate button press with turbo boost effect
    animateButtonPress(button, isPressed) {
        if (this.reducedMotion) return;
        
        if (isPressed) {
            button.style.transform = 'scale(0.95) translateY(1px)';
            button.style.boxShadow = '0 2px 8px rgba(255, 107, 53, 0.3)';
            button.style.transition = `all ${this.timings.fast}ms ${this.easings.raceStart}`;
        } else {
            button.style.transform = 'scale(1) translateY(0)';
            button.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.2)';
            button.style.transition = `all ${this.timings.normal}ms ${this.easings.brakeDecel}`;
        }
    }

    // Set up tab switching animations with racing theme
    setupTabAnimations() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.nav-tab')) {
                this.animateTabSwitch(e.target.closest('.nav-tab'));
            }
        });
    }

    // Animate tab switching with slide and fade effects
    animateTabSwitch(clickedTab) {
        if (this.reducedMotion) return;
        
        const currentTab = document.querySelector('.nav-tab.active');
        const tabContent = document.querySelector('.tab-content');
        
        // Racing stripes animation on tab switch
        this.createRacingStripesEffect(clickedTab);
        
        // Content slide animation
        if (tabContent) {
            tabContent.style.opacity = '0';
            tabContent.style.transform = 'translateX(30px)';
            tabContent.style.transition = `all ${this.timings.fast}ms ${this.easings.raceStart}`;
            
            setTimeout(() => {
                tabContent.style.opacity = '1';
                tabContent.style.transform = 'translateX(0)';
                tabContent.style.transition = `all ${this.timings.normal}ms ${this.easings.turboBoost}`;
            }, this.timings.fast);
        }
    }

    // Create racing stripes effect for tab activation
    createRacingStripesEffect(tab) {
        if (this.reducedMotion) return;
        
        const stripes = document.createElement('div');
        stripes.className = 'racing-stripes';
        stripes.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: repeating-linear-gradient(
                45deg,
                transparent,
                transparent 2px,
                rgba(255, 107, 53, 0.1) 2px,
                rgba(255, 107, 53, 0.1) 4px
            );
            opacity: 0;
            animation: racing-stripes-flash ${this.timings.normal}ms ${this.easings.turboBoost};
            pointer-events: none;
            z-index: 1;
        `;
        
        tab.style.position = 'relative';
        tab.appendChild(stripes);
        
        setTimeout(() => {
            if (stripes.parentNode) {
                stripes.parentNode.removeChild(stripes);
            }
        }, this.timings.normal);
    }

    // Set up scroll-triggered animations
    setupScrollAnimations() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.triggerScrollAnimation(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '50px' }
        );
        
        // Observe elements for scroll animations
        document.querySelectorAll('.metrics-card, .campaign-card, .chart-container').forEach(el => {
            observer.observe(el);
        });
        
        // Set up continuous scroll monitoring for new elements
        setInterval(() => {
            document.querySelectorAll('.metrics-card:not([data-animated]), .campaign-card:not([data-animated])').forEach(el => {
                observer.observe(el);
            });
        }, 1000);
    }

    // Trigger scroll-based animations
    triggerScrollAnimation(element) {
        if (this.reducedMotion || element.dataset.animated) return;
        
        element.dataset.animated = 'true';
        
        // Slide in from left with fade
        this.slideInFromLeft(element);
        
        // If it's a metric card, animate the values
        if (element.classList.contains('metrics-card') || element.classList.contains('metric-card')) {
            setTimeout(() => {
                this.animateMetricCountUp(element);
            }, this.timings.fast);
        }
    }

    // Slide in from left animation
    slideInFromLeft(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-50px)';
        element.style.transition = 'none';
        
        requestAnimationFrame(() => {
            element.style.transition = `all ${this.timings.normal}ms ${this.easings.turboBoost}`;
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }

    // Fade in with scale animation
    fadeInWithScale(element, delay = 0) {
        if (this.reducedMotion) return;
        
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        element.style.transition = 'none';
        
        setTimeout(() => {
            element.style.transition = `all ${this.timings.normal}ms ${this.easings.turboBoost}`;
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        }, delay);
    }

    // Initialize racing-themed animations
    initializeRacingAnimations() {
        // Neon glow pulse for important elements
        this.setupNeonGlowPulse();
        
        // Carbon fiber shimmer effect
        this.setupCarbonFiberShimmer();
        
        // Speedometer-style animations for gauges
        this.setupSpeedometerAnimations();
        
        // Turbo boost effects for performance metrics
        this.setupTurboBoostEffects();
        
        console.log('🏎️ Initialized K2Motor Performance Parts racing animations');
    }

    // Set up neon glow pulse for critical elements
    setupNeonGlowPulse() {
        const criticalElements = document.querySelectorAll('.alert-critical, .scenario-alert.critical');
        
        criticalElements.forEach(element => {
            if (!this.reducedMotion) {
                element.style.animation = `neon-glow-pulse ${this.timings.drift}ms infinite alternate`;
            }
        });
    }

    // Set up carbon fiber shimmer effect for cards
    setupCarbonFiberShimmer() {
        if (this.reducedMotion) return;
        
        const cards = document.querySelectorAll('.metrics-card, .campaign-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.addCarbonFiberShimmer(card);
            });
        });
    }

    // Add carbon fiber shimmer effect
    addCarbonFiberShimmer(element) {
        if (this.reducedMotion) return;
        
        const shimmer = document.createElement('div');
        shimmer.className = 'carbon-fiber-shimmer';
        shimmer.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                90deg, 
                transparent, 
                rgba(255, 107, 53, 0.1) 50%, 
                transparent
            );
            animation: carbon-fiber-shimmer ${this.timings.slow}ms ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(shimmer);
        
        setTimeout(() => {
            if (shimmer.parentNode) {
                shimmer.parentNode.removeChild(shimmer);
            }
        }, this.timings.slow);
    }

    // Set up speedometer-style animations for ROAS gauges
    setupSpeedometerAnimations() {
        const roasElements = document.querySelectorAll('[data-metric="roas"], .roas-value');
        
        roasElements.forEach(element => {
            this.createROASGauge(element);
        });
    }

    // Create animated ROAS gauge
    createROASGauge(element) {
        const value = parseFloat(element.textContent.replace(/[^\d.]/g, ''));
        if (isNaN(value)) return;
        
        const gauge = document.createElement('div');
        gauge.className = 'speedometer-animation';
        gauge.innerHTML = `
            <div class="gauge-container">
                <div class="gauge-arc"></div>
                <div class="gauge-needle" style="transform: rotate(${this.calculateGaugeAngle(value)}deg)"></div>
                <div class="gauge-center"></div>
            </div>
        `;
        
        element.appendChild(gauge);
        
        if (!this.reducedMotion) {
            this.animateROASGauge(gauge, value);
        }
    }

    // Calculate gauge needle angle based on ROAS value
    calculateGaugeAngle(value) {
        // Map ROAS value (0-10) to gauge angle (-90 to 90 degrees)
        const clampedValue = Math.max(0, Math.min(10, value));
        return (clampedValue / 10) * 180 - 90;
    }

    // Animate ROAS gauge needle
    animateROASGauge(gauge, targetValue) {
        const needle = gauge.querySelector('.gauge-needle');
        const startAngle = -90;
        const endAngle = this.calculateGaugeAngle(targetValue);
        const duration = this.timings.drift;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = this.easeOutQuart(progress);
            const currentAngle = startAngle + (endAngle - startAngle) * easedProgress;
            
            needle.style.transform = `rotate(${currentAngle}deg)`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    // Set up turbo boost effects for high-performance metrics
    setupTurboBoostEffects() {
        // Monitor for high-performance scenarios
        document.addEventListener('click', (e) => {
            if (e.target.closest('.scenario-alert.opportunity')) {
                this.triggerTurboBoostEffect(e.target.closest('.scenario-alert'));
            }
        });
    }

    // Trigger turbo boost visual effect
    triggerTurboBoostEffect(element) {
        if (this.reducedMotion) return;
        
        const boost = document.createElement('div');
        boost.className = 'turbo-boost-effect';
        boost.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, var(--electric-blue), transparent);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: turbo-boost-expand ${this.timings.normal}ms ${this.easings.turboBoost};
            pointer-events: none;
            z-index: 10;
        `;
        
        element.style.position = 'relative';
        element.appendChild(boost);
        
        setTimeout(() => {
            if (boost.parentNode) {
                boost.parentNode.removeChild(boost);
            }
        }, this.timings.normal);
    }

    // Animate POAS indicator with color transitions
    animatePOASIndicator(element, value) {
        if (this.reducedMotion) return;
        
        const numericValue = parseFloat(value);
        let color;
        
        if (numericValue >= 2.0) {
            color = 'var(--neon-green)';
        } else if (numericValue >= 1.0) {
            color = 'var(--racing-orange)';
        } else {
            color = 'var(--danger-red)';
        }
        
        element.style.transition = `color ${this.timings.normal}ms ${this.easings.turboBoost}`;
        element.style.color = color;
        element.style.textShadow = `0 0 10px ${color}`;
    }

    // Pulse scenario alert with priority-based intensity
    pulseScenarioAlert(alertElement, priority = 'normal') {
        if (this.reducedMotion) return;
        
        const intensityMap = {
            low: this.timings.drift,
            normal: this.timings.slow,
            high: this.timings.normal,
            critical: this.timings.fast
        };
        
        const duration = intensityMap[priority] || this.timings.normal;
        
        alertElement.style.animation = `pulse-alert ${duration}ms infinite alternate`;
    }

    // Trigger dashboard ready sequence
    triggerDashboardReadySequence() {
        if (this.reducedMotion) return;
        
        console.log('🚀 Starting K2Motor Performance Parts dashboard-ready-sequence');
        
        // Animate logo
        this.animateLogo();
        
        // Stagger-animate navigation tabs
        this.animateNavigationTabs();
        
        // Cascade-animate metric cards
        this.animateMetricCards();
        
        // Final turbo boost effect
        setTimeout(() => {
            this.showDashboardReadyEffect();
        }, this.timings.drift);
    }

    // Animate logo on dashboard load
    animateLogo() {
        const logo = document.querySelector('.logo-section h1');
        if (logo) {
            this.fadeInWithScale(logo, 0);
        }
    }

    // Animate navigation tabs in sequence
    animateNavigationTabs() {
        const tabs = document.querySelectorAll('.nav-tab');
        tabs.forEach((tab, index) => {
            this.slideInFromLeft(tab);
        });
    }

    // Animate metric cards with staggered timing
    animateMetricCards() {
        const cards = document.querySelectorAll('.metrics-card, .metric-card');
        cards.forEach((card, index) => {
            this.fadeInWithScale(card, index * 100);
        });
    }

    // Show final dashboard ready effect
    showDashboardReadyEffect() {
        const dashboard = document.querySelector('.dashboard-container');
        if (dashboard && !this.reducedMotion) {
            // Brief glow effect to indicate full readiness
            dashboard.style.boxShadow = '0 0 30px rgba(255, 107, 53, 0.3)';
            dashboard.style.transition = `box-shadow ${this.timings.normal}ms ease-out`;
            
            setTimeout(() => {
                dashboard.style.boxShadow = 'none';
            }, this.timings.normal);
        }
        
        console.log('✅ K2Motor Performance Parts dashboard ready with turbo boost!');
    }

    // Set up performance monitoring for animations
    setupPerformanceMonitoring() {
        if (!window.performance) return;
        
        let frameCount = 0;
        let lastTime = performance.now();
        
        const measureFrameRate = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                this.performanceMetrics.averageFPS = frameCount;
                
                // Adjust performance mode based on FPS
                if (this.performanceMetrics.averageFPS < 30) {
                    this.performanceMode = 'performance';
                    this.adjustAnimationsForPerformance();
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measureFrameRate);
        };
        
        requestAnimationFrame(measureFrameRate);
        
        console.log('📊 K2Motor Performance Parts animation performance monitoring active');
    }

    // Adjust animations based on performance
    adjustAnimationsForPerformance() {
        if (this.performanceMode === 'performance') {
            // Reduce animation complexity
            Object.keys(this.timings).forEach(key => {
                this.timings[key] = Math.max(this.timings[key] * 0.7, 100);
            });
            
            // Disable complex effects
            document.documentElement.style.setProperty('--enable-complex-animations', '0');
        }
    }

    // Morphing card expansion animation
    morphCardExpansion(card, isExpanding) {
        if (this.reducedMotion) return;
        
        if (isExpanding) {
            card.style.transform = 'scale(1.05)';
            card.style.zIndex = '10';
            card.style.transition = `all ${this.timings.normal}ms ${this.easings.turboBoost}`;
        } else {
            card.style.transform = 'scale(1)';
            card.style.zIndex = '1';
            card.style.transition = `all ${this.timings.normal}ms ${this.easings.brakeDecel}`;
        }
    }

    // Parallax scrolling effect for background elements
    parallaxScrolling() {
        if (this.reducedMotion) return;
        
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const rate = scrolled * -0.5;
                element.style.transform = `translateY(${rate}px)`;
            });
        });
    }

    // Get animation system statistics
    getAnimationStats() {
        return {
            initialized: this.isInitialized,
            activeAnimations: this.activeAnimations.size,
            performanceMode: this.performanceMode,
            reducedMotion: this.reducedMotion,
            averageFPS: this.performanceMetrics.averageFPS,
            frameDrops: this.performanceMetrics.frameDrops
        };
    }
}

// Initialize advanced animations system
const animationController = new AnimationController();

// Auto-start when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    animationController.initializeAdvancedAnimations();
    console.log('🎯 K2Motor Performance Parts advanced animations system ready');
});

// Add advanced animation CSS
const animationStyles = `
<style>
/* K2Motor Racing Animation Keyframes */
@keyframes ripple-expand {
    to {
        transform: scale(2);
        opacity: 0;
    }
}

@keyframes racing-stripes-flash {
    0% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
}

@keyframes neon-glow-pulse {
    0% { 
        box-shadow: 0 0 5px var(--danger-red), inset 0 0 5px var(--danger-red);
    }
    100% { 
        box-shadow: 0 0 20px var(--danger-red), inset 0 0 10px var(--danger-red);
    }
}

@keyframes carbon-fiber-shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
}

@keyframes turbo-boost-expand {
    0% {
        transform: translate(-50%, -50%) scale(0);
        opacity: 1;
    }
    100% {
        transform: translate(-50%, -50%) scale(3);
        opacity: 0;
    }
}

@keyframes pulse-alert {
    0% { 
        transform: scale(1);
        opacity: 0.8;
    }
    100% { 
        transform: scale(1.02);
        opacity: 1;
    }
}

/* Speedometer Gauge Styles */
.speedometer-animation {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 40px;
    height: 20px;
}

.gauge-container {
    position: relative;
    width: 100%;
    height: 100%;
}

.gauge-arc {
    width: 100%;
    height: 100%;
    border: 2px solid var(--carbon-fiber);
    border-bottom: 2px solid var(--racing-orange);
    border-radius: 40px 40px 0 0;
    background: linear-gradient(180deg, 
        transparent 0%, 
        rgba(255, 107, 53, 0.1) 50%, 
        rgba(0, 212, 255, 0.1) 100%
    );
}

.gauge-needle {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 2px;
    height: 15px;
    background: var(--electric-blue);
    transform-origin: bottom center;
    transform: translate(-50%, -100%) rotate(-90deg);
    transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    border-radius: 1px;
    box-shadow: 0 0 4px var(--electric-blue);
}

.gauge-center {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 4px;
    height: 4px;
    background: var(--racing-orange);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 6px var(--racing-orange);
}

/* Performance optimizations */
.metrics-card,
.campaign-card,
.nav-tab,
.gauge-needle {
    will-change: transform, opacity;
}

/* Reduced motion support */
.reduced-motion * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
}

.reduced-motion .speedometer-animation,
.reduced-motion .racing-stripes,
.reduced-motion .turbo-boost-effect {
    display: none !important;
}

/* High contrast mode adjustments */
@media (prefers-contrast: high) {
    .gauge-arc {
        border-color: currentColor;
    }
    
    .gauge-needle {
        background: currentColor;
        box-shadow: none;
    }
    
    .neon-glow-pulse {
        animation: none !important;
        border: 2px solid currentColor !important;
    }
}

/* Performance mode adjustments */
[data-performance-mode="performance"] .carbon-fiber-shimmer,
[data-performance-mode="performance"] .parallax-element {
    display: none;
}

/* Accessibility focus indicators */
button:focus-visible,
.nav-tab:focus-visible,
.metrics-card:focus-visible {
    outline: 2px solid var(--electric-blue);
    outline-offset: 2px;
    animation: focus-pulse 1s infinite alternate;
}

@keyframes focus-pulse {
    0% { outline-color: var(--electric-blue); }
    100% { outline-color: var(--racing-orange); }
}

/* Racing theme enhancements */
.dashboard-container {
    position: relative;
    overflow-x: hidden;
}

.dashboard-container::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
        var(--racing-orange) 0%, 
        var(--electric-blue) 50%, 
        var(--racing-orange) 100%
    );
    z-index: 1000;
    opacity: 0.7;
}

/* Micro-interaction enhancements */
.metrics-card {
    transform-origin: center center;
    backface-visibility: hidden;
}

.nav-tab {
    position: relative;
    overflow: hidden;
}

.nav-tab::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: var(--racing-orange);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.nav-tab.active::after,
.nav-tab:hover::after {
    transform: scaleX(1);
}

/* Mobile optimizations */
@media (max-width: 768px) {
    .speedometer-animation {
        width: 30px;
        height: 15px;
    }
    
    .gauge-needle {
        height: 10px;
    }
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
    .gauge-arc {
        background: linear-gradient(180deg, 
            transparent 0%, 
            rgba(255, 107, 53, 0.05) 50%, 
            rgba(0, 212, 255, 0.05) 100%
        );
    }
}
</style>
`;

// Inject animation styles
document.head.insertAdjacentHTML('beforeend', animationStyles);

// Make globally available
window.animationController = animationController;