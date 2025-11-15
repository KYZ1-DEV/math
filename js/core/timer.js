let currentTimer = null;

export function startTimer(duration, onTick, onComplete) {
    // Clear existing timer
    if (currentTimer) {
        clearInterval(currentTimer);
    }
    
    let timeLeft = duration;
    
    // Immediate first tick
    onTick(timeLeft);
    
    currentTimer = setInterval(() => {
        timeLeft--;
        onTick(timeLeft);
        
        if (timeLeft <= 0) {
            clearInterval(currentTimer);
            currentTimer = null;
            onComplete();
        }
    }, 1000);
    
    return currentTimer;
}

export function stopTimer() {
    if (currentTimer) {
        clearInterval(currentTimer);
        currentTimer = null;
    }
}

export function pauseTimer() {
    // Untuk implementasi jeda antar soal
    stopTimer();
}

export function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}