// components/common/Modal/Modal.jsx
import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import Button from "../../ui/Button";
import { useThemeStore } from "../../../store";
import styles from "./Modal.module.scss";

/**
 * Reusable modal component with cyberpunk styling
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Function to call when the modal is closed
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.ReactNode} props.footer - Custom footer content (optional)
 * @param {boolean} props.showCloseButton - Whether to show the close button (default: true)
 * @param {string} props.size - Modal size ("sm", "md", "lg") (default: "md")
 * @param {boolean} props.darkHacker - Use dark hacker theme instead of cyberpunk (default: false)
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  showCloseButton = true,
  size = "md",
  darkHacker = false,
}) => {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const effectsEnabled = useThemeStore((state) => state.effectsEnabled);

  // Close modal when clicking outside
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  // Close modal with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Focus trap inside modal
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  // Animation effect for the modal
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.classList.add(styles.animate);

      const timer = setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.classList.remove(styles.animate);
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Combine class names
  const modalClass = [
    styles.modal,
    styles[size],
    darkHacker ? styles.darkHacker : "",
    effectsEnabled?.glitch ? styles.glitchEffect : "",
  ]
    .filter(Boolean)
    .join(" ");

  const overlayClass = [styles.overlay, darkHacker ? styles.darkHacker : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={overlayRef}
      className={overlayClass}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div ref={modalRef} className={modalClass} tabIndex={-1} role="document">
        <div className={styles.header}>
          <h2 id="modal-title" className={styles.title}>
            {title}
          </h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className={styles.closeButton}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <div className={styles.content}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
