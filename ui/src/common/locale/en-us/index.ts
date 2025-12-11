import DamEnvVariables from "../../../root_config/DamEnv";

const localeTexts = {
  ConfigFields: {
    AccordianConfig: {
      mainName: "Configuration",
      multiConfigLabel: `Configure your ${DamEnvVariables?.DAM_APP_NAME} credentials`,
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
      help: `Choose how to save data retrieved from ${DamEnvVariables.DAM_APP_NAME}.`,
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
      label: `${DamEnvVariables.DAM_APP_NAME} Keys`,
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
    validationError: "Validation error",
    tabs: {
      basic: "Basic",
      advanced: "Advanced",
    },
    AdvancedConfig: {
      unified: {
        label: "Config Rules",
        helpText:
          "Configure branch-specific or locale-specific config rules. Select a branch and optionally a locale to apply different configurations for specific contexts.",
        heading: "Choose your default config rules",
        tableTitle: "Config Mapping",
        leftPlaceholder: "Select Branch",
        middlePlaceholder: "Select Locale",
        rightPlaceholder: "Select Config",
        addMoreBtn: "Add Rule",
        localeHelperText: "Leave empty to apply to all locales",
        infoMessage:
          "<b>Branch-Level Rules</b>: You need to select one branch and one config to apply rules across all locales in branch. <b>Locale-Level Rules</b>: You need to select one branch, one locale and one config to target rules for specific locales.",
      },
      common: {
        noOptionsMessage: "No options",
        deleteTooltip: "Remove",
        separator: "-",
        invalidConfigTooltip: "This configuration was removed. This rule will not work.",
        branchHeader: "Branch",
        configHeader: "Config",
        localeHeader: "Locale",
        invalidConfigColors: {
          borderFocused: "#ef4444",
          borderUnfocused: "#f87171",
          borderHover: "#ef4444",
          boxShadow: "rgba(239, 68, 68, 0.1)",
        },
      },
    },
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
      loadingTooltip: "Loading configuration...",
    },
    assetCard: {
      hoverActions: {
        preview: "Preview",
        platformRedirect: `Open In ${DamEnvVariables?.DAM_APP_NAME}`,
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
    title: DamEnvVariables?.DAM_APP_NAME,
    table: {
      headers: {
        image: "Image",
        name: "Name",
        fileType: "File Type",
        size: "Size",
        width: "Width",
        height: "Height",
        createdDate: "Created Date",
      },
      errors: {
        failedToLoadAssets: "Failed to load assets",
      },
      searchPlaceholder: "Search assets...",
      emptyState: {
        heading: "No assets found",
        description: "Try adjusting your search criteria",
      },
      buttons: {
        cancel: "Cancel",
        add: "Add",
        addAsset: "Asset",
        addAssets: "Assets",
      },
    },
  },
  Warnings: {
    incorrectConfig: `The credentials for "${DamEnvVariables?.DAM_APP_NAME}" are invalid or missing. Update the configuration and try again.`,
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
