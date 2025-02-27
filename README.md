# Compass Reports

A cohort analysis and visualization tool for educational assessment data. Compass Reports allows you to upload CSV data about cohorts and their assessment responses to generate interactive reports and visualizations.

## 📊 Features

- Import and analyze CSV data files
- Interactive data visualizations with confidence charts and knowledge levels
- Comparative analysis tools
- Threshold-based filtering for assessment responses
- Responsive design with collapsible navigation

## 🧰 Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Nx Monorepo
- Vite
- Chart visualization with Recharts
- CSV parsing
- State management with Zustand
- Routing with React Router

## 📁 Project Structure

```
compass-reports/
├── apps/
│   ├── compass-report/      # Main application
│   └── compass-report-e2e/  # End-to-end tests
├── libs/
│   ├── csv-import/          # CSV import functionality
│   └── xlsx-import/         # Excel import functionality
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone [repository URL]
   cd compass-reports
   ```

2. Install dependencies:
   ```
   npm install
   ```

### Running the Application

To start the development server:

```
npx nx serve compass-report
```

The application will be available at http://localhost:4200 (or the port specified in your configuration).

### Building for Production

To build the application for production:

```
npx nx build compass-report
```

The build artifacts will be stored in the `dist/` directory.

### Running Tests

To run the unit tests:

```
npx nx test compass-report
```

To run end-to-end tests:

```
npx nx e2e compass-report-e2e
```

## 🔄 Development Workflow

1. Import CSV files for cohort and response data
2. Adjust thresholds and filters as needed
3. View and interact with the generated visualizations
4. Export or save reports as needed

## 🤝 Contributing

To contribute to this project:

1. Ensure all code follows the established patterns and conventions
2. Write appropriate tests for new features
3. Update documentation as needed
4. Submit PRs with clear descriptions of changes

## 📋 Available Scripts

- `npx nx serve compass-report` - Start development server
- `npx nx build compass-report` - Build for production
- `npx nx test compass-report` - Run unit tests
- `npx nx e2e compass-report-e2e` - Run e2e tests
- `npx nx graph` - Visualize project dependencies

## 📝 License

MIT License
