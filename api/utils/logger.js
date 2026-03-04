const constants = require("../constants");

const logger = {
    info: (message, metadata = {}) => {
        console.info(JSON.stringify({
            level: "info",
            message,
            timestamp: new Date().toISOString(),
            ...metadata,
        }));
    },

    error: (message, error, metadata = {}) => {
        console.error(JSON.stringify({
            level: "error",
            message,
            timestamp: new Date().toISOString(),
            error: {
                message: error?.message,
                stack: error?.stack,
                code: error?.code,
            },
            ...metadata,
        }));
    },

    warn: (message, metadata = {}) => {
        console.warn(JSON.stringify({
            level: "warn",
            message,
            timestamp: new Date().toISOString(),
            ...metadata,
        }));
    },

    request: (httpMethod, queryParams, location) => {
        logger.info(constants.LOGS.REQ, {
            method: httpMethod,
            queryParams: { ...queryParams, config: queryParams?.config ? "[REDACTED]" : undefined },
            location,
        });
    },

    response: (statusCode, location) => {
        logger.info(constants.LOGS.RES, {
            statusCode,
            location,
        });
    },
};

module.exports = logger;

