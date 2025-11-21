const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const AdmZip = require("adm-zip");
const constants = require("../constants");
const { makeApiCall } = require("./helpers");
const { openLink, runCommand } = require("./helpers");

const getEnvVariables = () => {
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

    return `[${envVariables.join(",")}]`;
  } catch (e) {
    throw new Error(`Error reading or parsing .env file: ${e.message}`);
  }
};

const buildAppZip = (projectName) => {
  try {
    console.info("Preparing the app zip...");

    const uiAppBasePath = path.join(__dirname, "../../../ui");
    const rteAppBasePath = path.join(uiAppBasePath, "rte");
    const buildBasePath = path.join(__dirname, "../build");
    const buildPath = `${buildBasePath}/app.zip`;
    const deploymentUrl = `https://${projectName.replace(/ /g, "-")}.contentstackapps.com`;


    const pluginUrl = `${deploymentUrl}/plugin.system.js`;
    console.info(`Using plugin URL in functions/dam.js: ${pluginUrl}`);

    // Deleting existing build folder of UI if any
    if (fs.existsSync(`${uiAppBasePath}/build`))
      fs.rmSync(`${uiAppBasePath}/build`, { recursive: true, force: true });

    // Update RTE .env file with deployment URL before building
    const rteEnvPath = path.join(rteAppBasePath, ".env");
    if (fs.existsSync(rteEnvPath)) {
      let rteEnvContent = fs.readFileSync(rteEnvPath, "utf-8");
      const lines = rteEnvContent.split("\n");

      const updatedLines = lines.map((line) => {
        const trimmed = line.trim();
        if (
          trimmed.startsWith("REACT_APP_CUSTOM_FIELD_URL") &&
          trimmed.includes("=")
        ) {
          const parts = trimmed.split("=");
          const currentUrl = parts.slice(1).join("=").trim();
          if (currentUrl !== deploymentUrl) {
            return `REACT_APP_CUSTOM_FIELD_URL=${deploymentUrl}`;
          }
        }
        return line;
      });

      fs.writeFileSync(rteEnvPath, updatedLines.join("\n"));

    }

    // Build the RTE plugin so the latest bundle ships with the app.
    runCommand("npm install", { cwd: rteAppBasePath });
    runCommand("npm run build", { cwd: rteAppBasePath });
    console.info("RTE plugin bundle ready.");

    // Update UI .env file with deployment URL before building
    const uiEnvPath = path.join(uiAppBasePath, ".env");
    if (fs.existsSync(uiEnvPath)) {
      let uiEnvContent = fs.readFileSync(uiEnvPath, "utf-8");
      const lines = uiEnvContent.split("\n");

      const updatedLines = lines.map((line) => {
        const trimmed = line.trim();
        if (
          trimmed.startsWith("REACT_APP_CUSTOM_FIELD_URL") &&
          trimmed.includes("=")
        ) {
          const parts = trimmed.split("=");
          const currentUrl = parts.slice(1).join("=").trim();
          if (currentUrl !== deploymentUrl) {
            updated = true;
            return `REACT_APP_CUSTOM_FIELD_URL=${deploymentUrl}`;
          }
        }
        return line;
      });
      fs.writeFileSync(uiEnvPath, updatedLines.join("\n"));
    }

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

    // create a new build folder
    fs.mkdirSync(buildBasePath, { recursive: true });

    // Copy the UI app to build folder except the rte, example, build
    fs.cpSync(uiAppBasePath, buildBasePath, {
      recursive: true,
      filter: (src) => {
        const skipRTE = src.includes(path.join(uiAppBasePath, "rte"));
        const skipBuild = src.includes(path.join(uiAppBasePath, "build"));
        const skipExample = src.includes(path.join(uiAppBasePath, "example"));
        return !skipRTE && !skipBuild && !skipExample;
      },
    });

    // Upload the dam.js plugin file build in rte into public directory
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

    // Create functions/dam.js file in build directory
    const functionsDir = path.join(buildBasePath, "functions");
    const damFunctionPath = path.join(functionsDir, "dam.js");
    fs.mkdirSync(functionsDir, { recursive: true });

    const damFunctionContent = `function allowCors(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
  }
}

async function getFile() {
  try {
    const response = await fetch(
      "${pluginUrl}"
    );
    if (!response.ok) {
      throw new Error(\`Failed to fetch file: \${response.statusText}\`);
    }
    const fileRes = await response.text();
    return fileRes;
  } catch (error) {
    console.error("Error fetching file:", error);
    throw error;
  }
}

export default async function handler(req, res) {
  allowCors(req, res);

  try {
    const file = await getFile();
    res.status(200).send(file);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
}
`;

    fs.writeFileSync(damFunctionPath, damFunctionContent);

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
  const data = new FormData();

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
              envName
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
      "Build and deployment has been initiated. You can checks the logs at: " +
        projectUrl
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
      "Build and deployment has been initiated. You can checks the logs at: " +
        projectUrl
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
  getEnvVariables,
  buildAppZip,
  getUploadMetaData,
  uploadAppZip,
  createProject,
  getProjectDetails,
  reDeployProject,
};
