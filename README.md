# Água Víbora Generator

A Node.js/TypeScript API for generating irrigation schedules for the Água de Víbora irrigation system. This application generates schedules for multiple villages in the Torre and Santo-António regions, with support for exporting in various formats (PDF, Excel, CSV, and iCalendar).

## Features

- **Automatic Schedule Generation**: Creates irrigation schedules based on yearly rotation patterns
- **Multi-Village Support**: Manages schedules for 11 different villages across two regions
- **Multiple Export Formats**: 
  - PDF documents
  - Excel spreadsheets (.xlsx)
  - CSV files
  - iCalendar (.ics) for Google Calendar integration
- **Template Generation**: Create blank templates for manual scheduling
- **Year-Based Rotation**: Automatically adjusts schedules based on odd/even years

## Villages Covered

### Torre Region
- Torre
- Crasto
- Passo
- Ramada
- Figueiredo
- Redondinho

### Santo-António Region
- Casa Nova
- Eirô
- Cimo de Aldeia
- Portela
- Casa de Baixo

## Project Structure

```
agua-vibora-generator/
├── src/
│   ├── app.ts                    # Express application setup
│   ├── server.ts                 # HTTP server configuration
│   ├── config/
│   │   └── config.ts             # Environment configuration
│   ├── controllers/
│   │   └── schedule.controller.ts # Request handlers
│   ├── middlewares/
│   │   └── errorHandler.ts       # Global error handling
│   ├── routes/
│   │   └── schedule.routes.ts    # API routes
│   └── services/
│       └── schedule.service.ts   # Schedule generation logic
├── package.json
├── tsconfig.json
└── nodemon.json
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd agua-vibora-generator
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=3000
NODE_ENV=development
```

## Usage

### Development Mode

Run the application in development mode with auto-reload:

```bash
npm run dev
```

### Production Mode

1. Build the TypeScript code:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## API Endpoints

### Download Full Agenda

Downloads the complete irrigation schedule with times.

```http
GET /download-full-agenda?year=2025&format=xlsx
```

**Query Parameters:**
- `year` (optional): The year for the schedule (defaults to current year)
- `format` (optional): File format - `xlsx`, `csv`, or `pdf` (defaults to `xlsx`)

### Download Template

Downloads a blank schedule template without irrigation times.

```http
GET /download-template?year=2025&format=xlsx
```

**Query Parameters:**
- `year` (optional): The year for the template (defaults to current year)
- `format` (optional): File format - `xlsx`, `csv`, or `pdf` (defaults to `xlsx`)

### Download Calendar

Downloads the schedule as an iCalendar file for import into Google Calendar or other calendar applications.

```http
GET /download-calendar?year=2025
```

**Query Parameters:**
- `year` (optional): The year for the calendar (defaults to current year)

## Schedule Logic

The irrigation schedule follows these rules:

- **Season**: Runs from June 25 to September 29 each year
- **Rotation**: Villages follow a specific rotation pattern that shifts annually
- **Timing Variations**: Different schedules apply to Torre, Passo, and Figueiredo based on odd/even years
- **Reference Year**: 2025 is used as the base year for calculating rotations

## Development

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **PDF Generation**: PDFKit
- **Excel Generation**: ExcelJS
- **Calendar Generation**: ics
- **Date Handling**: date-fns

## Configuration

The application can be configured via environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment mode | development |

## Error Handling

The application includes comprehensive error handling:
- Global error handler middleware
- 404 handling for undefined routes
- Typed error responses

## License

Private project - All rights reserved

## Contributing

This is a private project. For contributions, please contact the project maintainer.
