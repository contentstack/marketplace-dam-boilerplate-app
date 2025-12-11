const readlineSync = require("readline-sync");
const {
  safePromise,
  updateAppManifest,
  createApp,
  updateApp,
  openLink,
  authenticateUser,
} = require("../utils");
const installApp = require("./install-app.js");
const prodAppManifest = require("../../settings/prod-app-manifest.json");
const devAppManifest = require("../../settings/dev-app-manifest.json");

(async () => {
  try {
    const op = process.argv[2];
    const appEnv = process.argv[3];
    
    const context = authenticateUser();
    if (!context) return;

    const { authtoken, selectedOrgUid, region, csBaseUrl, appBaseUrl } = context;

    const createAndDeployApp = async (appManifest) => {
      const appName = readlineSync.question("Enter name of app: ");
      appManifest.name = appName;

      const [appError, appData] = await safePromise(
        createApp(
          region,
          authtoken,
          selectedOrgUid,
          appName,
          appManifest.description
        ),
        "Error while creating the app."
      );

      if (appError) {
        console.error(JSON.stringify(appError, null, 2));
        return;
      }

      appManifest.uid = appData;

      const [appUpdateError, appUpdateData] = await safePromise(
        updateApp(
          appManifest,
          region,
          authtoken,
          selectedOrgUid,
          appManifest.uid
        ),
        "Error while updating the app."
      );

      if (appUpdateError) {
        console.error(JSON.stringify(appUpdateError, null, 2));
        return;
      }

      appManifest.ui_location = appUpdateData?.data?.ui_location;
      updateAppManifest(appManifest, appEnv);

      const url = `${appBaseUrl}/#!/developerhub/app/${appManifest.uid}/ui-locations`;
      console.info("App created successfully");
      openLink(url);

      await installApp(
        appEnv,
        region,
        appManifest.uid,
        csBaseUrl,
        appBaseUrl,
        authtoken,
        selectedOrgUid
      );
    };

    if (op === "create-app") {
      if (appEnv === "dev") {
        console.info("\n Note: Both RTE and Custom DAM fields will be created.");
        console.info("   For local development, only one can work at a time.");
        console.info("\n   Currently we have setup for Custom DAM Field in dev-app-manifest.json");
        console.info("\n   To test the RTE Field:");
        console.info("   1. Update dev-app-manifest.json with the new app URL:");
        console.info("      {");
        console.info("        \"ui_location\": {");
        console.info("          \"base_url\": \"http://localhost:1268\"");
        console.info("        },");
        console.info("        \"hosting\": {");
        console.info("          \"deployment_url\": \"http://localhost:1268\"");
        console.info("        }");
        console.info("      }\n");
        console.info("   2. Start the RTE server by running 'npm run start' in the rte folder");


        const appManifest = { ...devAppManifest };
        await createAndDeployApp(appManifest);
      } else {
        const appManifest = { ...prodAppManifest };

        if (appManifest.hosting.environment_uid) {
          await createAndDeployApp(appManifest);
        } else {
          console.info("Launch project is not yet linked");
        }
      }
    } else if (op === "update-app") {
      if (
        readlineSync.keyInYN(
          `Have you updated the settings/${appEnv}-app-manifest.json?`
        )
      ) {
        const appUid =
          appEnv === "dev" ? devAppManifest.uid : prodAppManifest.uid;
        const appManifest = appEnv === "dev" ? devAppManifest : prodAppManifest;

        const [appError, appData] = await safePromise(
          updateApp(appManifest, region, authtoken, selectedOrgUid, appUid),
          "Error while updating the app"
        );

        if (appError) {
          console.error(JSON.stringify(appError, null, 2));
          return;
        }

        appManifest.ui_location = appData?.data?.ui_location;
        updateAppManifest(appManifest, appEnv);

        console.info("App updated successfully");
        const url = `${appBaseUrl}/#!/developerhub/app/${appUid}/ui-locations`;
        openLink(url);

        await installApp(
          appEnv,
          region,
          appUid,
          csBaseUrl,
          appBaseUrl,
          authtoken,
          selectedOrgUid
        );
      }
    }
  } catch (error) {
    console.error("Error:", error.message || error);
  }
})();
