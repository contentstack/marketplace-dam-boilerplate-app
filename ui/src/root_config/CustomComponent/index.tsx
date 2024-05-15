// import React from "react";
// import "../styles.scss";
// import {
//   Accordion,
//   Button,
//   Field,
//   FieldLabel,
//   TextInput,
//   cbModal,
// } from "@contentstack/venus-components";
// import ModalComponent from "../../components/MultiConfigModal";

// interface TypeCustomComponent {
//   handleCustomConfigUpdate: Function;
// }

// const CustomComponent: React.FC<TypeCustomComponent> = function ({
//   handleCustomConfigUpdate,
// }) {
//   const onClose = () => {
//     console.info('on modal close');
//   };

//   const handleClick = () => {
//     cbModal({
//       component: (props: any) => <ModalComponent {...props} />,
//       modalProps: {
//         onClose,
//         onOpen: () => {
//           console.info('onOpen gets called');
//         },
//       },
//       testId: 'cs-modal-storybook',
//     });
//   };

//   return (
//     <>
//       <Accordion
//         dashedLineVisibility="hover"
//         errorMessage=""
//         hasBackgroundColor
//         isAccordionParent
//         renderExpanded
//         setTitleOnHide=""
//         title="Multi Config"
//         version="v2"
//         className="asset-tracker-setting"
//       >
//         <div className="multiconfig-fields">
//           <Field>
//             <FieldLabel required htmlFor="client_id">
//               Organization URL
//             </FieldLabel>
//             <TextInput
//               id="org_url"
//               placeholder="Organization URL"
//               name="org_url"
//               type="text"
//               version="v2"
//               onChange={handleCustomConfigUpdate}
//             />
//           </Field>
//         </div>
//         <span>
//           <Button
//             buttonType="secondary"
//             icon="PlusSign"
//             size="small"
//             version="v1"
//           >
//             Add new config
//           </Button>
//         </span>
//       </Accordion>
//       <Button
//         buttonType="outline"
//         id="modal-stories"
//         onClick={handleClick}
//       >
//         <span>
//           Open Modal
//         </span>
//       </Button>
//     </>
//   );
// };

// export default CustomComponent;

import React from "react";
import "../styles.scss";

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
