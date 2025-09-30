const fs = require("fs");
const path = require("path");
const readlineSync = require("readline-sync");
const contentstack = require("@contentstack/marketplace-sdk");
const {
  makeApiCall,
  safePromise,
  getBaseUrl,
  getDeveloperhubBaseUrl,
  updateAppManifest,
  saveInstallation,
} = require("../utils");
const loginData = require("../credentials.json");
const appManifest = require("../app-manifest.json");

(async () => {
  try {
    let appUid;
    const op = process.argv[2]; // "create-app" or "update-app"
    const authtoken = loginData?.authtoken;
    const userOrgs = loginData?.userOrgs;
    const region = loginData?.region;
    const csBaseUrl = getBaseUrl(region);

    if (!authtoken) return console.info("Login credentials not found.");
    if (!userOrgs.length) return console.info("No organisations found...");

    const orgIndex = readlineSync.keyInSelect(
      userOrgs.map((org) => org.name),
      "Please select an organization"
    );
    if (orgIndex === -1) return;
    const selectedOrgUid = userOrgs[orgIndex].uid;

    // Ask user: RTE or Custom DAM Field
    const fieldType = readlineSync.keyInSelect(
      ["RTE Field", "Custom DAM Field"],
      "Which type of field do you want to create?"
    );
    if (fieldType === -1)
      return console.log("No field type selected. Exiting...");

    console.log(
      `You selected: ${fieldType === 0 ? "RTE Field" : "Custom DAM Field"}`
    );

    // Update app manifest dynamically
    const updatedManifest = { ...appManifest };
    if (fieldType === 0) {
      updatedManifest.ui_location.base_url = "http://localhost:1268";
      updatedManifest.ui_location.locations = [
        {
          type: "cs.cm.stack.config",
          meta: [{ title: "Configuration", path: "/config" }],
        },
        {
          type: "cs.cm.stack.rte",
          meta: [{ title: "Rte Field", path: "/dam.js", data_type: "json" }],
        },
      ];
    } else {
      updatedManifest.ui_location.base_url = "http://localhost:4000/#";
      updatedManifest.ui_location.locations = [
        {
          type: "cs.cm.stack.config",
          meta: [{ title: "Configuration", path: "/config" }],
        },
        {
          type: "cs.cm.stack.custom_field",
          meta: [
            { title: "DAM Field", path: "/custom-field", data_type: "json" },
          ],
        },
      ];
    }

    // Create or update app
    const client = contentstack.client({ authtoken, region });
    const marketplace = client.marketplace(selectedOrgUid);

    if (op === "create-app") {
      const appName = readlineSync.question("Enter name of app: ");
      const app = await marketplace.app().create({
        ...updatedManifest,
        name: appName,
        ui_location: { ...updatedManifest.ui_location },
      });
      appUid = app.uid;
      updateAppManifest(appName, appUid, updatedManifest);
      console.log("App created successfully");
    } else if (op === "update-app") {
      appUid = appManifest.uid;
      const [stackError] = await safePromise(
        makeApiCall({
          url: `${getDeveloperhubBaseUrl(region)}/manifests/${appUid}`,
          method: "PUT",
          headers: { authtoken, organization_uid: selectedOrgUid },
          data: updatedManifest,
        }),
        "Failed to update app!"
      );
      if (stackError) return console.error(stackError);
      updateAppManifest(appManifest.name, appUid, updatedManifest);

      const [hostingError] = await safePromise(
        makeApiCall({
          url: `${getDeveloperhubBaseUrl(region)}/manifests/${appUid}`,
          method: "PUT",
          headers: { authtoken, organization_uid: selectedOrgUid },
          data: {
            uid: appUid,
            hosting: {
              provider: "external",
              deployment_url: updatedManifest.ui_location.base_url,
              environment_uid: "",
              project_uid: "",
            },
          },
        }),
        "Failed to update hosting URL!"
      );
      if (hostingError) return console.error(hostingError);
      console.log("App updated successfully");
    }

    // Optionally install app
    console.log("Do you want to install this app now?");
    const installChoice = readlineSync.keyInSelect(
      ["Yes", "No"],
      "Select an option"
    );

    switch (installChoice) {
      case 0: {
        const [stackError, stackData] = await safePromise(
          makeApiCall({
            url: `${csBaseUrl}/v3/stacks?organization_uid=${selectedOrgUid}`,
            method: "GET",
            headers: { authtoken },
          }),
          "No stacks found!"
        );
        if (stackError) return;

        const stackChoices = stackData.stacks.map((s) => s.name);
        const stackIndex = readlineSync.keyInSelect(
          stackChoices,
          "Select a stack to install the app:"
        );
        if (stackIndex === -1) throw new Error("No stack selected!");
        const STACK_API_KEY = stackData.stacks[stackIndex].api_key;

        const installation = await marketplace.app(appUid).install({
          targetUid: STACK_API_KEY,
          targetType: "stack",
        });

        console.log("App installed successfully");

        // Save installation details
        saveInstallation(
          appManifest.name,
          appManifest.uid,
          STACK_API_KEY,
          installation.installation_uid,
          fieldType,
          csBaseUrl
        );
        break;
      }

      case 1:
        console.log(
          `App ${
            op === "create-app" ? "created" : "updated"
          } but not installed.`
        );
        break;

      case -1:
        console.log("Cancelled installation...");
        break;
    }
  } catch (error) {
    console.error("Error:", error.message || error);
  }
})();
