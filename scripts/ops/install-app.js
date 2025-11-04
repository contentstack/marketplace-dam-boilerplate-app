const readlineSync = require("readline-sync");
const {
  getOrgStacks,
  safePromise,
  installApp,
  updateInstallation,
  saveInstallation,
  getInstalledApps,
} = require("../utils");
const appManifest = require("../app-manifest.json");

const install = async (
  region,
  appUid,
  baseUrl,
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
    getInstalledApps(baseUrl, authtoken, orgId, stackApiKey),
    "Failed to fetch installed apps!"
  );
  if (installedError) return;

  const existingApp = installedAppsData?.extensions?.find(
    (app) => app.app_uid === appManifest.uid
  );

  let installData;
  if (existingApp) {
    console.info(
      `App already installed in this stack (${stackChoices[stackIndex]}). Updating installation...`
    );

    const [updateError, updatedData] = await safePromise(
      updateInstallation(
        region,
        authtoken,
        orgId,
        appUid,
        stackApiKey,
        fieldType
      ),
      "Failed to update existing installation"
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
  }

  // Save installation info locally
  saveInstallation(
    appManifest.name,
    appUid,
    stackApiKey,
    installData.data.installation_uid,
    fieldType,
    baseUrl
  );
  console.info("App installation info saved successfully.");

  return installData;
};

module.exports = install;
