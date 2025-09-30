const fs = require("fs");
const readlineSync = require("readline-sync");
const { makeApiCall, safePromise } = require("../utils");
const loginData = require("../credentials.json");

const INSTALLATIONS_FILE = "app-installation.json";

(async () => {
  try {
    if (!fs.existsSync(INSTALLATIONS_FILE)) {
      console.log("No installations found.");
      return;
    }

    const installations = JSON.parse(
      fs.readFileSync(INSTALLATIONS_FILE, "utf-8")
    );
    if (!installations.length) {
      console.log("No installations found.");
      return;
    }

    // Use the last installed app
    const selectedApp = installations[installations.length - 1];

    console.log(selectedApp);
    if (!selectedApp.contentTypeUid) {
      console.log(
        "No content types found for this app. Please create a content type first."
      );
      return;
    }

    const selectedCt = selectedApp.contentTypeUid;

    // Ask for entry details
    const entryTitle = readlineSync.question("Enter title for the new entry: ");

    // Determine field type
    const fieldUid = selectedApp.isRte ? "dam_rte_field" : "dam_field";

    const entryData = selectedApp.isRte
      ? {
          new_title: entryTitle,
          [fieldUid]: {
            type: "doc",
            attrs: {},
            children: [
              {
                type: "DAM",
                attrs: {
                  _id: 1,
                  assetName: "Sample Asset",
                  width: 100,
                  height: 100,
                  size: 1000,
                  assetUrl: "/static/media/sample.jpeg",
                },
                children: [{ text: "" }],
              },
            ],
          },
        }
      : {
          new_title: entryTitle,
          locale: "en-us",
          [fieldUid]: [
            {
              _id: 1,
              assetName: "Sample Asset",
              width: 500,
              height: 500,
              size: 1000,
              assetUrl: "/static/media/sample.jpeg",
            },
          ],
        };

    // Create entry
    const [entryErr, entryRes] = await safePromise(
      makeApiCall({
        url: `${selectedApp.csBaseUrl}/v3/content_types/${selectedApp.contentTypeUid}/entries`,
        method: "POST",
        headers: {
          authtoken: loginData.authtoken,
          api_key: selectedApp.stackApiKey,
        },
        data: { entry: entryData },
      }),
      "Failed to create entry"
    );

    if (entryErr) return console.error(entryErr);

    console.log("Entry created successfully:", entryRes.entry.uid);
  } catch (error) {
    console.error("Error:", error.message || error);
  }
})();
