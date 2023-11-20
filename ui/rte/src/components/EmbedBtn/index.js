import React from "react";
import { Tooltip } from "@contentstack/venus-components";

const EmbedBtn = function (props) {
  return (
    <Tooltip position="bottom" content={props?.content}>
      <button
        id={props?.title}
        type="button"
        onClick={(e) => {
          e?.preventDefault();
          e?.stopPropagation();
          props?.onClick(e);
        }}
      >
        {props?.children}
      </button>
    </Tooltip>
  );
};

export default EmbedBtn;
