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
const appInstallations = require("../../settings/app-installations.json");

(async () => {
  try {
    let appUid;
    const op = process.argv[2];
    const appEnv = process.argv[3];
    const context = authenticateUser();
    if (!context) return;

    const { authtoken, selectedOrgUid, region, baseUrl, appBaseUrl } = context;

    const createAndDeployApp = async (appManifest) => {
      console.info("\nNote: This will be your app on Developer Hub in the region you are logged into.\n");
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
        console.error(
          "App creation failed. Content model creation will be skipped."
        );
        process.exit(1);
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
        console.error(
          "App update failed. Content model creation will be skipped."
        );
        process.exit(1);
      }

      appManifest.ui_location = appUpdateData?.data?.ui_location;
      updateAppManifest(appManifest, appEnv);

      const url = `${appBaseUrl}/#!/developerhub/app/${appManifest.uid}/ui-locations`;

      console.info("App created successfully");

      await installApp(
        appEnv,
        region,
        appManifest.uid,
        baseUrl,
        appBaseUrl,
        authtoken,
        selectedOrgUid,
        url,
      );
    };

    if (op === "create-app") {
      // Check if an app already exists for this environment
      const existingApp = appInstallations.apps?.find(
        (app) => app.env === appEnv && app.app_uid
      );
      const appManifest = appEnv === "dev" ? devAppManifest : prodAppManifest;
      const hasExistingApp = existingApp || appManifest?.uid;

      if (hasExistingApp) {
        console.error(
          `\nError: An app already exists for the ${appEnv} environment.`
        );
        if (appManifest?.uid) {
          console.info(`   Existing app UID: ${appManifest.uid}`);
        }
        console.info(
          `   To update the existing app, use: npm run update-${appEnv}-app`
        );
        console.info(
          `   To view installed apps, check: scripts/settings/app-installations.json`
        );
        console.error(
          "\nApp creation skipped. Content model creation will be skipped.\n"
        );

        const url = `${appBaseUrl}/#!/developerhub/app/${appManifest?.uid}/ui-locations`;
        openLink(url);
        process.exit(1);
      }

      if (appEnv === "dev") {
        console.info(
          "\n Note: Both RTE and Custom DAM fields will be created."
        );
        console.info("   For local development, only one can work at a time.");
        console.info(
          "\n   Currently we have setup for Custom DAM Field in dev-app-manifest.json"
        );
        console.info("\n   To test the RTE Field:");
        console.info(
          '\n  Update dev-app-manifest.json with the URL: "http://localhost:1268"'
        );
        console.info(
          "\n  Start the RTE server by running 'npm run start' in the rte folder"
        );

        const appManifest = { ...devAppManifest };
        await createAndDeployApp(appManifest);
      } else {
        const appManifest = { ...prodAppManifest };

        if (appManifest.hosting.environment_uid) {
          await createAndDeployApp(appManifest);
        } else {
          console.info("Launch project is not yet linked");
          console.error(
            "App creation skipped. Content model creation will be skipped."
          );
          process.exit(1);
        }
      }
    } else if (op === "update-app") {
      if (
        readlineSync.keyInYN(
          `Have you updated the settings/${appEnv}-app-manifest.json?`
        )
      ) {
        appUid = appEnv === "dev" ? devAppManifest.uid : prodAppManifest.uid;
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

        await installApp(
          appEnv,
          region,
          appUid,
          baseUrl,
          appBaseUrl,
          authtoken,
          selectedOrgUid,
          url,
        );
      }
    }
  } catch (error) {
    console.info(error);
    console.error("Error:", error.message || error);
  }
})();
