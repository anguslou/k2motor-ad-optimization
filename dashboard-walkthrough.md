# K2Motor Dashboard Walkthrough: A Detailed Transcript

This document provides a detailed explanation of each screen analyzed in the K2Motor Dashboard, presented in the order they were reviewed. The goal is to create a clear, easy-to-understand guide to the dashboard's features and data.

---

## Screen 1: Detailed Product Analysis (Subaru WRX/STI Performance Parts)

This screen provides a deep dive into the performance of a specific, high-value product category.

### Card 1: Performance Overview (Top-Left)

This card gives the main, high-level financial results for this category.

*   **TOTAL REVENUE ($19,250):** The total money brought in from selling Subaru parts.
*   **AD SPEND ($4,560):** The total cost of ads for these specific parts.
*   **ROAS (4.22x):** Return on Ad Spend. For every $1 spent on ads, you generated $4.22 in revenue.
*   **POAS (0.8x):** Profit on Ad Spend. This metric initially appeared to show a loss.
*   **ORDERS (35):** The total number of individual sales.
*   **AVG ORDER VALUE ($550):** The average amount spent per order, indicating these are high-value purchases.

### Card 2: ROAS Breakdown (Top-Middle)

This card explains how much of the ROAS was truly caused by your advertising.

*   **Organic Performance (2.9x):** Your baseline ROAS without any advertising.
*   **Paid Performance (4.22x):** Your total ROAS with advertising included.
*   **Incremental Lift (+45.5%):** The percentage increase in performance directly caused by your ads. Your ads improved performance by 45.5% over the baseline.
*   **Statistical Confidence (92%):** You can be 92% certain that this lift is a real result and not random chance.

### Card 3: POAS Analysis (Top-Right)

This card breaks down the profitability of these sales.

*   **Gross Margin (35%):** The percentage of revenue left after accounting for the cost of the products. The note "(High manufacturing costs)" is a key piece of context.
*   **Product Costs ($12,513):** The direct cost of the goods sold.
*   **Net Profit ($2,177):** The final profit after subtracting both product costs and ad spend.
*   **Profit Margin (11.3%):** The final net profit as a percentage of revenue.

**Key Insight: The "Subaru Anomaly"**
We identified that the **POAS of 0.8x** contradicted the **Net Profit of +$2,177**. Our analysis of the underlying data revealed this was due to a bug in the dashboard's POAS calculation. The true POAS, based on the displayed numbers, should be **1.48x**, confirming this category is profitable.

### Card 4: Attribution Details (Bottom-Left)

This card explains *how* your ads are getting credit for sales.

*   **Direct Attribution (72%):** A customer clicked an ad and bought immediately. The most common and direct path.
*   **View-Through Conversions (16%):** A customer saw an ad, didn't click, but came back to buy later. This measures brand awareness.
*   **Assisted Conversions (12%):** An ad was one of the first "touches" in a longer customer journey that eventually led to a sale.
*   **Cross-Brand Influence (8%):** A customer clicked an ad for a different brand (e.g., Honda) but ended up buying a Subaru part. This shows your website is effective at cross-selling.

**Key Insight: Why Attribution > 100%**
These numbers correctly add up to more than 100% because a single sale can be credited in multiple categories, reflecting a complex customer journey with many touchpoints.

### Card 5 & 6: Campaign Performance & Top Performing Products (Bottom-Middle, Bottom-Right)

These cards break down the overall category data into specific campaigns and products, allowing you to see which specific ads and items are driving the most success.

---

## Screen 2: Attribution Test Results

This screen shows the results of five scientific A/B tests designed to measure the true impact of your advertising.

*   **TEST GROUP vs. CONTROL GROUP:** Each test compares a group that saw your ads (Test) to a similar group that did not (Control) to create a scientific baseline.
*   **CONFIDENCE:** Shows how statistically certain you can be that the results are not random luck.
*   **INCREMENTAL LIFT:** The most important metric. It's the percentage of *additional* sales caused directly by your ads.
*   **ATTRIBUTION GAP:** The percentage by which the ad platform's reported ROAS is inflated compared to reality.
*   **TRUE VS APPARENT (ROAS/ROI):** Compares the scientifically-validated **True ROAS** with the misleading **Apparent ROAS** reported by the ad platform. **Always trust the True number.**

**Key Insight:** These experiments are crucial for understanding which campaigns are truly effective (like **EXP-089: Honda Civic**) and which have misleadingly high numbers (like **EXP-097: Audi ECU Tuning**, with a massive 61% attribution gap).

---

## Screen 3: Apparent vs Real ROI Analysis (Table View)

This screen summarizes the results from the five experiments into a single, easy-to-read table, allowing for quick comparison.

*   **TEST SPEND:** The cost to run the experiment, which should be viewed as an investment in data-driven certainty.
*   **STATUS:** Shows whether a test is still running (**In Progress**), complete and trustworthy (**Validated**), or requires further analysis (**Under Review**).

**Key Insight:** This table allows you to rank your campaigns by their **Real ROI**, not their Apparent ROAS. This reveals that the **Honda Civic Brake Pads** campaign is your most efficient and trustworthy investment, despite the Audi campaign looking better on paper.

---

## Screen 4: ROAS Analysis - Return on Ad Spend Deep Dive

This screen provides a deep dive into the ROAS metric itself, proving its value across a segment of your business.

### Card 1: ROAS Breakdown

This is the central story of this screen.

*   **Organic Performance (1.9x baseline):** The ROAS you would achieve with no advertising.
*   **Paid Performance (4.9x with advertising):** The total ROAS with your ads running.
*   **Incremental Lift (+158%):** The key insight. This proves your ads are responsible for a **158% improvement** over your baseline performance. The math is: `(4.9x - 1.9x) / 1.9x = 1.58`.

### Card 2 & 3: Performance Overview & POAS Analysis

These cards provide context. The **Performance Overview** shows the top-line numbers for this data slice. The **POAS Analysis** card on this particular screen contained a data inconsistency, where the displayed Net Profit did not reconcile with the other financial numbers, suggesting a data display issue in this specific view.
