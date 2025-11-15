import { saveTheme, loadTheme as loadStoredTheme } from './storage.js';

const themes = ['light', 'dark', 'auto'];
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

// Update DOM berdasarkan preferensi sistem (khusus mode auto)
function applyAutoTheme() {
    if (prefersDark.matches) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

export function loadTheme() {
    const theme = loadStoredTheme() || 'auto';
    setTheme(theme);
}

export function setTheme(theme) {
    if (!themes.includes(theme)) theme = 'auto';

    saveTheme(theme);

    // Hapus listener terlebih dahulu (mencegah listener dobel)
    prefersDark.removeEventListener('change', applyAutoTheme);

    if (theme === 'auto') {
        applyAutoTheme(); 
        // Pasang lagi listener untuk memantau perubahan sistem
        prefersDark.addEventListener('change', applyAutoTheme);
    } 
    else {
        // Mode manual
        document.documentElement.classList.toggle('dark', theme === 'dark');
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
