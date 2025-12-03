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

    const useLatest = process.argv[2];
    let selectedApp;

    if (useLatest) {
      selectedApp = installationData[installationData.length - 1];
      console.info("Using the latest app:", selectedApp.appName || selectedApp.appUid);
    } else {
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

      selectedApp = installationData[selectedIndex];
      console.info("You selected:", selectedApp.appName || selectedApp.appUid);
    }

    const { stackApiKey, installationUid, csBaseUrl } = selectedApp;

    const extensionResults = await getExtension(
      csBaseUrl,
      loginData.authtoken,
      stackApiKey,
      installationUid
    );

    if (!extensionResults) {
      console.error("Failed to get extension UIDs");
      return;
    }

    const ctTitle = readlineSync.question("Enter a unique Content-type name: ");

    const ctUid = ctTitle.trim().replace(/ /g, "_");

    const schema = buildContentTypeSchema(extensionResults);

    await createContentType(
      csBaseUrl,
      loginData.authtoken,
      stackApiKey,
      ctTitle,
      ctUid,
      schema
    );

    await createSampleEntry(
      csBaseUrl,
      loginData.authtoken,
      stackApiKey,
      ctUid,
      ["dam_rte_field", "dam_field"]
    );
  } catch (error) {
    console.error("Failed in content-model:", error.message || error);
  }
})();
