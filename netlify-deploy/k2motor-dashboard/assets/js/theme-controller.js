// K2Motor Performance Parts - Theme Controller System
// Dark/light mode switching with racing theme variations and persistence

class ThemeController {
    constructor() {
        this.isInitialized = false;
        this.currentTheme = 'racing-dark-theme'; // Default theme
        this.systemPreference = null;
        this.userPreference = null;
        this.themeTransitionDuration = 300; // ms
        
        // Available theme variants for K2Motor Performance Parts
        this.availableThemes = {
            'racing-dark-theme': {
                name: 'Racing Dark',
                description: 'High-performance dark theme with neon accents',
                primary: '#FF6B35', // Racing orange
                secondary: '#00D4FF', // Electric blue
                background: '#0F0F23', // Deep dark
                surface: '#1a1a2e', // Carbon fiber
                text: '#ffffff',
                textSecondary: '#cccccc',
                accent: '#39FF14', // Neon green
                danger: '#FF073A',
                warning: '#FFD700',
                isDark: true
            },
            'racing-light-theme': {
                name: 'Racing Light',
                description: 'Clean light theme with performance styling',
                primary: '#FF6B35', // Racing orange
                secondary: '#0066CC', // Darker blue for better contrast
                background: '#ffffff',
                surface: '#f8f9fa',
                text: '#1a1a2e',
                textSecondary: '#6c757d',
                accent: '#28a745',
                danger: '#dc3545',
                warning: '#ffc107',
                isDark: false
            },
            'auto-theme': {
                name: 'Auto',
                description: 'Follows system preference',
                followsSystem: true
            },
            'high-contrast-theme': {
                name: 'High Contrast',
                description: 'Maximum contrast for accessibility',
                primary: '#000000',
                secondary: '#ffffff',
                background: '#000000',
                surface: '#ffffff',
                text: '#ffffff',
                textSecondary: '#ffffff',
                accent: '#ffff00',
                danger: '#ff0000',
                warning: '#ffff00',
                isDark: true,
                isHighContrast: true
            }
        };
        
        // Theme transition configuration
        this.transitionElements = [
            'background-color',
            'color',
            'border-color',
            'box-shadow',
            'fill',
            'stroke'
        ];
    }

    // Initialize theme system
    initializeThemeSystem() {
        console.log('🎯 Initializing K2Motor Performance Parts theme system...');
        
        // Detect system theme preference
        this.detectSystemTheme();
        
        // Load saved user preference
        this.loadThemePreference();
        
        // Set up theme toggle controls
        this.setupThemeControls();
        
        // Set up system preference monitoring
        this.setupSystemPreferenceMonitoring();
        
        // Apply initial theme
        this.applyInitialTheme();
        
        // Set up smooth transitions
        this.setupThemeTransitions();
        
        this.isInitialized = true;
        console.log('✅ K2Motor Performance Parts theme system ready');
    }

    // Detect system color scheme preference
    detectSystemTheme() {
        if (window.matchMedia) {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            this.systemPreference = darkModeQuery.matches ? 'racing-dark-theme' : 'racing-light-theme';
            
            console.log(`🔍 Detected system theme preference: ${this.systemPreference}`);
        } else {
            this.systemPreference = 'racing-dark-theme'; // Fallback
        }
    }

    // Load saved theme preference from localStorage
    loadThemePreference() {
        try {
            const saved = localStorage.getItem('k2motor-theme-preference');
            if (saved) {
                const preference = JSON.parse(saved);
                if (this.availableThemes[preference.theme]) {
                    this.userPreference = preference.theme;
                    this.currentTheme = preference.theme;
                    console.log(`📂 Loaded saved theme preference: ${this.userPreference}`);
                    return;
                }
            }
        } catch (error) {
            console.warn('⚠️ Failed to load theme preference:', error);
        }
        
        // Default to auto-theme if no valid preference
        this.userPreference = 'auto-theme';
        this.currentTheme = this.systemPreference || 'racing-dark-theme';
    }

