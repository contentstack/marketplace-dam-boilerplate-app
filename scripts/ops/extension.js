const { makeApiCall, safePromise } = require("../utils");

/**
 * Get the extension UID for the installed app in a stack
 * @param {string} csBaseUrl - Base URL for Contentstack region
 * @param {string} authtoken - Auth token from login
 * @param {string} stackApiKey - API key of the stack
 */

async function getExtensionUid(
  csBaseUrl,
  authtoken,
  stackApiKey,
  installationUid,
  selection
) {
  try {
    const [extErr, extensions] = await safePromise(
      makeApiCall({
        url: `${csBaseUrl}/v3/extensions?include_marketplace_extensions=true`,
        method: "GET",
        headers: { authtoken, api_key: stackApiKey },
      })
    );

    if (extErr) {
      console.error(
        "Failed to fetch extensions:",
        extErr.response?.data || extErr.message
      );
      return;
    }

    const type = selection === 1 ? "rte_plugin" : "field";
    const damExtension = extensions.extensions.find(
      (ext) => ext.app_installation_uid === installationUid && ext.type === type
    );
    console.log(damExtension);

    if (!damExtension) {
      console.error("No DAM extension found in this stack.");
      return;
    }

    return damExtension.uid;
  } catch (err) {
    console.error(
      "Failed to create content type with DAM field:",
      err.response?.data || err.message
    );
    throw err;
  }
}

module.exports = { getExtensionUid };
