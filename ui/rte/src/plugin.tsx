/** @jsx jsx */
import { jsx } from "@emotion/core";
import ContentstackSDK from "@contentstack/app-sdk";
import DAMIcon from "./components/DAMIcon";
import ImageElement from "./components/ImageElement";
import { onClickHandler } from "./dam";
import rteConfig from "./rte_config";
import localeTexts from "./common/locale/en-us/index";

export default ContentstackSDK.init()
  .then(async (sdk) => {
    const extensionObj = await sdk?.location;
    const RTE = await extensionObj?.RTEPlugin;

    if (!RTE) return;

    // @ts-ignore
    const DAM = RTE(rteConfig?.damEnv?.DAM_APP_NAME, async (rte: any) => {
      const config = await rte?.getConfig();
      const availableConfig = Object.keys(config?.multi_config_keys ?? {});
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
        render: (props: any) => {
          return <ImageElement availableConfig={availableConfig} {...props} />;
        },
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
      const advancedConfig = await rte?.getFieldConfig();
      // const currentLocale = await rte?.getLocale();
      const savedSelection = rte?.selection?.get();
      onClickHandler({
        extension: sdk,
        rte,
        savedSelection,
        config,
        advancedConfig,
        // currentLocale
      });
    });

    // eslint-disable-next-line
    return {
      DAM,
    };
  })
  .catch((err) => {
    console.error(
      `Error in loading ${rteConfig.damEnv.DAM_APP_NAME} JSON RTE plugin :: `,
      err
    );
  });
