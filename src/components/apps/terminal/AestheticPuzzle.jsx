// components/apps/terminal/AestheticPuzzle.jsx
import React, { useState, useEffect } from "react";
import styles from "./AestheticPuzzle.module.scss";

// Symbol set for the game (vaporwave aesthetic)
const SYMBOLS = ["░", "▒", "▓", "█", "◈", "◇", "♦", "♠"];

const AestheticPuzzle = ({ onExit }) => {
  // Game state
  const [targetCode, setTargetCode] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [currentGuess, setCurrentGuess] = useState([]);
  const [remainingAttempts, setRemainingAttempts] = useState(8);
  const [gameStatus, setGameStatus] = useState("playing"); // 'playing', 'won', 'lost'
  const [message, setMessage] = useState("");

  // Generate a random code at the start
  useEffect(() => {
    generateTargetCode();
  }, []);

  // Generate a random 4-symbol code
  const generateTargetCode = () => {
    const codeLength = 4;
    const newCode = [];

    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * SYMBOLS.length);
      newCode.push(SYMBOLS[randomIndex]);
    }

    setTargetCode(newCode);
  };

  // Add a symbol to the current guess
  const addSymbol = (symbol) => {
    if (currentGuess.length < 4) {
      setCurrentGuess([...currentGuess, symbol]);
    }
  };

  // Remove the last symbol from the current guess
  const removeLastSymbol = () => {
    if (currentGuess.length > 0) {
      setCurrentGuess(currentGuess.slice(0, -1));
    }
  };

  // Clear the current guess
  const clearGuess = () => {
    setCurrentGuess([]);
  };

  // Check the current guess against the target code
  const checkGuess = () => {
    if (currentGuess.length !== 4) {
      setMessage("Your guess must be 4 symbols.");
      return;
    }

    // Generate feedback
    const feedback = generateFeedback(currentGuess);

    // Add to attempts
    const newAttempt = {
      guess: [...currentGuess],
      feedback,
      isCorrect: feedback.correct === 4,
    };

    setAttempts([...attempts, newAttempt]);
    setCurrentGuess([]);
    setRemainingAttempts(remainingAttempts - 1);

    // Check win/loss
    if (newAttempt.isCorrect) {
      setGameStatus("won");
      setTimeout(() => {
        onExit(true); // exit with success
      }, 3000);
    } else if (remainingAttempts <= 1) {
      // This was the last attempt
      setGameStatus("lost");
      setTimeout(() => {
        onExit(false); // exit with failure
      }, 3000);
    }
  };

  // Generate feedback for a guess
  const generateFeedback = (guess) => {
    let correct = 0; // Correct symbol in correct position
    let misplaced = 0; // Correct symbol in wrong position

    // Create copies to mark used symbols
    const codeCopy = [...targetCode];
    const guessCopy = [...guess];

    // First pass - check for correct positions
    for (let i = 0; i < codeCopy.length; i++) {
      if (guessCopy[i] === codeCopy[i]) {
        correct++;
        // Mark as used to avoid double-counting
        codeCopy[i] = null;
        guessCopy[i] = null;
      }
    }

    // Second pass - check for correct symbols in wrong positions
    for (let i = 0; i < guessCopy.length; i++) {
      if (guessCopy[i] !== null) {
        const indexInCode = codeCopy.indexOf(guessCopy[i]);
        if (indexInCode !== -1) {
          misplaced++;
          codeCopy[indexInCode] = null; // Mark as used
        }
      }
    }

    return { correct, misplaced };
  };

  return (
    <div className={styles.puzzleContainer}>
      <div className={styles.gameHeader}>
        <h2 className={styles.gameTitle}>ＡＥＳＴＨＥＴＩＣ ＰＵＺＺＬＥ</h2>
        <div className={styles.attempts}>
          Attempts Remaining: {remainingAttempts}/8
        </div>
      </div>

      {/* Game status messages */}
      {gameStatus === "won" && (
        <div className={styles.winMessage}>
          <h3>ＡＥＳＴＨＥＴＩＣ ＡＣＨＩＥＶＥＤ</h3>
          <p>You've broken the code!</p>
        </div>
      )}

      {gameStatus === "lost" && (
        <div className={styles.loseMessage}>
          <h3>ＧＡＭＥ ＯＶＥＲ</h3>
          <p>The code was: {targetCode.join(" ")}</p>
        </div>
      )}

      {/* Current guess display */}
      <div className={styles.guessDisplay}>
        {Array(4)
          .fill()
          .map((_, index) => (
            <div key={index} className={styles.symbolSlot}>
              {currentGuess[index] || ""}
            </div>
          ))}
      </div>

      {/* User input section */}
      <div className={styles.symbolSelector}>
        <div className={styles.symbolGrid}>
          {SYMBOLS.map((symbol, index) => (
            <button
              key={index}
              className={styles.symbolButton}
              onClick={() => addSymbol(symbol)}
              disabled={gameStatus !== "playing" || currentGuess.length >= 4}
            >
              {symbol}
            </button>
          ))}
        </div>

        <div className={styles.controlButtons}>
          <button
            className={styles.controlButton}
            onClick={removeLastSymbol}
            disabled={gameStatus !== "playing" || currentGuess.length === 0}
          >
            DELETE
          </button>
          <button
            className={styles.controlButton}
            onClick={clearGuess}
            disabled={gameStatus !== "playing" || currentGuess.length === 0}
          >
            CLEAR
          </button>
          <button
            className={styles.submitButton}
            onClick={checkGuess}
            disabled={gameStatus !== "playing" || currentGuess.length !== 4}
          >
            SUBMIT
          </button>
        </div>
      </div>

      {/* Feedback message */}
      {message && <div className={styles.message}>{message}</div>}

      {/* Attempt history */}
      <div className={styles.attemptsHistory}>
        <h3 className={styles.historyTitle}>Previous Attempts</h3>

        {attempts.length === 0 ? (
          <div className={styles.noAttempts}>No attempts yet</div>
        ) : (
          <div className={styles.attemptsList}>
            {attempts.map((attempt, index) => (
              <div key={index} className={styles.attemptRow}>
                <div className={styles.attemptNumber}>{8 - index}</div>
                <div className={styles.attemptGuess}>
                  {attempt.guess.map((symbol, i) => (
                    <span key={i} className={styles.guessSymbol}>
                      {symbol}
                    </span>
                  ))}
                </div>
                <div className={styles.attemptFeedback}>
                  <span className={styles.feedbackCorrect}>
                    {attempt.feedback.correct} correct
                  </span>
                  <span className={styles.feedbackMisplaced}>
                    {attempt.feedback.misplaced} misplaced
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Game instructions */}
      <div className={styles.instructions}>
        <h3>HOW TO PLAY</h3>
        <p>Guess the hidden 4-symbol code in 8 attempts or less.</p>
        <p>After each guess, you'll get feedback showing:</p>
        <ul>
          <li>
            <span className={styles.feedbackCorrect}>Correct</span>: right
            symbol in right position
          </li>
          <li>
            <span className={styles.feedbackMisplaced}>Misplaced</span>: right
            symbol in wrong position
          </li>
        </ul>
      </div>

      {/* Exit button */}
      <div className={styles.exitButtonContainer}>
        <button
          className={styles.exitButton}
          onClick={() => onExit(false)}
          disabled={gameStatus === "won" || gameStatus === "lost"}
        >
          EXIT GAME
        </button>
      </div>
    </div>
  );
};

export default AestheticPuzzle;
