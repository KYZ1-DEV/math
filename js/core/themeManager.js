import { saveTheme, loadTheme as loadStoredTheme } from './storage.js';

const themes = ['light', 'dark', 'auto'];
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function handleSystemChange() {
    applyAutoTheme();
}

function applyAutoTheme() {
    const dark = prefersDark.matches;
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
}

export function loadTheme() {
    const theme = loadStoredTheme() || 'auto';
    setTheme(theme);
}

export function setTheme(theme) {
    if (!themes.includes(theme)) theme = 'auto';

    saveTheme(theme);

    // Matikan listener dulu
    prefersDark.removeEventListener('change', handleSystemChange);

    if (theme === 'auto') {
        applyAutoTheme();
        prefersDark.addEventListener('change', handleSystemChange);
    } else {
        const isDark = theme === 'dark';
        document.documentElement.classList.toggle('dark', isDark);
        document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    }
}

export function toggleTheme() {
    const current = loadStoredTheme() || 'auto';
    const next =
        current === 'light' ? 'dark' :
        current === 'dark'  ? 'auto' :
        'light';
    setTheme(next);
}

export function getCurrentTheme() {
    return loadStoredTheme() || 'auto';
}
