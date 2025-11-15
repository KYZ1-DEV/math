const STORAGE_KEYS = {
    STATS: 'mathGame_stats',
    THEME: 'mathGame_theme',
    LEADERBOARD: 'mathGame_leaderboard'
};

export function saveStats(stats) {
    try {
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
        return true;
    } catch (error) {
        console.error('Error saving stats:', error);
        return false;
    }
}

export function loadStats() {
    try {
        const stats = localStorage.getItem(STORAGE_KEYS.STATS);
        return stats ? JSON.parse(stats) : {
            totalGames: 0,
            totalQuestions: 0,
            correctAnswers: 0,
            totalScore: 0,
            bestScore: 0,
            operatorStats: {},
            averageSpeed: 0
        };
    } catch (error) {
        console.error('Error loading stats:', error);
        return {
            totalGames: 0,
            totalQuestions: 0,
            correctAnswers: 0,
            totalScore: 0,
            bestScore: 0,
            operatorStats: {},
            averageSpeed: 0
        };
    }
}

export function saveLeaderboardEntry(entry) {
    try {
        const leaderboard = loadLeaderboard();
        leaderboard.push({
            ...entry,
            id: Date.now().toString(),
            date: new Date().toISOString()
        });
        
        // Sort by score descending dan simpan max 50 entries
        leaderboard.sort((a, b) => b.score - a.score);
        const trimmedLeaderboard = leaderboard.slice(0, 50);
        
        localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(trimmedLeaderboard));
        return true;
    } catch (error) {
        console.error('Error saving leaderboard entry:', error);
        return false;
    }
}

export function loadLeaderboard() {
    try {
        const leaderboard = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
        return leaderboard ? JSON.parse(leaderboard) : [];
    } catch (error) {
        console.error('Error loading leaderboard:', error);
        return [];
    }
}

export function saveTheme(theme) {
    try {
        localStorage.setItem(STORAGE_KEYS.THEME, theme);
        return true;
    } catch (error) {
        console.error('Error saving theme:', error);
        return false;
    }
}

export function loadTheme() {
    try {
        return localStorage.getItem(STORAGE_KEYS.THEME) || 'auto';
    } catch (error) {
        console.error('Error loading theme:', error);
        return 'auto';
    }
}