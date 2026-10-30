import rootConfig from "../../root_config";

describe("the template's vendor hooks (what a new DAM app replaces)", () => {
  test("damEnv names the app and the asset's unique id", () => {
    expect(rootConfig.damEnv.DAM_APP_NAME).toBe("DAM");
    expect(rootConfig.damEnv.ASSET_UNIQUE_ID).toBe("_id");
    expect(rootConfig.damEnv.DIRECT_SELECTOR_PAGE).toBe("novalue");
  });

  test("filterAssetData maps a vendor asset to the field's card", () => {
    const [card] = rootConfig.filterAssetData!([
      {
        _id: 7,
        assetName: "Pic",
        width: 10,
        height: 20,
        assetUrl: "https://x.test/p.jpg",
        cs_metadata: { config_label: "main" },
      },
    ]);
    expect(card).toMatchObject({
      id: 7,
      type: "image",
      name: "Pic",
      width: 10,
      height: 20,
      thumbnailUrl: "https://x.test/p.jpg",
      previewUrl: "https://x.test/p.jpg",
      cs_metadata: { config_label: "main" },
    });
  });

  test("modifyAssetsToSave saves the assets as picked", () => {
    const assets = [{ _id: 1 }];
    expect(rootConfig.modifyAssetsToSave!({}, {}, assets)).toBe(assets);
  });

  test("checkConfigValidity lets Save through by default", async () => {
    expect((await rootConfig.checkConfigValidity!({}, {})).disableSave).toBe(
      false
    );
  });

  test("the config screen declares a secret field that is saved in the server config only", () => {
    const fields = rootConfig.configureConfigScreen!();
    expect(fields.textField).toMatchObject({
      inputFieldType: "password",
      saveInConfig: false,
      saveInServerConfig: true,
    });
  });

  test("customWholeJson offers the default keys among the options", () => {
    const { customJsonOptions, defaultFeilds } = rootConfig.customWholeJson!();
    defaultFeilds.forEach((k: string) =>
      expect(customJsonOptions).toContain(k)
    );
  });
});
