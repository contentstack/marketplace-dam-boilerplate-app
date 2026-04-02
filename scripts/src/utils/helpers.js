const { exec, execSync } = require("child_process");
const fs = require("fs");
const axios = require("axios");
const readlineSync = require("readline-sync");
const path = require("path");
const constants = require("../constants");

const makeApiCall = async ({
  url,
  method,
  headers,
  data,
  maxBodyLength,
  printError = true,
}) => {
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
    if (printError) console.info(JSON.stringify(error));
    throw error.response?.data || error.message || error;
  }
};

const safePromise = (promise, errorText, printError = true) =>
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

const COLLECTED_LINKS_FILE = path.join(
  __dirname,
  "../../settings/collected-links.json"
);

const addLinkToCollection = (url, source = "unknown") => {
  try {
    let linksData = { links: [] };

    // Read existing links if file exists
    if (fs.existsSync(COLLECTED_LINKS_FILE)) {
      const fileContent = fs.readFileSync(COLLECTED_LINKS_FILE, "utf8");
      linksData = JSON.parse(fileContent);
    }

    // Add new link with metadata
    linksData.links.push({
      url,
      source,
      timestamp: new Date().toISOString(),
      opened: false,
    });

    // Write back to file
    fs.writeFileSync(COLLECTED_LINKS_FILE, JSON.stringify(linksData, null, 2));
    console.info(`Link collected: ${url}`);
  } catch (error) {
    console.error("Error collecting link:", error.message);
    // Fallback to immediate opening if collection fails
    openLinkImmediate(url);
  }
};

const openLinkImmediate = (url) => {
  console.info(url);
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

const openLink = (url, source = "unknown") => {
  // Check if we should collect links (when COLLECT_LINKS environment variable is set)
  if (process.env.COLLECT_LINKS === "true") {
    addLinkToCollection(url, source);
  } else {
    openLinkImmediate(url);
  }
};

const openAllCollectedLinks = () => {
  try {
    if (!fs.existsSync(COLLECTED_LINKS_FILE)) {
      console.info("No collected links found.");
      return;
    }

    const fileContent = fs.readFileSync(COLLECTED_LINKS_FILE, "utf8");
    const linksData = JSON.parse(fileContent);

    if (!linksData.links || linksData.links.length === 0) {
      console.info("No links to open.");
      return;
    }

    console.info(`Opening ${linksData.links.length} collected links...`);

    linksData.links.forEach((linkItem, index) => {
      if (!linkItem.opened) {
        console.info(
          `${index + 1}. Opening: ${linkItem.url} (from: ${linkItem.source})`
        );
        openLinkImmediate(linkItem.url);
        linkItem.opened = true;

        // Add a small delay between opening links to prevent overwhelming the system
        if (index < linksData.links.length - 1) {
          setTimeout(() => {}, 500);
        }
      }
    });

    // Update the file to mark links as opened
    fs.writeFileSync(COLLECTED_LINKS_FILE, JSON.stringify(linksData, null, 2));
  } catch (error) {
    console.error("Error opening collected links:", error.message);
  }
};

const clearCollectedLinks = () => {
  try {
    if (fs.existsSync(COLLECTED_LINKS_FILE)) {
      fs.unlinkSync(COLLECTED_LINKS_FILE);
    }
  } catch (error) {
    console.error("Error clearing collected links:", error.message);
  }
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
  openAllCollectedLinks,
  clearCollectedLinks,
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
