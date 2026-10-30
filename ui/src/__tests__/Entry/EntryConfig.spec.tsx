/* eslint-disable global-require */
import { act, waitFor } from "@testing-library/react";

const mockInit = jest.fn();
jest.mock("@contentstack/app-sdk", () => ({
  __esModule: true,
  default: { init: (...a: any[]) => mockInit(...a) },
}));

// One entry per file: createRoot has no handle to unmount, so a second render would stay live.
describe("entry at the manifest URL: the config screen at /#/config", () => {
  test("renders the config screen through the real src/index", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockInit.mockResolvedValue({
      stack: {
        getLocales: async () => ({ locales: [] }),
        getCurrentBranch: () => ({ uid: "main" }),
      },
      location: {
        AppConfigWidget: {
          installation: {
            getInstallationData: async () => ({}),
            setInstallationData: jest.fn(),
            setValidity: jest.fn(),
          },
        },
      },
      getConfig: async () => ({}),
    });
    document.body.innerHTML = '<div id="root"></div>';
    window.location.hash = "#/config";
    require("../../index");
    await waitFor(
      () =>
        expect(
          document.querySelector('[data-testid="config-wrapper"]')
        ).not.toBeNull(),
      { timeout: 5000 }
    );
    // drain the SDK's remaining state updates before the environment is torn down
    await act(async () => {
      await mockInit.mock.results[0].value;
    });
  });
});
