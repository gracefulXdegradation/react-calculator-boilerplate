import React, { useState, useEffect } from 'react';
import { getMaxDecimalPoints, getDecimalPoints, formatNumber } from './utils';
import Button from './components/button';
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
        if (op === '=') {
            setOp(null);
        }
        if ((op || op === '=') && memo === null) {
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
        if (op === '=') {
            setOp(null);
        }
        if (maxInputReached(screen)) {
            return;
        }
        if ((op || op === '=') && memo === null) {
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
            setOp('=');
        }
    };

    const setOperation = (operation) => {
        if (op && op !== '=') {
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
        if ('1234567890'.includes(parseInt(key, 10))) {
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
            {/* <div className="DCMN-logo">
                <img src="https://dcmn.com/assets/dcmn-logo-redesign-black.svg" alt="DCMN logo" />
            </div> */}

            <input type="text" value={formatNumber(screen)} readOnly data-role="screen" />
            <div className="keyboard">
                <div className="numboard">
                    {'123456789'.split('').map(value => (
                        <Button
                            key={`button_${value}`}
                            onClick={() => handleNumButton(value)}
                            caption={`${value}`}
                        />
                    ))}
                </div>
                <div className="opsboard">
                    <Button caption="+" onClick={() => setOperation('+')} highlighted={op === '+'} />
                    <Button caption="-" onClick={() => setOperation('-')} highlighted={op === '-'} />
                    <Button caption="=" onClick={handleEquals} />
                </div>
                <Button caption="." onClick={handleDotButton} />
                <Button caption="0" onClick={() => handleNumButton(0)} />
                <Button caption="AC" onClick={clear} className="ac" />
            </div>
        </form>
    );
};

export default App;
