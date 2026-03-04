

class APIError extends Error {
    constructor(message, statusCode = 500, code = "INTERNAL_ERROR", details = {}) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends APIError {
    constructor(message, details = {}) {
        super(message, 400, "VALIDATION_ERROR", details);
    }
}

class NotFoundError extends APIError {
    constructor(resource, id) {
        super(`${resource} not found${id ? `: ${id}` : ""}`, 404, "NOT_FOUND");
    }
}

class UnauthorizedError extends APIError {
    constructor(message = "Unauthorized") {
        super(message, 401, "UNAUTHORIZED");
    }
}

class ExternalAPIError extends APIError {
    constructor(message, originalError, details = {}) {
        super(message, originalError?.statusCode || 502, "EXTERNAL_API_ERROR", {
            ...details,
            originalError: originalError?.message,
        });
    }
}

module.exports = {
    APIError,
    ValidationError,
    NotFoundError,
    UnauthorizedError,
    ExternalAPIError,
};

