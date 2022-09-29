import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

function UserAPI(token) {
    const [isLogged, setIsLogged] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [cart, setCart] = useState([])
    const [history, setHistory] = useState([])
    const [userProfile, setUserProfile] = useState([])


    // get user data to render header
    useEffect(() => {
        if (token) {
            const getUser = async () => {
                try {
                    const res = await axios.get('/user/infor', {
                        headers: { Authorization: token }
                    })
                    setIsLogged(true)
                    console.log("set is log")
                    setUserProfile(res.data);
                    console.log("set user profile")
                    res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false)
                    console.log("set is admin")
                    setCart(res.data.cart)
                    console.log("set cart")
                } catch (err) {
                    toast.error(err.response.data.msg);
                }
            }

            getUser()

        }
    }, [token])



    const addCart = async (product) => {
        if (!isLogged) return toast.warning("Please login to continue buying");
        const check = cart.every(item => {
            return item._id !== product._id
        })

        if (check) {
            setCart([...cart, { ...product, quantity: 1 }])
            console.log("set cart")
            await axios.patch('/user/addcart', { cart: [...cart, { ...product, quantity: 1 }] }, {
                headers: { Authorization: token }
            })
            toast.success('Added to cart.')
            return true;
        } else {
            toast.warning('Already added to cart.')
        }
    }

    return {
        isLogged: [isLogged, setIsLogged],
        isAdmin: [isAdmin, setIsAdmin],
        userProfile: [userProfile, setUserProfile],
        cart: [cart, setCart],
        addCart: addCart,
        history: [history, setHistory]
    }
}

export default UserAPI
