import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'


import { ResendIcon } from '../../../assets'

function Register() {
    const [user, setUser] = useState({
        name: '', email: '', password: ''
    })
    const [otp, setOtp] = useState('')
    const reg = /([a-zA-Z0-9]+)([\.{1}])?([a-zA-Z0-9]+)\@gmail([\.])com/g;
    const onChangeInput = e => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value })
    }

    const onChangeOtp = e => {
        setOtp(e.target.value)
    }

    const sendOtp = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/user/sendOtp', { email: user.email })
            showVerifyOtp();
            console.log('showed')
        } catch (err) {
            toast.error(err.response.data.msg);
        }
    }

    const showVerifyOtp = () => {
        document.querySelector('.register-form').style.display = 'none';
        document.querySelector('.otp-verify-form').style.display = 'block';
    }

    const verifyOTP = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('/user/register', { otp: otp, ...user })
            localStorage.setItem('firstLogin', true)


            window.location.href = "/";
        } catch (err) {
            toast.error(err.response.data.msg);
        }
    }
    return (
        <div className="login-page">
            <form onSubmit={sendOtp} className="register-form">
                <h2>Register</h2>
                <input type="text" name="name" required
                    placeholder="Name" value={user.name} onChange={onChangeInput} />

                <input type="email" name="email" required
                    placeholder="Email" value={user.email}
                    onChange={onChangeInput}
                />

                <input type="password" name="password" required autoComplete="on"
                    placeholder="Password" value={user.password} onChange={onChangeInput} />
                <div className="row">
                    <button type="submit">Register</button>
                    <Link to="/login">Login</Link>
                </div>
            </form>
            <form onSubmit={verifyOTP} className="otp-verify-form">
                <h3 style={{ lineHeight: '36px' }}>An OTP has been sent to your email</h3>
                <p>Please enter the OTP to verify your acount!</p>
                <div className="otp-verify">
                    <input type="text" name="otp" value={otp} required onChange={onChangeOtp}
                        placeholder="OTP"
                    />
                    <div className="otp-resend" onClick={(e) => {
                        setOtp('');
                        sendOtp(e);
                    }}>
                        <ResendIcon />
                    </div>
                </div>
                <div className="row">
                    <button type="submit">Proceed</button>
                </div>
            </form>
        </div>

    )
}

export default Register