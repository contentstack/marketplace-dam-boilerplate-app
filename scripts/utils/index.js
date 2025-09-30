const axios = require("axios");
const constants = require("../constants");
const fs = require("fs");
const appManifest = require("../app-manifest.json");

const INSTALLATIONS_FILE = "app-installation.json";

const makeApiCall = async ({ url, method, headers, data, maxBodyLength }) => {
  try {
    const res = await axios({
      url,
      method,
      timeout: 60 * 1000,
      headers,
      ...(maxBodyLength ? { maxBodyLength } : {}),
      ...(["PUT", "POST", "DELETE", "PATCH"].includes(method) && {
        data,
      }),
    });

    return res?.data;
  } catch (error) {
    throw error.response.data || error.message || error;
  }
};

const safePromise = (promise, errorText) =>
  promise
    .then((res) => [null, res])
    .catch((err) => {
      console.error(errorText);
      return [err];
    });

const getBaseUrl = (region) => {
  const baseUrl = constants.BASE_URLS.find((item) => item.region === region);
  return baseUrl ? baseUrl.url : constants.BASE_URLS[0].url;
};

const getAppBaseUrl = (region) => {
  const baseUrl = constants.APP_BASE_URLS.find(
    (item) => item.region === region
  );
  return baseUrl ? baseUrl.url : constants.APP_BASE_URLS[0].url;
};

const getDeveloperhubBaseUrl = (region) =>
  constants.DEVELOPERHUB_BASE_URLS.find((url) => url.region === region)?.url ||
  constants.DEVELOPERHUB_BASE_URLS[0].url;

const updateAppManifest = (name, uid) => {
  fs.writeFileSync(
    "app-manifest.json",
    JSON.stringify({ ...appManifest, name, uid }, null, 2)
  );
};

const saveInstallation = (
  appName,
  appUid,
  stackApiKey,
  installationUid,
  fieldType,
  csBaseUrl
) => {
  let installations = [];
  if (fs.existsSync(INSTALLATIONS_FILE)) {
    try {
      installations = JSON.parse(fs.readFileSync(INSTALLATIONS_FILE, "utf-8"));
    } catch (e) {
      console.error("⚠️ Failed to parse installations.json, resetting file.");
    }
  }

  const exists = installations.find(
    (i) => i.appUid === appUid && i.stackApiKey === stackApiKey
  );

  if (!exists) {
    let isRte = true;
    if (fieldType) {
      isRte = false;
    }
    installations.push({
      appName,
      appUid,
      stackApiKey,
      installationUid,
      isRte,
      csBaseUrl,
    });
    fs.writeFileSync(
      "app-installation.json",
      JSON.stringify(installations, null, 2)
    );
  } else {
    console.log("ℹ️ Installation already recorded.");
  }
};

const updateInstallationContentType = (appUid, contentTypeUid) => {
  if (!fs.existsSync(INSTALLATIONS_FILE)) return;
  const installations = JSON.parse(
    fs.readFileSync(INSTALLATIONS_FILE, "utf-8")
  );
  const index = installations.findIndex((inst) => inst.appUid === appUid);
  if (index === -1) return;
  installations[index].contentTypeUid = contentTypeUid;
  fs.writeFileSync(INSTALLATIONS_FILE, JSON.stringify(installations, null, 2));
};

module.exports = {
  makeApiCall,
  safePromise,
  getBaseUrl,
  getDeveloperhubBaseUrl,
  updateAppManifest,
  getAppBaseUrl,
  saveInstallation,
  updateInstallationContentType,
};
