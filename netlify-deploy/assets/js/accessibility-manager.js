// K2Motor Performance Parts - Accessibility Manager
// WCAG 2.1 AA compliance and enhanced keyboard navigation for automotive performance dashboard

class AccessibilityManager {
    constructor() {
        this.isInitialized = false;
        this.focusTrapStack = [];
        this.skipNavigationLinks = [];
        this.screenReaderAnnouncements = [];
        this.keyboardShortcuts = new Map();
        this.contrastMode = 'normal'; // normal, high, auto
        this.motionPreference = 'normal'; // normal, reduced
        
        // ARIA live regions for dynamic updates
        this.liveRegions = {
            polite: null,
            assertive: null,
            status: null
        };
        
        // Keyboard navigation state
        this.currentFocusIndex = 0;
        this.focusableElements = [];
        this.navigationMode = 'normal'; // normal, skip, search
        
        // Screen reader context tracking
        this.currentContext = {
            section: null,
            metric: null,
            campaign: null,
            timestamp: null
        };
        
        // Color contrast ratios for WCAG AA compliance
        this.contrastRatios = {
            normal: 4.5,    // AA normal text
            large: 3,       // AA large text
            enhanced: 7,    // AAA normal text
            largeAAA: 4.5   // AAA large text
        };
    }

    // Initialize all accessibility features
    initializeA11yFeatures() {
        console.log('♿ Initializing K2Motor Performance Parts accessibility features...');
        
        // Set up ARIA live regions
        this.setupARIALiveRegions();
        
        // Initialize keyboard navigation
        this.setupKeyboardNavigation();
        
        // Set up screen reader support
        this.setupScreenReader();
        
        // Initialize focus management
        this.setupFocusManagement();
        
        // Set up color contrast checking
        this.setupColorContrastChecking();
        
        // Initialize motor sports specific accessibility
        this.setupMotorSportsAccessibility();
        
        // Set up accessibility keyboard shortcuts
        this.setupAccessibilityShortcuts();
        
        // Initialize preference detection
        this.detectUserPreferences();
        
        this.isInitialized = true;
        console.log('✅ K2Motor Performance Parts accessibility features ready');
    }

    // Set up ARIA live regions for dynamic content updates
    setupARIALiveRegions() {
        // Create polite live region for non-urgent updates
        this.liveRegions.polite = this.createLiveRegion('polite', 'k2motor-live-polite');
        
        // Create assertive live region for urgent updates
        this.liveRegions.assertive = this.createLiveRegion('assertive', 'k2motor-live-assertive');
        
        // Create status live region for status updates
        this.liveRegions.status = this.createLiveRegion('status', 'k2motor-live-status');
        
        console.log('📢 Set up K2Motor Performance Parts ARIA live regions');
    }

    // Create an ARIA live region
    createLiveRegion(level, id) {
        const liveRegion = document.createElement('div');
        liveRegion.id = id;
        liveRegion.setAttribute('aria-live', level);
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.setAttribute('aria-relevant', 'additions text');
        liveRegion.className = 'screen-reader-only';
        liveRegion.style.cssText = `
            position: absolute !important;
            left: -10000px !important;
            width: 1px !important;
            height: 1px !important;
            overflow: hidden !important;
            clip: rect(1px, 1px, 1px, 1px) !important;
            white-space: nowrap !important;
        `;
        
        document.body.appendChild(liveRegion);
        return liveRegion;
    }

    // Set up comprehensive keyboard navigation
    setupKeyboardNavigation() {
        // Add skip navigation links
        this.addSkipNavigationLinks();
        
        // Set up focus trap for modals
        this.setupFocusTrap();
        
        // Initialize roving tabindex for complex widgets
        this.setupRovingTabindex();
        
        // Set up arrow key navigation for metric cards
        this.setupArrowKeyNavigation();
        
        // Set up escape key handling
        this.setupEscapeKeyHandling();
        
        // Initialize tab navigation enhancement
        this.enhanceTabNavigation();
        
        console.log('⌨️ Set up K2Motor Performance Parts keyboard navigation');
    }

