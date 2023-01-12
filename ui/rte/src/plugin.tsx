/* eslint-disable */
/** @jsx jsx */
import { jsx } from "@emotion/core";
import ContentstackSDK from "@contentstack/app-sdk";
import DAMIcon from "./components/DAMImages/DAMIcon";
import ImageElement from "./components/DAMImages/ImageElement";
import { onClickHandler } from "./dam";
import rteConfig from "./rte_config";
import localeTexts from "./common/locale/en-us/index";

export default ContentstackSDK.init()
  .then(async (sdk) => {
    const extensionObj = await sdk?.location;
    const RTE = await extensionObj?.RTEPlugin;

    if (!RTE) return;

    const DAM = RTE(rteConfig?.damEnv?.DAM_APP_NAME, (rte: any) => {
      const inline = rte?._adv?.editor?.isInline;
      rte._adv.editor.isInline = (element: any) => {
        if (
          element?.type === rteConfig?.damEnv?.DAM_APP_NAME &&
          element?.attrs?.inline
        ) {
          return true;
        }
        return inline(element);
      };

      return {
        title: localeTexts.RTE.title,
        icon: <DAMIcon />,
        render: ImageElement,
        display: ["toolbar"],
        elementType: ["void"],
      };
    });

    // @ts-ignore
    DAM.on("beforeRender", (rte: RTE) => {
      if (
        rte?.element?.type === rteConfig?.damEnv?.DAM_APP_NAME &&
        rte?.element?.attrs?.inline
      ) {
        rte.DisableDND = true;
        rte.DisableSelectionHalo = true;
      }
    });

    // @ts-ignore
    DAM.on("exec", async (rte: RTE) => {
      const config = await rte?.getConfig();
      const savedSelection = rte?.selection?.get();
      onClickHandler({ extension: sdk, rte, savedSelection, config });
    });

    return {
      DAM,
    };
  })
  .catch((err) => {
    console.error(
      `Error in loading ${rteConfig?.damEnv?.DAM_APP_NAME} plugin :: `,
      err
    );
  });
