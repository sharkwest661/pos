// src/components/apps/terminal/PasswordCracker/SymbolSelector.jsx
import React from "react";
import styles from "./PasswordCracker.module.scss";

/**
 * Component for selecting symbols in the password cracker
 *
 * @param {Object} props - Component props
 * @param {Array} props.symbols - Available symbols to select from
 * @param {function} props.onSelectSymbol - Callback when symbol is selected
 * @param {function} props.onRemoveSymbol - Callback to remove last symbol
 * @param {function} props.onClearSymbols - Callback to clear all symbols
 * @param {function} props.onSubmit - Callback when submit button is clicked
 * @param {boolean} props.disabled - Whether the selector is disabled
 * @param {number} props.currentGuessLength - Current length of the guess
 * @param {number} props.passwordLength - Required password length
 */
const SymbolSelector = ({
  symbols,
  onSelectSymbol,
  onRemoveSymbol,
  onClearSymbols,
  onSubmit,
  disabled = false,
  currentGuessLength = 0,
  passwordLength = 4,
}) => {
  // Calculate grid layout based on number of symbols
  const gridClass =
    symbols.length <= 6 ? styles.symbolGrid6 : styles.symbolGrid8;

  return (
    <div className={styles.symbolSelectorContainer}>
      <div className={`${styles.symbolGrid} ${gridClass}`}>
        {symbols.map((symbol, index) => (
          <button
            key={index}
            className={styles.symbolButton}
            onClick={() => onSelectSymbol(symbol)}
            disabled={disabled || currentGuessLength >= passwordLength}
            title={`Add ${symbol} to password`}
          >
            {symbol}
          </button>
        ))}
      </div>

      <div className={styles.symbolActions}>
        <button
          className={styles.actionButton}
          onClick={onRemoveSymbol}
          disabled={disabled || currentGuessLength === 0}
          title="Delete last symbol"
        >
          DEL
        </button>

        <button
          className={styles.actionButton}
          onClick={onClearSymbols}
          disabled={disabled || currentGuessLength === 0}
          title="Clear all symbols"
        >
          CLEAR
        </button>

        <button
          className={styles.submitButton}
          onClick={onSubmit}
          disabled={disabled || currentGuessLength !== passwordLength}
          title="Submit password attempt"
        >
          {disabled ? "PROCESSING..." : "ATTEMPT"}
        </button>
      </div>
    </div>
  );
};

export default SymbolSelector;
