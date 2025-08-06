import React from "react";
import "../styles.scss";

interface TypeCustomComponent {}

const CustomSelector: React.FC<TypeCustomComponent> = function () {
  return (
    <div className="config-custom-component">
      Custom Component - This is a custom component and can be modified using
      root_config
    </div>
  );
};

export default CustomSelector;