    // Add skip navigation links for faster access
    addSkipNavigationLinks() {
        const skipNav = document.createElement('div');
        skipNav.className = 'skip-navigation';
        skipNav.innerHTML = `
            <a href="#main-content" class="skip-link">Skip to main K2Motor Performance Parts dashboard content</a>
            <a href="#navigation" class="skip-link">Skip to navigation</a>
            <a href="#metrics" class="skip-link">Skip to performance metrics</a>
            <a href="#campaigns" class="skip-link">Skip to campaign data</a>
        `;
        
        // Style skip links
        skipNav.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            z-index: 9999;
        `;
        
        // Make skip links visible on focus
        const skipLinks = skipNav.querySelectorAll('.skip-link');
        skipLinks.forEach(link => {
            link.style.cssText = `
                position: absolute;
                left: -10000px;
                top: auto;
                width: 1px;
                height: 1px;
                overflow: hidden;
                background: var(--racing-orange, #FF6B35);
                color: white;
                padding: 8px 16px;
                text-decoration: none;
                border-radius: 4px;
                font-weight: bold;
                transition: all 0.3s ease;
            `;
            
            link.addEventListener('focus', () => {
                link.style.cssText = `
                    position: fixed;
                    left: 10px;
                    top: 10px;
                    width: auto;
                    height: auto;
                    overflow: visible;
                    background: var(--racing-orange, #FF6B35);
                    color: white;
                    padding: 8px 16px;
                    text-decoration: none;
                    border-radius: 4px;
                    font-weight: bold;
                    z-index: 9999;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                `;
            });
            
            link.addEventListener('blur', () => {
                link.style.left = '-10000px';
                link.style.width = '1px';
                link.style.height = '1px';
                link.style.overflow = 'hidden';
            });
        });
        
        document.body.insertBefore(skipNav, document.body.firstChild);
        this.skipNavigationLinks = Array.from(skipLinks);
    }

    // Set up focus trap for modal dialogs
    setupFocusTrap() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && this.focusTrapStack.length > 0) {
                this.handleFocusTrap(e);
            }
        });
    }

    // Handle focus trapping within modals
    handleFocusTrap(event) {
        const currentTrap = this.focusTrapStack[this.focusTrapStack.length - 1];
        if (!currentTrap) return;
        
        const focusableElements = this.getFocusableElements(currentTrap);
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (event.shiftKey) {
            // Shift + Tab: moving backwards
            if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab: moving forwards
            if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    }

    // Get all focusable elements within a container
    getFocusableElements(container) {
        const focusableSelectors = [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
            '[contenteditable="true"]',
            '.focusable-elements'
        ];
        
        return Array.from(container.querySelectorAll(focusableSelectors.join(', ')))
            .filter(el => {
                return el.offsetWidth > 0 && el.offsetHeight > 0 && 
                       getComputedStyle(el).visibility !== 'hidden';
            });
    }

    // Set up roving tabindex for metric cards
    setupRovingTabindex() {
        const metricCards = document.querySelectorAll('.metrics-card, .metric-card');
        
        metricCards.forEach((card, index) => {
            // Set initial tabindex
            card.setAttribute('tabindex', index === 0 ? '0' : '-1');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', this.generateMetricCardLabel(card));
            
            // Add keyboard event listeners
            card.addEventListener('keydown', (e) => {
                this.handleMetricCardKeydown(e, card);
            });
            
            card.addEventListener('focus', () => {
                this.updateCurrentFocus(card);
                this.announceMetricFocus(card);
            });
        });
        
        this.focusableElements = Array.from(metricCards);
    }

    // Generate accessible label for metric cards
    generateMetricCardLabel(card) {
        const title = card.querySelector('.metric-title, h3, h2')?.textContent || 'Metric';
        const value = card.querySelector('.metric-value, .value')?.textContent || '';
        const change = card.querySelector('.metric-change, .change')?.textContent || '';
        
        let label = `K2Motor Performance Parts ${title}`;
        if (value) label += `, current value: ${value}`;
        if (change) label += `, change: ${change}`;
        
        return label;
    }

    // Handle keyboard navigation for metric cards
    handleMetricCardKeydown(event, card) {
        const currentIndex = this.focusableElements.indexOf(card);
        let targetIndex = currentIndex;
        
        switch (event.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                event.preventDefault();
                targetIndex = (currentIndex + 1) % this.focusableElements.length;
                break;
                
            case 'ArrowLeft':
            case 'ArrowUp':
                event.preventDefault();
                targetIndex = currentIndex === 0 ? 
                    this.focusableElements.length - 1 : currentIndex - 1;
                break;
                
            case 'Home':
                event.preventDefault();
                targetIndex = 0;
                break;
                
            case 'End':
                event.preventDefault();
                targetIndex = this.focusableElements.length - 1;
                break;
                
            case 'Enter':
            case ' ':
                event.preventDefault();
                this.activateMetricCard(card);
                break;
        }
        
        if (targetIndex !== currentIndex) {
            this.moveFocusToIndex(targetIndex);
        }
    }

    // Move focus to specific card index
    moveFocusToIndex(index) {
        // Update tabindex values
        this.focusableElements.forEach((element, i) => {
            element.setAttribute('tabindex', i === index ? '0' : '-1');
        });
        
        // Focus the target element
        this.focusableElements[index].focus();
        this.currentFocusIndex = index;
    }

    // Activate metric card (equivalent to click)
    activateMetricCard(card) {
        card.click();
        this.announceUpdate(`Activated ${this.generateMetricCardLabel(card)}`);
    }

    // Set up arrow key navigation
    setupArrowKeyNavigation() {
        document.addEventListener('keydown', (e) => {
            // Only handle arrow keys when focus is on navigable elements
            if (e.target.matches('.metrics-card, .metric-card, .nav-tab')) {
                this.handleArrowKeyNavigation(e);
            }
        });
    }

    // Handle arrow key navigation
    handleArrowKeyNavigation(event) {
        const isHorizontal = event.key === 'ArrowLeft' || event.key === 'ArrowRight';
        const isVertical = event.key === 'ArrowUp' || event.key === 'ArrowDown';
        
        if (isHorizontal || isVertical) {
            event.preventDefault();
            
            if (event.target.classList.contains('nav-tab')) {
                this.navigateTabs(event.key);
            } else {
                this.navigateMetricCards(event.key);
            }
        }
    }

    // Navigate between tabs using arrow keys
    navigateTabs(direction) {
        const tabs = Array.from(document.querySelectorAll('.nav-tab'));
        const currentTab = document.activeElement;
        const currentIndex = tabs.indexOf(currentTab);
        
        let targetIndex;
        if (direction === 'ArrowLeft' || direction === 'ArrowUp') {
            targetIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
        } else {
            targetIndex = (currentIndex + 1) % tabs.length;
        }
        
        tabs[targetIndex].focus();
        this.announceTabChange(tabs[targetIndex]);
    }

    // Set up escape key handling for closing modals
    setupEscapeKeyHandling() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.handleEscapeKey(e);
            }
        });
    }

    // Handle escape key press
    handleEscapeKey(event) {
        // Close any open modals or overlays
        const modal = document.querySelector('.modal.show, .overlay.active, .dropdown.open');
        if (modal) {
            event.preventDefault();
            this.closeModal(modal);
            return;
        }
        
        // Exit any special navigation mode
        if (this.navigationMode !== 'normal') {
            this.navigationMode = 'normal';
            this.announceUpdate('Exited special navigation mode');
        }
    }

    // Close modal and restore focus
    closeModal(modal) {
        modal.classList.remove('show', 'active', 'open');
        modal.setAttribute('aria-hidden', 'true');
        
        // Remove from focus trap stack
        const trapIndex = this.focusTrapStack.indexOf(modal);
        if (trapIndex > -1) {
            this.focusTrapStack.splice(trapIndex, 1);
        }
        
        // Restore focus to trigger element
        const trigger = modal.dataset.trigger;
        if (trigger) {
            const triggerElement = document.querySelector(`[data-target="${modal.id}"]`);
            if (triggerElement) {
                triggerElement.focus();
            }
        }
        
        this.announceUpdate('Modal closed. Focus restored.');
    }

    // Enhance tab navigation with better focus management
    enhanceTabNavigation() {
        document.addEventListener('focusin', (e) => {
            this.handleFocusChange(e);
        });
        
        // Add focus indicators
        this.addFocusIndicators();
    }

    // Handle focus change events
    handleFocusChange(event) {
        const focusedElement = event.target;
        
        // Update current context for screen readers
        this.updateCurrentContext(focusedElement);
        
        // Ensure focused element is visible
        this.ensureElementVisible(focusedElement);
        
        // Update navigation state
        this.updateNavigationState(focusedElement);
    }

    // Add visible focus indicators
    addFocusIndicators() {
        const focusStyle = document.createElement('style');
        focusStyle.textContent = `
            .focus-trap-active {
                outline: 2px solid var(--electric-blue, #00D4FF) !important;
                outline-offset: 2px !important;
            }
            
            *:focus-visible {
                outline: 2px solid var(--electric-blue, #00D4FF) !important;
                outline-offset: 2px !important;
                box-shadow: 0 0 0 4px rgba(0, 212, 255, 0.1) !important;
            }
            
            .metrics-card:focus,
            .metric-card:focus,
            .nav-tab:focus {
                transform: scale(1.02);
                background: var(--carbon-fiber, #1a1a2e);
                border-color: var(--electric-blue, #00D4FF);
            }
        `;
        
        document.head.appendChild(focusStyle);
    }

    // Set up screen reader support
    setupScreenReader() {
        // Add semantic structure to dashboard
        this.addSemanticStructure();
        
        // Set up metric announcements
        this.setupMetricAnnouncements();
        
        // Initialize campaign descriptions
        this.setupCampaignDescriptions();
        
        // Set up ROAS value speaking
        this.setupROASAnnouncements();
        
        console.log('🔊 Set up K2Motor Performance Parts screen reader support');
    }

    // Add semantic HTML structure for screen readers
    addSemanticStructure() {
        // Add main landmark
        const mainContent = document.querySelector('.dashboard-container, .main-content');
        if (mainContent && !mainContent.getAttribute('role')) {
            mainContent.setAttribute('role', 'main');
            mainContent.setAttribute('aria-label', 'K2Motor Performance Parts dashboard main content');
        }
        
        // Add navigation landmark
        const navigation = document.querySelector('.nav-section, .navigation');
        if (navigation && !navigation.getAttribute('role')) {
            navigation.setAttribute('role', 'navigation');
            navigation.setAttribute('aria-label', 'K2Motor Performance Parts dashboard navigation');
        }
        
        // Add region landmarks for major sections
        this.addRegionLandmarks();
        
        // Enhance heading structure
        this.enhanceHeadingStructure();
    }

    // Add region landmarks for dashboard sections
    addRegionLandmarks() {
        const sections = [
            { selector: '.metrics-section', label: 'Performance metrics overview' },
            { selector: '.campaigns-section', label: 'Campaign performance data' },
            { selector: '.budget-section', label: 'Budget allocation and spending' },
            { selector: '.attribution-section', label: 'Attribution analysis' },
            { selector: '.scenarios-section', label: 'Performance scenarios and recommendations' }
        ];
        
        sections.forEach(({ selector, label }) => {
            const section = document.querySelector(selector);
            if (section) {
                section.setAttribute('role', 'region');
                section.setAttribute('aria-label', `K2Motor Performance Parts ${label}`);
            }
        });
    }

    // Enhance heading structure for better navigation
    enhanceHeadingStructure() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        
        headings.forEach(heading => {
            if (!heading.id) {
                heading.id = this.generateHeadingId(heading.textContent);
            }
            
            // Add K2Motor context to headings
            if (!heading.textContent.includes('K2Motor')) {
                const originalText = heading.textContent;
                heading.setAttribute('aria-label', `K2Motor Performance Parts: ${originalText}`);
            }
        });
    }

    // Generate unique ID for headings
    generateHeadingId(text) {
        const cleanText = text.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
        return `k2motor-${cleanText}`;
    }

    // Set up metric value announcements
    setupMetricAnnouncements() {
        // Monitor metric value changes
        this.observeMetricChanges();
        
        // Set up periodic announcements for important metrics
        this.setupPeriodicAnnouncements();
    }

    // Observe metric value changes using MutationObserver
    observeMetricChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    const target = mutation.target.closest('.metric-value, .metrics-card, .metric-card');
                    if (target) {
                        this.announceMetricChange(target);
                    }
                }
            });
        });
        
        // Observe all metric containers
        document.querySelectorAll('.metrics-section, .metric-card, .metrics-card').forEach(container => {
            observer.observe(container, {
                childList: true,
                subtree: true,
                characterData: true
            });
        });
    }

    // Announce metric value changes
    announceMetricChange(metricElement) {
        const title = metricElement.querySelector('.metric-title, h3, h2')?.textContent || 'Metric';
        const value = metricElement.querySelector('.metric-value, .value')?.textContent || '';
        const change = metricElement.querySelector('.metric-change, .change')?.textContent || '';
        
        let announcement = `K2Motor Performance Parts ${title} updated`;
        if (value) announcement += ` to ${this.formatValueForSpeech(value)}`;
        if (change) announcement += `, ${this.formatChangeForSpeech(change)}`;
        
        this.announceUpdate(announcement, 'polite');
    }

    // Format values for speech synthesis
    formatValueForSpeech(value) {
        // Handle ROAS values
        if (value.includes('x')) {
            return value.replace('x', ' times return on ad spend');
        }
        
        // Handle percentages
        if (value.includes('%')) {
            return value.replace('%', ' percent');
        }
        
        // Handle currency
        if (value.includes('$')) {
            const numericValue = parseFloat(value.replace(/[^\d.-]/g, ''));
            if (numericValue >= 1000000) {
                return `${(numericValue / 1000000).toFixed(1)} million dollars`;
            } else if (numericValue >= 1000) {
                return `${(numericValue / 1000).toFixed(1)} thousand dollars`;
            }
            return `${numericValue} dollars`;
        }
        
        return value;
    }

    // Format change indicators for speech
    formatChangeForSpeech(change) {
        if (change.includes('↑') || change.includes('+')) {
            return `increased by ${change.replace(/[↑+]/g, '')}`;
        } else if (change.includes('↓') || change.includes('-')) {
            return `decreased by ${change.replace(/[↓-]/g, '')}`;
        }
        return change;
    }

    // Set up campaign descriptions for screen readers
    setupCampaignDescriptions() {
        const campaigns = document.querySelectorAll('.campaign-card, .campaign-item');
        
        campaigns.forEach(campaign => {
            const description = this.generateCampaignDescription(campaign);
            campaign.setAttribute('aria-describedby', this.createDescriptionElement(description));
        });
    }

    // Generate detailed campaign description
    generateCampaignDescription(campaign) {
        const brand = campaign.querySelector('.campaign-brand, .brand')?.textContent || 'Unknown brand';
        const type = campaign.querySelector('.campaign-type, .type')?.textContent || 'performance parts';
        const roas = campaign.querySelector('.roas-value, .roas')?.textContent || '';
        const spend = campaign.querySelector('.spend-value, .spend')?.textContent || '';
        
        let description = `K2Motor Performance Parts campaign for ${brand} ${type}`;
        if (roas) description += `, return on ad spend: ${this.formatValueForSpeech(roas)}`;
        if (spend) description += `, total spend: ${this.formatValueForSpeech(spend)}`;
        
        return description;
    }

    // Create hidden description element
    createDescriptionElement(description) {
        const id = `desc-${Math.random().toString(36).substr(2, 9)}`;
        const descElement = document.createElement('div');
        descElement.id = id;
        descElement.className = 'screen-reader-only';
        descElement.textContent = description;
        descElement.style.cssText = `
            position: absolute !important;
            left: -10000px !important;
            width: 1px !important;
            height: 1px !important;
            overflow: hidden !important;
        `;
        
        document.body.appendChild(descElement);
        return id;
    }

    // Set up ROAS value announcements
    setupROASAnnouncements() {
        document.addEventListener('click', (e) => {
            const roasElement = e.target.closest('[data-metric="roas"], .roas-value');
            if (roasElement) {
                this.speakROASValue(roasElement);
            }
        });
    }

    // Speak ROAS value with context
    speakROASValue(element) {
        const value = element.textContent.trim();
        const campaign = element.closest('.campaign-card, .metric-card');
        const brand = campaign?.querySelector('.brand, .campaign-brand')?.textContent || '';
        
        let announcement = `K2Motor Performance Parts return on ad spend`;
        if (brand) announcement += ` for ${brand}`;
        announcement += `: ${this.formatValueForSpeech(value)}`;
        
        // Add performance context
        const numericValue = parseFloat(value.replace(/[^\d.-]/g, ''));
        if (numericValue >= 3.0) {
            announcement += '. Excellent performance.';
        } else if (numericValue >= 2.0) {
            announcement += '. Good performance.';
        } else if (numericValue >= 1.0) {
            announcement += '. Break-even performance.';
        } else {
            announcement += '. Below break-even performance.';
        }
        
        this.announceUpdate(announcement, 'assertive');
    }

    // Describe campaign metrics in detail
    describeCampaignMetrics(campaign) {
        const metrics = {
            brand: campaign.querySelector('.brand, .campaign-brand')?.textContent || '',
            roas: campaign.querySelector('.roas-value, .roas')?.textContent || '',
            spend: campaign.querySelector('.spend-value, .spend')?.textContent || '',
            clicks: campaign.querySelector('.clicks-value, .clicks')?.textContent || '',
            conversions: campaign.querySelector('.conversions-value, .conversions')?.textContent || ''
        };
        
        let description = `K2Motor Performance Parts automotive performance metrics`;
        if (metrics.brand) description += ` for ${metrics.brand}`;
        description += ':';
        
        if (metrics.roas) description += ` Return on ad spend: ${this.formatValueForSpeech(metrics.roas)}.`;
        if (metrics.spend) description += ` Total spend: ${this.formatValueForSpeech(metrics.spend)}.`;
        if (metrics.clicks) description += ` Clicks: ${metrics.clicks}.`;
        if (metrics.conversions) description += ` Conversions: ${metrics.conversions}.`;
        
        return description;
    }

    // Set up focus management
    setupFocusManagement() {
        // Handle modal focus trapping
        this.setupModalFocusManagement();
        
        // Set up tab panel focus management
        this.setupTabPanelFocus();
        
        // Initialize dropdown focus management
        this.setupDropdownFocus();
    }

    // Set up modal focus management
    setupModalFocusManagement() {
        document.addEventListener('click', (e) => {
            const modalTrigger = e.target.closest('[data-toggle="modal"], [data-target^="#"]');
            if (modalTrigger) {
                const targetId = modalTrigger.dataset.target?.substring(1) || modalTrigger.dataset.toggle;
                const modal = document.getElementById(targetId);
                if (modal) {
                    this.openModal(modal, modalTrigger);
                }
            }
        });
    }

    // Set up dropdown focus management with aria-expanded
    setupDropdownFocus() {
        // Handle dropdown toggles with aria-expanded
        document.addEventListener('click', (e) => {
            const dropdown = e.target.closest('.dropdown-toggle, [data-toggle="dropdown"]');
            if (dropdown) {
                this.toggleDropdown(dropdown);
            }
        });
        
        // Set up expandable sections
        this.setupExpandableSections();
        
        // Initialize all dropdowns with proper ARIA
        document.querySelectorAll('.dropdown-toggle, [data-toggle="dropdown"]').forEach(toggle => {
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-haspopup', 'true');
            
            const targetId = toggle.dataset.target || toggle.getAttribute('aria-controls');
            if (targetId) {
                toggle.setAttribute('aria-controls', targetId);
            }
        });
    }

    // Toggle dropdown with aria-expanded
    toggleDropdown(toggle) {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        const targetId = toggle.dataset.target || toggle.getAttribute('aria-controls');
        const dropdown = targetId ? document.getElementById(targetId) : toggle.nextElementSibling;
        
        // Update aria-expanded
        toggle.setAttribute('aria-expanded', (!isExpanded).toString());
        
        // Update dropdown visibility
        if (dropdown) {
            dropdown.style.display = isExpanded ? 'none' : 'block';
            dropdown.setAttribute('aria-hidden', isExpanded.toString());
            
            if (!isExpanded) {
                // Focus first focusable element in dropdown
                const firstFocusable = this.getFocusableElements(dropdown)[0];
                if (firstFocusable) {
                    setTimeout(() => firstFocusable.focus(), 100);
                }
            }
        }
        
        // Announce state change
        const dropdownName = toggle.textContent.trim() || 'dropdown';
        this.announceUpdate(`K2Motor Performance Parts ${dropdownName} ${isExpanded ? 'collapsed' : 'expanded'}`, 'polite');
    }

    // Set up expandable sections
    setupExpandableSections() {
        // Handle collapsible sections
        document.addEventListener('click', (e) => {
            const expandable = e.target.closest('[data-toggle="collapse"], .expand-toggle');
            if (expandable) {
                this.toggleExpandableSection(expandable);
            }
        });
        
        // Initialize expandable sections
        document.querySelectorAll('[data-toggle="collapse"], .expand-toggle').forEach(toggle => {
            const targetId = toggle.dataset.target || toggle.getAttribute('aria-controls');
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            
            toggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
            
            if (targetId) {
                toggle.setAttribute('aria-controls', targetId);
                const target = document.getElementById(targetId);
                if (target) {
                    target.setAttribute('aria-hidden', isExpanded ? 'false' : 'true');
                }
            }
        });
    }

    // Toggle expandable section
    toggleExpandableSection(toggle) {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        const targetId = toggle.dataset.target || toggle.getAttribute('aria-controls');
        const section = targetId ? document.getElementById(targetId) : toggle.nextElementSibling;
        
        // Update aria-expanded
        toggle.setAttribute('aria-expanded', (!isExpanded).toString());
        
        // Update section visibility
        if (section) {
            section.setAttribute('aria-hidden', isExpanded.toString());
            
            if (isExpanded) {
                section.style.maxHeight = '0';
                section.style.overflow = 'hidden';
            } else {
                section.style.maxHeight = section.scrollHeight + 'px';
                section.style.overflow = 'visible';
            }
        }
        
        // Announce state change
        const sectionName = toggle.textContent.trim() || 'section';
        this.announceUpdate(`K2Motor Performance Parts ${sectionName} ${isExpanded ? 'collapsed' : 'expanded'}`, 'polite');
    }

    // Set up tab panel focus management
    setupTabPanelFocus() {
        document.addEventListener('click', (e) => {
            const tab = e.target.closest('[role="tab"]');
            if (tab) {
                this.activateTab(tab);
            }
        });
        
        // Initialize tab panels with proper ARIA
        document.querySelectorAll('[role="tab"]').forEach(tab => {
            const controls = tab.getAttribute('aria-controls');
            const isSelected = tab.getAttribute('aria-selected') === 'true';
            
            tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
            tab.setAttribute('tabindex', isSelected ? '0' : '-1');
            
            if (controls) {
                const panel = document.getElementById(controls);
                if (panel) {
                    panel.setAttribute('aria-hidden', isSelected ? 'false' : 'true');
                    panel.setAttribute('role', 'tabpanel');
                    panel.setAttribute('aria-labelledby', tab.id);
                }
            }
        });
    }

    // Activate tab with proper ARIA updates
    activateTab(activeTab) {
        const tabList = activeTab.closest('[role="tablist"]');
        if (!tabList) return;
        
        const allTabs = tabList.querySelectorAll('[role="tab"]');
        const activePanel = document.getElementById(activeTab.getAttribute('aria-controls'));
        
        // Update all tabs
        allTabs.forEach(tab => {
            const isActive = tab === activeTab;
            const panel = document.getElementById(tab.getAttribute('aria-controls'));
            
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
            tab.setAttribute('tabindex', isActive ? '0' : '-1');
            
            if (panel) {
                panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
            }
        });
        
        // Focus active tab
        activeTab.focus();
        
        // Announce tab change
        this.announceTabChange(activeTab);
    }

    // Open modal with proper accessibility
    openModal(modal, trigger) {
        // Store trigger for focus restoration
        modal.dataset.trigger = trigger.id || 'modal-trigger';
        
        // Add to focus trap stack
        this.focusTrapStack.push(modal);
        
        // Set ARIA attributes
        modal.setAttribute('aria-hidden', 'false');
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        
        // Focus first focusable element
        const firstFocusable = this.getFocusableElements(modal)[0];
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 100);
        }
        
        // Announce modal opening
        const modalTitle = modal.querySelector('h1, h2, h3, .modal-title')?.textContent || 'Modal';
        this.announceUpdate(`${modalTitle} dialog opened`, 'assertive');
    }

    // Set up color contrast checking
    setupColorContrastChecking() {
        // Add high contrast mode toggle
        this.addHighContrastToggle();
        
        // Check existing color contrasts
        this.checkExistingContrasts();
        
        // Monitor for contrast preference changes
        this.monitorContrastPreferences();
    }

    // Add high contrast mode toggle
    addHighContrastToggle() {
        const contrastToggle = document.createElement('button');
        contrastToggle.id = 'high-contrast-toggle';
        contrastToggle.className = 'accessibility-toggle high-contrast-toggle';
        contrastToggle.innerHTML = '🔲 High Contrast';
        contrastToggle.setAttribute('aria-label', 'Toggle high contrast mode for K2Motor Performance Parts dashboard');
        contrastToggle.setAttribute('aria-pressed', 'false');
        
        contrastToggle.addEventListener('click', () => {
            this.toggleHighContrastMode();
        });
        
        // Add to page (after other nav controls)
        const navControls = document.querySelector('.nav-controls, .dashboard-controls');
        if (navControls) {
            navControls.appendChild(contrastToggle);
        }
    }

    // Toggle high contrast mode
    toggleHighContrastMode() {
        const isHighContrast = document.body.classList.contains('high-contrast-mode');
        
        if (isHighContrast) {
            document.body.classList.remove('high-contrast-mode');
            this.contrastMode = 'normal';
            this.announceUpdate('K2Motor Performance Parts high contrast mode disabled');
        } else {
            document.body.classList.add('high-contrast-mode');
            this.contrastMode = 'high';
            this.announceUpdate('K2Motor Performance Parts high contrast mode enabled');
        }
        
        // Update toggle button
        const toggle = document.getElementById('high-contrast-toggle');
        toggle.setAttribute('aria-pressed', (!isHighContrast).toString());
        
        // Apply high contrast styles
        this.applyHighContrastStyles();
    }

    // Apply high contrast styles
    applyHighContrastStyles() {
        if (this.contrastMode === 'high') {
            const highContrastCSS = `
                .high-contrast-mode * {
                    background: black !important;
                    color: white !important;
                    border-color: white !important;
                }
                
                .high-contrast-mode button,
                .high-contrast-mode .btn {
                    background: white !important;
                    color: black !important;
                    border: 2px solid white !important;
                }
                
                .high-contrast-mode button:focus,
                .high-contrast-mode *:focus {
                    outline: 3px solid yellow !important;
                    outline-offset: 2px !important;
                }
                
                .high-contrast-mode .metrics-card,
                .high-contrast-mode .campaign-card {
                    border: 2px solid white !important;
                }
            `;
            
            let highContrastStyle = document.getElementById('high-contrast-styles');
            if (!highContrastStyle) {
                highContrastStyle = document.createElement('style');
                highContrastStyle.id = 'high-contrast-styles';
                document.head.appendChild(highContrastStyle);
            }
            highContrastStyle.textContent = highContrastCSS;
        } else {
            const highContrastStyle = document.getElementById('high-contrast-styles');
            if (highContrastStyle) {
                highContrastStyle.remove();
            }
        }
    }

    // Check color contrast ratios
    checkColorContrast(foreground, background) {
        // Convert colors to RGB if needed
        const fgRGB = this.colorToRGB(foreground);
        const bgRGB = this.colorToRGB(background);
        
        if (!fgRGB || !bgRGB) return null;
        
        // Calculate relative luminance
        const fgLuminance = this.getRelativeLuminance(fgRGB);
        const bgLuminance = this.getRelativeLuminance(bgRGB);
        
        // Calculate contrast-ratio for WCAG compliance
        const lighter = Math.max(fgLuminance, bgLuminance);
        const darker = Math.min(fgLuminance, bgLuminance);
        const contrastRatio = (lighter + 0.05) / (darker + 0.05);
        
        return {
            ratio: contrastRatio,
            aa: contrastRatio >= this.contrastRatios.normal,
            aaLarge: contrastRatio >= this.contrastRatios.large,
            aaa: contrastRatio >= this.contrastRatios.enhanced
        };
    }

    // Convert color to RGB values
    colorToRGB(color) {
        // Handle hex colors
        if (color.startsWith('#')) {
            const hex = color.slice(1);
            return {
                r: parseInt(hex.substr(0, 2), 16),
                g: parseInt(hex.substr(2, 2), 16),
                b: parseInt(hex.substr(4, 2), 16)
            };
        }
        
        // Handle rgb() colors
        const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgbMatch) {
            return {
                r: parseInt(rgbMatch[1]),
                g: parseInt(rgbMatch[2]),
                b: parseInt(rgbMatch[3])
            };
        }
        
        return null;
    }

    // Calculate relative luminance
    getRelativeLuminance(rgb) {
        const { r, g, b } = rgb;
        
        const sRGB = [r, g, b].map(value => {
            value = value / 255;
            return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
        });
        
        return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
    }

    // Check existing color contrasts on page
    checkExistingContrasts() {
        const elements = document.querySelectorAll('.metrics-card, .campaign-card, button, .btn');
        
        elements.forEach(element => {
            const styles = getComputedStyle(element);
            const foreground = styles.color;
            const background = styles.backgroundColor;
            
            const contrast = this.checkColorContrast(foreground, background);
            if (contrast && !contrast.aa) {
                console.warn(`K2Motor A11y: Low contrast detected on element:`, element, `Ratio: ${contrast.ratio.toFixed(2)}`);
            }
        });
    }

    // Monitor for system contrast preferences
    monitorContrastPreferences() {
        if (window.matchMedia) {
            const contrastQuery = window.matchMedia('(prefers-contrast: high)');
            
            contrastQuery.addEventListener('change', (e) => {
                if (e.matches && this.contrastMode !== 'high') {
                    this.toggleHighContrastMode();
                }
            });
            
            // Check initial preference
            if (contrastQuery.matches) {
                setTimeout(() => this.toggleHighContrastMode(), 100);
            }
        }
    }

    // Set up motor sports specific accessibility features
    setupMotorSportsAccessibility() {
        // Add automotive performance context to metrics
        this.addAutomotiveContext();
        
        // Set up racing terminology explanations
        this.setupRacingTerminologyHelp();
        
        // Initialize performance parts glossary
        this.initializePerformancePartsGlossary();
        
        console.log('🏎️ Set up K2Motor Performance Parts automotive accessibility features');
    }

    // Add automotive performance context
    addAutomotiveContext() {
        // Add context to ROAS metrics
        const roasElements = document.querySelectorAll('[data-metric="roas"], .roas-value');
        roasElements.forEach(element => {
            const currentLabel = element.getAttribute('aria-label') || element.textContent;
            element.setAttribute('aria-label', `K2Motor Performance Parts return on ad spend: ${currentLabel}. This measures revenue generated per dollar spent on automotive performance parts advertising.`);
        });
        
        // Add context to campaign metrics
        const campaigns = document.querySelectorAll('.campaign-card');
        campaigns.forEach(campaign => {
            const brand = campaign.querySelector('.brand')?.textContent || 'automotive brand';
            campaign.setAttribute('aria-label', `${brand} performance parts advertising campaign metrics for K2Motor Performance Parts dashboard`);
        });
    }

    // Set up racing terminology help
    setupRacingTerminologyHelp() {
        const terminology = {
            'ROAS': 'Return on Ad Spend - measures revenue generated per dollar spent on advertising',
            'POAS': 'Profit on Ad Spend - measures profit generated per dollar spent on advertising',
            'Attribution': 'Credit assignment for conversions across different marketing touchpoints',
            'Incremental Lift': 'Additional conversions generated by advertising that would not have occurred otherwise'
        };
        
        Object.keys(terminology).forEach(term => {
            const elements = document.querySelectorAll(`[data-term="${term.toLowerCase()}"], .${term.toLowerCase()}-term`);
            elements.forEach(element => {
                element.setAttribute('aria-describedby', this.createTerminologyDescription(term, terminology[term]));
                element.setAttribute('role', 'definition');
            });
        });
    }

    // Create terminology description
    createTerminologyDescription(term, definition) {
        const id = `k2motor-term-${term.toLowerCase()}`;
        const existing = document.getElementById(id);
        if (existing) return id;
        
        const descElement = document.createElement('div');
        descElement.id = id;
        descElement.className = 'screen-reader-only';
        descElement.textContent = `K2Motor Performance Parts definition: ${definition}`;
        descElement.style.cssText = `
            position: absolute !important;
            left: -10000px !important;
            width: 1px !important;
            height: 1px !important;
            overflow: hidden !important;
        `;
        
        document.body.appendChild(descElement);
        return id;
    }

    // Initialize performance parts glossary
    initializePerformancePartsGlossary() {
        const glossaryTerms = {
            'Honda': 'Japanese automotive manufacturer known for reliable performance parts and modifications',
            'Toyota': 'Japanese automotive manufacturer with extensive aftermarket performance parts ecosystem',
            'Subaru': 'Japanese automotive manufacturer famous for all-wheel drive performance vehicles',
            'BMW': 'German luxury automotive manufacturer with premium performance parts and tuning options'
        };
        
        Object.keys(glossaryTerms).forEach(brand => {
            const elements = document.querySelectorAll(`[data-brand="${brand}"], .${brand.toLowerCase()}-brand`);
            elements.forEach(element => {
                const description = `${glossaryTerms[brand]}. Performance parts data for K2Motor Performance Parts advertising dashboard.`;
                element.setAttribute('aria-describedby', this.createDescriptionElement(description));
            });
        });
    }

    // Set up accessibility keyboard shortcuts
    setupAccessibilityShortcuts() {
        this.keyboardShortcuts.set('Alt+1', () => this.focusMainContent());
        this.keyboardShortcuts.set('Alt+2', () => this.focusNavigation());
        this.keyboardShortcuts.set('Alt+3', () => this.focusMetrics());
        this.keyboardShortcuts.set('Alt+4', () => this.focusCampaigns());
        this.keyboardShortcuts.set('Alt+C', () => this.toggleHighContrastMode());
        this.keyboardShortcuts.set('Alt+H', () => this.showKeyboardHelp());
        
        document.addEventListener('keydown', (e) => {
            const shortcut = this.getKeyboardShortcut(e);
            const handler = this.keyboardShortcuts.get(shortcut);
            if (handler) {
                e.preventDefault();
                handler();
            }
        });
    }

    // Get keyboard shortcut string from event
    getKeyboardShortcut(event) {
        const parts = [];
        if (event.ctrlKey) parts.push('Ctrl');
        if (event.altKey) parts.push('Alt');
        if (event.shiftKey) parts.push('Shift');
        if (event.metaKey) parts.push('Cmd');
        parts.push(event.key);
        return parts.join('+');
    }

    // Focus main content area
    focusMainContent() {
        const main = document.querySelector('[role="main"], .dashboard-container');
        if (main) {
            main.focus();
            this.announceUpdate('Focused on K2Motor Performance Parts main dashboard content');
        }
    }

    // Focus navigation area
    focusNavigation() {
        const nav = document.querySelector('[role="navigation"], .nav-section');
        if (nav) {
            const firstTab = nav.querySelector('.nav-tab');
            if (firstTab) {
                firstTab.focus();
                this.announceUpdate('Focused on K2Motor Performance Parts navigation');
            }
        }
    }

    // Focus metrics section
    focusMetrics() {
        const metrics = document.querySelector('.metrics-section, .metrics-grid');
        if (metrics) {
            const firstMetric = metrics.querySelector('.metrics-card, .metric-card');
            if (firstMetric) {
                firstMetric.focus();
                this.announceUpdate('Focused on K2Motor Performance Parts metrics section');
            }
        }
    }

    // Focus campaigns section
    focusCampaigns() {
        const campaigns = document.querySelector('.campaigns-section, .campaign-grid');
        if (campaigns) {
            const firstCampaign = campaigns.querySelector('.campaign-card');
            if (firstCampaign) {
                firstCampaign.focus();
                this.announceUpdate('Focused on K2Motor Performance Parts campaigns section');
            }
        }
    }

    // Show keyboard help
    showKeyboardHelp() {
        const helpContent = `
            K2Motor Performance Parts Dashboard Keyboard Shortcuts:
            Alt+1: Focus main content
            Alt+2: Focus navigation
            Alt+3: Focus metrics
            Alt+4: Focus campaigns
            Alt+C: Toggle high contrast
            Alt+H: Show this help
            Arrow keys: Navigate between cards
            Enter/Space: Activate focused element
            Escape: Close modals
            Tab: Move to next element
            Shift+Tab: Move to previous element
        `;
        
        this.announceUpdate(helpContent, 'assertive');
    }

    // Detect and respond to user preferences
    detectUserPreferences() {
        // Check for reduced motion preference
        if (window.matchMedia) {
            const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            this.motionPreference = motionQuery.matches ? 'reduced' : 'normal';
            
            motionQuery.addEventListener('change', (e) => {
                this.motionPreference = e.matches ? 'reduced' : 'normal';
                this.announceUpdate(`K2Motor Performance Parts motion preference updated to ${this.motionPreference}`);
            });
        }
    }

    // Update current context for screen readers
    updateCurrentContext(element) {
        const newContext = {
            section: this.getCurrentSection(element),
            metric: this.getCurrentMetric(element),
            campaign: this.getCurrentCampaign(element),
            timestamp: Date.now()
        };
        
        // Check if context has meaningfully changed
        if (this.hasContextChanged(newContext)) {
            this.currentContext = newContext;
            this.announceContextChange(newContext);
        }
    }

    // Get current section from element
    getCurrentSection(element) {
        const section = element.closest('[role="region"], section');
        return section?.getAttribute('aria-label') || section?.querySelector('h1, h2')?.textContent || null;
    }

    // Get current metric from element
    getCurrentMetric(element) {
        const metric = element.closest('.metric-card, .metrics-card');
        return metric?.querySelector('.metric-title, h3')?.textContent || null;
    }

    // Get current campaign from element
    getCurrentCampaign(element) {
        const campaign = element.closest('.campaign-card');
        return campaign?.querySelector('.brand, .campaign-brand')?.textContent || null;
    }

    // Check if context has meaningfully changed
    hasContextChanged(newContext) {
        return newContext.section !== this.currentContext.section ||
               newContext.metric !== this.currentContext.metric ||
               newContext.campaign !== this.currentContext.campaign;
    }

    // Announce context change
    announceContextChange(context) {
        let announcement = 'K2Motor Performance Parts dashboard context: ';
        
        if (context.section) announcement += context.section;
        if (context.metric) announcement += `, ${context.metric} metric`;
        if (context.campaign) announcement += `, ${context.campaign} campaign`;
        
        this.announceUpdate(announcement, 'polite');
    }

    // Ensure focused element is visible
    ensureElementVisible(element) {
        // Scroll into view if needed
        if (element.scrollIntoView) {
            element.scrollIntoView({
                behavior: this.motionPreference === 'reduced' ? 'auto' : 'smooth',
                block: 'nearest',
                inline: 'nearest'
            });
        }
    }

    // Update navigation state
    updateNavigationState(element) {
        // Update focus trap if in modal
        if (element.closest('.modal, .overlay')) {
            const modal = element.closest('.modal, .overlay');
            if (!this.focusTrapStack.includes(modal)) {
                this.focusTrapStack.push(modal);
            }
        }
    }

    // Announce metric focus
    announceMetricFocus(card) {
        const label = this.generateMetricCardLabel(card);
        const position = this.focusableElements.indexOf(card) + 1;
        const total = this.focusableElements.length;
        
        this.announceUpdate(`${label}. ${position} of ${total}`, 'polite');
    }

    // Announce tab change
    announceTabChange(tab) {
        const tabName = tab.textContent.trim();
        this.announceUpdate(`K2Motor Performance Parts ${tabName} tab selected`, 'polite');
    }

    // Update current focus tracking
    updateCurrentFocus(element) {
        const index = this.focusableElements.indexOf(element);
        if (index > -1) {
            this.currentFocusIndex = index;
        }
    }

    // Announce updates to screen readers
    announceUpdate(message, priority = 'polite') {
        const liveRegion = this.liveRegions[priority] || this.liveRegions.polite;
        if (liveRegion) {
            // Clear previous announcement
            liveRegion.textContent = '';
            
            // Add new announcement after brief delay
            setTimeout(() => {
                liveRegion.textContent = message;
                this.screenReaderAnnouncements.push({
                    message,
                    priority,
                    timestamp: Date.now()
                });
            }, 50);
        }
    }

    // Set up periodic announcements for important updates
    setupPeriodicAnnouncements() {
        // Announce important metric changes every 30 seconds if any
        setInterval(() => {
            this.announceImportantChanges();
        }, 30000);
    }

    // Announce important metric changes
    announceImportantChanges() {
        const criticalElements = document.querySelectorAll('.scenario-alert.critical, .alert-critical');
        if (criticalElements.length > 0) {
            this.announceUpdate(`K2Motor Performance Parts dashboard has ${criticalElements.length} critical alerts requiring attention`, 'assertive');
        }
    }

    // Get accessibility status and statistics
    getAccessibilityStats() {
        return {
            initialized: this.isInitialized,
            contrastMode: this.contrastMode,
            motionPreference: this.motionPreference,
            focusTrapsActive: this.focusTrapStack.length,
            screenReaderAnnouncements: this.screenReaderAnnouncements.length,
            keyboardShortcuts: this.keyboardShortcuts.size,
            focusableElements: this.focusableElements.length,
            currentContext: this.currentContext
        };
    }
}

// Initialize accessibility manager
const accessibilityManager = new AccessibilityManager();

// Auto-start when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    accessibilityManager.initializeA11yFeatures();
    console.log('♿ K2Motor Performance Parts accessibility manager ready');
});

// Make globally available
window.accessibilityManager = accessibilityManager;