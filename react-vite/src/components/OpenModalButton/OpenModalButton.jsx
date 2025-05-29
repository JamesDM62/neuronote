import { useModal } from '../../context/Modal';
import React from 'react';

function OpenModalButton({
  modalComponent,
  buttonText,
  onButtonClick,
  onModalClose,
  className
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = (event) => {
  if (onModalClose) setOnModalClose(onModalClose);

  const content = React.isValidElement(modalComponent)
    ? React.cloneElement(modalComponent)
    : modalComponent;

  console.log("Setting modal content:", content); // 🔍 DEBUG
  setModalContent(content);

  if (typeof onButtonClick === "function") onButtonClick(event);
};


  return <button onClick={onClick} className={className}>{buttonText}</button>;
}

export default OpenModalButton;


