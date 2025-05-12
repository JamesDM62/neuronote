import { useModal } from '../../context/Modal';
import React from 'react';

function OpenModalButton({
  modalComponent,
  buttonText,
  onButtonClick,
  onModalClose
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
  if (onModalClose) setOnModalClose(onModalClose);

  const content = React.isValidElement(modalComponent)
    ? React.cloneElement(modalComponent)
    : modalComponent;

  console.log("Setting modal content:", content); // 🔍 DEBUG
  setModalContent(content);

  if (typeof onButtonClick === "function") onButtonClick();
};


  return <button onClick={onClick}>{buttonText}</button>;
}

export default OpenModalButton;


