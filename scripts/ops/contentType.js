const fs = require("fs");
const readlineSync = require("readline-sync");
const { makeApiCall, safePromise } = require("../utils");
const { getExtensionUid } = require("./extension");
const { createSampleEntry } = require("./entry");
const loginData = require("../credentials.json");
const installationData = require("../app-installation.json");

(async () => {
  try {
    if (!loginData.authtoken)
      return console.info("Login credentials not found.");

    if (!installationData.length) {
      console.log("No installations found.");
      return;
    }

    // Show user list of apps
    const appChoices = installationData.map(
      (inst) => inst.appName || inst.appUid
    );
    const selectedIndex = readlineSync.keyInSelect(
      appChoices,
      "Select an app for which you want to create a Content Type"
    );

    if (selectedIndex === -1) {
      console.log("No app selected. Exiting...");
      return;
    }

    const selectedApp = installationData[selectedIndex];
    console.log("You selected:", selectedApp);

    const { stackApiKey, installationUid, isRte, csBaseUrl } = selectedApp;

    // Fetch extension UID for the stored field type
    const extensionUid = await getExtensionUid(
      csBaseUrl,
      loginData.authtoken,
      stackApiKey,
      installationUid,
      isRte
    );

    // Create schema
    const schema = [
      {
        display_name: "Title",
        uid: "new_title",
        data_type: "text",
        mandatory: false,
        unique: false,
        multiple: false,
        non_localizable: false,
      },
      isRte
        ? {
            display_name: "DAM RTE Field",
            plugins: [extensionUid],
            field_metadata: {
              allow_json_rte: true,
              rich_text_type: "advanced",
            },
            uid: "dam_rte_field",
            data_type: "json",
            mandatory: false,
            multiple: false,
            non_localizable: false,
            unique: false,
          }
        : {
            display_name: "DAM Field",
            extension_uid: extensionUid,
            field_metadata: { extension: true },
            uid: "dam_field",
            data_type: "json",
            mandatory: false,
            multiple: false,
            non_localizable: false,
            unique: false,
          },
    ];

    const ctUid = isRte ? "dam_rte_example" : "dam_example";
    const title = isRte ? "DAM RTE Example" : "DAM Example";

    // Create content type
    const [ctError, ctData] = await safePromise(
      makeApiCall({
        url: `${csBaseUrl}/v3/content_types`,
        method: "POST",
        headers: { authtoken: loginData.authtoken, api_key: stackApiKey },
        data: { content_type: { title, uid: ctUid, schema } },
      }),
      "Failed to create content type"
    );

    if (ctError) {
      console.error("Error creating content type:", ctError);
      return;
    }

    console.log("Content Type created:", ctData.content_type.uid);

    const createEntrySample = readlineSync.keyInSelect(
      ["Yes", "No"],
      "Create Sample Entry for this Content Type?"
    );

    if (createEntrySample === 0) {
      const fieldUid = isRte ? "dam_rte_field" : "dam_field";
      await createSampleEntry(
        csBaseUrl,
        loginData.authtoken,
        stackApiKey,
        ctUid,
        fieldUid,
        isRte
      );
    } else {
      console.log("Skipped entry creation.");
    }
  } catch (error) {
    console.error("Error:", error.message || error);
  }
})();
