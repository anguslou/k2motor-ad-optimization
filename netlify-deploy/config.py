# K2Motor Ad Optimization Dashboard Configuration
# For Sports Car Parts Business

DASHBOARD_CONFIG = {
    'company_info': {
        'name': 'K2Motor',
        'business_type': 'High-Performance Sports Car Parts',
        'monthly_ad_budget': 75000,  # Higher budget for performance parts
        'target_roas': 4.2,          # Higher targets for premium products
        'target_acos': 24.0,
        'established': '2018',
        'specialties': ['Turbo Systems', 'Brake Upgrades', 'Suspension', 'ECU Tuning']
    },
    
    'mock_data': {
        'date_range': '2025-07-01 to 2025-07-28',
        'platforms': ['Amazon', 'eBay', 'Google Ads', 'Facebook'],
        
        # Sports car focused product categories
        'product_categories': [
            'Turbo Systems', 'Cold Air Intakes', 'Exhaust Systems', 
            'Performance Brakes', 'Coilovers', 'ECU Chips', 'Intercoolers',
            'Racing Seats', 'Roll Bars', 'Aerodynamic Kits'
        ],
        
        # High-performance vehicle brands
        'vehicle_brands': [
            'Subaru WRX/STI', 'Honda Civic Type R', 'Ford Focus ST/RS',
            'Volkswagen Golf R', 'BMW M3/M4', 'Audi S3/RS3', 
            'Nissan 370Z/GT-R', 'Toyota Supra', 'Mazda MX-5'
        ],
        
        # Performance metrics for sports car market
        'performance_metrics': {
            'avg_order_value': 450,      # Higher AOV for performance parts
            'conversion_rate': 2.8,      # Lower but higher value conversions
            'avg_margin': 35,            # Premium margins
            'customer_ltv': 2800         # High customer lifetime value
        }
    },
    
    'scenarios': {
        'active_scenarios': [1, 2, 6, 7, 10],  # Key scenarios for sports car market
        'performance_alerts': ['critical', 'warning', 'opportunity'],
        
        # Sports car specific scenarios
        'sports_car_focus': {
            'seasonal_peaks': ['Spring Tuning Season', 'Track Day Prep', 'Winter Storage'],
            'high_value_keywords': ['turbo upgrade', 'coilover kit', 'big brake kit'],
            'competitor_brands': ['APR', 'Cobb', 'Injen', 'Stoptech', 'KW Suspension']
        }
    },
    
    'ui_theme': {
        'primary_color': '#FF6B35',      # Racing orange
        'secondary_color': '#1A1A2E',    # Dark navy
        'accent_color': '#00D4FF',       # Electric blue
        'success_color': '#00FF88',      # Neon green
        'warning_color': '#FFB800',      # Amber warning
        'danger_color': '#FF3366',       # Racing red
        'background': '#0F0F23',         # Deep dark blue
        'surface': '#16213E',            # Card background
        'text_primary': '#FFFFFF',       # White text
        'text_secondary': '#B8BCC8'      # Light gray text
    },
    
    'demo_settings': {
        'tour_enabled': True,
        'popups_enabled': True,
        'data_source_indicators': True,
        'animation_speed': 'fast',       # Fast for sports car theme
        'sound_effects': False,          # Professional demo
        'guided_scenarios': [
            'Morning Performance Review',
            'Turbo Kit Campaign Analysis', 
            'Budget Reallocation Demo',
            'Attribution Deep Dive'
        ]
    }
}

# Export for JavaScript usage
def export_to_js():
    """Convert config to JavaScript format for frontend"""
    import json
    js_config = f"const DASHBOARD_CONFIG = {json.dumps(DASHBOARD_CONFIG, indent=2)};"
    
    with open('assets/js/config.js', 'w') as f:
        f.write(js_config)
    
    return js_config

if __name__ == "__main__":
    export_to_js()
    print("Configuration exported to assets/js/config.js")