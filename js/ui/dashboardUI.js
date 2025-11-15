import { toggleTheme } from '../core/themeManager.js';
import { getAccuracy } from '../core/scoring.js';
import { loadStats } from '../core/storage.js';

export function showDashboard(container, setScreen) {
    const stats = loadStats();
    const accuracy = getAccuracy(stats);
    
    container.innerHTML = `
        <div class="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
            <div class="max-w-md w-full space-y-8 fade-in">
                <!-- Header -->
                <div class="text-center">
                    <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                        🌱 Plant & Project
                    </h1>
                    <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
                        Math Skill Builder
                    </p>
                </div>

                <!-- Quick Stats -->
                <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Statistik Cepat</h2>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="text-center p-3 bg-green-50 dark:bg-gray-700 rounded-lg">
                            <div class="text-2xl font-bold text-green-600 dark:text-green-400">${stats.totalGames}</div>
                            <div class="text-sm text-gray-600 dark:text-gray-300">Permainan</div>
                        </div>
                        <div class="text-center p-3 bg-blue-50 dark:bg-gray-700 rounded-lg">
                            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">${accuracy.toFixed(1)}%</div>
                            <div class="text-sm text-gray-600 dark:text-gray-300">Akurasi</div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="space-y-3">
                    <button id="start-btn" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
                        🎮 Mulai Permainan
                    </button>
                    
                    <button id="stats-btn" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
                        📊 Lihat Statistik
                    </button>
                    
                    <button id="theme-btn" class="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
                        🌙 Ganti Tema
                    </button>
                </div>

                <!-- Footer -->
                <div class="text-center text-gray-500 dark:text-gray-400 text-sm mt-8">
                    Tingkatkan kemampuan matematika Anda dengan cara yang menyenangkan!
                </div>
            </div>
        </div>
    `;

    // Event listeners
    container.querySelector('#start-btn').addEventListener('click', () => setScreen('setup'));
    container.querySelector('#stats-btn').addEventListener('click', () => setScreen('stats'));
    container.querySelector('#theme-btn').addEventListener('click', toggleTheme);
}