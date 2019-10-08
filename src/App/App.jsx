import React, { useState } from 'react';
import './app.scss';

const operations = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
};

const getDecimalPoints = num => (`${num}`.split('.')[1] || '').length;
const getMaxDecimalPoints = (numA, numB) => Math.max(getDecimalPoints(numA), getDecimalPoints(numB));
const execute = (numA, numB, op) => {
    const result = operations[op](parseFloat(numA), parseFloat(numB));

    return result.toFixed(getMaxDecimalPoints(numA, numB));
};
const formatNumber = (num) => {
    const hasDot = num.includes('.');
    const [int, dec] = num.split('.');
    const formattedInt = int.split('').reverse().reduce(
        (acc, val, i) => acc + (i > 0 && i % 3 === 0 ? ' ' : '') + val, '',
    ).split('')
        .reverse()
        .join('');

    return formattedInt + (hasDot ? `.${dec}` : '');
};

const maxInputReached = num => num.replace('.', '').length >= 9;

const App = () => {
    const [screen, setScreen] = useState('0');
    const [memo, setMemo] = useState(null);
    const [op, setOp] = useState(null);

    const pushNumButton = (value) => {
        if (op && memo === null) {
            setMemo(screen);
            setScreen(`${value}`);
        } else {
            if (maxInputReached(screen)) {
                return;
            }
            const newScreen = `${screen}${value}` * 1; // get rid of leading spaces

            setScreen(`${newScreen}`);
        }
    };

    const pushDotButton = () => {
        if (maxInputReached(screen)) {
            return;
        }
        if (op && memo === null) {
            setMemo(screen);
            setScreen('0.');
        }
        if (!screen.includes('.')) {
            setScreen(`${screen}.`);
        }
    };

    const pushEquals = () => {
        if (op) {
            const result = execute(memo || 0, screen, op);

            setScreen(`${result}`);
            setMemo(null);
            setOp(null);
        }
    };

    const setOperation = (operation) => {
        if (op) {
            pushEquals();
        }
        setOp(operation);
    };

    const clear = () => {
        setScreen('0');
        setMemo(null);
        setOp(null);
    };

    return (
        <div>
            <div>{formatNumber(screen)}</div>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(value => (
                <button
                    type="button"
                    className="button"
                    key={`button-${value}`}
                    onClick={() => pushNumButton(value)}
                >
                    {value}
                </button>
            ))}
            <button type="button" className="button" onClick={pushDotButton}>.</button>
            <button type="button" className="button" onClick={() => setOperation('+')}>+</button>
            <button type="button" className="button" onClick={() => setOperation('-')}>-</button>
            <button type="button" className="button" onClick={pushEquals}>=</button>
            <button type="button" className="button" onClick={clear}>AC</button>
        </div>
    );
};

export default App;
