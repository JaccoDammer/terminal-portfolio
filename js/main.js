// js/main.js
import { handleCommand } from "./commands.js";

const input = document.getElementById("command-input");

document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const savedTheme = localStorage.getItem("theme") || "dark";
  html.classList.add(`theme-${savedTheme}`);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleCommand(input.value);
      input.value = "";
    }
  });

  input.focus();
});
