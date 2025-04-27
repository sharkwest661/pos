// components/apps/terminal/Terminal.jsx
import React, { useState, useEffect, useRef } from "react";
import { Scanlines } from "../../effects/Scanlines";
import { useThemeStore, useTerminalStore } from "../../../store";
import AestheticPuzzle from "./AestheticPuzzle";
import VaporAdventure from "./VaporAdventure";
import styles from "./Terminal.module.scss";
import { SYSTEM_INFO, getRandomMessage } from "../../../constants/systemInfo";

const Terminal = () => {
  // Get theme configuration
  const effectsEnabled = useThemeStore((state) => state.effectsEnabled);

  // Get terminal state from store
  const history = useTerminalStore((state) => state.history);
  const currentDir = useTerminalStore((state) => state.currentDir);
  const commandHistory = useTerminalStore((state) => state.commandHistory);
  const historyIndex = useTerminalStore((state) => state.historyIndex);
  const inGameMode = useTerminalStore((state) => state.inGameMode);
  const gameType = useTerminalStore((state) => state.gameType);

  // Get terminal actions from store
  const addCommandToHistory = useTerminalStore(
    (state) => state.addCommandToHistory
  );
  const addOutput = useTerminalStore((state) => state.addOutput);
  const setCurrentDir = useTerminalStore((state) => state.setCurrentDir);
  const navigateCommandHistory = useTerminalStore(
    (state) => state.navigateCommandHistory
  );
  const getCurrentCommandFromHistory = useTerminalStore(
    (state) => state.getCurrentCommandFromHistory
  );
  const setInGameMode = useTerminalStore((state) => state.setInGameMode);
  const setGameType = useTerminalStore((state) => state.setGameType);

  // Local input state
  const [input, setInput] = useState("");

  // References
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input when terminal is clicked
  const focusInput = () => {
    if (inputRef.current && !inGameMode) {
      inputRef.current.focus();
    }
  };

  // Handle form submission (execute command)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add command to history
    addCommandToHistory(input);

    // Process command
    processCommand(input);

    // Clear input
    setInput("");
  };

  // Process commands
  const processCommand = (cmd) => {
    const args = cmd.trim().split(" ");
    const command = args[0].toLowerCase();

    switch (command) {
      case "help":
        addOutput([
          "Available commands:",
          "  help        - Show this help message",
          "  clear       - Clear the terminal",
          "  echo        - Echo text to the terminal",
          "  dir         - List files in current directory",
          "  cd          - Change directory",
          "  enigma      - Play ENIGMA_PUZZLE game",
          "  adventure   - Play VAPORNET text adventure game",
          "  time        - Display current time",
          "  vaporwave   - Convert text to vaporwave style",
          "  exit        - Exit terminal",
        ]);
        break;

      case "clear":
        useTerminalStore.getState().clearTerminal();
        break;

      case "echo":
        if (args.length > 1) {
          addOutput([args.slice(1).join(" ")]);
        } else {
          addOutput(["ECHO is on."]);
        }
        break;

      case "dir":
        listDirectory();
        break;

      case "cd":
        changeDirectory(args[1]);
        break;

      case "enigma":
        startGame("puzzle");
        break;

      case "adventure":
        startAdventure();
        break;

      case "time":
        showTime();
        break;

      case "vaporwave":
        if (args.length > 1) {
          vaporwaveText(args.slice(1).join(" "));
        } else {
          addOutput(["Usage: vaporwave <text>"]);
        }
        break;

      case "exit":
        addOutput(["Exiting terminal is not permitted."]);
        break;

      default:
        if (command.startsWith("sudo")) {
          addOutput([
            "aesthetic.sys > ACCESS DENIED",
            "Nice try. This incident will be reported to the vaporwave police.",
          ]);
        } else {
          addOutput([
            `'${command}' is not recognized as an internal or external command.`,
            "Type 'help' for a list of available commands.",
          ]);
        }
    }
  };

  // List directory contents
  const listDirectory = () => {
    let files = [];

    // Different directory listings based on current path
    if (currentDir === "C:\\Users\\Guest") {
      files = [
        " Directory of C:\\Users\\Guest",
        "",
        "05/28/2025  04:20 PM    <DIR>          Desktop",
        "05/28/2025  04:20 PM    <DIR>          Documents",
        "05/28/2025  04:20 PM    <DIR>          Downloads",
        "05/28/2025  04:20 PM                66 aesthetic.txt",
        "05/28/2025  04:20 PM             1,024 portfolio.exe",
        "",
        "              2 File(s)          1,090 bytes",
        "              3 Dir(s)   512,000,000 bytes free",
      ];
    } else if (currentDir === "C:\\Users\\Guest\\Desktop") {
      files = [
        " Directory of C:\\Users\\Guest\\Desktop",
        "",
        "05/28/2025  04:20 PM    <DIR>          ..",
        "05/28/2025  04:20 PM             2,048 project1.lnk",
        "05/28/2025  04:20 PM             2,048 project2.lnk",
        "05/28/2025  04:20 PM             2,048 project3.lnk",
        "",
        "              3 File(s)          6,144 bytes",
        "              1 Dir(s)   512,000,000 bytes free",
      ];
    } else {
      files = [
        ` Directory of ${currentDir}`,
        "",
        "05/28/2025  04:20 PM    <DIR>          ..",
        "05/28/2025  04:20 PM             1,024 readme.txt",
        "",
        "              1 File(s)          1,024 bytes",
        "              1 Dir(s)   512,000,000 bytes free",
      ];
    }

    addOutput(files);
  };

  // Change directory
  const changeDirectory = (dir) => {
    if (!dir) {
      addOutput([currentDir]);
      return;
    }

    if (dir === "..") {
      if (currentDir === "C:\\Users\\Guest") {
        addOutput(["Cannot navigate above root directory."]);
        return;
      }

      if (
        currentDir === "C:\\Users\\Guest\\Desktop" ||
        currentDir === "C:\\Users\\Guest\\Documents" ||
        currentDir === "C:\\Users\\Guest\\Downloads"
      ) {
        setCurrentDir("C:\\Users\\Guest");
        addOutput([`Changed to C:\\Users\\Guest`]);
        return;
      }
    }

    if (dir === "Desktop" && currentDir === "C:\\Users\\Guest") {
      setCurrentDir("C:\\Users\\Guest\\Desktop");
      addOutput([`Changed to C:\\Users\\Guest\\Desktop`]);
      return;
    }

    if (dir === "Documents" && currentDir === "C:\\Users\\Guest") {
      setCurrentDir("C:\\Users\\Guest\\Documents");
      addOutput([`Changed to C:\\Users\\Guest\\Documents`]);
      return;
    }

    if (dir === "Downloads" && currentDir === "C:\\Users\\Guest") {
      setCurrentDir("C:\\Users\\Guest\\Downloads");
      addOutput([`Changed to C:\\Users\\Guest\\Downloads`]);
      return;
    }

    addOutput([`The system cannot find the path specified: ${dir}`]);
  };

  // Start the AESTHETIC_PUZZLE game or other games
  const startGame = (type = "puzzle") => {
    if (type === "puzzle") {
      addOutput([
        "Starting ENIGMA_PUZZLE...",
        "----------------------------------------",
        "Welcome to ENIGMA_PUZZLE - a vaporwave Mastermind game",
        "Try to guess the sequence of symbols",
        "----------------------------------------",
      ]);
    }

    // Start game after a small delay
    setTimeout(() => {
      setInGameMode(true);
      setGameType(type);
    }, 1000);
  };

  // Start the Vaporwave Adventure game
  const startAdventure = () => {
    addOutput([
      "Starting VAPORNET ADVENTURE...",
      "----------------------------------------",
      "Welcome to ESCAPE FROM VAPORNET - a text adventure",
      "Navigate through the digital landscape to find your way out",
      "----------------------------------------",
    ]);

    // Start adventure after a small delay
    setTimeout(() => {
      setInGameMode(true);
      setGameType("adventure");
    }, 1000);
  };

  // Exit the game
  const exitGame = (wasSuccessful) => {
    const currentGameType = useTerminalStore.getState().gameType;
    setInGameMode(false);
    setGameType(null);

    if (currentGameType === "puzzle") {
      if (wasSuccessful) {
        addOutput([
          "----------------------------------------",
          "Congratulations! You've solved the puzzle!",
          "ENIGMA level: ＭＡＸＩＭＵＭ",
          "----------------------------------------",
        ]);
      } else {
        addOutput([
          "----------------------------------------",
          "Game over! Try again by typing 'enigma'",
          "----------------------------------------",
        ]);
      }
    } else if (currentGameType === "adventure") {
      addOutput([
        "----------------------------------------",
        "You have exited the VAPORNET ADVENTURE",
        "Type 'adventure' to play again",
        "----------------------------------------",
      ]);
    }

    // Focus input after exiting game
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  // Show current time in vaporwave format
  const showTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    addOutput([
      `Current time: ${hours}:${minutes}:${seconds}`,
      `Vaporwave time: ${toVaporwaveText(`${hours}:${minutes}:${seconds}`)}`,
    ]);
  };

  // Convert text to vaporwave style
  const vaporwaveText = (text) => {
    addOutput([toVaporwaveText(text)]);
  };

  // Helper function to convert text to vaporwave style
  const toVaporwaveText = (text) => {
    const normalChars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const vaporChars =
      "ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ０１２３４５６７８９";

    let result = "";
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const index = normalChars.indexOf(char);
      if (index !== -1) {
        result += vaporChars[index];
      } else {
        // For spaces and special characters, add double space for a e s t h e t i c spacing
        if (char === " ") {
          result += "  ";
        } else {
          result += char;
        }
      }
    }

    return result;
  };

  // Handle key press for command history navigation
  const handleKeyDown = (e) => {
    // Up arrow
    if (e.keyCode === 38) {
      e.preventDefault();
      navigateCommandHistory("up");
      setInput(getCurrentCommandFromHistory());
    }
    // Down arrow
    else if (e.keyCode === 40) {
      e.preventDefault();
      navigateCommandHistory("down");
      const command = getCurrentCommandFromHistory();
      setInput(command === undefined ? "" : command);
    }
  };

  return (
    <div className={styles.terminal} onClick={focusInput}>
      <div className={styles.terminalHeader}>
        <div className={styles.headerText}>VAPORWAVE OS TERMINAL</div>
        <div className={styles.statusIndicator}>ＡＥＳＴＨＥＴＩＣ</div>
      </div>

      {inGameMode ? (
        gameType === "puzzle" ? (
          <AestheticPuzzle onExit={exitGame} />
        ) : gameType === "adventure" ? (
          <VaporAdventure onExit={exitGame} />
        ) : null
      ) : (
        <>
          <div className={styles.terminalContent} ref={terminalRef}>
            {history.map((item, index) => (
              <div
                key={index}
                className={`${styles.terminalLine} ${styles[item.type]}`}
              >
                {item.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className={styles.inputForm}>
            <span className={styles.prompt}>{`${currentDir}>`}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className={styles.terminalInput}
              autoFocus
            />
          </form>
        </>
      )}

      {/* Scanlines effect if enabled */}
      {effectsEnabled?.scanlines && <Scanlines opacity={0.2} />}
    </div>
  );
};

export default Terminal;
