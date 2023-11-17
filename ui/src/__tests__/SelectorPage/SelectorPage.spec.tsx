import React from "react";
import { cleanup, render, screen } from "@testing-library/react/pure";
import SelectorPage from "../../containers/SelectorPage/index";

const selectorPageUIElementsIDs = [
  "selector-wrapper",
  "selector-header",
  "selector-logo",
  "selector-title",
  "selector-container",
  "custom-selector-container",
];

jest.mock("../../root_config/index.tsx", () => ({
  damEnv: jest.fn(() => ({
    DAM_APP_NAME: "DAM",
    IS_DAM_SCRIPT: false,
    CONFIG_FIELDS: ["url", "mode"],
    SELECTOR_PAGE_LOGO: "Logo",
  })),
  customSelectorComponent: jest.fn(() => (
    <div data-testid="custom-selector-container" />
  )),
}));

beforeEach(async () => {
  const setStateMock = React.useState;
  const useStateMock: any = (useState: any) => [useState, setStateMock];
  const testName = expect.getState().currentTestName;
  if (testName.includes("**")) {
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => useStateMock(true));
  }
  render(<SelectorPage />);
});

describe(`UI Elements of Selector Page`, () => {
  selectorPageUIElementsIDs.forEach((id: string) => {
    test(`Rendered ${id} element`, async () => {
      expect(screen.getByTestId(`${id}`)).toBeTruthy();
    });
  });

  test(`**Rendered warning-component element on an error`, async () => {
    expect(screen.getByTestId(`warning-component`)).toBeTruthy();
  });
});

afterEach(cleanup);
