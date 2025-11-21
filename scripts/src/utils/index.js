const axios = require("axios");
const constants = require("../constants");
const fs = require("fs");
const FormData = require("form-data");
const path = require("path");
const AdmZip = require("adm-zip");
const { execSync, exec } = require("child_process");
const INSTALLATIONS_FILE = "app-installation.json";

const isEmpty = (val) =>
  val === undefined ||
  val === null ||
  (typeof val === "object" && !Object.keys(val)?.length) ||
  (typeof val === "string" && !val.trim().length);

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
  csBaseUrl,
  fieldType,
  appEnv
) => {
  let installations = [];
  if (
    fs.existsSync(path.join(__dirname, `../../settings/${INSTALLATIONS_FILE}`))
  ) {
    try {
      const installationData = fs.readFileSync(
        path.join(__dirname, `../../settings/${INSTALLATIONS_FILE}`),
        "utf-8"
      );
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
      appEnv
    });
    fs.writeFileSync(
      path.join(__dirname, `../../settings/${INSTALLATIONS_FILE}`),
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

const getEnvVariables = (launchSubDomain) => {
  try {
    const envVariables = [];

    const uiEnvData = fs.readFileSync(
      path.join(__dirname, "../../../ui/.env"),
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

    const url = constants.LAUNCH_DOMAIN.replace("$", launchSubDomain);
    envVariables.push(`{ key: "REACT_APP_UI_URL", value: "${url}" }`);
    envVariables.push(`{ key: "REACT_APP_API_URL", value: "${url}/api" }`);
    envVariables.push(
      `{ key: "REACT_APP_API_AUTH_URL", value: "${url}/auth" }`
    );

    return `[${envVariables.join(",")}]`;
  } catch (e) {
    throw new Error(`Error reading or parsing .env file: ${e.message}`);
  }
};

const runCommand = (command, options = {}) => {
  console.info(`Running "${command}"...`);
  execSync(command, {
    stdio: "inherit",
    shell: true,
    ...options
  });
};

const buildAppZip = () => {
  try {
    console.info("Preparing the app zip...");

    const uiAppBasePath = path.join(__dirname, "../../../ui");
    const rteAppBasePath = path.join(uiAppBasePath, "rte");
    const buildBasePath = path.join(__dirname, "../build");
    const buildPath = `${buildBasePath}/app.zip`;

    // Deleting existing build folder of UI if any
    if (fs.existsSync(`${uiAppBasePath}/build`))
      fs.rmSync(`${uiAppBasePath}/build`, { recursive: true, force: true });

    // Build the RTE plugin so the latest bundle ships with the app.
    runCommand("npm install", { cwd: rteAppBasePath });
    runCommand("npm run build", { cwd: rteAppBasePath });
    console.info("RTE plugin bundle ready.");

    // Deleting node_modules folder of UI to reduce zip size
    if (fs.existsSync(`${uiAppBasePath}/node_modules`))
      fs.rmSync(`${uiAppBasePath}/node_modules`, {
        recursive: true,
        force: true,
      });

    // Deleting the existing build folder
    if (fs.existsSync(buildBasePath))
      fs.rmSync(buildBasePath, {
        recursive: true,
        force: true,
      });

    // create a new build  folder
    fs.mkdirSync(buildBasePath);

    // Copy the UI app to build folder except the rte, example and build folders
    fs.cpSync(uiAppBasePath, buildBasePath, {
      recursive: true,
      filter: (src) => {
        const skipRTE = src.includes(path.join(uiAppBasePath, "rte"));
        const skipBuild = src.includes(path.join(uiAppBasePath, "build"));
        const skipExample = src.includes(path.join(uiAppBasePath, "example"));
        return !skipRTE && !skipBuild && !skipExample;
      },
    });

    //Upload the dam.js plugin file build in rte into public directory
    const damBundlePath = path.join(uiAppBasePath, "build", "dist", "dam.js");
    const pluginDestinationPath = path.join(
      buildBasePath,
      "public",
      "plugin.system.js"
    );

    if (!fs.existsSync(damBundlePath)) {
      throw new Error(
        "RTE build output (dam.js) not found. Please ensure the build succeeded."
      );
    }
    fs.mkdirSync(path.dirname(pluginDestinationPath), { recursive: true });
    fs.copyFileSync(damBundlePath, pluginDestinationPath);

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

const _getProjectMetaData = (name, uploadUid, envName, launchSubDomain) =>
  `{name: "${name}", fileUpload: {uploadUid: "${uploadUid}"}, projectType: "FILEUPLOAD", cmsStackApiKey: "", environment: {name: "${envName}", frameworkPreset: "CRA", buildCommand: "npm run build", outputDirectory: "./build", environmentVariables: ${getEnvVariables(
    launchSubDomain
  )}}}`;

const createProject = async (
  authtoken,
  orgId,
  baseUrl,
  name,
  uploadUid,
  envName,
  launchSubDomain
) => {
  try {
    console.info("Creating a launch project...");

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
            project: ${_getProjectMetaData(
              name,
              uploadUid,
              envName,
              launchSubDomain
            )}
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

    const projectUrl = `${baseUrl}/#!/launch/projects/${res?.data?.importProject?.uid}/envs/${res?.data?.importProject?.environments[0]?.uid}/deployments/${res?.data?.importProject?.environments[0]?.deployments?.edges[0]?.node?.uid}`;
    console.info("Project created successfully...");
    console.info(
      "Build and deployment has been initiated. You can checks the logs at: "+projectUrl
    );
    openLink(projectUrl);

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

const createApp = async (region, authtoken, orgId, appName, description) => {
  const res = await makeApiCall({
    url: `${getDeveloperhubBaseUrl(region)}/manifests`,
    method: "POST",
    headers: { authtoken, organization_uid: orgId },
    data: {
      name: appName,
      description,
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

// const updateApp = async (appEnv, region, authtoken, orgId, appUid,appName) => {
//   const manifest = fs.readFileSync(
//     path.join(__dirname, `../../settings/${appEnv}-app-manifest.json`),
//     "utf-8"
//   );
//   const manifestData = JSON.parse(manifest);
//   const name = appName? appName :manifestData.appName;

//   console.info({ manifestData });
//   if (manifestData.hosting.provider === "launch") {
//     return makeApiCall({
//       url: `${getDeveloperhubBaseUrl(region)}/manifests/${appUid}`,
//       method: "PUT",
//       headers: { authtoken, organization_uid: orgId },
//       data: { hosting: { ...manifestData.hosting }, uid: appUid },
//     });
//   } else {
//     return makeApiCall({
//       url: `${getDeveloperhubBaseUrl(region)}/manifests/${appUid}`,
//       method: "PUT",
//       headers: { authtoken, organization_uid: orgId },
//       data: { ...manifestData, name },
//     });
//   }
// };

const updateApp = async (manifest, region, authtoken, orgId, appUid) =>
  makeApiCall({
    url: `${getDeveloperhubBaseUrl(region)}/manifests/${appUid}`,
    method: "PUT",
    headers: { authtoken, organization_uid: orgId },
    data: manifest,
  });

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

const getInstalledApps = async (baseUrl, authtoken, stackApiKey) => {
  return makeApiCall({
    method: "GET",
    url: `${baseUrl}/v3/extensions?include_marketplace_extensions=true`,
    headers: {
      authtoken,
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

const openLink = (url) => {
  const cmd =
    process.platform === "win32"
      ? `start ${url}`
      : process.platform === "darwin"
      ? `open "${url}"`
      : `xdg-open "${url}"`;
  exec(cmd, (err) => {
    if (err) {
      console.error("Failed to open the link in browser: ", url);
      return;
    }
  });
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
  }
};

const reDeployProject = async (
  authtoken,
  orgId,
  baseUrl,
  uploadUid,
  launchMetaData
) => {
  try {
    const res = await makeApiCall({
      method: "POST",
      maxBodyLength: Infinity,
      url: `${baseUrl}/${constants.LAUNCH_BASE_PATH}`,
      headers: {
        authtoken,
        organization_uid: orgId,
        "x-project-uid": launchMetaData?.project_uid,
        "content-type": "application/json",
      },
      data: JSON.stringify({
        query: `fragment CoreDeploymentFields on Deployment {
            uid
            environment
            status
            createdAt
            deploymentNumber
            deploymentUrl
            previewUrl
          }

          mutation createNewFileDeployment {
            createDeployment(
              deployment: {environment: "${launchMetaData?.env_uid}", uploadUid: "${uploadUid}"}
            ) {
              ...CoreDeploymentFields
            }
          }`,
        variables: {},
      }),
    });

    const projectUrl = `${baseUrl}/#!/launch/projects/${launchMetaData?.project_uid}/envs/${launchMetaData?.env_uid}/deployments/${res?.data?.createDeployment?.uid}`;
    console.info("redeployment was successfully...");
    console.info(
      "Build and deployment has been initiated. You can checks the logs at: "+projectUrl
    );
    openLink(projectUrl);

    return res?.data?.createDeployment?.uid;
  } catch (error) {
    console.error("Error while redeploying.");
    console.info(JSON.stringify(error, null, 2));
    throw error;
  }
};

module.exports = {
  isEmpty,
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
  openLink,
  getLaunchManifest,
  reDeployProject
};
