// K2Motor Performance Parts - Guided Tour & Welcome Flow
// Interactive onboarding system for ad optimization dashboard demo

class GuidedTour {
    constructor() {
        this.currentStep = 0;
        this.totalSteps = 6;
        this.isActive = false;
        this.welcomeShown = false;
        
        // Tour steps configuration
        this.tourSteps = [
            {
                target: '.dashboard-header',
                title: 'Welcome to K2Motor Performance Parts',
                content: 'This is your comprehensive Ad Optimization Dashboard designed to maximize your sports car parts advertising ROI.',
                position: 'bottom'
            },
            {
                target: '.tab-navigation',
                title: 'Dashboard Overview',
                content: 'Navigate between four key sections: Performance Overview, Campaign Deep Dive, Budget Optimization, and Advanced Attribution.',
                position: 'below'
            },
            {
                target: '[data-tab="overview"]',
                title: 'Performance Overview',
                content: 'Monitor key metrics like ROAS, POAS, and scenario alerts to understand your K2Motor Performance Parts ad performance.',
                position: 'bottom'
            },
            {
                target: '.source-indicator',
                title: 'Data Sources',
                content: 'Color-coded indicators show data origin: 🟢 API Direct, 🟡 Calculated, 🔵 CSV Import, 🔴 One-time Setup.',
                position: 'left'
            },
            {
                target: '.scenario-alerts',
                title: 'Optimization Scenarios',
                content: 'AI-powered scenario detection identifies 10 advanced optimization opportunities for Performance Parts campaigns.',
                position: 'top'
            },
            {
                target: '.guided-tour-btn',
                title: 'Tour Complete!',
                content: 'You can restart this tour anytime. Start exploring your K2Motor Performance Parts optimization opportunities!',
                position: 'bottom'
            }
        ];
    }

    // Initialize welcome flow when dashboard loads
    initializeWelcomeFlow() {
        console.log('🎯 Initializing K2Motor Performance Parts welcome flow...');
        
        // Check if user has seen welcome before (localStorage)
        const hasSeenWelcome = localStorage.getItem('k2motor-welcome-shown');
        
        if (!hasSeenWelcome) {
            setTimeout(() => {
                this.showWelcomePopup();
            }, 1000); // Delay to let dashboard load
        }
        
        // Bind tour button
        this.bindTourButton();
    }

