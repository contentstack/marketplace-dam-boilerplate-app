const logger = require("../utils/logger");

const saveCredentials = async (credentials, queryParams, location) => {
    // location: "configScreen" - tracks where the call originated from
    console.log(`[${location}] Saving credentials`);

    // TODO: Implement your DAM credentials save logic here
    // This could save to a database, validate credentials, etc.
    // Example:
    // const response = await fetch(`${config.damApiUrl}/credentials`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(credentials)
    // });
    // return await response.json();

    throw new Error("saveCredentials not implemented - add your DAM credentials save logic here");
};

const getAllAssets = async (config, queryParams, location) => {
    // location: "selectorPage" - tracks where the call originated from
    console.log(`[${location}] Fetching all assets`, { limit: queryParams?.limit, skip: queryParams?.skip });

    // Fetch sample data 
    const sampleDataUrl = process.env.SAMPLE_DATA_URL;
    try {
        console.log(`[${location}] Fetching sample data from: ${sampleDataUrl}`);
        const response = await fetch(sampleDataUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch sample data: ${response.status} ${response.statusText}`);
        }

        const mockData = await response.json();
        logger.info(`### [${location}] Fetched sample data successfully`, { count: Array.isArray(mockData) ? mockData.length : 0 });

        // Apply pagination if provided
        const limit = queryParams?.limit ? parseInt(queryParams.limit, 10) : mockData.length;
        const skip = queryParams?.skip ? parseInt(queryParams.skip, 10) : 0;

        const paginatedData = Array.isArray(mockData)
            ? mockData.slice(skip, skip + limit)
            : [];

        return {
            assets: paginatedData,
            total: Array.isArray(mockData) ? mockData.length : 0,
            limit,
            skip,
        };
    } catch (error) {
        console.error(`[${location}] Error fetching sample data:`, error);
        throw new Error(`Failed to fetch sample data: ${error.message}`);
    }

    // TODO: Replace above with your actual DAM API call when ready
    // Example:
    // const response = await fetch(`${config.damApiUrl}/assets?limit=${queryParams.limit}&skip=${queryParams.skip}`, {
    //   headers: { Authorization: `Bearer ${config.apiKey}` }
    // });
    // return await response.json();
};

const getAssetById = async (config, assetId, location) => {
    // location: "customField" - tracks where the call originated from
    console.log(`[${location}] Fetching asset by ID: ${assetId}`);

    // Fetch mock data from sample data URL and find asset by ID
    const sampleDataUrl = process.env.SAMPLE_DATA_URL;

    try {
        console.log(`[${location}] Fetching sample data from: ${sampleDataUrl}`);
        const response = await fetch(sampleDataUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch sample data: ${response.status} ${response.statusText}`);
        }

        const mockData = await response.json();

        // Find asset by ID
        const asset = Array.isArray(mockData)
            ? mockData.find(item => item.id === assetId || item._id === assetId)
            : null;

        if (!asset) {
            throw new Error(`Asset with ID ${assetId} not found`);
        }

        return asset;
    } catch (error) {
        console.error(`[${location}] Error fetching asset by ID:`, error);
        throw new Error(`Failed to fetch asset: ${error.message}`);
    }

    // TODO: Replace above with your actual DAM API call when ready
    // Example:
    // const response = await fetch(`${config.damApiUrl}/assets/${assetId}`, {
    //   headers: { Authorization: `Bearer ${config.apiKey}` }
    // });
    // return await response.json();
};

module.exports = {
    saveCredentials,
    getAllAssets,
    getAssetById,
};

