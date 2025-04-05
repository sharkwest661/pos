// src/components/apps/terminal/PasswordCracker/PasswordCracker.jsx
import React, { useState, useEffect } from "react";
import SymbolSelector from "./SymbolSelector";
import PasswordFeedback from "./PasswordFeedback";
import styles from "./PasswordCracker.module.scss";

// Cryptographic symbols set
const SYMBOLS = ["Ω", "λ", "π", "∑", "∆", "φ", "β", "γ"];

/**
 * Password cracking minigame component using symbols instead of characters
 *
 * @param {Object} props - Component props
 * @param {string} props.targetPassword - The password to be cracked (as a sequence of symbols)
 * @param {number} props.maxAttempts - Maximum number of attempts allowed
 * @param {function} props.onSuccess - Callback for successful crack
 * @param {function} props.onFailure - Callback for unsuccessful crack
 * @param {function} props.onExit - Callback to exit cracking mode
 * @param {string} props.hint - Optional hint about the password
 * @param {string} props.difficulty - Password difficulty level ('easy', 'medium', 'hard')
 * @param {string} props.vendorName - Name of the vendor being hacked
 */
const PasswordCracker = ({
  targetPassword,
  maxAttempts = 6,
  onSuccess,
  onFailure,
  onExit,
  hint = "",
  difficulty = "medium",
  vendorName = "",
}) => {
  // State for user input and game state
  const [currentGuess, setCurrentGuess] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [remainingAttempts, setRemainingAttempts] = useState(maxAttempts);
  const [gameStatus, setGameStatus] = useState("in-progress"); // "in-progress", "success", "failure"
  const [errorMessage, setErrorMessage] = useState("");
  const [processingGuess, setProcessingGuess] = useState(false);

  // Difficulty settings
  const difficultyConfig = {
    easy: { symbols: 4, attempts: 7 },
    medium: { symbols: 5, attempts: 6 },
    hard: { symbols: 6, attempts: 5 },
  };

  // Ensure target password is an array
  const targetArray = Array.isArray(targetPassword)
    ? targetPassword
    : targetPassword.split("");

  // Get the password length based on difficulty
  const [passwordLength, setPasswordLength] = useState(
    difficultyConfig[difficulty]?.symbols || targetArray.length
  );

  // Number of available symbols based on difficulty (4-6 symbols)
  const symbolsToUse = passwordLength + 2; // Use a few more symbols than needed
  const availableSymbols = SYMBOLS.slice(0, symbolsToUse);

  // Set maximum attempts based on difficulty if not specified
  useEffect(() => {
    if (!maxAttempts) {
      setRemainingAttempts(difficultyConfig[difficulty]?.attempts || 6);
    }
  }, [difficulty, maxAttempts]);

  // Generate feedback for a guess
  const generateFeedback = (guess) => {
    const feedback = [];
    const targetCopy = [...targetArray];
    const guessCopy = [...guess];

    // First pass - mark exact matches (correct position)
    for (let i = 0; i < targetCopy.length; i++) {
      if (i >= guessCopy.length) break;

      if (guessCopy[i] === targetCopy[i]) {
        feedback[i] = { symbol: guessCopy[i], status: "correct" };
        // Mark as used
        guessCopy[i] = null;
        targetCopy[i] = null;
      }
    }

    // Count remaining symbols in target
    const targetSymbolCounts = {};
    for (const symbol of targetCopy) {
      if (symbol !== null) {
        targetSymbolCounts[symbol] = (targetSymbolCounts[symbol] || 0) + 1;
      }
    }

    // Second pass - mark partial matches (wrong position)
    for (let i = 0; i < guessCopy.length; i++) {
      if (feedback[i]) continue; // Skip already matched positions

      const guessSymbol = guessCopy[i];
      if (guessSymbol !== null && targetSymbolCounts[guessSymbol] > 0) {
        feedback[i] = { symbol: guessSymbol, status: "partial" };
        targetSymbolCounts[guessSymbol]--;
      } else {
        feedback[i] = { symbol: guessSymbol, status: "incorrect" };
      }
    }

    return feedback;
  };

  // Check if the guess is correct
  const isCorrectGuess = (feedback) => {
    return (
      feedback.every((item) => item.status === "correct") &&
      feedback.length === targetArray.length
    );
  };

  // Add a symbol to the current guess
  const handleAddSymbol = (symbol) => {
    if (currentGuess.length < passwordLength) {
      setCurrentGuess([...currentGuess, symbol]);
      setErrorMessage("");
    }
  };

  // Remove the last symbol from the current guess
  const handleRemoveSymbol = () => {
    if (currentGuess.length > 0) {
      setCurrentGuess(currentGuess.slice(0, -1));
    }
  };

  // Clear the current guess
  const handleClearGuess = () => {
    setCurrentGuess([]);
  };

  // Handle guess submission
  const handleSubmitGuess = async () => {
    // Validate input
    if (currentGuess.length === 0) {
      setErrorMessage("Please enter a guess");
      return;
    }

    if (currentGuess.length !== passwordLength) {
      setErrorMessage(`Password must be ${passwordLength} symbols`);
      return;
    }

    setErrorMessage("");
    setProcessingGuess(true);

    // Simulate processing delay for effect
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Generate feedback
    const feedback = generateFeedback(currentGuess);
    const correct = isCorrectGuess(feedback);

    // Add to attempts history
    const newAttempt = {
      guess: [...currentGuess],
      feedback,
      timestamp: new Date(),
      isCorrect: correct,
    };

    setAttempts((prev) => [...prev, newAttempt]);
    setRemainingAttempts((prev) => prev - 1);
    setCurrentGuess([]);
    setProcessingGuess(false);

    // Check for win/loss
    if (correct) {
      setGameStatus("success");
      if (onSuccess) onSuccess(currentGuess.join(""));
    } else if (remainingAttempts <= 1) {
      // This was the last attempt
      setGameStatus("failure");
      if (onFailure) onFailure();
    }
  };

  // Exit cracking mode
  const handleExit = () => {
    if (onExit) onExit();
  };

  // Get a progressive hint based on failed attempts
  const getProgressiveHint = () => {
    const attemptCount = maxAttempts - remainingAttempts;

    // Base hint is always shown
    if (hint) return hint;

    // Progressive hints based on attempts
    if (attemptCount >= 3) {
      return `The password likely relates to ${vendorName}'s activities or specialty.`;
    }
    if (attemptCount >= 2) {
      return `Try using patterns common in ${difficulty} security systems.`;
    }
    if (attemptCount >= 1) {
      return "Look for patterns in the feedback - symbols in the correct position will be marked green.";
    }

    return "Enter your first guess to start cracking.";
  };

  // Difficulty indicator text and color
  const getDifficultyDisplay = () => {
    switch (difficulty) {
      case "easy":
        return { text: "LOW", colorClass: styles.easyDifficulty };
      case "hard":
        return { text: "HIGH", colorClass: styles.hardDifficulty };
      case "medium":
      default:
        return { text: "MEDIUM", colorClass: styles.mediumDifficulty };
    }
  };

  const difficultyDisplay = getDifficultyDisplay();

  return (
    <div className={styles.passwordCracker}>
      <div className={styles.header}>
        <div className={styles.title}>
          PASSWORD CRACKING SYSTEM
          <span
            className={`${styles.difficultyIndicator} ${difficultyDisplay.colorClass}`}
          >
            SECURITY: {difficultyDisplay.text}
          </span>
        </div>
        <div className={styles.attempts}>
          Attempts Remaining: {remainingAttempts}/{maxAttempts}
        </div>
      </div>

      {/* Target info */}
      <div className={styles.targetInfo}>
        <div className={styles.targetLabel}>TARGET:</div>
        <div className={styles.targetValue}>
          {vendorName || "Unknown System"}
        </div>
      </div>

      {/* Progressive hint based on attempts */}
      <div className={styles.hintContainer}>
        <div className={styles.hintLabel}>SYSTEM ANALYSIS:</div>
        <div className={styles.hintValue}>{getProgressiveHint()}</div>
      </div>

      {/* Input area */}
      {gameStatus === "in-progress" && (
        <div className={styles.inputArea}>
          <div className={styles.inputLabel}>ENTER PASSWORD SEQUENCE:</div>

          {/* Current guess display */}
          <div className={styles.passwordBoxesContainer}>
            {Array(passwordLength)
              .fill()
              .map((_, index) => (
                <div key={index} className={styles.passwordBox}>
                  {currentGuess[index] || ""}
                </div>
              ))}
          </div>

          {/* Symbol selector for input */}
          <SymbolSelector
            symbols={availableSymbols}
            onSelectSymbol={handleAddSymbol}
            onRemoveSymbol={handleRemoveSymbol}
            onClearSymbols={handleClearGuess}
            onSubmit={handleSubmitGuess}
            disabled={processingGuess}
            currentGuessLength={currentGuess.length}
            passwordLength={passwordLength}
          />

          {errorMessage && (
            <div className={styles.errorMessage}>{errorMessage}</div>
          )}
        </div>
      )}

      {/* Attempt history */}
      <div className={styles.attemptsContainer}>
        <div className={styles.attemptsHeader}>
          <div className={styles.attemptsTitle}>ATTEMPT HISTORY</div>
        </div>

        <div className={styles.attemptsList}>
          {attempts.length === 0 ? (
            <div className={styles.noAttempts}>No attempts yet</div>
          ) : (
            attempts.map((attempt, index) => (
              <div key={index} className={styles.attemptItem}>
                <div className={styles.attemptNumber}>
                  {maxAttempts - (attempts.length - 1 - index)}
                </div>
                <div className={styles.attemptGuess}>
                  <PasswordFeedback feedback={attempt.feedback} />
                </div>
                <div className={styles.attemptResult}>
                  {attempt.isCorrect ? (
                    <span className={styles.correctResult}>ACCESS GRANTED</span>
                  ) : (
                    <span className={styles.incorrectResult}>INVALID</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Game over messages */}
      {gameStatus === "success" && (
        <div className={styles.successMessage}>
          <div className={styles.successTitle}>ACCESS GRANTED</div>
          <div className={styles.successDetails}>
            Password successfully cracked:{" "}
            <span className={styles.password}>{targetArray.join("")}</span>
          </div>
          <button onClick={handleExit} className={styles.continueButton}>
            CONTINUE
          </button>
        </div>
      )}

      {gameStatus === "failure" && (
        <div className={styles.failureMessage}>
          <div className={styles.failureTitle}>ACCESS DENIED</div>
          <div className={styles.failureDetails}>
            Maximum attempts reached. System locked.
          </div>
          <div className={styles.failurePassword}>
            The password was:{" "}
            <span className={styles.password}>{targetArray.join("")}</span>
          </div>
          <button onClick={handleExit} className={styles.continueButton}>
            EXIT
          </button>
        </div>
      )}
    </div>
  );
};

export default PasswordCracker;
