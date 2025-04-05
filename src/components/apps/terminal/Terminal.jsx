// components/apps/terminal/Terminal.jsx
import React, { useState, useEffect, useRef } from "react";
import { Scanlines } from "../../effects/Scanlines";
import { useThemeStore } from "../../../store";
import AestheticPuzzle from "./AestheticPuzzle";
import styles from "./Terminal.module.scss";

const Terminal = () => {
  // Get theme configuration
  const effectsEnabled = useThemeStore((state) => state.effectsEnabled);

  // Terminal state
  const [history, setHistory] = useState([
    { text: "ＶＡＰＯＲＷＡＶＥ  ＯＳ  [Version 1.0.0]", type: "system" },
    { text: "(c) 2025 Vaporwave Corp. All rights reserved.", type: "system" },
  ]);
  const [input, setInput] = useState("");
  const [currentDir, setCurrentDir] = useState("C:\\Users\\Guest");
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [inGameMode, setInGameMode] = useState(false);

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

  // Add a command to history
  const addCommandToHistory = (command) => {
    // Add command to display history
    const newLine = {
      text: `${currentDir}> ${command}`,
      type: "command",
    };

    setHistory((prevHistory) => [...prevHistory, newLine]);

    // Add to command history for up/down arrows
    setCommandHistory((prevHistory) => [...prevHistory, command]);
    setHistoryIndex(-1);
  };

  // Add output lines to history
  const addOutput = (lines) => {
    const newLines = lines.map((line) => ({ text: line, type: "output" }));
    setHistory((prevHistory) => [...prevHistory, ...newLines]);
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
          "  aesthetic   - Play AESTHETIC_PUZZLE game",
          "  time        - Display current time",
          "  vaporwave   - Convert text to vaporwave style",
          "  exit        - Exit terminal",
        ]);
        break;

      case "clear":
        setHistory([
          { text: "ＶＡＰＯＲＷＡＶＥ  ＯＳ  [Version 1.0.0]", type: "system" },
          {
            text: "(c) 2025 Vaporwave Corp. All rights reserved.",
            type: "system",
          },
        ]);
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

      case "aesthetic":
        startGame();
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
        addOutput([`Changed to ${currentDir}`]);
        return;
      }
    }

    if (dir === "Desktop" && currentDir === "C:\\Users\\Guest") {
      setCurrentDir("C:\\Users\\Guest\\Desktop");
      addOutput([`Changed to ${currentDir}\\Desktop`]);
      return;
    }

    if (dir === "Documents" && currentDir === "C:\\Users\\Guest") {
      setCurrentDir("C:\\Users\\Guest\\Documents");
      addOutput([`Changed to ${currentDir}\\Documents`]);
      return;
    }

    if (dir === "Downloads" && currentDir === "C:\\Users\\Guest") {
      setCurrentDir("C:\\Users\\Guest\\Downloads");
      addOutput([`Changed to ${currentDir}\\Downloads`]);
      return;
    }

    addOutput([`The system cannot find the path specified: ${dir}`]);
  };

  // Start the AESTHETIC_PUZZLE game
  const startGame = () => {
    addOutput([
      "Starting AESTHETIC_PUZZLE...",
      "----------------------------------------",
      "Welcome to AESTHETIC_PUZZLE - a vaporwave Mastermind game",
      "Try to guess the sequence of symbols",
      "----------------------------------------",
    ]);

    // Start game after a small delay
    setTimeout(() => {
      setInGameMode(true);
    }, 1000);
  };

  // Exit the game
  const exitGame = (wasSuccessful) => {
    setInGameMode(false);

    if (wasSuccessful) {
      addOutput([
        "----------------------------------------",
        "Congratulations! You've solved the puzzle!",
        "Aesthetic level: ＭＡＸＩＭＵＭ",
        "----------------------------------------",
      ]);
    } else {
      addOutput([
        "----------------------------------------",
        "Game over! Try again by typing 'aesthetic'",
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
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex < commandHistory.length - 1
            ? historyIndex + 1
            : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    }
    // Down arrow
    else if (e.keyCode === 40) {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <div className={styles.terminal} onClick={focusInput}>
      <div className={styles.terminalHeader}>
        <div className={styles.headerText}>VAPORWAVE OS TERMINAL</div>
        <div className={styles.statusIndicator}>ＡＥＳＴＨＥＴＩＣ</div>
      </div>

      {inGameMode ? (
        <AestheticPuzzle onExit={exitGame} />
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
