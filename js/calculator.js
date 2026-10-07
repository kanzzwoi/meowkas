let calcCurrent = '0';
let calcPrev = '';
let calcOp = null;

function calcInput(k) {
    const expEl = document.getElementById('calcExpression');
    const dispEl = document.getElementById('calcDisplay');

    if (k === 'C') {
        calcCurrent = '0';
        calcPrev = '';
        calcOp = null;
        expEl.innerHTML = '&nbsp;';
        dispEl.innerText = '0';
        return;
    }

    if (k === 'DEL') {
        calcCurrent = calcCurrent.length > 1 ? calcCurrent.slice(0, -1) : '0';
        dispEl.innerText = calcCurrent;
        return;
    }

    if (['+', '-', '*', '/'].includes(k)) {
        calcPrev = calcCurrent;
        calcOp = k;
        calcCurrent = '0';
        expEl.innerText = `${calcPrev} ${k === '*' ? '×' : k === '/' ? '÷' : k}`;
        return;
    }

    if (k === '%') {
        calcCurrent = String(parseFloat(calcCurrent) / 100);
        dispEl.innerText = calcCurrent;
        return;
    }

    if (k === '=') {
        if (calcOp && calcPrev !== '') {
            try {
                const a = parseFloat(calcPrev);
                const b = parseFloat(calcCurrent);
                let res = 0;
                if (calcOp === '+') res = a + b;
                if (calcOp === '-') res = a - b;
                if (calcOp === '*') res = a * b;
                if (calcOp === '/') res = b !== 0 ? a / b : 0;

                expEl.innerText = `${calcPrev} ${calcOp} ${calcCurrent} =`;
                calcCurrent = String(Math.round(res * 100) / 100);
                calcPrev = '';
                calcOp = null;
                dispEl.innerText = calcCurrent;
            } catch (e) {
                dispEl.innerText = '0';
            }
        }
        return;
    }

    if (k === '.') {
        if (!calcCurrent.includes('.')) calcCurrent += '.';
    } else {
        calcCurrent = calcCurrent === '0' ? k : calcCurrent + k;
    }
    dispEl.innerText = calcCurrent;
}
