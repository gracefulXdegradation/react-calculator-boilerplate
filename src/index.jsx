import React from 'react';
import { render } from 'react-dom';
import Calc from './components/calc';
import './index.scss';

render(
    <div className="app">
        <Calc />
    </div>,
    document.getElementById('root'),
);
