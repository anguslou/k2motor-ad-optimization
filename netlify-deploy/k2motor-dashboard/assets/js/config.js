/**
 * K2Motor Dashboard Configuration
 * Auto-generated from config.py
 */

const DASHBOARD_CONFIG = {
    company_info: {
        name: 'K2Motor',
        tagline: 'High-Performance Sports Car Parts',
        monthly_ad_budget: 75000,
        target_roas: 4.2,
        target_acos: 23.8,
        average_order_value: 450
    },
    
    theme: {
        primary_color: '#FF6B35',    // Racing orange
        secondary_color: '#00D4FF',  // Electric blue
        background_color: '#0F0F23', // Deep dark background
        accent_color: '#1a1a2e',     // Carbon fiber
        text_color: '#ffffff'
    },
    
    platforms: ['Amazon', 'eBay', 'Google Ads', 'Facebook'],
    
    product_categories: [
        'Turbo Systems',
        'Cold Air Intakes', 
        'Exhaust Systems',
        'Performance Brakes',
        'Coilovers',
        'ECU Chips',
        'Intercoolers',
        'Racing Seats',
        'Roll Bars',
        'Aerodynamic Kits'
    ],
    
    vehicle_brands: [
        'Subaru WRX/STI',
        'Honda Civic Type R',
        'Ford Focus ST/RS',
        'Volkswagen Golf R',
        'BMW M3/M4',
        'Audi S3/RS3',
        'Nissan 370Z/GT-R',
        'Toyota Supra',
        'Mazda MX-5'
    ],
    
    scenarios: {
        active_scenarios: [1, 2, 3, 4, 7],
        performance_alerts: ['critical', 'warning', 'opportunity']
    },
    
    data_refresh_interval: 300000, // 5 minutes for demo
    demo_mode: true
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DASHBOARD_CONFIG;
}