    // Save theme preference to localStorage
    saveThemePreference(theme) {
        try {
            const preference = {
                theme: theme,
                timestamp: new Date().toISOString(),
                version: '1.0'
            };
            localStorage.setItem('k2motor-theme-preference', JSON.stringify(preference));
            console.log(`💾 Saved theme preference: ${theme}`);
        } catch (error) {
            console.error('❌ Failed to save theme preference:', error);
        }
    }

    // Set up theme toggle controls
    setupThemeControls() {
        // Create theme toggle button if it doesn't exist
        this.createThemeToggleButton();
        
        // Bind theme toggle events
        this.bindThemeToggleEvents();
        
        // Create theme selector dropdown
        this.createThemeSelector();
        
        console.log('🎨 Set up K2Motor Performance Parts theme controls');
    }

    // Create theme toggle button
    createThemeToggleButton() {
        // Check if toggle already exists
        let toggleButton = document.querySelector('#theme-toggle');
        
        if (!toggleButton) {
            toggleButton = document.createElement('button');
            toggleButton.id = 'theme-toggle';
            toggleButton.className = 'theme-toggle-btn';
            toggleButton.setAttribute('aria-label', 'Toggle theme');
            toggleButton.setAttribute('title', 'Switch between light and dark themes');
            
            // Add to navigation controls
            const navControls = document.querySelector('.nav-controls');
            if (navControls) {
                navControls.insertBefore(toggleButton, navControls.firstChild);
            }
        }
        
        this.updateThemeToggleButton(toggleButton);
    }

    // Update theme toggle button appearance
    updateThemeToggleButton(button) {
        const currentThemeData = this.availableThemes[this.currentTheme];
        const isDark = currentThemeData?.isDark ?? true;
        
        // Update button content based on current theme
        button.innerHTML = isDark ? '☀️' : '🌙';
        button.title = isDark ? 'Switch to light theme' : 'Switch to dark theme';
        
        // Update button styling
        button.style.cssText = `
            background: ${currentThemeData?.surface || 'var(--carbon-fiber)'};
            border: 2px solid ${currentThemeData?.primary || 'var(--racing-orange)'};
            color: ${currentThemeData?.text || 'white'};
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1rem;
            transition: all ${this.themeTransitionDuration}ms ease;
            margin-right: 10px;
        `;
    }

    // Create theme selector dropdown
    createThemeSelector() {
        let selector = document.querySelector('#theme-selector');
        
        if (!selector) {
            const container = document.createElement('div');
            container.className = 'theme-selector-container';
            
            selector = document.createElement('select');
            selector.id = 'theme-selector';
            selector.className = 'theme-selector';
            selector.setAttribute('aria-label', 'Select theme');
            
            // Add theme options
            Object.entries(this.availableThemes).forEach(([key, theme]) => {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = theme.name;
                option.title = theme.description;
                selector.appendChild(option);
            });
            
            container.appendChild(selector);
            
            // Add to navigation controls
            const navControls = document.querySelector('.nav-controls');
            if (navControls) {
                navControls.appendChild(container);
            }
        }
        
        // Set current selection
        selector.value = this.currentTheme === this.systemPreference && this.userPreference === 'auto-theme' 
            ? 'auto-theme' 
            : this.currentTheme;
        
        this.updateThemeSelectorStyle(selector);
    }

    // Update theme selector styling
    updateThemeSelectorStyle(selector) {
        const currentThemeData = this.availableThemes[this.currentTheme];
        
        selector.style.cssText = `
            background: ${currentThemeData?.surface || 'var(--carbon-fiber)'};
            border: 1px solid ${currentThemeData?.primary || 'var(--racing-orange)'};
            color: ${currentThemeData?.text || 'white'};
            padding: 6px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all ${this.themeTransitionDuration}ms ease;
            margin-left: 10px;
        `;
    }

