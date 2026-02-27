
const validateMode = (mode, allowedModes) => {
    if (!mode) {
        throw new Error("Mode parameter is required");
    }
    if (!allowedModes.includes(mode)) {
        throw new Error(`Invalid mode: ${mode}. Allowed modes: ${allowedModes.join(", ")}`);
    }
    return true;
};

const validateLocation = (location, allowedLocations) => {
    if (!location) {
        return "unknown";
    }
    if (allowedLocations && !allowedLocations.includes(location)) {
        console.warn(`Unknown location: ${location}`);
    }
    return location;
};

const validateConfig = (config) => {
    if (!config || typeof config !== "object") {
        throw new Error("Invalid config: must be an object");
    }
    return config;
};

const validateAssetId = (assetId) => {
    if (!assetId || typeof assetId !== "string" || assetId.trim() === "") {
        throw new Error("assetId parameter is required and must be a non-empty string");
    }
    return assetId.trim();
};

const validatePaginationParams = (queryParams) => {
    const limit = queryParams?.limit ? parseInt(queryParams.limit, 10) : 50;
    const skip = queryParams?.skip ? parseInt(queryParams.skip, 10) : 0;

    if (isNaN(limit) || limit < 1 || limit > 1000) {
        throw new Error("limit must be a number between 1 and 1000");
    }
    if (isNaN(skip) || skip < 0) {
        throw new Error("skip must be a non-negative number");
    }

    return { limit, skip };
};

module.exports = {
    validateMode,
    validateLocation,
    validateConfig,
    validateAssetId,
    validatePaginationParams,
};

