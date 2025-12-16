const fs = require("fs");
const path = require("path");

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

const updateAppInstallation = (installationData) => {
  fs.writeFileSync(
    path.join(__dirname, `../../settings/app-installations.json`),
    JSON.stringify(installationData, null, 2)
  );
};

module.exports = {
  updateAppInstallation,
  updateAppManifest,
  updateLaunchManifest,
  getLaunchManifest,
};
