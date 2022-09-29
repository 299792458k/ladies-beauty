import React from "react";
import './ArrowIcon.css'

function DownIcon({ className, clickHandler }) {
    return (
        <svg
            className={className}
            onClick={clickHandler}
            viewBox="0 0 11 11"
        >
            <path d="M11 2.5c0 .1 0 .2-.1.3l-5 6c-.1.1-.3.2-.4.2s-.3-.1-.4-.2l-5-6c-.2-.2-.1-.5.1-.7s.5-.1.7.1l4.6 5.5 4.6-5.5c.2-.2.5-.2.7-.1.1.1.2.3.2.4z"></path>
        </svg>
    );
}

function UpIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 11 11">
            <path d="M11 8.5c0-.1 0-.2-.1-.3l-5-6c-.1-.1-.3-.2-.4-.2s-.3.1-.4.2l-5 6c-.2.2-.1.5.1.7s.5.1.7-.1l4.6-5.5 4.6 5.5c.2.2.5.2.7.1.1-.1.2-.3.2-.4z"></path>
        </svg>
    );
}

export { DownIcon, UpIcon };