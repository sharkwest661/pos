export const DOCUMENTS = {
  readme: {
    id: "readme",
    title: "README.txt",
    date: new Date("2003-03-28T10:15:00"),
    content: `# CONFIDENTIAL: Case File #2872-B

AUTHORIZATION LEVEL: Level 4 Clearance
CASE STATUS: Active Investigation
DATE: March 28, 2003

## CASE OVERVIEW

In the past month, five bodies have been discovered across Baku. Each victim was found with their face deliberately damaged beyond recognition and a small object left with the body. These objects appear to be symbolic in nature.

The police investigation has stalled until we received an anonymous tip that connects these murders to an underground dark web marketplace called "Shadow Market" - a platform for illegal goods and services accessible only through specialized browsers.

You have been assigned as the lead digital investigator on this case due to your expertise in cybercrime forensics. Your task is to identify the victims, determine what they were selling on Shadow Market, and ultimately track down the vigilante killer.

## EVIDENCE RECOVERED

The following items were found with each victim:

1. A small toy snake wrapped around a circuit board
2. An antique medical caduceus with gauze wrapped around it
3. A small metal lighter with Greek lettering
4. A USB drive embedded in a small sheaf of wheat
5. A small mirror with text etched backward

Our anonymous source suggests these objects correspond to specific vendor profiles on Shadow Market. Your first objective is to access this marketplace and identify these connections.

## CASE UPDATE: March 30, 2003

An anonymous tip was received via encrypted email three days ago. The sender claims to be a user of the "Shadow Market" - an underground dark web marketplace accessible only through specialized browsers.

The tipster believes the murders may be connected to Shadow Market activity. They noted that shortly after a vendor using the alias "CobraSystems" suddenly disappeared from the marketplace, the first body was discovered with a toy snake on a circuit board. The tipster suggests this might not be coincidental.

The source refused further communication, stating: "I've already risked too much. I'm just a customer, not a criminal. I don't want to be next."

Technical analysis of the email confirms it was sent through multiple anonymizing services. Your task is to access Shadow Market, investigate possible connections between the victims and vendor profiles, and determine if there's a pattern that might lead to the killer.

Note: You will need to gather information about how to access the Shadow Market through your investigation. Check public sources for rumors about access methods.

## SYSTEM INSTRUCTIONS

This workstation has been equipped with several specialized applications to assist your investigation:

- DARK WEB BROWSER: For accessing Shadow Market (requires configuration)
- SEARCH ENGINE: For finding information across public networks
- DATABASE: Access to police, medical, financial, and other records
- EVIDENCE BOARD: Track and connect your findings about the victims
- EMAIL: Check for incoming communications
- NOTEPAD: Document your observations
- TERMINAL: For advanced system operations and password cracking

To begin your investigation:
1. Use the Search Engine to research recent missing persons cases in Baku
2. Configure the Dark Web Browser to access Shadow Market
3. Use the Database to cross-reference potential victim identities
4. Document your findings on the Evidence Board

Be thorough in your investigation. The killer appears to be targeting vendors based on specific criteria. Understanding this pattern may help identify potential future targets before they become victims.

Good luck, Detective. Time is of the essence.

-- Chief Investigator Aliyev`,
  },
  "access-instructions": {
    // Keep the access instructions file the same
    id: "access-instructions",
    title: "DarkWeb_Access.txt",
    date: new Date("2003-03-27T16:42:00"),
    content: `# DARK WEB ACCESS INSTRUCTIONS

    To access the Shadow Market, you will need to configure the Dark Web Browser correctly:

    1. Launch the Dark Web Browser application
    2. Enter the following .onion address: shadowmkt7zvqi32.onion
    3. When prompted for authentication, use credentials from the anonymous source:
      Username: shadowguest
      Password: v1s1t0r2003

    Note that the marketplace frequently changes its access protocols. If you cannot connect using these credentials, check your email for updated information from our source.

    WARNING: Exercise extreme caution when navigating the marketplace. Some vendors may have sophisticated tracking methods.

    For technical assistance, contact IT support through the Terminal application.`,
  },
};
