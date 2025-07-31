**AI Paid Advertising Optimization Plan Project Preparation Checklist for K2motor**

This is a preparation checklist for the "AI Paid Advertising Optimization Plan" project for K2motor, covering various preparation matters from project costs to technical and data requirements, aimed at helping the project launch smoothly. This checklist is explaining the resources K2motor needs to provide or prepare for the development and deployment of this AI solution.

To ensure the "AI Paid Advertising Optimization Plan" can operate efficiently and achieve the goals of improving advertising efficiency, promoting organic growth, and measuring true ROI, please K2motor assist in preparing the following items:

**1\. Project Cost**

| Detail | Information |
| :---- | :---- |
| Total Cost | USD 10,000 |
| Payment Stages | 30% deposit before project kick-off  40% upon major project delivery (approx. 3 months after launch)  30% after 3-month maintenance period |

**2\. Hardware Requirements (Applicable to Windows Platform)**

This AI system requires sufficient computing resources to process large amounts of market data, execute AI/ML models (e.g., NLP, regression models, time series forecasting, etc.), and perform automated operations. The following are the recommended hardware configurations for the Windows platform:

| Component | Minimum Requirement | Recommended Specification |
| :---- | :---- | :---- |
| CPU | Intel Core i7-10700 or AMD Ryzen 7 3700X (8 cores/16 threads) | Intel Core i9-12900K or AMD Ryzen 9 5900X (12+ cores/24+ threads) |
| RAM | 32GB DDR4-3200 | 64GB DDR4-3600 |
| Storage | 512GB NVMe SSD (System) \+ 2TB HDD (Data) | 1TB NVMe SSD (System) \+ 1TB SSD (High-frequency Data) \+ 4TB HDD (Historical Data) |
| GPU | NVIDIA GeForce GTX 1660 Super (6GB VRAM) | NVIDIA GeForce RTX 3060 (12GB VRAM) or RTX 4060 (8GB VRAM) |
| Network | 100Mbps stable wired connection | 500Mbps or higher stable wired connection |
| Operating System | Windows 10 Professional 64-bit | Windows 11 Professional 64-bit |

This hardware needs to be ready before the project deployment work begins.

**3\. API Access Requirements**

The AI system needs to automatically collect advertising, sales, inventory, product, and market data from Amazon,eBay, Walmart, and K2Motor website through official APIs. K2motor needs to provide the following access permissions and necessary parameters:

* Platform Developer Accounts: Register as Amazon Selling Partner Developer, eBay Developers Program members, and Walmart Developer Portal, and Google Analytics Account.  
* Application Registration and Authorization:  
  * Register applications in the platforms developer centers.  
  * Set up the OAuth 2.0 authorization flow to allow the AI system to securely access data on behalf of K2motor.  
  * Provide necessary API credentials (API Keys, Access Key ID, Secret Access Key, Associate Tag (for PA-API if used), Client ID, Client Secret, etc.), depending on the API used.  
* Necessary API Permissions and Roles: Grant the AI application all necessary permissions and roles to access the following API endpoints:  
  * Amazon  
    * Amazon SP-API:  
      * Orders API: Read order data.  
      * FBA Inventory API: Read FBA inventory data.  
      * Reports API: Request and download reports, especially needing the Brand Analytics role to access Brand Analytics reports (e.g., Search Terms Report, Market Basket Report, Repeat Purchase Report).  
      * Product Pricing API: Read competitor price data.  
      * Catalog Items API: Read product catalog attributes.  
      * Listings Items API: Read and update own listings (including price updates).  
    * Amazon Advertising API (v3): Read advertising performance reports (Campaign, Ad Group, Keyword, Search Term, ASIN reports) and manage advertising campaigns (read budgets, update bids).  
    * Amazon Product Advertising API (PA-API): May be used for supplementary product research and public competitor information, requires Associate Tag and related credentials.  
  * eBay  
    * eBay Marketing API: Read Promoted Listings campaign structure, settings, and performance reports (Impressions, Clicks, Spend, Sales, ROAS, etc.). Read and update ad rates/bids.  
    * eBay Browse API: Used to search competitor listings, prices, and product details. An alternative to the poorly performing Finding API.  
    * eBay Fulfillment API: Read order details, including the buyer.username field to identify buyers.  
    * eBay Inventory API: Read own inventory levels and manage product information, including fitment data.  
    * eBay Taxonomy API: Get taxonomy tree and fitment metadata.  
    * eBay Marketplace Insights API: (If access can be obtained) Get historical market sales data.  
  * Walmart  
    * Walmart Marketplace API: Manages product listings, inventory, pricing, orders, promotions, and reporting.  
    * Walmart Connect API (Advertising API): Provides advertising performance reports and campaign management, similar to Amazon Advertising API.  
    * Walmart Insights API: Offers market data, trends, item quality insights, competitive analysis, and customer behavior information for market analysis and optimization.  
  * K2motor website:  
    * Google Analytics 4: This will allow for collection of website traffic, user behavior, and conversion data

