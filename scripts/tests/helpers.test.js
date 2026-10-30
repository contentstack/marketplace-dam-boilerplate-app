const fs = require("fs");
const os = require("os");
const path = require("path");

jest.mock("axios", () => jest.fn());
const axios = require("axios");
const constants = require("../src/constants");
const helpers = require("../src/utils/helpers");
const manifest = require("../src/utils/manifest");
const { buildContentTypeSchema } = require("../src/utils/app-management");
const { getEnvVariables } = require("../src/utils/deployment");

afterEach(() => {
  jest.restoreAllMocks();
  axios.mockReset();
});

describe("region URLs", () => {
  test.each(constants.BASE_URLS)(
    "getBaseUrl finds the API host of region '$region'",
    ({ region, url }) => {
      expect(helpers.getBaseUrl(region)).toBe(url);
    },
  );

  test("an unknown region falls back to the first (AWS North America) host", () => {
    expect(helpers.getBaseUrl("mars")).toBe(constants.BASE_URLS[0].url);
    expect(helpers.getAppBaseUrl("mars")).toBe(constants.APP_BASE_URLS[0].url);
    expect(helpers.getDeveloperhubBaseUrl("mars")).toBe(
      constants.DEVELOPERHUB_BASE_URLS[0].url,
    );
  });

  test("the app and developer hub hosts follow the region", () => {
    expect(helpers.getAppBaseUrl("eu")).toBe(
      constants.APP_BASE_URLS.find((u) => u.region === "eu").url,
    );
    expect(helpers.getDeveloperhubBaseUrl("eu")).toBe(
      constants.DEVELOPERHUB_BASE_URLS.find((u) => u.region === "eu").url,
    );
  });
});

describe("buildDeploymentUrl", () => {
  test.each([
    ["", "https://shop.contentstackapps.com"],
    ["eu", "https://shop.eu-contentstackapps.com"],
    ["azure-na", "https://shop.azcontentstackapps.com"],
    ["azure-eu", "https://shop.eu-azcontentstackapps.com"],
    ["gcp-na", "https://shop.gcpcontentstackapps.com"],
  ])("region '%s' gives %s", (region, url) => {
    expect(helpers.buildDeploymentUrl("shop", region)).toBe(url);
  });

  test("an explicit deployment URL wins", () => {
    expect(
      helpers.buildDeploymentUrl("shop", "eu", "https://own.example.test"),
    ).toBe("https://own.example.test");
  });
});

describe("makeApiCall", () => {
  test("a GET sends no body and returns the response data", async () => {
    axios.mockResolvedValue({ data: { ok: 1 } });
    const res = await helpers.makeApiCall({
      url: "https://x.test",
      method: "GET",
      headers: { h: "1" },
      data: { ignored: true },
    });
    expect(res).toEqual({ ok: 1 });
    const call = axios.mock.calls[0][0];
    expect(call).not.toHaveProperty("data");
    expect(call.headers).toEqual({ h: "1" });
    expect(call.timeout).toBe(60000);
  });

  test.each(["PUT", "POST", "DELETE", "PATCH"])(
    "a %s sends the body",
    async (method) => {
      axios.mockResolvedValue({ data: {} });
      await helpers.makeApiCall({ url: "u", method, data: { a: 1 } });
      expect(axios.mock.calls[0][0].data).toEqual({ a: 1 });
    },
  );

  test("a failure throws the server's body, else the message", async () => {
    jest.spyOn(console, "info").mockImplementation(() => {});
    axios.mockRejectedValueOnce({ response: { data: { error: "denied" } } });
    await expect(
      helpers.makeApiCall({ url: "u", method: "GET" }),
    ).rejects.toEqual({
      error: "denied",
    });
    axios.mockRejectedValueOnce({ message: "timeout" });
    await expect(helpers.makeApiCall({ url: "u", method: "GET" })).rejects.toBe(
      "timeout",
    );
  });

  test("printError false keeps the failure out of the log", async () => {
    const info = jest.spyOn(console, "info").mockImplementation(() => {});
    axios.mockRejectedValue({ message: "x" });
    await expect(
      helpers.makeApiCall({ url: "u", method: "GET", printError: false }),
    ).rejects.toBe("x");
    expect(info).not.toHaveBeenCalled();
  });
});

describe("safePromise", () => {
  test("resolves to [null, value]", async () => {
    expect(await helpers.safePromise(Promise.resolve(5), "t")).toEqual([
      null,
      5,
    ]);
  });

  test("resolves to [error] and prints the text on failure, unless told not to", async () => {
    const err = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(
      await helpers.safePromise(Promise.reject(new Error("e")), "oops"),
    ).toEqual([new Error("e")]);
    expect(err).toHaveBeenCalledWith("oops");
    err.mockClear();
    await helpers.safePromise(Promise.reject(new Error("e")), "oops", false);
    expect(err).not.toHaveBeenCalled();
  });
});

