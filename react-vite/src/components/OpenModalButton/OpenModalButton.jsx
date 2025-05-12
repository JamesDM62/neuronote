import { useModal } from '../../context/Modal';
import React from 'react';

function OpenModalButton({
  modalComponent,
  buttonText,
  onButtonClick,
  onModalClose
}) {
  const { setModalContent, setOnModalClose, closeModal } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);

    // Inject closeModal into modalComponent if it's valid JSX
    const content = React.isValidElement(modalComponent)
      ? React.cloneElement(modalComponent, { closeModal })
      : modalComponent;

    setModalContent(content);

    if (typeof onButtonClick === "function") onButtonClick();
  };

  return <button onClick={onClick}>{buttonText}</button>;
}

export default OpenModalButton;



