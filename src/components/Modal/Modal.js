import { useRef } from "react";
import { useEffect } from "react";
import {
  EmptyModalCloseContainer,
  EmptyModalContainer,
  ModalButtonContainer,
  ModalContainer,
  ModalContent,
  ModalTitle,
} from "./ModalStyles";
import { ThemeProvider } from "styled-components";
import { theme } from "../../theme";
import { IoMdClose } from "react-icons/io";
import Button from "../Button/Button";

//Props:
{
  /* <Modal
handleModalClose={() => {
  setShowModal(false);
}}
modalType="action"
actionButtonText="Delete"
actionButtonColor={theme.statusError}
actionButtonClick={() => {}}
show={showModal}
modalTitle="Delete User"
modalContent="Are you sure you want to delete this user? This action cannot be undone."
/> */
}

//Exmaple of empty modal with custom content:
{
  /* <Modal
  show={showModal}
  handleModalClose={() => {
    setShowModal(false);
  }}
  modalType="empty"
  showCross={true}
>
  <div style={{ width: "20rem", background: "red", height: "20rem" }}>
    content goes here
  </div>
</Modal>; */
}

//Usage:
//1. In the parent element just send a boolean prop (true/false), true will open the modal, false will close it.

const Modal = (props) => {
  const modalRef = useRef(null);
  const modalType = props.modalType;

  const showModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.close();
      props.handleModalClose();
    }
  };

  useEffect(() => {
    if (props.show) {
      showModal();
    } else {
      closeModal();
    }
  }, [props.show]);

  const getModalType = () => {
    switch (modalType) {
      case "empty":
        return (
          <ThemeProvider theme={props.theme}>
            <EmptyModalContainer ref={modalRef} display={props.show}>
              <EmptyModalCloseContainer display={props.showCross}>
                <IoMdClose
                  size="1.8rem"
                  onClick={() => {
                    closeModal();
                  }}
                  style={{ cursor: "pointer" }}
                />
              </EmptyModalCloseContainer>

              {props.children}
            </EmptyModalContainer>
          </ThemeProvider>
        );
      case "action":
        return (
          <ThemeProvider theme={props.theme}>
            <ModalContainer display={props.show} ref={modalRef}>
              <ModalTitle>{props.modalTitle}</ModalTitle>
              <ModalContent>{props.modalContent}</ModalContent>
              <ModalButtonContainer>
                <Button
                  filled={true}
                  filledColor={props.actionButtonColor}
                  defaultColor={props.actionButtonColor}
                  onClick={() => {
                    closeModal();
                    props.actionButtonClick();
                  }}
                >
                  {props.actionButtonText ? props.actionButtonText : "OK"}
                </Button>
                <Button
                  onClick={() => {
                    closeModal();
                  }}
                >
                  {props.closingButtonText ? props.closingButtonText : "Cancel"}
                </Button>
              </ModalButtonContainer>
            </ModalContainer>
          </ThemeProvider>
        );
      default:
        return (
          <ModalContainer display={props.show} ref={modalRef}>
            <ModalTitle>{props.modalTitle}</ModalTitle>
            <ModalContent>{props.modalContent}</ModalContent>
            <ModalButtonContainer>
              <Button
                filled={false}
                filledColor={props.actionButtonColor}
                defaultColor={props.actionButtonColor}
                onClick={() => {
                  closeModal();
                }}
              >
                {props.closingButtonText ? props.closingButtonText : "OK"}
              </Button>
            </ModalButtonContainer>
          </ModalContainer>
        );
    }
  };

  return <ThemeProvider theme={theme}>{getModalType()}</ThemeProvider>;
};

export default Modal;
