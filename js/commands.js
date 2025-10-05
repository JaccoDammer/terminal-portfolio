// js/commmands.js
import {
  printLine,
  clearOutput,
  printPromptedCommand,
  applyDynamicSpacing,
  scroll,
} from "./utils.js";

const commandList = {
  help: {
    description: "Show a list of available commands",
    aliases: ["h", "hlp"],
    action: showHelp,
  },
  whoami: {
    description: "Information about me",
    aliases: ["who", "id", "me"],
    action: showWhoami,
  },
  skills: {
    description: "Show my technical skill set",
    aliases: ["stack", "tech"],
    action: showSkills,
  },
  projects: {
    description: "Show sample projects",
    aliases: ["proj"],
    action: showProjects,
  },
  contact: {
    description: "Links to my social profiles",
    aliases: ["socials", "soc", "con"],
    action: showContact,
  },
  clear: {
    description: "Clear the terminal output",
    aliases: ["cls", "clr"],
    action: clearOutput,
  },
  theme: {
    description:
      "Switch between dark and light mode (usage: theme [dark|light])",
    aliases: ["theme-light", "theme-dark"],
    action: switchTheme,
  },
  version: {
    description: "Shows version",
    aliases: ["v"],
    action: showVersion,
  },
};

const secretCommands = {
  sudo: {
    action: showSudo,
  },
  rm: {
    aliases: ["rm -rf /"],
    action: showRm,
  },
};

export function handleCommand(raw) {
  const full = raw.trim();
  if (!full) return; // command is empty/null/undefined/0

  printPromptedCommand(full);
  const [name, ...args] = full.split(/\s+/);

  // Directe match
  if (commandList[name]) {
    commandList[name].action(args);
    scroll();
    return;
  }

  // Alias check
  for (const [cmdName, data] of Object.entries(commandList)) {
    if (data.aliases && data.aliases.includes(name)) {
      // Special case for theme-light / theme-dark > add arguments
      if (name.startsWith("theme-")) {
        const themeArg = name.split("-")[1];
        commandList["theme"].action([themeArg]);
        return;
      }

      commandList[cmdName].action(args);
      scroll();
      return;
    }
  }

  // Hyphen fallback (theme-light -> theme light)
  if (name.includes("-")) {
    const [maybeName, ...hyphenArgs] = name.split("-");
    if (commandList[maybeName]) {
      const newArgs = [...hyphenArgs, ...args];
      commandList[maybeName].action(newArgs);
      scroll();
      return;
    }
  }

  // Hidden commands
  if (secretCommands[name]) {
    secretCommands[name].action(args);
    scroll();
    return;
  }

  // Not found
  printLine(
    `<span class="error">Command not found</span>: ` +
      `'<span class="cmd-name">${full}</span>'. ` +
      `Type '<span class="cmd-name">help</span>' for options.`
  );
  scroll();
}

function showHelp() {
  const output = document.querySelector(".output");
  const longest = Math.max(...Object.keys(commandList).map((k) => k.length));
  printLine("Available commands:\n");

  for (const [name, data] of Object.entries(commandList)) {
    const line = document.createElement("div");
    line.classList.add("line");

    // create command
    const cmdSpan = document.createElement("span");
    cmdSpan.classList.add("command");
    cmdSpan.classList.add("command-name");
    cmdSpan.textContent = name;

    const descSpan = document.createElement("span");

    // create aliasses
    const aliasText = data.aliases?.length
      ? ` <span class="muted">(aliases: ${data.aliases
          .map((a) => `${a}`)
          .join(", ")})</span>`
      : "";

    descSpan.innerHTML = data.description + aliasText;
    line.appendChild(cmdSpan);
    line.appendChild(descSpan);
    output.appendChild(line);
  }

  applyDynamicSpacing("command-name", longest);
}

