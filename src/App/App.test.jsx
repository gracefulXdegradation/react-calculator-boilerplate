import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import App from './App';

const getScreen = wrapper => wrapper.find('[data-role="screen"]');
const clickButton = (wrapper, button) => wrapper.find(`[data-role="button_${button}"]`).simulate('click');
const pressKey = key => act(() => {
    document.body.dispatchEvent(new KeyboardEvent('keypress', { key }));
});

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

        clickButton(wrapper, '1');
        expect(screen.getDOMNode().value).toEqual('1');
        clickButton(wrapper, '2');
        clickButton(wrapper, '3');
        expect(screen.getDOMNode().value).toEqual('123');
    });

    it('handles decimal numbers input correctly', () => {
        const screen = getScreen(wrapper);

        clickButton(wrapper, '.');
        expect(screen.getDOMNode().value).toEqual('0.');
        clickButton(wrapper, '1');
        clickButton(wrapper, '2');
        clickButton(wrapper, '3');
        expect(screen.getDOMNode().value).toEqual('0.123');
    });

    it('allows max one decimal separator', () => {
        const screen = getScreen(wrapper);

        clickButton(wrapper, '.');
        expect(screen.getDOMNode().value).toEqual('0.');
        clickButton(wrapper, '1');
        clickButton(wrapper, '2');
        clickButton(wrapper, '3');
        clickButton(wrapper, '.');
        clickButton(wrapper, '4');
        expect(screen.getDOMNode().value).toEqual('0.1234');
    });

    it('groups digits in integer part correctly', () => {
        const screen = getScreen(wrapper);

        clickButton(wrapper, '1');
        clickButton(wrapper, '2');
        clickButton(wrapper, '3');
        clickButton(wrapper, '4');
        expect(screen.getDOMNode().value).toEqual('1 234');
        clickButton(wrapper, '5');
        expect(screen.getDOMNode().value).toEqual('12 345');
        clickButton(wrapper, '.');
        clickButton(wrapper, '6');
        clickButton(wrapper, '7');
        clickButton(wrapper, '8');
        clickButton(wrapper, '9');
        expect(screen.getDOMNode().value).toEqual('12 345.6789');
    });

    it('trims trailing zeros correctly', () => {
        const screen = getScreen(wrapper);

        pressKey('.');
        pressKey('1');
        pressKey('+');
        pressKey('1');
        pressKey('.');
        pressKey('9');
        pressKey('=');
        expect(screen.getDOMNode().value).toEqual('2');
    });

    it('handles key press correctly', () => {
        const screen = getScreen(wrapper);

        pressKey('1');
        pressKey('+');
        pressKey('1');
        pressKey('.');
        pressKey('9');
        pressKey('=');
        expect(screen.getDOMNode().value).toEqual('2.9');
    });
});
