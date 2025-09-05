const readlineSync = require("readline-sync");
const { safePromise, makeApiCall } = require("../utils");

async function installApp(app, marketplace, csBaseUrl, authtoken, orgUid) {
  const [stackError, stackData] = await safePromise(
    makeApiCall({
      url: `${csBaseUrl}/v3/stacks?organization_uid=${orgUid}`,
      method: "GET",
      headers: { authtoken },
    }),
    "No stacks found!"
  );
  if (stackError) return;

  const stackChoices = stackData.stacks.map((s) => s.name);
  const stackIndex = readlineSync.keyInSelect(
    stackChoices,
    "Select a stack to install the app:"
  );
  if (stackIndex === -1) {
    console.log("No stack selected, installation cancelled.");
    return;
  }

  const stackApiKey = stackData.stacks[stackIndex].api_key;
  const data = await marketplace
    .app(app.uid)
    .install({ targetUid: stackApiKey, targetType: "stack" });
  console.log(`✅ App installed in stack: ${stackApiKey}`);
}

module.exports = { installApp };