    // Bind theme toggle events
    bindThemeToggleEvents() {
        // Theme toggle button
        document.addEventListener('click', (e) => {
            if (e.target.closest('#theme-toggle')) {
                this.toggleTheme();
            }
        });
        
        // Theme selector dropdown
        document.addEventListener('change', (e) => {
            if (e.target.id === 'theme-selector') {
                this.setTheme(e.target.value);
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + T to toggle theme
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
        
        console.log('⌨️ Bound K2Motor Performance Parts theme toggle events');
    }

    // Set up system preference monitoring
    setupSystemPreferenceMonitoring() {
        if (window.matchMedia) {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            darkModeQuery.addEventListener('change', (e) => {
                const newSystemPreference = e.matches ? 'racing-dark-theme' : 'racing-light-theme';
                console.log(`🔄 System theme preference changed: ${newSystemPreference}`);
                
                this.systemPreference = newSystemPreference;
                
                // If user has auto-theme selected, update the current theme
                if (this.userPreference === 'auto-theme') {
                    this.currentTheme = newSystemPreference;
                    this.applyTheme(this.currentTheme);
                }
            });
        }
    }

    // Apply initial theme on page load
    applyInitialTheme() {
        let themeToApply = this.currentTheme;
        
        // Handle auto-theme
        if (this.userPreference === 'auto-theme') {
            themeToApply = this.systemPreference;
        }
        
        this.applyTheme(themeToApply);
        console.log(`🎨 Applied initial K2Motor theme: ${themeToApply}`);
    }

    // Toggle between dark and light themes
    toggleTheme() {
        const currentThemeData = this.availableThemes[this.currentTheme];
        
        let newTheme;
        if (currentThemeData?.isDark) {
            newTheme = 'racing-light-theme';
        } else {
            newTheme = 'racing-dark-theme';
        }
        
        this.setTheme(newTheme);
        console.log(`🔄 Toggled K2Motor theme: ${this.currentTheme} → ${newTheme}`);
    }

    // Set specific theme
    setTheme(themeName) {
        if (!this.availableThemes[themeName]) {
            console.warn(`⚠️ Theme not found: ${themeName}`);
            return;
        }
        
        // Handle auto-theme
        if (themeName === 'auto-theme') {
            this.userPreference = 'auto-theme';
            this.currentTheme = this.systemPreference;
            this.saveThemePreference('auto-theme');
        } else {
            this.userPreference = themeName;
            this.currentTheme = themeName;
            this.saveThemePreference(themeName);
        }
        
        // Apply the theme
        this.applyTheme(this.currentTheme);
        
        // Update controls
        this.updateThemeControls();
        
        console.log(`🎨 Set K2Motor Performance Parts theme: ${themeName}`);
    }

    // Apply theme to the document
    applyTheme(themeName) {
        const theme = this.availableThemes[themeName];
        if (!theme) return;
        
        const root = document.documentElement;
        
        // Set CSS custom properties
        if (!theme.followsSystem) {
            Object.entries(theme).forEach(([key, value]) => {
                if (typeof value === 'string' && key !== 'name' && key !== 'description') {
                    root.style.setProperty(`--theme-${key}`, value);
                }
            });
            
            // Update K2Motor specific theme variables
            this.updateRacingThemeVariables(theme);
        }
        
        // Update body class for theme-specific styling
        this.updateBodyThemeClass(themeName);
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);
        
        // Announce theme change to screen readers
        this.announceThemeChange(theme);
    }

    // Update racing-specific theme variables
    updateRacingThemeVariables(theme) {
        const root = document.documentElement;
        
        // Map theme colors to existing K2Motor variables
        root.style.setProperty('--racing-orange', theme.primary);
        root.style.setProperty('--electric-blue', theme.secondary);
        root.style.setProperty('--dark-bg', theme.background);
        root.style.setProperty('--carbon-fiber', theme.surface);
        root.style.setProperty('--neon-green', theme.accent);
        root.style.setProperty('--danger-red', theme.danger);
        root.style.setProperty('--warning-yellow', theme.warning);
        
        // Neon accent colors for different themes
        const neonAccentColors = theme.isDark 
            ? `${theme.accent}, ${theme.secondary}, ${theme.primary}`
            : `${theme.primary}, ${theme.secondary}, ${theme.accent}`;
        root.style.setProperty('--neon-accent-colors', neonAccentColors);
        
        // Carbon texture variants
        const carbonTextureVariants = theme.isDark 
            ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
            : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)';
        root.style.setProperty('--carbon-texture-variants', carbonTextureVariants);
    }

    // Update body theme class
    updateBodyThemeClass(themeName) {
        const body = document.body;
        
        // Remove existing theme classes
        body.classList.remove('racing-dark-theme', 'racing-light-theme', 'high-contrast-theme', 'auto-theme');
        
        // Add current theme class
        body.classList.add(themeName);
        
        // Add theme type classes
        const theme = this.availableThemes[themeName];
        if (theme?.isDark) {
            body.classList.add('dark-theme');
            body.classList.remove('light-theme');
        } else {
            body.classList.add('light-theme');
            body.classList.remove('dark-theme');
        }
        
        if (theme?.isHighContrast) {
            body.classList.add('high-contrast');
        } else {
            body.classList.remove('high-contrast');
        }
    }

    // Update meta theme-color for mobile browsers
    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        metaThemeColor.content = theme.primary || '#FF6B35';
    }

