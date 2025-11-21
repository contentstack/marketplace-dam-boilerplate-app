const readlineSync = require("readline-sync");
const fs = require("fs");
const path = require("path");
const {
  getOrgStacks,
  safePromise,
  installApp,
  updateInstallation,
  saveInstallation,
  getInstalledApps,
} = require("../utils");
const { openLink } = require("../utils");

const install = async (
  appEnv,
  region,
  appUid,
  baseUrl,
  appBaseUrl,
  authtoken,
  orgId,
  fieldType
) => {
  if (!readlineSync.keyInYN("Do you want to install or update the app?"))
    return;

  // Fetch available stacks
  const [stackError, stackData] = await safePromise(
    getOrgStacks(baseUrl, authtoken, orgId),
    "No stacks found!"
  );
  if (stackError) return;

  // Ask user to choose a stack
  const stackChoices = stackData.stacks.map((s) => s.name);
  const stackIndex = readlineSync.keyInSelect(
    stackChoices,
    "Select a stack to install or update the app:"
  );
  if (stackIndex === -1) throw new Error("No stack selected!");
  const stackApiKey = stackData.stacks[stackIndex].api_key;

  // Check if app already installed in the stack
  const [installedError, installedAppsData] = await safePromise(
    getInstalledApps(baseUrl, authtoken, stackApiKey),
    "Failed to fetch installed apps!"
  );

  if (installedError) return;

  const manifest = fs.readFileSync(
    path.join(__dirname, `../../settings/${appEnv}-app-manifest.json`),
    "utf-8"
  );
  const manifestData = JSON.parse(manifest);
 
  const existingApp = installedAppsData?.extensions?.find(
    (app) => app.app_uid === manifestData.uid
  );

  let installData;
  if (existingApp) {
    console.info(
      `App already installed in this stack (${stackChoices[stackIndex]}). Updating installation...`
    );

    const [updateError, updatedData] = await safePromise(
      updateInstallation(region, authtoken, orgId, appUid, stackApiKey),
      "App installation is already updated"
    );

    if (updateError) return;
    installData = updatedData;
  } else {
    console.info("Installing app...");
    const [installError, newInstallData] = await safePromise(
      installApp(region, authtoken, orgId, appUid, stackApiKey),
      "Failed to install the app"
    );

    if (installError) return;
    installData = newInstallData;

    const configPage = `${appBaseUrl}/#!/marketplace/installed-apps/${installData?.data?.installation_uid}/configuration`;
    openLink(configPage);
  }
  // Save installation info locally
  saveInstallation(
    manifestData.name,
    appUid,
    stackApiKey,
    installData.data.installation_uid,
    baseUrl,
    fieldType,
    appEnv
  );
  
  return installData;
};

module.exports = install;
