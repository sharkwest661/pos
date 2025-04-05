import React, { useState } from "react";
import { useThemeStore } from "../../../store";
import styles from "./Button.module.scss";

/**
 * Cyberpunk-themed button component
 *
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant ('primary', 'secondary', 'outline', 'danger')
 * @param {string} props.size - Button size ('sm', 'md', 'lg')
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {boolean} props.fullWidth - Whether the button should take full width
 * @param {boolean} props.darkHacker - Use dark hacker theme instead of cyberpunk
 * @param {function} props.onClick - Click handler
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - Additional CSS classes
 */
const Button = ({
  variant = "primary",
  size = "md",
  disabled = false,
  fullWidth = false,
  darkHacker = false,
  onClick,
  children,
  className = "",
  ...rest
}) => {
  const [isPressed, setIsPressed] = useState(false);

  // Handle mouse events for visual effects
  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  // Map size prop to CSS class
  const sizeClass = {
    sm: styles.small,
    md: styles.medium,
    lg: styles.large,
  }[size];

  // Combine all class names
  const buttonClasses = [
    styles.button,
    styles[variant],
    sizeClass,
    disabled ? styles.disabled : "",
    fullWidth ? styles.fullWidth : "",
    darkHacker ? styles.darkHacker : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      className={buttonClasses}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