    // Set up smooth theme transitions
    setupThemeTransitions() {
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                transition-duration: ${this.themeTransitionDuration}ms;
                transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
                color-interpolation: sRGB;
            }
            
            .theme-transition {
                transition-property: ${this.transitionElements.join(', ')};
            }
            
            /* Disable transitions during theme change for better performance */
            .theme-changing * {
                transition: none !important;
            }
        `;
        
        document.head.appendChild(style);
        console.log('✨ Set up K2Motor Performance Parts theme transitions');
    }

    // Update theme controls after theme change
    updateThemeControls() {
        const toggleButton = document.querySelector('#theme-toggle');
        const selector = document.querySelector('#theme-selector');
        
        if (toggleButton) {
            this.updateThemeToggleButton(toggleButton);
        }
        
        if (selector) {
            selector.value = this.userPreference === 'auto-theme' ? 'auto-theme' : this.currentTheme;
            this.updateThemeSelectorStyle(selector);
        }
    }

    // Announce theme change to screen readers
    announceThemeChange(theme) {
        // Create or update live region for screen reader announcements
        let announcement = document.querySelector('#theme-announcement');
        
        if (!announcement) {
            announcement = document.createElement('div');
            announcement.id = 'theme-announcement';
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.style.cssText = `
                position: absolute;
                left: -10000px;
                width: 1px;
                height: 1px;
                overflow: hidden;
            `;
            document.body.appendChild(announcement);
        }
        
        announcement.textContent = `K2Motor Performance Parts theme changed to ${theme.name}`;
        
        // Clear announcement after delay
        setTimeout(() => {
            announcement.textContent = '';
        }, 1000);
    }

    // Get current theme information
    getCurrentTheme() {
        return {
            current: this.currentTheme,
            user: this.userPreference,
            system: this.systemPreference,
            data: this.availableThemes[this.currentTheme],
            isInitialized: this.isInitialized
        };
    }

    // Get theme statistics
    getThemeStats() {
        return {
            availableThemes: Object.keys(this.availableThemes).length,
            currentTheme: this.currentTheme,
            userPreference: this.userPreference,
            systemPreference: this.systemPreference,
            isSystemSupported: !!window.matchMedia,
            transitionDuration: this.themeTransitionDuration,
            initialized: this.isInitialized
        };
    }

    // Force theme refresh (useful for debugging)
    refreshTheme() {
        this.detectSystemTheme();
        this.applyTheme(this.currentTheme);
        this.updateThemeControls();
        console.log('🔄 Refreshed K2Motor Performance Parts theme');
    }

    // Export theme configuration
    exportThemeConfig() {
        return {
            themes: this.availableThemes,
            current: this.getCurrentTheme(),
            stats: this.getThemeStats()
        };
    }
}

// Initialize theme controller
const themeController = new ThemeController();

// Auto-start when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    themeController.initializeThemeSystem();
    console.log('🎯 K2Motor Performance Parts theme controller ready');
});

// Add theme-specific CSS
const themeStyles = `
<style>
/* K2Motor Racing Theme System Styles */

/* Theme toggle button */
.theme-toggle-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    height: 40px;
    border-radius: 8px;
    font-size: 1.2rem;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.theme-toggle-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
}

