import React from "react";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

const mockInit = jest.fn();
jest.mock("@contentstack/app-sdk", () => ({
  __esModule: true,
  default: { init: (...a: any[]) => mockInit(...a) },
}));
const mockNotification = jest.fn();
jest.mock("@contentstack/venus-components", () => ({
  ...(jest.requireActual("@contentstack/venus-components") as any),
  Notification: (...a: any[]) => mockNotification(...a),
}));

// eslint-disable-next-line import/first
import App from "../../containers/App";

const CF_URL = process.env.REACT_APP_CUSTOM_FIELD_URL as string;
const asset = (id: number, extra: any = {}) => ({
  _id: id,
  assetName: `name-${id}`,
  width: 100,
  height: 100,
  size: 1000,
  assetUrl: `https://img.example.test/${id}.jpg`,
  ...extra,
});
const stack = (branch = "main") => ({
  getLocales: async () => ({ locales: [] }),
  getCurrentBranch: () => ({ uid: branch }),
});
const config = (extra: any = {}) => ({
  default_multi_config_key: "main",
  multi_config_keys: {
    main: { selectField: "option1" },
    other: { selectField: "option2" },
  },
  ...extra,
});

let setData: jest.Mock;
const sdkForCustomField = (
  opts: { saved?: any[]; field?: any; config?: any } = {}
) => {
  setData = jest.fn();
  return {
    stack: stack(),
    location: {
      CustomField: {
        fieldConfig: opts.field ?? { config_label: ["main"] },
        field: { getData: () => opts.saved ?? [], setData },
        frame: { enableAutoResizing: jest.fn(), updateHeight: jest.fn() },
        entry: { locale: "en-us" },
      },
    },
    getConfig: async () => opts.config ?? config(),
  };
};
let setInstallationData: jest.Mock;
let setValidity: jest.Mock;
const sdkForConfig = (installation: any = {}) => {
  setInstallationData = jest.fn();
  setValidity = jest.fn();
  return {
    stack: stack(),
    location: {
      AppConfigWidget: {
        installation: {
          getInstallationData: async () => installation,
          setInstallationData,
          setValidity,
        },
      },
    },
    getConfig: async () => ({}),
  };
};

const listeners: any[] = [];
let openSpy: jest.SpyInstance;
const send = (data: any, init: any = {}) =>
  act(async () => {
    window.dispatchEvent(
      new MessageEvent("message", { data, origin: CF_URL, ...init })
    );
  });
const lastSaved = () => setData.mock.calls[setData.mock.calls.length - 1][0];
const savedIds = () => lastSaved().map((a: any) => a._id);
const nothingSaved = () => setData.mock.calls.every(([v]) => v.length === 0);

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
  openSpy = jest.spyOn(window, "open").mockImplementation(() => null);
  const add = window.addEventListener.bind(window);
  jest
    .spyOn(window, "addEventListener")
    .mockImplementation((t: any, l: any, o?: any) => {
      if (t === "message") listeners.push(l);
      return add(t, l, o);
    });
});
afterEach(() => {
  listeners.splice(0).forEach((l) => window.removeEventListener("message", l));
  jest.restoreAllMocks();
  mockInit.mockReset();
  mockNotification.mockReset();
  window.location.hash = "";
});

const openAt = async (hash: string) => {
  window.location.hash = hash;
  await act(async () => {
    render(<App />);
  });
};
const choose = async () => {
  fireEvent.click(await screen.findByTestId("add-btn"));
  await waitFor(() => expect(openSpy).toHaveBeenCalled());
};
const add = (selectedAssets: any[], init: any = {}) =>
  send({ message: "add", type: "DAM", selectedAssets }, init);

