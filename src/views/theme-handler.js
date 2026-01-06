// views/theme-handler.js

import { ELEMENTS, PATHS, STORAGE_KEYS, THEMES } from '../config/constants.js';

/**
 * Inicializa o gerenciamento de tema
 */
export function initializeTheme() {
  const btnTheme = document.getElementById(ELEMENTS.TOGGLE_THEME);
  const iconTheme = document.getElementById(ELEMENTS.THEME_ICON);
  const root = document.documentElement;
  
  // Aplica tema salvo
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
  
  if (savedTheme === THEMES.DARK) {
    root.setAttribute('data-theme', THEMES.DARK);
    if (iconTheme) iconTheme.src = PATHS.ICON_SUN;
  } else {
    if (iconTheme) iconTheme.src = PATHS.ICON_MOON;
  }
  
  // Configura evento de alternância
  if (btnTheme) {
    btnTheme.addEventListener('click', () => toggleTheme(root, iconTheme));
  }
}

/**
 * Alterna entre tema claro e escuro
 */
function toggleTheme(root, iconTheme) {
  const currentTheme = root.getAttribute('data-theme');
  
  if (currentTheme === THEMES.DARK) {
    root.removeAttribute('data-theme');
    localStorage.removeItem(STORAGE_KEYS.THEME);
    if (iconTheme) iconTheme.src = PATHS.ICON_MOON;
  } else {
    root.setAttribute('data-theme', THEMES.DARK);
    localStorage.setItem(STORAGE_KEYS.THEME, THEMES.DARK);
    if (iconTheme) iconTheme.src = PATHS.ICON_SUN;
  }
}