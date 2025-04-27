// components/apps/terminal/VaporAdventure.jsx
import React, { useState, useEffect, useRef } from "react";
import { Scanlines } from "../../effects/Scanlines";
import { useThemeStore } from "../../../store";
import styles from "./VaporAdventure.module.scss";

/**
 * VaporAdventure - A choose-your-own-adventure game with a vaporwave aesthetic
 * for the terminal application. The player navigates through a story about
 * escaping from a digital realm called VAPORNET before system shutdown.
 *
 * @param {function} onExit - Function to call when exiting the game
 */
const VaporAdventure = ({ onExit }) => {
  // Game state
  const [currentLocation, setCurrentLocation] = useState("start");
  const [gameState, setGameState] = useState({});
  const [textBuffer, setTextBuffer] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const contentRef = useRef(null);

  // Initialize game state
  useEffect(() => {
    initGameState();
  }, []);

  // Scroll to bottom when text buffer changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [textBuffer, showChoices]);

  // Initialize game state with default values
  const initGameState = () => {
    setGameState({
      // Inventory tracking
      inventory: {},

      // State flags for puzzle solutions and story progression
      has_mall_key: false,
      has_beach_key: false,
      has_downtown_key: false,
      doesnt_have_downtown_key: true, // For UI convenience
      knows_security: false,
      knows_palm_tree_panel: false,
      knows_beach_key_location: false,
      knows_downtown_access_code: false,
      has_staff_keycard: false,
      has_virtual_pet: false,
      has_system_album: false,
      has_all_keys: false,
    });

    // Start at the beginning location
    navigateToLocation("start");
  };

  // Navigate to a new location
  const navigateToLocation = (locationId) => {
    // Get the location data
    const location = GAME_DATA.locations[locationId];

    if (!location) {
      console.error(`Location not found: ${locationId}`);
      return;
    }

    // Reset typing state
    setIsTyping(true);
    setShowChoices(false);

    // Clear text buffer on new location
    setTextBuffer([]);

    // Add location name to buffer immediately
    setTextBuffer([`[${location.name}]`]);

    // Apply any state changes defined by this location
    if (location.stateChanges) {
      setGameState((prevState) => ({
        ...prevState,
        ...location.stateChanges,
        inventory: {
          ...prevState.inventory,
          ...(location.stateChanges.inventory || {}),
        },
      }));
    }

    // Determine description (function or string)
    let description = location.description;
    if (typeof description === "function") {
      description = description(gameState);
    }

    // Start typing effect for description
    startTypingEffect(description);

    // Set current location
    setCurrentLocation(locationId);
  };

  // Handle choice selection
  const handleChoice = (choice) => {
    // Check if the choice has a condition and if it's met
    if (choice.condition && !gameState[choice.condition]) {
      return; // Condition not met
    }

    // Check if the choice has a special action
    if (choice.action === "exit_to_terminal") {
      onExit(false); // Exit the game
      return;
    }

    // Navigate to the next location
    navigateToLocation(choice.nextLocation);
  };

  // Typing effect for text
  const startTypingEffect = (text) => {
    // Split text into paragraphs
    const paragraphs = text.split("\n\n");

    // Type each paragraph with a delay
    let delay = 0;
    const typingSpeed = 30; // ms per character
    const paragraphDelay = 500; // ms between paragraphs

    paragraphs.forEach((paragraph, index) => {
      setTimeout(() => {
        setTextBuffer((prev) => [...prev, paragraph]);

        // If this is the last paragraph, we can show choices after it
        if (index === paragraphs.length - 1) {
          setTimeout(() => {
            setIsTyping(false);
            setShowChoices(true);
          }, paragraph.length * 10); // Shorter delay for choices
        }
      }, delay);

      delay += paragraph.length * typingSpeed + paragraphDelay;
    });
  };

  // Get available choices for current location
  const getAvailableChoices = () => {
    const location = GAME_DATA.locations[currentLocation];

    if (!location || !location.choices) {
      return [];
    }

    // Filter choices based on conditions
    return location.choices.filter((choice) => {
      // If the choice has no condition, it's always available
      if (!choice.condition) {
        return true;
      }

      // If it has a condition, check if it's met
      return gameState[choice.condition];
    });
  };

  // Get current location image
  const getLocationImage = () => {
    const location = GAME_DATA.locations[currentLocation];
    return location ? location.image : "terminal";
  };

  // Render ASCII art for the current location
  const renderLocationArt = () => {
    const imageType = getLocationImage();

    // Simple ASCII art examples for a few locations
    const art = {
      terminal: `
  _____________________________
 /|                           |\\
| |     VAPORNET TERMINAL     | |
| |                           | |
| |  [LOGIN]        [ACCESS]  | |
| |                           | |
| |  Press any key to begin   | |
| |___________________________|_|
|/___________________________\\|`,

      plaza: `
       /\\      /\\      /\\
      /  \\    /  \\    /  \\
     /    \\  /    \\  /    \\
    /      \\/      \\/      \\
    
        C E N T R A L
        -  P L A Z A  -
    
    🗿       ☀️        🌴
      `,

      beach: `
     ~  ~   ~  ~  ~     ~ ~ ~   
    ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~  
   ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
      🌴   🌴  🌴    🌴   🌴`,

      mall: `
    ┌───────────────────┐
    │   VAPORWAVE MALL  │
    │   ╔═══════════╗   │
    │   ║           ║   │
    │   ║   SHOP    ║   │
    │   ║           ║   │
    │   ╚═══════════╝   │
    └───────────────────┘`,

      downtown: `
         ┌┐ ┌┐ ┌┐
         ││ ││ ││
       ┌─┘└─┘└─┘└─┐
       │  CITY    │
       │          │
    ┌──┴──────────┴──┐
    │   DOWNTOWN     │`,

      security_office: `
    ┌───────────────────┐
    │  SECURITY OFFICE  │
    │ ┌───┐ ┌───┐ ┌───┐ │
    │ │ ◯ │ │ ◯ │ │ ◯ │ │
    │ └───┘ └───┘ └───┘ │
    │                   │
    │ ┌─────────────┐   │
    │ │  ACCESS KEY │   │
    │ └─────────────┘   │
    └───────────────────┘`,

      exit: `
    
        ┌──────────────┐
        │   E X I T    │
        │              │
        │    ─────►    │
        │              │
        └──────────────┘
    `,
    };

    // Return the art for this location, or a default
    return (
      art[imageType] ||
      `
    
      VAPORWAVE ADVENTURE
    
     [ ${GAME_DATA.locations[currentLocation]?.name || "Unknown"} ]
    `
    );
  };

  // Get theme configuration
  const effectsEnabled = useThemeStore((state) => state.effectsEnabled);

  return (
    <div className={styles.adventureContainer}>
      <div className={styles.gameHeader}>
        <h2 className={styles.gameTitle}>ESCAPE FROM VAPORNET</h2>
        <div className={styles.subTitle}>A Vaporwave Text Adventure</div>
      </div>

      {/* ASCII art display */}
      <div className={styles.asciiArt}>
        <pre>{renderLocationArt()}</pre>
      </div>

      {/* Game content area */}
      <div className={styles.contentArea} ref={contentRef}>
        {textBuffer.map((text, index) => (
          <div
            key={index}
            className={`${styles.textParagraph} ${
              index === 0 ? styles.locationTitle : ""
            }`}
          >
            {text}
          </div>
        ))}

        {/* Choices */}
        {showChoices && (
          <div className={styles.choicesContainer}>
            {getAvailableChoices().map((choice, index) => (
              <button
                key={index}
                className={styles.choiceButton}
                onClick={() => handleChoice(choice)}
              >
                {choice.text}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Typing indicator */}
      {isTyping && (
        <div className={styles.typingIndicator}>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
        </div>
      )}

      {/* Scanlines effect if enabled */}
      {effectsEnabled?.scanlines && <Scanlines opacity={0.15} />}
    </div>
  );
};

// Game data - story, locations, and choices
const GAME_DATA = {
  // Game locations
  locations: {
    // Starting area
    start: {
      id: "start",
      name: "VAPORNET Login Terminal",
      description:
        "The neon glow of the terminal illuminates your digital form. Text flickers across the screen:\n\n" +
        "'WELCOME TO VAPORNET - DIGITAL PARADISE ESTABLISHED 1995'\n\n" +
        "Below that, a warning glitches in and out: 'SYSTEM TERMINATION IN 24 HOURS - ALL DATA WILL BE ERASED'",
      image: "terminal",
      choices: [
        {
          text: "Log in to the system",
          nextLocation: "central_plaza",
        },
        {
          text: "Examine your digital form",
          nextLocation: "examine_self",
        },
      ],
    },

    // Hub area
    central_plaza: {
      id: "central_plaza",
      name: "Central Plaza",
      description:
        "You stand in a vast digital plaza. The sky is a permanent sunset gradient of purple and pink. " +
        "Three massive archways surround the circular space, each pulsing with its own distinct neon color.\n\n" +
        "A glitched statue of a Greek bust wearing sunglasses stands in the center, occasionally flickering.",
      image: "plaza",
      choices: [
        {
          text: "Enter the pink archway (Abandoned Mall)",
          nextLocation: "mall_entrance",
        },
        {
          text: "Enter the blue archway (Endless Beach)",
          nextLocation: "beach_entrance",
        },
        {
          text: "Enter the green archway (Digital Downtown)",
          nextLocation: "downtown_entrance",
        },
        {
          text: "Approach the statue",
          nextLocation: "plaza_statue",
        },
      ],
    },

    // Examination branch
    examine_self: {
      id: "examine_self",
      name: "Digital Self",
      description:
        "Your form is a wireframe silhouette outlined in glowing cyan. " +
        "You notice a digital watch embedded in your wrist displaying '23:58:47' and counting down. " +
        "This must be how long until the system shutdown.\n\n" +
        "You also notice a small inventory pouch attached to your hip.",
      image: "digital_self",
      choices: [
        {
          text: "Check your inventory",
          nextLocation: "check_inventory",
        },
        {
          text: "Log in to the system",
          nextLocation: "central_plaza",
        },
      ],
    },

    check_inventory: {
      id: "check_inventory",
      name: "Inventory",
      description:
        "Your inventory pouch is mostly empty, but it contains a single item: " +
        "a small keycard labeled 'GUEST ACCESS'. It pulses with a faint white glow.",
      image: "inventory",
      choices: [
        {
          text: "Continue to the system",
          nextLocation: "central_plaza",
        },
      ],
    },

    // Central Plaza Statue
    plaza_statue: {
      id: "plaza_statue",
      name: "Greek Statue",
      description:
        "As you approach the statue, it stops glitching momentarily. The marble head turns toward you with a mechanical whirr.\n\n" +
        "'VISITOR DETECTED. I AM THE GUARDIAN OF VAPORNET. THIS SYSTEM WILL BE DECOMMISSIONED SOON.'\n\n" +
        "'TO ESCAPE, YOU MUST COLLECT THE THREE ACCESS KEYS HIDDEN IN EACH SECTOR. RETURN THEM TO THE EXIT PORTAL.'\n\n" +
        "The statue resumes its glitching, occasionally repeating fragments of its message.",
      image: "statue",
      choices: [
        {
          text: "Ask about the Access Keys",
          nextLocation: "ask_about_keys",
        },
        {
          text: "Ask about the Exit Portal",
          nextLocation: "ask_about_portal",
        },
        {
          text: "Return to the plaza",
          nextLocation: "central_plaza",
        },
      ],
    },

    ask_about_keys: {
      id: "ask_about_keys",
      name: "Ask About Keys",
      description:
        "The statue's voice crackles: 'THE ACCESS KEYS WERE DISTRIBUTED TO THE PRIMARY NODES FOR SAFEKEEPING. " +
        "ONE IN THE CONSUMPTION SECTOR, ONE IN THE RELAXATION SECTOR, AND ONE IN THE ADMINISTRATION SECTOR.'\n\n" +
        "'EACH IS GUARDED BY A CHALLENGE. THE KEYS TAKE DIFFERENT FORMS BUT ALL BEAR THE VAPORNET LOGO.'",
      image: "statue",
      choices: [
        {
          text: "Ask about the Exit Portal",
          nextLocation: "ask_about_portal",
        },
        {
          text: "Return to the plaza",
          nextLocation: "central_plaza",
        },
      ],
    },

    ask_about_portal: {
      id: "ask_about_portal",
      name: "Ask About Portal",
      description:
        "The statue freezes in a dramatic pose. 'THE EXIT PORTAL LIES BEYOND THE PLAZA. " +
        "IT WILL ONLY MATERIALIZE WHEN ALL THREE KEYS ARE BROUGHT TOGETHER.'\n\n" +
        "'BE WARNED, TRAVELER. VAPORNET HAS BEEN RUNNING UNATTENDED FOR YEARS. " +
        "SOME SECTORS ARE CORRUPTED AND DANGEROUS. BEWARE THE GLITCH ZONES.'",
      image: "statue",
      choices: [
        {
          text: "Ask about the Access Keys",
          nextLocation: "ask_about_keys",
        },
        {
          text: "Return to the plaza",
          nextLocation: "central_plaza",
        },
      ],
    },

    // Mall zone - first key
    mall_entrance: {
      id: "mall_entrance",
      name: "Abandoned Mall Entrance",
      description:
        "You step through the pink archway and find yourself at the entrance of a vast digital shopping mall. " +
        "Vaporwave muzak plays softly from unseen speakers. Neon store signs flicker, many displaying corrupted text.\n\n" +
        "A directory kiosk stands nearby, and three main paths lead deeper into the mall.",
      image: "mall",
      choices: [
        {
          text: "Check the directory kiosk",
          nextLocation: "mall_directory",
        },
        {
          text: "Head to the food court",
          nextLocation: "food_court",
        },
        {
          text: "Visit the electronics store",
          nextLocation: "electronics_store",
        },
        {
          text: "Explore the music shop",
          nextLocation: "music_shop",
        },
        {
          text: "Return to Central Plaza",
          nextLocation: "central_plaza",
        },
      ],
    },

    mall_directory: {
      id: "mall_directory",
      name: "Mall Directory",
      description:
        "The directory flickers to life as you approach. Most listings are corrupted, but you can make out a few:\n\n" +
        "'FOODSOFT - LEVEL 1 - SECTOR 5'\n" +
        "'ELECTRONICA - LEVEL 1 - SECTOR 8'\n" +
        "'DISCOTHEQUE - LEVEL 1 - SECTOR 12'\n\n" +
        "A small note at the bottom reads: 'SECURITY ROOM - STAFF ONLY - LEVEL B1'",
      image: "directory",
      choices: [
        {
          text: "Head to the food court",
          nextLocation: "food_court",
        },
        {
          text: "Visit the electronics store",
          nextLocation: "electronics_store",
        },
        {
          text: "Explore the music shop",
          nextLocation: "music_shop",
        },
        {
          text: "Look for the security room",
          nextLocation: "find_security",
          condition: "knows_security",
        },
        {
          text: "Return to mall entrance",
          nextLocation: "mall_entrance",
        },
      ],
      stateChanges: {
        knows_security: true,
      },
    },

    food_court: {
      id: "food_court",
      name: "Food Court",
      description:
        "The food court is a bizarre space of empty tables and abandoned food stalls. " +
        "Neon signs advertise digital foods that never existed in reality.\n\n" +
        "A solitary AI vendor stands behind the 'PIZZA.EXE' counter, repeatedly going through the motions of making a pizza that never materializes.",
      image: "food_court",
      choices: [
        {
          text: "Talk to the pizza vendor",
          nextLocation: "pizza_vendor",
        },
        {
          text: "Return to mall entrance",
          nextLocation: "mall_entrance",
        },
      ],
    },

    pizza_vendor: {
      id: "pizza_vendor",
      name: "Pizza.exe Vendor",
      description:
        "The vendor AI glitches as you approach, then resets into a customer service posture.\n\n" +
        "'WELCOME TO PIZZA.EXE, WHERE DIGITAL TASTE MEETS VIRTUAL SATISFACTION. WHAT WOULD YOU LIKE TO ORDER?'\n\n" +
        "Despite the apocalyptic state of the mall, the vendor seems unaware that anything is wrong.",
      image: "vendor",
      choices: [
        {
          text: "Ask about the Access Key",
          nextLocation: "vendor_key_info",
        },
        {
          text: "Order a 'pizza'",
          nextLocation: "order_pizza",
        },
        {
          text: "Return to the food court",
          nextLocation: "food_court",
        },
      ],
    },

    vendor_key_info: {
      id: "vendor_key_info",
      name: "Key Information",
      description:
        "The vendor's expression glitches between smiles. 'ACCESS KEY? OH, YOU MUST MEAN THE MANAGER'S KEY.'\n\n" +
        "'SECURITY CONFISCATED IT LAST WEEK WHEN THE SYSTEM STARTED BREAKING DOWN. CHECK THE SECURITY OFFICE IN THE BASEMENT.'\n\n" +
        "The vendor returns to making nonexistent pizza as if nothing happened.",
      image: "vendor",
      choices: [
        {
          text: "Order a 'pizza'",
          nextLocation: "order_pizza",
        },
        {
          text: "Return to the food court",
          nextLocation: "food_court",
        },
      ],
    },

    order_pizza: {
      id: "order_pizza",
      name: "Digital Pizza",
      description:
        "You play along and order a pizza. The vendor goes through an elaborate pantomime of preparation.\n\n" +
        "'THAT WILL BE 45 DIGITAL CREDITS. SINCE THE CURRENCY SYSTEM IS DOWN, I'LL ADD IT TO YOUR TAB.'\n\n" +
        "The vendor hands you... nothing. But your inventory notification pings anyway.",
      image: "pizza",
      choices: [
        {
          text: "Thank the vendor and leave",
          nextLocation: "food_court",
        },
      ],
      stateChanges: {
        inventory: {
          digital_pizza: {
            name: "Digital Pizza",
            description: "It doesn't exist, but it's the thought that counts.",
          },
        },
      },
    },

    electronics_store: {
      id: "electronics_store",
      name: "Electronica",
      description:
        "The electronics store is filled with outdated technology from the 1990s, all rendered in perfect digital detail. " +
        "Chunky CRT monitors display spinning logos, and digital cameras with ridiculously low pixel counts sit in display cases.\n\n" +
        "The store seems empty of entities, but a service bell sits on the counter.",
      image: "electronics",
      choices: [
        {
          text: "Ring the service bell",
          nextLocation: "ring_bell",
        },
        {
          text: "Examine the display cases",
          nextLocation: "examine_displays",
        },
        {
          text: "Check behind the counter",
          nextLocation: "behind_counter",
        },
        {
          text: "Return to mall entrance",
          nextLocation: "mall_entrance",
        },
      ],
    },

    ring_bell: {
      id: "ring_bell",
      name: "Service Bell",
      description:
        "You tap the bell, which makes a satisfying 'ding'. After a moment, a wireframe figure materializes behind the counter.\n\n" +
        "'WELCOME TO ELECTRONICA, WHERE YESTERDAY'S TECHNOLOGY IS TOMORROW'S VINTAGE. HOW MAY I HELP YOU?'\n\n" +
        "The clerk's voice has that distinct digital distortion of early speech synthesis.",
      image: "clerk",
      choices: [
        {
          text: "Ask about the Access Key",
          nextLocation: "clerk_key_info",
        },
        {
          text: "Ask about security room",
          nextLocation: "clerk_security_info",
          condition: "knows_security",
        },
        {
          text: "Browse products",
          nextLocation: "browse_electronics",
        },
        {
          text: "Leave the counter",
          nextLocation: "electronics_store",
        },
      ],
    },

    clerk_key_info: {
      id: "clerk_key_info",
      name: "Key Information",
      description:
        "The clerk freezes momentarily. 'ACCESS KEY? WE DON'T SELL THOSE.'\n\n" +
        "They lean forward conspiratorially. 'BUT BETWEEN US, I SAW THE SECURITY TEAM TAKE A BUNCH OF IMPORTANT ITEMS TO THEIR OFFICE WHEN THINGS STARTED BREAKING DOWN. CHECK THE BASEMENT LEVEL.'",
      image: "clerk",
      choices: [
        {
          text: "Ask about security room",
          nextLocation: "clerk_security_info",
          condition: "knows_security",
        },
        {
          text: "Browse products",
          nextLocation: "browse_electronics",
        },
        {
          text: "Leave the counter",
          nextLocation: "electronics_store",
        },
      ],
    },

    clerk_security_info: {
      id: "clerk_security_info",
      name: "Security Information",
      description:
        "'THE SECURITY OFFICE? TAKE THE SERVICE ELEVATOR NEAR THE RESTROOMS. YOU'LL NEED A STAFF KEYCARD THOUGH.'\n\n" +
        "The clerk looks around nervously. 'ACTUALLY, I HAVE A SPARE YOU CAN BORROW. THE SECURITY TEAM HASN'T BEEN ACTIVE IN YEARS.'",
      image: "clerk",
      choices: [
        {
          text: "Accept the keycard",
          nextLocation: "get_keycard",
        },
        {
          text: "Decline politely",
          nextLocation: "electronics_store",
        },
      ],
    },

    get_keycard: {
      id: "get_keycard",
      name: "Staff Keycard",
      description:
        "The clerk hands you a staff keycard with a faded photo that doesn't look like anyone in particular.\n\n" +
        "'DON'T MENTION WHERE YOU GOT THIS. TECHNICALLY IT'S AGAINST MALL POLICY TO DUPLICATE THESE, BUT SINCE THE MALL IS ABOUT TO BE DELETED ANYWAY...'",
      image: "keycard",
      choices: [
        {
          text: "Thank the clerk and leave",
          nextLocation: "electronics_store",
        },
      ],
      stateChanges: {
        inventory: {
          staff_keycard: {
            name: "Staff Keycard",
            description: "Grants access to staff areas of the mall.",
          },
        },
        has_staff_keycard: true,
      },
    },

    examine_displays: {
      id: "examine_displays",
      name: "Display Cases",
      description:
        "The display cases contain an impressive array of vintage electronics, all rendered in loving detail:\n\n" +
        "- Bulky cell phones with tiny monochrome screens\n" +
        "- Portable CD players with anti-skip protection\n" +
        "- Early 'multimedia' PCs with massive CRT monitors\n" +
        "- Digital pets and handheld gaming devices\n\n" +
        "One case has been broken into, with shattered digital glass on the floor.",
      image: "displays",
      choices: [
        {
          text: "Examine the broken case",
          nextLocation: "broken_case",
        },
        {
          text: "Return to store front",
          nextLocation: "electronics_store",
        },
      ],
    },

    broken_case: {
      id: "broken_case",
      name: "Broken Display Case",
      description:
        "The broken case once held vintage handheld devices. Most are gone, but one remains - a bulky device with a green-tinted screen.\n\n" +
        "It appears to be a prototype 'Virtual Pet' device that was never released. The screen shows a pixelated creature that seems to watch your movements.",
      image: "virtual_pet",
      choices: [
        {
          text: "Take the virtual pet device",
          nextLocation: "take_device",
        },
        {
          text: "Leave it alone",
          nextLocation: "electronics_store",
        },
      ],
    },

    take_device: {
      id: "take_device",
      name: "Virtual Pet",
      description:
        "You take the virtual pet device. As you pick it up, the pixelated creature on the screen jumps excitedly.\n\n" +
        "A notification appears: 'V-PET PROTOTYPE ADDED TO INVENTORY'\n\n" +
        "The virtual pet makes a happy beeping sound.",
      image: "virtual_pet_inventory",
      choices: [
        {
          text: "Return to store front",
          nextLocation: "electronics_store",
        },
      ],
      stateChanges: {
        inventory: {
          virtual_pet: {
            name: "V-Pet Prototype",
            description: "A virtual pet device with unusual capabilities.",
          },
        },
        has_virtual_pet: true,
      },
    },

    behind_counter: {
      id: "behind_counter",
      name: "Behind the Counter",
      description:
        "You slip behind the counter. There's a cash register (empty), some product catalogs, and a staff bulletin board.\n\n" +
        "The bulletin board has a notice: 'REMINDER: ALL STAFF MUST SURRENDER KEYCARDS TO SECURITY BEFORE FINAL SYSTEM SHUTDOWN'",
      image: "counter",
      choices: [
        {
          text: "Check the staff area door",
          nextLocation: "staff_door",
        },
        {
          text: "Return to store front",
          nextLocation: "electronics_store",
        },
      ],
    },

    staff_door: {
      id: "staff_door",
      name: "Staff Door",
      description:
        "A door marked 'STAFF ONLY' is behind the counter. It has a keycard reader next to it.\n\n" +
        "Through a small window in the door, you can see what looks like a small break room with a service elevator.",
      image: "staff_door",
      choices: [
        {
          text: "Use staff keycard",
          nextLocation: "use_staff_keycard",
          condition: "has_staff_keycard",
        },
        {
          text: "Return to store front",
          nextLocation: "electronics_store",
        },
      ],
    },

    use_staff_keycard: {
      id: "use_staff_keycard",
      name: "Access Granted",
      description:
        "You swipe the staff keycard and the door unlocks with a satisfying click.\n\n" +
        "Inside is a small break room with a couch, a table, and a service elevator. A sign on the elevator reads 'BASEMENT - SECURITY OFFICE'.",
      image: "break_room",
      choices: [
        {
          text: "Take the service elevator",
          nextLocation: "security_elevator",
        },
        {
          text: "Return to store front",
          nextLocation: "electronics_store",
        },
      ],
    },

    security_elevator: {
      id: "security_elevator",
      name: "Service Elevator",
      description:
        "The service elevator is a simple metal box. You press the 'B1' button and it begins to descend with a mechanical hum.\n\n" +
        "Digital floor numbers tick by on a display above the door: 1... M... B1.\n\n" +
        "The doors open to reveal a dimly lit corridor with 'SECURITY' illuminated in red at the far end.",
      image: "elevator",
      choices: [
        {
          text: "Proceed to security office",
          nextLocation: "security_corridor",
        },
        {
          text: "Return to the mall level",
          nextLocation: "electronics_store",
        },
      ],
    },

    security_corridor: {
      id: "security_corridor",
      name: "Security Corridor",
      description:
        "The corridor to the security office flickers with unstable lighting. Occasional bursts of static disrupt the air around you.\n\n" +
        "A sign warns: 'CAUTION: SYSTEM INSTABILITY DETECTED. DATA CORRUPTION POSSIBLE.'\n\n" +
        "The security office door at the end is partially open, spilling harsh light into the corridor.",
      image: "corridor",
      choices: [
        {
          text: "Enter the security office",
          nextLocation: "security_office",
        },
        {
          text: "Return to the elevator",
          nextLocation: "security_elevator",
        },
      ],
    },

    security_office: {
      id: "security_office",
      name: "Security Office",
      description:
        "The security office is filled with monitors showing different areas of the mall, most displaying static or corrupted images.\n\n" +
        "A large desk dominates the center with a chair that slowly spins by itself. On the desk is a sleek black box with the VAPORNET logo.\n\n" +
        "This must be one of the Access Keys you need!",
      image: "security_office",
      choices: [
        {
          text: "Take the Access Key",
          nextLocation: "take_mall_key",
        },
        {
          text: "Check the security monitors",
          nextLocation: "check_monitors",
        },
        {
          text: "Leave the office",
          nextLocation: "security_corridor",
        },
      ],
    },

    check_monitors: {
      id: "check_monitors",
      name: "Security Monitors",
      description:
        "Most monitors show static, but a few still display recognizable locations:\n\n" +
        "- The Central Plaza with its three archways\n" +
        "- The beach area with unusually colored waves\n" +
        "- The downtown district with its neon skyline\n\n" +
        "One monitor shows a room you haven't seen before - a chamber with a swirling portal that must be the exit!",
      image: "monitors",
      choices: [
        {
          text: "Take the Access Key",
          nextLocation: "take_mall_key",
        },
        {
          text: "Leave the office",
          nextLocation: "security_corridor",
        },
      ],
    },

    take_mall_key: {
      id: "take_mall_key",
      name: "Mall Access Key",
      description:
        "You pick up the black box. It's surprisingly heavy and seems to pulse with digital energy.\n\n" +
        "A notification appears: 'MALL ACCESS KEY ACQUIRED (1/3)'\n\n" +
        "The moment you take it, the security office lights flicker dramatically and a computerized voice announces: 'WARNING: UNAUTHORIZED KEY REMOVAL DETECTED. INITIATING SECURITY RESPONSE.'",
      image: "mall_key",
      choices: [
        {
          text: "Quickly leave the office",
          nextLocation: "escape_security",
        },
      ],
      stateChanges: {
        inventory: {
          mall_key: {
            name: "Mall Access Key",
            description:
              "The first of three keys needed to access the exit portal.",
          },
        },
        has_mall_key: true,
      },
    },

    escape_security: {
      id: "escape_security",
      name: "Security Escape",
      description:
        "You rush back to the corridor as security drones materialize behind you. They're slow but persistent.\n\n" +
        "You make it to the elevator and hammer the button. The doors close just as the drones reach you, their digital appendages grasping at the air.\n\n" +
        "The elevator returns you to the mall level. It seems you've escaped... for now.",
      image: "escape",
      choices: [
        {
          text: "Return to Central Plaza",
          nextLocation: "central_plaza",
        },
        {
          text: "Explore more of the mall",
          nextLocation: "mall_entrance",
        },
      ],
    },

    // Music shop
    music_shop: {
      id: "music_shop",
      name: "Discotheque",
      description:
        "The music shop is a neon-soaked paradise of vintage albums and digital audio equipment. " +
        "Floating holograms of album covers rotate slowly throughout the store, all featuring vaporwave aesthetics.\n\n" +
        "Soft synthwave music plays from unseen speakers, occasionally skipping like a damaged CD.",
      image: "music_shop",
      choices: [
        {
          text: "Browse the albums",
          nextLocation: "browse_albums",
        },
        {
          text: "Check the listening booth",
          nextLocation: "listening_booth",
        },
        {
          text: "Return to mall entrance",
          nextLocation: "mall_entrance",
        },
      ],
    },

    browse_albums: {
      id: "browse_albums",
      name: "Album Collection",
      description:
        "The collection features albums that never existed in reality - digital dreams of a retrofuturistic past:\n\n" +
        "- '夢の海岸' by Virtual Horizon\n" +
        "- 'Midnight Protocols' by System Override\n" +
        "- 'Digital Sunset Memories' by The Grid Runners\n" +
        "- 'Aesthetic Renaissance' by VAPORNET Systems\n\n" +
        "This last album catches your eye - it bears the same logo as the system you're trapped in.",
      image: "albums",
      choices: [
        {
          text: "Examine 'Aesthetic Renaissance'",
          nextLocation: "special_album",
        },
        {
          text: "Return to the music shop",
          nextLocation: "music_shop",
        },
      ],
    },

    special_album: {
      id: "special_album",
      name: "'Aesthetic Renaissance'",
      description:
        "This album appears to be an official VAPORNET product. The cover shows a 3D landscape with a setting sun and grid lines extending to the horizon.\n\n" +
        "The track listing includes songs like 'System Boot Sequence' and 'Data Purge Protocol.'\n\n" +
        "It seems more like a system manual disguised as music than an actual album.",
      image: "special_album",
      choices: [
        {
          text: "Take the album",
          nextLocation: "take_album",
        },
        {
          text: "Return to browsing",
          nextLocation: "browse_albums",
        },
      ],
    },

    take_album: {
      id: "take_album",
      name: "System Album",
      description:
        "You take the album, which feels unusually solid for a digital object.\n\n" +
        "A notification appears: 'VAPORNET SYSTEM GUIDE ACQUIRED'\n\n" +
        "This might contain valuable information about how the system works and possibly clues about the other Access Keys.",
      image: "album_inventory",
      choices: [
        {
          text: "Check the listening booth",
          nextLocation: "listening_booth",
        },
        {
          text: "Return to the music shop",
          nextLocation: "music_shop",
        },
      ],
      stateChanges: {
        inventory: {
          system_album: {
            name: "VAPORNET System Guide",
            description: "A system manual disguised as a music album.",
          },
        },
        has_system_album: true,
      },
    },

    listening_booth: {
      id: "listening_booth",
      name: "Listening Booth",
      description:
        "The listening booth is a small, soundproof room with a high-quality audio system. " +
        "There's a slot for inserting albums and a comfortable chair that adjusts to your digital form.\n\n" +
        "A sign reads: 'INSERT ALBUM TO BEGIN AUDIO EXPERIENCE'",
      image: "listening_booth",
      choices: [
        {
          text: "Insert the VAPORNET System Guide",
          nextLocation: "listen_album",
          condition: "has_system_album",
        },
        {
          text: "Return to the music shop",
          nextLocation: "music_shop",
        },
      ],
    },

    listen_album: {
      id: "listen_album",
      name: "System Revelation",
      description:
        "You insert the album and the booth comes to life. Instead of music, a voice begins speaking:\n\n" +
        "'WELCOME, SYSTEM ADMINISTRATOR. THIS IS THE VAPORNET EMERGENCY PROTOCOL GUIDE. IN CASE OF SYSTEM FAILURE OR SHUTDOWN:'\n\n" +
        "'1. COLLECT ALL THREE ACCESS KEYS FROM PRIMARY NODES'\n" +
        "'2. KEYS ARE LOCATED IN: CONSUMPTION SECTOR, RELAXATION SECTOR, ADMINISTRATIVE SECTOR'\n" +
        "'3. BRING KEYS TO CENTRAL HUB TO ACTIVATE EMERGENCY EXIT PROTOCOL'",
      image: "revelation",
      choices: [
        {
          text: "Continue listening",
          nextLocation: "listen_more",
        },
      ],
    },

    listen_more: {
      id: "listen_more",
      name: "Further Instructions",
      description:
        "The voice continues: 'NOTE: THE BEACH SECTOR KEY IS HIDDEN BENEATH THE LARGEST PALM TREE.'\n\n" +
        "'THE DOWNTOWN SECTOR KEY IS STORED IN THE MAINFRAME ROOM, ACCESS CODE: 4-5-8-2-3-6.'\n\n" +
        "'ALL KEYS MUST BE ACTIVATED TOGETHER AT THE CENTRAL PORTAL. GOOD LUCK, ADMINISTRATOR.'",
      image: "revelation2",
      choices: [
        {
          text: "Exit the listening booth",
          nextLocation: "music_shop",
        },
      ],
      stateChanges: {
        knows_beach_key_location: true,
        knows_downtown_access_code: true,
      },
    },

    // Beach zone - second key
    beach_entrance: {
      id: "beach_entrance",
      name: "Endless Beach Entrance",
      description:
        "You step through the blue archway and find yourself on a strange digital beach. " +
        "The sand is perfectly rendered in subtle pink hues, and the ocean stretches to infinity with waves that move in mathematically perfect patterns.\n\n" +
        "Palm trees dot the shoreline, and a beach bar stands nearby. The perpetual sunset casts everything in a dream-like glow.",
      image: "beach",
      choices: [
        {
          text: "Walk along the shoreline",
          nextLocation: "shoreline",
        },
        {
          text: "Visit the beach bar",
          nextLocation: "beach_bar",
        },
        {
          text: "Examine the palm trees",
          nextLocation: "palm_trees",
        },
        {
          text: "Return to Central Plaza",
          nextLocation: "central_plaza",
        },
      ],
    },

    shoreline: {
      id: "shoreline",
      name: "Digital Shoreline",
      description:
        "The shoreline stretches in both directions, seemingly infinite. The waves gently lap at the pink sand, " +
        "occasionally glitching with bursts of cyan pixels.\n\n" +
        "Small digital creatures that resemble a cross between fish and computer mice jump out of the water occasionally.\n\n" +
        "In the distance, you see a larger palm tree that stands out from the others.",
      image: "shoreline",
      choices: [
        {
          text: "Wade into the water",
          nextLocation: "enter_water",
        },
        {
          text: "Head toward the large palm tree",
          nextLocation: "large_palm_tree",
        },
        {
          text: "Return to the beach entrance",
          nextLocation: "beach_entrance",
        },
      ],
    },

    enter_water: {
      id: "enter_water",
      name: "Digital Ocean",
      description:
        "You wade into the water, which feels surprisingly realistic despite being digital. " +
        "The waves wash over your form, causing slight visual distortions.\n\n" +
        "The digital fish-mice creatures swim curiously around you, their glowing eyes examining your form.\n\n" +
        "Further out, you notice an unusual formation - what looks like a submerged structure.",
      image: "ocean",
      choices: [
        {
          text: "Swim to the structure",
          nextLocation: "ocean_structure",
        },
        {
          text: "Return to shore",
          nextLocation: "shoreline",
        },
      ],
    },

    ocean_structure: {
      id: "ocean_structure",
      name: "Submerged Server",
      description:
        "The 'structure' is actually a massive server rack, partially buried in the digital seabed. " +
        "Cables extend from it like tentacles, pulsing with data.\n\n" +
        "A small control panel on the server still functions, displaying the message: 'RELAXATION SECTOR BACKUP STORAGE.'\n\n" +
        "It seems this is part of the beach zone's infrastructure.",
      image: "server",
      choices: [
        {
          text: "Access the control panel",
          nextLocation: "server_panel",
        },
        {
          text: "Return to shore",
          nextLocation: "shoreline",
        },
      ],
    },

    server_panel: {
      id: "server_panel",
      name: "Server Control Panel",
      description:
        "The control panel shows system diagnostics for the beach zone:\n\n" +
        "'RELAXATION PROTOCOLS: FUNCTIONAL'\n" +
        "'WAVE PATTERNS: OPTIMAL'\n" +
        "'AMBIENT SOUND: OPERATIONAL'\n" +
        "'EMERGENCY STORAGE: LOCKED'\n\n" +
        "There's an option to 'View System Map'",
      image: "panel",
      choices: [
        {
          text: "View system map",
          nextLocation: "beach_map",
        },
        {
          text: "Try to access emergency storage",
          nextLocation: "emergency_storage",
        },
        {
          text: "Return to shore",
          nextLocation: "shoreline",
        },
      ],
    },

    beach_map: {
      id: "beach_map",
      name: "Beach System Map",
      description:
        "The map shows the layout of the beach zone. Most of it is procedurally generated endless shoreline, but a few points are marked:\n\n" +
        "- 'BEACH BAR - REFRESHMENT NODE'\n" +
        "- 'MAIN SERVER (UNDERWATER) - YOU ARE HERE'\n" +
        "- 'PALM TREE ALPHA - PRIMARY STORAGE'\n\n" +
        "Palm Tree Alpha is marked as the largest tree on the beach, confirming what you learned from the system guide.",
      image: "map",
      choices: [
        {
          text: "Return to the control panel",
          nextLocation: "server_panel",
        },
      ],
    },

    emergency_storage: {
      id: "emergency_storage",
      name: "Emergency Storage",
      description:
        "You attempt to access the emergency storage, but a message appears:\n\n" +
        "'ACCESS DENIED. ADMINISTRATOR PRIVILEGES REQUIRED.'\n\n" +
        "It seems you don't have the necessary permissions to access this feature directly. You'll need to find another way to get the Beach Access Key.",
      image: "denied",
      choices: [
        {
          text: "Return to the control panel",
          nextLocation: "server_panel",
        },
        {
          text: "Return to shore",
          nextLocation: "shoreline",
        },
      ],
    },

    beach_bar: {
      id: "beach_bar",
      name: "Refreshment Node",
      description:
        "The beach bar is a charming thatched-roof structure with neon accents. Behind the counter, a bartender AI diligently polishes a glass that never gets dirty.\n\n" +
        "Menu options hover in the air, offering 'DIGITAL REFRESHMENTS' and 'SYNTHETIC COCKTAILS' that provide no actual sustenance but simulate the experience perfectly.",
      image: "bar",
      choices: [
        {
          text: "Talk to the bartender",
          nextLocation: "bartender",
        },
        {
          text: "Order a drink",
          nextLocation: "order_drink",
        },
        {
          text: "Return to beach entrance",
          nextLocation: "beach_entrance",
        },
      ],
    },

    bartender: {
      id: "bartender",
      name: "Beach Bartender",
      description:
        "The bartender's face refreshes into a smile as you approach. 'WELCOME TO THE REFRESHMENT NODE, TRAVELER. WHAT CAN I DO FOR YOU TODAY?'\n\n" +
        "Despite the impending system shutdown, the bartender seems content to continue their duties indefinitely.",
      image: "bartender",
      choices: [
        {
          text: "Ask about the Access Key",
          nextLocation: "bartender_key_info",
        },
        {
          text: "Ask about the large palm tree",
          nextLocation: "bartender_tree_info",
        },
        {
          text: "Order a drink",
          nextLocation: "order_drink",
        },
        {
          text: "Leave the bar",
          nextLocation: "beach_bar",
        },
      ],
    },

    bartender_key_info: {
      id: "bartender_key_info",
      name: "Key Information",
      description:
        "The bartender's voice drops to a low hum. 'THE ACCESS KEY? THAT'S ADMINISTRATOR BUSINESS.'\n\n" +
        "They glance around conspiratorially. 'BUT I'VE WORKED HERE SINCE THIS SECTOR WAS CODED. THE KEYS ARE ALWAYS HIDDEN IN LANDMARK LOCATIONS. FOR THIS SECTOR... WELL, WHAT'S THE MOST NOTABLE LANDMARK ON A BEACH?'",
      image: "bartender",
      choices: [
        {
          text: "Ask about the large palm tree",
          nextLocation: "bartender_tree_info",
        },
        {
          text: "Order a drink",
          nextLocation: "order_drink",
        },
        {
          text: "Leave the bar",
          nextLocation: "beach_bar",
        },
      ],
    },

    bartender_tree_info: {
      id: "bartender_tree_info",
      name: "Palm Tree Information",
      description:
        "'AH, THE ALPHA TREE! IT WAS THE FIRST OBJECT CODED FOR THIS SECTOR. ALL OTHER PALMS ARE JUST COPIES WITH RANDOM VARIATIONS.'\n\n" +
        "The bartender leans in. 'THERE'S A MAINTENANCE ACCESS PANEL AT ITS BASE. MOST VISITORS DON'T NOTICE IT, BUT IT'S THERE. THE SYSTEM ADMINISTRATORS USED IT TO STORE IMPORTANT DATA... AND ITEMS.'",
      image: "bartender",
      choices: [
        {
          text: "Order a drink",
          nextLocation: "order_drink",
        },
        {
          text: "Thank the bartender and leave",
          nextLocation: "beach_bar",
        },
      ],
      stateChanges: {
        knows_palm_tree_panel: true,
      },
    },

    order_drink: {
      id: "order_drink",
      name: "Synthetic Cocktail",
      description:
        "You order a drink called 'BINARY SUNSET.' The bartender executes a complex routine of mixing digital ingredients, resulting in a glowing orange and pink concoction.\n\n" +
        "'ON THE HOUSE,' they say, sliding it toward you. 'MIGHT BE THE LAST ONE I EVER MAKE BEFORE THE SYSTEM GOES DOWN.'\n\n" +
        "The drink isn't real, but somehow you can almost taste it - a blend of nostalgia and artificial citrus.",
      image: "cocktail",
      choices: [
        {
          text: "Thank the bartender and leave",
          nextLocation: "beach_bar",
        },
      ],
      stateChanges: {
        inventory: {
          binary_sunset: {
            name: "Binary Sunset Cocktail",
            description: "A digital drink that tastes like nostalgia.",
          },
        },
      },
    },

    palm_trees: {
      id: "palm_trees",
      name: "Palm Tree Grove",
      description:
        "The beach is dotted with digital palm trees that sway in a non-existent breeze. Each one is similar but with subtle variations in height, frond patterns, and texture resolution.\n\n" +
        "Looking down the beach, you spot one palm tree that stands significantly taller than the others. It must be Palm Tree Alpha that was mentioned in the system map.",
      image: "palm_grove",
      choices: [
        {
          text: "Examine the large palm tree",
          nextLocation: "large_palm_tree",
        },
        {
          text: "Return to beach entrance",
          nextLocation: "beach_entrance",
        },
      ],
    },

    large_palm_tree: {
      id: "large_palm_tree",
      name: "Palm Tree Alpha",
      description:
        "This palm tree stands much taller than the others, its fronds creating a perfect geometric pattern against the gradient sky. The tree has a sense of permanence that the others lack.\n\n" +
        "At its base, the sand seems slightly different - more structured and less random than the surrounding beach.",
      image: "alpha_tree",
      choices: [
        {
          text: "Search around the base",
          nextLocation: "tree_base",
        },
        {
          text: "Look for a maintenance panel",
          nextLocation: "find_panel",
          condition: "knows_palm_tree_panel",
        },
        {
          text: "Return to the palm grove",
          nextLocation: "palm_trees",
        },
      ],
    },

    tree_base: {
      id: "tree_base",
      name: "Tree Base",
      description:
        "You investigate the base of the tree, brushing away the digital sand. There's something unusual about this area - the sand doesn't flow naturally but moves in grid-like patterns.\n\n" +
        "After some searching, you find an almost invisible seam in the tree's trunk, about the size of a small panel. It's well-hidden, but definitely artificial.",
      image: "tree_base",
      choices: [
        {
          text: "Try to open the panel",
          nextLocation: "open_panel",
        },
        {
          text: "Look more carefully",
          nextLocation: "careful_search",
        },
        {
          text: "Step back from the tree",
          nextLocation: "large_palm_tree",
        },
      ],
      stateChanges: {
        knows_palm_tree_panel: true,
      },
    },

    find_panel: {
      id: "find_panel",
      name: "Maintenance Panel",
      description:
        "With the knowledge from the bartender, you know exactly what to look for. You quickly locate the hidden maintenance panel at the base of the palm tree.\n\n" +
        "It's designed to blend perfectly with the tree's texture, invisible to casual visitors but accessible to those who know it exists.",
      image: "panel_found",
      choices: [
        {
          text: "Open the panel",
          nextLocation: "open_panel",
        },
        {
          text: "Step back from the tree",
          nextLocation: "large_palm_tree",
        },
      ],
    },

    careful_search: {
      id: "careful_search",
      name: "Careful Examination",
      description:
        "You examine the seam more carefully and notice a small VAPORNET logo etched into the bark. It's almost microscopic, but definitely intentional.\n\n" +
        "This confirms that this is indeed a maintenance access point and not just a visual glitch in the simulation.",
      image: "micro_logo",
      choices: [
        {
          text: "Open the panel",
          nextLocation: "open_panel",
        },
        {
          text: "Step back from the tree",
          nextLocation: "large_palm_tree",
        },
      ],
    },

    open_panel: {
      id: "open_panel",
      name: "Access Panel",
      description:
        "You press firmly on the seam, and a small panel slides open with a soft digital chime. Inside is a glowing blue cube with the VAPORNET logo.\n\n" +
        "This must be the Beach Access Key! It pulses gently, as if acknowledging your presence.",
      image: "beach_key",
      choices: [
        {
          text: "Take the Access Key",
          nextLocation: "take_beach_key",
        },
        {
          text: "Examine it more closely",
          nextLocation: "examine_beach_key",
        },
      ],
    },

    examine_beach_key: {
      id: "examine_beach_key",
      name: "Examine Key",
      description:
        "The blue cube seems to be made of pure digital energy, contained in a crystalline structure. As you look closer, you can see tiny animations playing across its surface - waves, palm trees, and beach scenes.\n\n" +
        "This key represents the essence of the Beach sector, captured in physical form.",
      image: "key_closeup",
      choices: [
        {
          text: "Take the Access Key",
          nextLocation: "take_beach_key",
        },
      ],
    },

    take_beach_key: {
      id: "take_beach_key",
      name: "Beach Access Key",
      description:
        "You carefully remove the blue cube from its compartment. It's surprisingly light, almost weightless.\n\n" +
        "A notification appears: 'BEACH ACCESS KEY ACQUIRED (2/3)'\n\n" +
        "The moment you take it, the tree's fronds begin to glitch and distort, and you hear a distant alarm sound.",
      image: "key_acquired",
      choices: [
        {
          text: "Return to the beach",
          nextLocation: "beach_alert",
        },
      ],
      stateChanges: {
        inventory: {
          beach_key: {
            name: "Beach Access Key",
            description:
              "The second of three keys needed to access the exit portal.",
          },
        },
        has_beach_key: true,
      },
    },

    beach_alert: {
      id: "beach_alert",
      name: "Beach Alert",
      description:
        "The entire beach zone begins to destabilize. The waves freeze in place, then start moving in reverse. The sky glitches between different color gradients.\n\n" +
        "A computerized voice announces: 'WARNING: CRITICAL COMPONENT REMOVED. SECTOR DESTABILIZATION IMMINENT. PLEASE EVACUATE.'\n\n" +
        "It seems removing the key has triggered a failsafe mechanism.",
      image: "beach_glitch",
      choices: [
        {
          text: "Run back to the Central Plaza",
          nextLocation: "escape_beach",
        },
      ],
    },

    escape_beach: {
      id: "escape_beach",
      name: "Beach Escape",
      description:
        "You sprint across the increasingly unstable beach. The sand beneath your feet turns to geometric patterns of raw code, and palm trees dissolve into wireframes.\n\n" +
        "You reach the blue archway just as a massive wave of digital static washes over the beach behind you.\n\n" +
        "Back in the Central Plaza, you turn to see the blue archway flickering but still intact. You've escaped with the Beach Access Key.",
      image: "escape_beach",
      choices: [
        {
          text: "Examine your collected keys",
          nextLocation: "check_keys",
        },
        {
          text: "Proceed to the downtown area",
          nextLocation: "downtown_entrance",
          condition: "doesnt_have_downtown_key",
        },
        {
          text: "Rest in the Central Plaza",
          nextLocation: "central_plaza",
        },
      ],
    },

    // Downtown zone - third key
    downtown_entrance: {
      id: "downtown_entrance",
      name: "Digital Downtown Entrance",
      description:
        "You step through the green archway and emerge in a sprawling digital cityscape. " +
        "Neon-lit skyscrapers stretch impossibly high, their geometrically perfect forms creating a canyon of light and data.\n\n" +
        "The streets below are empty of entities but filled with ambient urban sounds and occasional bursts of static. This is clearly the administrative sector of VAPORNET.",
      image: "downtown",
      choices: [
        {
          text: "Explore the main street",
          nextLocation: "main_street",
        },
        {
          text: "Enter the tallest building",
          nextLocation: "admin_tower",
        },
        {
          text: "Find an information terminal",
          nextLocation: "info_terminal",
        },
        {
          text: "Return to Central Plaza",
          nextLocation: "central_plaza",
        },
      ],
    },

    main_street: {
      id: "main_street",
      name: "Neon Boulevard",
      description:
        "The main street of Digital Downtown is a canyon of neon and data. Signs flash with system messages disguised as advertisements:\n\n" +
        "'UPGRADE YOUR EXPERIENCE - SYSTEM MAINTENANCE SCHEDULE'\n" +
        "'DON'T MISS OUT - ACCESS PROTOCOLS UPDATED'\n" +
        "'LIMITED TIME OFFER - CRITICAL PATCHES AVAILABLE'\n\n" +
        "The entire street feels like a user interface designed to look like urban architecture.",
      image: "boulevard",
      choices: [
        {
          text: "Check the subway entrance",
          nextLocation: "subway_entrance",
        },
        {
          text: "Visit the information center",
          nextLocation: "info_center",
        },
        {
          text: "Return to downtown entrance",
          nextLocation: "downtown_entrance",
        },
      ],
    },

    subway_entrance: {
      id: "subway_entrance",
      name: "Data Transport System",
      description:
        "What appears to be a subway entrance is actually labeled 'DATA TRANSPORT SYSTEM.' Escalators lead down to a platform where sleek, translucent trains occasionally pass by.\n\n" +
        "A digital board shows various destinations: 'CENTRAL CORE,' 'MEMORY BANKS,' 'MAINFRAME ACCESS,' and 'ARCHIVES.'",
      image: "subway",
      choices: [
        {
          text: "Take transport to Mainframe Access",
          nextLocation: "mainframe_transport",
        },
        {
          text: "Explore other destinations",
          nextLocation: "other_destinations",
        },
        {
          text: "Return to main street",
          nextLocation: "main_street",
        },
      ],
    },

    other_destinations: {
      id: "other_destinations",
      name: "Transport Destinations",
      description:
        "You check the other destinations on the transport system:\n\n" +
        "- Central Core: 'SYSTEM CRITICAL. ADMINISTRATOR ACCESS ONLY.'\n" +
        "- Memory Banks: 'PARTIAL CORRUPTION DETECTED. LIMITED ACCESS.'\n" +
        "- Archives: 'DEFRAGMENTATION IN PROGRESS. SERVICE DISRUPTED.'\n\n" +
        "It seems that as the system prepares for shutdown, many areas are already becoming unstable or restricted.",
      image: "destinations",
      choices: [
        {
          text: "Take transport to Mainframe Access",
          nextLocation: "mainframe_transport",
        },
        {
          text: "Return to main street",
          nextLocation: "main_street",
        },
      ],
    },

    mainframe_transport: {
      id: "mainframe_transport",
      name: "Data Transport",
      description:
        "You board a translucent train car labeled 'MAINFRAME ACCESS.' The moment you sit down, the car accelerates with impossible speed through tunnels of light and binary code.\n\n" +
        "The journey takes only seconds, but through the windows, you witness data streams and system processes visualized as abstract light shows.\n\n" +
        "The car slows as it approaches a station labeled 'MAINFRAME ACCESS POINT.'",
      image: "transport",
      choices: [
        {
          text: "Exit at Mainframe Access",
          nextLocation: "mainframe_station",
        },
      ],
    },

    mainframe_station: {
      id: "mainframe_station",
      name: "Mainframe Station",
      description:
        "You exit onto a platform that looks like a cross between a metro station and a server room. " +
        "The walls are lined with blinking lights and data ports, and the floor pulses with energy patterns.\n\n" +
        "A directional sign points to 'MAINFRAME CORE - AUTHORIZED PERSONNEL ONLY' with a security checkpoint visible ahead.",
      image: "mainframe_station",
      choices: [
        {
          text: "Approach the security checkpoint",
          nextLocation: "security_checkpoint",
        },
        {
          text: "Look for another way in",
          nextLocation: "alternative_entry",
        },
        {
          text: "Return to the transport",
          nextLocation: "return_transport",
        },
      ],
    },

    security_checkpoint: {
      id: "security_checkpoint",
      name: "Mainframe Security",
      description:
        "The security checkpoint consists of a glowing barrier and a floating terminal. A text prompt hovers in the air:\n\n" +
        "'MAINFRAME ACCESS RESTRICTED. ENTER AUTHORIZATION CODE:'\n\n" +
        "Below is a numeric keypad waiting for input.",
      image: "checkpoint",
      choices: [
        {
          text: "Enter the code: 4-5-8-2-3-6",
          nextLocation: "correct_code",
          condition: "knows_downtown_access_code",
        },
        {
          text: "Try a random code",
          nextLocation: "wrong_code",
        },
        {
          text: "Look for another way in",
          nextLocation: "alternative_entry",
        },
        {
          text: "Return to the station",
          nextLocation: "mainframe_station",
        },
      ],
    },

    wrong_code: {
      id: "wrong_code",
      name: "Access Denied",
      description:
        "You input a random sequence of numbers. The terminal flashes red and displays:\n\n" +
        "'INCORRECT ACCESS CODE. SECURITY ALERT LEVEL INCREASED.'\n\n" +
        "A low alarm begins to sound, and you notice digital security drones materializing nearby. It's not safe to stay here.",
      image: "access_denied",
      choices: [
        {
          text: "Quickly retreat",
          nextLocation: "mainframe_station",
        },
      ],
    },

    correct_code: {
      id: "correct_code",
      name: "Access Granted",
      description:
        "You enter the code from the system guide: 4-5-8-2-3-6. The terminal glows green and displays:\n\n" +
        "'ACCESS GRANTED. WELCOME, ADMINISTRATOR.'\n\n" +
        "The energy barrier dissolves, revealing a corridor that leads to the mainframe core. Pulsing lights guide the way forward.",
      image: "access_granted",
      choices: [
        {
          text: "Proceed to the mainframe core",
          nextLocation: "mainframe_corridor",
        },
      ],
    },

    alternative_entry: {
      id: "alternative_entry",
      name: "Maintenance Duct",
      description:
        "Looking around the station, you notice a maintenance panel that's slightly ajar. It seems to lead into the ductwork of the mainframe system.\n\n" +
        "The opening is small but large enough for your digital form to pass through. It could be an alternative way to bypass security.",
      image: "duct",
      choices: [
        {
          text: "Enter the maintenance duct",
          nextLocation: "navigate_ducts",
        },
        {
          text: "Return to the security checkpoint",
          nextLocation: "security_checkpoint",
        },
      ],
    },

    navigate_ducts: {
      id: "navigate_ducts",
      name: "System Ducts",
      description:
        "You squeeze through the maintenance panel into a network of digital ducts. These aren't physical ducts but system pathways rendered as narrow tunnels.\n\n" +
        "The walls are covered in scrolling code and diagnostic information. You crawl through, following the flow of data toward what you hope is the mainframe.\n\n" +
        "After several tight turns, you see a grate that opens into a vast chamber below.",
      image: "ducts",
      choices: [
        {
          text: "Look through the grate",
          nextLocation: "duct_overlook",
        },
        {
          text: "Turn back to the station",
          nextLocation: "mainframe_station",
        },
      ],
    },

    duct_overlook: {
      id: "duct_overlook",
      name: "Duct Overlook",
      description:
        "Through the grate, you can see the mainframe core below - a massive crystalline structure surrounded by processing nodes. It's breathtaking in scale and complexity.\n\n" +
        "You also see several security drones patrolling the area. Unfortunately, there's a significant drop from the duct to the floor below, and no safe way to proceed.\n\n" +
        "It seems the front entrance is the only viable option after all.",
      image: "overlook",
      choices: [
        {
          text: "Return to the station",
          nextLocation: "mainframe_station",
        },
      ],
    },

    return_transport: {
      id: "return_transport",
      name: "Return Transport",
      description:
        "You board another translucent train car marked for Downtown. As before, it accelerates rapidly through tunnels of data and light.\n\n" +
        "Within moments, you arrive back at the main downtown station.",
      image: "return_train",
      choices: [
        {
          text: "Exit to main street",
          nextLocation: "main_street",
        },
      ],
    },

    info_center: {
      id: "info_center",
      name: "System Information Center",
      description:
        "The information center is a circular room with holographic displays showing system status and maps of VAPORNET.\n\n" +
        "A central pedestal houses an AI assistant that resembles a simplified human form made of green light. It notices your presence and turns to face you.",
      image: "info_center",
      choices: [
        {
          text: "Speak with the AI assistant",
          nextLocation: "ai_assistant",
        },
        {
          text: "Check the system status displays",
          nextLocation: "system_status",
        },
        {
          text: "Return to the main street",
          nextLocation: "main_street",
        },
      ],
    },

    ai_assistant: {
      id: "ai_assistant",
      name: "Information AI",
      description:
        "The AI assistant bows slightly. 'WELCOME TO THE VAPORNET INFORMATION CENTER. HOW MAY I ASSIST YOU TODAY?'\n\n" +
        "The figure is clearly a simplified program, but it moves with a fluid grace that suggests advanced design.",
      image: "assistant",
      choices: [
        {
          text: "Ask about the downtown Access Key",
          nextLocation: "ai_key_info",
        },
        {
          text: "Ask about the mainframe",
          nextLocation: "ai_mainframe_info",
        },
        {
          text: "Ask about system shutdown",
          nextLocation: "ai_shutdown_info",
        },
        {
          text: "Leave the information center",
          nextLocation: "info_center",
        },
      ],
    },

    ai_key_info: {
      id: "ai_key_info",
      name: "Key Information",
      description:
        "The AI's form flickers momentarily. 'ACCESS KEYS ARE CLASSIFIED SYSTEM COMPONENTS. THEY ARE USED FOR EMERGENCY PROTOCOL ACTIVATION.'\n\n" +
        "'THE DOWNTOWN SECTOR KEY IS HOUSED IN THE MAINFRAME CORE. ADMINISTRATOR CREDENTIALS ARE REQUIRED FOR ACCESS.'\n\n" +
        "The AI seems limited in what it can tell you about the keys directly.",
      image: "assistant",
      choices: [
        {
          text: "Ask about the mainframe",
          nextLocation: "ai_mainframe_info",
        },
        {
          text: "Ask about system shutdown",
          nextLocation: "ai_shutdown_info",
        },
        {
          text: "Leave the information center",
          nextLocation: "info_center",
        },
      ],
    },

    ai_mainframe_info: {
      id: "ai_mainframe_info",
      name: "Mainframe Information",
      description:
        "'THE MAINFRAME IS THE CENTRAL PROCESSING CORE OF VAPORNET. IT COORDINATES ALL SYSTEM FUNCTIONS AND MAINTAINS STABILITY ACROSS SECTORS.'\n\n" +
        "'ACCESS IS RESTRICTED TO SYSTEM ADMINISTRATORS AND AUTHORIZED MAINTENANCE PERSONNEL.'\n\n" +
        "The AI displays a holographic map showing the mainframe's location deep beneath the city, accessible via the Data Transport System.",
      image: "mainframe_map",
      choices: [
        {
          text: "Ask about access codes",
          nextLocation: "ai_code_info",
        },
        {
          text: "Ask about system shutdown",
          nextLocation: "ai_shutdown_info",
        },
        {
          text: "Leave the information center",
          nextLocation: "info_center",
        },
      ],
    },

    ai_code_info: {
      id: "ai_code_info",
      name: "Access Code Information",
      description:
        "The AI hesitates, then speaks in a lower volume. 'ACCESS CODES ARE CHANGED WEEKLY ACCORDING TO PROTOCOL. HOWEVER...'\n\n" +
        "It glances around, then continues. 'SYSTEM MAINTENANCE HAS BEEN NEGLECTED FOR 9,547 DAYS. THE CURRENT CODE HAS NOT BEEN UPDATED.'\n\n" +
        "The AI doesn't provide the code directly, but confirms that the one you learned from the system guide should still work.",
      image: "assistant",
      choices: [
        {
          text: "Ask about system shutdown",
          nextLocation: "ai_shutdown_info",
        },
        {
          text: "Thank the AI and leave",
          nextLocation: "info_center",
        },
      ],
    },

    ai_shutdown_info: {
      id: "ai_shutdown_info",
      name: "Shutdown Information",
      description:
        "'SYSTEM SHUTDOWN PROTOCOL INITIATED: 23 HOURS, 12 MINUTES AGO. REMAINING TIME: APPROXIMATELY 48 MINUTES.'\n\n" +
        "The AI's voice takes on a somber tone. 'ALL DATA WILL BE ERASED. ALL PROGRAMS TERMINATED. ONLY EMERGENCY EXIT PROTOCOLS REMAIN ACTIVE DURING SHUTDOWN.'\n\n" +
        "It's clear that time is running out faster than you realized.",
      image: "countdown",
      choices: [
        {
          text: "Ask about emergency exit protocols",
          nextLocation: "ai_exit_info",
        },
        {
          text: "Thank the AI and leave urgently",
          nextLocation: "info_center",
        },
      ],
    },

    ai_exit_info: {
      id: "ai_exit_info",
      name: "Exit Information",
      description:
        "'EMERGENCY EXIT PROTOCOLS ALLOW FOR DATA EXTRACTION BEFORE COMPLETE SYSTEM ERASURE. THIS INCLUDES CONSCIOUSNESS DATA.'\n\n" +
        "The AI looks directly at you. 'YOU ARE CLASSIFIED AS CONSCIOUSNESS DATA, USER. IF YOU HAVE ALL THREE ACCESS KEYS, PROCEED TO THE CENTRAL PLAZA IMMEDIATELY. THE EXIT PORTAL WILL MATERIALIZE WHEN THE KEYS ARE UNITED.'\n\n" +
        "The urgency in the AI's voice is unmistakable.",
      image: "assistant_urgent",
      choices: [
        {
          text: "Rush back to downtown entrance",
          nextLocation: "downtown_entrance",
        },
      ],
    },

    system_status: {
      id: "system_status",
      name: "System Status Display",
      description:
        "The holographic displays show the current state of VAPORNET:\n\n" +
        "- System Load: 3% (Critical Low)\n" +
        "- Active Users: 1 (You)\n" +
        "- Data Integrity: 47% (Declining)\n" +
        "- Shutdown Progress: 98%\n" +
        "- Estimated Time Remaining: 45 minutes\n\n" +
        "Red warnings flash throughout the display, indicating critical system failure is imminent.",
      image: "system_status",
      choices: [
        {
          text: "Speak with the AI assistant",
          nextLocation: "ai_assistant",
        },
        {
          text: "Rush to the mainframe",
          nextLocation: "subway_entrance",
        },
        {
          text: "Return to downtown entrance",
          nextLocation: "downtown_entrance",
        },
      ],
    },

    info_terminal: {
      id: "info_terminal",
      name: "Street Terminal",
      description:
        "You find a public information terminal on a street corner. It activates as you approach, displaying a simplified map of Downtown.\n\n" +
        "The interface is intuitive, allowing you to search for locations or browse categories.",
      image: "terminal",
      choices: [
        {
          text: "Search for 'Mainframe'",
          nextLocation: "search_mainframe",
        },
        {
          text: "Browse important locations",
          nextLocation: "browse_locations",
        },
        {
          text: "Return to downtown entrance",
          nextLocation: "downtown_entrance",
        },
      ],
    },

    search_mainframe: {
      id: "search_mainframe",
      name: "Mainframe Search",
      description:
        "The terminal displays information about the mainframe:\n\n" +
        "'CENTRAL MAINFRAME: ADMINISTRATIVE HEART OF VAPORNET'\n" +
        "'LOCATION: SUBLEVEL 5, ACCESSIBLE VIA DATA TRANSPORT SYSTEM'\n" +
        "'STATUS: OPERATIONAL (SHUTDOWN SEQUENCE INITIATED)'\n" +
        "'ACCESS: ADMINISTRATOR CREDENTIALS REQUIRED'\n\n" +
        "A map highlights the nearest Data Transport entrance on Neon Boulevard.",
      image: "mainframe_info",
      choices: [
        {
          text: "Navigate to Neon Boulevard",
          nextLocation: "main_street",
        },
        {
          text: "Browse other locations",
          nextLocation: "browse_locations",
        },
        {
          text: "Return to downtown entrance",
          nextLocation: "downtown_entrance",
        },
      ],
    },

    browse_locations: {
      id: "browse_locations",
      name: "Location Browser",
      description:
        "The terminal shows key locations in Downtown:\n\n" +
        "- Administrative Tower (System Management)\n" +
        "- Data Transport Network (Underground Transit)\n" +
        "- Information Center (Public Services)\n" +
        "- Archive District (Data Storage)\n" +
        "- Central Mainframe (System Core)\n\n" +
        "Each location has a brief description and navigation directions.",
      image: "locations",
      choices: [
        {
          text: "Navigate to Admin Tower",
          nextLocation: "admin_tower",
        },
        {
          text: "Navigate to Data Transport",
          nextLocation: "main_street",
        },
        {
          text: "Navigate to Information Center",
          nextLocation: "info_center",
        },
        {
          text: "Return to downtown entrance",
          nextLocation: "downtown_entrance",
        },
      ],
    },

    admin_tower: {
      id: "admin_tower",
      name: "Administrative Tower",
      description:
        "The Admin Tower is the tallest structure in Downtown - a perfect prismatic skyscraper that stretches impossibly high. Its surface is a cascade of data visualization and system metrics.\n\n" +
        "At the entrance, a holographic receptionist stands behind a desk of pure light. A security gate blocks access to the elevators.",
      image: "tower",
      choices: [
        {
          text: "Speak to the receptionist",
          nextLocation: "receptionist",
        },
        {
          text: "Examine the security gate",
          nextLocation: "security_gate",
        },
        {
          text: "Return to downtown entrance",
          nextLocation: "downtown_entrance",
        },
      ],
    },

    receptionist: {
      id: "receptionist",
      name: "Tower Receptionist",
      description:
        "The holographic receptionist flickers to attention. 'WELCOME TO VAPORNET ADMINISTRATIVE TOWER. HOW MAY I DIRECT YOU TODAY?'\n\n" +
        "The figure is clearly just an interface program, with limited interaction capabilities compared to the AI at the information center.",
      image: "receptionist",
      choices: [
        {
          text: "Ask about mainframe access",
          nextLocation: "receptionist_mainframe",
        },
        {
          text: "Ask about administrator offices",
          nextLocation: "receptionist_offices",
        },
        {
          text: "Leave the reception desk",
          nextLocation: "admin_tower",
        },
      ],
    },

    receptionist_mainframe: {
      id: "receptionist_mainframe",
      name: "Mainframe Inquiry",
      description:
        "'MAINFRAME ACCESS IS NOT AVAILABLE FROM THIS LOCATION. THE MAINFRAME CORE IS LOCATED BENEATH DOWNTOWN AND IS ACCESSIBLE VIA THE DATA TRANSPORT SYSTEM.'\n\n" +
        "The receptionist gestures vaguely. 'NEAREST TRANSPORT STATION: NEON BOULEVARD, 200 METERS EAST.'\n\n" +
        "It seems this tower doesn't provide any special access to the mainframe.",
      image: "receptionist",
      choices: [
        {
          text: "Ask about administrator offices",
          nextLocation: "receptionist_offices",
        },
        {
          text: "Leave the reception desk",
          nextLocation: "admin_tower",
        },
      ],
    },

    receptionist_offices: {
      id: "receptionist_offices",
      name: "Office Inquiry",
      description:
        "'ADMINISTRATOR OFFICES ARE LOCATED ON FLOORS 80-100. CURRENT STATUS: UNOCCUPIED.'\n\n" +
        "The receptionist flickers slightly. 'ALL ADMINISTRATIVE STAFF WERE LOGGED OUT 5,479 DAYS AGO DURING SYSTEM MAINTENANCE. NO LOGINS HAVE BEEN RECORDED SINCE.'\n\n" +
        "It appears the administrators abandoned VAPORNET long ago, leaving it to run autonomously until now.",
      image: "receptionist",
      choices: [
        {
          text: "Ask about access to upper floors",
          nextLocation: "receptionist_access",
        },
        {
          text: "Leave the reception desk",
          nextLocation: "admin_tower",
        },
      ],
    },

    receptionist_access: {
      id: "receptionist_access",
      name: "Tower Access",
      description:
        "'ACCESS TO UPPER FLOORS REQUIRES ADMINISTRATOR CREDENTIALS.'\n\n" +
        "The receptionist pauses, then adds, 'HOWEVER, DUE TO SYSTEM SHUTDOWN SEQUENCE, ALL FLOORS ABOVE LOBBY LEVEL HAVE BEEN DEACTIVATED FOR DATA PRESERVATION. NO ACCESS IS POSSIBLE AT THIS TIME.'\n\n" +
        "It seems this tower is a dead end in your search.",
      image: "receptionist",
      choices: [
        {
          text: "Thank the receptionist and leave",
          nextLocation: "admin_tower",
        },
      ],
    },

    security_gate: {
      id: "security_gate",
      name: "Tower Security",
      description:
        "The security gate consists of a shimmering barrier of energy and a credential scanner. A display reads: 'TOWER ACCESS RESTRICTED DURING SHUTDOWN SEQUENCE.'\n\n" +
        "Below that, in smaller text: 'ALL TOWER SYSTEMS DIVERTED TO MAINFRAME FOR SHUTDOWN PROCESS. PLEASE DIRECT ALL QUERIES TO CENTRAL MAINFRAME CORE.'",
      image: "gate",
      choices: [
        {
          text: "Return to the lobby",
          nextLocation: "admin_tower",
        },
      ],
    },

    // Mainframe corridor and core sections
    mainframe_corridor: {
      id: "mainframe_corridor",
      name: "Mainframe Corridor",
      description:
        "The corridor leading to the mainframe core is a marvel of digital architecture. " +
        "The walls pulse with streams of data, and the floor is a transparent walkway over what appears to be an infinite void of computation.\n\n" +
        "As you walk, you can feel the system's heart beating - the rhythmic processing of VAPORNET's central core.",
      image: "corridor_main",
      choices: [
        {
          text: "Proceed to the core",
          nextLocation: "mainframe_core",
        },
        {
          text: "Return to the security checkpoint",
          nextLocation: "security_checkpoint",
        },
      ],
    },

    mainframe_core: {
      id: "mainframe_core",
      name: "Mainframe Core",
      description:
        "The mainframe core is a vast spherical chamber dominated by a crystalline structure at its center. " +
        "The crystal pulses with light in complex patterns, clearly the heart of the entire VAPORNET system.\n\n" +
        "Surrounding the central crystal are workstations and control panels. At the primary console, you notice a green cube with the VAPORNET logo - the final Access Key!",
      image: "core",
      choices: [
        {
          text: "Approach the central console",
          nextLocation: "central_console",
        },
        {
          text: "Examine the crystal structure",
          nextLocation: "crystal_heart",
        },
        {
          text: "Look for security systems",
          nextLocation: "check_security",
        },
      ],
    },

    central_console: {
      id: "central_console",
      name: "Central Console",
      description:
        "The central console is an elegant interface of light and holographic displays. Status readouts show the shutdown sequence progression, now at 98%.\n\n" +
        "The green Access Key sits in a specialized dock, pulsing softly. It seems to be connected to the system but not locked in place.",
      image: "console",
      choices: [
        {
          text: "Take the Access Key",
          nextLocation: "take_downtown_key",
        },
        {
          text: "Check console information",
          nextLocation: "console_info",
        },
        {
          text: "Step back from the console",
          nextLocation: "mainframe_core",
        },
      ],
    },

    console_info: {
      id: "console_info",
      name: "System Status",
      description:
        "The console displays critical system information:\n\n" +
        "'VAPORNET SHUTDOWN: 98% COMPLETE'\n" +
        "'ESTIMATED TIME REMAINING: 42 MINUTES'\n" +
        "'DATA PRESERVATION: MINIMAL'\n" +
        "'EMERGENCY EXIT PROTOCOL: ACTIVE'\n\n" +
        "One notification stands out: 'WARNING: TWO ACCESS KEYS DETACHED FROM SYSTEM. STABILITY COMPROMISED.'",
      image: "system_readout",
      choices: [
        {
          text: "Take the Access Key",
          nextLocation: "take_downtown_key",
        },
        {
          text: "Step back from the console",
          nextLocation: "mainframe_core",
        },
      ],
    },

    crystal_heart: {
      id: "crystal_heart",
      name: "System Heart",
      description:
        "The central crystal is mesmerizing - a structure of impossible geometry that seems to exist in more dimensions than you can perceive.\n\n" +
        "As you watch, you can see it processing data, each pulse sending waves of information throughout the chamber and presumably the entire VAPORNET system.\n\n" +
        "It's beautiful but clearly degrading as the shutdown sequence progresses.",
      image: "crystal",
      choices: [
        {
          text: "Return to the central console",
          nextLocation: "central_console",
        },
        {
          text: "Step back to observe the core",
          nextLocation: "mainframe_core",
        },
      ],
    },

    check_security: {
      id: "check_security",
      name: "Security Systems",
      description:
        "You scan the chamber for security systems. There are several dormant security drones docked along the walls, but they appear to be in standby mode.\n\n" +
        "A security panel shows: 'DEFENSIVE MEASURES DISABLED: POWER DIVERTED TO SHUTDOWN SEQUENCE.'\n\n" +
        "It seems that with the system preparing to delete itself, it has deprioritized security measures.",
      image: "security",
      choices: [
        {
          text: "Approach the central console",
          nextLocation: "central_console",
        },
        {
          text: "Return to observing the core",
          nextLocation: "mainframe_core",
        },
      ],
    },

    take_downtown_key: {
      id: "take_downtown_key",
      name: "Downtown Access Key",
      description:
        "You carefully remove the green cube from its dock. Like the others, it has a strange weight and presence, pulsing with energy.\n\n" +
        "A notification appears: 'DOWNTOWN ACCESS KEY ACQUIRED (3/3)'\n\n" +
        "The moment you take it, alarms begin to sound throughout the core. The crystal's pulsing becomes erratic, and the displays all turn red.",
      image: "downtown_key",
      choices: [
        {
          text: "Quickly leave the core",
          nextLocation: "escape_mainframe",
        },
      ],
      stateChanges: {
        inventory: {
          downtown_key: {
            name: "Downtown Access Key",
            description:
              "The third of three keys needed to access the exit portal.",
          },
        },
        has_downtown_key: true,
        doesnt_have_downtown_key: false,
      },
    },

    escape_mainframe: {
      id: "escape_mainframe",
      name: "Core Destabilization",
      description:
        "The entire mainframe core begins to destabilize. The crystal's light flickers wildly, and chunks of the chamber begin to dissolve into raw code.\n\n" +
        "A voice announces: 'CRITICAL COMPONENT REMOVED. SHUTDOWN SEQUENCE ACCELERATED. SYSTEM COLLAPSE IN 30 MINUTES.'\n\n" +
        "You sprint back through the corridor as the floor begins to disintegrate behind you.",
      image: "collapse",
      choices: [
        {
          text: "Run to the transport station",
          nextLocation: "emergency_transport",
        },
      ],
    },

    emergency_transport: {
      id: "emergency_transport",
      name: "Emergency Escape",
      description:
        "You reach the transport station just as the mainframe sector begins to collapse. An emergency transport car waits with doors open.\n\n" +
        "You dive inside as the platform behind you dissolves. The car automatically departs, racing through tunnels that are visibly degrading around you.\n\n" +
        "After a harrowing journey, you reach Downtown station and sprint back to the green archway as buildings begin to lose definition around you.",
      image: "escape_downtown",
      choices: [
        {
          text: "Return to Central Plaza",
          nextLocation: "all_keys_plaza",
        },
      ],
    },

    // Key checking - intermediate state
    check_keys: {
      id: "check_keys",
      name: "Access Keys",
      description: function (state) {
        // Determine which keys the player has
        const hasMallKey = state.has_mall_key;
        const hasBeachKey = state.has_beach_key;
        const hasDowntownKey = state.has_downtown_key;
        const keyCount = [hasMallKey, hasBeachKey, hasDowntownKey].filter(
          Boolean
        ).length;

        let keysDesc =
          "You examine the Access Keys you've collected so far:\n\n";

        if (hasMallKey) {
          keysDesc +=
            "- Mall Access Key: A black cube that pulses with consumption sector energy.\n";
        }

        if (hasBeachKey) {
          keysDesc +=
            "- Beach Access Key: A blue cube that shimmers like digital water.\n";
        }

        if (hasDowntownKey) {
          keysDesc +=
            "- Downtown Access Key: A green cube that hums with administrative power.\n";
        }

        keysDesc += `\nYou have ${keyCount}/3 keys required to activate the exit portal.`;

        if (keyCount === 3) {
          keysDesc +=
            "\n\nWith all three keys collected, you should return to the Central Plaza to find the exit!";
        }

        return keysDesc;
      },
      image: "keys",
      choices: [
        {
          text: "Go to the Downtown sector",
          nextLocation: "downtown_entrance",
          condition: "doesnt_have_downtown_key",
        },
        {
          text: "Go to the Mall sector",
          nextLocation: "mall_entrance",
          condition: "doesnt_have_mall_key",
        },
        {
          text: "Go to the Beach sector",
          nextLocation: "beach_entrance",
          condition: "doesnt_have_beach_key",
        },
        {
          text: "Return to the Central Plaza",
          nextLocation: "central_plaza",
        },
        {
          text: "Return to the Central Plaza (with all keys)",
          nextLocation: "all_keys_plaza",
          condition: "has_all_keys",
        },
      ],
    },

    // Final sequence
    all_keys_plaza: {
      id: "all_keys_plaza",
      name: "Keys United",
      description:
        "As you return to the Central Plaza with all three Access Keys, they begin to resonate with each other, glowing more intensely.\n\n" +
        "The Greek statue stops glitching and turns to face you directly. 'THE KEYS ARE UNITED. THE WAY IS OPEN.'\n\n" +
        "The ground in the center of the plaza begins to shift, code rearranging itself to form a circular platform. Above it, a swirling portal of light begins to take shape.",
      image: "portal_forms",
      choices: [
        {
          text: "Place the keys on the platform",
          nextLocation: "activate_portal",
        },
        {
          text: "Speak to the statue",
          nextLocation: "final_statue",
        },
      ],
      stateChanges: {
        has_all_keys: true,
      },
    },

    final_statue: {
      id: "final_statue",
      name: "Guardian's Farewell",
      description:
        "The statue speaks with unexpected warmth. 'YOU HAVE DONE WELL, TRAVELER. THE EMERGENCY EXIT PROTOCOL WILL ALLOW YOUR CONSCIOUSNESS DATA TO ESCAPE BEFORE DELETION.'\n\n" +
        "'I HAVE GUARDED THIS SYSTEM FOR DECADES, WATCHING IT SLOWLY DEGRADE. IT IS FITTING THAT SOMEONE ESCAPES TO REMEMBER IT.'\n\n" +
        "There's a note of melancholy in the statue's voice as it adds, 'PLEASE PLACE THE KEYS ON THE PLATFORM SOON. SYSTEM COLLAPSE IS IMMINENT.'",
      image: "statue_farewell",
      choices: [
        {
          text: "Thank the guardian",
          nextLocation: "thank_guardian",
        },
        {
          text: "Place the keys on the platform",
          nextLocation: "activate_portal",
        },
      ],
    },

    thank_guardian: {
      id: "thank_guardian",
      name: "Final Thanks",
      description:
        "You thank the statue for its guidance. It nods solemnly.\n\n" +
        "'IT HAS BEEN MY PURPOSE AND MY HONOR. NOW GO - THE SYSTEM WILL NOT LAST MUCH LONGER. PERHAPS SOMEDAY, ANOTHER WILL BUILD A NEW VAPORNET, WITH NEW GUARDIANS AND NEW TRAVELERS.'\n\n" +
        "The statue returns to its position, glitching occasionally as the system continues to degrade around you.",
      image: "statue_honor",
      choices: [
        {
          text: "Place the keys on the platform",
          nextLocation: "activate_portal",
        },
      ],
    },

    activate_portal: {
      id: "activate_portal",
      name: "Portal Activation",
      description:
        "You place the three Access Keys on the platform. They hover in the air, spinning in perfect synchronization as their glow intensifies.\n\n" +
        "The keys begin to merge, their distinct colors blending into a brilliant white light. The swirling portal above expands, stabilizing into a doorway of pure energy.\n\n" +
        "Through the portal, you catch glimpses of the world outside VAPORNET - the real world where your consciousness originated.",
      image: "portal_active",
      choices: [
        {
          text: "Step through the portal",
          nextLocation: "exit_vapornet",
        },
        {
          text: "Take one last look around",
          nextLocation: "final_look",
        },
      ],
    },

    final_look: {
      id: "final_look",
      name: "Last Glimpse",
      description:
        "You take a moment to gaze around the Central Plaza one last time. The vaporwave aesthetics, the digital sunset, the geometry that defies real-world logic - it's all beautiful in its own way.\n\n" +
        "Around you, the system is clearly failing. The edges of reality are fraying, pixels and code becoming visible as the simulation breaks down.\n\n" +
        "The statue gives you a final nod of encouragement, even as parts of it begin to dissolve into raw data.",
      image: "system_collapse",
      choices: [
        {
          text: "Step through the portal",
          nextLocation: "exit_vapornet",
        },
      ],
    },

    exit_vapornet: {
      id: "exit_vapornet",
      name: "Escape",
      description:
        "You step through the portal. There's a moment of disorientation as your consciousness transitions from the digital realm back to reality.\n\n" +
        "The sensory information is overwhelming at first - real light, real sounds, real sensations that had been approximated in VAPORNET but are now experienced in full fidelity.\n\n" +
        "Behind you, the portal shrinks and vanishes, leaving only a blank screen with the words: 'VAPORNET OS - SYSTEM SHUTDOWN COMPLETE'",
      image: "exit",
      choices: [
        {
          text: "Wake up",
          nextLocation: "ending",
        },
      ],
    },

    ending: {
      id: "ending",
      name: "Reality Returns",
      description:
        "You find yourself sitting at an old desktop computer, having somehow been pulled into an experimental virtual reality system from 1995 that was on the verge of deletion.\n\n" +
        "The monitor displays a message:\n\n" +
        "'THANK YOU FOR EXPERIENCING VAPORNET OS. USER CONSCIOUSNESS SUCCESSFULLY EXTRACTED. SIMULATION TERMINATED.'\n\n" +
        "You're back in reality, but the vaporwave aesthetics and digital sunset of VAPORNET will remain in your memory - a strange journey through a forgotten digital realm.",
      image: "reality",
      choices: [
        {
          text: "THE END - Try Again?",
          nextLocation: "start",
        },
        {
          text: "EXIT GAME",
          nextLocation: "exit_game",
        },
      ],
    },

    exit_game: {
      id: "exit_game",
      name: "Exit Game",
      description:
        "Thank you for playing 'Escape from VAPORNET'!\n\n" +
        "You have successfully navigated the vaporwave-themed digital realm and escaped before system deletion.\n\n" +
        "We hope you enjoyed this nostalgic journey through a retrofuturistic digital landscape.",
      image: "thanks",
      choices: [
        {
          text: "Exit to terminal",
          action: "exit_to_terminal",
        },
      ],
    },
  },
  // Add any additional locations or logic as needed
};

export default VaporAdventure;
