# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

K2Motor AI-powered ad spend optimization solution for automotive parts business across multiple e-commerce platforms (eBay, Amazon, Walmart, ChannelAdvisor). **Important: This is optimization tooling only - never touch production marketplace operations.**

## Development Commands

### Core Commands
- `npm test` - Run all Jest tests
- `npm run test:watch` - Run tests in watch mode  
- `npm start` - Start Node.js application
- `npm run dev` - Start with nodemon for auto-reload

### Dashboard Testing (from `dashboard/` or `netlify-deploy/` directories)
- `playwright test` - Run UI/tooltip tests
- Open `index.html` directly in browser for local testing

## Architecture Overview

### Key Components
- **`/src/connectors/`** - MCP protocol API integrations for each platform
- **`/src/services/`** - Data collection and processing services  
- **`/dashboard/`** - Interactive HTML demo dashboard with mock data
- **`/netlify-deploy/`** - Production deployment files
- **`/test/`** - Jest tests for connectors and services

### Data Flow
1. Platform connectors fetch advertising data via APIs
2. Services process and normalize cross-platform data
3. Dashboard displays interactive analytics with mock data matching real API structures
4. Configuration driven via `config.py` for demo customization

## Core Development Principles

**Always follow the instructions in plan.md** - When user says "go", find the next unmarked test in plan.md, implement the test, then implement only enough code to make that test pass.

**TDD Cycle**: Red → Green → Refactor. Write failing test first, make it pass with minimal code, then refactor if needed.

**Tidy First**: Separate structural changes (renaming, extracting methods) from behavioral changes (new functionality). Never mix them in the same commit.

## Platform Integration

### Supported Platforms & Connectors
- **eBay**: Trading API + REST API connectors (`ebay-mcp-connector.js`, `ebay-rest-connector.js`)  
- **Amazon**: MCP connector for advertising data (`amazon-mcp-connector.js`)
- **Walmart**: Marketplace API integration (`walmart-connector.js`)
- **ChannelAdvisor**: Multi-platform management (`channeladvisor-connector.js`)

### API Integration Patterns
- All connectors follow MCP protocol standards
- Mock data in `/assets/data/` matches real API response structures
- Handle authentication, rate limiting per platform requirements
- Cross-platform data normalization in services layer

## UI Development Guidelines

### Tooltip Implementation (Critical Learning)
**ALWAYS use the simple solution first.** Refer to `TOOLTIP_GUIDELINES.md` for detailed guidance.

**Core Principle:** Pure CSS positioning beats JavaScript complexity
- ✅ Use CSS `position: relative` + `position: absolute` pattern
- ✅ Simple `:hover` pseudo-class for show/hide
- ❌ Avoid complex JavaScript positioning unless absolutely necessary
- ❌ Never mix CSS and JavaScript positioning systems

**Debugging Process:**
1. Find working similar component
2. Identify what makes it work
3. Apply same simple approach
4. Exclude problematic elements from complex systems

**Key Insight:** When multiple positioning systems compete, disable the complex one and use the simple CSS solution.

### Dashboard Technology Stack
- Pure HTML5, CSS3, Vanilla JavaScript (no external dependencies for portability)
- Chart.js for interactive visualizations  
- Playwright for comprehensive UI testing
- Configuration-driven mock data via `config.py`

## Testing Strategy

### Test Files Structure
- `/test/` - Jest tests for API connectors and services
- `/dashboard/tests/` or `/netlify-deploy/tests/` - Playwright UI tests
- Follow TDD: write failing test first, minimal code to pass, refactor

### Key Testing Areas
- All platform connector API integrations
- Cross-platform data processing and normalization
- Dashboard UI interactions and tooltip functionality
- Mock data generation matching real API structures