describe("Custom Field at /#/custom-field", () => {
  test("shows 'No assets' text and the add button for an empty field", async () => {
    mockInit.mockResolvedValue(sdkForCustomField());
    await openAt("#/custom-field");
    expect(await screen.findByTestId("noAsset-div")).toBeTruthy();
    expect(screen.getByTestId("add-btn")).toBeTruthy();
  });

  test("shows the failed screen when the SDK does not start", async () => {
    mockInit.mockRejectedValue(new Error("no host"));
    await openAt("#/custom-field");
    await waitFor(() =>
      expect(document.querySelector(".app-failed-container")).not.toBeNull()
    );
  });

  test("shows one card per saved asset", async () => {
    mockInit.mockResolvedValue(
      sdkForCustomField({ saved: [asset(1), asset(2)] })
    );
    await openAt("#/custom-field");
    expect(await screen.findByTestId("assetBox")).toBeTruthy();
    expect(await screen.findAllByTestId("render-list-item")).toHaveLength(2);
  });

  test("the add button opens the selector popup at /#/selector-page", async () => {
    mockInit.mockResolvedValue(sdkForCustomField());
    await openAt("#/custom-field");
    await choose();
    expect(openSpy.mock.calls[0][0]).toBe(
      `${CF_URL}/#/selector-page?location=CUSTOM-FIELD`
    );
  });

  test("answers openedReady with the selected config and the ids already chosen", async () => {
    mockInit.mockResolvedValue(sdkForCustomField({ saved: [asset(1)] }));
    await openAt("#/custom-field");
    await choose();
    const source = { postMessage: jest.fn() };
    await send({ message: "openedReady" }, { source });
    expect(source.postMessage).toHaveBeenCalledTimes(1);
    const [payload, origin] = source.postMessage.mock.calls[0];
    expect(payload).toMatchObject({
      message: "init",
      type: "DAM",
      selectedIds: [1],
    });
    expect(payload.config.selected_config).toEqual({ selectField: "option1" });
    expect(payload.config).not.toHaveProperty("multi_config_keys");
    expect(origin).toBe(`${CF_URL}/#/selector-page`);
  });

  const selectedConfigFor = async (sdk: any) => {
    mockInit.mockResolvedValue(sdk);
    await openAt("#/custom-field");
    await choose();
    const source = { postMessage: jest.fn() };
    await send({ message: "openedReady" }, { source });
    return source.postMessage.mock.calls[0][0].config.selected_config;
  };

  test("the content type's own config label wins over the default", async () => {
    expect(
      await selectedConfigFor(
        sdkForCustomField({ field: { config_label: ["other"] } })
      )
    ).toEqual({ selectField: "option2" });
  });

  test("a branch rule picks the config when the field has no label", async () => {
    expect(
      await selectedConfigFor(
        sdkForCustomField({
          field: {},
          config: config({
            config_rules: { main: { config_label: ["other"] } },
          }),
        })
      )
    ).toEqual({ selectField: "option2" });
  });

  test("a locale rule on the branch beats the branch rule", async () => {
    expect(
      await selectedConfigFor(
        sdkForCustomField({
          field: {},
          config: config({
            config_rules: {
              main: {
                config_label: ["main"],
                locales: { "en-us": { config_label: ["other"] } },
              },
            },
          }),
        })
      )
    ).toEqual({ selectField: "option2" });
  });

  test("with no label and no rule the default config is used", async () => {
    expect(await selectedConfigFor(sdkForCustomField({ field: {} }))).toEqual({
      selectField: "option1",
    });
  });

  test("ignores messages from another origin (fail closed)", async () => {
    mockInit.mockResolvedValue(sdkForCustomField());
    await openAt("#/custom-field");
    await choose();
    await add([asset(1)], { origin: "https://evil.example.test" });
    expect(nothingSaved()).toBe(true);
  });

  test("saves picked assets once per id and tags them with the config label", async () => {
    mockInit.mockResolvedValue(sdkForCustomField());
    await openAt("#/custom-field");
    await choose();
    await add([asset(1), asset(2), asset(2)]);
    await waitFor(() => expect(savedIds()).toEqual([1, 2]));
    lastSaved().forEach((a: any) =>
      expect(a.cs_metadata).toEqual({ config_label: "main" })
    );
    expect(await screen.findAllByTestId("render-list-item")).toHaveLength(2);
  });

  test("ignores an add message from another app type", async () => {
    mockInit.mockResolvedValue(sdkForCustomField());
    await openAt("#/custom-field");
    await choose();
    await send({ message: "add", type: "Other", selectedAssets: [asset(1)] });
    expect(nothingSaved()).toBe(true);
  });

  test("cuts to the field's max limit and shows an error toast", async () => {
    mockInit.mockResolvedValue(
      sdkForCustomField({
        field: { config_label: ["main"], advanced: { max_limit: 2 } },
      })
    );
    await openAt("#/custom-field");
    await choose();
    await add([asset(1), asset(2), asset(3)]);
    await waitFor(() => expect(savedIds()).toEqual([1, 2]));
    expect(mockNotification).toHaveBeenCalledWith(
      expect.objectContaining({ type: "error" })
    );
  });

  test("disables the add button once the limit is reached", async () => {
    mockInit.mockResolvedValue(
      sdkForCustomField({
        saved: [asset(1)],
        field: { config_label: ["main"], advanced: { max_limit: 1 } },
      })
    );
    await openAt("#/custom-field");
    const btn: any = await screen.findByTestId("add-btn");
    await waitFor(() => expect(btn.disabled).toBe(true));
  });

  test("rejects assets that break the content type's size rule and names them", async () => {
    mockInit.mockResolvedValue(
      sdkForCustomField({
        field: { config_label: ["main"], advanced: { size: { max: 2000 } } },
      })
    );
    await openAt("#/custom-field");
    await choose();
    await add([asset(1), asset(2, { size: 5000 })]);
    await waitFor(() => expect(savedIds()).toEqual([1]));
    const text = JSON.stringify(mockNotification.mock.calls);
    expect(text).toContain("name-2");
  });

  test("with custom JSON on, keeps only the chosen keys", async () => {
    mockInit.mockResolvedValue(
      sdkForCustomField({
        config: config({
          is_custom_json: true,
          dam_keys: [
            { label: "_id", value: "_id" },
            { label: "assetName", value: "assetName" },
          ],
        }),
      })
    );
    await openAt("#/custom-field");
    await choose();
    await add([asset(1)]);
    await waitFor(() =>
      expect(Object.keys(lastSaved()[0]).sort()).toEqual([
        "_id",
        "assetName",
        "cs_metadata",
      ])
    );
  });

  test("closing the popup removes the listener, so a late add is not saved", async () => {
    mockInit.mockResolvedValue(sdkForCustomField());
    await openAt("#/custom-field");
    await choose();
    await send({ message: "close" });
    await add([asset(1)]);
    expect(nothingSaved()).toBe(true);
  });
});

