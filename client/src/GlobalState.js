import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import { io } from "socket.io-client";


import ProductsAPI from './api/ProductsAPI'
import UserAPI from './api/UserAPI'
import CategoriesAPI from './api/CategoriesAPI'
import Processing from './components/mainpages/utils/loading/generic/Processing'

export const GlobalState = createContext()
export const DataProvider = ({ children }) => {

    const [token, setToken] = useState(false)
    const [processing, setProcessing] = useState(false);
    const [socket, setSocket] = useState(null);

    count = count + 1;

    useEffect(() => {
        const firstLogin = localStorage.getItem('firstLogin')
        // first login -> call api to get access token
        if (firstLogin) {
            console.log('inside first login')
            const refreshToken = async () => {
                const res = await axios.get('/user/refresh_token')

                setToken(res.data.accesstoken)
                console.log("set token")

                setTimeout(() => {
                    refreshToken()
                }, 10 * 60 * 1000)
            }
            refreshToken()
        }

        //socket.io
        let socketInstance = io('http://localhost:3000/');
        setSocket(socketInstance);
        if (socket) {
            socket.on('connect', () => {
                console.log(socket.id)
            })
        }
        return () => {
            socket.close()
        }
    }, [])



    const state = {
        token: [token, setToken],
        socket: [socket, setSocket],
        processing: [processing, setProcessing],
        productsAPI: ProductsAPI(),
        userAPI: UserAPI(token),
        categoriesAPI: CategoriesAPI()
    }

    return (
        <GlobalState.Provider value={state} isLogged={state.userAPI.isLogged}>
            {processing ? <Processing /> : children}
        </GlobalState.Provider>
    )
}

let count = 0;