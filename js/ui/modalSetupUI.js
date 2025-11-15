// import { generateQuestion } from '../core/questionGenerator.js';

let levelsConfig = {};

// Load config dari JSON
async function loadLevelsConfig() {
    try {
        const response = await fetch('./js/config/levels.json');
        levelsConfig = await response.json();
    } catch (error) {
        console.error('Error loading levels config:', error);
        // Fallback config
        levelsConfig = {
            easy: { operators: ['+', '-'], numberRange: [1, 10], timePerQuestion: 30, questionsCount: 10 },
            medium: { operators: ['+', '-', '*', '/'], numberRange: [1, 20], timePerQuestion: 25, questionsCount: 15 },
            hard: { operators: ['+', '-', '', '/', '*', '%'], numberRange: [1, 100], timePerQuestion: 20, questionsCount: 20 },
            custom: { operators: ['+', '-', '*', '/'], numberRange: [1, 10], timePerQuestion: 30, questionsCount: 10 }
        };
    }
}

export async function setupModal(container, setScreen, state) {
    await loadLevelsConfig();
    
    container.innerHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden scale-in">
                <!-- Header -->
                <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Pengaturan Permainan</h2>
                    <p class="text-gray-600 dark:text-gray-300 mt-1">Pilih level dan sesuaikan pengaturan</p>
                </div>

                <!-- Content -->
                <div class="p-6 overflow-y-auto">
                    <form id="setup-form" class="space-y-6">
                        <!-- Level Selection -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Level Kesulitan
                            </label>
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                                ${['easy', 'medium', 'hard', 'custom'].map(level => `
                                    <label class="relative">
                                        <input type="radio" name="level" value="${level}" ${level === 'medium' ? 'checked' : ''} 
                                               class="sr-only peer">
                                        <div class="cursor-pointer p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-center transition-all peer-checked:border-green-500 peer-checked:bg-green-50 dark:peer-checked:bg-green-900/20">
                                            <div class="font-medium text-gray-800 dark:text-white capitalize">${level}</div>
                                            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                ${levelsConfig[level].questionsCount} soal
                                            </div>
                                        </div>
                                    </label>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Operator Selection -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Jenis Operasi
                            </label>
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-3" id="operator-selection">
                                ${['+', '-', '*', '/', 'random'].map(op => `
                                    <label class="relative">
                                        <input type="checkbox" name="operators" value="${op}" ${op === '+' || op === '-' ? 'checked' : ''}
                                               class="sr-only peer">
                                        <div class="cursor-pointer p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-center transition-all peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20">
                                            <div class="font-medium text-gray-800 dark:text-white text-lg">
                                                ${op === 'random' ? '🎲 Acak' : getOperatorSymbol(op)}
                                            </div>
                                        </div>
                                    </label>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Custom Settings (hidden by default) -->
                        <div id="custom-settings" class="hidden space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Jumlah Soal
                                    </label>
                                    <input type="number" name="questionsCount" min="5" max="50" value="10"
                                           class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Waktu/Soal (detik)
                                    </label>
                                    <input type="number" name="timePerQuestion" min="5" max="120" value="30"
                                           class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white">
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Rentang Angka
                                </label>
                                <div class="grid grid-cols-2 gap-4">
                                    <input type="number" name="minNumber" min="1" max="1000" value="1"
                                           class="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white">
                                    <input type="number" name="maxNumber" min="1" max="1000" value="10"
                                           class="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white">
                                </div>
                            </div>
                        </div>

                        <!-- Input Mode -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Mode Jawaban
                            </label>
                            <div class="grid grid-cols-2 gap-3">
                                <label class="relative">
                                    <input type="radio" name="inputMode" value="choice" checked
                                           class="sr-only peer">
                                    <div class="cursor-pointer p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-center transition-all peer-checked:border-purple-500 peer-checked:bg-purple-50 dark:peer-checked:bg-purple-900/20">
                                        <div class="font-medium text-gray-800 dark:text-white">Pilihan Ganda</div>
                                    </div>
                                </label>
                                <label class="relative">
                                    <input type="radio" name="inputMode" value="input"
                                           class="sr-only peer">
                                    <div class="cursor-pointer p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-center transition-all peer-checked:border-purple-500 peer-checked:bg-purple-50 dark:peer-checked:bg-purple-900/20">
                                        <div class="font-medium text-gray-800 dark:text-white">Input Manual</div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </form>
                </div>

                <!-- Footer -->
                <div class="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                    <div class="flex justify-between space-x-3">
                        <button id="cancel-btn" class="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors font-medium">
                            Batal
                        </button>
                        <button id="start-game-btn" class="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium">
                            Mulai Permainan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Event listeners
    const levelRadios = container.querySelectorAll('input[name="level"]');
    const customSettings = container.querySelector('#custom-settings');
    const form = container.querySelector('#setup-form');
    const cancelBtn = container.querySelector('#cancel-btn');
    const startBtn = container.querySelector('#start-game-btn');

    // Toggle custom settings
    levelRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'custom') {
                customSettings.classList.remove('hidden');
            } else {
                customSettings.classList.add('hidden');
            }
        });
    });

    cancelBtn.addEventListener('click', () => setScreen('dashboard'));
    
    startBtn.addEventListener('click', () => {
        const formData = new FormData(form);
        const level = formData.get('level');
        const operators = formData.getAll('operators');
        const inputMode = formData.get('inputMode');
        
        let settings;
        if (level === 'custom') {
            settings = {
                level: 'custom',
                operators,
                inputMode,
                questionsCount: parseInt(formData.get('questionsCount')),
                timePerQuestion: parseInt(formData.get('timePerQuestion')),
                numberRange: [
                    parseInt(formData.get('minNumber')),
                    parseInt(formData.get('maxNumber'))
                ]
            };
        } else {
            settings = {
                ...levelsConfig[level],
                level,
                operators,
                inputMode
            };
        }

        state.gameSettings = settings;
        setScreen('game');
    });
}

function getOperatorSymbol(operator) {
    const symbols = {
        '+': '+',
        '-': '−',
        '*': '×',
        '/': '÷'
    };
    return symbols[operator] || operator;
}