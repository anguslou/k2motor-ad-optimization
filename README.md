# K2Motor Ad Optimization Dashboard

AI-powered ad spend optimization solution for automotive parts business across multiple e-commerce platforms (eBay, Amazon, Walmart, ChannelAdvisor).

## 🚀 Current Status
**UI Design Approved** - Ready for further development with version control in place.

## 🏗️ Architecture Overview

### Platform Connectors
- **eBay**: Multiple API integrations (MCP, REST, Trading API)
- **Amazon**: MCP connector for advertising data
- **Walmart**: Marketplace API integration
- **ChannelAdvisor**: Multi-platform management

### Dashboard Technology Stack
- Pure HTML5, CSS3, Vanilla JavaScript (no external dependencies)
- Chart.js for interactive visualizations
- Playwright for comprehensive UI testing
- Configuration-driven mock data

## 🛠️ Development Commands

### Core Commands
```bash
npm test              # Run all Jest tests
npm run test:watch    # Run tests in watch mode
npm start            # Start Node.js application
npm run dev          # Start with nodemon auto-reload
```

### Dashboard Testing
```bash
cd dashboard/        # or netlify-deploy/
playwright test      # Run UI/tooltip tests
```

## 🌿 Git Workflow

- **main**: Production-ready code with approved UI design
- **development**: Integration branch for ongoing development  
- **feature/***: Feature branches for new functionality
- **hotfix/***: Urgent fixes for production issues

### Development Process
1. Create feature branch from `development`
2. Follow TDD: Red → Green → Refactor
3. Test thoroughly (Jest + Playwright)
4. Create PR to `development`
5. After approval, merge to `main` for releases

## 📁 Key Directories
- `/src/connectors/` - Platform API integrations
- `/src/services/` - Data processing and normalization  
- `/dashboard/` - Interactive demo dashboard
- `/netlify-deploy/` - Production deployment files
- `/test/` - Jest tests for connectors and services

## 🎯 Development Principles
- **TDD First**: Write failing test → Make it pass → Refactor
- **Tidy First**: Separate structural from behavioral changes
- **Simple Solutions**: CSS positioning over complex JavaScript
- **Mock Data**: Matches real API structures for testing

## 📊 Live Demo
Dashboard displays comprehensive advertising analytics with interactive tooltips and cross-platform performance metrics.
