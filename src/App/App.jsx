import React, { useState, useEffect } from 'react';
import _range from 'lodash/range';
import { getMaxDecimalPoints, getDecimalPoints, formatNumber } from './utils';
import './app.scss';

const operations = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
};
const calc = (numA, numB, op) => {
    const result = operations[op](parseFloat(numA), parseFloat(numB));

    return result.toFixed(getMaxDecimalPoints(numA, numB)) * 1; // cut off trailing zeros
};

const maxInputReached = num => num.replace('.', '').length >= 9;

const App = () => {
    const [screen, setScreen] = useState('0');
    const [memo, setMemo] = useState(null);
    const [op, setOp] = useState(null);

    const handleNumButton = (num) => {
        if (op && memo === null) {
            setMemo(screen);
            setScreen(`${num}`);
        } else {
            if (maxInputReached(screen)) {
                return;
            }
            const newValue = `${screen}${num}`;
            const newScreen = parseFloat(newValue).toFixed(getDecimalPoints(newValue)); // get rid of a leading zero

            setScreen(`${newScreen}`);
        }
    };

    const handleDotButton = () => {
        if (maxInputReached(screen)) {
            return;
        }
        if (op && memo === null) {
            setMemo(screen);
            setScreen('0.');
        } else if (!screen.includes('.')) {
            setScreen(`${screen}.`);
        }
    };

    const handleEquals = () => {
        if (op) {
            const result = calc(memo || 0, screen, op);

            setScreen(`${result}`);
            setMemo(null);
            setOp(null);
        }
    };

    const setOperation = (operation) => {
        if (op) {
            handleEquals();
        }
        setOp(operation);
    };

    const clear = () => {
        setScreen('0');
        setMemo(null);
        setOp(null);
    };

    const handleKeyPress = ({ key }) => {
        if (_range(10).includes(parseInt(key, 10))) {
            handleNumButton(key);
        } else if ('+-'.includes(key)) {
            setOperation(key);
        } else {
            switch (key) {
            case '.':
                handleDotButton();
                break;
            case '=':
                handleEquals();
                break;
            case ' ':
                clear();
                break;
            default:
            }
        }
    };

    useEffect(() => {
        document.body.addEventListener('keypress', handleKeyPress);
        return () => document.body.removeEventListener('keypress', handleKeyPress);
    });

    return (
        <form>
            <div className="DCMN-logo">
                <img src="https://dcmn.com/assets/dcmn-logo-redesign-black.svg" alt="DCMN logo" />
            </div>

            <input type="text" value={formatNumber(screen)} readOnly data-role="screen" />
            {_range(10).map(value => (
                <button
                    type="button"
                    key={`button_${value}`}
                    data-role={`button_${value}`}
                    onClick={() => handleNumButton(value)}
                >
                    {value}
                </button>
            ))}
            <button type="button" data-role="button_." onClick={handleDotButton}>.</button>
            <button type="button" data-role="button_+" onClick={() => setOperation('+')}>+</button>
            <button type="button" data-role="button_-" onClick={() => setOperation('-')}>-</button>
            <button type="button" data-role="button_=" onClick={handleEquals}>=</button>
            <button type="button" data-role="button_ac" onClick={clear}>AC</button>
        </form>
    );
};

export default App;
