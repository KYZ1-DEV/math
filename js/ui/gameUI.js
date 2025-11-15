import { generateQuestion, generateChoices } from '../core/questionGenerator.js';
import { startTimer, stopTimer, formatTime } from '../core/timer.js';
import { calculateScore } from '../core/scoring.js';

let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let currentTimer = null;
let currentQuestionStartTime = 0;

export function showGame(container, setScreen, state) {
    const settings = state.gameSettings;
    
    // Generate semua soal di awal
    questions = [];
    for (let i = 0; i < settings.questionsCount; i++) {
        const operator = settings.operators[Math.floor(Math.random() * settings.operators.length)];
        const question = generateQuestion(settings.level, operator, settings.inputMode, settings);
        questions.push({
            ...question,
            userAnswer: null,
            isCorrect: false,
            timeSpent: 0,
            usedHint: false
        });
    }

    currentQuestionIndex = 0;
    score = 0;
    
    renderGameScreen(container, setScreen, state);
}

function renderGameScreen(container, setScreen, state) {
    const settings = state.gameSettings;
    const currentQuestion = questions[currentQuestionIndex];
    
    container.innerHTML = `
        <div class="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900 p-4">
            <div class="max-w-2xl mx-auto">
                <!-- Header -->
                <div class="flex justify-between items-center mb-6">
                    <div class="text-sm text-gray-600 dark:text-gray-300">
                        Soal ${currentQuestionIndex + 1}/${settings.questionsCount}
                    </div>
                    <div class="text-lg font-bold text-gray-800 dark:text-white">
                        Skor: <span id="current-score">${score}</span>
                    </div>
                </div>

                <!-- Progress Bar -->
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
                    <div class="bg-green-500 h-2 rounded-full progress-bar" 
                         style="width: ${((currentQuestionIndex) / settings.questionsCount) * 100}%"></div>
                </div>

                <!-- Timer -->
                <div class="text-center mb-8">
                    <div id="timer" class="text-3xl font-bold text-gray-800 dark:text-white">
                        ${formatTime(settings.timePerQuestion)}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Waktu Tersisa</div>
                </div>

                <!-- Question Card -->
                <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 fade-in">
                    <div class="text-center mb-2">
                        <span class="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                            ${getOperatorName(currentQuestion.operator)}
                        </span>
                    </div>
                    
                    <div class="text-4xl font-bold text-center text-gray-800 dark:text-white my-8">
                        ${currentQuestion.text}
                    </div>

                    <!-- Answer Area -->
                    <div id="answer-area" class="mt-6">
                        ${settings.inputMode === 'input' ? renderInputArea() : renderChoiceArea(currentQuestion)}
                    </div>
                </div>

                <!-- Hint Button -->
                <div class="text-center">
                    <button id="hint-btn" class="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                        💡 Gunakan Hint (-5 poin)
                    </button>
                </div>
            </div>
        </div>
    `;

    // Start timer untuk soal ini
    startQuestionTimer(container, setScreen, state);
    
    // Setup event listeners
    setupEventListeners(container, setScreen, state);
}

function renderInputArea() {
    return `
        <div class="flex flex-col items-center space-y-4">
            <input type="number" id="answer-input" 
                   class="w-32 p-4 text-3xl text-center border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800"
                   placeholder="?" autofocus>
            <button id="submit-answer-btn" class="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors font-medium">
                Submit Jawaban
            </button>
        </div>
    `;
}

function renderChoiceArea(question) {
    const choices = generateChoices(question.answer);
    
    return `
        <div class="grid grid-cols-2 gap-4">
            ${choices.map((choice, index) => `
                <button class="choice-btn p-4 text-2xl font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-xl transition-all duration-200 transform hover:scale-105"
                        data-answer="${choice}">
                    ${choice}
                </button>
            `).join('')}
        </div>
    `;
}

function startQuestionTimer(container, setScreen, state) {
    const settings = state.gameSettings;
    const timerElement = container.querySelector('#timer');
    currentQuestionStartTime = Date.now();
    
    startTimer(settings.timePerQuestion, 
        (timeLeft) => {
            timerElement.textContent = formatTime(timeLeft);
            
            // Change color when time is running out
            if (timeLeft <= 10) {
                timerElement.classList.add('text-red-500');
            } else if (timeLeft <= 20) {
                timerElement.classList.add('text-orange-500');
            }
        },
        () => {
            // Time's up
            handleAnswer(null, true, container, setScreen, state);
        }
    );
}

function setupEventListeners(container, setScreen, state) {
    const settings = state.gameSettings;
    
    // Input mode
    if (settings.inputMode === 'input') {
        const input = container.querySelector('#answer-input');
        const submitBtn = container.querySelector('#submit-answer-btn');
        
        submitBtn.addEventListener('click', () => {
            const answer = input.value.trim();
            if (answer) {
                handleAnswer(parseInt(answer), false, container, setScreen, state);
            }
        });
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const answer = input.value.trim();
                if (answer) {
                    handleAnswer(parseInt(answer), false, container, setScreen, state);
                }
            }
        });
    } else {
        // Choice mode
        const choiceBtns = container.querySelectorAll('.choice-btn');
        choiceBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const answer = parseInt(btn.getAttribute('data-answer'));
                handleAnswer(answer, false, container, setScreen, state);
            });
        });
    }
    
    // Hint button
    const hintBtn = container.querySelector('#hint-btn');
    hintBtn.addEventListener('click', () => {
        applyHint(container, setScreen, state);
    });
}