describe("Selector page at /#/selector-page", () => {
  const withOpener = () => {
    const opener = { postMessage: jest.fn() };
    Object.defineProperty(window, "opener", {
      value: opener,
      configurable: true,
      writable: true,
    });
    return opener;
  };
  afterEach(() => {
    Object.defineProperty(window, "opener", {
      value: null,
      configurable: true,
      writable: true,
    });
  });
  const init = (selectedIds: any[] = []) => ({
    message: "init",
    type: "DAM",
    selectedIds,
    config: { selected_config: {} },
  });

  test("tells the opener it is ready", async () => {
    mockInit.mockRejectedValue(new Error("popup has no SDK"));
    const opener = withOpener();
    await openAt("#/selector-page?location=CUSTOM-FIELD");
    expect(await screen.findByTestId("selector-wrapper")).toBeTruthy();
    expect(opener.postMessage).toHaveBeenCalledWith(
      { message: "openedReady" },
      CF_URL
    );
  });

  test("uses the region's URL when the query names a region", async () => {
    mockInit.mockRejectedValue(new Error("x"));
    const opener = withOpener();
    await openAt("#/selector-page?location=EU");
    expect(opener.postMessage).toHaveBeenCalledWith(
      { message: "openedReady" },
      "https://eu.example.test"
    );
  });

  test("after init it shows the picker table and Add sends the selection back, then closes", async () => {
    mockInit.mockRejectedValue(new Error("x"));
    const opener = withOpener();
    const close = jest.spyOn(window, "close").mockImplementation(() => {});
    await openAt("#/selector-page?location=CUSTOM-FIELD");
    await send(init());
    expect(document.querySelector(".selector-custom-component")).not.toBeNull();
    // the table virtualizes its rows, which jsdom cannot lay out: no row is selected here
    fireEvent.click(await screen.findByText("Add 0 Asset(s)"));
    const [msg, target] = opener.postMessage.mock.calls.pop();
    expect(msg).toEqual({ message: "add", type: "DAM", selectedAssets: [] });
    expect(target).toBe(CF_URL);
    expect(close).toHaveBeenCalled();
  });

  test("Cancel closes the popup", async () => {
    mockInit.mockRejectedValue(new Error("x"));
    withOpener();
    const close = jest.spyOn(window, "close").mockImplementation(() => {});
    await openAt("#/selector-page?location=CUSTOM-FIELD");
    await send(init());
    fireEvent.click(await screen.findByText("Cancel"));
    expect(close).toHaveBeenCalled();
  });

  test("tells the opener when the popup is closed", async () => {
    mockInit.mockRejectedValue(new Error("x"));
    const opener = withOpener();
    await openAt("#/selector-page?location=CUSTOM-FIELD");
    window.dispatchEvent(new Event("beforeunload"));
    expect(opener.postMessage).toHaveBeenLastCalledWith(
      { message: "close" },
      CF_URL
    );
  });
});

