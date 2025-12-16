const readlineSync = require("readline-sync");
const fs = require("fs");
const path = require("path");
const {
  getOrgStacks,
  safePromise,
  installApp,
  updateInstallation,
  updateAppInstallation,
  getInstalledApps,
  openLink
} = require("../utils");
const appInstallationData = require("../../settings/app-installations.json");

const install = async (
  appEnv,
  region,
  appUid,
  baseUrl,
  appBaseUrl,
  authtoken,
  orgId
) => {
  if (readlineSync.keyInYN("Do you want to install the app?")) {
    const [stackError, stackData] = await safePromise(
      getOrgStacks(baseUrl, authtoken, orgId),
      "No stacks found!"
    );
    if (stackError) return;

    const stackChoices = stackData.stacks.map((s) => s.name);
    const stackIndex = readlineSync.keyInSelect(
      stackChoices,
      "Select a stack to install or update the app:"
    );
    if (stackIndex === -1) throw new Error("No stack selected!");
    const stackApiKey = stackData.stacks[stackIndex].api_key;
    const stackName = stackData.stacks[stackIndex].name;

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
    }

    const existingAppIndex = appInstallationData.apps.findIndex(
      (app) => app.env === appEnv
    );

    const newInstallationEntry = {
      env: appEnv,
      region,
      org_uid: orgId,
      app_uid: appUid,
      app_name: manifestData.app_name,
      stack_api_key: stackApiKey,
      stack_name: stackName,
      status: installData?.data?.status || "",
      installation_uid: installData?.data?.installation_uid,
    };

    let appInstallationManifest;
    if (existingAppIndex >= 0) {
      appInstallationManifest = {
        apps: appInstallationData.apps.map((app, index) =>
          index === existingAppIndex ? newInstallationEntry : app
        ),
      };
    } else {
      appInstallationManifest = {
        apps: [...appInstallationData.apps, newInstallationEntry],
      };
    }

    updateAppInstallation(appInstallationManifest);

    const configPage = `${appBaseUrl}/#!/marketplace/installed-apps/${installData?.data?.installation_uid}/configuration`;
    openLink(configPage);
    console.info("Installing app completed successfully");
  }
};

module.exports = install;
