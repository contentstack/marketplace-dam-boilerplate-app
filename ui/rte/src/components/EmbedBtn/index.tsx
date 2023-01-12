import React from "react";
import { Tooltip } from "@contentstack/venus-components";

const EmbedBtn = function ({ content, onClick, children, title }: any) {
  return (
    <Tooltip position="bottom" content={content}>
      <button
        id={title}
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick(e);
        }}
      >
        {children}
      </button>
    </Tooltip>
  );
};

export default EmbedBtn;
