// components/common/ConfirmationModal/ConfirmationModal.jsx
import React from "react";
import Modal from "../Modal";
import Button from "../../ui/Button";
import styles from "./ConfirmationModal.module.scss";

/**
 * A specialized modal for confirmation dialogs
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Function to call when the modal is closed
 * @param {string} props.title - Modal title
 * @param {string} props.message - Confirmation message
 * @param {string} props.confirmText - Text for confirm button (default: "Confirm")
 * @param {string} props.cancelText - Text for cancel button (default: "Cancel")
 * @param {string} props.confirmVariant - Button variant for confirm button (default: "danger")
 * @param {function} props.onConfirm - Function to call when confirm is clicked
 * @param {boolean} props.darkHacker - Use dark hacker theme (default: false)
 */
const ConfirmationModal = ({
  isOpen,
  onClose,
  title = "Confirm Action",
  message = "Are you sure you want to perform this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "danger",
  onConfirm,
  darkHacker = false,
}) => {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const footer = (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={onClose}
        darkHacker={darkHacker}
      >
        {cancelText}
      </Button>
      <Button
        variant={confirmVariant}
        size="sm"
        onClick={handleConfirm}
        darkHacker={darkHacker}
      >
        {confirmText}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
      size="sm"
      darkHacker={darkHacker}
    >
      <div className={styles.message}>{message}</div>
    </Modal>
  );
};

export default ConfirmationModal;
