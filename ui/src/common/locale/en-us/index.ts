import rootConfig from "../../../root_config";

const localeTexts = {
  ConfigFields: {
    entrySaveRadioButton: {
      label: "Save In Entry",
      help: `You can select how you want to save data you get from ${rootConfig.damEnv.DAM_APP_NAME}.`,
      placeholder: "Enter the structure of data you want to save in the entry",
      instruction:
        "You can select the structure of data you want to save in the entry, if you select Custom JSON. If you select Whole JSON, less number of products can be selected.",
      wholeJson: "Whole JSON",
      customJson: "Custom JSON",
    },
    keysField: {
      label: `${rootConfig.damEnv.DAM_APP_NAME} Keys`,
      help: "Select the keys you want to save",
      placeholder: "Select keys",
      instruction: "Select the keys you want to save",
    },
  },
  CustomFields: {
    button: {
      btnText: "Choose Asset(s)",
    },
    assetCard: {
      hoverActions: {
        preview: "Preview",
        platformRedirect: `Open In ${rootConfig?.damEnv?.DAM_APP_NAME}`,
        remove: "Delete",
        drag: "Drag",
      },
    },
    AssetNotAddedText: "No assets have been added",
  },
  SelectorPage: {
    title: `${rootConfig?.damEnv?.DAM_APP_NAME} Extension`,
  },
  Warnings: {
    incorrectConfig: `The credentials you entered for the "${rootConfig?.damEnv?.DAM_APP_NAME} App" are invalid or missing. Please update the configuration details and try again.`,
  },
  DeleteModal: {
    header: "Delete",
    body: "This will delete <b>&apos;$&apos;</b> permanently.",
    cancelButton: "Cancel",
    confirmButton: "Delete",
  },
};

export default localeTexts;
