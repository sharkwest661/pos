// components/desktop/DesktopIcon/DesktopIcon.jsx
import React from "react";
import styles from "./DesktopIcon.module.scss";

const DesktopIcon = ({ icon, label, onClick, isActive }) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) onClick();
  };

  return (
    <div
      className={`${styles.desktopIcon} ${isActive ? styles.active : ""}`}
      onClick={handleClick}
      title={label}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick(e)}
    >
      <div className={styles.iconWrapper}>{icon}</div>
      <div className={styles.iconLabel}>{label}</div>
    </div>
  );
};

export default DesktopIcon;
