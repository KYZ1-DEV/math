import { saveTheme, loadTheme as loadStoredTheme } from './storage.js';

const themes = ['light', 'dark', 'auto'];
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

// Listener harus unik, TIDAK didefinisikan ulang
function handleSystemChange() {
    applyAutoTheme();
}

function applyAutoTheme() {
    document.documentElement.classList.toggle('dark', prefersDark.matches);
}

export function loadTheme() {
    const theme = loadStoredTheme() || 'auto';
    setTheme(theme);
}

export function setTheme(theme) {
    if (!themes.includes(theme)) theme = 'auto';

    saveTheme(theme);

    // Putuskan mode auto dulu (hapus listener)
    prefersDark.removeEventListener('change', handleSystemChange);

    if (theme === 'auto') {
        applyAutoTheme();
        // Pasang listener untuk mengikuti sistem
        prefersDark.addEventListener('change', handleSystemChange);
    } else {
        // Mode manual override sistem
        const isDark = theme === 'dark';
        document.documentElement.classList.toggle('dark', isDark);
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
