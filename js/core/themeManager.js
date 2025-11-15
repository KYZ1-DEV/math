import { saveTheme, loadTheme as loadStoredTheme } from './storage.js';

const themes = ['light', 'dark', 'auto'];

export function loadTheme() {
    const theme = loadStoredTheme();
    setTheme(theme);
}

export function setTheme(theme) {
    if (!themes.includes(theme)) theme = 'auto';
    
    saveTheme(theme);
    
    if (theme === 'auto') {
        // Gunakan preferensi sistem
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    } else if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

export function toggleTheme() {
    const current = loadStoredTheme();
    const next = current === 'light' ? 'dark' : current === 'dark' ? 'auto' : 'light';
    setTheme(next);
}

export function getCurrentTheme() {
    return loadStoredTheme();
}