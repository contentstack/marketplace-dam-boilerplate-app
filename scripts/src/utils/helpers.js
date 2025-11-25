const { exec, execSync } = require("child_process");
const fs = require("fs");
const axios = require("axios");
const constants = require("../constants");

const openLink = (url) => {
  const cmd =
    process.platform === "win32"
      ? `start ${url}`
      : process.platform === "darwin"
      ? `open "${url}"`
      : `xdg-open "${url}"`;
  exec(cmd, (err) => {
    if (err) {
      console.error("Failed to open the link in browser: ", url);
      return;
    }
  });
};

const runCommand = (command, options = {}) => {
  console.info(`Running "${command}"...`);
  execSync(command, {
    stdio: "inherit",
    shell: true,
    ...options,
  });
};

const getBaseUrl = (region) => {
  const baseUrl = constants.BASE_URLS.find((item) => item.region === region);
  return baseUrl ? baseUrl.url : constants.BASE_URLS[0].url;
};

const getAppBaseUrl = (region) => {
  const baseUrl = constants.APP_BASE_URLS.find(
    (item) => item.region === region
  );
  return baseUrl ? baseUrl.url : constants.APP_BASE_URLS[0].url;
};

const getDeveloperhubBaseUrl = (region) =>
  constants.DEVELOPERHUB_BASE_URLS.find((url) => url.region === region)?.url ||
  constants.DEVELOPERHUB_BASE_URLS[0].url;

const safePromise = (promise, errorText) =>
  promise
    .then((res) => [null, res])
    .catch((err) => {
      console.error(errorText);
      return [err];
    });

const makeApiCall = async ({ url, method, headers, data, maxBodyLength }) => {
  try {
    const res = await axios({
      url,
      method,
      timeout: 60 * 1000,
      headers,
      ...(maxBodyLength ? { maxBodyLength } : {}),
      ...(["PUT", "POST", "DELETE", "PATCH"].includes(method) && {
        data,
      }),
    });

    return res?.data;
  } catch (error) {
    console.error(error);
    throw error.response?.data || error.message || error;
  }
};

// File system helper functions
const safeDelete = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.rmSync(filePath, { recursive: true, force: true });
  }
};

const readFileSafe = (filePath) => {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf-8") : null;
};

const updateEnvFile = (filePath, key, value) => {
  const originalContent = readFileSafe(filePath);
  const regex = new RegExp(`^${key}=.*$`, "m");
  const updatedContent = regex.test(originalContent || "")
    ? (originalContent || "").replace(regex, `${key}=${value}`)
    : `${originalContent || ""}${originalContent && !originalContent.endsWith("\n") ? "\n" : ""}${key}=${value}\n`;
  
  fs.writeFileSync(filePath, updatedContent, "utf-8");
  return originalContent;
};

module.exports = {
  openLink,
  runCommand,
  getBaseUrl,
  getAppBaseUrl,
  getDeveloperhubBaseUrl,
  safePromise,
  makeApiCall,
  safeDelete,
  readFileSafe,
  updateEnvFile,
};
