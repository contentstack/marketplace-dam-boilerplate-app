const readlineSync = require("readline-sync");
const {
  safePromise,
  getBaseUrl,
  getAppBaseUrl,
  updateAppManifest,
  createApp,
  updateApp,
  openLink,
} = require("../utils");
const installApp = require("./install-app.js");
const loginData = require("../../settings/credentials.json");
const prodAppManifest = require("../../settings/prod-app-manifest.json");
const devAppManifest = require("../../settings/dev-app-manifest.json");

(async () => {
  try {
    const op = process.argv[2];
    const appEnv = process.argv[3];
    const authtoken = loginData?.authtoken;
    const userOrgs = loginData?.userOrgs;
    const region = loginData?.region;
    const csBaseUrl = getBaseUrl(region);
    const appBaseUrl = getAppBaseUrl(region);

    if (!authtoken) {
      console.info("Login credentials not found. Please login.");
      return;
    }

    if (!userOrgs.length) {
      console.info("No organisations found...");
      return;
    }

    orgIndex = readlineSync.keyInSelect(
      userOrgs.map((org) => org.name),
      "Please select an organization"
    );

    if (orgIndex === -1) {
      console.info("No organization selected...");
      return;
    }

    const selectedOrgUid = userOrgs[orgIndex].uid;

    if (op === "create-app") {
      if (appEnv === "dev") {
        const appManifest = { ...devAppManifest };

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
                    title: "Configuration",
                    path: "/config",
                    required: true,
                    signed: false,
                  },
                ],
              },
              {
                type: "cs.cm.stack.rte",
                meta: [
                  {
                    title: "RTE Field",
                    path: "/dam.js",
                    enabled: true,
                    required: false,
                    signed: false,
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
                    title: "Configuration",
                    path: "/config",
                    required: true,
                    signed: false,
                  },
                ],
              },
              {
                type: "cs.cm.stack.custom_field",
                meta: [
                  {
                    name: "DAM Field",
                    path: "/custom-field",
                    data_type: "json",
                    enabled: true,
                    multiple: false,
                    required: false,
                    signed: false,
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
                    title: "Configuration",
                    path: "/config",
                    required: true,
                    signed: false,
                  },
                ],
              },
              {
                type: "cs.cm.stack.custom_field",
                meta: [
                  {
                    name: "DAM Field",
                    path: "/custom-field",
                    data_type: "json",
                    enabled: true,
                    multiple: false,
                    required: false,
                    signed: false,
                  },
                ],
              },
              {
                type: "cs.cm.stack.rte",
                meta: [
                  {
                    name: "RTE Field",
                    path: "/dam.js",
                    enabled: true,
                    required: false,
                    signed: false,
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
        updateAppManifest(appManifest, appEnv);

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
      } else {
        const appManifest = { ...prodAppManifest, name: appName };

        if (appManifest.hosting.environment_uid) {
          const appName = readlineSync.question("Enter name of app: ");
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
          updateAppManifest(appManifest, appEnv);

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
