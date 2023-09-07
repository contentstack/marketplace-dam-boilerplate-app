import rootConfig from "../../../root_config";

const localeTexts = {
  ConfigFields: {
    entrySaveRadioButton: {
      label: "Save In Entry",
      help: `You can select how you want to save the data you get from ${rootConfig.damEnv.DAM_APP_NAME}.`,
      placeholder:
        "Enter the structure of the data you want to save in the entry",
      instruction:
        "If the 'All Fields' option is selected, you might be able to add limited assets in the custom field depending on the size of the data. If you select the 'Custom Fields' option, you can select the structure of the data you want to save in the entry. ",
      referS: "(Refer to the",
      custom: "Custom Fields Limitations",
      referE:
        " documentation, for more details). To increase this limit, please contact support.",
      notetext:
        "<b>Note:</b> When you change the settings from All Fields to Custom Fields, and vice versa, the existing assets follow the old configuration settings, whereas new assets added to the entry will store the data according to the updated configuration settings.",
      wholeJson: "All Fields",
      customJson: "Custom Fields",
    },
    keysField: {
      label: `${rootConfig.damEnv.DAM_APP_NAME} Keys`,
      help: "Select the keys you want to save",
      placeholder: "Select keys",
      instruction: "Select the keys you want to save",
    },
    customWholeJson: {
      modal: {
        header: "Add Key Path",
        label: "Key Path",
        placeholder: "Enter Key Path",
        instructionS:
          'Use the dot format to enter nested objects, for eg: "file.url".',
        instructionE:
          "Label already created/added in the dropdown will not be created.",
        note: "Note: ",
        btn: {
          cancel: "Cancel",
          create: "Create",
          apply: "Create and Apply",
        },
        addOption: "New Key Field",
        successToast: {
          type: "success",
          text: "Successfully added key path to options",
        },
      },
      notification: {
        errorS: "The option",
        errorE: "already exists",
      },
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
        remove: "Remove",
        drag: "Reorder",
      },
    },
    AssetNotAddedText: "No assets have been added",
    listViewTable: {
      thumbnailCol: "Asset Image",
      assetNameCol: "Name",
      type: "Type",
    },
    toolTip: {
      thumbnail: "Thumbnail",
      list: "List",
      content: "Asset Image Not Available",
    },
  },
  SelectorPage: {
    title: rootConfig?.damEnv?.DAM_APP_NAME,
  },
  Warnings: {
    incorrectConfig: `The credentials you entered for the "${rootConfig?.damEnv?.DAM_APP_NAME} App" are invalid or missing. Please update the configuration details and try again.`,
  },
  DeleteModal: {
    header: "Remove Asset from Contentstack",
    body: "Are you sure you want to remove <b>&apos;$&apos;</b> from Contentstack?",
    cancelButton: "Cancel",
    confirmButton: "Remove",
  },
};

export default localeTexts;
