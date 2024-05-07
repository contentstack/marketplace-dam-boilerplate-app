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
  },
  DeleteModal: {
    header: "Remove Asset from Contentstack Entry",
    body: "Are you sure you want to remove <b>&apos;$&apos;</b> from Contentstack Entry?",
    cancelButton: "Cancel",
    confirmButton: "Remove",
  },
  ModalTitle: {
    video: "Edit Video Properties",
    audio: "Edit Audio Properties",
    image: "Edit Image Properties",
    default: "Edit Asset Properties",
  },
};

export default localeTexts;
