import React from "react";
import PropTypes from "prop-types";
import { Tooltip } from "@contentstack/venus-components";

const EmbedBtn = function ({ content, title, onClick, children }) {
  return (
    <Tooltip position="bottom" content={content}>
      <button
        id={title}
        type="button"
        onClick={(e) => {
          e?.preventDefault();
          e?.stopPropagation();
          onClick(e);
        }}
      >
        {children}
      </button>
    </Tooltip>
  );
};

// eslint-disable-next-line
EmbedBtn.propTypes = {
  content: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.any,
};

export default EmbedBtn;
