const fs = require("fs");
const path = require("path");

const INSTALLATIONS_FILE = "app-installation.json";

const saveInstallation = (
  appName,
  appUid,
  stackApiKey,
  installationUid,
  csBaseUrl,
  fieldType,
  appEnv
) => {
  let installations = [];
  const installationsPath = path.join(
    __dirname,
    `../../settings/${INSTALLATIONS_FILE}`
  );

  if (fs.existsSync(installationsPath)) {
    try {
      const installationData = fs.readFileSync(installationsPath, "utf-8");
      installations = JSON.parse(installationData);
    } catch (e) {
      console.error("Failed to parse installations.json, resetting file.");
    }
  }

  const exists = installations.find(
    (i) => i.appUid === appUid && i.stackApiKey === stackApiKey
  );

  if (!exists) {
    installations.push({
      appName,
      appUid,
      stackApiKey,
      installationUid,
      csBaseUrl,
      fieldType,
      appEnv,
    });
    fs.writeFileSync(
      installationsPath,
      JSON.stringify(installations, null, 2)
    );
  }
};

const updateAppManifest = (manifest, appEnv) => {
  fs.writeFileSync(
    path.join(__dirname, `../../settings/${appEnv}-app-manifest.json`),
    JSON.stringify(manifest, null, 2)
  );
};

const updateLaunchManifest = (manifest) => {
  fs.writeFileSync(
    path.join(__dirname, "../../settings/prod-app-launch-manifest.json"),
    JSON.stringify(manifest, null, 2)
  );
};

const getLaunchManifest = () => {
  try {
    const launchData = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "../../settings/prod-app-launch-manifest.json"),
        "utf8"
      ) || "{}"
    );
    return {
      data: launchData,
      created:
        launchData?.project_uid &&
        launchData?.env_uid &&
        launchData?.deployment_uid &&
        launchData?.deployment_url
          ? true
          : false,
    };
  } catch (err) {
    console.error("Error reading or parsing file:", err);
    return { data: {}, created: false };
  }
};

module.exports = {
  saveInstallation,
  updateAppManifest,
  updateLaunchManifest,
  getLaunchManifest,
};

