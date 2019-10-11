import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const Button = ({
    caption,
    onClick,
    highlighted,
    className,
}) => (
    <button
        type="button"
        data-role={`button_${caption.toLowerCase()}`}
        onClick={onClick}
        className={cn(className, { highlighted })}
    >
        <span>{caption}</span>
    </button>
);

Button.propTypes = {
    caption: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    highlighted: PropTypes.bool,
    className: PropTypes.string,
};

Button.defaultProps = {
    highlighted: false,
    className: '',
};

export default Button;
