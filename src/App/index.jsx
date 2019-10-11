import React from 'react';
import Calc from '../components/calc';
import './app.scss';

const App = () => (
    <div className="app">
        {/* <div className="DCMN-logo">
            <img src="https://dcmn.com/assets/dcmn-logo-redesign-black.svg" alt="DCMN logo" />
        </div> */}
        <Calc />
    </div>
);

export default App;