    // Show initial welcome popup
    showWelcomePopup() {
        console.log('👋 Showing K2Motor Performance Parts welcome popup...');
        
        const welcomeHTML = `
            <div class="popup-overlay welcome-overlay active">
                <div class="popup-content welcome-content">
                    <div class="popup-header">
                        <h3>🏎️ Welcome to K2Motor Performance Parts</h3>
                        <button class="close-btn" onclick="guidedTour.closeWelcome()">&times;</button>
                    </div>
                    <div class="popup-body">
                        <div class="welcome-intro">
                            <h4>🎯 Ad Optimization Dashboard</h4>
                            <p>Welcome to your comprehensive Performance Parts advertising optimization command center. This interactive demo showcases how we'll maximize your ad spend efficiency across all platforms.</p>
                            
                            <div class="welcome-features">
                                <div class="feature-item">
                                    <span class="feature-icon">📊</span>
                                    <div class="feature-text">
                                        <strong>Real-time Performance</strong>
                                        <span>Monitor ROAS, POAS, and campaign metrics across Amazon, eBay, Google, and Facebook</span>
                                    </div>
                                </div>
                                
                                <div class="feature-item">
                                    <span class="feature-icon">🎯</span>
                                    <div class="feature-text">
                                        <strong>optimization scenarios</strong>
                                        <span>AI-powered detection of Performance Parts specific optimization scenarios and opportunities</span>
                                    </div>
                                </div>
                                
                                <div class="feature-item">
                                    <span class="feature-icon">💰</span>
                                    <div class="feature-text">
                                        <strong>Budget Intelligence</strong>
                                        <span>Automated reallocation recommendations based on true profitability (POAS)</span>
                                    </div>
                                </div>
                                
                                <div class="feature-item">
                                    <span class="feature-icon">🧮</span>
                                    <div class="feature-text">
                                        <strong>Advanced Attribution</strong>
                                        <span>Honda vs Toyota cross-brand control group analysis for accurate incrementality</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="data-source-intro">
                                <h4>📋 data sources</h4>
                                <p>This dashboard overview uses realistic mock data structures that match actual API responses:</p>
                                <div class="data-indicators">
                                    <span class="data-badge api-direct">🟢 API Direct - Live platform data</span>
                                    <span class="data-badge calculated">🟡 Calculated - Derived metrics</span>
                                    <span class="data-badge csv-import">🔵 CSV Import - Manual uploads</span>
                                    <span class="data-badge setup">🔴 One-time Setup - Configuration</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="welcome-actions">
                            <button class="btn-action tour-btn" onclick="guidedTour.startGuidedTour()">
                                🎯 Take Guided Tour (2 min)
                            </button>
                            <button class="btn-action skip-btn" onclick="guidedTour.skipToExplore()">
                                🚀 Get Started - Skip Tour
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', welcomeHTML);
        this.welcomeShown = true;
    }

    // Start the guided tour sequence
    startGuidedTour() {
        console.log('🎯 Starting K2Motor Performance Parts guided tour...');
        
        this.closeWelcome();
        this.isActive = true;
        this.currentStep = 0;
        
        // Ensure we're on overview tab
        this.switchToTab('overview');
        
        setTimeout(() => {
            this.showTourStep();
        }, 500);
    }

    // Show current tour step
    showTourStep() {
        if (this.currentStep >= this.totalSteps) {
            this.completeTour();
            return;
        }
        
        const step = this.tourSteps[this.currentStep];
        const targetElement = document.querySelector(step.target);
        
        if (!targetElement) {
            console.warn(`Tour target not found: ${step.target}`);
            this.nextStep();
            return;
        }
        
        // Remove previous tour highlight
        this.removeTourHighlight();
        
        // Add highlight to current target
        targetElement.classList.add('tour-highlight');
        
        // Create tour popup
        const tourPopupHTML = `
            <div class="popup-overlay tour-overlay active">
                <div class="popup-content tour-content">
                    <div class="popup-header">
                        <h3>${step.title}</h3>
                        <div class="tour-progress">
                            <span>Step ${this.currentStep + 1} of ${this.totalSteps}</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${(this.currentStep + 1) / this.totalSteps * 100}%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="popup-body">
                        <p>${step.content}</p>
                        
                        <div class="tour-navigation">
                            ${this.currentStep > 0 ? '<button class="btn-action prev-btn" onclick="guidedTour.previousStep()">← Previous</button>' : ''}
                            <button class="btn-action next-btn" onclick="guidedTour.nextStep()">
                                ${this.currentStep === this.totalSteps - 1 ? 'Finish Tour' : 'Next →'}
                            </button>
                            <button class="btn-action skip-btn" onclick="guidedTour.skipTour()">Skip Tour</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing tour popup
        const existingTour = document.querySelector('.tour-overlay');
        if (existingTour) {
            existingTour.remove();
        }
        
        document.body.insertAdjacentHTML('beforeend', tourPopupHTML);
        
        console.log(`🎯 Tour step ${this.currentStep + 1}: ${step.title}`);
    }

    // Move to next step
    nextStep() {
        this.currentStep++;
        
        // Special handling for specific steps
        if (this.currentStep === 1) {
            // Show navigation overview - stay on overview
        } else if (this.currentStep === 2) {
            // Show overview tab specific content
        }
        
        this.showTourStep();
    }

