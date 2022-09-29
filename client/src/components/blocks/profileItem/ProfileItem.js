import './ProfileItem.css'
import { useContext } from 'react';
import { Link } from 'react-router-dom'

import { ProfileContext } from '../profilePopup/Profile'
var classNames = require('classnames');

function ProfileItem({ icon, data, descendant, to, seperator, popupHeading, tippyInstance }) {
    const popupList = useContext(ProfileContext).popupList;
    const setPopupList = useContext(ProfileContext).setPopupList;

    const handleClick = () => {
        if (descendant) {
            setPopupList([...popupList, descendant])
        } else if (popupHeading) {
            popupList.splice(popupList.length - 1, 1)
            var newPopupList = [...popupList]
            setPopupList(newPopupList)

        } else {
            tippyInstance.hide();
        }
    }
    return (
        <div className={
            classNames({
                'profile-item': true,
                'seperate': seperator,
                'popup-heading': popupHeading
            })
        }
            onClick={handleClick}
        >
            <Link to={to ? to : ''} className="profile-wrapper" >
                <div className="popup-icon">{icon && icon}</div>
                <p className="profile-title">{data}</p>
            </Link>
        </div>
    );
}

export default ProfileItem; 