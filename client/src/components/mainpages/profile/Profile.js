import './Profile.css';
import { useRef, useState, useContext, useEffect, useCallback } from 'react';
import HeadlessTippy from '@tippyjs/react/headless';
import axios from 'axios';
import { toast } from 'react-toastify';

import { GlobalState } from '../../../GlobalState';
import Loading from '../utils/loading/generic/Loading'
import { DownIcon, UpIcon } from '../../../assets';
import { ProfilePopupWrapper, ProfilePopupItem } from './dropdown'
import getDateofbirthArr, { getMonthFromString } from '../utils/profile/GetDateofBirthArray'

function Profile() {
    console.log('re-render')
    const state = useContext(GlobalState);
    const [processing, setProcessing] = state.processing;
    const [token] = state.token;
    const [userProfile, setUserProfile] = state.userAPI.userProfile;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [day, setDay] = useState(1);
    const [month, setMonth] = useState('January');
    const [year, setYear] = useState(new Date().getFullYear());
    const dateofbirthStateArr = [
        { value: day, setValue: setDay },
        { value: month, setValue: setMonth },
        { value: year, setValue: setYear }
    ];
    const dateofbirthArr = getDateofbirthArr();

    let tippyInstance = null;
    let tippyRef = null;

    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState(userProfile.images);

    const fileInputRef = useRef(null);
    const maxSizeMb = 1;
    const initData = useCallback((profileData) => {
        setName(profileData.name);
        setEmail(profileData.email);
        if (profileData.phone) {
            console.log('co phone')
            setPhone(profileData.phone);
        }
        if (profileData.gender) {
            setGender(profileData.gender);
        }
        if (profileData.images) {
            setImages(profileData.images);
        }
        const genderValues = document.querySelectorAll('.form-radio-content');
        for (let genderValue of genderValues) {
            if (genderValue.getAttribute('value') === profileData.gender) {
                genderElementChecked = genderValue.closest('.form-radio-item')
                genderElementChecked.classList.add('checked')
            }
        }
        if (profileData.dateOfBirth) {
            const DofBArr = profileData.dateOfBirth.split('/');
            setDay(DofBArr[0]);
            setMonth(getMonthFromString(DofBArr[1]));
            setYear(DofBArr[2]);
        }
    }, [])

    useEffect(() => {
        console.log('useEffect')
        if (userProfile) {
            console.log('user profile: ' + (userProfile === {}))
            const getUserProfile = async () => {
                initData(userProfile);
            }
            getUserProfile();
        }
    }, [token, userProfile, initData])




    const handleNameChange = (e) => {
        setName(e.target.value);
    }

    const handleUpload = async (e) => {
        e.preventDefault();
        if (images) {
            handleDestroyAvatar();
        }
        try {
            const file = e.target.files[0];
            if (file.size > maxSizeMb * 1024 * 1024) {
                alert('Your file is exceed ' + maxSizeMb + 'Mb')
            }
            let formData = new FormData();
            formData.append('file', file);
            setLoading(true);
            const res = await axios.post('/api/userUploadAvatar', formData, {
                headers: { 'content-type': 'multipart/form-data', Authorization: token }
            })
            setLoading(false)
            console.log(res.data)
            setImages(res.data)
        } catch (err) {

        }
    }

    const handleDestroyAvatar = async () => {
        setLoading(true)
        await axios.post('/api/userDestroyAvatar', { public_id: images.public_id }, {
            headers: { Authorization: token }
        })
        setLoading(false)
        setImages(false)
    }

    let genderElementChecked = document.querySelector('.form-radio-item.checked');
    let dateofbirthElementSelected = null;
    let dateofbirthSeleting = false;
    const dateofbirthRefs = [useRef(null), useRef(null), useRef(null)];

    const handleGenderChoose = async (e) => {
        if (!genderElementChecked) {
            genderElementChecked = e.target.closest('.form-radio-item')
            genderElementChecked.classList.add('checked');

        } else {
            genderElementChecked.classList.remove('checked');
            genderElementChecked = e.target.closest('.form-radio-item');
            genderElementChecked.classList.add('checked');
        }
        e.target.closest('.form-item').querySelector('.errMsg').innerHTML = ''
        setGender(genderElementChecked.querySelector('.form-radio-content').getAttribute('value'));
    }

    const handleDateofbirthChoose = (value, setValue) => {
        setValue(value);
        closeDropdown(tippyInstance, tippyRef);
    }

    const handleDropdownClick = (e, ref) => {
        if (!dateofbirthElementSelected) {
            dateofbirthSeleting = true;
            dateofbirthElementSelected = e.target.closest('.drop-down-item');
            dateofbirthElementSelected.classList.add('selected');

        } else {
            if (e.target.closest('.drop-down-item') === dateofbirthElementSelected) {
                dateofbirthSeleting = false;
            }
            dateofbirthElementSelected.classList.remove('selected');
            dateofbirthElementSelected = e.target.closest('.drop-down-item');;
            dateofbirthElementSelected.classList.add('selected');
        }
        dateofbirthElementSelected.classList.toggle('arrow-down')

    }

    /**
     * close date of birth drop down
     * @param {*} instance: tippy instance
     * @param {*} reference: tippy reference 
     */
    const closeDropdown = (instance, reference) => {
        instance.hide();
        dateofbirthElementSelected.classList.remove('selected');
        dateofbirthSeleting = false;
        reference.current.classList.add('arrow-down');
    }

    const addClickOutsideListener = (ref) => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target) && !dateofbirthSeleting) {
                dateofbirthElementSelected.classList.remove('selected');
                document.removeEventListener("mousedown", handleClickOutside);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
    }

    // valid form before submit
    const validate = (formSelector) => {
        const formElement = document.querySelector(formSelector);
        let isValid = true;
        let formItems = formElement.querySelectorAll('.form-item[data]');
        for (let formItem of formItems) {
            if (!formItem.getAttribute('data')) {
                formItem.querySelector('.errMsg').innerHTML = 'This field is required.'
                isValid = false;
            };
        }

        if (!images) isValid = false;
        return isValid;
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const isValid = validate('.profile-container');
            if (!isValid) {
                toast.error('Invalid form')
            } else {
                console.log('submitted')
                let formData = new FormData();
                formData.append('name', name);
                formData.append('email', email);
                if (phone) {
                    console.log('phone la: ' + phone)
                    formData.append('phone', phone);
                }
                formData.append('gender', gender);
                formData.append('dateOfBirth', `${day}/${getMonthFromString(month)}/${year}`);
                formData.append('imagesId', images.public_id);
                formData.append('imagesUrl', images.url);

                setProcessing(true);
                await axios.post('user/updateProfile', formData, {
                    headers: { 'content-type': 'multipart/form-data', Authorization: token }
                })
                setProcessing(false);
                toast.success('Changes Saved!');
                // window.location.reload();
            }
        } catch (err) {
            console.log(err)
            // toast.error(err.data)
        }
    }
    return (
        <div className="profile-container">
            <div className="profile-header">
                <h3 style={{ fontWeight: '400', fontSize: '1.25rem', marginBottom: '8px' }}>Hồ sơ của tôi</h3>
                <p>Quản lí thông tin hồ sơ để bảo mật tài khoản</p>
            </div>
            <div className="profile-body">
                <div className="profile-left">
                    <form action="">
                        <div className="form-item" data={name}>
                            <div className="form-item-label">
                                Name
                            </div>
                            <div className="form-item-data">
                                <input
                                    className="form-item-data-input"
                                    value={name}
                                    onChange={handleNameChange}
                                >
                                </input>
                                <div className='errMsg'></div>
                            </div>
                        </div>

                        <div className="form-item">
                            <div className="form-item-label">
                                Email
                            </div>
                            <div className="form-item-data">
                                <div className="form-item-data-fix">
                                    {email}
                                    <a href="" className="form-item-change">Thay đổi</a>
                                </div>
                            </div>

                        </div>
                        <div className="form-item">
                            <div className="form-item-label">
                                Phone Number
                            </div>
                            <div className="form-item-data">
                                <div className="form-item-data-fix">
                                    {console.log('phone: ' + phone)}
                                    {phone ? <a href="#" className="form-item-change">Thay đổi</a>
                                        : <a href="#" className='form-item-change' style={{ marginLeft: 0 }}>Thêm</a>
                                    }
                                </div>
                            </div>

                        </div>
                        <div className="form-item" data={gender ? gender : ''}>
                            <div className="form-item-label">
                                Gioi tinh
                            </div>
                            <div className="form-item-data">
                                <div className="form-item-radio-group">
                                    <div className="form-radio-item" onClick={(e) => handleGenderChoose(e)}>
                                        <div className="form-radio-item-btn">
                                            <div className="form-radio-item-outer">
                                                <div className="form-radio-item-inner">

                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-radio-content" value={'Nam'}>
                                            Nam
                                        </div>
                                    </div>
                                    <div className="form-radio-item" onClick={(e) => handleGenderChoose(e)}>
                                        <div className="form-radio-item-btn">
                                            <div className="form-radio-item-outer">
                                                <div className="form-radio-item-inner">

                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-radio-content" value={'Nữ'}>
                                            Nữ
                                        </div>
                                    </div>
                                    <div className="form-radio-item" onClick={(e) => handleGenderChoose(e)}>
                                        <div className="form-radio-item-btn">
                                            <div className="form-radio-item-outer">
                                                <div className="form-radio-item-inner">

                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-radio-content" value={'Khác'}>
                                            Khác
                                        </div>
                                    </div>

                                </div>
                                <div className='errMsg'></div>

                            </div>


                        </div>
                        <div className="form-item">
                            <div className="form-item-label">
                                Date of Birth
                            </div>
                            <div className="form-item-data">
                                <div className="drop-down-group">
                                    {dateofbirthStateArr.map((state, index) => (
                                        <HeadlessTippy
                                            key={index}
                                            trigger={'click'}
                                            onClickOutside={(instance, event) => {
                                                closeDropdown(instance, tippyRef);
                                            }}
                                            onTrigger={(instance, event) => {
                                                tippyInstance = instance;
                                                tippyRef = dateofbirthRefs[index];
                                            }}
                                            offset={[0, 0]}
                                            placement={'top-start'}
                                            interactive={true}
                                            render={(attrs, instance) => (
                                                <ProfilePopupWrapper width={dateofbirthRefs[index].current.offsetWidth}>
                                                    {dateofbirthArr[index].map((item, index) => (
                                                        <ProfilePopupItem
                                                            key={index}
                                                            handleClick={handleDateofbirthChoose}
                                                            value={item}
                                                            setValue={state.setValue}
                                                        >
                                                            {item}
                                                        </ProfilePopupItem>
                                                    ))}
                                                </ProfilePopupWrapper>
                                            )}

                                        >
                                            <div
                                                className="drop-down-item arrow-down"
                                                ref={dateofbirthRefs[index]}
                                                onClick={(e) => {
                                                    handleDropdownClick(e)
                                                    addClickOutsideListener(dateofbirthRefs[index]);
                                                }}
                                            >
                                                <div className="drop-down-content">
                                                    <span>{state.value}</span>
                                                    <DownIcon className="arrow-icon arrow-icon-down" />
                                                    <UpIcon className="arrow-icon arrow-icon-up" />
                                                </div>
                                            </div>
                                        </HeadlessTippy>
                                    ))}
                                </div>

                            </div>

                        </div>
                        <div className="form-item">
                            <div className="form-item-label">
                            </div>
                            <div className="form-item-data">
                                <button className="profile-save-changes" onClick={(e) => handleSubmit(e)}>Save Changes</button>
                            </div>

                        </div>
                    </form>
                </div>
                <div className="profile-right">
                    <div className="profile-right-content">
                        <div className="profile-avt">
                            <div className="profile-img-wrapper">
                                {
                                    loading ? <Loading /> : <img className="profile-img" src={images ? images.url : 'https://www.eduvidya.com/admin/Upload/Schools/637546977339653925_no%20image.png'} alt="avatar"></img>
                                }
                            </div>
                        </div>
                        <input
                            type="file"
                            className="profile-default-choose"
                            accept=".jpg,.jpeg,.png"
                            onChange={handleUpload}
                            ref={fileInputRef}
                        />
                        <button
                            className="profile-btn-choose-img"
                            onClick={() => {
                                fileInputRef.current.click()
                            }}
                        >
                            Chọn ảnh
                        </button>
                        <div className="profile-img-require">
                            <div className="profile-img-require-item">
                                Dung lượng file tối đa 1 MB
                            </div>
                            <div className="profile-img-require-item">
                                Định dạng: .JPEG, .PNG
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default Profile;