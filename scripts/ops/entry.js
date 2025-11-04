const { makeApiCall, safePromise } = require("../utils");
const { exec } = require("child_process");

/**
 * Get the extension UID for the installed app in a stack
 * @param {string} csBaseUrl - Base URL for Contentstack region
 * @param {string} authtoken - Auth token from login
 * @param {string} stackApiKey - API key of the stack
 * @param {string} contentTypeUid - ContentType uid for entry
 * @param {string} fieldUid - Type of field in entry
 * @param {string} type -  Field Type in entry
 */

async function createSampleEntry(
  csBaseUrl,
  authtoken,
  stackApiKey,
  contentTypeUid,
  fieldUid,
  type
) {
  let entryData = {
    new_title: "Sample DAM Entry",
    locale: "en-us",
  };

  if (type === true) {
    // RTE entry
    entryData[fieldUid] = {
      type: "doc",
      attrs: {},
      children: [
        {
          type: "DAM",
          attrs: {
            _id: 1,
            assetName: "Colosseum, Rome",
            width: 100,
            height: 100,
            size: 1000,
            assetUrl: "/static/media/Colosseum_Rome.8b9e6781cbd3d63bc669.jpeg",
          },
          children: [{ text: "" }],
        },
      ],
    };
  } else if (type === false) {
    // Custom field entry
    entryData[fieldUid] = [
      {
        _id: 1,
        assetName: "Colosseum, Rome",
        width: 500,
        height: 500,
        size: 1000,
        assetUrl: "/static/media/Colosseum_Rome.8b9e6781cbd3d63bc669.jpeg",
      },
    ];
  } else if (type === "BOTH" && Array.isArray(fieldUid)) {
    // Both field + RTE
    const [rteFieldUid, damFieldUid] = fieldUid;

    entryData[rteFieldUid] = {
      type: "doc",
      attrs: {},
      children: [
        {
          type: "DAM",
          attrs: {
            _id: 1,
            assetName: "Colosseum, Rome",
            width: 100,
            height: 100,
            size: 1000,
            assetUrl: "/static/media/Colosseum_Rome.8b9e6781cbd3d63bc669.jpeg",
          },
          children: [{ text: "" }],
        },
      ],
    };

    entryData[damFieldUid] = [
      {
        _id: 2,
        assetName: "Eiffel Tower, Paris",
        width: 600,
        height: 800,
        size: 2000,
        assetUrl: "/static/media/Colosseum_Rome.8b9e6781cbd3d63bc669.jpeg",
      },
    ];
  }

  // API call
  const [entryErr, entryRes] = await safePromise(
    makeApiCall({
      url: `${csBaseUrl}/v3/content_types/${contentTypeUid}/entries`,
      method: "POST",
      headers: { authtoken, api_key: stackApiKey },
      data: { entry: entryData },
    }),
    "Failed to create entry"
  );

  if (entryErr) {
    console.error(
      "Error creating entry:",
      entryErr.response?.data || entryErr.message
    );
    return null;
  }

  console.info("Entry created:", entryRes.entry.uid);

  // Open entry in browser
  const entryUrl = `https://app.contentstack.com/#!/stack/${stackApiKey}/content-type/${contentTypeUid}/en-us/entry/${entryRes.entry.uid}/edit?branch=main`;

  const startCmd =
    process.platform === "win32"
      ? `start ${entryUrl}`
      : process.platform === "darwin"
      ? `open "${entryUrl}"`
      : `xdg-open "${entryUrl}"`;

  exec(startCmd, (err) => {
    if (err) console.error("Failed to open entry in browser:", err);
    else console.info(`Entry opened in browser: ${entryUrl}`);
  });

  return entryRes.entry.uid;
}

module.exports = { createSampleEntry };
