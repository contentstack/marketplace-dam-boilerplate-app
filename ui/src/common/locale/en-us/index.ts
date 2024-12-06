import rootConfig from "../../../root_config";

const localeTexts = {
  ConfigFields: {
    AccordianConfig: {
      mainName: "Configuration",
      multiConfigLabel: `Configure your ${rootConfig?.damEnv?.DAM_APP_NAME} credentials`,
      accActions: {
        default: "Set as Default",
        delete: "Delete Configuration",
      },
      defaultLabel: "Default",
      checkboxText: "Set as Default",
      btnText: "New Configuration",
    },
    accModal: {
      header: "Add Configuration",
      textLabel: "Configuration Name",
      textPlaceholder: "Enter Configuration Name",
      duplicateError:
        "Configuration label name already exists. Please use a different name and try again.",
      nameLengthError:
        "Configuration Name length should be between 1 to 50 characters.",
      legacyNameError: `"legacy_config" is a reserved configuration name. Please use a
      different name.`,
      nullundefinedError: `"null" or "undefined" cannot be used as configuration name`,
      cancelBtn: "Cancel",
      addBtn: "Add",
    },
    DeleteModal: {
      header: "Confirm Deletion",
      body: "Are you sure you want to delete <b>&apos;$&apos;</b> configuration? If yes, type the name of the configuration and press Delete.",
      textPlaceholder: "Enter configuration name for confirmation",
      cancelButton: "Cancel",
      confirmButton: "Delete",
    },
    entrySaveRadioButton: {
      label: "Save In Entry",
      help: `You can select how you want to save the data you get from ${rootConfig.damEnv.DAM_APP_NAME}.`,
      placeholder:
        "Enter the structure of the data you want to save in the entry",
      all_field_instruction:
        "The 'All Fields' option allows you to add a limited number of assets based on the asset's JSON data.",
      custom_field_instruction:
        "The 'Custom Fields' option allows you to define and select the JSON data you want to save in the entry.",
      notetext:
        "<b>Note:</b> Switching between 'All' and 'Custom' Fields only affects the newly added assets, whereas the old assets use the previous configuration.",
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
        error: `The option "$var" already exists`,
        limitError: "Error: Limit of 150 options exceeded",
      },
    },
    missingCredentials: "Missing Required Fields",
    emptyValue: "Field Value Missing",
  },
  CustomFields: {
    assetLimit: {
      btnTooltip:
        "You cannot choose assets as the maximum limit has been reached.",
      notificationMsg:
        "The maximum asset limit has been reached! You cannot add more assets than the preconfigured limit.",
    },
    assetValidation: {
      errorStatement:
        "Error: $var cannot be added as it does not match the asset constraints provided.",
    },
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
      noImage: "No image available",
      configDeletedImg:
        "We are unable to access the image url. The link could be broken, the asset might be deleted or you do not have access to it.",
    },
    header: {
      asset: {
        singular: "Asset",
        plural: "Assets",
      },
      changeView: "Change View",
    },
    listViewTable: {
      thumbnailCol: "Image",
      assetNameCol: "Name",
      type: "Type",
    },
    toolTip: {
      thumbnail: "Thumbnail",
      list: "List",
      content: "Asset Image Not Available",
    },
    DeleteModal: {
      header: "Remove Asset from Contentstack Entry",
      body: "Are you sure you want to remove <b>&apos;$&apos;</b> from Contentstack Entry?",
      textPlaceholder: "Enter asset name for confirmation",
      cancelButton: "Cancel",
      confirmButton: "Remove",
    },
    AssetNotAddedText: "No assets have been added",
  },
  SelectorPage: {
    title: rootConfig?.damEnv?.DAM_APP_NAME,
  },
  Warnings: {
    incorrectConfig: `The credentials you entered for the "${rootConfig?.damEnv?.DAM_APP_NAME} App" are invalid or missing. Please update the configuration details and try again.`,
  },
  AppFailed: {
    Message1: "App Location Iniailization Failed.",
    Message2: "Please reload the location and Try Again!",
    body: "For Assistance, please reach out to us at support@contentstack.com",
    button: {
      text: "Learn More",
      url: "https://www.contentstack.com/docs/developers/developer-hub/marketplace-dam-app-boilerplate",
    },
  },
  Icons: {
    delete: "Delete",
    plus: "Plus",
    checkedWhite: "CheckedWhite",
    checkedPurple: "CheckedPurple",
    warning: "Warning",
    document: "Document",
    mp3: "MP3",
    mp4: "MP4",
    zip: "ZIP",
    doc2: "DOC2",
    json: "JSON",
    ppt: "PPT",
    xls: "XLS",
    pdf2: "PDF2",
    list: "List",
    thumbnail: "Thumbnail",
    removeFilled: "RemoveFilled",
    newTab: "NewTab",
    view: "View",
    moveIcon: "MoveIcon",
    addPlusBold: "AddPlusBold",
    dotsThreeLargeVertical: "DotsThreeLargeVertical",
    checkCircleDark: "CheckCircleDark",
    v2Plus: "v2-Plus",
  },
};

export default localeTexts;
