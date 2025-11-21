const { exec, execSync } = require("child_process");
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

module.exports = {
  openLink,
  runCommand,
  getBaseUrl,
  getAppBaseUrl,
  getDeveloperhubBaseUrl,
  safePromise,
  makeApiCall,
};
