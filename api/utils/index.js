const constants = require("../constants");

const createResponse = (statusCode, body, authToken, headers = {}) => {
    console.info(constants.LOGS.RES, statusCode);

    return {
        statusCode,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Expose-Headers": "authToken",
            ...(authToken && { authToken }),
            ...headers,
        },
        body: JSON.stringify(body),
    };
};

module.exports = {
    createResponse,
};


