const readlineSync = require("readline-sync");
const {
  getUploadMetaData,
  buildAppZip,
  uploadAppZip,
  createProject,
  getProjectDetails,
  updateLaunchManifest,
  updateAppManifest,
  getLaunchManifest,
  reDeployProject,
  authenticateUser,
} = require("../utils");
const prodAppManifest = require("../../settings/prod-app-manifest.json");

(async () => {
  try {
    const context = authenticateUser();
    if (!context) return;

    const { authtoken, selectedOrgUid, appBaseUrl } = context;
    const launchManifest = getLaunchManifest();

    let projectName, envName, launchSubDomain;

    if (launchManifest.created) {
      console.info("Launch deployment details found, using existing project details.");
      projectName = launchManifest.data.project_name;
      envName = launchManifest.data.env_name;
      launchSubDomain = launchManifest.data.subdomain;
    } else {
      projectName = readlineSync.question("Enter the project name: ");
      envName = readlineSync.question("Enter the environment name: ");
      launchSubDomain = projectName.replace(/ /g, "-");
    }

    // Build and upload app zip (common for both paths)
    const buildPath = buildAppZip(projectName);
    const uploadMetaData = await getUploadMetaData(
      authtoken,
      appBaseUrl,
      selectedOrgUid
    );
    await uploadAppZip(uploadMetaData, buildPath);

    if (launchManifest.created) {
      console.info("Redeploying the app now.");

      const deploymentId = await reDeployProject(
        authtoken,
        selectedOrgUid,
        appBaseUrl,
        uploadMetaData?.uploadUid,
        launchManifest.data
      );

      updateLaunchManifest({
        ...launchManifest.data,
        deployment_uid: deploymentId,
      });
    } else {
      const launchMetaData = await createProject(
        authtoken,
        selectedOrgUid,
        appBaseUrl,
        projectName,
        uploadMetaData?.uploadUid,
        envName,
        launchSubDomain
      );

      const launchProjectDetails = await getProjectDetails(
        appBaseUrl,
        launchMetaData,
        authtoken,
        selectedOrgUid
      );

      updateLaunchManifest({
        project_name: projectName,
        env_name: envName,
        subdomain: launchSubDomain,
        ...launchProjectDetails,
      });

      prodAppManifest.ui_location = {
        ...prodAppManifest.ui_location,
        base_url: launchProjectDetails?.deployment_url,
      };
      prodAppManifest.hosting = {
        provider: "launch",
        deployment_url: launchProjectDetails?.deployment_url || "",
        environment_uid: launchProjectDetails?.env_uid || "",
        project_uid: launchProjectDetails?.project_uid || "",
      };

      updateAppManifest(prodAppManifest, "prod");
    }
  } catch (error) {
    console.error("Deployment failed:");
    console.info(error);
    console.error("Error:", error.message || error);
  }
})();
