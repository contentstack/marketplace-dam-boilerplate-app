const readlineSync = require("readline-sync");
const {
  getExtension,
  createContentType,
  createSampleEntry,
  buildContentTypeSchema,
  getBaseUrl,
  getAppBaseUrl,
  safePromise,
  openLink,
} = require("../utils");
const loginData = require("../../settings/credentials.json");
const appInstallations = require("../../settings/app-installations.json");

(async () => {
  try {
    if (
      readlineSync.keyInYN("Do you want a new sample content type & an entry?")
    ) {
      const appEnv = process.argv[2];
      const authtoken = loginData?.authtoken;

      if (!authtoken) {
        console.info(
          'Login credentials not found. Please login using "npm run login"'
        );
        return;
      }
      if (!appInstallations.apps.length) {
        console.info(
          "App installations not found. Please install the app locally."
        );
        return;
      }

      const appInstallationData = appInstallations.apps.find(
        (app) => app.env === appEnv
      );

      const {
        region,
        org_uid: orgId,
        stack_api_key: stackApiKey,
        installation_uid: installationUid,
      } = appInstallationData;
      const baseUrl = getBaseUrl(region);
      const appBaseUrl = getAppBaseUrl(region);
      const ctName = readlineSync.question(
        "Enter a unique Content-type name: "
      );

      const extensions = await getExtension(
        baseUrl,
        authtoken,
        stackApiKey,
        installationUid
      );

      if (!extensions) {
        console.info("The app is not installed or extensions not found.");
        return;
      }

      const schema = buildContentTypeSchema(extensions);

      const [contentTypeError, contentTypeData] = await safePromise(
        createContentType(
          baseUrl,
          authtoken,
          orgId,
          stackApiKey,
          ctName,
          schema
        ),
        "Error while creating content type."
      );
      if (contentTypeError) return;
      console.info("Content type created.");

      const contentTypeId = contentTypeData?.content_type?.uid;

      const [EntryError, EntryData] = await safePromise(
        createSampleEntry(baseUrl, authtoken, stackApiKey, contentTypeId, [
          "dam_rte_field",
          "dam_field",
        ]),
        "Error while creating an entry."
      );
      if (EntryError) return;

      console.info("Entry created.");

      const ctUrl = `${appBaseUrl}/#!/stack/${stackApiKey}/content-type/${contentTypeId}/content-type-builder`;
      const entryUrl = `${appBaseUrl}/#!/stack/${stackApiKey}/content-type/${contentTypeId}/en-us/entry/${EntryData?.entry.uid}/edit`;

      console.info("Content type url: ");
      openLink(ctUrl, "content-model-type");
      console.info("Entry url: ");
      openLink(entryUrl, "content-model-entry");
    }
  } catch (err) {
    console.info(err);
    console.info("Something went wrong while creating a content type & entry.");
  }
})();
