const { makeApiCall, safePromise } = require("../utils");

/**
 * Get the extension UID for the installed app in a stack
 * @param {string} csBaseUrl - Base URL for Contentstack region
 * @param {string} authtoken - Auth token from login
 * @param {string} stackApiKey - API key of the stack
 */

async function getExtension(
  csBaseUrl,
  authtoken,
  stackApiKey,
  installationUid,
  fieldType
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

    // Filter extensions that belong to this installation
    const appExtensions = extensions.extensions.filter(
      (ext) => ext.app_installation_uid === installationUid
    );

    if (!appExtensions.length) {
      console.error("No extensions found for this installation.");
      return;
    }

    if (fieldType === "RTE") {
      const rteExt = appExtensions.find((ext) => ext.type === "rte_plugin");
      return rteExt ? rteExt.uid : null;
    }

    if (fieldType === "CUSTOM") {
      const fieldExt = appExtensions.find((ext) => ext.type === "field");
      return fieldExt ? fieldExt.uid : null;
    }

    if (fieldType === "BOTH") {
      const rteExt = appExtensions.find((ext) => ext.type === "rte_plugin");
      const fieldExt = appExtensions.find((ext) => ext.type === "field");

      const result = [];
      if (rteExt) result.push({ type: "RTE", uid: rteExt.uid });
      if (fieldExt) result.push({ type: "CUSTOM", uid: fieldExt.uid });

      return result.length ? result : null;
    }
  } catch (err) {
    console.error(
      "Failed to fetch extensions for content type creation:",
      err.response?.data || err.message
    );
    throw err;
  }
}

module.exports = { getExtension };
