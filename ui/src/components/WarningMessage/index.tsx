import React from "react";
import { Icon, Info } from "@contentstack/venus-components";
import { Props } from "../../common/types";

const WarningMessage: React.FC<Props> = function ({ content }) {
  const infoIcon = (
    <Icon icon="Warning" size="small" data-testid="warning-icon" />
  );
  return (
    <Info
      className="component"
      icon={infoIcon}
      content={content?.split("\n")?.map((i: string) => (
        <div key={`key-${i}`} dangerouslySetInnerHTML={{ __html: i }} />
      ))}
      type="attention"
    />
  );
};
export default WarningMessage;
