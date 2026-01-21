# API Backend

This directory contains the backend API implementation for the Marketplace DAM Boilerplate app.

## Structure

```
api/
├── index.js          # Main API handler (Lambda/serverless function entry point)
├── server.js         # Express server for local development
├── constants/        # Constants (HTTP status codes, error messages, etc.)
│   └── index.js
├── utils/            # Utility functions
│   ├── index.js      # createResponse helper function
│   ├── errors.js     # Custom error classes (ValidationError, NotFoundError, ExternalAPIError)
│   ├── logger.js     # Logging utilities
│   └── validation.js # Request validation functions
├── services/         # DAM service layer (where developers add their DAM API calls)
│   └── index.js      # DAM-specific API implementations
├── db/               # Database utilities (if needed)
│   └── index.js
└── package.json      # API dependencies
```

## API Call Flow

### Simple Flow Overview

```
UI Component
    ↓
makeAPIRequest() [ui/src/services/index.ts]
    ↓
API Handler [api/index.js]
    ↓
DAM Service [api/services/index.js]
    ↓
External DAM API
    ↓
Response flows back through the chain
```

### Step-by-Step Flow

1. **UI Component** calls `makeAPIRequest()`:
   ```typescript
   const { makeAPIRequest } = useContext(MarketplaceAppContext);
   const response = await makeAPIRequest({
     queryParams: "mode=getAllAssets&location=selectorPage&config=" + encodeURIComponent(JSON.stringify(config)),
     method: "GET"
   });
   ```

2. **API Handler** (`api/index.js`) receives request:
   - Extracts `mode` and `location` parameters from query string
   - Routes to appropriate service function based on HTTP method + mode
   - Passes config, query params, and location to service layer

3. **DAM Service** (`api/services/index.js`):
   - Contains template functions for common DAM operations
   - **Developers implement their DAM-specific API calls here**
   - Makes HTTP requests to external DAM API
   - Returns formatted response

4. **Response** flows back:
   - Service → Handler → UI Component

### Example: Getting All Assets

**UI Side:**
```typescript
// In CustomSelector component or SelectorPage
const { makeAPIRequest } = useContext(MarketplaceAppContext);

const fetchAssets = async () => {
  const config = {
    apiKey: "your-dam-api-key",
    apiUrl: "https://your-dam-api.com"
  };
  
  const response = await makeAPIRequest({
    queryParams: `mode=getAllAssets&location=selectorPage&limit=50&skip=0&config=${encodeURIComponent(JSON.stringify(config))}`,
    method: "GET"
  });
  
  const data = await response.json();
  return data;
};
```

**API Handler** (`api/index.js`):
- Receives: `mode=getAllAssets&location=selectorPage`
- Routes to: `damService.getAllAssets(config, queryParams, location)`

**DAM Service** (`api/services/index.js`):
```javascript
const getAllAssets = async (config, queryParams, location) => {
  // location: "selectorPage" - tracks where the call originated from
  // queryParams: Contains limit, skip, and other query parameters
  // config: Contains DAM API credentials and settings
  
  // Developer implements their DAM API call here
  const response = await fetch(
    `${config.apiUrl}/assets?limit=${queryParams.limit}&skip=${queryParams.skip}`,
    {
      headers: { Authorization: `Bearer ${config.apiKey}` }
    }
  );
  
  // Return format should match: { assets: [...], total: number, limit: number, skip: number }
  return await response.json();
};
```

## Local Development

The API can be run locally using Express for development:

1. Install dependencies:
```bash
cd api
npm install
```

2. Create a `.env` file manually with:
```bash
PORT=8020
# Add your environment variables here
```

3. Start the development server:
```bash
npm run dev
```

The server will start on port 8020 (or the port specified in `.env`).

For production, use:
```bash
npm start
```

The `server.js` file converts Express requests to the Lambda event format, allowing you to use the same handler function for both local development and serverless deployment.

## Handler Function

The main handler in `index.js` follows the AWS Lambda/serverless function pattern:

```javascript
exports.handler = async ({ queryStringParameters, body, httpMethod, isBase64Encoded }) => {
  // Routes by HTTP method + mode parameter
  // Validates request parameters using utils/validation.js
  // Calls appropriate function from services/index.js
  // Handles errors using utils/errors.js
  // Logs requests/responses using utils/logger.js
}
```

## Request Format

### Query Parameters
- `mode`: Operation mode (e.g., "getAllAssets", "getAssetById", "saveCredentials")
- `location`: UI location identifier (e.g., "configScreen", "selectorPage", "customField") - used for tracking/logging
- `config`: JSON stringified configuration object (contains DAM credentials/settings) - **For GET requests only**
- Additional parameters as needed per mode (e.g., `limit`, `skip`, `assetId`)

**Note:** For POST requests, `config` should be included in the request body, not query parameters.

### Request Body (POST)
- Plain JSON object
- Automatically parsed by handler
- Contains data needed for the operation:
  - `credentials`: Configuration/credentials object (for `saveCredentials` mode)
  - `serverConfiguration`: Server-side configuration (for `saveCredentials` mode)
  - `config`: Configuration object (optional, can also be in query params for GET requests)

### Configuration Object
The `config` parameter should contain all necessary credentials and settings for your DAM API:
```javascript
{
  apiKey: "your-api-key",
  apiUrl: "https://your-dam-api.com",
  // Add any other DAM-specific config needed
}
```

## Response Format

