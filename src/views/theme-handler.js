// views/theme-handler.js

import { ELEMENTS, STORAGE_KEYS, THEMES } from '../config/constants.js';

const MOON_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 30 30">
    <g fill="currentColor">
        <path d="M17 4h-.8c-.4 0-.8.4-.9.8s.1.9.5 1.1C18.4 7.3 20 10 20 13c0 4.4-3.6 8-8 8-2.3 0-4.6-1-6.1-2.8-.3-.3-.8-.4-1.2-.3-.4.2-.6.6-.6 1.1 1 6.4 6.4 11 12.8 11 7.2 0 13-5.8 13-13S24.2 4 17 4"/>
        <path d="M6 13.2c.1.5.5.8 1 .8s.9-.3 1-.8c.5-2.2 1-2.7 3.3-3.3.4 0 .7-.4.7-.9s-.3-.9-.8-1C9 7.5 8.5 7 8 4.8c-.1-.5-.5-.8-1-.8s-.9.3-1 .8C5.5 7 5 7.5 2.8 8c-.5.1-.8.5-.8 1s.3.9.8 1c2.2.5 2.7 1 3.2 3.2m5 .8c-.6 0-1 .4-1 1s.4 1 1 1c0 .6.4 1 1 1s1-.4 1-1c.6 0 1-.4 1-1s-.4-1-1-1c0-.6-.4-1-1-1s-1 .4-1 1"/>
    </g>
</svg>`;

const SUN_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 22 22">
    <g fill="currentColor">
        <path d="M11.003 5a6 6 0 0 0 0 12c3.312 0 6-2.687 6-6s-2.688-6-6-6m0-1c.553 0 1-.443 1-1.01V1.01a1 1 0 1 0-2 0v1.98c0 .558.444 1.01 1 1.01m6.373 2.045 1.4-1.401a1 1 0 1 0-1.414-1.414l-1.4 1.4a1 1 0 0 0-.007 1.421 1 1 0 0 0 1.421-.006m3.621 3.958h-1.98a.999.999 0 1 0 0 2h1.98a1 1 0 1 0 0-2m-3.621 5.959a1 1 0 1 0-1.414 1.414l1.4 1.4a1.003 1.003 0 0 0 1.421.007 1 1 0 0 0-.007-1.421zm-6.373 2.044a1 1 0 0 0-1 1.011v1.98a1.001 1.001 0 1 0 2 0v-1.98c0-.559-.443-1.011-1-1.011M4.63 15.962l-1.4 1.4a1 1 0 1 0 1.414 1.414l1.4-1.4a1.001 1.001 0 1 0-1.414-1.414M4 11.003a1 1 0 0 0-1.01-1H1.009c-.558 0-1.009.444-1.009 1 0 .553.443 1 1.009 1H2.99c.558 0 1.01-.443 1.01-1m.63-4.958A1 1 0 1 0 6.044 4.63l-1.4-1.4A1.001 1.001 0 1 0 3.23 4.644z"/>
    </g>
</svg>`;

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
