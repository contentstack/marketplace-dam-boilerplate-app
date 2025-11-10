const readlineSync = require("readline-sync");
const {
  safePromise,
  getBaseUrl,
  updateAppManifest,
  createApp,
  updateApp,
} = require("../utils");
const installApp = require("./install-app");
const loginData = require("../credentials.json");
const appManifest = require("../app-manifest.json");

(async () => {
  try {
    let appUid, fieldType;
    const op = process.argv[2];
    const authtoken = loginData?.authtoken;
    const userOrgs = loginData?.userOrgs;
    const region = loginData?.region;
    const csBaseUrl = getBaseUrl(region);

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

    // Update app manifest dynamically
    const updatedManifest = { ...appManifest };

    if (op === "create-app") {
      // Ask user: RTE, Custom DAM, or Both
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

        updatedManifest.ui_location.base_url = "http://localhost:1268";
        updatedManifest.hosting.provider = "external";
        updatedManifest.hosting.deployment_url = "http://localhost:1268";
        updatedManifest.ui_location.locations = [
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
        ];
      } else if (selection === 1) {
        // Custom DAM Only
        fieldType = "CUSTOM";
        updatedManifest.ui_location.base_url = "http://localhost:4000/#";
        updatedManifest.hosting.provider = "external";
        updatedManifest.hosting.deployment_url = "http://localhost:4000/#";
        updatedManifest.ui_location.locations = [
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
        ];
      } else {
        fieldType = "BOTH";
        updatedManifest.ui_location.base_url = "http://localhost:4000/#";
        updatedManifest.hosting.provider = "external";
        updatedManifest.hosting.deployment_url = "http://localhost:4000/#";
        // Both RTE + Custom DAM
        updatedManifest.ui_location.locations = [
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
                name: "RTE Field",
                path: "/dam.js",
                enabled: true,
                required: false,
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
        ];
      }

      const appName = readlineSync.question("Enter name of app: ");

      const [appError, appData] = await safePromise(
        createApp(region, authtoken, selectedOrgUid, appName),
        "Error while creating the app."
      );

      if (appError) {
        console.error(JSON.stringify(appError, null, 2));
        return;
      }

      appUid = appData;

      await updateAppManifest({
        ...updatedManifest,
        name: appName,
        uid: appUid,
      });

      const [appUpdateError, appUpdateData] = await safePromise(
        updateApp(region, authtoken, selectedOrgUid, appUid, false, appName),
        "Error while creating the app."
      );

      if (appUpdateError) {
        console.error(JSON.stringify(appError, null, 2));
        return;
      }

      console.info("App created successfully");
    } else if (op === "update-app") {
      appUid = appManifest.uid;
      const [appError, appData] = await safePromise(
        updateApp(region, authtoken, selectedOrgUid, appUid, true),
        "Error while updating the app"
      );

      if (appError) {
        console.error(JSON.stringify(appError, null, 2));
        return;
      }

      console.info("App updated successfully");
    }

    await installApp(
      region,
      appUid,
      csBaseUrl,
      authtoken,
      selectedOrgUid,
      fieldType
    );
  } catch (error) {
    console.error("Error:", error.message || error);
  }
})();
