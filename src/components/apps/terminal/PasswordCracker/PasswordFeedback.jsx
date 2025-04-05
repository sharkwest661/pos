// src/components/apps/terminal/PasswordCracker/PasswordFeedback.jsx
import React from "react";
import styles from "./PasswordCracker.module.scss";

/**
 * Component to display symbol-by-symbol feedback for password attempts
 *
 * @param {Object} props - Component props
 * @param {Array} props.feedback - Array of feedback items with symbol and status
 */
const PasswordFeedback = ({ feedback = [] }) => {
  if (!feedback || feedback.length === 0) {
    return null;
  }

  return (
    <div className={styles.feedbackContainer}>
      {feedback.map((item, index) => (
        <div
          key={index}
          className={`${styles.feedbackSymbol} ${styles[item.status]}`}
          title={getStatusDescription(item.status)}
        >
          {item.symbol}
        </div>
      ))}
    </div>
  );
};

// Helper function to get human-readable status description
const getStatusDescription = (status) => {
  switch (status) {
    case "correct":
      return "Correct symbol in the correct position";
    case "partial":
      return "Correct symbol in the wrong position";
    case "incorrect":
      return "Incorrect symbol";
    default:
      return "";
  }
};

export default PasswordFeedback;
