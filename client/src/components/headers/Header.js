import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'



import { GlobalState } from '../../GlobalState'
import Cart from './icon/cart.svg'
import Profile from '../blocks/profilePopup/Profile';

import './header.css'

function Header() {
    const state = useContext(GlobalState)
    const [isLogged] = state.userAPI.isLogged
    const [isAdmin] = state.userAPI.isAdmin
    const [cart] = state.userAPI.cart
    const [menu, setMenu] = useState(false)

    const logoutUser = async () => {
        await axios.get('/user/logout')


        localStorage.removeItem('firstLogin')

        window.location.href = "/";
    }

    const adminRouter = () => {
        return (
            <>

                <li><Link to="/create_product">Create Product</Link></li>
                <li><Link to="/category">Categories</Link></li>
            </>
        )
    }

    const loggedRouter = () => {
        return (
            <>
                <li><Link to="/history">History</Link></li>
                <li><Link to="/" onClick={logoutUser}>Logout</Link></li>
                <Profile />
            </>
        )
    }


    const styleMenu = {
        left: menu ? 0 : "-100%"
    }


    return (
        <header>


            <div className="logo">
                <h1>
                    <Link to="/">
                        <img src="https://cdn-icons-png.flaticon.com/128/1087/1087434.png" alt="logo" className="admin-icon"></img>
                    </Link>
                </h1>

                <Link to="/" className='logo-name'>Ladies beauty</Link>
                <span>{isAdmin ? 'shhh you are admmin' : ''}</span>
            </div>

            <ul style={styleMenu} className="menu-action">
                <li><Link to="/">{isAdmin ? 'Products' : 'Shop'}</Link></li>

                {isAdmin && adminRouter()}

                {
                    isLogged ? loggedRouter() : <li><Link to="/login">Login ✥ Register</Link></li>
                }



            </ul>

            {
                isAdmin ? ''
                    : <div className="cart-icon">
                        <span>{cart.length}</span>
                        <Link to="/cart">
                            <img src={Cart} alt="" width="30" />
                        </Link>
                    </div>
            }

        </header>
    )
}

export default Header