All responses use the `createResponse` utility which returns:
- `statusCode`: HTTP status code
- `headers`: Response headers (including CORS and authToken)
- `body`: JSON stringified response body

## Implementing DAM-Specific API Calls

### Step 1: Add Handler Case (if needed)

If you need a new mode, add it to `api/index.js`:

```javascript
case "yourNewMode":
  try {
    const result = await damService.yourNewFunction(config, queryParams);
    return createResponse(constants.HTTP_STATUS.OK, result);
  } catch (error) {
    // Error handling
  }
```

### Step 2: Implement Service Function

Add your function to `api/services/index.js`:

**For GET requests:**
```javascript
const yourNewFunction = async (config, queryParams, location) => {
  // config: DAM configuration object (from query params)
  // queryParams: All query parameters including limit, skip, etc.
  // location: tracks where the call originated from (e.g., "configScreen", "selectorPage", "customField")
  
  // Implement your DAM API call here
  const response = await fetch(`${config.apiUrl}/your-endpoint`, {
    headers: { Authorization: `Bearer ${config.apiKey}` }
  });
  return await response.json();
};
```

**For POST requests:**
```javascript
const yourNewFunction = async (requestBody, queryParams, location) => {
  // requestBody: Parsed request body object
  // queryParams: Query parameters
  // location: tracks where the call originated from
  
  // Implement your DAM API call here
  // Access data from requestBody (e.g., requestBody.credentials, requestBody.config)
  return { message: "Success" };
};

module.exports = {
  // ... existing exports
  yourNewFunction,
};
```

### Step 3: Call from UI

```typescript
const { makeAPIRequest } = useContext(MarketplaceAppContext);

const response = await makeAPIRequest({
  queryParams: `mode=yourNewMode&location=selectorPage&config=${encodeURIComponent(JSON.stringify(config))}`,
  method: "GET"
});
```

## Available Modes (Pre-configured)

### GET Requests
- `mode=getAllAssets` - Fetch all assets from DAM (used in SelectorPage)
  - Query params: `limit`, `skip`, `config`
  - Location: `selectorPage`
  - Service: `damService.getAllAssets(config, queryParams, location)`

- `mode=getAssetById` - Fetch a specific asset by ID (used in CustomField)
  - Query params: `assetId`, `config`
  - Location: `customField`
  - Service: `damService.getAssetById(config, assetId, location)`

### POST Requests
- `mode=saveCredentials` - Save DAM credentials/configuration (used in ConfigScreen)
  - Body: `{ credentials, serverConfiguration, config }` (at least one of `credentials` or `config` is required)
  - Location: `configScreen`
  - Service: `damService.saveCredentials(requestBody, queryParams, location)`
  - Note: The handler passes the full `requestBody` object as the first parameter. The service function should extract `credentials` or `config` from `requestBody`.

## Constants

Available constants in `constants/index.js`:
- `HTTP_STATUS`: HTTP status codes (OK, CREATED, BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, INTERNAL_ERROR)
- `LOGS`: Log message prefixes
- `ERROR_TEXTS`: Standard error messages
- `UPLOAD`: Upload-related messages
- `UI_LOCATIONS`: Valid UI location identifiers (CONFIG_SCREEN, SELECTOR_PAGE, CUSTOM_FIELD)

## Utilities

### Error Handling (`utils/errors.js`)
Custom error classes for better error handling:
- `ValidationError`: For invalid request parameters
- `NotFoundError`: For missing resources
- `ExternalAPIError`: For external API failures

### Validation (`utils/validation.js`)
Request validation functions:
- `validateMode(mode, allowedModes)`: Validates the mode parameter
- `validateLocation(location, allowedLocations)`: Validates and normalizes location parameter
- `validateConfig(config)`: Validates config object structure
- `validateAssetId(assetId)`: Validates asset ID format
- `validatePaginationParams(queryParams)`: Validates and normalizes pagination parameters (limit, skip)

### Logging (`utils/logger.js`)
Logging utilities for request/response tracking and error logging.

### Response Helper (`utils/index.js`)
- `createResponse(statusCode, body, authToken, headers)`: Creates standardized API response format

## Frontend Integration

The frontend calls this API using the `makeAPIRequest` function from `ui/src/services/index.ts`:

```typescript
const { makeAPIRequest } = useContext(MarketplaceAppContext);

// GET request example
const response = await makeAPIRequest({
  queryParams: "mode=getAllAssets&location=selectorPage&limit=50&skip=0",
  method: "GET"
});

// POST request example
const response = await makeAPIRequest({
  queryParams: "mode=saveCredentials&location=configScreen",
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: {
    credentials: { /* your credentials */ },
    serverConfiguration: { /* server config */ }
  }
});
```

The `makeAPIRequest` function is provided via `MarketplaceAppContext` and can be accessed in any component that uses the context.

## Environment Variables

### API Server (.env in api/ directory)
- `PORT`: Server port (default: 8020)

### Frontend (ui/.env)
- `REACT_APP_API_URL`: Base URL for the API endpoint (e.g., `http://localhost:8020`)
- `REACT_APP_API_KEY`: API key (sent as `x-api-key` header)

## Location Tracking

All API calls include a `location` parameter that identifies where the call originated from in the UI:

- `configScreen`: Called from the Config Screen when saving credentials
- `selectorPage`: Called from the Selector Page when loading assets
- `customField`: Called from the Custom Field when fetching asset details

This location is logged in the backend and can be used for debugging and analytics purposes.