function showWhoami() {
  const birthDate = new Date(1999, 2, 24); // month is 0-indexed (0=Jan)
  const today = new Date();

  // calculate age
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--; // birthday hasnt passed yet this year
  }

  printLine(
    `Hi! I'm Jacco Dammer, a ${age}-year-old Software Engineer @ APG based in The Netherlands 🇳🇱.`
  );
}

function showProjects() {
  printLine("Dummy project — Dummy project to fill in the space");
}

function showContact() {
  const output = document.querySelector(".output");
  const socials = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/jaccodammer",
      label: "linkedin/JaccoDammer",
    },
    {
      name: "GitHub",
      url: "https://github.com/JaccoDammer",
      label: "github/JaccoDammer",
    },
    {
      name: "Email",
      url: "mailto:contact@jekdev.net",
      label: "contact@jekdev.net",
    },
  ];

  const longest = Math.max(...socials.map((s) => s.name.length));

  socials.forEach((s) => {
    const line = document.createElement("div");
    line.classList.add("line");

    // create social
    const name = document.createElement("span");
    name.classList.add("social-name");
    name.textContent = s.name;

    // create label with url ref
    const link = document.createElement("a");
    link.href = s.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = s.label;
    link.classList.add("hover");
    link.classList.add("link");

    line.appendChild(name);
    line.appendChild(link);
    output.appendChild(line);
  });

  applyDynamicSpacing("social-name", longest);
}

function switchTheme(args = []) {
  const themeArg = args[0]?.toLowerCase();
  const html = document.documentElement;
  const currentTheme = html.classList.contains("theme-dark") ? "dark" : "light";

  // No arguments given, show arguments
  if (!themeArg) {
    printLine("Usage: theme [dark|light]");
    return;
  }

  // Invalid argument
  const validThemes = ["dark", "light"];
  if (!validThemes.includes(themeArg)) {
    printLine(
      `<span class="error">Unknown theme:</span> '<span class="accent">${themeArg}</span>'. Use '<span class="command">dark</span>' or '<span class="command">light</span>'.`
    );
    return;
  }

  // Given theme is active theme, dont do anything
  if (themeArg === currentTheme) {
    return;
  }

  // Switch themes
  html.classList.replace(`theme-${currentTheme}`, `theme-${themeArg}`);
  localStorage.setItem("theme", themeArg);
  printLine(`Switched to <span class="command">${themeArg}</span> theme.`);
}

function showSudo() {
  printLine("Permission denied, you’re not root.");
}

function showRm() {
  printLine("Nice try, Hacker.");
}

let cachedVersion = null;
async function showVersion() {
  if (!cachedVersion) {
    try {
      const response = await fetch("./package.json");
      const data = await response.json();
      cachedVersion = data.version;
    } catch {
      cachedVersion = "unknown";
    }
  }
  printLine(`Terminal Portfolio <span class="link">v${cachedVersion}</span>`);
}

function showSkills() {
  const output = document.querySelector(".output");
  const skills = {
    Languages: ["Java", "JavaScript", "SQL", "HTML", "CSS", "Python", "C#"],
    Frameworks: ["Spring", "Spring Boot"],
    Tools: ["Git", "Maven"],
    Databases: ["Oracle", "PostgreSQL", "MongoDB"],
    Other: ["REST APIs", "Microservices", "Linux"],
  };

  const longest = Math.max(...Object.keys(skills).map((key) => key.length));
  Object.entries(skills).forEach(([category, list]) => {
    const line = document.createElement("div");
    line.classList.add("line");

    // create catergory
    const categorySpan = document.createElement("span");
    categorySpan.classList.add("category-name");
    categorySpan.classList.add("accent");
    categorySpan.textContent = category;

    // create skills
    const itemSpan = document.createElement("span");
    itemSpan.textContent = list.join(", ");

    line.appendChild(categorySpan);
    line.appendChild(itemSpan);
    output.appendChild(line);
  });

  applyDynamicSpacing("category-name", longest);
}
