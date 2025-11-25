const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const AdmZip = require("adm-zip");
const constants = require("../constants");
const { makeApiCall, openLink, runCommand, safeDelete, updateEnvFile } = require("./helpers");

const getEnvVariables = (launchSubDomain) => {
  try {
    const uiEnvPath = path.join(__dirname, "../../../ui/.env");
    const uiEnvData = fs.readFileSync(uiEnvPath, "utf-8");

    const envVariables = uiEnvData
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const [key, ...rest] = line.split("=");
        return { key: key?.trim(), value: rest.join("=").trim() };
      })
      .filter(({ key, value }) => key && value && !constants.EXCLUDED_ENVS.includes(key))
      .map(({ key, value }) => {
        const escapedValue = value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
        return `{ key: "${key}", value: "${escapedValue}" }`;
      });

    const url = constants.LAUNCH_DOMAIN.replace("$", launchSubDomain);
    envVariables.push(`{ key: "REACT_APP_CUSTOM_FIELD_URL", value: "${url}" }`);

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
    const deploymentUrl = `https://${projectName.replace(
      / /g,
      "-"
    )}.contentstackapps.com`;

    const pluginUrl = `${deploymentUrl}/plugin.system.js`;
    console.info(`Using plugin URL in functions/dam.js: ${pluginUrl}`);

    // Clean up existing build folders
    safeDelete(path.join(uiAppBasePath, "build"));
    safeDelete(buildBasePath);

    // Temporarily update .env file in RTE directory with deployment URL
    const rteEnvPath = path.join(rteAppBasePath, ".env");
    const originalEnvContent = updateEnvFile(rteEnvPath, "REACT_APP_CUSTOM_FIELD_URL", deploymentUrl);
    console.info(`Updated .env file with REACT_APP_CUSTOM_FIELD_URL=${deploymentUrl}`);

    try {
      // Build the RTE plugin
      runCommand("npm install", { cwd: rteAppBasePath });
      runCommand("npm run build", { cwd: rteAppBasePath });
      console.info("RTE plugin bundle ready.");
    } finally {
      // Restore original .env file
      if (originalEnvContent === null) {
        fs.unlinkSync(rteEnvPath);
      } else {
        fs.writeFileSync(rteEnvPath, originalEnvContent, "utf-8");
      }
    }

    // create a new build folder
    fs.mkdirSync(buildBasePath, { recursive: true });

    // Copy the UI app to build folder except the rte, example, build and node_modules
    const pathsToSkip = ["rte", "build", "example", "node_modules"].map((dir) =>
      path.join(uiAppBasePath, dir)
    );
    fs.cpSync(uiAppBasePath, buildBasePath, {
      recursive: true,
      filter: (src) => !pathsToSkip.some((skipPath) => src.includes(skipPath)),
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

    // Create functions/dam.js file in build directory using template
    const functionsDir = path.join(buildBasePath, "functions");
    const damFunctionPath = path.join(functionsDir, "dam.js");
    fs.mkdirSync(functionsDir, { recursive: true });

    // Read template file and replace placeholder with actual plugin URL
    const templatePath = path.join(__dirname, "templates", "dam-function.template.js");
    let damFunctionContent = fs.readFileSync(templatePath, "utf-8");
    damFunctionContent = damFunctionContent.replace("{{PLUGIN_URL}}", pluginUrl);

    fs.writeFileSync(damFunctionPath, damFunctionContent);

    // Copy package.json to build folder
    const uiPackageJsonPath = path.join(uiAppBasePath, "package.json");
    const buildPackageJsonPath = path.join(buildBasePath, "package.json");
    fs.copyFileSync(uiPackageJsonPath, buildPackageJsonPath);

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
  const query = `mutation CreateSignedUploadUrl {
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
  }`;

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
      data: JSON.stringify({ query, variables: {} }),
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
  console.info("Uploading the app zip...");

  try {
    const data = _getUploadFormData(metaData, filePath);
    await makeApiCall({
      method: metaData?.method,
      maxBodyLength: Infinity,
      url: metaData?.uploadUrl,
      headers: { ...data.getHeaders() },
      data,
    });

    console.info("App zip uploaded successfully...");
  } catch (error) {
    console.error("Error while uploading app zip.");
    throw error;
  }
};

const _getProjectMetaData = (name, uploadUid, envName, launchSubDomain) =>
  `{name: "${name}", fileUpload: {uploadUid: "${uploadUid}"}, projectType: "FILEUPLOAD", cmsStackApiKey: "", environment: {name: "${envName}", frameworkPreset: "CRA", buildCommand: "npm run build", outputDirectory: "./build", environmentVariables: ${getEnvVariables(launchSubDomain)}}}`;

const createProject = async (
  authtoken,
  orgId,
  baseUrl,
  name,
  uploadUid,
  envName,
  launchSubDomain
) => {
  const query = `mutation CreateProject {
    importProject(
      project: ${_getProjectMetaData(name, uploadUid, envName, launchSubDomain)}
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
  }`;

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
      data: JSON.stringify({ query, variables: {} }),
    });

    const project = res?.data?.importProject;
    const env = project?.environments[0];
    const deployment = env?.deployments?.edges[0]?.node;
    const projectUrl = `${baseUrl}/#!/launch/projects/${project?.uid}/envs/${env?.uid}/deployments/${deployment?.uid}`;

    console.info("Project created successfully...");
    console.info(`Build and deployment has been initiated. You can check the logs at: ${projectUrl}`);
    openLink(projectUrl);

    return {
      project_uid: project?.uid,
      env_uid: env?.uid,
      deployment_uid: deployment?.uid,
    };
  } catch (error) {
    console.error("Error while creating a launch project.");
    console.info(JSON.stringify(error, null, 2));
    throw error;
  }
};

const getProjectDetails = async (baseUrl, metaData, authtoken, orgId) => {
  const query = `query getDeploymentsById {
    Deployment(
      query: {uid: "${metaData?.deployment_uid}", environment: "${metaData?.env_uid}"}
    ) {
      uid
      environment
      status
      deploymentUrl
    }
  }`;

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
    data: JSON.stringify({ query, variables: {} }),
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
  const query = `fragment CoreDeploymentFields on Deployment {
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
  }`;

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
      data: JSON.stringify({ query, variables: {} }),
    });

    const deploymentUid = res?.data?.createDeployment?.uid;
    const projectUrl = `${baseUrl}/#!/launch/projects/${launchMetaData?.project_uid}/envs/${launchMetaData?.env_uid}/deployments/${deploymentUid}`;

    console.info("Redeployment was successful...");
    console.info(`Build and deployment has been initiated. You can check the logs at: ${projectUrl}`);
    openLink(projectUrl);

    return deploymentUid;
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
