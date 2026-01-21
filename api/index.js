const { createResponse } = require("./utils");
const constants = require("./constants");
const damService = require("./services");
const logger = require("./utils/logger");
const { ValidationError, NotFoundError, ExternalAPIError } = require("./utils/errors");
const { validateMode, validateLocation, validateConfig, validateAssetId, validatePaginationParams } = require("./utils/validation");

/**
 * Main API Handler
 * 
 * Flow:
 * - UI calls makeAPIRequest() → calls this handler
 * - Handler routes by HTTP method + mode parameter
 * - Handler calls appropriate function from services/dam.js
 * - Service function makes call to external DAM API
 * - Response returned to UI
 * 
 * 
 * Functions : 
 * - saveCredentials() - config screen
 * - getAllAssets() - selector page
 * - getAssetById() - custom field
 */
exports.handler = async ({
    queryStringParameters: queryParams,
    body,
    httpMethod,
    isBase64Encoded,
}) => {
    try {
        // Extract and validate location flag to track origin of API call
        const location = validateLocation(queryParams?.location, Object.values(constants.UI_LOCATIONS));
        logger?.request(httpMethod, queryParams, location);

        // Parse and validate config
        let config = {};
        if (queryParams?.config) {
            try {
                config = JSON.parse(queryParams.config);
                validateConfig(config);
            } catch (error) {
                throw new ValidationError("Invalid config format in query parameters", { error: error.message });
            }
        }

        // Handle GET requests
        if (httpMethod === "GET") {
            const allowedModes = ["getAllAssets", "getAssetById"];
            validateMode(queryParams?.mode, allowedModes);
 
            switch (queryParams?.mode) {
                case "getAllAssets":
                    try {
                        const { limit, skip } = validatePaginationParams(queryParams);
                        const data = await damService?.getAllAssets?.(config, { ...queryParams, limit, skip }, location);
                        logger.response(constants.HTTP_STATUS.OK, location);
                        return createResponse(constants.HTTP_STATUS.OK, data);
                    } catch (error) {
                        logger.error(`${constants.ERROR_TEXTS.FETCH_ERROR} - getAllAssets`, error, { location });
                        return createResponse(
                            error?.statusCode || constants.HTTP_STATUS.INTERNAL_ERROR,
                            {
                                message: error instanceof ExternalAPIError ? error.message : constants.ERROR_TEXTS.FETCH_ERROR,
                                errorCode: error?.code || "FETCH_ERROR",
                                errorMessage: error?.message,
                                location,
                            }
                        );
                    }

                case "getAssetById":
                    try {
                        const assetId = validateAssetId(queryParams?.assetId);
                        const data = await damService?.getAssetById?.(config, assetId, location);
                        logger.response(constants.HTTP_STATUS.OK, location);
                        return createResponse(constants.HTTP_STATUS.OK, data);
                    } catch (error) {
                        logger.error(`${constants.ERROR_TEXTS.FETCH_ERROR} - getAssetById`, error, { location });
                        return createResponse(
                            error?.statusCode || constants.HTTP_STATUS.INTERNAL_ERROR,
                            {
                                message: error instanceof ValidationError ? error.message : (error instanceof ExternalAPIError ? error.message : constants.ERROR_TEXTS.FETCH_ERROR),
                                errorCode: error?.code || "FETCH_ERROR",
                                errorMessage: error?.message,
                                location,
                            }
                        );
                    }

                default:
                    return createResponse(
                        constants.HTTP_STATUS.BAD_REQUEST,
                        { message: `${constants.ERROR_TEXTS.INVALID_MODE}: ${queryParams?.mode}` }
                    );
            }
        }

        // Handle POST requests
        if (httpMethod === "POST") {
            let requestBody;

            // Parse request body
            try {
                requestBody = body
                    ? (isBase64Encoded
                        ? JSON.parse(Buffer.from(body, "base64").toString("utf-8"))
                        : typeof body === "string" ? JSON.parse(body) : body)
                    : {};
            } catch (error) {
                return createResponse(
                    constants.HTTP_STATUS.BAD_REQUEST,
                    { message: "Invalid request body", error: error.message }
                );
            }

            const allowedModes = ["saveCredentials"];
            validateMode(queryParams?.mode, allowedModes);

            switch (queryParams?.mode) {
                case "saveCredentials":
                    try {
                        // Validate request body structure
                        if (!requestBody?.credentials && !requestBody?.config) {
                            throw new ValidationError("Request body must contain 'credentials' or 'config'");
                        }
                        const result = await damService?.saveCredentials?.(requestBody, queryParams, location);
                        logger.response(constants.HTTP_STATUS.OK, location);
                        return createResponse(
                            constants.HTTP_STATUS.OK,
                            { message: "Credentials saved successfully", ...result }
                        );
                    } catch (error) {
                        logger.error(`${constants.ERROR_TEXTS.CONFIG_ERROR} - saveCredentials`, error, { location });
                        return createResponse(
                            error?.statusCode || constants.HTTP_STATUS.INTERNAL_ERROR,
                            {
                                message: error instanceof ValidationError ? error.message : constants.ERROR_TEXTS.CONFIG_ERROR,
                                errorCode: error?.code || "CONFIG_ERROR",
                                errorMessage: error?.message,
                                location,
                            }
                        );
                    }

                default:
                    return createResponse(
                        constants.HTTP_STATUS.BAD_REQUEST,
                        { message: `${constants.ERROR_TEXTS.INVALID_MODE}: ${queryParams?.mode}` }
                    );
            }
        }

        // Handle unsupported HTTP methods
        return createResponse(
            constants.HTTP_STATUS.BAD_REQUEST,
            { message: `Method ${httpMethod} not supported` }
        );
    } catch (error) {
        logger.error("Handler error", error, { httpMethod, location: queryParams?.location || "unknown" });
        return createResponse(
            error?.statusCode || constants.HTTP_STATUS.INTERNAL_ERROR,
            {
                message: error instanceof ValidationError ? error.message : constants.ERROR_TEXTS.GENERIC_ERROR,
                errorCode: error?.code || "INTERNAL_ERROR",
                errorMessage: error?.message,
            }
        );
    }
};


