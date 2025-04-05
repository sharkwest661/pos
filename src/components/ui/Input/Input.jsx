import React, { useState, useRef } from "react";
import { useThemeStore } from "../../../store";
import styles from "./Input.module.scss";

/**
 * Cyberpunk-themed input component
 *
 * @param {Object} props - Component props
 * @param {string} props.type - Input type ('text', 'password', 'number', etc.)
 * @param {string} props.label - Input label
 * @param {string} props.placeholder - Input placeholder
 * @param {string} props.value - Input value
 * @param {boolean} props.disabled - Whether the input is disabled
 * @param {boolean} props.darkHacker - Use dark hacker theme instead of cyberpunk
 * @param {boolean} props.error - Whether there's an error
 * @param {string} props.errorMessage - Error message to display
 * @param {function} props.onChange - Change handler
 * @param {string} props.className - Additional CSS classes
 */
const Input = ({
  type = "text",
  label,
  placeholder,
  value = "",
  disabled = false,
  darkHacker = false,
  error = false,
  errorMessage = "",
  onChange,
  className = "",
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // Get effects configuration
  const effectsEnabled = useThemeStore((state) => state.effectsEnabled);

  // Handle focus events
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  // Focus the input when the label is clicked
  const handleLabelClick = () => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  };

  // Combine class names
  const containerClass = [styles.container, className]
    .filter(Boolean)
    .join(" ");

  const labelClass = [
    styles.label,
    isFocused ? styles.focused : "",
    disabled ? styles.disabled : "",
    error ? styles.error : "",
    darkHacker ? styles.darkHacker : "",
  ]
    .filter(Boolean)
    .join(" ");

  const inputClass = [
    styles.input,
    disabled ? styles.disabled : "",
    error ? styles.error : "",
    darkHacker ? styles.darkHacker : "",
  ]
    .filter(Boolean)
    .join(" ");

  const effectLineClass = [
    styles.effectLine,
    error ? styles.error : "",
    darkHacker ? styles.darkHacker : "",
  ]
    .filter(Boolean)
    .join(" ");

  const scanlineClass = [
    styles.scanline,
    error ? styles.error : "",
    darkHacker ? styles.darkHacker : "",
  ]
    .filter(Boolean)
    .join(" ");

  const errorMessageClass = [
    styles.errorMessage,
    darkHacker ? styles.darkHacker : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClass}>
      {label && (
        <label className={labelClass} onClick={handleLabelClick}>
          {label}
        </label>
      )}

      <div className={styles.inputWrapper}>
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={inputClass}
          {...rest}
        />

        {/* Scanline effect */}
        {effectsEnabled?.scanlines && isFocused && !disabled && (
          <div className={styles.scanlineEffect}>
            <div className={scanlineClass}></div>
          </div>
        )}

        {/* Effect line (underline) */}
        <div
          className={effectLineClass}
          style={{ width: isFocused && !disabled ? "100%" : "0%" }}
        ></div>
      </div>

      {/* Error message */}
      {error && errorMessage && (
        <div className={errorMessageClass}>{errorMessage}</div>
      )}
    </div>
  );
};

export default Input;
