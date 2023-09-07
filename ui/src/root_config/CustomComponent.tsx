/* Import React modules */
import React from "react";
/* Import other node modules */
/* Import our modules */
/* Import node module CSS */
/* Import our CSS */
import "./styles.scss";

interface TypeCustomComponent {}

const CustomComponent: React.FC<TypeCustomComponent> = function () {
  return (
    <div className="config-custom-component">
      Custom Component - This is a custom component and can be modified using
      root_config
    </div>
  );
};

export default CustomComponent;
