import React, { useState, createContext, useContext } from 'react'
import { Link } from 'react-router-dom';
import HeadlessTippy from '@tippyjs/react/headless'

import { GlobalState } from '../../../GlobalState';
import PopperWrapper from '../popperWrapper/PopperWrapper'
import ProfileItem from '../profileItem/ProfileItem'
import { UserIcon, LanguageIcon, LogoutIcon, BackIcon } from '../../../assets'

export const ProfileContext = createContext()
const profilePopup = [
    {
        icon: UserIcon,
        data: 'View profile',
        children: null,
        to: '/profile',
        seperator: false
    },
    {
        icon: LanguageIcon,
        data: 'English',
        children: [
            {
                icon: BackIcon,
                data: 'Language',
                popupHeading: true
            },
            {
                data: 'English',
                abbr: 'en'
            },
            {
                data: 'Viet Nam',
                abbr: 'vn',
                children: [
                    {
                        icon: BackIcon,
                        data: 'poper2',
                        popupHeading: true
                    },
                    {
                        data: 'data',
                        abbr: 'en',
                    },
                ]
            }
        ]
        ,
        seperator: false
    }, {
        icon: LogoutIcon,
        data: 'Log out',
        children: null,
        seperator: true
    },
]
function Profile() {
    const state = useContext(GlobalState)
    const [userProfile] = state.userAPI.userProfile;
    const images = userProfile.images;
    const [popupList, setPopupList] = useState([profilePopup]);
    const profileState = { popupList, setPopupList };
    // let tippyInstance = null;
    const [tippyInstance, setTippyInstance] = useState('');
    var currentPopup = popupList[popupList.length - 1];

    return (
        <HeadlessTippy
            delay={[0, 100]}
            interactive="true"
            placement='bottom-start'
            onHide={() => { setPopupList([profilePopup]) }}
            offset={[-160, 0]}
            onTrigger={(instance) => {
                setTippyInstance(instance);
            }}
            render={(attrs) => (
                <PopperWrapper>
                    {currentPopup.map((item, index) => (
                        <ProfileContext.Provider value={profileState} key={index}>
                            <ProfileItem
                                icon={item.icon}
                                data={item.data}
                                seperator={item.seperator}
                                descendant={item.children}
                                popupHeading={item.popupHeading}
                                to={item.to}
                                {...attrs}
                                tippyInstance={tippyInstance}
                            >
                            </ProfileItem>
                        </ProfileContext.Provider>
                    ))}
                </PopperWrapper>
            )}
        >
            <Link className="profile" to="profile">
                <img className="profile-img" src={images ? images.url : "https://www.eduvidya.com/admin/Upload/Schools/637546977339653925_no%20image.png"} alt="profile" />
            </Link>
        </HeadlessTippy>
    );
}

export default Profile;