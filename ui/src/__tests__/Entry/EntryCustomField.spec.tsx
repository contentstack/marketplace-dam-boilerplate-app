/* eslint-disable global-require */
import { act, waitFor } from "@testing-library/react";

const mockInit = jest.fn();
jest.mock("@contentstack/app-sdk", () => ({
  __esModule: true,
  default: { init: (...a: any[]) => mockInit(...a) },
}));

describe("entry at the manifest URL: the custom field at /#/custom-field", () => {
  test("renders the custom field through the real src/index", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockInit.mockResolvedValue({
      stack: {
        getLocales: async () => ({ locales: [] }),
        getCurrentBranch: () => ({ uid: "main" }),
      },
      location: {
        CustomField: {
          fieldConfig: {},
          field: { getData: () => [], setData: jest.fn() },
          frame: { enableAutoResizing: jest.fn(), updateHeight: jest.fn() },
          entry: { locale: "en-us" },
        },
      },
      getConfig: async () => ({}),
    });
    document.body.innerHTML = '<div id="root"></div>';
    window.location.hash = "#/custom-field";
    require("../../index");
    await waitFor(
      () =>
        expect(
          document.querySelector('[data-testid="add-btn"]')
        ).not.toBeNull(),
      { timeout: 5000 }
    );
    await act(async () => {
      await mockInit.mock.results[0].value;
    });
  });
});
