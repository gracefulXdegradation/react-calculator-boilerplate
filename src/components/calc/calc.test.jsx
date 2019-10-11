import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import Calc from './index';

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
        wrapper = mount(<Calc />);
    });

    beforeAll(() => {
        consoleSpy = jest.spyOn(console, 'error');
    });

    it('renders the Calc component and matches snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    // it('renders logo', () => {
    //     expect(wrapper.find('img')).toHaveLength(1);
    // });

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

    it('limits number of digits in the input', () => {
        const screen = getScreen(wrapper);

        clickButtons('123456.78901234567890', wrapper);
        expect(screen.getDOMNode().value).toEqual('123 456.789');
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

    it('starts new input after operation button click', () => {
        const screen = getScreen(wrapper);

        clickButtons('1234+.5678', wrapper);
        expect(screen.getDOMNode().value).toEqual('0.5678');
        clickButtons('=45.6', wrapper);
        expect(screen.getDOMNode().value).toEqual('45.6');
    });

    it('adds correctly', () => {
        const screen = getScreen(wrapper);

        clickButtons('123.4+567.8=', wrapper);
        expect(screen.getDOMNode().value).toEqual('691.2');
    });

    it('subtracts correctly', () => {
        const screen = getScreen(wrapper);

        clickButtons('123.4-567.8=', wrapper);
        expect(screen.getDOMNode().value).toEqual('-444.4');
    });

    it('chains operations correctly', () => {
        const screen = getScreen(wrapper);

        clickButtons('666-999+777+13-69=', wrapper);
        expect(screen.getDOMNode().value).toEqual('388');
        clickButtons('+112=', wrapper);
        expect(screen.getDOMNode().value).toEqual('500');
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

        pressKeys('123.4+56.7-89.0=');
        expect(screen.getDOMNode().value).toEqual('91.1');
    });
});
