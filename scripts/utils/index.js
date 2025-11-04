const axios = require("axios");
const constants = require("../constants");
const fs = require("fs");
const FormData = require("form-data");
const path = require("path");
const AdmZip = require("adm-zip");
const INSTALLATIONS_FILE = "app-installation.json";
const appManifest = require("../app-manifest.json");

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
    console.error(error);
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
      fieldType,
      csBaseUrl,
    });
    fs.writeFileSync(
      "app-installation.json",
      JSON.stringify(installations, null, 2)
    );
  }
};

const updateAppManifest = (manifest) => {
  fs.writeFileSync("app-manifest.json", JSON.stringify(manifest, null, 2));
};

const updateLaunchManifest = (manifest) => {
  fs.writeFileSync("launch-manifest.json", JSON.stringify(manifest, null, 2));
};

const getEnvVariables = () => {
  try {
    const envVariables = [];

    const uiEnvData = fs.readFileSync(
      path.join(__dirname, "../../ui/.env"),
      "utf-8"
    );

    uiEnvData.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;

      const [key, ...rest] = trimmed.split("=");
      if (!key || rest.length === 0) return;

      let value = rest.join("=").trim();

      value = value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

      envVariables.push(`{ key: "${key.trim()}", value: "${value}" }`);
    });

    return `[${envVariables.join(",")}]`;
  } catch (e) {
    throw new Error(`Error reading or parsing .env file: ${e.message}`);
  }
};

const buildAppZip = () => {
  try {
    console.info("Preparing the app zip...");

    const uiAppBasePath = path.join(__dirname, "../../ui");
    const buildBasePath = path.join(__dirname, "../build");
    const buildPath = `${buildBasePath}/app.zip`;

    if (fs.existsSync(`${uiAppBasePath}/build`))
      fs.rmSync(`${uiAppBasePath}/build`, { recursive: true, force: true });

    if (fs.existsSync(`${uiAppBasePath}/node_modules`))
      fs.rmSync(`${uiAppBasePath}/node_modules`, {
        recursive: true,
        force: true,
      });

    if (fs.existsSync(buildBasePath))
      fs.rmSync(buildBasePath, {
        recursive: true,
        force: true,
      });

    fs.mkdirSync(buildBasePath);

    fs.cpSync(uiAppBasePath, buildBasePath, {
      recursive: true,
      filter: (src) => {
        return !src.includes(path.join(uiAppBasePath, "rte"));
      },
    });
    const uiPackageJson = JSON.parse(
      fs.readFileSync(`${uiAppBasePath}/package.json`, "utf8")
    );

    const appPackageJson = {
      ...uiPackageJson,
      dependencies: {
        ...uiPackageJson?.dependencies,
      },
    };

    fs.writeFileSync(
      `${buildBasePath}/package.json`,
      JSON.stringify(appPackageJson, null, 2)
    );

    const zip = new AdmZip();
    zip.addLocalFolder(buildBasePath);
    zip.writeZip(buildPath);

    console.info("App zip created successfully...");

    return buildPath;
  } catch (error) {
    console.error("Error while creating app zip.");
    throw error;
  }
};

const getUploadMetaData = async (authtoken, baseUrl, orgId) => {
  try {
    const res = await makeApiCall({
      url: `${baseUrl}/${constants.LAUNCH_BASE_PATH}`,
      method: "POST",
      maxBodyLength: Infinity,
      headers: {
        authtoken,
        "content-type": "application/json",
        organization_uid: orgId,
      },
      data: JSON.stringify({
        query: `mutation CreateSignedUploadUrl {
      createSignedUploadUrl {
      expiresIn
      uploadUid
      uploadUrl
      method
      fields {
        formFieldKey
        formFieldValue
      }
      headers {
        key
        value
      }
    }
  }`,
        variables: {},
      }),
    });

    return res?.data?.createSignedUploadUrl;
  } catch (error) {
    console.error("Error while getting upload metadata.");
    throw error;
  }
};

const _getUploadFormData = (metaData, filePath) => {
  let data = new FormData();

  (metaData.fields || []).forEach((field) => {
    data.append(field.formFieldKey, field.formFieldValue);
  });

  data.append("file", fs.createReadStream(filePath));

  return data;
};

const uploadAppZip = async (metaData, filePath = "") => {
  try {
    console.info("Uploading the app zip...");

    const data = _getUploadFormData(metaData, filePath);
    await makeApiCall({
      method: metaData?.method,
      maxBodyLength: Infinity,
      url: metaData?.uploadUrl,
      headers: {
        ...data.getHeaders(),
      },
      data,
    });

    console.info("App zip uploaded successfully...");
  } catch (error) {
    console.error("Error while uploading app zip.");
    throw error;
  }
};

const _getProjectMetaData = (name, uploadUid, envName) =>
  `{name: "${name}", fileUpload: {uploadUid: "${uploadUid}"}, projectType: "FILEUPLOAD", cmsStackApiKey: "", environment: {name: "${envName}", frameworkPreset: "CRA", buildCommand: "npm run build", outputDirectory: "./build", environmentVariables: ${getEnvVariables()}}}`;

