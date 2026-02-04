const { exec, execSync } = require("child_process");
const fs = require("fs");
const axios = require("axios");
const readlineSync = require("readline-sync");
const path = require("path");
const constants = require("../constants");

const makeApiCall = async ({ url, method, headers, data, maxBodyLength,printError = true}) => {
  try {
    const res = await axios({
      url,
      method,
      timeout: 60 * 1000,
      headers,
      ...(maxBodyLength ? { maxBodyLength } : {}),
      ...(["PUT", "POST", "DELETE", "PATCH"].includes(method) && {
        data,
      })
    });

    return res?.data;
  } catch (error) {
    if (printError) console.info(JSON.stringify(error));
    throw error.response?.data || error.message || error;
  }
};

const safePromise = (promise, errorText,printError = true) =>
  promise
    .then((res) => [null, res])
    .catch((err) => {
      if (printError) console.error(errorText);
      return [err];
    });

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

const buildDeploymentUrl = (launchSubDomain, region, deploymentUrl = null) => {
  if (deploymentUrl) {
    return deploymentUrl;
  }

  let url = `https://${launchSubDomain}.`;
  if (region === "" || region === "eu") {
    url += `${region === "" ? "" : `${region}-`}contentstackapps.com`;
  } else if (region === "azure-na" || region === "azure-eu") {
    url += `${region === "azure-na" ? "" : "eu-"}azcontentstackapps.com`;
  } else {
    url += "gcpcontentstackapps.com";
  }
  return url;
};

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
    : `${originalContent || ""}${
        originalContent && !originalContent.endsWith("\n") ? "\n" : ""
      }${key}=${value}\n`;

  fs.writeFileSync(filePath, updatedContent, "utf-8");
  return originalContent;
};

const authenticateUser = () => {
  let loginData;
  try {
    loginData = require(path.join(
      __dirname,
      "../../settings/credentials.json"
    ));
  } catch (error) {
    loginData = null;
  }

  if (!loginData?.authtoken) {
    console.info("Login credentials not found. Please login.");
    return null;
  }

  if (!loginData?.userOrgs?.length) {
    console.info("No organisations found...");
    return null;
  }

  const orgIndex = readlineSync.keyInSelect(
    loginData.userOrgs.map((org) => org.name),
    "Please select an organization"
  );

  if (orgIndex === -1) {
    console.info("No organization selected...");
    return null;
  }

  const selectedOrgUid = loginData.userOrgs[orgIndex].uid;

  return {
    authtoken: loginData.authtoken,
    userOrgs: loginData.userOrgs,
    region: loginData.region,
    selectedOrgUid,
    baseUrl: getBaseUrl(loginData.region),
    appBaseUrl: getAppBaseUrl(loginData.region),
  };
};

module.exports = {
  openLink,
  runCommand,
  getBaseUrl,
  getAppBaseUrl,
  getDeveloperhubBaseUrl,
  buildDeploymentUrl,
  safePromise,
  makeApiCall,
  safeDelete,
  readFileSafe,
  updateEnvFile,
  authenticateUser,
};