describe("env file and file helpers", () => {
  let dir;
  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "dam-scripts-"));
  });
  afterEach(() => fs.rmSync(dir, { recursive: true, force: true }));

  test("updateEnvFile replaces an existing key and keeps the others", () => {
    const f = path.join(dir, ".env");
    fs.writeFileSync(f, "A=1\nB=2\n");
    const before = helpers.updateEnvFile(f, "A", "9");
    expect(before).toBe("A=1\nB=2\n");
    expect(fs.readFileSync(f, "utf-8")).toBe("A=9\nB=2\n");
  });

  test("updateEnvFile appends a new key on its own line, creating the file if needed", () => {
    const f = path.join(dir, ".env");
    helpers.updateEnvFile(f, "A", "1");
    expect(fs.readFileSync(f, "utf-8")).toBe("A=1\n");
    fs.writeFileSync(f, "A=1");
    helpers.updateEnvFile(f, "B", "2");
    expect(fs.readFileSync(f, "utf-8")).toBe("A=1\nB=2\n");
  });

  test("readFileSafe returns null for a missing file; safeDelete ignores one", () => {
    const f = path.join(dir, "none");
    expect(helpers.readFileSafe(f)).toBeNull();
    expect(() => helpers.safeDelete(f)).not.toThrow();
    fs.writeFileSync(f, "x");
    helpers.safeDelete(f);
    expect(fs.existsSync(f)).toBe(false);
  });
});

describe("getEnvVariables builds the Launch project's environment list from ui/.env", () => {
  const envFile = (text) =>
    jest.spyOn(fs, "readFileSync").mockReturnValue(text);

  test("skips comments, blanks, empty values and excluded keys, and adds the custom-field URL", () => {
    const excluded = constants.EXCLUDED_ENVS[0];
    envFile(
      `# comment\n\nREACT_APP_A=1\nREACT_APP_EMPTY=\n${excluded}=hidden\n`,
    );
    const out = getEnvVariables("https://own.example.test", "shop", "");
    expect(out).toContain('{ key: "REACT_APP_A", value: "1" }');
    expect(out).toContain(
      '{ key: "REACT_APP_CUSTOM_FIELD_URL", value: "https://own.example.test" }',
    );
    expect(out).not.toContain("REACT_APP_EMPTY");
    expect(out).not.toContain(excluded);
  });

  test("keeps '=' inside values and escapes quotes and backslashes", () => {
    envFile('REACT_APP_Q=a=b"c\\d\n');
    expect(getEnvVariables("u", "shop", "")).toContain(
      '{ key: "REACT_APP_Q", value: "a=b\\"c\\\\d" }',
    );
  });

  test("a missing .env is reported", () => {
    jest.spyOn(fs, "readFileSync").mockImplementation(() => {
      throw new Error("ENOENT");
    });
    expect(() => getEnvVariables("u", "shop", "")).toThrow(
      /Error reading or parsing .env/,
    );
  });
});

describe("manifest files", () => {
  test("getLaunchManifest is 'created' only when all four ids are present", () => {
    const read = (obj) =>
      jest.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(obj));
    read({
      project_uid: "p",
      env_uid: "e",
      deployment_uid: "d",
      deployment_url: "u",
    });
    expect(manifest.getLaunchManifest().created).toBe(true);
    read({ project_uid: "p", env_uid: "e" });
    expect(manifest.getLaunchManifest().created).toBe(false);
  });

  test("an unreadable launch manifest is not 'created'", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(fs, "readFileSync").mockReturnValue("{not json");
    expect(manifest.getLaunchManifest()).toEqual({ data: {}, created: false });
  });

  test("the writers put pretty JSON in the settings folder, per environment", () => {
    const write = jest.spyOn(fs, "writeFileSync").mockImplementation(() => {});
    manifest.updateAppManifest({ a: 1 }, "dev");
    manifest.updateLaunchManifest({ b: 2 });
    manifest.updateAppInstallation({ c: 3 });
    const files = write.mock.calls.map(([f]) => path.basename(f));
    expect(files).toEqual([
      "dev-app-manifest.json",
      "prod-app-launch-manifest.json",
      "app-installations.json",
    ]);
    expect(write.mock.calls[0][1]).toBe(JSON.stringify({ a: 1 }, null, 2));
  });
});

describe("buildContentTypeSchema", () => {
  test("always has a mandatory Title", () => {
    expect(buildContentTypeSchema([])[0]).toMatchObject({
      uid: "title",
      mandatory: true,
    });
  });

  test("adds the RTE field and the custom field for the installed extensions", () => {
    const schema = buildContentTypeSchema([
      { type: "rte_plugin", uid: "rte1" },
      { type: "field", uid: "ext1" },
    ]);
    expect(schema.map((f) => f.uid)).toEqual([
      "title",
      "dam_rte_field",
      "dam_field",
    ]);
    expect(schema[1].plugins).toEqual(["rte1"]);
    expect(schema[2].extension_uid).toBe("ext1");
  });

  test("accepts a single extension object, and ignores unknown types", () => {
    expect(
      buildContentTypeSchema({ type: "CUSTOM", uid: "x" }).map((f) => f.uid),
    ).toEqual(["title", "dam_field"]);
    expect(buildContentTypeSchema([{ type: "other", uid: "y" }])).toHaveLength(
      1,
    );
  });
});
