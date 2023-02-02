import React from "react";
import {
  render,
  screen,
  fireEvent,
  cleanup,
} from "@testing-library/react/pure";
import CustomField from "./index";

const fieldsWithWarning = [
  "field-wrapper",
  "warning-component",
  "warning-icon",
];

const fieldsWithoutData = ["field-wrapper", "add-btn", "noAsset-div"];

const fieldsWithData = [
  "field-wrapper",
  "add-btn",
  "assetBox",
  "assetBox-header",
  "renderItems-wrapper",
  "render-list-item",
];

const postMessageData = [
  {
    __typename: "Image",
    id: "KEFzc2V0X2lkIENDQkVCRDA4LTU1NDctNEYyNC1CODc4MkNCMjQ5QkRBNTg5KQ==",
    name: "qc-45",
    type: "IMAGE",
    url: "https://contentstackintegration.getbynder.com/media/?mediaId=CCBEBD08-5547-4F24-B8782CB249BDA589",
    files: {
      webImage: {
        url: "https://contentstackintegration.getbynder.com/m/1ba8bc400b9f96da/webimage-qc-45.jpg",
        width: 800,
        height: 682,
        fileSize: null,
      },
      thumbnail: {
        url: "https://contentstackintegration.getbynder.com/m/1ba8bc400b9f96da/thul-qc-45.jpg",
        width: 250,
        height: 213,
        fileSize: null,
      },
    },
  },
];

const assetData = [
  {
    id: "1",
    type: "image",
    name: "sample image",
    width: "300",
    height: "300",
    size: "", // add size in bytes as string eg.'416246'
    thumbnailUrl: "",
    previewUrl: "", // add this parameter if you want "Preview" in tooltip action items
    platformUrl: "",
  },
];

jest.mock("../../root_config/index.tsx", () => ({
  damEnv: jest.fn(() => ({
    DAM_APP_NAME: "DAM",
    DIRECT_SELECTOR_PAGE: "novalue",
    ASSET_UNIQUE_ID: "id",
  })),
}));

beforeEach(() => {
  const setStateMock = React.useState;
  const useStateMock: any = (useState: any) => [useState, setStateMock];
  const testName = expect.getState().currentTestName;
  if (testName.includes("**")) {
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() =>
        useStateMock({
          config: {},
          location: {},
          appSdkInitialized: true,
        })
      )
      .mockImplementationOnce(() => useStateMock(false))
      .mockImplementationOnce(() => useStateMock(assetData));
  } else if (testName.includes("*")) {
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() =>
        useStateMock({
          config: {},
          location: {},
          appSdkInitialized: true,
        })
      )
      .mockImplementationOnce(() => useStateMock(false));

    if (testName.includes("window")) {
      jest.mock("../../root_config/index.tsx", () => ({
        damEnv: jest.fn(() => ({
          DAM_APP_NAME: "DAM",
          DIRECT_SELECTOR_PAGE: "window",
          ASSET_UNIQUE_ID: "id",
        })),
        handleSelectorWindow: jest.fn(() => window.open()),
      }));
    }

    if (testName.includes("url")) {
      jest.mock("../../root_config/index.tsx", () => ({
        damEnv: jest.fn(() => ({
          DAM_APP_NAME: "DAM",
          DIRECT_SELECTOR_PAGE: "url",
          ASSET_UNIQUE_ID: "id",
        })),
      }));
    }
  } else {
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() =>
        useStateMock({
          config: {},
          location: {},
          appSdkInitialized: true,
        })
      )
      .mockImplementationOnce(() => useStateMock(true));
  }

  jest.spyOn(React, "useEffect").mockImplementation();
  jest.spyOn(window, "open").mockImplementation();
  jest.spyOn(window, "postMessage").mockImplementation();

  render(<CustomField />);
});

describe("UI Elements of CustomField Warning", () => {
  fieldsWithWarning.forEach((id: string) => {
    test(`Rendered ${id} element`, async () => {
      expect(screen.getByTestId(`${id}`)).toBeTruthy();
    });
  });
});

describe(`*UI Elements of CustomField without Assets`, () => {
  fieldsWithoutData.forEach((id: string) => {
    test(`Rendered ${id} element`, async () => {
      expect(screen.getByTestId(`${id}`)).toBeTruthy();
    });
  });

  test(`Add Button Functionality: window`, async () => {
    const addBtn = screen.getByTestId(`add-btn`);
    expect(addBtn).toHaveTextContent(`Choose Asset(s)`);
    fireEvent.click(addBtn);
    expect(window.open).toHaveBeenCalled();
  });

  test(`Add Button Functionality: url`, async () => {
    const addBtn = screen.getByTestId(`add-btn`);
    expect(addBtn).toHaveTextContent(`Choose Asset(s)`);
    fireEvent.click(addBtn);
    expect(window.open).toHaveBeenCalled();
  });

  test(`Rendering text element`, async () => {
    expect(screen.getByText("No assets have been added")).toBeInTheDocument();
  });

  test(`Receive Post Message on custom field`, async () => {
    window.postMessage(
      {
        message: "message",
        data: [...postMessageData],
      },
      process.env.REACT_APP_UI_URL_NA || ""
    );
    expect(window.postMessage).toHaveBeenCalled();
  });
});

describe("**UI Elements of CustomField with Assets", () => {
  fieldsWithData.forEach((id: string) => {
    test(`Rendered ${id} element`, async () => {
      expect(screen.getByTestId(`${id}`)).toBeTruthy();
    });
  });
});

afterEach(cleanup);
