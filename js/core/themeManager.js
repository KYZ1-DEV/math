const themes = ['light', 'dark', 'auto'];
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function applyAutoTheme() {
  const isDark = prefersDark.matches;
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
}

export function loadTheme() {
  const theme = localStorage.getItem('theme') || 'auto';
  setTheme(theme);
}

export function setTheme(theme) {
  if (!themes.includes(theme)) theme = 'auto';
  localStorage.setItem('theme', theme);

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

function handleSystemChange() {
  applyAutoTheme();
}

export function toggleTheme() {
  const current = localStorage.getItem('theme') || 'auto';
  const next = current === 'light' ? 'dark' : current === 'dark' ? 'auto' : 'light';
  setTheme(next);
}

export function getCurrentTheme() {
  return localStorage.getItem('theme') || 'auto';
}