    // Move to previous step
    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.showTourStep();
        }
    }

    // Skip tour and start exploring
    skipToExplore() {
        console.log('🚀 Skipping tour - starting K2Motor Performance Parts exploration...');
        this.closeWelcome();
        this.markWelcomeAsSeen();
        this.showExploreMessage();
    }

    // Skip tour completely
    skipTour() {
        console.log('⏭️ Skipping K2Motor Performance Parts guided tour...');
        this.completeTour();
    }

    // Complete tour
    completeTour() {
        console.log('✅ K2Motor Performance Parts guided tour completed!');
        
        this.isActive = false;
        this.removeTourHighlight();
        this.removeTourPopup();
        this.markWelcomeAsSeen();
        
        // Show completion message
        this.showCompletionMessage();
    }

    // Close welcome popup
    closeWelcome() {
        const welcomeOverlay = document.querySelector('.welcome-overlay');
        if (welcomeOverlay) {
            welcomeOverlay.classList.add('fade-out');
            setTimeout(() => {
                welcomeOverlay.remove();
            }, 300);
        }
    }

    // Remove tour highlight
    removeTourHighlight() {
        const highlighted = document.querySelector('.tour-highlight');
        if (highlighted) {
            highlighted.classList.remove('tour-highlight');
        }
    }

    // Remove tour popup
    removeTourPopup() {
        const tourOverlay = document.querySelector('.tour-overlay');
        if (tourOverlay) {
            tourOverlay.remove();
        }
    }

    // Switch to specific tab
    switchToTab(tabName) {
        // Trigger tab switching if dashboard has tab functionality
        const tabElement = document.querySelector(`[data-tab="${tabName}"]`);
        if (tabElement && tabElement.click) {
            tabElement.click();
        }
    }

    // Mark welcome as seen
    markWelcomeAsSeen() {
        localStorage.setItem('k2motor-welcome-shown', 'true');
    }

    // Show explore message
    showExploreMessage() {
        const feedbackHTML = `
            <div class="action-feedback">
                🚀 Ready to optimize K2Motor Performance Parts ads! Start exploring the dashboard.
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', feedbackHTML);
        
        setTimeout(() => {
            const feedback = document.querySelector('.action-feedback');
            if (feedback) {
                feedback.classList.add('fade-out');
                setTimeout(() => feedback.remove(), 300);
            }
        }, 3000);
    }

    // Show completion message
    showCompletionMessage() {
        const feedbackHTML = `
            <div class="action-feedback">
                ✅ Tour complete! You're ready to optimize K2Motor Performance Parts advertising ROI.
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', feedbackHTML);
        
        setTimeout(() => {
            const feedback = document.querySelector('.action-feedback');
            if (feedback) {
                feedback.classList.add('fade-out');
                setTimeout(() => feedback.remove(), 300);
            }
        }, 4000);
    }

    // Bind tour button functionality
    bindTourButton() {
        const tourButton = document.querySelector('.guided-tour-btn');
        if (tourButton) {
            tourButton.addEventListener('click', () => {
                this.startGuidedTour();
            });
        }
    }

    // Reset welcome (for testing)
    resetWelcome() {
        localStorage.removeItem('k2motor-welcome-shown');
        console.log('🔄 K2Motor Performance Parts welcome flow reset');
    }
}

// Initialize guided tour system
const guidedTour = new GuidedTour();

// Auto-start when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    guidedTour.initializeWelcomeFlow();
    console.log('🎯 K2Motor Performance Parts guided tour system ready');
});

// CSS for tour highlighting and styling
const tourStyles = `
<style>
.tour-highlight {
    outline: 3px solid var(--racing-orange) !important;
    outline-offset: 2px;
    border-radius: 4px;
    position: relative;
    z-index: 999;
    box-shadow: 0 0 20px rgba(255, 107, 53, 0.3);
    animation: tourPulse 2s infinite;
}

@keyframes tourPulse {
    0%, 100% { box-shadow: 0 0 20px rgba(255, 107, 53, 0.3); }
    50% { box-shadow: 0 0 30px rgba(255, 107, 53, 0.6); }
}

.welcome-features {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin: 20px 0;
}

.feature-item {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 10px;
    background: rgba(255, 107, 53, 0.1);
    border-radius: 8px;
    border: 1px solid rgba(255, 107, 53, 0.2);
}

.feature-icon {
    font-size: 1.5rem;
    min-width: 30px;
}

.feature-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.feature-text strong {
    color: var(--racing-orange);
    font-size: 1rem;
}

.feature-text span {
    color: #ccc;
    font-size: 0.9rem;
    line-height: 1.4;
}

.data-source-intro {
    margin-top: 25px;
    padding-top: 20px;
    border-top: 1px solid #333;
}

.data-source-intro h4 {
    color: var(--electric-blue);
    margin-bottom: 10px;
}

.data-indicators {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
}

.data-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: bold;
}

.data-badge.api-direct { background: rgba(16, 185, 129, 0.2); color: #10b981; }
.data-badge.calculated { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
.data-badge.csv-import { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
.data-badge.setup { background: rgba(239, 68, 68, 0.2); color: #ef4444; }

.welcome-actions {
    display: flex;
    gap: 15px;
    margin-top: 30px;
    justify-content: center;
}

.tour-btn {
    background: var(--racing-orange) !important;
    flex: 1;
    max-width: 200px;
}

.skip-btn {
    background: #6b7280 !important;
    flex: 1;
    max-width: 180px;
}

.tour-progress {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 5px;
    color: #ccc;
}

.progress-bar {
    width: 150px;
    height: 4px;
    background: #333;
    border-radius: 2px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: var(--racing-orange);
    transition: width 0.3s ease;
}

.tour-navigation {
    display: flex;
    gap: 10px;
    margin-top: 20px;
    justify-content: space-between;
    align-items: center;
}

.prev-btn {
    background: #6b7280 !important;
}

.next-btn {
    background: var(--racing-orange) !important;
}

.tour-content {
    max-width: 500px;
}

.welcome-content {
    max-width: 650px;
}
</style>
`;

// Inject tour styles
document.head.insertAdjacentHTML('beforeend', tourStyles);