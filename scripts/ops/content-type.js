const readlineSync = require("readline-sync");
const { makeApiCall, safePromise } = require("../utils");
const { getExtension } = require("./extension");
const { createSampleEntry } = require("./entry");
const loginData = require("../credentials.json");
const installationData = require("../app-installation.json");

(async () => {
  try {
    if (!loginData.authtoken) {
      console.info("Login credentials not found.");
      return;
    }

    if (!installationData.length) {
      console.info("No installations found.");
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
      console.info("No app selected. Exiting...");
      return;
    }

    const selectedApp = installationData[selectedIndex];
    console.info("You selected:", selectedApp);

    const { stackApiKey, installationUid, fieldType, csBaseUrl } = selectedApp;

    // Fetch extension UID(s)
    const extensionResults = await getExtension(
      csBaseUrl,
      loginData.authtoken,
      stackApiKey,
      installationUid,
      fieldType
    );

    // Initialize schema with just title
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
    ];

    let ctUid = "dam_example";
    let title = "DAM Example";

    if (fieldType === "RTE") {
      schema.push({
        display_name: "DAM RTE Field",
        plugins: [extensionResults], // uid string
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
      });
      ctUid = "dam_rte_example";
      title = "DAM RTE Example";
    } else if (fieldType === "CUSTOM") {
      schema.push({
        display_name: "DAM Field",
        extension_uid: extensionResults, // uid string
        field_metadata: { extension: true },
        uid: "dam_field",
        data_type: "json",
        mandatory: false,
        multiple: false,
        non_localizable: false,
        unique: false,
      });
      ctUid = "dam_custom_example";
      title = "DAM Custom Field Example";
    } else if (fieldType === "BOTH") {
      // extensionResults is an array here
      const rteExt = extensionResults.find((ext) => ext.type === "RTE");
      const fieldExt = extensionResults.find((ext) => ext.type === "CUSTOM");
      if (rteExt) {
        schema.push({
          display_name: "DAM RTE Field",
          plugins: [rteExt.uid],
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
        });
      }

      if (fieldExt) {
        schema.push({
          display_name: "DAM Field",
          extension_uid: fieldExt.uid,
          field_metadata: { extension: true },
          uid: "dam_field",
          data_type: "json",
          mandatory: false,
          multiple: false,
          non_localizable: false,
          unique: false,
        });
      }

      ctUid = "dam_both_example";
      title = "DAM Both Example";
    }

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
      console.error(
        "Error creating content type:",
        ctError.response?.data || ctError
      );
      return;
    }

    console.info("Content Type created:", ctData.content_type.uid);

    // Ask user to create entry
    const createEntrySample = readlineSync.keyInSelect(
      ["Yes", "No"],
      "Create Sample Entry for this Content Type?"
    );

    if (createEntrySample === 0) {
      if (fieldType === "RTE") {
        await createSampleEntry(
          csBaseUrl,
          loginData.authtoken,
          stackApiKey,
          ctUid,
          "dam_rte_field",
          true
        );
      } else if (fieldType === "CUSTOM") {
        await createSampleEntry(
          csBaseUrl,
          loginData.authtoken,
          stackApiKey,
          ctUid,
          "dam_field",
          false
        );
      } else if (fieldType === "BOTH") {
        await createSampleEntry(
          csBaseUrl,
          loginData.authtoken,
          stackApiKey,
          ctUid,
          ["dam_rte_field", "dam_field"],
          "BOTH"
        );
      }
    } else {
      console.info("Skipped entry creation.");
    }
  } catch (error) {
    console.error("Error:", error.message || error);
  }
})();
