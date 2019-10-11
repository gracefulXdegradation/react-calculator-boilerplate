import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import './button.scss';

const Button = ({
    caption,
    onClick,
    highlighted,
    className,
    onHover,
}) => (
    <button
        type="button"
        data-role={`button_${caption.toLowerCase()}`}
        onClick={onClick}
        className={cn(className, { highlighted })}
        onMouseEnter={onHover}
    >
        <span>{caption}</span>
    </button>
);

Button.propTypes = {
    caption: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    highlighted: PropTypes.bool,
    className: PropTypes.string,
    onHover: PropTypes.func,
};

Button.defaultProps = {
    highlighted: false,
    className: '',
    onHover: () => {},
};

export default Button;
