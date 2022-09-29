import React from "react";

function Icon({ handleClick, readyToSend }) {
    return (
        <svg
            style={readyToSend ? { width: '24px', height: '24px', fill: 'var(--primary-color)' } : { width: '24px', height: '24px', fill: '#ccc' }}
            onClick={handleClick}
            xmlns="http://www.w3.org/2000/svg"
            className="chat-icon"
            viewBox="0 0 24 24"
        >
            <path d="M4 14.497v3.724L18.409 12 4 5.779v3.718l10 2.5-10 2.5zM2.698 3.038l18.63 8.044a1 1 0 010 1.836l-18.63 8.044a.5.5 0 01-.698-.46V3.498a.5.5 0 01.698-.459z"></path>
        </svg>
    );
}

export default Icon;
