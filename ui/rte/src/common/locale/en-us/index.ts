import rteConfig from "../../../rte_config/index";

const localeTexts = {
  SelectorPage: {
    title: `${rteConfig?.damEnv?.DAM_APP_NAME} Extension`,
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
  },
  DeleteModal: {
    header: "Delete",
    body: "This will delete <b>&apos;$&apos;</b> permanently.",
    cancelButton: "Cancel",
    confirmButton: "Delete",
  },
  ModalTitle: {
    video: "Edit Video",
    audio: "Edit Audio",
    image: "Edit Image",
    default: "Edit Asset",
  },
};

export default localeTexts;
