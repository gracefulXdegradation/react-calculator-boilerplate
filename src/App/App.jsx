import React, { useState, useEffect } from 'react';
import _range from 'lodash/range';
import { getMaxDecimalPoints, formatNumber } from './utils';
import './app.scss';

const operations = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
};
const calc = (numA, numB, op) => {
    const result = operations[op](parseFloat(numA), parseFloat(numB));

    return result.toFixed(getMaxDecimalPoints(numA, numB));
};

const maxInputReached = num => num.replace('.', '').length >= 9;

const App = () => {
    const [screen, setScreen] = useState('0');
    const [memo, setMemo] = useState(null);
    const [op, setOp] = useState(null);

    const handleNumButton = (value) => {
        if (op && memo === null) {
            setMemo(screen);
            setScreen(`${value}`);
        } else {
            if (maxInputReached(screen)) {
                return;
            }
            const newScreen = `${screen}${value}` * 1; //  x1 to get rid of a leading zero

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
        }
        if (!screen.includes('.')) {
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
        <div>
            <input type="text" value={formatNumber(screen)} readOnly="true" />
            {_range(10).map(value => (
                <button
                    type="button"
                    className="button"
                    key={`button-${value}`}
                    onClick={() => handleNumButton(value)}
                >
                    {value}
                </button>
            ))}
            <button type="button" className="button" onClick={handleDotButton}>.</button>
            <button type="button" className="button" onClick={() => setOperation('+')}>+</button>
            <button type="button" className="button" onClick={() => setOperation('-')}>-</button>
            <button type="button" className="button" onClick={handleEquals}>=</button>
            <button type="button" className="button" onClick={clear}>AC</button>
        </div>
    );
};

export default App;
