// views/theme-handler.js

import { ELEMENTS, STORAGE_KEYS, THEMES } from '../config/constants.js';

const MOON_ICON = `
  <path fill="currentColor" d="M17 4h-0.8c-0.4 0 -0.8 0.4 -0.9 0.8s0.1 0.9 0.5 1.1C18.4 7.3 20 10 20 13c0 4.4 -3.6 8 -8 8 -2.3 0 -4.6 -1 -6.1 -2.8 -0.3 -0.3 -0.8 -0.4 -1.2 -0.3 -0.4 0.2 -0.6 0.6 -0.6 1.1C5.1 25.4 10.5 30 16.9 30c7.2 0 13 -5.8 13 -13S24.2 4 17 4"/>
  <path fill="currentColor" d="M6 13.2c0.1 0.5 0.5 0.8 1 0.8s0.9 -0.3 1 -0.8c0.5 -2.2 1 -2.7 3.3 -3.3 0.4 0 0.7 -0.4 0.7 -0.9s-0.3 -0.9 -0.8 -1C9 7.5 8.5 7 8 4.8c-0.1 -0.5 -0.5 -0.8 -1 -0.8s-0.9 0.3 -1 0.8C5.5 7 5 7.5 2.8 8c-0.5 0.1 -0.8 0.5 -0.8 1s0.3 0.9 0.8 1c2.2 0.5 2.7 1 3.2 3.2"/>
  <path fill="currentColor" d="M11 14c-0.6 0 -1 0.4 -1 1s0.4 1 1 1c0 0.6 0.4 1 1 1s1 -0.4 1 -1c0.6 0 1 -0.4 1 -1s-0.4 -1 -1 -1c0 -0.6 -0.4 -1 -1 -1s-1 0.4 -1 1"/>
  `;

const SUN_ICON = `
  <path fill="currentColor" d="M11.003 5a6 6 0 0 0 0 12c3.312 0 6 -2.687 6 -6S14.315 5 11.003 5m0 10"/>
  <path fill="currentColor" d="M11.003 4c0.553 0 1 -0.443 1 -1.01V1.01a1 1 0 1 0 -2 0v1.98c0 0.558 0.444 1.01 1 1.01"/>
  <path fill="currentColor" d="m17.376 6.045 1.4 -1.401a1 1 0 1 0 -1.414 -1.414l-1.4 1.4a1 1 0 0 0 -0.007 1.421 1 1 0 0 0 1.421 -0.006"/>
  <path fill="currentColor" d="M20.997 10.003H19.017a0.999 0.999 0 1 0 0 2h1.98a1 1 0 1 0 0 -2"/>
  <path fill="currentColor" d="M17.376 15.962a1 1 0 1 0 -1.414 1.414l1.4 1.4a1.003 1.003 0 0 0 1.421 0.007 1 1 0 0 0 -0.007 -1.421z"/>
  <path fill="currentColor" d="M11.003 18.006a1 1 0 0 0 -1 1.011v1.98a1.001 1.001 0 1 0 2 0V19.017c0 -0.559 -0.443 -1.011 -1 -1.011"/>
  <path fill="currentColor" d="m4.63 15.962 -1.4 1.4a1 1 0 1 0 1.414 1.414l1.4 -1.4a1.001 1.001 0 1 0 -1.414 -1.414"/>
  <path fill="currentColor" d="M4 11.003a1 1 0 0 0 -1.01 -1H1.009c-0.558 0 -1.009 0.444 -1.009 1 0 0.553 0.443 1 1.009 1h1.981c0.558 0 1.01 -0.443 1.01 -1"/>
  <path fill="currentColor" d="M4.63 6.045a1 1 0 1 0 1.414 -1.415l-1.4 -1.4a1.001 1.001 0 1 0 -1.414 1.414z"/>
`;

export function initializeTheme() {
    const btnTheme = document.getElementById(ELEMENTS.TOGGLE_THEME);
    if (!btnTheme) return;

    const icon = btnTheme.querySelector('svg');
    const root = document.documentElement;

    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    const isDark = savedTheme === THEMES.DARK;

    applyTheme(root, icon, isDark);

    btnTheme.addEventListener('click', () => {
        const nowDark = !root.hasAttribute('data-theme');
        applyTheme(root, icon, nowDark);
    });
}

function applyTheme(root, icon, dark) {
    if (dark) {
        root.setAttribute('data-theme', THEMES.DARK);
        localStorage.setItem(STORAGE_KEYS.THEME, THEMES.DARK);
        icon.innerHTML = SUN_ICON;
    } else {
        root.removeAttribute('data-theme');
        localStorage.removeItem(STORAGE_KEYS.THEME);
        icon.innerHTML = MOON_ICON;
    }
}