API access permissions and credentials need to be ready before the project development work begins, which is the basis for the system to collect data.

**4\. K2motor's Own Business Data and Knowledge Requirements**

Some key data and business insights cannot be obtained through platform APIs and need to be provided directly by K2motor or assisted by the system. This is crucial for AI model training and aligning with business goals:

* Vehicle Fitment Database: Provide a detailed lookup table of products (SKUs) and compatible vehicle models (Year, Make, Model, Trim, Engine, etc.). This is the unique and most critical data input for the auto parts business.  
* Product Cost Data and Profit Margins: Provide the cost of goods sold (COGS) and other related costs for each product (SKU), as well as the profit margin for each product. This is key to calculating True ROI (maximizing true profitability).  
* Existing Advertising Strategies and History: Provide past advertising campaign structures, settings, strategy details (e.g., past target ACoS/ROAS, budget allocation rules), and historical budget investment.  
* Business Goals and Target KPIs: Clearly state the expected advertising goals (e.g., specific target ACoS/ROAS, total advertising spending limit, maximizing sales volume or profit) and sales priorities for different products.  
* Domain Knowledge: Provide domain expertise such as seasonal patterns in the auto parts market, key customer group characteristics, product substitutability/complementarity, and other external factors affecting sales.

These internal data and knowledge, especially Fitment Data and product cost/profit, need to be provided at the beginning of the first phase (Foundational Data & Basic Optimization) for data integration and system configuration. Other business goals and domain knowledge will be continuously communicated and confirmed during the project.

**5\. Preparation Timeline / Project Phases**

The total project duration is expected to be approximately 2.5 \- 3 months, divided into the following phases:

| Phase | K2motor Responsibility | Angus Responsibility |
| ----- | ----- | ----- |
| **Phase 0: Preparation** | Complete API access permission setup, obtain all necessary credentials, and prepare core business data (such as Fitment Data, product cost/profit). | Provide guidance and documentation for API setup and data preparation. |
| **Phase 1: Foundational Data & Basic Optimization** (Estimated 3-4 weeks) | Provide remaining internal data and business goal details. Ensure hardware is ready. | Establish automated data collection pipelines, integrate API data and K2motor's internal data. Deploy basic monitoring dashboards and reports. |
| **Phase 2: Predictive Analytics for Optimization** (Estimated 2-3 weeks) | Ensure hardware is ready for testing. | Develop and deploy predictive models (such as CVR prediction) and more intelligent optimization logic. Conduct testing on prepared hardware. |
| **Phase 3: Advanced AI and Automation** (Estimated 3-4 weeks) | Participate in discussions and provide feedback on the exploration and implementation of more complex AI technologies and automated processes. | Explore and implement more complex AI technologies and automated processes. |

In summary, API access permissions and credentials, as well as core business data (Fitment, cost/profit), must be available at the start of Phase 1\. Hardware should be ready for testing when the foundation codebase finishes. Other internal knowledge and goals will be gradually deepened as the project progresses.

This checklist aims to provide a clear blueprint to explain the matters that K2motor needs to cooperate with and prepare during the project launch and execution to ensure the successful deployment of the AI Paid Advertising Optimization Plan.

The project kicks off on 16 July 2025