function handleAnswer(userAnswer, isTimeout, container, setScreen, state) {
    stopTimer();
    
    const currentQuestion = questions[currentQuestionIndex];
    const timeSpent = Math.floor((Date.now() - currentQuestionStartTime) / 1000);
    const timeLeft = state.gameSettings.timePerQuestion - timeSpent;
    
    currentQuestion.userAnswer = userAnswer;
    currentQuestion.timeSpent = timeSpent;
    
    // Check if answer is correct
    const isCorrect = userAnswer === currentQuestion.answer;
    currentQuestion.isCorrect = isCorrect;
    
    // Calculate score for this question
    const questionScore = calculateScore(isCorrect, timeLeft, state.gameSettings.timePerQuestion, currentQuestion.usedHint, isTimeout);
    score += questionScore;
    
    // Update UI to show result
    showAnswerFeedback(container, isCorrect, userAnswer, currentQuestion.answer, () => {
        // Move to next question or end game
        currentQuestionIndex++;
        
        if (currentQuestionIndex < state.gameSettings.questionsCount) {
            renderGameScreen(container, setScreen, state);
        } else {
            endGame(setScreen, state);
        }
    });
}

function showAnswerFeedback(container, isCorrect, userAnswer, correctAnswer, callback) {
    const answerArea = container.querySelector('#answer-area');
    const originalContent = answerArea.innerHTML;
    
    let feedbackHTML = '';
    
    if (isCorrect) {
        feedbackHTML = `
            <div class="text-center p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl">
                <div class="text-4xl mb-4">🎉</div>
                <div class="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">Benar!</div>
                <div class="text-gray-600 dark:text-gray-300">Jawaban: ${correctAnswer}</div>
            </div>
        `;
    } else {
        feedbackHTML = `
            <div class="text-center p-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl">
                <div class="text-4xl mb-4">😅</div>
                <div class="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Salah</div>
                <div class="text-gray-600 dark:text-gray-300 mb-2">Jawaban kamu: ${userAnswer || 'Tidak dijawab'}</div>
                <div class="text-gray-600 dark:text-gray-300">Jawaban benar: ${correctAnswer}</div>
            </div>
        `;
    }
    
    answerArea.innerHTML = feedbackHTML;
    
    // Disable hint button during feedback
    const hintBtn = container.querySelector('#hint-btn');
    if (hintBtn) hintBtn.disabled = true;
    
    // Wait 2 seconds then continue
    setTimeout(callback, 2000);
}

function applyHint(container, setScreen, state) {
    const currentQuestion = questions[currentQuestionIndex];
    
    if (currentQuestion.usedHint) return;
    
    // Apply penalty
    score = Math.max(0, score - 5);
    currentQuestion.usedHint = true;
    
    // Update score display
    const scoreElement = container.querySelector('#current-score');
    if (scoreElement) scoreElement.textContent = score;
    
    // Disable hint button
    const hintBtn = container.querySelector('#hint-btn');
    if (hintBtn) {
        hintBtn.disabled = true;
        hintBtn.classList.add('hint-used');
    }
    
    // Apply hint based on input mode
    if (state.gameSettings.inputMode === 'input') {
        // Untuk input mode, beri range petunjuk
        const range = Math.max(1, Math.floor(currentQuestion.answer * 0.2));
        alert(`Petunjuk: Jawabannya antara ${currentQuestion.answer - range} dan ${currentQuestion.answer + range}`);
    } else {
        // Untuk choice mode, hapus 2 pilihan salah
        const choiceBtns = container.querySelectorAll('.choice-btn');
        const wrongChoices = Array.from(choiceBtns).filter(btn => 
            parseInt(btn.getAttribute('data-answer')) !== currentQuestion.answer
        );
        
        // Acak dan hapus 2 pilihan salah
        const choicesToRemove = wrongChoices.sort(() => 0.5 - Math.random()).slice(0, 2);
        choicesToRemove.forEach(btn => {
            btn.style.opacity = '0.3';
            btn.disabled = true;
            btn.classList.add('pointer-events-none');
        });
    }
}

function endGame(setScreen, state) {
    state.gameState = {
        finalScore: score,
        questions: questions,
        totalQuestions: state.gameSettings.questionsCount,
        correctAnswers: questions.filter(q => q.isCorrect).length,
        settings: state.gameSettings
    };
    
    setScreen('result');
}

function getOperatorName(operator) {
    const names = {
        '+': 'Penjumlahan',
        '-': 'Pengurangan', 
        '*': 'Perkalian',
        '/': 'Pembagian',
        '': 'Pangkat',
        '%': 'Modulus',
        'random': 'Acak'
    };
    return names[operator] || operator;
}