const createProject = async (
  authtoken,
  orgId,
  baseUrl,
  name,
  uploadUid,
  envName
) => {
  try {
    console.info("Creating a launch project...");
    console.info({
      query: `mutation CreateProject {
        importProject(
          project: ${_getProjectMetaData(name, uploadUid, envName)}
        ) {
          projectType
          name
          uid
          cmsStackApiKey
          environments {
            uid
            deployments(first: 1, after: "", sortBy: "createdAt") {
              edges {
                node {
                  uid
                }
              }
            }
          }
          description
          repository {
            repositoryName
            username
            gitProviderMetadata {
              ... on GitHubMetadata {
                gitProvider
              }
              ... on ExternalGitProviderMetadata {
                gitProvider
              }
            }
          }
        }
      }`,
      variables: {},
    });

    const res = await makeApiCall({
      method: "POST",
      maxBodyLength: Infinity,
      url: `${baseUrl}/${constants.LAUNCH_BASE_PATH}`,
      headers: {
        authtoken,
        organization_uid: orgId,
        "content-type": "application/json",
      },
      data: JSON.stringify({
        query: `mutation CreateProject {
          importProject(
            project: ${_getProjectMetaData(name, uploadUid, envName)}
          ) {
            projectType
            name
            uid
            cmsStackApiKey
            environments {
              uid
              deployments(first: 1, after: "", sortBy: "createdAt") {
                edges {
                  node {
                    uid
                  }
                }
              }
            }
            description
            repository {
              repositoryName
              username
              gitProviderMetadata {
                ... on GitHubMetadata {
                  gitProvider
                }
                ... on ExternalGitProviderMetadata {
                  gitProvider
                }
              }
            }
          }
        }`,
        variables: {},
      }),
    });

    console.info("Project created successfully...");
    console.info(
      `Build and deployment has been initiated. You can checks the logs at ${baseUrl}/#!/launch/projects/${res?.data?.importProject?.uid}/envs/${res?.data?.importProject?.environments[0]?.uid}/deployments/${res?.data?.importProject?.environments[0]?.deployments?.edges[0]?.node?.uid}`
    );

    return {
      project_uid: res?.data?.importProject?.uid,
      env_uid: res?.data?.importProject?.environments[0]?.uid,
      deployment_uid:
        res?.data?.importProject?.environments[0]?.deployments?.edges[0]?.node
          ?.uid,
    };
  } catch (error) {
    console.error("Error while creating a launch project.");
    console.info(JSON.stringify(error, null, 2));
    throw error;
  }
};

const getProjectDetails = async (baseUrl, metaData, authtoken, orgId) => {
  const res = await makeApiCall({
    method: "POST",
    maxBodyLength: Infinity,
    url: `${baseUrl}/${constants.LAUNCH_BASE_PATH}`,
    headers: {
      authtoken,
      organization_uid: orgId,
      "x-project-uid": metaData?.project_uid,
      "content-type": "application/json",
    },
    data: JSON.stringify({
      query: `query getDeploymentsById {
  Deployment(
    query: {uid: "${metaData?.deployment_uid}", environment: "${metaData?.env_uid}"}
  ) {
    uid
    environment
    status
    deploymentUrl
  }
}`,
      variables: {},
    }),
  });

  return {
    ...metaData,
    deployment_url: `https://${res?.data?.Deployment?.deploymentUrl}`,
  };
};

const createApp = async (region, authtoken, orgId, appName) => {
  console.info({ region, authtoken, orgId, appName });
  const res = await makeApiCall({
    url: `${getDeveloperhubBaseUrl(region)}/manifests`,
    method: "POST",
    headers: { authtoken, organization_uid: orgId },
    data: {
      name: appName,
      description: appManifest?.description || "",
      target_type: "stack",
      version: 1,
      group: "user",
    },
  });

  return res.data.uid;
};

const getOrgStacks = async (baseUrl, authtoken, orgId) =>
  makeApiCall({
    url: `${baseUrl}/v3/stacks?organization_uid=${orgId}`,
    method: "GET",
    headers: { authtoken },
  });

const updateApp = async (region, authtoken, orgId, appUid, withhosting) => {
  if (withhosting) {
    return makeApiCall({
      url: `${getDeveloperhubBaseUrl(region)}/manifests/${appUid}`,
      method: "PUT",
      headers: { authtoken, organization_uid: orgId },
      data: { hosting: { ...appManifest.hosting }, uid: appUid },
    });
  } else {
    return makeApiCall({
      url: `${getDeveloperhubBaseUrl(region)}/manifests/${appUid}`,
      method: "PUT",
      headers: { authtoken, organization_uid: orgId },
      data: { ...appManifest },
    });
  }
};

const installApp = async (region, authtoken, orgId, appUid, stackApiKey) =>
  makeApiCall({
    url: `${getDeveloperhubBaseUrl(region)}/manifests/${appUid}/install`,
    method: "POST",
    headers: { authtoken, organization_uid: orgId },
    data: {
      target_type: "stack",
      target_uid: stackApiKey,
      include_draft: true,
    },
  });

const getInstalledApps = async (baseUrl, authtoken, orgId, stackApiKey) => {
  return makeApiCall({
    method: "GET",
    url: `${baseUrl}/v3/extensions?include_marketplace_extensions=true`,
    headers: {
      authtoken,
      organization_uid: orgId,
      api_key: stackApiKey,
      "content-type": "application/json",
    },
  });
};

const updateInstallation = async (
  region,
  authtoken,
  orgId,
  appUid,
  stackApiKey
) => {
  return makeApiCall({
    method: "PUT",
    url: `${getDeveloperhubBaseUrl(
      region
    )}/manifests/${appUid}/reinstall?include_draft=true`,
    headers: {
      authtoken,
      organization_uid: orgId,
      "content-type": "application/json",
    },
    data: {
      include_draft: true,
      target_type: "stack",
      target_uid: stackApiKey,
    },
  });
};

module.exports = {
  makeApiCall,
  safePromise,
  getBaseUrl,
  getDeveloperhubBaseUrl,
  saveInstallation,
  updateAppManifest,
  updateLaunchManifest,
  getEnvVariables,
  buildAppZip,
  getUploadMetaData,
  getAppBaseUrl,
  uploadAppZip,
  createProject,
  getProjectDetails,
  createApp,
  updateApp,
  installApp,
  getOrgStacks,
  getInstalledApps,
  updateInstallation,
};
