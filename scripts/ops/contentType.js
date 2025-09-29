const { safePromise, makeApiCall } = require("../utils");
const { getExtensionUid } = require("./extension");
const readlineSync = require("readline-sync");
const { exec } = require("child_process");

// Main function to create an entry
async function createEntry(
  csBaseUrl,
  authtoken,
  stackApiKey,
  contentTypeUid,
  fieldUid,
  selection
) {
  const entryData =
    selection === 1
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
              assetUrl:
                "/static/media/Colosseum_Rome.8b9e6781cbd3d63bc669.jpeg",
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

  console.log("🎉 Entry created:", entryRes.entry.uid);

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

// Main function to create Content Type
async function createContentType(
  csBaseUrl,
  authtoken,
  stackApiKey,
  installationUid,
  selection
) {
  try {
    const extensionUid = await getExtensionUid(
      csBaseUrl,
      authtoken,
      stackApiKey,
      installationUid,
      selection
    );

    const isRte = selection === 1;

    const schema = [
      {
        display_name: "Title",
        uid: "new_title",
        data_type: "text",
        mandatory: false,
        field_metadata: { _default: true, version: 3 },
        unique: false,
        multiple: false,
        non_localizable: false,
      },
      isRte
        ? {
            display_name: "DAM Rte Field",
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
            config: {},
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
            config: {},
          },
    ];

    const ctUid = isRte ? "dam_rte_example" : "dam_example";
    const title = isRte ? "DAM RTE Example" : "DAM Example";

    const [ctError, ctData] = await safePromise(
      makeApiCall({
        url: `${csBaseUrl}/v3/content_types`,
        method: "POST",
        headers: { authtoken, api_key: stackApiKey },
        data: { content_type: { title, uid: ctUid, schema } },
      }),
      "Failed to create content type"
    );

    if (ctError) {
      console.error(
        "Error creating content type:",
        ctError.response?.data || ctError.message
      );
      return;
    }

    console.log("Content type created:", ctData.content_type.uid);

    const createEntrySample = readlineSync.keyInSelect(
      ["Yes", "No"],
      "Create Entry for this Content Type?"
    );

    if (createEntrySample === 0) {
      const fieldUid = isRte ? "dam_rte_field" : "dam_field";
      await createEntry(
        csBaseUrl,
        authtoken,
        stackApiKey,
        ctUid,
        fieldUid,
        selection
      );
    } else {
      console.log("Skipped entry creation.");
    }
  } catch (err) {
    console.error(
      "Failed to create content type:",
      err.response?.data || err.message
    );
    throw err;
  }
}

module.exports = { createContentType };
