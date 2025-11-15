export function calculateScore(isCorrect, timeLeft, totalTime, usedHint = false, timeout = false) {
    let score = 0;
    
    if (isCorrect) {
        // Base score untuk jawaban benar
        score += 10;
        
        // Bonus untuk waktu tersisa
        if (timeLeft > 0) {
            score += timeLeft * 2;
        }
        
        // Penalti jika menggunakan hint
        if (usedHint) {
            score -= 5;
        }
    } else if (timeout) {
        // Penalti untuk timeout
        score -= 5;
    }
    // Untuk jawaban salah: score = 0 (default)
    
    return Math.max(score, 0); // Pastikan tidak negatif
}

export function updateStats(stats, gameResult) {
    const newStats = { ...stats };
    
    // Initialize jika belum ada
    if (!newStats.totalGames) newStats.totalGames = 0;
    if (!newStats.totalQuestions) newStats.totalQuestions = 0;
    if (!newStats.correctAnswers) newStats.correctAnswers = 0;
    if (!newStats.totalScore) newStats.totalScore = 0;
    if (!newStats.bestScore) newStats.bestScore = 0;
    if (!newStats.operatorStats) newStats.operatorStats = {};
    if (!newStats.averageSpeed) newStats.averageSpeed = 0;
    
    // Update stats umum
    newStats.totalGames++;
    newStats.totalQuestions += gameResult.totalQuestions;
    newStats.correctAnswers += gameResult.correctAnswers;
    newStats.totalScore += gameResult.finalScore;
    
    // Update best score
    if (gameResult.finalScore > newStats.bestScore) {
        newStats.bestScore = gameResult.finalScore;
    }
    
    // Update stats per operator
    gameResult.questions.forEach(q => {
        const op = q.operator;
        if (!newStats.operatorStats[op]) {
            newStats.operatorStats[op] = { attempted: 0, correct: 0 };
        }
        newStats.operatorStats[op].attempted++;
        if (q.isCorrect) {
            newStats.operatorStats[op].correct++;
        }
    });
    
    // Update average speed (waktu per soal)
    const totalTime = gameResult.questions.reduce((sum, q) => sum + q.timeSpent, 0);
    const avgTime = totalTime / gameResult.questions.length;
    newStats.averageSpeed = (newStats.averageSpeed * (newStats.totalGames - 1) + avgTime) / newStats.totalGames;
    
    return newStats;
}

export function getAccuracy(stats) {
    if (!stats.totalQuestions || stats.totalQuestions === 0) return 0;
    return (stats.correctAnswers / stats.totalQuestions) * 100;
}

export function getOperatorAccuracy(stats, operator) {
    if (!stats.operatorStats || !stats.operatorStats[operator] || stats.operatorStats[operator].attempted === 0) {
        return 0;
    }
    return (stats.operatorStats[operator].correct / stats.operatorStats[operator].attempted) * 100;
}