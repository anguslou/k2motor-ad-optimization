# K2Motor Dashboard - Tooltip Development Guidelines

## Core Principle: SIMPLICITY FIRST

### ✅ Preferred Approach: Pure CSS Positioning

**Use this pattern for new tooltips:**

```html
<span class="tooltip">Text
    <span class="tooltiptext">
        <div class="tooltip-section">
            <span class="tooltip-title">Title</span>
            <div class="tooltip-why">Explanation</div>
            <div class="tooltip-action">Action</div>
        </div>
    </span>
</span>
```

```css
.tooltip {
    position: relative;
    display: inline-block;
}

.tooltip .tooltiptext {
    position: absolute;
    left: 100%; /* Right of element */
    top: 0; /* Aligned with element */
    margin-left: 15px;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
}
```

### ⚠️ JavaScript Positioning: Only When Necessary

**Only use JavaScript positioning when:**
- Tooltip needs viewport boundary detection
- Complex dynamic positioning required
- Pure CSS cannot handle the use case

**Never use JavaScript positioning for:**
- Simple element-relative tooltips
- Static content tooltips
- Tooltips that should stay anchored to their trigger

### 🔧 Current System Architecture

#### Working Examples:
- **Table header tooltips** → Pure CSS ✅
- **Alert card tooltips ("Losing Money")** → Pure CSS ✅

#### JavaScript-Enhanced:
- **Metric card tooltips** → JavaScript positioning for viewport awareness
- **Complex dynamic tooltips** → JavaScript system

### 🚫 Anti-Patterns to Avoid

1. **Multiple positioning systems on same elements**
2. **Mouse-cursor following for element-anchored tooltips**
3. **Complex viewport calculations for simple use cases**
4. **JavaScript "enhancements" that break working CSS**

### 🎯 Debugging Process

1. **Check if similar tooltip works elsewhere**
2. **Identify which positioning system is being used**
3. **Exclude problematic elements from complex systems**
4. **Apply simple CSS solution**
5. **Test with minimal complexity first**

### 📝 Implementation Checklist

Before implementing tooltips:
- [ ] Is there a working similar tooltip to copy?
- [ ] Can this be solved with pure CSS?
- [ ] Does this need viewport boundary detection?
- [ ] Will this conflict with existing systems?

### 🔄 System Exclusions

**tooltip-fixes.js exclusions:**
```javascript
// Skip tooltips inside specific containers - let them use pure CSS
const isInsideAlertCard = tooltip.closest('.alert-card');
const isInsideOptimizationCard = tooltip.closest('.optimization-card');
const isInsideBudgetCard = tooltip.closest('.summary-metric-card, .budget-performance-summary');
if (isInsideAlertCard || isInsideOptimizationCard || isInsideBudgetCard) {
    return; // Skip JavaScript positioning
}
```

### 🏆 Advanced Fix: Z-Index Stacking Context

**Problem:** Tooltip covered by adjacent cards with same z-index
**Root Cause:** Later DOM elements naturally stack above earlier ones when z-index is equal

**Solution Pattern:**
```css
/* Base state: All cards same z-index */
.summary-metric-card {
    z-index: 1;
}

/* Hover state: Boost hovered card above others */
.summary-metric-card:hover {
    z-index: 100; /* Higher than adjacent cards */
}

/* Tooltips: Always highest z-index */
.summary-metric-card .tooltip .tooltiptext {
    z-index: 999999;
}
```

**Why This Works:**
- Cards in DOM order: CURRENT SPEND → BUDGET UTILIZATION → AVG. POAS → EFFICIENCY SCORE  
- When BUDGET UTILIZATION is hovered → gets z-index: 100
- Now stacks above AVG. POAS (z-index: 1)
- Tooltip appears correctly to the right without coverage

**Key Insight:** DOM order determines stacking when z-index is equal. Hover-based z-index boost solves adjacent element coverage.

## Key Takeaway: When in doubt, use the simple CSS solution.