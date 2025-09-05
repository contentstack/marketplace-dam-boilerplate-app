async function createApp(marketplace, appName, selection) {
  return await marketplace.app().create({
    name: appName,
    description: "DAM integration app for Contentstack",
    target_type: "stack",
    ui_location: {
      signed: false,
      base_url:
        selection === 1 ? "http://localhost:1268" : "http://localhost:4000/#",
      locations: [
        {
          type: "cs.cm.stack.config",
          meta: [{ title: "Configuration", path: "/config" }],
        },
        {
          type: "cs.cm.stack.custom_field",
          meta: [
            { title: "DAM Field", path: "/custom-field", data_type: "json" },
          ],
        },
        {
          type: "cs.cm.stack.rte",
          meta: [{ title: "Rte Field", path: "/dam.js" }],
        },
      ],
    },
  });
}

module.exports = { createApp };
