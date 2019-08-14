import React from 'react';
import { shallow } from 'enzyme';

import App from './App';

describe('App', () => {
    let consoleSpy;

    beforeAll(() => {
        consoleSpy = jest.spyOn(console, 'error');
    });

    it('renders the App component and matches snapshot', () => {
        const component = shallow(<App />);

        expect(component).toMatchSnapshot();
    });

    it('renders logo', () => {
        const component = shallow(<App />);

        expect(component.find('img')).toHaveLength(1);
    });

    it('shows no errors on console', () => {
        expect(consoleSpy).not.toHaveBeenCalled();
    });
});
