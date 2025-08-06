import React from "react";
import { Icon, Info } from "@contentstack/venus-components";
import parse from "html-react-parser";
import { Props } from "../../common/types";
import localeTexts from "../../common/locale/en-us";

const InfoMessage: React.FC<Props> = function ({ content, type }) {
  let infoIcon = (
    <Icon
      icon={localeTexts.Icons.warning}
      size="small"
      data-testid="warning-icon"
    />
  );

  if (!type) infoIcon = <Icon icon="InfoCircleWhite" />;

  return (
    <Info
      className="component"
      icon={infoIcon}
      content={content?.split("\n")?.map((i: string) => (
        <div key={`key-${i}`}>{parse(i ?? "")}</div>
      ))}
      type={type}
    />
  );
};
export default InfoMessage;
