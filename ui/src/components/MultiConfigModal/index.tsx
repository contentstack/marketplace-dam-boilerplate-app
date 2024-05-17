import React from "react";
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  ButtonGroup,
  Button,
} from "@contentstack/venus-components";

function ModalComponent(props: { closeModal: () => any }) {
  return (
    <>
      <ModalHeader
        title="Modal header"
        closeModal={props.closeModal}
        closeIconTestId="cs-default-header-close"
      />
      <ModalBody className="modalBodyCustomClass">
        <h3>Hello from modal</h3> <br />
        <p>
          The Modal component is a dialog box/popup window that is displayed on
          top of the current page
        </p>
      </ModalBody>
      <ModalFooter>
        <ButtonGroup>
          <Button buttonType="light" onClick={() => props.closeModal()}>
            Cancel
          </Button>
          <Button>Send</Button>
        </ButtonGroup>
      </ModalFooter>
    </>
  );
}

export default ModalComponent;
