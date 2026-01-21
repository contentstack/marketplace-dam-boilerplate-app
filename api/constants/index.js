const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

const LOGS = {
  REQ: "Request:",
  RES: "Response:",
};

const UI_LOCATIONS = {
  CONFIG_SCREEN: "configScreen",
  SELECTOR_PAGE: "selectorPage",
  CUSTOM_FIELD: "customField",
};

const ERROR_TEXTS = {
  INVALID_MODE: "Invalid mode parameter",
  INVALID_REQUEST: "Invalid request",
  FETCH_ERROR: "Error fetching data",
  UPLOAD_ERROR: "Error uploading file",
  AUTH_ERROR: "Authentication error",
  CONFIG_ERROR: "Configuration error",
  ERROR_URLS: "Error generating signed URLs",
  GENERIC_ERROR: "An error occurred",
};

const UPLOAD = {
  RESPONSE: {
    SUCCESS: "Files uploaded successfully",
    ERROR: "Error uploading files",
    INVALID_MODE: "Invalid upload mode",
  },
};

module.exports = {
  HTTP_STATUS,
  LOGS,
  ERROR_TEXTS,
  UPLOAD,
  UI_LOCATIONS,
};


