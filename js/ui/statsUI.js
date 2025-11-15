import { loadStats, loadLeaderboard } from '../core/storage.js';
import { getAccuracy, getOperatorAccuracy } from '../core/scoring.js';

export function showStats(container, setScreen, state) {
    const stats = loadStats();
    const leaderboard = loadLeaderboard();
    const accuracy = getAccuracy(stats);
    
    container.innerHTML = `
        <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-4">
            <div class="max-w-4xl mx-auto space-y-6">
                <!-- Header -->
                <div class="text-center">
                    <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">📊 Statistik</h1>
                    <p class="text-gray-600 dark:text-gray-300">Lihat perkembangan kemampuan matematikamu</p>
                </div>

                <!-- Overall Stats -->
                <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Statistik Keseluruhan</h2>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                            <div class="text-2xl font-bold text-green-600 dark:text-green-400">${stats.totalGames}</div>
                            <div class="text-sm text-gray-600 dark:text-gray-300">Permainan</div>
                        </div>
                        <div class="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">${stats.totalQuestions}</div>
                            <div class="text-sm text-gray-600 dark:text-gray-300">Total Soal</div>
                        </div>
                        <div class="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                            <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">${accuracy.toFixed(1)}%</div>
                            <div class="text-sm text-gray-600 dark:text-gray-300">Akurasi</div>
                        </div>
                        <div class="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                            <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">${stats.bestScore}</div>
                            <div class="text-sm text-gray-600 dark:text-gray-300">Skor Terbaik</div>
                        </div>
                    </div>
                </div>

                <!-- Operator Performance -->
                <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Performansi per Operasi</h2>
                    <div class="space-y-4">
                        ${renderOperatorStats(stats)}
                    </div>
                </div>

                <!-- Leaderboard -->
                <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Papan Skor</h2>
                    <div class="space-y-3">
                        ${renderLeaderboard(leaderboard)}
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="text-center">
                    <button id="back-btn" class="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-colors font-medium">
                        ← Kembali ke Dashboard
                    </button>
                </div>
            </div>
        </div>
    `;

    container.querySelector('#back-btn').addEventListener('click', () => setScreen('dashboard'));
}

function renderOperatorStats(stats) {
    const operators = ['+', '-', '*', '/'];
    let html = '';
    
    operators.forEach(op => {
        const accuracy = getOperatorAccuracy(stats, op);
        const operatorNames = {
            '+': 'Penjumlahan',
            '-': 'Pengurangan',
            '*': 'Perkalian',
            '/': 'Pembagian'
        };
        
        html += `
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <span class="text-blue-600 dark:text-blue-400 font-medium">${op}</span>
                    </div>
                    <span class="text-gray-700 dark:text-gray-300">${operatorNames[op]}</span>
                </div>
                <div class="flex items-center space-x-3">
                    <div class="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div class="bg-green-500 h-2 rounded-full" style="width: ${accuracy}%"></div>
                    </div>
                    <span class="text-gray-600 dark:text-gray-400 w-12 text-right">${accuracy.toFixed(1)}%</span>
                </div>
            </div>
        `;
    });
    
    return html || '<p class="text-gray-500 text-center">Belum ada data operasi</p>';
}

function renderLeaderboard(leaderboard) {
    if (leaderboard.length === 0) {
        return '<p class="text-gray-500 text-center">Belum ada data leaderboard</p>';
    }
    
    return leaderboard.slice(0, 10).map((entry, index) => `
        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="flex items-center space-x-3">
                <div class="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    ${index + 1}
                </div>
                <div>
                    <div class="font-medium text-gray-800 dark:text-white">${entry.score} poin</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">${entry.correct}/${entry.total} benar • ${entry.level}</div>
                </div>
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">${entry.time}</div>
        </div>
    `).join('');
}