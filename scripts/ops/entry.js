const { makeApiCall, safePromise } = require("../utils");
const { exec } = require("child_process");

/**
 * Get the extension UID for the installed app in a stack
 * @param {string} csBaseUrl - Base URL for Contentstack region
 * @param {string} authtoken - Auth token from login
 * @param {string} stackApiKey - API key of the stack
 * @param {string} contentTypeUid - ContentType uid for entry
 * @param {string} fieldUid - Type of field in entry
 * @param {boolean} isRte - API key of the stack
 */
async function createSampleEntry(
  csBaseUrl,
  authtoken,
  stackApiKey,
  contentTypeUid,
  fieldUid,
  isRte
) {
  const entryData = isRte
    ? {
        new_title: "Entry with JSON RTE",
        [fieldUid]: {
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
                assetUrl:
                  "/static/media/Colosseum_Rome.8b9e6781cbd3d63bc669.jpeg",
              },
              children: [{ text: "" }],
            },
          ],
        },
      }
    : {
        new_title: "Entry with DAM field",
        locale: "en-us",
        [fieldUid]: [
          {
            _id: 1,
            assetName: "Colosseum, Rome",
            width: 500,
            height: 500,
            size: 1000,
            assetUrl: "/static/media/Colosseum_Rome.8b9e6781cbd3d63bc669.jpeg",
          },
        ],
      };

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

  console.log("Entry created:", entryRes.entry.uid);

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
    else console.log(`Entry opened in browser: ${entryUrl}`);
  });

  return entryRes.entry.uid;
}

module.exports = { createSampleEntry };
