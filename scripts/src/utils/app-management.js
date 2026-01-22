const {
  makeApiCall,
  getDeveloperhubBaseUrl,
  safePromise,
} = require("./helpers");

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

const updateApp = async (manifest, region, authtoken, orgId, appUid) =>
  makeApiCall({
    url: `${getDeveloperhubBaseUrl(region)}/manifests/${appUid}`,
    method: "PUT",
    headers: { authtoken, organization_uid: orgId },
    data: manifest,
  });

const getOrgStacks = async (baseUrl, authtoken, orgId) =>
  makeApiCall({
    url: `${baseUrl}/v3/stacks?organization_uid=${orgId}`,
    method: "GET",
    headers: { authtoken },
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
    url: `${baseUrl}/v3/extensions?include_marketplace_extensions=true&desc=updated_at`,
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

const getExtension = async (
  baseUrl,
  authtoken,
  stackApiKey,
  installationUid
) => {
  try {
    const [extErr, extensions] = await safePromise(
      getInstalledApps(baseUrl, authtoken, stackApiKey),
      "Failed to fetch installed apps!"
    );

    if (extErr) {
      console.error(
        "Failed to fetch extensions:",
        extErr.response?.data || extErr.message
      );
      return null;
    }

    const appExtensions = extensions.extensions.filter(
      (ext) => ext.app_installation_uid === installationUid
    );

    if (!appExtensions.length) {
      console.error("No extensions found for this installation.");
      return null;
    }

    const rteExt = appExtensions.find((ext) => ext.type === "rte_plugin");
    const fieldExt = appExtensions.find((ext) => ext.type === "field");

    const result = [];
    if (rteExt) result.push({ type: "RTE", uid: rteExt.uid });
    if (fieldExt) result.push({ type: "CUSTOM", uid: fieldExt.uid });

    return result.length ? result : null;
  } catch (err) {
    console.error(
      "Failed to fetch extensions for content type creation:",
      err.response?.data || err.message
    );
    throw err;
  }
};

const createContentType = async (
  baseUrl,
  authtoken,
  orgId,
  stackApiKey,
  ctName,
  schema
) =>
  makeApiCall({
    url: `${baseUrl}/v3/content_types?organization_uid=${orgId}`,
    method: "POST",
    headers: { authtoken, api_key: stackApiKey },
    data: {
      content_type: {
        title: ctName,
        uid: ctName.trim().replace(/ /g, "_"),
        schema,
      },
    },
  });

const createSampleEntry = async (
  baseUrl,
  authtoken,
  stackApiKey,
  contentTypeId,
  fieldUid
) => {
  let entryData = {
    title: "Dam boilerplate sample",
    locale: "en-us",
  };

  const [rteFieldUid, damFieldUid] = fieldUid;
  entryData[rteFieldUid] = {
    type: "doc",
    attrs: {},
    children: [
      {
        type: "DAM",
        attrs: {
          _id: 1,
          assetName: "Colosseum, Rome",
          width: 100,
          height: 100,
          size: 1000,
          assetUrl: "/static/media/Colosseum_Rome.8b9e6781cbd3d63bc669.jpeg",
        },
        children: [{ text: "" }],
      },
    ],
  };

  entryData[damFieldUid] = [
    {
      _id: 1,
      assetName: "Colosseum, Rome",
      width: 600,
      height: 800,
      size: 2000,
      assetUrl: "/static/media/Colosseum_Rome.8b9e6781cbd3d63bc669.jpeg",
    },
  ];

  return makeApiCall({
    url: `${baseUrl}/v3/content_types/${contentTypeId}/entries?form_uid=${contentTypeId}&locale=en-us`,
    method: "POST",
    headers: { authtoken, api_key: stackApiKey },
    data: { entry: entryData },
  });
};

const buildContentTypeSchema = (extensionResults) => {
  const schema = [
    {
      display_name: "Title",
      uid: "title",
      data_type: "text",
      mandatory: true,
      unique: false,
    },
  ];

  const extensions = Array.isArray(extensionResults)
    ? extensionResults
    : [extensionResults];
  const rteExt = extensions.find(
    (ext) => ext.type === "RTE" || ext.type === "rte_plugin"
  );
  const fieldExt = extensions.find(
    (ext) => ext.type === "CUSTOM" || ext.type === "field"
  );

  if (rteExt) {
    schema.push({
      display_name: "DAM RTE DevField",
      plugins: [rteExt.uid],
      field_metadata: {
        allow_json_rte: true,
        rich_text_type: "advanced",
      },
      uid: "dam_rte_field",
      data_type: "json",
      mandatory: false,
      multiple: false,
      non_localizable: false,
      unique: false,
    });
  }

  if (fieldExt) {
    schema.push({
      display_name: "DAM DevField",
      extension_uid: fieldExt.uid,
      field_metadata: { extension: true },
      uid: "dam_field",
      data_type: "json",
      mandatory: false,
      multiple: false,
      non_localizable: false,
      unique: false,
    });
  }

  return schema;
};

module.exports = {
  createApp,
  updateApp,
  getOrgStacks,
  installApp,
  getInstalledApps,
  updateInstallation,
  getExtension,
  createContentType,
  createSampleEntry,
  buildContentTypeSchema,
};
