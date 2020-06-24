import React from 'react';
import PropTypes from 'prop-types'
import { useRouteMatch } from 'react-router-dom'
import './styles.css'
import {OverlayTrigger, Tooltip} from 'react-bootstrap'
const STYLES = [
    "btns-primary",
    "btns-cancel",
    "btns-icon"
]

const SIZES= ["btns-medium", "btns-large"]


export const ButtonField = ({buttonStyle,buttonSize,type, children, etc, onClick }) => {


    const {path, url} = useRouteMatch()

    const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle: STYLES[0];
    const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize: SIZES[0];
    return ( 
        <button 
            {...etc}
            className={`btns ${checkButtonStyle} ${checkButtonSize}`}
            onClick={onClick} 
            type={type || 'button'}
        >
            {children}
        </button>
    );
}
export const ButtonIconField = ({buttonStyle,buttonSize,tips, children, style, onClick })=> {
    const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle: STYLES[0];
    const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize: SIZES[0];


    return (
        <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 300 }}
            overlay={
                <Tooltip>
                    {tips}
                </Tooltip>
            }
        >
            <button
                style={style}
                className={`w3-card ${checkButtonStyle} ${checkButtonSize}`}
                type='button'
                onClick={onClick}
            >
                {children}
            </button>
        </OverlayTrigger>
    )
}
 