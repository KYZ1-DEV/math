import {updateStats} from '../core/scoring.js';
import { loadStats, saveStats as saveStatsToStorage, saveLeaderboardEntry  } from '../core/storage.js';

export function showResult(container, setScreen, state) {
    const { gameState } = state;
    const { finalScore, questions, totalQuestions, correctAnswers, settings } = gameState;
    
    // Update stats
    const stats = loadStats();
    const newStats = updateStats(stats, gameState);
    saveStatsToStorage(newStats);
    
    // Save to leaderboard
    saveLeaderboardEntry({
        score: finalScore,
        correct: correctAnswers,
        total: totalQuestions,
        level: settings.level,
        operators: settings.operators.join(', '),
        time: new Date().toLocaleDateString('id-ID')
    });
    
    const accuracy = (correctAnswers / totalQuestions) * 100;
    const averageTime = questions.reduce((sum, q) => sum + q.timeSpent, 0) / totalQuestions;
    
    container.innerHTML = `
        <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
            <div class="max-w-md w-full fade-in">
                <!-- Result Card -->
                <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
                    <!-- Header -->
                    <div class="mb-6">
                        <div class="text-6xl mb-4">${getResultEmoji(accuracy)}</div>
                        <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                            Permainan Selesai!
                        </h1>
                        <p class="text-gray-600 dark:text-gray-300">
                            ${getResultMessage(accuracy)}
                        </p>
                    </div>

                    <!-- Score -->
                    <div class="bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl p-6 mb-6 text-white">
                        <div class="text-sm opacity-80">Skor Akhir</div>
                        <div class="text-5xl font-bold my-2">${finalScore}</div>
                        <div class="text-sm opacity-80">Poin</div>
                    </div>

                    <!-- Stats Grid -->
                    <div class="grid grid-cols-3 gap-4 mb-6">
                        <div class="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div class="text-xl font-bold text-gray-800 dark:text-white">${correctAnswers}/${totalQuestions}</div>
                            <div class="text-xs text-gray-600 dark:text-gray-300">Benar</div>
                        </div>
                        <div class="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div class="text-xl font-bold text-gray-800 dark:text-white">${accuracy.toFixed(1)}%</div>
                            <div class="text-xs text-gray-600 dark:text-gray-300">Akurasi</div>
                        </div>
                        <div class="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div class="text-xl font-bold text-gray-800 dark:text-white">${averageTime.toFixed(1)}s</div>
                            <div class="text-xs text-gray-600 dark:text-gray-300">Rata-rata</div>
                        </div>
                    </div>

                    <!-- Operator Breakdown -->
                    <div class="mb-6">
                        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Performansi per Operasi</h3>
                        <div class="space-y-2">
                            ${getOperatorBreakdown(questions)}
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="space-y-3">
                        <button id="play-again-btn" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-colors">
                            🎮 Main Lagi
                        </button>
                        <button id="stats-btn" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-colors">
                            📊 Lihat Statistik
                        </button>
                        <button id="dashboard-btn" class="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl transition-colors">
                            🏠 Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Event listeners
    container.querySelector('#play-again-btn').addEventListener('click', () => setScreen('setup'));
    container.querySelector('#stats-btn').addEventListener('click', () => setScreen('stats'));
    container.querySelector('#dashboard-btn').addEventListener('click', () => setScreen('dashboard'));
}

function getResultEmoji(accuracy) {
    if (accuracy >= 90) return '🏆';
    if (accuracy >= 80) return '🎯';
    if (accuracy >= 70) return '👍';
    if (accuracy >= 60) return '😊';
    if (accuracy >= 50) return '😐';
    return '😅';
}

function getResultMessage(accuracy) {
    if (accuracy >= 90) return 'Luar biasa! Kamu jenius matematika!';
    if (accuracy >= 80) return 'Hebat! Kemampuan matematikamu sangat baik.';
    if (accuracy >= 70) return 'Bagus! Terus berlatih untuk hasil lebih baik.';
    if (accuracy >= 60) return 'Cukup baik. Tingkatkan lagi ya!';
    if (accuracy >= 50) return 'Lumayan. Butuh lebih banyak latihan.';
    return 'Jangan menyerah! Terus berlatih!';
}

function getOperatorBreakdown(questions) {
    const operatorStats = {};
    
    questions.forEach(q => {
        if (!operatorStats[q.operator]) {
            operatorStats[q.operator] = { total: 0, correct: 0 };
        }
        operatorStats[q.operator].total++;
        if (q.isCorrect) {
            operatorStats[q.operator].correct++;
        }
    });
    
    return Object.entries(operatorStats).map(([op, stats]) => {
        const accuracy = (stats.correct / stats.total) * 100;
        const operatorNames = {
            '+': 'Penjumlahan',
            '-': 'Pengurangan',
            '*': 'Perkalian', 
            '/': 'Pembagian',
            '': 'Pangkat',
            '%': 'Modulus'
        };
        
        return `
            <div class="flex justify-between items-center text-sm">
                <span class="text-gray-700 dark:text-gray-300">${operatorNames[op] || op}</span>
                <div class="flex items-center space-x-2">
                    <div class="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div class="bg-green-500 h-2 rounded-full" style="width: ${accuracy}%"></div>
                    </div>
                    <span class="text-gray-600 dark:text-gray-400 w-10 text-right">${accuracy.toFixed(0)}%</span>
                </div>
            </div>
        `;
    }).join('');
}