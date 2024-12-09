import rteConfig from "../../../rte_config/index";

const localeTexts = {
  SelectorPage: {
    title: rteConfig?.damEnv?.DAM_APP_NAME,
  },
  RTE: {
    ToolTip: {
      viewIcon: "Preview",
      openInDAM: `Open In ${rteConfig?.damEnv?.DAM_APP_NAME}`,
    },
    title: `Choose assets from ${rteConfig?.damEnv?.DAM_APP_NAME}`,
    button: {
      cancel: "Cancel",
      save: "Save",
    },
    iconContent: {
      remove: "Remove",
      edit: "Edit Properties",
      preview: "Preview Asset",
      openInDAM: `Open In ${rteConfig?.damEnv?.DAM_APP_NAME}`,
    },
    assetValidation: {
      errorStatement:
        "Error: $var cannot be added as it does not match the asset constraints provided.",
      configDeletedImg:
        "Unable to access the image url. The link might be broken, the asset may have been deleted, or you do not have access to it.",
    },
  },
  DeleteModal: {
    header: "Remove Asset from Contentstack Entry",
    body: "Are you sure you want to remove <b>&apos;$&apos;</b> from Contentstack Entry?",
    textPlaceholder: "Enter asset name for confirmation",
    cancelButton: "Cancel",
    confirmButton: "Remove",
  },
  ModalTitle: {
    video: "Edit Video Properties",
    audio: "Edit Audio Properties",
    image: "Edit Image Properties",
    default: "Edit Asset Properties",
  },
  Icons: {
    embed: "Embed",
    dontSave: "DontSave",
    imageSettings: "ImageSettings",
    addPlus: "AddPlus",
    saveWhite: "SaveWhite",
    removeFilled: "RemoveFilled",
  },
};

export default localeTexts;
