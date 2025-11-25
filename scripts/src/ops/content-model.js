const readlineSync = require("readline-sync");
const {
  getExtension,
  createContentType,
  createSampleEntry,
  buildContentTypeSchema,
} = require("../utils");
const loginData = require("../../settings/credentials.json");
const installationData = require("../../settings/app-installation.json");

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

    const extensionResults = await getExtension(
      csBaseUrl,
      loginData.authtoken,
      stackApiKey,
      installationUid,
      fieldType
    );

    if (!extensionResults) {
      console.error("Failed to get extension UIDs");
      return;
    }

    const ctTitle = readlineSync.question(
      "Enter a unique Content-type name: "
    );

    const ctUid = ctTitle.trim().replace(/ /g, "_");

    const schema = buildContentTypeSchema(
      fieldType,
      extensionResults
    );

    try {
      await createContentType(
        csBaseUrl,
        loginData.authtoken,
        stackApiKey,
        ctTitle,
        ctUid,
        schema
      );
    } catch (error) {
      console.error("Failed to create content type:", error);
      return;
    }

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
  } catch (error) {
    console.error("Error:", error.message || error);
  }
})();
