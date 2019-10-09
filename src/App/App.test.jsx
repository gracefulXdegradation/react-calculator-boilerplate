import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import App from './App';

const getScreen = wrapper => wrapper.find('[data-role="screen"]');
const clickButton = (button, wrapper) => wrapper.find(`[data-role="button_${button}"]`).simulate('click');
const pressKey = key => act(() => {
    document.body.dispatchEvent(new KeyboardEvent('keypress', { key }));
});
const pressKeys = keys => keys.split('').forEach(key => pressKey(key));
const clickButtons = (buttons, wrapper) => buttons.split('').forEach(button => clickButton(button, wrapper));

describe('App', () => {
    let consoleSpy;
    let wrapper;

    beforeEach(() => {
        wrapper = mount(<App />);
    });

    beforeAll(() => {
        consoleSpy = jest.spyOn(console, 'error');
    });

    it('renders the App component and matches snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('renders logo', () => {
        expect(wrapper.find('img')).toHaveLength(1);
    });

    it('shows no errors on console', () => {
        expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('shows 0 as init value', () => {
        const screen = getScreen(wrapper);

        expect(screen).toHaveLength(1);
        expect(screen.props().value).toEqual('0');
    });

    it('handles number clicks correctly', () => {
        const screen = getScreen(wrapper);

        clickButtons('123', wrapper);
        expect(screen.getDOMNode().value).toEqual('123');
    });

    it('handles decimal numbers input correctly', () => {
        const screen = getScreen(wrapper);

        clickButtons('0.002300', wrapper);
        expect(screen.getDOMNode().value).toEqual('0.002300');
    });

    it('allows max one decimal separator', () => {
        const screen = getScreen(wrapper);

        clickButton('.', wrapper);
        expect(screen.getDOMNode().value).toEqual('0.');
        clickButtons('123.4', wrapper);
        expect(screen.getDOMNode().value).toEqual('0.1234');
    });

    it('groups digits in integer part correctly', () => {
        const screen = getScreen(wrapper);

        clickButtons('1234', wrapper);
        expect(screen.getDOMNode().value).toEqual('1 234');
        clickButton('5', wrapper);
        expect(screen.getDOMNode().value).toEqual('12 345');
        clickButtons('.6789', wrapper);
        expect(screen.getDOMNode().value).toEqual('12 345.6789');
    });

    it('trims trailing zeros correctly: int', () => {
        const screen = getScreen(wrapper);

        clickButtons('.1+1.9=', wrapper);
        expect(screen.getDOMNode().value).toEqual('2');
    });

    it('trims trailing zeros correctly: float', () => {
        const screen = getScreen(wrapper);

        clickButtons('.002+1.898=', wrapper);
        expect(screen.getDOMNode().value).toEqual('1.9');
    });

    it('handles key press correctly', () => {
        const screen = getScreen(wrapper);

        pressKeys('1+1.9=');
        expect(screen.getDOMNode().value).toEqual('2.9');
    });
});
