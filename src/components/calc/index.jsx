import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { getMaxDecimalPoints, getDecimalPoints, formatOutput } from '../../utils';
import Button from '../button';

const operations = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
};
const calc = (numA, numB, op) => {
    const result = operations[op](parseFloat(numA), parseFloat(numB));

    return result.toFixed(getMaxDecimalPoints(numA, numB)) * 1; // cut off trailing zeros
};

const maxInputReached = num => num.replace('.', '').length >= 9;

const animateKeyPress = el => el.animate([{ transform: 'scale(1)' },
    { transform: 'scale(0.8)', offset: 0.5 },
    { transform: 'scale(0.8)', offset: 0.7 },
    { transform: 'scale(1)' }],
{ duration: 500 });

const Calc = () => {
    const [screen, setScreen] = useState('0');
    const [memo, setMemo] = useState(null);
    const [op, setOp] = useState(null);
    const [padHidden, setPadHidden] = useState(true);

    const keyboardRef = React.createRef();
    const padRef = React.createRef();

    const handleNumButton = (num) => {
        if (op === '=') {
            setOp(null);
        }
        if (op && memo === null) {
            if (op !== '=') {
                setMemo(screen);
            }
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
        if (op && op !== '=') {
            const result = calc(memo || 0, screen, op);

            setScreen(`${result}`);
            setMemo(null);
            setOp('=');
        }
    };

    const setOperation = (operation) => {
        if (op && op !== '=' && memo !== null) {
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
        if ('1234567890'.includes(key)) {
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

        const el = document.querySelector(`[data-role="button_${key === ' ' ? 'ac' : key}"]`);

        if (el) {
            animateKeyPress(el);
        }
    };

    const handlePressButton = ({ currentTarget }) => {
        const role = currentTarget.getAttribute('data-role');
        const buttonValue = role.split('button_')[1];
        const key = buttonValue === 'ac' ? ' ' : buttonValue;

        handleKeyPress({ key });
    };

    const onHover = ({ currentTarget }) => {
        const {
            top, left, width, height,
        } = currentTarget.getBoundingClientRect();
        const { top: marginTop, left: marginLeft } = keyboardRef.current.getBoundingClientRect();

        Object.assign(padRef.current.style, {
            top: `${top - marginTop}px`,
            left: `${left - marginLeft}px`,
            width: `${width}px`,
            height: `${height}px`,
        });
        setPadHidden(false);
    };

    useEffect(() => {
        document.body.addEventListener('keypress', handleKeyPress);
        return () => document.body.removeEventListener('keypress', handleKeyPress);
    });

    const onKeyboardLeave = () => setPadHidden(true);

    return (
        <form>
            <div>
                <img src="https://dcmn.com/assets/dcmn-logo-redesign-black.svg" className="DCMN-logo" alt="DCMN logo" />
                <input type="text" value={formatOutput(screen)} readOnly data-role="screen" />
            </div>
            <div className="keyboard" ref={keyboardRef} onMouseLeave={onKeyboardLeave}>
                <div className={cn('pad', { hidden: padHidden })} ref={padRef}>
                    <div />
                </div>
                <div className="numboard">
                    {'123456789'.split('').map(value => (
                        <Button
                            key={`button_${value}`}
                            onClick={handlePressButton}
                            caption={`${value}`}
                            onHover={onHover}
                        />
                    ))}
                </div>
                <div className="opsboard">
                    <Button caption="+" onClick={handlePressButton} onHover={onHover} highlighted={op === '+'} />
                    <Button caption="-" onClick={handlePressButton} onHover={onHover} highlighted={op === '-'} />
                    <Button caption="=" onClick={handlePressButton} onHover={onHover} />
                </div>
                <Button caption="." onClick={handlePressButton} onHover={onHover} />
                <Button caption="0" onClick={handlePressButton} onHover={onHover} />
                <Button caption="AC" onClick={handlePressButton} className="ac" onHover={onHover} />
            </div>
        </form>
    );
};

export default Calc;
