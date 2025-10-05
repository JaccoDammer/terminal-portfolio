// js/utils.js
export function printLine(textOrHtml) {
  const output = document.querySelector(".output");
  const line = document.createElement("div");
  line.innerHTML = textOrHtml;
  output.appendChild(line);
}

export function printPromptedCommand(command) {
  const output = document.querySelector(".output");

  const line = document.createElement("p");
  line.classList.add("command-line");

  const prompt = document.createElement("span");
  prompt.classList.add("prompt", "no-select");
  prompt.innerHTML = `
    <span class="accent">visitor</span>@<span class="link">portfolio.jekdev.net</span>:~$ 
  `;

  const cmdText = document.createElement("span");
  cmdText.textContent = command;

  line.appendChild(prompt);
  line.appendChild(cmdText);
  output.appendChild(line);
}

export function applyDynamicSpacing(className, ch) {
  // create unique style
  const styleId = `spacing-${className}`;

  // check is style already exists
  let styleEl = document.getElementById(styleId);
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }

  // adds dynamic spacing
  styleEl.textContent = `.${className} { display: inline-block; min-width: ${
    ch + 2
  }ch; }`;
}

export function clearOutput() {
  const output = document.querySelector(".output");
  output.innerHTML = "";

  const input = document.getElementById("command-input");
  if (input) input.focus();
}

export function scroll() {
  const input = document.getElementById("command-input");
  if (input) {
    input.scrollIntoView({ behavior: "smooth", block: "end" });
  }
}
