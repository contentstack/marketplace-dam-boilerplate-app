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
        console.info("\n⚠️  Note: Both RTE and Custom DAM fields will be created.");
        console.info("   For local development, only one can work at a time:");
        console.info("   - RTE Field: http://localhost:1268");
        console.info("   - Custom DAM Field: http://localhost:4000");
        console.info("   Start the appropriate server to test each field type.\n");

        const appManifest = { ...devAppManifest };
<<<<<<< HEAD
        await createAndDeployApp(appManifest);
=======

        if (appManifest.uid) {
          console.log(
            "You have already created app named - " + appManifest.name
          );
          const url = `${appBaseUrl}/#!/developerhub/app/${appManifest.uid}/ui-locations`;
          openLink(url);
          return;
        }

        const appName = readlineSync.question("Enter name of app: ");
        const selection = readlineSync.keyInSelect(
          ["RTE Field", "Custom DAM Field", "Both (RTE + Custom DAM)"],
          "Which type of field do you want to create?"
        );
        if (selection === -1)
          return console.info("No field type selected. Exiting...");

        console.info(
          `You selected: ${
            selection === 0
              ? "RTE Field"
              : selection === 1
              ? "Custom DAM Field"
              : "Both"
          }`
        );

        if (selection === 0) {
          // RTE Only
          fieldType = "RTE";
          appManifest.hosting = {
            provider: "external",
            deployment_url: "http://localhost:1268",
          };
          appManifest.ui_location = {
            base_url: "http://localhost:1268",
            locations: [
              {
                type: "cs.cm.stack.config",
                meta: [
                  {
                    path: "/config",
                    signed: false,
                    enabled: true,
                    required: true,
                  },
                ],
              },
              {
                type: "cs.cm.stack.rte",
                meta: [
                  {
                    name: "RTE Field",
                    path: "/dam.js",
                    signed: false,
                    enabled: true,
                    required: false,
                  },
                ],
              },
            ],
          };
        } else if (selection === 1) {
          // Custom DAM Only
          fieldType = "CUSTOM";
          appManifest.hosting = {
            provider: "external",
            deployment_url: "http://localhost:4000/#",
          };
          appManifest.ui_location = {
            base_url: "http://localhost:4000/#",
            locations: [
              {
                type: "cs.cm.stack.config",
                meta: [
                  {
                    path: "/config",
                    signed: false,
                    enabled: true,
                    required: true,
                  },
                ],
              },
              {
                type: "cs.cm.stack.custom_field",
                meta: [
                  {
                    multiple: false,
                    path: "/custom-field",
                    signed: false,
                    enabled: true,
                    data_type: "json",
                    required: false,
                    name: "DAM Field",
                  },
                ],
              },
            ],
          };
        } else {
          fieldType = "BOTH";
          appManifest.hosting = {
            provider: "external",
            deployment_url: "http://localhost:4000/#",
          };
          appManifest.ui_location = {
            base_url: "http://localhost:4000/#",
            locations: [
              {
                type: "cs.cm.stack.config",
                meta: [
                  {
                    path: "/config",
                    signed: false,
                    enabled: true,
                    required: true,
                  },
                ],
              },
              {
                type: "cs.cm.stack.custom_field",
                meta: [
                  {
                    multiple: false,
                    path: "/custom-field",
                    signed: false,
                    enabled: true,
                    data_type: "json",
                    required: false,
                    name: "DAM Field",
                  },
                ],
              },
              {
                type: "cs.cm.stack.rte",
                meta: [
                  {
                    name: "RTE Field",
                    path: "/dam.js",
                    signed: false,
                    enabled: true,
                    required: false,
                  },
                ],
              },
            ],
          };
        }

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

        appManifest.uid = appData;
        appManifest.name = appName;

        const [appUpdateError, appUpdateData] = await safePromise(
          updateApp(
            appManifest,
            region,
            authtoken,
            selectedOrgUid,
            appManifest.uid
          ),
          "Error while creating the app."
        );
        appManifest.ui_location = appUpdateData?.data?.ui_location;
        updateAppManifest(appManifest, appEnv);

        if (appUpdateError) {
          console.error(JSON.stringify(appError, null, 2));
          return;
        }
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
          selectedOrgUid,
          fieldType
        );
>>>>>>> 2aea1c5 (updated the scripts for deployment and did the code splitting)
      } else {
        const appManifest = { ...prodAppManifest };

        if (appManifest.hosting.environment_uid) {
<<<<<<< HEAD
          await createAndDeployApp(appManifest);
=======
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

          appManifest.uid = appData;
          appManifest.name = appName;

          const [appUpdateError, appUpdateData] = await safePromise(
            updateApp(
              appManifest,
              region,
              authtoken,
              selectedOrgUid,
              appManifest.uid
            ),
            "Error while creating the app."
          );

          appManifest.ui_location = appUpdateData?.data?.ui_location;
          updateAppManifest(appManifest, appEnv);

          if (appUpdateError) {
            console.error(JSON.stringify(appError, null, 2));
            return;
          }
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
            selectedOrgUid,
            "BOTH"
          );
>>>>>>> 2aea1c5 (updated the scripts for deployment and did the code splitting)
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
        appManifest.ui_location = appData?.data?.ui_location;
        updateAppManifest(appManifest, appEnv);

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
