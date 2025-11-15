export function generateQuestion(level, operator, type, customSettings = null) {
    let num1, num2, answer;
    
    // Tentukan rentang angka berdasarkan level
    let range;
    if (customSettings && customSettings.numberRange) {
        range = customSettings.numberRange;
    } else {
        switch (level) {
            case 'easy': range = [1, 10]; break;
            case 'medium': range = [1, 20]; break;
            case 'hard': range = [1, 100]; break;
            default: range = [1, 10];
        }
    }

    // Generate angka acak
    num1 = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
    num2 = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];

    // Jika operator random, pilih secara acak
    let selectedOperator = operator;
    if (operator === 'random') {
        const operators = ['+', '-', '*', '/'];
        selectedOperator = operators[Math.floor(Math.random() * operators.length)];
    }

    // Generate soal berdasarkan operator
    switch (selectedOperator) {
        case '+':
            answer = num1 + num2;
            break;
        case '-':
            // Pastikan hasil tidak negatif
            if (num1 < num2) [num1, num2] = [num2, num1];
            answer = num1 - num2;
            break;
        case '*':
            // Untuk perkalian, batasi angka agar tidak terlalu besar
            if (level === 'easy') {
                num1 = Math.floor(Math.random() * 5) + 1;
                num2 = Math.floor(Math.random() * 5) + 1;
            } else if (level === 'medium') {
                num1 = Math.floor(Math.random() * 10) + 1;
                num2 = Math.floor(Math.random() * 10) + 1;
            }
            answer = num1 * num2;
            break;
        case '/':
            // Untuk pembagian, pastikan hasilnya bilangan bulat
            num2 = Math.floor(Math.random() * 10) + 1;
            num1 = num2 * (Math.floor(Math.random() * 10) + 1);
            answer = num1 / num2;
            break;
    }

    const text = `${num1} ${getOperatorSymbol(selectedOperator)} ${num2} = ?`;

    return {
        text,
        answer,
        operator: selectedOperator,
        numbers: [num1, num2]
    };
}

export function generateChoices(correctAnswer, count = 4) {
    const choices = [correctAnswer];
    
    // Generate pilihan yang salah
    while (choices.length < count) {
        // Variasi kesalahan: ±1, ±2, ±5, ±10, atau hasil operasi yang mirip
        const variation = [1, 2, 5, 10][Math.floor(Math.random() * 4)];
        const direction = Math.random() > 0.5 ? 1 : -1;
        let wrongAnswer = correctAnswer + (variation * direction);
        
        // Pastikan tidak negatif dan tidak duplikat
        if (wrongAnswer > 0 && !choices.includes(wrongAnswer)) {
            choices.push(wrongAnswer);
        }
    }

    // Acak urutan pilihan
    return choices.sort(() => Math.random() - 0.5);
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