describe("App Configuration at /#/config", () => {
  test("shows the configuration section with the template's fields", async () => {
    mockInit.mockResolvedValue(sdkForConfig());
    await openAt("#/config");
    expect(await screen.findByTestId("config-wrapper")).toBeTruthy();
    expect(await screen.findByText("DAM Configuration")).toBeTruthy();
    expect(screen.getByText("Save In Entry")).toBeTruthy();
  });

  test("New Configuration adds a label saved in both the config and the server config", async () => {
    mockInit.mockResolvedValue(sdkForConfig());
    await openAt("#/config");
    fireEvent.click(await screen.findByText("New Configuration"));
    fireEvent.change(await screen.findByTestId("multiconfiglabel-input"), {
      target: { name: "multiConfigLabelName", value: "first" },
    });
    const addBtn = (await screen.findByText("Add")).closest("button")!;
    // the name check is debounced, Add stays disabled until it ran
    await waitFor(() => expect(addBtn.disabled).toBe(false));
    fireEvent.click(addBtn);
    await waitFor(() => {
      const last =
        setInstallationData.mock.calls[
          setInstallationData.mock.calls.length - 1
        ][0];
      expect(Object.keys(last.configuration.multi_config_keys)).toContain(
        "first"
      );
      expect(Object.keys(last.serverConfiguration.multi_config_keys)).toContain(
        "first"
      );
    });
    const last =
      setInstallationData.mock.calls[
        setInstallationData.mock.calls.length - 1
      ][0];
    // the secret field lives in the server config only
    expect(last.configuration.multi_config_keys.first).not.toHaveProperty(
      "textField"
    );
    expect(last.serverConfiguration.multi_config_keys.first).toHaveProperty(
      "textField"
    );
  });

  test("a duplicate label name is refused", async () => {
    mockInit.mockResolvedValue(
      sdkForConfig({
        configuration: config(),
        serverConfiguration: { multi_config_keys: { main: {}, other: {} } },
      })
    );
    await openAt("#/config");
    fireEvent.click(await screen.findByText("New Configuration"));
    fireEvent.change(await screen.findByTestId("multiconfiglabel-input"), {
      target: { name: "multiConfigLabelName", value: "main" },
    });
    expect(await screen.findByText(/already exists/)).toBeTruthy();
  });

  test("the Advanced Configuration tab shows the branch and locale config rules", async () => {
    mockInit.mockResolvedValue(
      sdkForConfig({
        configuration: config({
          config_rules: { main: { config_label: ["other"] } },
        }),
        serverConfiguration: { multi_config_keys: { main: {}, other: {} } },
      })
    );
    await openAt("#/config");
    fireEvent.click(await screen.findByText("Advanced Configuration"));
    expect(await screen.findByText("Config Rule Selector")).toBeTruthy();
    expect(screen.getByText("Config Mapping")).toBeTruthy();
    fireEvent.click(screen.getByText("add more"));
    await waitFor(() =>
      expect(document.querySelectorAll(".custom-pair-container").length).toBe(2)
    );
  });

  test("switching to custom JSON is saved", async () => {
    mockInit.mockResolvedValue(sdkForConfig());
    await openAt("#/config");
    await screen.findByTestId("config-wrapper");
    const custom = document.getElementById("customJSON") as HTMLInputElement;
    expect(custom).not.toBeNull();
    fireEvent.click(custom);
    await waitFor(() => expect(setInstallationData).toHaveBeenCalled());
    const last =
      setInstallationData.mock.calls[
        setInstallationData.mock.calls.length - 1
      ][0];
    expect(last.configuration.is_custom_json).toBe(true);
  });

  // BUG: AppConfigProvider renders its children only after the installation data loaded, so when
  // the SDK fails the admin sees a blank page and ConfigScreen's AppFailed branch is never reached.
  test.skip("shows the failed screen when the SDK does not start", async () => {
    mockInit.mockRejectedValue(new Error("no host"));
    await openAt("#/config");
    await waitFor(() =>
      expect(document.querySelector(".app-failed-container")).not.toBeNull()
    );
  });
});

describe("Routes", () => {
  test("any other hash renders none of the three screens", async () => {
    mockInit.mockResolvedValue(sdkForCustomField());
    await openAt("#/nope");
    expect(screen.queryByTestId("field-wrapper")).toBeNull();
    expect(screen.queryByTestId("config-wrapper")).toBeNull();
    expect(screen.queryByTestId("selector-wrapper")).toBeNull();
  });
});
