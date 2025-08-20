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
        "This configuration name already exists. Enter a different name.",
      nameLengthError: "Configuration name must be 1-50 characters.",
      legacyNameError: `"legacy_config" is reserved.Enter a different name.`,
      nullundefinedError: `"null" or "undefined" cannot be used as configuration name`,
      cancelBtn: "Cancel",
      addBtn: "Add",
    },
    DeleteModal: {
      header: "Confirm Deletion",
      body: "You are about to delete the <b>&apos;$&apos;</b> configuration.This action cannot be undone.To confirm, type the configuration name and select Delete.",
      textPlaceholder: "Enter configuration name to confirm.",
      cancelButton: "Cancel",
      confirmButton: "Delete",
    },
    entrySaveRadioButton: {
      label: "Save In Entry",
      help: `Choose how to save data retrieved from ${rootConfig.damEnv.DAM_APP_NAME}.`,
      placeholder: "Enter the data structure to save in the entry",
      all_field_instruction:
        "Select 'All Fields' to add a limited number of assets based on the asset's JSON data.",
      custom_field_instruction:
        "Select 'Custom Fields' to define and select the JSON data to save in the entry.",
      notetext:
        "<b>Note:</b> Changing between 'All' and 'Custom' Fields only applies to newly added assets. Existing assets keep their previous configuration.",
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
        placeholder: "Enter key path",
        instructionS:
          'Use dot notation for nested objects, for eg: "file.url".',
        instructionE:
          "Label already in the dropdown will not be created again.",
        note: "Note: ",
        btn: {
          cancel: "Cancel",
          create: "Create",
          apply: "Create and Apply",
        },
        addOption: "New Key Field",
        successToast: "Key path successfully added to options",
      },
      notification: {
        error: `The option "$var" already exists`,
        limitError: "Error: Limit of 150 options exceeded",
      },
    },
    missingCredentials: "Missing required fields",
    emptyValue: "Field value missing",
    noSelectedDefault: "Select at least one default configuration",
    noConfiguration: "Add at least one configuration",
  },
  CustomFields: {
    assetLimit: {
      btnTooltip:
        "You cannot select more assets as the maximum limit has been reached.",
      notificationMsg:
        "Maximum asset limit has been reached. You cannot add more assets than the preconfigured limit.",
    },
    assetValidation: {
      errorStatement:
        "Error: $var cannot be added as it does not meet the asset constraints.",
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
        "Unable to access the image url. The link may be broken, the asset may have been deleted or you may not have the permission to view it.",
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
      header: "Remove asset from Contentstack Entry",
      body: "You are about to remove <b>&apos;$&apos;</b> from Contentstack Entry.This action cannot be undone.To proceed, select Remove.",
      textPlaceholder: "Enter asset name.",
      cancelButton: "Cancel",
      confirmButton: "Remove",
    },
    AssetNotAddedText: "No assets have been added",
  },
  SelectorPage: {
    title: rootConfig?.damEnv?.DAM_APP_NAME,
  },
  Warnings: {
    incorrectConfig: `The credentials for "${rootConfig?.damEnv?.DAM_APP_NAME}" are invalid or missing. Update the configuration and try again.`,
  },
  AppFailed: {
    Message1: "App location iniailization failed.",
    Message2: "Reload and try again!",
    body: "For assistance, reach out to us at support@contentstack.com",
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
