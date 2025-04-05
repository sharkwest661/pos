// src/components/apps/terminal/Terminal.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  useThemeStore,
  useDarkWebStore,
  useTerminalStore,
} from "../../../store";
import PasswordCracker from "./PasswordCracker";
import styles from "./Terminal.module.scss";

const Terminal = () => {
  // Selectively pick only the theme properties we need
  const themeConfig = useThemeStore((state) => state.themeConfig);
  const effectsEnabled = useThemeStore((state) => state.effectsEnabled);

  // Selectively get terminal state properties using separate selectors
  const history = useTerminalStore((state) => state.history);
  const currentDir = useTerminalStore((state) => state.currentDir);
  const crackingMode = useTerminalStore((state) => state.crackingMode);
  const targetSystem = useTerminalStore((state) => state.targetSystem);
  const targetPassword = useTerminalStore((state) => state.targetPassword);
  const maxAttempts = useTerminalStore((state) => state.maxAttempts);
  const passwordHint = useTerminalStore((state) => state.passwordHint);
  const crackedVendors = useTerminalStore((state) => state.crackedVendors);

  // Selectively get terminal actions
  const addToHistory = useTerminalStore((state) => state.addToHistory);
  const addOutput = useTerminalStore((state) => state.addOutput);
  const addCommandToHistory = useTerminalStore(
    (state) => state.addCommandToHistory
  );
  const clearTerminal = useTerminalStore((state) => state.clearTerminal);
  const setCurrentDir = useTerminalStore((state) => state.setCurrentDir);
  const navigateCommandHistory = useTerminalStore(
    (state) => state.navigateCommandHistory
  );
  const getCurrentCommandFromHistory = useTerminalStore(
    (state) => state.getCurrentCommandFromHistory
  );
  const setCrackingMode = useTerminalStore((state) => state.setCrackingMode);
  const setupPasswordCracking = useTerminalStore(
    (state) => state.setupPasswordCracking
  );
  const setVendorCracked = useTerminalStore((state) => state.setVendorCracked);
  const resetCrackingState = useTerminalStore(
    (state) => state.resetCrackingState
  );

  // Local component state for user input
  const [input, setInput] = useState("");

  // References
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom whenever history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input when terminal is clicked
  const focusInput = () => {
    if (inputRef.current && !crackingMode) {
      inputRef.current.focus();
    }
  };

  // Handle command submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add command to history via the store
    addCommandToHistory(input);

    // Process the command
    processCommand(input);

    // Clear input field
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
          "help        - Show this help message",
          "ls          - List files in current directory",
          "cd [dir]    - Change directory",
          "read [file] - Read file contents",
          "scan [url]  - Scan target for vulnerabilities",
          "crack [url] - Attempt to crack target password",
          "connect [url] - Connect to a system",
          "clear       - Clear the terminal",
          "exit        - Exit terminal",
        ]);
        break;

      case "clear":
        clearTerminal();
        break;

      case "ls":
        listFiles();
        break;

      case "cd":
        changeDirectory(args[1]);
        break;

      case "read":
        readFile(args[1]);
        break;

      case "scan":
        scanTarget(args[1]);
        break;

      case "crack":
        startCracking(args[1]);
        break;

      case "connect":
        connectToSystem(args[1]);
        break;

      case "exit":
        addOutput([
          "Exiting terminal is not permitted during active investigation.",
        ]);
        break;

      default:
        addOutput([
          `Command not found: ${command}. Type 'help' for available commands.`,
        ]);
    }
  };

  // List files in current directory
  const listFiles = () => {
    let files = [];

    if (currentDir === "/home/investigator") {
      files = [
        "documents/",
        "downloads/",
        "tools/",
        "notes.txt",
        "investigation.log",
      ];
    } else if (currentDir === "/home/investigator/documents") {
      files = [
        "case_files/",
        "evidence/",
        "vendors.txt",
        "shadowmarket_notes.txt",
      ];
    } else if (currentDir === "/home/investigator/tools") {
      files = ["crackers/", "scanners/", "forensic_tools/", "readme.txt"];
    } else {
      files = ["../", ".hidden/"];
    }

    addOutput([
      "Directory listing for " + currentDir,
      ...files.map((file) => `${file.endsWith("/") ? "dir" : "file"}  ${file}`),
    ]);
  };

  // Change directory
  const changeDirectory = (dir) => {
    if (!dir) {
      addOutput(["Usage: cd [directory]"]);
      return;
    }

    if (dir === "..") {
      const parts = currentDir.split("/");
      if (parts.length > 2) {
        parts.pop();
        const newDir = parts.join("/");
        setCurrentDir(newDir);
        addOutput([`Changed directory to ${newDir}`]);
      } else {
        addOutput(["Already at root directory"]);
      }
      return;
    }

    // Simulate directory navigation
    let newDir = dir.startsWith("/")
      ? dir
      : `${currentDir}/${dir.replace(/\/$/, "")}`;
    setCurrentDir(newDir);
    addOutput([`Changed directory to ${newDir}`]);
  };

  // Read file content
  const readFile = (file) => {
    if (!file) {
      addOutput(["Usage: read [filename]"]);
      return;
    }

    let content = [];

    // Simulate file content based on filename and current directory
    if (file === "notes.txt" && currentDir === "/home/investigator") {
      content = [
        "=== INVESTIGATION NOTES ===",
        "Possible Shadow Market vendor identities:",
        "- CobraSystems - Network security exploits",
        "- GhostDoc - Medical credentials",
        "- Prometheus_X - Industrial sabotage",
        "",
        "Need to check system access for each vendor.",
        "Product IDs found at crime scenes match listings.",
        "Possible passwords may relate to vendor descriptions or products.",
        "",
        "Informant mentioned Shadow Market can be accessed at shadow.market.onion",
        "Need to verify this address in the dark web browser.",
      ];
    } else if (file === "vendors.txt" && currentDir.includes("documents")) {
      content = [
        "=== VENDOR LIST ===",
        "vendor.id: CobraSystems",
        "access: cobra.shadowmarket.onion",
        "status: locked",
        "",
        "vendor.id: GhostDoc",
        "access: ghost.shadowmarket.onion",
        "status: locked",
        "",
        "vendor.id: Prometheus_X",
        "access: prometheus.shadowmarket.onion",
        "status: locked",
        "",
        "Note: Access requires special credentials. Check evidence for hints.",
      ];
    } else if (file === "readme.txt" && currentDir.includes("tools")) {
      content = [
        "=== HACKING TOOLS README ===",
        "To crack a system password:",
        "1. First run a scan on the target: scan [url]",
        "2. Then attempt to crack: crack [url]",
        "3. You will have limited attempts based on security level",
        "4. Each guess will provide feedback on correct symbols",
        "",
        "Password hints may be found in evidence or vendor descriptions.",
        "Good luck and stay undetected.",
      ];
    } else {
      content = ["File not found or permission denied."];
    }

    addOutput([`=== ${file} ===`, ...content]);
  };

  // Scan target for vulnerabilities
  const scanTarget = (target) => {
    if (!target) {
      addOutput(["Usage: scan [target_url]"]);
      return;
    }

    addOutput([
      `Scanning target: ${target}`,
      "Initializing port scan...",
      "Checking for vulnerabilities...",
      "Analyzing security protocols...",
    ]);

    // Simulate scan delay
    setTimeout(() => {
      let results = [];

      if (target.includes("cobra")) {
        results = [
          "SCAN COMPLETE:",
          "Target: cobra.shadowmarket.onion",
          "Security Level: HIGH",
          "Open Ports: 80, 443, 22",
          "Vulnerabilities: Password authentication only",
          "Username identified: CobraSystems",
          "Password required for access.",
          "Hint: Vendor specializes in network penetration and uses snake imagery",
          "Password attempts allowed: 5",
        ];
      } else if (target.includes("ghost")) {
        results = [
          "SCAN COMPLETE:",
          "Target: ghost.shadowmarket.onion",
          "Security Level: MEDIUM",
          "Open Ports: 80, 443",
          "Vulnerabilities: Weak password policy",
          "Username identified: GhostDoc",
          "Password required for access.",
          "Hint: Vendor deals in medical credentials and uses vintage symbols",
          "Password attempts allowed: 6",
        ];
      } else if (target.includes("prometheus")) {
        results = [
          "SCAN COMPLETE:",
          "Target: prometheus.shadowmarket.onion",
          "Security Level: LOW",
          "Open Ports: 80, 443, 8080",
          "Vulnerabilities: Limited login attempts",
          "Username identified: Prometheus_X",
          "Password required for access.",
          'Hint: Vendor quote - "bringing forbidden knowledge to mankind"',
          "Password attempts allowed: 7",
        ];
      } else {
        results = [
          "SCAN COMPLETE:",
          `Target: ${target}`,
          "Connection failed or invalid target.",
          "No vulnerabilities identified.",
        ];
      }

      addOutput(results);
    }, 2000);
  };

  // Start password cracking
  const startCracking = (target) => {
    if (!target) {
      addOutput(["Usage: crack [target_url]"]);
      return;
    }

    // Check if this vendor is already cracked
    const vendorId = target.includes("cobra")
      ? "cobra"
      : target.includes("ghost")
      ? "ghost"
      : target.includes("prometheus")
      ? "prometheus"
      : null;

    if (vendorId && crackedVendors[vendorId]) {
      addOutput([
        `System already cracked: ${target}`,
        `You have full access to this vendor's account.`,
        `Use 'connect ${target}' to access the system.`,
      ]);
      return;
    }

    let passwordSymbols = [];
    let attempts = 0;
    let difficulty = "medium";
    let hint = "";
    let vendorName = "";

    if (target.includes("cobra")) {
      // Use 6 symbols for CobraSystems (hard)
      passwordSymbols = ["Ω", "λ", "Ω", "φ", "β", "γ"]; // Example password: ΩλΩφβγ
      attempts = 5; // Fewer attempts for hard difficulty
      difficulty = "hard";
      hint =
        "Password contains repeating symbols. Related to network protocols.";
      vendorName = "CobraSystems";
    } else if (target.includes("ghost")) {
      // Use 5 symbols for GhostDoc (medium)
      passwordSymbols = ["π", "∑", "∆", "λ", "φ"]; // Example password: π∑∆λφ
      attempts = 6; // Medium attempts
      difficulty = "medium";
      hint = "Password related to medical symbols";
      vendorName = "GhostDoc";
    } else if (target.includes("prometheus")) {
      // Use 4 symbols for Prometheus_X (easy)
      passwordSymbols = ["Ω", "π", "∆", "λ"]; // Example password: Ωπ∆λ
      attempts = 7; // More attempts for easy difficulty
      difficulty = "easy";
      hint = "Related to Greek mythology";
      vendorName = "Prometheus_X";
    } else {
      addOutput([
        `Unknown target: ${target}`,
        `Run 'scan ${target}' first to identify vulnerabilities.`,
      ]);
      return;
    }

    // Set up cracking mode via the store
    setupPasswordCracking(target, passwordSymbols, attempts, hint);

    addOutput([
      `Initiating password cracker for: ${target}`,
      `Target identified: ${vendorName}`,
      `Security level: ${difficulty.toUpperCase()}`,
      `You have ${attempts} attempts before lockout.`,
      "Starting password cracking tool...",
    ]);
  };

  // Handle successful password crack
  const handleCrackSuccess = (password) => {
    addOutput([
      "ACCESS GRANTED",
      `Successfully cracked ${targetSystem}!`,
      "Accessing vendor data...",
      "-------------------------",
      `Vendor account unlocked: ${targetSystem}`,
      "-------------------------",
    ]);

    // Handle successful crack based on target
    let vendorId = null;

    if (targetSystem.includes("cobra")) {
      vendorId = "cobra";
      addOutput([
        "=== VENDOR PROFILE: CobraSystems ===",
        "Real name: Alex Karimov",
        "Products: Network penetration tools",
        "Customers: 247 verified transactions",
        "Last login: 3 days before disappearance",
        "Notes: Tools compromise user data security",
        "Evidence item: Circuit board with snake emblem found at scene",
        "=====================================",
      ]);
    } else if (targetSystem.includes("ghost")) {
      vendorId = "ghost";
      addOutput([
        "=== VENDOR PROFILE: GhostDoc ===",
        "Real name: Dr. Leyla Mahmudova",
        "Products: Medical credentials, prescription access",
        "Customers: 183 verified transactions",
        "Last login: Day of disappearance",
        "Notes: Sold fraudulent medical licenses",
        "Evidence item: Antique medical caduceus wrapped in gauze",
        "=====================================",
      ]);
    } else if (targetSystem.includes("prometheus")) {
      vendorId = "prometheus";
      addOutput([
        "=== VENDOR PROFILE: Prometheus_X ===",
        "Real name: Ibrahim Nasirov",
        "Products: Industrial sabotage software",
        "Customers: 92 verified high-value transactions",
        "Last login: 5 hours before disappearance",
        'Notes: Quote - "bringing forbidden knowledge to mankind"',
        "Evidence item: Small metal lighter with Greek lettering",
        "=====================================",
      ]);
    }

    // Mark vendor as cracked in our store
    if (vendorId) {
      // Update the terminal store
      setVendorCracked(vendorId);

      try {
        // Get the dark web store state management functions
        const authenticateAsVendor = useDarkWebStore(
          (state) => state.authenticateAsVendor
        );

        // Update the vendor's access status
        authenticateAsVendor(
          vendorId === "cobra"
            ? "CobraSystems"
            : vendorId === "ghost"
            ? "GhostDoc"
            : "Prometheus_X"
        );

        addOutput([
          `Vendor profile has been unlocked in the Shadow Market browser.`,
          "You can now access their complete vendor profile and transaction history.",
          "Use 'connect " + targetSystem + "' to access the account directly.",
        ]);
      } catch (error) {
        console.error("Error updating dark web store:", error);
      }
    }

    // Exit cracking mode
    setCrackingMode(false);
  };

  // Handle password crack failure
  const handleCrackFailure = () => {
    addOutput([
      "ACCESS DENIED",
      "Maximum attempts reached.",
      "System locked - further attempts will trigger security alert.",
      "Try finding more information about the target before retrying.",
    ]);

    // Exit cracking mode
    resetCrackingState();
  };

  // Exit the cracking minigame
  const handleExitCracking = () => {
    resetCrackingState();
    addOutput(["Password cracking aborted."]);
  };

  // Connect to system
  const connectToSystem = (system) => {
    if (!system) {
      addOutput(["Usage: connect [system_url]"]);
      return;
    }

    addOutput([
      `Attempting connection to ${system}...`,
      "Routing through anonymizer...",
      "Establishing secure connection...",
    ]);

    setTimeout(() => {
      let result = [];
      const vendorId = system.includes("cobra")
        ? "cobra"
        : system.includes("ghost")
        ? "ghost"
        : "prometheus";

      if (crackedVendors[vendorId]) {
        result = [
          "CONNECTION ESTABLISHED",
          `Successfully connected to ${system}`,
          "You now have access to this vendor account.",
          `Type 'ls' to see available files.`,
        ];
      } else {
        result = [
          "CONNECTION FAILED",
          "Authentication required.",
          `You need to successfully crack this system first.`,
          `Use 'crack ${system}' to attempt password cracking.`,
        ];
      }

      addOutput(result);
    }, 1500);
  };

  // Handle key press for command history navigation
  const handleKeyDown = (e) => {
    // Up arrow
    if (e.keyCode === 38) {
      e.preventDefault();
      navigateCommandHistory("up");
      const historyCommand = getCurrentCommandFromHistory();
      if (historyCommand) {
        setInput(historyCommand);
      }
    }
    // Down arrow
    else if (e.keyCode === 40) {
      e.preventDefault();
      navigateCommandHistory("down");
      const historyCommand = getCurrentCommandFromHistory();
      setInput(historyCommand || "");
    }
  };

  return (
    <div className={styles.terminal} onClick={focusInput}>
      <div className={styles.terminalHeader}>
        <div className={styles.headerText}>SHADOW OS TERMINAL</div>
        <div className={styles.statusIndicator}>SECURE</div>
      </div>

      {crackingMode ? (
        // Render password cracker minigame
        <PasswordCracker
          targetPassword={targetPassword}
          maxAttempts={maxAttempts}
          onSuccess={handleCrackSuccess}
          onFailure={handleCrackFailure}
          onExit={handleExitCracking}
          hint={passwordHint}
          difficulty={
            targetSystem.includes("cobra")
              ? "hard"
              : targetSystem.includes("ghost")
              ? "medium"
              : "easy"
          }
          vendorName={
            targetSystem.includes("cobra")
              ? "CobraSystems"
              : targetSystem.includes("ghost")
              ? "GhostDoc"
              : targetSystem.includes("prometheus")
              ? "Prometheus_X"
              : "Unknown"
          }
        />
      ) : (
        // Render normal terminal
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
    </div>
  );
};

export default Terminal;
