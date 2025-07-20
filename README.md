# Outsera Backend Challenge

A Node.js/TypeScript API that analyzes movie producer statistics from CSV data, calculating the minimum and maximum intervals between consecutive wins.

## Features

- **CSV Data Processing**: Loads and parses movie data from CSV files
- **Producer Analysis**: Calculates intervals between consecutive wins for each producer
- **RESTful API**: Provides endpoints to retrieve producer statistics
- **TypeORM Integration**: Uses TypeORM for database operations with SQLite
- **Comprehensive Testing**: Unit and integration tests with Jest

## Requirements

- Node.js 16+
- Yarn or npm

## Installation

```bash
# Clone the repository
git clone https://github.com/andradeweslley/outsera-backend-challenge
cd outsera-backend-challenge

# Install dependencies
yarn install

# Set environment variables (optional)
export NODE_ENV=development
```

## Running the Application

### Development Mode
```bash
yarn dev
```

### Production Mode
```bash
yarn build
yarn start
```

### Testing
```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch
```

## API Endpoints

### GET /api/producers/stats
Returns producer statistics with minimum and maximum intervals between consecutive wins.

**Response Format:**
```json
{
  "min": [
    {
      "producer": "Producer Name",
      "interval": 1,
      "previousWin": 2008,
      "followingWin": 2009
    }
  ],
  "max": [
    {
      "producer": "Producer Name", 
      "interval": 99,
      "previousWin": 1900,
      "followingWin": 1999
    }
  ]
}
```
