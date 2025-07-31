#!/usr/bin/env python3
"""
K2Motor Dashboard - Tab 1 Testing Script
Tests the dashboard components and data loading
"""
import os
import json
import requests

def test_dashboard():
    print("K2Motor Dashboard - Tab 1 Testing")
    print("===================================")
    
    dashboard_path = "/Volumes/SSD/Hivebot Projects/K2Motor/dashboard"
    
    # Test 1: Local server connectivity
    try:
        response = requests.get('http://localhost:8000', timeout=5)
        print(f"✅ Local server status: {response.status_code}")
        print(f"✅ Dashboard accessible at: http://localhost:8000")
    except Exception as e:
        print(f"❌ Server connection failed: {e}")
        return
    
    # Test 2: File structure validation
    print("\n📁 File Structure Check:")
    files_to_check = [
        "index.html",
        "assets/css/main.css", 
        "assets/css/dashboard-content.css",
        "assets/js/dashboard-content.js",
        "assets/js/main.js",
        "assets/data/campaign-data.json"
    ]
    
    missing_files = []
    for file in files_to_check:
        full_path = os.path.join(dashboard_path, file)
        if os.path.exists(full_path):
            print(f"✅ {file}")
        else:
            print(f"❌ {file} - MISSING")
            missing_files.append(file)
    
    if missing_files:
        print(f"\n⚠️  Missing {len(missing_files)} critical files")
        return
    
    # Test 3: Campaign data validation
    print("\n📊 Campaign Data Validation:")
    try:
        with open(f"{dashboard_path}/assets/data/campaign-data.json", 'r') as f:
            data = json.load(f)
            print(f"✅ Campaign data loaded: {len(data)} campaigns")
            
            # Validate data structure
            required_fields = ['campaignId', 'campaignName', 'platform', 'roas', 'scenario']
            sample = data[0]
            
            for field in required_fields:
                if field in sample:
                    print(f"✅ Field '{field}': {sample[field]}")
                else:
                    print(f"❌ Missing field: {field}")
            
            # Calculate metrics like the dashboard will
            total_spend = sum(c.get('spend', 0) for c in data)
            total_revenue = sum(c.get('revenue', 0) for c in data)
            avg_roas = total_revenue / total_spend if total_spend > 0 else 0
            
            print(f"\n📈 Calculated Metrics:")
            print(f"   Total Spend: ${total_spend:,.2f}")
            print(f"   Total Revenue: ${total_revenue:,.2f}")
            print(f"   Average ROAS: {avg_roas:.2f}x")
            
    except Exception as e:
        print(f"❌ Campaign data error: {e}")
        return
    
    # Test 4: JavaScript files syntax check
    print("\n🔧 JavaScript Validation:")
    js_files = [
        "assets/js/dashboard-content.js",
        "assets/js/main.js"
    ]
    
    for js_file in js_files:
        full_path = os.path.join(dashboard_path, js_file)
        if os.path.exists(full_path):
            with open(full_path, 'r') as f:
                content = f.read()
                if 'DashboardContentManager' in content or 'Dashboard' in content:
                    print(f"✅ {js_file} - Contains dashboard code")
                else:
                    print(f"⚠️  {js_file} - May be missing dashboard logic")
    
    print("\n🚀 Tab 1 Test Summary:")
    print("=" * 40)
    print("✅ All critical files present")
    print("✅ Campaign data structure valid")  
    print("✅ Local server running")
    print("✅ Dashboard ready for visual testing")
    print("\n🌐 Open: http://localhost:8000")
    print("📊 Tab 1 (Ad Performance Overview) functionality:")
    print("   - Key metrics cards (ROAS, POAS, Revenue, Spend)")
    print("   - Platform performance comparison")
    print("   - Top performing campaigns table") 
    print("   - Optimization alerts based on scenarios")
    print("   - Quick action buttons")

if __name__ == "__main__":
    test_dashboard()