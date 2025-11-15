import { loadTheme } from './core/themeManager.js';
import { setupModal } from './ui/modalSetupUI.js';
import { showDashboard } from './ui/dashboardUI.js';
import { showGame } from './ui/gameUI.js';
import { showResult } from './ui/resultUI.js';
import { showStats } from './ui/statsUI.js';

// State global aplikasi
const state = {
    currentScreen: 'dashboard', // dashboard, game, result, stats
    gameSettings: null,
    gameState: null,
    userStats: null
};

// Fungsi untuk mengganti screen
function setScreen(screen) {
    state.currentScreen = screen;
    render();
}

function render() {
    const app = document.getElementById('app');
    app.innerHTML = '';

    switch (state.currentScreen) {
        case 'dashboard':
            showDashboard(app, setScreen);
            break;
        case 'setup':
            setupModal(app, setScreen, state);
            break;
        case 'game':
            showGame(app, setScreen, state);
            break;
        case 'result':
            showResult(app, setScreen, state);
            break;
        case 'stats':
            showStats(app, setScreen, state);
            break;
        default:
            showDashboard(app, setScreen);
    }
}

// Inisialisasi aplikasi
loadTheme();
render();

// Expose state untuk modul lain jika perlu
window.state = state;