.theme-toggle-btn:focus-visible {
    outline: 2px solid var(--electric-blue);
    outline-offset: 2px;
}

/* Theme selector dropdown */
.theme-selector-container {
    position: relative;
}

.theme-selector {
    min-width: 120px;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 16px;
    padding-right: 32px;
}

.theme-selector:hover {
    box-shadow: 0 2px 8px rgba(255, 107, 53, 0.2);
}

.theme-selector:focus-visible {
    outline: 2px solid var(--electric-blue);
    outline-offset: 2px;
}

/* Racing theme variants */
.racing-dark-theme {
    --primary-bg: #0F0F23;
    --secondary-bg: #1a1a2e;
    --primary-text: #ffffff;
    --secondary-text: #cccccc;
    --accent-color: #FF6B35;
    --highlight-color: #00D4FF;
}

.racing-light-theme {
    --primary-bg: #ffffff;
    --secondary-bg: #f8f9fa;
    --primary-text: #1a1a2e;
    --secondary-text: #6c757d;
    --accent-color: #FF6B35;
    --highlight-color: #0066CC;
}

.auto-theme {
    /* Inherits from system preference */
}

.high-contrast-theme {
    --primary-bg: #000000 !important;
    --secondary-bg: #ffffff !important;
    --primary-text: #ffffff !important;
    --secondary-text: #ffffff !important;
    --accent-color: #ffff00 !important;
    --highlight-color: #ffffff !important;
}

/* Theme-specific component styling */
.racing-dark-theme .dashboard-container {
    background: linear-gradient(135deg, #0F0F23 0%, #1a1a2e 100%);
    color: var(--primary-text);
}

.racing-light-theme .dashboard-container {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    color: var(--primary-text);
}

.high-contrast-theme .dashboard-container {
    background: var(--primary-bg) !important;
    color: var(--primary-text) !important;
    border: 2px solid var(--highlight-color) !important;
}

/* Smooth theme transitions */
.theme-transition {
    transition: background-color 0.3s ease, 
                color 0.3s ease, 
                border-color 0.3s ease, 
                box-shadow 0.3s ease;
}

/* Reduced motion support for theme changes */
@media (prefers-reduced-motion: reduce) {
    .theme-transition,
    .theme-toggle-btn,
    .theme-selector {
        transition: none !important;
    }
}

/* Focus management for keyboard navigation */
.theme-toggle-btn:focus,
.theme-selector:focus {
    z-index: 10;
}

/* Mobile optimizations */
@media (max-width: 768px) {
    .theme-selector-container {
        margin-left: 0;
        margin-top: 10px;
    }
    
    .theme-selector {
        width: 100%;
        min-width: auto;
    }
}

/* Print mode - force light theme */
@media print {
    * {
        background: white !important;
        color: black !important;
        border-color: black !important;
    }
}

/* Theme loading state */
.theme-loading * {
    transition: none !important;
}

/* High contrast mode enhancements */
@media (prefers-contrast: high) {
    .theme-toggle-btn,
    .theme-selector {
        border-width: 2px !important;
        font-weight: bold !important;
    }
}

/* Color scheme synchronization */
:root[data-theme="racing-dark-theme"] {
    color-scheme: dark;
}

:root[data-theme="racing-light-theme"] {
    color-scheme: light;
}

:root[data-theme="auto-theme"] {
    color-scheme: light dark;
}

/* CSS custom properties for theme consistency */
:root {
    --theme-transition-duration: 300ms;
    --theme-transition-timing: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Theme preview in selector */
.theme-selector option {
    padding: 8px 12px;
    background: var(--secondary-bg);
    color: var(--primary-text);
}

/* Accessibility improvements */
.theme-toggle-btn[aria-pressed="true"] {
    background: var(--accent-color);
    color: white;
}

/* Theme announcement for screen readers */
#theme-announcement {
    position: absolute !important;
    left: -10000px !important;
    width: 1px !important;
    height: 1px !important;
    overflow: hidden !important;
}
</style>
`;

// Inject theme styles
document.head.insertAdjacentHTML('beforeend', themeStyles);

// Make globally available
window.themeController = themeController;